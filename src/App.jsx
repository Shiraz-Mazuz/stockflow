import { AppProvider, useApp } from './context/AppContext';
import Sidebar from './components/Sidebar';
import BottomNav from './components/BottomNav';
import Toast from './components/Toast';
import Onboarding from './pages/Onboarding';
import FeedPage from './pages/FeedPage';
import TrendingPage from './pages/TrendingPage';
import SearchPage from './pages/SearchPage';
import ProfilePage from './pages/ProfilePage';
import NotificationsPage from './pages/NotificationsPage';
import ExpandedPost from './pages/ExpandedPost';
import OtherProfile from './pages/OtherProfile';
import StockPage from './pages/StockPage';
import ComposeModal from './modals/ComposeModal';

function Shell() {
  const { page, authLoading } = useApp();

  // While Supabase checks the existing session, show a minimal spinner
  if (authLoading) {
    return (
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        height: '100vh', flexDirection: 'column', gap: 16,
        background: 'var(--bg)',
      }}>
        <div style={{ fontSize: 36 }}>📊</div>
        <div style={{
          fontFamily: "'Bebas Neue',sans-serif", fontSize: 28, letterSpacing: 2,
          color: 'var(--green)',
        }}>StockFlow</div>
        <div style={{ color: 'var(--muted)', fontSize: 13 }}>טוען...</div>
      </div>
    );
  }

  if (page === 'onboarding') {
    return <Onboarding />;
  }

  return (
    <div className="shell">
      <div className="main-content">
        {page === 'feed' && <FeedPage />}
        {page === 'trending' && <TrendingPage />}
        {page === 'search' && <SearchPage />}
        {page === 'notifications' && <NotificationsPage />}
        {page === 'profile' && <ProfilePage />}
        {page === 'expanded' && <ExpandedPost />}
        {page === 'other-profile' && <OtherProfile />}
        {page === 'stock' && <StockPage />}
      </div>

      <Sidebar />
      <BottomNav />
      <ComposeModal />
      <Toast />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <Shell />
    </AppProvider>
  );
}
