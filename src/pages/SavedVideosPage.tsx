import React, { useState, useEffect } from 'react';
import { Bookmark, History, Play, Trash2, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Language, VideoLesson } from '../types';
import { apiService } from '../services/apiServices';

interface SavedVideosPageProps {
  currentLang: Language;
}

export const SavedVideosPage: React.FC<SavedVideosPageProps> = ({ currentLang }) => {
  const [activeTab, setActiveTab] = useState<'bookmarks' | 'history'>('bookmarks');
  const [videos, setVideos] = useState<VideoLesson[]>([]);

  useEffect(() => {
    apiService.getVideos().then(setVideos);
  }, []);

  const bookmarkedVideos = videos.filter((v) => v.isBookmarked);
  const historyVideos = videos.filter((v) => v.watchProgressPercent > 0);

  const displayList = activeTab === 'bookmarks' ? bookmarkedVideos : historyVideos;

  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
      
      {/* Header */}
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontSize: 'clamp(1.8rem, 3.2vw, 2.4rem)', color: 'var(--forest-green)', marginBottom: '6px' }}>
          {currentLang === 'hi' ? 'सहेजे गए वीडियो एवं देखने का इतिहास' : 'Saved Tutorials & Viewing History'}
        </h1>
        <p style={{ color: 'var(--muted-text)', fontSize: '0.95rem' }}>
          Quick access to your bookmarked agronomical masterclasses and playback progress.
        </p>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
        <button
          onClick={() => setActiveTab('bookmarks')}
          style={{
            padding: '8px 20px',
            borderRadius: 'var(--radius-full)',
            fontSize: '0.9rem',
            fontWeight: 700,
            cursor: 'pointer',
            background: activeTab === 'bookmarks' ? 'var(--forest-green)' : 'var(--cream-surface)',
            color: activeTab === 'bookmarks' ? 'var(--white)' : 'var(--dark-text-secondary)',
            border: '1px solid var(--cream-border)'
          }}
        >
          Bookmarked Tutorials ({bookmarkedVideos.length})
        </button>

        <button
          onClick={() => setActiveTab('history')}
          style={{
            padding: '8px 20px',
            borderRadius: 'var(--radius-full)',
            fontSize: '0.9rem',
            fontWeight: 700,
            cursor: 'pointer',
            background: activeTab === 'history' ? 'var(--forest-green)' : 'var(--cream-surface)',
            color: activeTab === 'history' ? 'var(--white)' : 'var(--dark-text-secondary)',
            border: '1px solid var(--cream-border)'
          }}
        >
          Watch History ({historyVideos.length})
        </button>
      </div>

      {/* Grid */}
      {displayList.length === 0 ? (
        <div className="agri-card" style={{ padding: '60px 20px', textAlign: 'center' }}>
          <Bookmark style={{ width: '48px', height: '48px', color: 'var(--muted-text)', margin: '0 auto 12px auto' }} />
          <h3 style={{ fontSize: '1.2rem', color: 'var(--forest-green)', marginBottom: '6px' }}>
            No saved tutorials in this section
          </h3>
          <p style={{ fontSize: '0.88rem', color: 'var(--muted-text)', marginBottom: '16px' }}>
            Browse the Hindi Agriculture Academy and bookmark videos for offline field reference.
          </p>
          <Link to="/video-academy" className="btn-primary" style={{ padding: '8px 20px' }}>
            Explore Academy
          </Link>
        </div>
      ) : (
        <div 
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '24px'
          }}
        >
          {displayList.map((vid) => (
            <div key={vid.id} className="agri-card" style={{ overflow: 'hidden' }}>
              <div style={{ position: 'relative', height: '180px' }}>
                <img src={vid.thumbnailUrl} alt={vid.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <span style={{ position: 'absolute', bottom: '8px', right: '8px', background: 'rgba(0,0,0,0.8)', color: '#fff', fontSize: '0.75rem', padding: '2px 6px', borderRadius: '4px' }}>
                  {vid.duration}
                </span>
              </div>
              <div style={{ padding: '18px' }}>
                <span className="badge badge-green" style={{ fontSize: '0.72rem', marginBottom: '6px' }}>{vid.category}</span>
                <h4 style={{ fontSize: '1rem', color: 'var(--forest-green)', marginBottom: '6px', lineHeight: 1.4 }}>
                  {currentLang === 'hi' ? vid.titleHindi : vid.title}
                </h4>
                <div style={{ fontSize: '0.78rem', color: 'var(--muted-text)', marginBottom: '14px' }}>
                  {vid.instructorName} • {vid.channelName}
                </div>
                <Link to="/video-academy" className="btn-secondary" style={{ width: '100%', textAlign: 'center', padding: '8px 0', fontSize: '0.82rem' }}>
                  Play Lesson
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
