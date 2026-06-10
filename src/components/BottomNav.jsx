import { useApp } from '../context/AppContext';

export default function BottomNav() {
  const { page, navigate, notifications, setComposeOpen } = useApp();

  return (
    <nav className="bottom-nav">
      <button className={`bn-btn ${page === 'feed' ? 'on' : ''}`} onClick={() => navigate('feed')}>
        <span>🏠</span><span className="bn-lbl">ניתוחים</span>
      </button>
      <button className={`bn-btn ${page === 'trending' ? 'on' : ''}`} onClick={() => navigate('trending')}>
        <span>📈</span><span className="bn-lbl">טרנד</span>
      </button>
      <button className="bn-btn compose-btn" onClick={() => setComposeOpen(true)}>
        <span>✏️</span>
      </button>
      <button className={`bn-btn ${page === 'search' ? 'on' : ''}`} onClick={() => navigate('search')}>
        <span>🔍</span><span className="bn-lbl">חיפוש</span>
      </button>
      <button className={`bn-btn ${page === 'profile' ? 'on' : ''}`} onClick={() => navigate('profile')}>
        <span>👤</span><span className="bn-lbl">פרופיל</span>
      </button>
    </nav>
  );
}
