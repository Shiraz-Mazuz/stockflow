import { useEffect, useRef, useState } from 'react';
import { useApp } from '../context/AppContext';
import { USERS_DATA } from '../data/users';
import { gen, draw } from '../utils/chart';

export default function OtherProfile() {
  const { otherUser, goBack, openExpandedPost } = useApp();
  const bannerRef = useRef(null);
  const [following, setFollowing] = useState(false);
  const [tab, setTab] = useState('posts');

  const user = USERS_DATA[otherUser] || Object.values(USERS_DATA)[0];

  useEffect(() => {
    if (!user || !bannerRef.current) return;
    const col = user.bannerColor || '#00ff88';
    draw(bannerRef.current, gen(200, 60, 0.0005, 0.012), col);
  }, [user]);

  if (!user) return null;

  const topAnalyses = [...(user.analyses || [])].sort((a, b) => b.likes - a.likes).slice(0, 2);

  return (
    <div className="page" id="other-profile-page">
      <div className="other-profile-page" id="otherProfileScroll">
        <div className="op-back">
          <div className="op-back-btn" onClick={goBack}>←</div>
          <div>
            <div className="op-back-name">{user.name}</div>
            <div className="op-back-handle">{user.handle}</div>
          </div>
        </div>

        <div className="op-banner">
          <canvas ref={bannerRef} style={{ width: '100%', height: '100%' }} />
        </div>

        <div className="op-info">
          <div className="op-avatar-row">
            <div className="op-avatar" style={{ background: user.color }}>{user.init}</div>
            <button
              className={`op-follow-btn ${following ? 'following' : ''}`}
              onClick={() => setFollowing(v => !v)}
            >
              {following ? '✓ עוקב' : '+ עקוב'}
            </button>
          </div>

          <div className="op-name">{user.name}</div>
          <div className="op-handle">{user.handle}</div>
          <div className="op-bio">{user.bio}</div>

          <div className="op-stats">
            <div className="op-stat"><div className="op-stat-val">{user.posts}</div><div className="op-stat-lbl">ניתוחים</div></div>
            <div className="op-stat"><div className="op-stat-val" style={{ color: 'var(--green)' }}>{user.acc}%</div><div className="op-stat-lbl">דיוק</div></div>
            <div className="op-stat"><div className="op-stat-val">{user.followers}</div><div className="op-stat-lbl">עוקבים</div></div>
            <div className="op-stat"><div className="op-stat-val">{user.following}</div><div className="op-stat-lbl">עוקב</div></div>
          </div>

          <div className="op-acc-row">
            <div className="op-acc-card">
              <div className="op-acc-val" style={{ color: 'var(--green)' }}>{user.bullAcc}%</div>
              <div className="op-acc-lbl">🐂 Bull דיוק</div>
            </div>
            <div className="op-acc-card">
              <div className="op-acc-val" style={{ color: 'var(--red)' }}>{user.bearAcc}%</div>
              <div className="op-acc-lbl">🐻 Bear דיוק</div>
            </div>
            <div className="op-acc-card">
              <div className="op-acc-val" style={{ color: 'var(--gold)' }}>{user.pnl}</div>
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
            {(user.analyses || []).map((a, i) => (
              <div key={i} className="my-post-card" onClick={() => openExpandedPost({ ...a, username: user.name, handle: user.handle.replace('@', ''), userColor: user.color, init: user.init, time: a.date, price: '$' + a.base, exchange: 'NASDAQ', id: user.handle + i }, 'other-profile')}>
                <div className="my-post-top">
                  <span className="my-post-ticker" style={{ color: a.d ? 'var(--green)' : 'var(--red)' }}>{a.ticker}</span>
                  <span className="my-post-chg" style={{ color: a.d ? 'var(--green)' : 'var(--red)' }}>{a.chg}</span>
                  <span className="my-post-sent" style={{ color: a.sent === 'bull' ? 'var(--green)' : 'var(--red)' }}>{a.sent === 'bull' ? '🐂 Bull' : '🐻 Bear'}</span>
                </div>
                <div className="my-post-txt">{a.txt}</div>
                <div className="my-post-meta">❤️ {a.likes} · {a.date}</div>
              </div>
            ))}
          </div>
        )}

        {tab === 'top' && (
          <div className="op-content on">
            {topAnalyses.map((a, i) => (
              <div key={i} className="my-post-card">
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                  <span>{i === 0 ? '🥇' : '🥈'}</span>
                  <span className="my-post-ticker" style={{ color: a.d ? 'var(--green)' : 'var(--red)' }}>{a.ticker}</span>
                  <span className="my-post-chg" style={{ color: a.d ? 'var(--green)' : 'var(--red)' }}>{a.chg}</span>
                </div>
                <div className="my-post-txt">{a.txt}</div>
                <div className="my-post-meta">❤️ {a.likes} · {a.date}</div>
              </div>
            ))}
          </div>
        )}

        {tab === 'about' && (
          <div className="op-content on" style={{ padding: '16px' }}>
            <div style={{ fontSize: 14, color: 'var(--muted2)', lineHeight: 1.6 }}>{user.bio}</div>
            <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                <span style={{ color: 'var(--muted)' }}>סך ניתוחים</span>
                <span>{user.posts}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                <span style={{ color: 'var(--muted)' }}>דיוק כולל</span>
                <span style={{ color: 'var(--green)' }}>{user.acc}%</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                <span style={{ color: 'var(--muted)' }}>P&amp;L מצטבר</span>
                <span style={{ color: 'var(--gold)' }}>{user.pnl}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
