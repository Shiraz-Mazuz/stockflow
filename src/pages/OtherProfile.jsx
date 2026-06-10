import { useEffect, useRef, useState } from 'react';
import { useApp } from '../context/AppContext';
import { getProfileByHandle, getMyPosts } from '../lib/db';
import { gen, draw } from '../utils/chart';

export default function OtherProfile() {
  const { otherUser, goBack, openExpandedPost, followingIds, toggleFollow, user: me } = useApp();
  const bannerRef = useRef(null);
  const [tab, setTab] = useState('posts');
  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  /* otherUser is a handle string like "danieltrader" */
  useEffect(() => {
    if (!otherUser) return;
    setLoading(true);
    setProfile(null);
    setPosts([]);

    getProfileByHandle(otherUser).then(({ data }) => {
      if (data) {
        setProfile(data);
        /* load their posts */
        getMyPosts(data.id).then(({ data: postsData }) => {
          setPosts(postsData || []);
          setLoading(false);
        });
      } else {
        setLoading(false);
      }
    });
  }, [otherUser]);

  useEffect(() => {
    if (!profile || !bannerRef.current) return;
    draw(bannerRef.current, gen(200, 60, 0.0005, 0.012), '#00b864');
  }, [profile]);

  if (loading) {
    return (
      <div className="page" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ color: 'var(--muted)', fontSize: 14 }}>טוען פרופיל...</div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="page" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 12 }}>
        <div style={{ fontSize: 32 }}>👤</div>
        <div style={{ color: 'var(--muted)', fontSize: 14 }}>משתמש לא נמצא</div>
        <button onClick={goBack} style={{ background: 'none', border: '1px solid var(--border)', color: 'var(--muted)', borderRadius: 8, padding: '8px 16px', cursor: 'pointer' }}>חזור</button>
      </div>
    );
  }

  const isMe = me?.id === profile.id;
  const isFollowing = followingIds.includes(profile.id);
  const avatarColor = profile.avatar_color || 'linear-gradient(135deg,#00b864,#4da6ff)';
  const displayInit = profile.init || profile.name?.[0]?.toUpperCase() || '?';
  const topPosts = [...posts].sort((a, b) => (b.likes ?? 0) - (a.likes ?? 0)).slice(0, 2);

  return (
    <div className="page" id="other-profile-page">
      <div className="other-profile-page" id="otherProfileScroll">

        <div className="op-back">
          <div className="op-back-btn" onClick={goBack}>←</div>
          <div>
            <div className="op-back-name">{profile.name}</div>
            <div className="op-back-handle">@{profile.handle}</div>
          </div>
        </div>

        <div className="op-banner">
          <canvas ref={bannerRef} style={{ width: '100%', height: '100%' }} />
        </div>

        <div className="op-info">
          <div className="op-avatar-row">
            <div className="op-avatar" style={{ background: avatarColor }}>{displayInit}</div>
            {!isMe && (
              <button
                className={`op-follow-btn ${isFollowing ? 'following' : ''}`}
                onClick={() => toggleFollow(profile.id)}
              >
                {isFollowing ? '✓ עוקב' : '+ עקוב'}
              </button>
            )}
          </div>

          <div className="op-name">{profile.name}</div>
          <div className="op-handle">@{profile.handle}</div>
          {profile.bio && <div className="op-bio">{profile.bio}</div>}

          <div className="op-stats">
            <div className="op-stat"><div className="op-stat-val">{posts.length}</div><div className="op-stat-lbl">ניתוחים</div></div>
            <div className="op-stat"><div className="op-stat-val" style={{ color: 'var(--green)' }}>{profile.accuracy ?? 0}%</div><div className="op-stat-lbl">דיוק</div></div>
            <div className="op-stat"><div className="op-stat-val">{profile.followers ?? 0}</div><div className="op-stat-lbl">עוקבים</div></div>
            <div className="op-stat"><div className="op-stat-val">{profile.following ?? 0}</div><div className="op-stat-lbl">עוקב</div></div>
          </div>

          <div className="op-acc-row">
            <div className="op-acc-card">
              <div className="op-acc-val" style={{ color: 'var(--green)' }}>{profile.bull_acc ?? 0}%</div>
              <div className="op-acc-lbl">🐂 Bull דיוק</div>
            </div>
            <div className="op-acc-card">
              <div className="op-acc-val" style={{ color: 'var(--red)' }}>{profile.bear_acc ?? 0}%</div>
              <div className="op-acc-lbl">🐻 Bear דיוק</div>
            </div>
            <div className="op-acc-card">
              <div className="op-acc-val" style={{ color: 'var(--gold)' }}>{profile.pnl || '+0%'}</div>
              <div className="op-acc-lbl">📈 P&amp;L</div>
            </div>
          </div>
        </div>

        <div className="op-tabs">
          <div className={`op-tab ${tab === 'posts' ? 'on' : ''}`} onClick={() => setTab('posts')}>📝 ניתוחים</div>
          <div className={`op-tab ${tab === 'top' ? 'on' : ''}`} onClick={() => setTab('top')}>🏆 הכי טובים</div>
          <div className={`op-tab ${tab === 'about' ? 'on' : ''}`} onClick={() => setTab('about')}>ℹ️ אודות</div>
        </div>

        {tab === 'posts' && (
          <div className="op-content on">
            {posts.length === 0
              ? <div className="empty"><div className="empty-icon">📝</div><div className="empty-txt">אין ניתוחים עדיין</div></div>
              : posts.map((p, i) => (
                <div key={p.id || i} className="my-post-card"
                  onClick={() => openExpandedPost({
                    ...p, username: profile.name, handle: profile.handle,
                    userColor: avatarColor, init: displayInit,
                    time: p.created_at, price: '$' + (p.base ?? 100), exchange: 'NASDAQ',
                    txt: p.text, sent: p.sentiment, d: p.direction,
                  }, 'other-profile')}
                >
                  <div className="my-post-top">
                    <span className="my-post-ticker" style={{ color: p.direction ? 'var(--green)' : 'var(--red)' }}>{p.ticker}</span>
                    <span className="my-post-chg" style={{ color: p.direction ? 'var(--green)' : 'var(--red)' }}>{p.change_pct}</span>
                    <span className="my-post-sent" style={{ color: p.sentiment === 'bull' ? 'var(--green)' : 'var(--red)' }}>
                      {p.sentiment === 'bull' ? '🐂 Bull' : '🐻 Bear'}
                    </span>
                  </div>
                  <div className="my-post-txt">{p.text}</div>
                  <div className="my-post-meta">❤️ {p.likes ?? 0} · {p.created_at ? new Date(p.created_at).toLocaleDateString('he-IL', { day: 'numeric', month: 'short' }) : ''}</div>
                </div>
              ))
            }
          </div>
        )}

        {tab === 'top' && (
          <div className="op-content on">
            {topPosts.length === 0
              ? <div className="empty"><div className="empty-icon">🏆</div><div className="empty-txt">אין ניתוחים עדיין</div></div>
              : topPosts.map((p, i) => (
                <div key={p.id || i} className="my-post-card">
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                    <span>{i === 0 ? '🥇' : '🥈'}</span>
                    <span className="my-post-ticker" style={{ color: p.direction ? 'var(--green)' : 'var(--red)' }}>{p.ticker}</span>
                    <span className="my-post-chg" style={{ color: p.direction ? 'var(--green)' : 'var(--red)' }}>{p.change_pct}</span>
                  </div>
                  <div className="my-post-txt">{p.text}</div>
                  <div className="my-post-meta">❤️ {p.likes ?? 0}</div>
                </div>
              ))
            }
          </div>
        )}

        {tab === 'about' && (
          <div className="op-content on" style={{ padding: '16px' }}>
            <div style={{ fontSize: 14, color: 'var(--muted2)', lineHeight: 1.6 }}>{profile.bio || 'אין ביוגרפיה'}</div>
            <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 8 }}>
              {profile.location && (
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                  <span style={{ color: 'var(--muted)' }}>מיקום</span>
                  <span>{profile.location}</span>
                </div>
              )}
              {profile.twitter && (
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                  <span style={{ color: 'var(--muted)' }}>טוויטר</span>
                  <span style={{ color: 'var(--blue)' }}>@{profile.twitter.replace(/^@/, '')}</span>
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                <span style={{ color: 'var(--muted)' }}>סך ניתוחים</span>
                <span>{posts.length}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                <span style={{ color: 'var(--muted)' }}>דיוק כולל</span>
                <span style={{ color: 'var(--green)' }}>{profile.accuracy ?? 0}%</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                <span style={{ color: 'var(--muted)' }}>P&amp;L מצטבר</span>
                <span style={{ color: 'var(--gold)' }}>{profile.pnl || '+0%'}</span>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
