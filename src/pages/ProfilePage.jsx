import { useEffect, useRef, useState } from 'react';
import { useApp } from '../context/AppContext';
import { signOut } from '../lib/auth';
import { gen, draw } from '../utils/chart';
import EditProfileModal from '../modals/EditProfileModal';

/* ── normalise a post row for display ── */
function norm(p) {
  return {
    id:      p.id,
    ticker:  p.ticker,
    txt:     p.text ?? p.txt ?? '',
    sent:    p.sentiment ?? p.sent ?? 'bull',
    likes:   p.likes ?? 0,
    d:       p.direction ?? p.d ?? 1,
    chg:     p.change_pct ?? p.chg ?? '',
    date:    p.created_at ?? p.date ?? '',
  };
}

function PostCard({ p }) {
  const { removePost } = useApp();
  const post = norm(p);
  const col   = post.sent === 'bull' ? 'var(--green)' : 'var(--red)';
  const isUp  = post.d === 1;
  const dateStr = post.date ? new Date(post.date).toLocaleDateString('he-IL', { day: 'numeric', month: 'short' }) : '';

  return (
    <div className="my-post-card">
      <div className="my-post-top">
        <div className="my-post-ticker" style={{ color: isUp ? 'var(--green)' : 'var(--red)' }}>{post.ticker}</div>
        <div className="my-post-chg" style={{ color: isUp ? 'var(--green)' : 'var(--red)' }}>{post.chg}</div>
        <div className="my-post-sent" style={{ color: col }}>{post.sent === 'bull' ? '🐂 Bull' : '🐻 Bear'}</div>
      </div>
      <div className="my-post-txt">{post.txt}</div>
      <div className="my-post-meta" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span>❤️ {post.likes} · {dateStr}</span>
        {removePost && (
          <button
            onClick={() => removePost(post.id)}
            style={{ background: 'none', border: 'none', color: 'var(--muted)', cursor: 'pointer', fontSize: 12 }}
          >
            🗑
          </button>
        )}
      </div>
    </div>
  );
}

function SavedCard({ p }) {
  const { savePost } = useApp();
  const post = norm(p);
  return (
    <div className="saved-card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ color: post.d ? 'var(--green)' : 'var(--red)', fontFamily: "'IBM Plex Mono',monospace", fontWeight: 700 }}>{post.ticker}</span>
        <span style={{ color: post.d ? 'var(--green)' : 'var(--red)', fontSize: 13 }}>{post.chg}</span>
      </div>
      <div style={{ fontSize: 14, marginTop: 6, color: 'var(--text)' }}>{post.txt}</div>
      <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 6 }}>❤️ {post.likes}</div>
      <button onClick={() => savePost(p)} style={{ background: 'none', border: 'none', color: 'var(--red)', fontSize: 12, cursor: 'pointer', marginTop: 4 }}>🗑 הסר</button>
    </div>
  );
}

export default function ProfilePage() {
  const {
    profile, user, myPosts, savedPosts,
    watchlist, removeFromWatchlist, setComposeOpen,
    showToast,
  } = useApp();

  const handleProfileSaved = (updated) => {
    setEditOpen(false);
    showToast('הפרופיל עודכן ✓');
    // reload page to show new data
    window.location.reload();
  };

  const [tab, setTab]         = useState('posts');
  const [editOpen, setEditOpen] = useState(false);
  const bannerRef             = useRef(null);

  useEffect(() => {
    draw(bannerRef.current, gen(200, 60, 0.0004, 0.012), '#00ff88');
  }, []);

  const handleSignOut = async () => {
    await signOut();
    showToast('התנתקת בהצלחה 👋');
  };

  /* fall back to auth email initial if profile not loaded yet */
  const displayName  = profile?.name   || user?.email?.split('@')[0] || 'משתמש';
  const displayInit  = profile?.init   || displayName[0]?.toUpperCase() || '?';
  const displayHandle = profile?.handle || 'user';
  const avatarColor  = profile?.avatar_color || 'linear-gradient(135deg,#00ff88,#4da6ff)';
  const bio          = profile?.bio    || 'טריידר חדש ב-StockFlow 🚀';
  const joinedDate   = profile?.created_at
    ? new Date(profile.created_at).toLocaleDateString('he-IL', { month: 'long', year: 'numeric' })
    : '';
  const accuracy   = profile?.accuracy   ?? 0;
  const bullAcc    = profile?.bull_acc   ?? 0;
  const bearAcc    = profile?.bear_acc   ?? 0;
  const followers  = profile?.followers  ?? 0;
  const following  = profile?.following  ?? 0;
  const pnl        = profile?.pnl        || '+0%';

  return (
    <>
    <div className="page" id="profile-page">
      <div className="profile-page" id="profileScroll">
        <div className="prof-banner">
          <canvas ref={bannerRef} style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 80, width: '100%', opacity: 0.25 }} />
        </div>

        <div className="prof-info">
          <div className="prof-avatar-wrap">
            <div className="prof-avatar" style={{ background: avatarColor }}>{displayInit}</div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button className="prof-edit" onClick={() => setEditOpen(true)}>✏️ ערוך פרופיל</button>
              <button
                onClick={handleSignOut}
                style={{
                  background: 'none', border: '1px solid var(--border)',
                  color: 'var(--muted)', borderRadius: 8, padding: '6px 12px',
                  cursor: 'pointer', fontSize: 12,
                }}
              >
                🚪 התנתק
              </button>
            </div>
          </div>
          <div className="prof-name">{displayName}</div>
          <div className="prof-handle">@{displayHandle}{joinedDate ? ` · הצטרף ${joinedDate}` : ''}</div>
          <div className="prof-bio">{bio}</div>

          <div className="prof-stats">
            <div className="stat"><div className="stat-val">{myPosts.length}</div><div className="stat-lbl">ניתוחים</div></div>
            <div className="stat"><div className="stat-val" style={{ color: 'var(--green)' }}>{accuracy}%</div><div className="stat-lbl">דיוק</div></div>
            <div className="stat"><div className="stat-val">{followers}</div><div className="stat-lbl">עוקבים</div></div>
            <div className="stat"><div className="stat-val">{following}</div><div className="stat-lbl">עוקב</div></div>
          </div>

          <div className="acc-row">
            <div className="acc-card">
              <div className="acc-val" style={{ color: 'var(--green)' }}>{bullAcc}%</div>
              <div className="acc-lbl">🐂 Bull דיוק</div>
            </div>
            <div className="acc-card">
              <div className="acc-val" style={{ color: 'var(--red)' }}>{bearAcc}%</div>
              <div className="acc-lbl">🐻 Bear דיוק</div>
            </div>
            <div className="acc-card">
              <div className="acc-val" style={{ color: 'var(--gold)' }}>{pnl}</div>
              <div className="acc-lbl">📈 P&amp;L</div>
            </div>
          </div>

          <button className="compose-fab" onClick={() => setComposeOpen(true)}>✏️ פרסם ניתוח</button>
        </div>

        <div className="prof-tabs">
          <div className={`prof-tab ${tab === 'posts' ? 'on' : ''}`} onClick={() => setTab('posts')}>📝 ניתוחים</div>
          <div className={`prof-tab ${tab === 'saved' ? 'on' : ''}`} onClick={() => setTab('saved')}>🔖 שמורים</div>
          <div className={`prof-tab ${tab === 'watchlist' ? 'on' : ''}`} onClick={() => setTab('watchlist')}>👁 מעקב</div>
        </div>

        {tab === 'posts' && (
          <div className="prof-content on">
            {myPosts.length === 0
              ? <div className="empty"><div className="empty-icon">📝</div><div className="empty-txt">עוד לא פרסמת ניתוחים</div></div>
              : myPosts.map((p, i) => <PostCard key={p.id || i} p={p} />)
            }
          </div>
        )}

        {tab === 'saved' && (
          <div className="prof-content on">
            {savedPosts.length === 0
              ? <div className="empty"><div className="empty-icon">🔖</div><div className="empty-txt">לא שמרת ניתוחים עדיין</div></div>
              : savedPosts.filter(Boolean).map((p, i) => <SavedCard key={p?.id || i} p={p} />)
            }
          </div>
        )}

        {tab === 'watchlist' && (
          <div className="prof-content on">
            {watchlist.length === 0
              ? <div className="empty"><div className="empty-icon">👁</div><div className="empty-txt">רשימת המעקב ריקה</div></div>
              : watchlist.map((s, i) => (
                <div key={s.t || i} className="wl-row">
                  <div>
                    <div className="wl-ticker" style={{ color: s.d ? 'var(--green)' : 'var(--red)' }}>{s.t}</div>
                    <div className="wl-name">{s.n}</div>
                  </div>
                  <div style={{ textAlign: 'left' }}>
                    <div className="wl-price">${s.p}</div>
                    <div className="wl-chg" style={{ color: s.d ? 'var(--green)' : 'var(--red)' }}>{s.c}</div>
                  </div>
                  <button className="wl-remove" onClick={() => removeFromWatchlist(s.t)}>×</button>
                </div>
              ))
            }
          </div>
        )}
      </div>
    </div>
    {editOpen && <EditProfileModal onClose={handleProfileSaved} />}
    </>
  );
}
