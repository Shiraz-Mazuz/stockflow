import { useApp } from '../context/AppContext';

export default function BottomNav() {
  const { page, navigate, notifications, toggleTheme, theme, setComposeOpen } = useApp();

  return (
    <nav className="bottom-nav">
      <button className={`bn-btn ${page === 'feed' ? 'on' : ''}`} onClick={() => navigate('feed')}>
        <span>🏠</span><span className="bn-lbl">בית</span>
      </button>
      <button className={`bn-btn ${page === 'trending' ? 'on' : ''}`} onClick={() => navigate('trending')}>
        <span>📈</span><span className="bn-lbl">טרנד</span>
      </button>
      <button className="bn-btn compose-btn" onClick={() => setComposeOpen(true)}>
        <span>✏️</span>
      </button>
      <button className={`bn-btn ${page === 'notifications' ? 'on' : ''}`} onClick={() => navigate('notifications')}>
        <span style={{ position: 'relative' }}>
          🔔
          {notifications > 0 && <span className="notif-count bn-notif-badge">{notifications}</span>}
        </span>
        <span className="bn-lbl">התראות</span>
      </button>
      <button className={`bn-btn ${page === 'profile' ? 'on' : ''}`} onClick={() => navigate('profile')}>
        <span>👤</span><span className="bn-lbl">פרופיל</span>
      </button>
    </nav>
  );
}
