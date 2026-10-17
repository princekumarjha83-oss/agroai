import os
import io
import csv
from typing import Dict, Any, Optional

try:
    import pypdf
except ImportError:
    pypdf = None

try:
    import docx
except ImportError:
    docx = None

MAX_EXTRACT_CHARS = 12000

def parse_uploaded_document(file_bytes: bytes, filename: str) -> Dict[str, Any]:
    """Safely extracts readable text, page counts, and structural metadata from PDF, TXT, DOCX, CSV."""
    ext = os.path.splitext(filename)[1].lower()
    
    if len(file_bytes) == 0:
        return {
            "success": False,
            "filename": filename,
            "format": ext,
            "error": "The uploaded file is empty (0 bytes).",
            "extracted_text": "",
            "pages": 0
        }

    # 1. PDF
    if ext == ".pdf":
        if not pypdf:
            return {
                "success": False,
                "filename": filename,
                "format": "PDF",
                "error": "PDF reader library is currently unavailable.",
                "extracted_text": "",
                "pages": 0
            }
        try:
            reader = pypdf.PdfReader(io.BytesIO(file_bytes))
            total_pages = len(reader.pages)
            extracted_pages = []
            char_count = 0

            for idx, page in enumerate(reader.pages):
                page_text = page.extract_text() or ""
                clean_text = page_text.strip()
                if clean_text:
                    extracted_pages.append(f"--- [Page {idx + 1} of {total_pages}] ---\n{clean_text}")
                    char_count += len(clean_text)
                if char_count > MAX_EXTRACT_CHARS:
                    extracted_pages.append(f"\n[Note: Document truncated for AI reasoning at {char_count} characters across {total_pages} pages.]")
                    break

            full_text = "\n\n".join(extracted_pages).strip()
            if not full_text:
                return {
                    "success": False,
                    "filename": filename,
                    "format": "PDF",
                    "error": "No selectable text found in PDF. The document might be an image scan without an embedded OCR text layer.",
                    "extracted_text": "",
                    "pages": total_pages
                }

            return {
                "success": True,
                "filename": filename,
                "format": "PDF",
                "pages": total_pages,
                "extracted_text": full_text
            }
        except Exception as e:
            return {
                "success": False,
                "filename": filename,
                "format": "PDF",
                "error": f"Failed to parse PDF document: {str(e)}",
                "extracted_text": "",
                "pages": 0
            }

    # 2. Plain Text / Markdown
    elif ext in [".txt", ".md", ".json", ".log"]:
        try:
            text = file_bytes.decode("utf-8")
        except UnicodeDecodeError:
            try:
                text = file_bytes.decode("latin-1")
            except Exception as e:
                return {
                    "success": False,
                    "filename": filename,
                    "format": ext,
                    "error": f"Encoding error reading text file: {e}",
                    "extracted_text": "",
                    "pages": 1
                }
        
        truncated_text = text[:MAX_EXTRACT_CHARS]
        return {
            "success": True,
            "filename": filename,
            "format": "TXT",
            "pages": 1,
            "extracted_text": truncated_text
        }

    # 3. CSV
    elif ext == ".csv":
        try:
            decoded = file_bytes.decode("utf-8")
        except UnicodeDecodeError:
            decoded = file_bytes.decode("latin-1")
        
        try:
            reader = csv.reader(io.StringIO(decoded))
            rows = list(reader)
            if not rows:
                return {
                    "success": False,
                    "filename": filename,
                    "format": "CSV",
                    "error": "CSV file contains no data.",
                    "extracted_text": "",
                    "pages": 1
                }
            
            headers = rows[0]
            header_line = " | ".join(headers)
            separator_line = " | ".join(["---"] * len(headers))
            table_lines = [header_line, separator_line]

            for row in rows[1:35]:  # include up to first 35 rows
                table_lines.append(" | ".join(row))

            summary = f"CSV Dataset Summary: {len(rows)-1} rows, {len(headers)} columns ({', '.join(headers[:8])})\n\n"
            summary += "\n".join(table_lines)
            if len(rows) > 36:
                summary += f"\n\n[... and {len(rows) - 36} more rows]"

            return {
                "success": True,
                "filename": filename,
                "format": "CSV",
                "pages": 1,
                "extracted_text": summary
            }
        except Exception as e:
            return {
                "success": False,
                "filename": filename,
                "format": "CSV",
                "error": f"Failed to parse CSV spreadsheet: {str(e)}",
                "extracted_text": "",
                "pages": 1
            }

    # 4. DOCX
    elif ext == ".docx":
        if not docx:
            return {
                "success": False,
                "filename": filename,
                "format": "DOCX",
                "error": "DOCX reader library is currently unavailable.",
                "extracted_text": "",
                "pages": 1
            }
        try:
            doc = docx.Document(io.BytesIO(file_bytes))
            paragraphs = [p.text.strip() for p in doc.paragraphs if p.text.strip()]
            
            # also extract tables
            table_texts = []
            for t in doc.tables:
                for row in t.rows[:20]:
                    cells = [cell.text.strip() for cell in row.cells]
                    table_texts.append(" | ".join(cells))

            combined = "\n\n".join(paragraphs)
            if table_texts:
                combined += "\n\n--- Document Tables ---\n" + "\n".join(table_texts)

            if not combined.strip():
                return {
                    "success": False,
                    "filename": filename,
                    "format": "DOCX",
                    "error": "DOCX file is empty or contains no readable paragraphs.",
                    "extracted_text": "",
                    "pages": 1
                }

            return {
                "success": True,
                "filename": filename,
                "format": "DOCX",
                "pages": 1,
                "extracted_text": combined[:MAX_EXTRACT_CHARS]
            }
        except Exception as e:
            return {
                "success": False,
                "filename": filename,
                "format": "DOCX",
                "error": f"Failed to parse Word document: {str(e)}",
                "extracted_text": "",
                "pages": 0
            }

    else:
        return {
            "success": False,
            "filename": filename,
            "format": ext,
            "error": f"Unsupported document format '{ext}'. Allowed: PDF, TXT, DOCX, CSV.",
            "extracted_text": "",
            "pages": 0
        }
