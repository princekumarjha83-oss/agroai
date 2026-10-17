import React, { useState, useEffect } from 'react';
import { 
  Video, 
  Search, 
  Filter, 
  Bookmark, 
  Play, 
  Clock, 
  Eye, 
  CheckCircle2, 
  Share2, 
  X,
  AlertCircle,
  ExternalLink
} from 'lucide-react';
import { Language, VideoLesson, VideoCategory } from '../types';
import { apiService } from '../services/apiServices';

interface VideoAcademyPageProps {
  currentLang: Language;
}

export const VideoAcademyPage: React.FC<VideoAcademyPageProps> = ({ currentLang }) => {
  const [videos, setVideos] = useState<VideoLesson[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<VideoCategory>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeVideo, setActiveVideo] = useState<VideoLesson | null>(null);

  const categories: VideoCategory[] = [
    'All',
    'Wheat Cultivation',
    'Rice & Paddy',
    'Vegetable Farming',
    'Pest Management',
    'Soil Health & Fertilizer',
    'Drip Irrigation',
    'Natural & Organic Farming',
    'Farm Machinery',
    'Government Schemes'
  ];

  useEffect(() => {
    apiService.getVideos(selectedCategory, searchQuery).then(setVideos);
  }, [selectedCategory, searchQuery]);

  const handleToggleBookmark = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    apiService.toggleBookmarkVideo(id).then(setVideos);
  };

  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
      
      {/* Header */}
      <div style={{ marginBottom: '28px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
          <span className="badge badge-green">
            <Video style={{ width: '13px', height: '13px' }} />
            Scientific Agronomy Education
          </span>
          <span className="badge badge-preview">
            Phase 2 Video Engine Ready
          </span>
        </div>
        <h1 style={{ fontSize: 'clamp(1.8rem, 3.2vw, 2.4rem)', color: 'var(--forest-green)', marginBottom: '6px' }}>
          {currentLang === 'hi' ? 'हिन्दी कृषि वीडियो अकादमी' : 'Hindi Agriculture Video Academy'}
        </h1>
        <p style={{ color: 'var(--muted-text)', fontSize: '0.95rem' }}>
          {currentLang === 'hi'
            ? 'आईसीएआर और राज्य कृषि विश्वविद्यालयों के वैज्ञानिकों द्वारा तैयार की गई प्रामाणिक वीडियो ट्यूटोरियल सीरीज।'
            : 'Curated scientific farming tutorials in plain Hindi with key takeaways, bookmarks, and watch progress.'}
        </p>
      </div>

      {/* Search & Category Filter Chips */}
      <div className="agri-card" style={{ padding: '24px', marginBottom: '28px' }}>
        <div style={{ position: 'relative', marginBottom: '18px' }}>
          <Search style={{ width: '18px', height: '18px', position: 'absolute', top: '14px', left: '14px', color: 'var(--muted-text)' }} />
          <input 
            type="text" 
            placeholder={currentLang === 'hi' ? 'वीडियो का शीर्षक, विषय या वैज्ञानिक का नाम खोजें...' : 'Search tutorial title, crop, pest, or instructor name...'}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="form-input"
            style={{ paddingLeft: '42px' }}
          />
        </div>

        {/* Scrollable Category Filter Pills */}
        <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '6px' }}>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              style={{
                padding: '7px 16px',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.82rem',
                fontWeight: 600,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                background: selectedCategory === cat ? 'var(--forest-green)' : 'var(--cream-surface-muted)',
                color: selectedCategory === cat ? 'var(--white)' : 'var(--dark-text-secondary)',
                border: '1px solid var(--cream-border)'
              }}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Videos Grid */}
      {videos.length === 0 ? (
        <div className="agri-card" style={{ padding: '60px 20px', textAlign: 'center' }}>
          <AlertCircle style={{ width: '48px', height: '48px', color: 'var(--muted-text)', margin: '0 auto 12px auto' }} />
          <h3 style={{ fontSize: '1.2rem', color: 'var(--forest-green)', marginBottom: '6px' }}>No tutorials found</h3>
          <p style={{ fontSize: '0.88rem', color: 'var(--muted-text)' }}>
            Try adjusting your search query or selecting a different category filter.
          </p>
        </div>
      ) : (
        <div 
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '24px',
            marginBottom: '36px'
          }}
        >
          {videos.map((vid) => (
            <div 
              key={vid.id} 
              className="agri-card agri-card-hover" 
              style={{ overflow: 'hidden', cursor: 'pointer', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}
              onClick={() => setActiveVideo(vid)}
            >
              <div>
                {/* Thumbnail Area */}
                <div style={{ position: 'relative', height: '210px', background: '#000' }}>
                  <img 
                    src={vid.thumbnailUrl} 
                    alt={vid.title} 
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />

                  {/* Dark Play Overlay */}
                  <div 
                    style={{
                      position: 'absolute',
                      inset: 0,
                      background: 'rgba(18, 59, 42, 0.45)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'background 0.2s ease'
                    }}
                  >
                    <div 
                      style={{
                        width: '52px',
                        height: '52px',
                        borderRadius: '50%',
                        background: 'rgba(255, 255, 255, 0.95)',
                        color: 'var(--agri-green)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 4px 16px rgba(0, 0, 0, 0.3)'
                      }}
                    >
                      <Play style={{ width: '22px', height: '22px', marginLeft: '3px' }} />
                    </div>
                  </div>

                  {/* Duration Tag */}
                  <span 
                    style={{
                      position: 'absolute',
                      bottom: '10px',
                      right: '10px',
                      background: 'rgba(0, 0, 0, 0.85)',
                      color: 'var(--white)',
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      padding: '2px 8px',
                      borderRadius: '4px'
                    }}
                  >
                    {vid.duration}
                  </span>

                  {/* Bookmark Button */}
                  <button
                    onClick={(e) => handleToggleBookmark(vid.id, e)}
                    style={{
                      position: 'absolute',
                      top: '10px',
                      right: '10px',
                      width: '34px',
                      height: '34px',
                      borderRadius: '50%',
                      background: 'rgba(0, 0, 0, 0.65)',
                      color: vid.isBookmarked ? 'var(--sun-accent)' : 'var(--white)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer'
                    }}
                    title={vid.isBookmarked ? 'Remove Bookmark' : 'Save to Favourites'}
                  >
                    <Bookmark style={{ width: '16px', height: '16px', fill: vid.isBookmarked ? 'currentColor' : 'none' }} />
                  </button>

                  {/* Watch Progress Line */}
                  {vid.watchProgressPercent > 0 && (
                    <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '4px', background: 'rgba(255, 255, 255, 0.3)' }}>
                      <div style={{ width: `${vid.watchProgressPercent}%`, height: '100%', background: 'var(--sun-accent)' }} />
                    </div>
                  )}
                </div>

                {/* Details */}
                <div style={{ padding: '20px' }}>
                  <span className="badge badge-green" style={{ fontSize: '0.72rem', marginBottom: '8px' }}>
                    {vid.category}
                  </span>

                  <h3 style={{ fontSize: '1.08rem', color: 'var(--forest-green)', lineHeight: 1.4, marginBottom: '8px' }}>
                    {currentLang === 'hi' ? vid.titleHindi : vid.title}
                  </h3>

                  <div style={{ fontSize: '0.8rem', color: 'var(--muted-text)', marginBottom: '12px' }}>
                    <strong>{vid.instructorName}</strong> • {vid.instructorTitle}
                  </div>

                  <p style={{ fontSize: '0.82rem', color: 'var(--dark-text-secondary)', lineHeight: 1.5, marginBottom: '16px', overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                    {vid.description}
                  </p>
                </div>
              </div>

              {/* Card Footer */}
              <div style={{ padding: '14px 20px', borderTop: '1px solid var(--cream-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.78rem', color: 'var(--muted-text)', background: 'var(--cream-surface-muted)' }}>
                <span>{vid.channelName}</span>
                <span style={{ fontWeight: 600, color: 'var(--agri-green)' }}>Watch Tutorial →</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Video Player Modal */}
      {activeVideo && (
        <div 
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 2000,
            background: 'rgba(0, 0, 0, 0.85)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px'
          }}
          onClick={() => setActiveVideo(null)}
        >
          <div 
            style={{
              background: 'var(--cream-surface)',
              borderRadius: 'var(--radius-lg)',
              maxWidth: '820px',
              width: '100%',
              overflow: 'hidden',
              boxShadow: 'var(--shadow-xl)',
              maxHeight: '92vh',
              overflowY: 'auto'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div style={{ padding: '18px 24px', borderBottom: '1px solid var(--cream-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <span className="badge badge-green" style={{ fontSize: '0.72rem', marginBottom: '4px' }}>{activeVideo.category}</span>
                <h3 style={{ fontSize: '1.2rem', color: 'var(--forest-green)' }}>
                  {currentLang === 'hi' ? activeVideo.titleHindi : activeVideo.title}
                </h3>
              </div>
              <button onClick={() => setActiveVideo(null)} style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--muted-text)', cursor: 'pointer' }}>
                ✕
              </button>
            </div>

            {/* Direct Watch Notice Banner */}
            <div style={{ background: 'var(--cream-surface-muted)', padding: '8px 24px', borderBottom: '1px solid var(--cream-border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.78rem', color: 'var(--muted-text)', flexWrap: 'wrap', gap: '8px' }}>
              <span>{currentLang === 'hi' ? 'आधिकारिक कृषि वीडियो स्ट्रीम' : 'Official Agricultural Video Stream'}</span>
              <a
                href={`https://www.youtube.com/watch?v={(activeVideo.videoEmbedId || '').replace(/^yt-/, '').trim()}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: 'var(--agri-green)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px', textDecoration: 'none' }}
              >
                <span>{currentLang === 'hi' ? 'सीधा यूट्यूब पर खोलें' : 'Open Directly on YouTube'}</span>
                <ExternalLink style={{ width: '13px', height: '13px' }} />
              </a>
            </div>

            {/* Video Iframe Embed Player */}
            <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0, background: '#000' }}>
              <iframe
                src={`https://www.youtube-nocookie.com/embed/${(activeVideo.videoEmbedId || '').replace(/^yt-/, '').trim()}?autoplay=1&enablejsapi=1&rel=0`}
                title={activeVideo.title}
                style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 0 }}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
              />
            </div>

            {/* Modal Content */}
            <div style={{ padding: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
                <div>
                  <div style={{ fontSize: '0.92rem', fontWeight: 700, color: 'var(--forest-green)' }}>
                    {activeVideo.instructorName} ({activeVideo.instructorTitle})
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--muted-text)' }}>
                    Published by {activeVideo.channelName} • {activeVideo.viewsCount}
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <a
                    href={`https://www.youtube.com/watch?v=${(activeVideo.videoEmbedId || '').replace(/^yt-/, '').trim()}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-secondary"
                    style={{ padding: '6px 14px', fontSize: '0.82rem', display: 'flex', alignItems: 'center', gap: '6px' }}
                  >
                    <ExternalLink style={{ width: '14px', height: '14px', color: 'var(--agri-green)' }} />
                    <span>{currentLang === 'hi' ? 'यूट्यूब पर देखें' : 'Watch on YouTube'}</span>
                  </a>

                  <button
                    onClick={(e) => handleToggleBookmark(activeVideo.id, e)}
                    className="btn-secondary"
                    style={{ padding: '6px 14px', fontSize: '0.82rem' }}
                  >
                    <Bookmark style={{ width: '14px', height: '14px', fill: activeVideo.isBookmarked ? 'currentColor' : 'none' }} />
                    <span>{activeVideo.isBookmarked ? 'Bookmarked' : 'Save Video'}</span>
                  </button>
                </div>
              </div>

              {/* Key Takeaways Box */}
              <div style={{ background: 'var(--leaf-green-pale)', border: '1px solid rgba(46, 125, 50, 0.25)', borderRadius: 'var(--radius-md)', padding: '16px', marginBottom: '16px' }}>
                <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--forest-green)', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
                  <CheckCircle2 style={{ width: '16px', height: '16px' }} />
                  <span>Key Scientific Takeaways:</span>
                </div>
                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.82rem', color: 'var(--dark-text-secondary)' }}>
                  {activeVideo.keyTakeaways.map((point, i) => (
                    <li key={i}>• {point}</li>
                  ))}
                </ul>
              </div>

              <p style={{ fontSize: '0.85rem', color: 'var(--dark-text-secondary)', lineHeight: 1.55 }}>
                {activeVideo.description}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
