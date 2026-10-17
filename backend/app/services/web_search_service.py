import re
import html
from typing import List, Optional, Tuple
from urllib.parse import urlparse, parse_qs, unquote
import httpx
from app.core.config import settings
from app.models.schemas import WebSearchCitation

COMMON_HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
    "Accept-Language": "en-US,en;q=0.7,hi;q=0.3"
}

def clean_html_text(raw_html: str) -> str:
    """Strips HTML tags, scripts, stylesheets, and normalizes whitespace."""
    if not raw_html:
        return ""
    text = re.sub(r'<script.*?</script>', ' ', raw_html, flags=re.DOTALL | re.IGNORECASE)
    text = re.sub(r'<style.*?</style>', ' ', text, flags=re.DOTALL | re.IGNORECASE)
    text = re.sub(r'<[^>]+>', ' ', text)
    text = html.unescape(text)
    text = re.sub(r'\s+', ' ', text).strip()
    return text

def extract_domain(url: str) -> str:
    """Extracts human-readable domain name from URL."""
    try:
        parsed = urlparse(url)
        domain = parsed.netloc.lower()
        if domain.startswith("www."):
            domain = domain[4:]
        return domain
    except Exception:
        return "web-source"

async def fetch_page_content(url: str, max_chars: int = 2200) -> Optional[str]:
    """Fetches real HTML page and extracts text content for grounding."""
    # Only fetch http/https
    if not url.startswith("http://") and not url.startswith("https://"):
        return None
    try:
        async with httpx.AsyncClient(timeout=4.5, follow_redirects=True) as client:
            resp = await client.get(url, headers=COMMON_HEADERS)
            if resp.status_code == 200:
                raw_text = clean_html_text(resp.text)
                if len(raw_text) > max_chars:
                    return raw_text[:max_chars] + "..."
                return raw_text
    except Exception as e:
        # Silently fail page content extraction on network restrictions
        pass
    return None

async def search_tavily(query: str, max_results: int = 5) -> List[WebSearchCitation]:
    """Searches Tavily API if TAVILY_API_KEY is configured."""
    citations: List[WebSearchCitation] = []
    if not settings.TAVILY_API_KEY:
        return citations

    try:
        async with httpx.AsyncClient(timeout=8.0) as client:
            resp = await client.post(
                "https://api.tavily.com/search",
                json={
                    "api_key": settings.TAVILY_API_KEY,
                    "query": query,
                    "search_depth": "advanced",
                    "include_answer": True,
                    "max_results": max_results
                }
            )
            if resp.status_code == 200:
                data = resp.json()
                for r in data.get("results", []):
                    u = r.get("url", "")
                    content = r.get("content", "")
                    title = r.get("title", "Market Update")
                    citations.append(
                        WebSearchCitation(
                            title=title,
                            url=u,
                            snippet=content[:280],
                            source_name=f"Tavily / {extract_domain(u)}",
                            published_date=r.get("published_date"),
                            extracted_content=content[:1200]
                        )
                    )
    except Exception as e:
        print(f"[WebSearch] Tavily API error: {e}")
    return citations

async def search_brave(query: str, max_results: int = 5) -> List[WebSearchCitation]:
    """Searches Brave Search API if BRAVE_API_KEY is configured."""
    citations: List[WebSearchCitation] = []
    if not settings.BRAVE_API_KEY:
        return citations

    try:
        async with httpx.AsyncClient(timeout=7.0) as client:
            resp = await client.get(
                "https://api.search.brave.com/res/v1/web/search",
                headers={
                    "Accept": "application/json",
                    "X-Subscription-Token": settings.BRAVE_API_KEY
                },
                params={"q": query, "count": max_results}
            )
            if resp.status_code == 200:
                data = resp.json()
                web_results = data.get("web", {}).get("results", [])
                for r in web_results:
                    u = r.get("url", "")
                    title = r.get("title", "")
                    desc = r.get("description", "")
                    citations.append(
                        WebSearchCitation(
                            title=title,
                            url=u,
                            snippet=desc,
                            source_name=f"Brave / {extract_domain(u)}",
                            published_date=r.get("age"),
                            extracted_content=desc
                        )
                    )
    except Exception as e:
        print(f"[WebSearch] Brave API error: {e}")
    return citations

async def search_direct_web(query: str, max_results: int = 5) -> List[WebSearchCitation]:
    """Resilient live web search engine (DuckDuckGo HTML parser) requiring no API key."""
    citations: List[WebSearchCitation] = []
    try:
        async with httpx.AsyncClient(timeout=7.0, follow_redirects=True) as client:
            resp = await client.post(
                "https://html.duckduckgo.com/html/",
                data={"q": query},
                headers=COMMON_HEADERS
            )
            if resp.status_code == 200:
                # Find all result elements
                # 1. Match snippet links and text
                raw_snippets = re.findall(
                    r'<a class="result__snippet[^"]*"[^>]*href="([^"]+)"[^>]*>(.*?)</a>',
                    resp.text,
                    re.DOTALL
                )
                
                # 2. Match result titles and links
                raw_titles = re.findall(
                    r'<a class="result__url"[^>]*href="([^"]+)"[^>]*>(.*?)</a>',
                    resp.text,
                    re.DOTALL
                )

                for idx in range(min(len(raw_snippets), len(raw_titles), max_results)):
                    raw_href, raw_snippet_html = raw_snippets[idx]
                    _, raw_domain_html = raw_titles[idx]

                    snippet_text = clean_html_text(raw_snippet_html)
                    domain_text = clean_html_text(raw_domain_html)

                    # Extract actual target URL from duckduckgo redirect link if present
                    actual_url = raw_href
                    if "uddg=" in raw_href:
                        try:
                            parsed = urlparse(raw_href)
                            qs = parse_qs(parsed.query)
                            if "uddg" in qs:
                                actual_url = qs["uddg"][0]
                        except Exception:
                            pass

                    # Extract date if mentioned in snippet (e.g. '16 Oct 2026', 'Yesterday', 'Today')
                    date_match = re.search(r'\b(\d{1,2}\s+[A-Za-z]{3,9}\s+\d{4}|\d{1,2}/\d{1,2}/\d{2,4})\b', snippet_text)
                    pub_date = date_match.group(1) if date_match else None

                    # Clean title from domain and snippet
                    clean_title = f"{domain_text} - Agricultural Market Data"
                    if len(snippet_text) > 40:
                        first_sentence = snippet_text.split('.')[0]
                        if len(first_sentence) < 80:
                            clean_title = first_sentence

                    citations.append(
                        WebSearchCitation(
                            title=clean_title,
                            url=actual_url,
                            snippet=snippet_text[:300],
                            source_name=f"Web ({extract_domain(actual_url)})",
                            published_date=pub_date,
                            extracted_content=snippet_text
                        )
                    )
    except Exception as e:
        print(f"[WebSearch] Direct web search error: {e}")
    return citations

async def execute_live_web_search(query: str, max_results: int = 5) -> List[WebSearchCitation]:
    """Dispatches search to Tavily, Brave, or live web search based on backend configuration."""
    # 1. Tavily if key present
    if settings.TAVILY_API_KEY:
        tavily_results = await search_tavily(query, max_results)
        if tavily_results:
            return tavily_results

    # 2. Brave if key present
    if settings.BRAVE_API_KEY:
        brave_results = await search_brave(query, max_results)
        if brave_results:
            return brave_results

    # 3. Resilient Direct Web Search
    return await search_direct_web(query, max_results)

async def smart_multi_source_search(
    primary_query: str,
    secondary_query: Optional[str] = None,
    max_total_citations: int = 6
) -> Tuple[List[WebSearchCitation], List[str], Optional[str]]:
    """Executes a multi-query smart search flow, comparing independent sources and extracting destination page content."""
    queries_used: List[str] = [primary_query]
    seen_urls = set()
    combined_citations: List[WebSearchCitation] = []

    # 1. Search with primary query
    primary_results = await execute_live_web_search(primary_query, max_results=4)
    for c in primary_results:
        if c.url not in seen_urls:
            seen_urls.add(c.url)
            combined_citations.append(c)

    # 2. Check if results are insufficient or lack market figures
    has_sufficient_price_info = any(
        any(k in c.snippet.lower() for k in ["rs", "₹", "price", "bhav", "quintal", "rate", "modal", "mandi", "msp", "/kg"])
        for c in combined_citations
    )

    if (len(combined_citations) < 2 or not has_sufficient_price_info) and secondary_query:
        queries_used.append(secondary_query)
        secondary_results = await execute_live_web_search(secondary_query, max_results=3)
        for c in secondary_results:
            if c.url not in seen_urls:
                seen_urls.add(c.url)
                combined_citations.append(c)

    # 3. Deep Content Extraction from top authoritative destination page
    extracted_page_text: Optional[str] = None
    target_urls_to_try = [c.url for c in combined_citations if any(dom in c.url.lower() for dom in ["agmarknet", "enam", "mandibhav", "kisandeals", "commodities", "krishi"])]
    if not target_urls_to_try and combined_citations:
        target_urls_to_try = [combined_citations[0].url]

    for candidate_url in target_urls_to_try[:2]:
        page_content = await fetch_page_content(candidate_url)
        if page_content and len(page_content) > 100:
            extracted_page_text = f"[Source: {candidate_url}]\n{page_content}"
            # Attach to citation
            for c in combined_citations:
                if c.url == candidate_url:
                    c.extracted_content = page_content[:1500]
            break

    return combined_citations[:max_total_citations], queries_used, extracted_page_text
