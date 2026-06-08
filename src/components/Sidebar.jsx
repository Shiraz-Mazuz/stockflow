import { useApp } from '../context/AppContext';

const NAV_ITEMS = [
  { id: 'feed', icon: '🏠', label: 'פיד' },
  { id: 'trending', icon: '📈', label: 'טרנד' },
  { id: 'search', icon: '🔍', label: 'חיפוש' },
  { id: 'notifications', icon: '🔔', label: 'התראות' },
  { id: 'profile', icon: '👤', label: 'פרופיל' },
];

export default function Sidebar() {
  const { page, navigate, notifications, toggleTheme, theme, setComposeOpen } = useApp();

  return (
    <nav className="sidebar">
      <div className="s-logo">SF</div>

      {NAV_ITEMS.map(item => (
        <button
          key={item.id}
          className={`s-btn ${page === item.id ? 'on' : ''}`}
          onClick={() => navigate(item.id)}
          title={item.label}
        >
          {item.icon}
          {item.id === 'notifications' && notifications > 0 && (
            <span className="notif-count">{notifications}</span>
          )}
        </button>
      ))}

      <button className="s-btn" onClick={() => setComposeOpen(true)} title="פרסם ניתוח">✏️</button>

      <div style={{ flex: 1 }} />

      <button className="theme-toggle" onClick={toggleTheme} title="החלף ערכת נושא">
        {theme === 'dark' ? '☀️' : '🌙'}
      </button>
    </nav>
  );
}
