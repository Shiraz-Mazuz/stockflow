import { useEffect, useRef, useState } from 'react';
import { useApp } from '../context/AppContext';
import { SAMPLE_COMMENTS } from '../data/users';
import { gen, draw } from '../utils/chart';

export default function ExpandedPost() {
  const { expandedPost: post, goBack, savePost, savedPosts, openOtherProfile } = useApp();
  const chartRef = useRef(null);
  const [likes, setLikes] = useState(0);
  const [liked, setLiked] = useState(false);
  const [comments, setComments] = useState([]);
  const [input, setInput] = useState('');

  useEffect(() => {
    if (!post) return;
    setLikes(post.likes || 0);
    const ticker = post.ticker?.replace('/USD', '');
    setComments(SAMPLE_COMMENTS[ticker] || post.comments || []);
  }, [post]);

  useEffect(() => {
    if (!post || !chartRef.current) return;
    const col = post.d ? '#00ff88' : '#ff2d55';
    draw(chartRef.current, gen(post.base || 100, 90, post.tr || 0, post.vol || 0.01), col);
  }, [post]);

  if (!post) return null;

  const isSaved = savedPosts.find(p => p.id === post.id);
  const isUp = post.d === 1;
  const col = isUp ? 'var(--green)' : 'var(--red)';

  const addComment = () => {
    if (!input.trim()) return;
    setComments(prev => [...prev, { user: 'אור כהן', handle: 'or_trades', init: 'א', color: 'linear-gradient(135deg,#00ff88,#4da6ff)', time: 'עכשיו', sent: 'bull', txt: input, likes: 0 }]);
    setInput('');
  };

  return (
    <div className="page" id="exp-page">
      <div className="exp-page">
        <div className="exp-back" onClick={goBack}>← חזור</div>

        <div className="exp-header">
          <div>
            <div className="exp-ticker" style={{ color: col }}>{post.ticker}</div>
            <div className="exp-sub">{post.exchange || 'NASDAQ'} · {post.price}</div>
          </div>
          <div className={`exp-chg ${isUp ? 'up' : 'dn'}`}>{post.chg} {isUp ? '↑' : '↓'}</div>
        </div>

        <div className="exp-chart">
          <canvas ref={chartRef} style={{ width: '100%', height: '100%' }} />
        </div>

        <div className="exp-user" onClick={() => openOtherProfile(post.handle, 'expanded')}>
          <div className="av" style={{ background: post.userColor, color: post.init === 'י' ? '#000' : '#fff' }}>{post.init}</div>
          <div>
            <div className="exp-username">{post.username}</div>
            <div style={{ fontSize: 12, color: 'var(--muted)' }}>@{post.handle} · {post.time}</div>
          </div>
        </div>

        <div className="exp-text">{post.txt}</div>

        {post.bull !== undefined && (
          <div className="bb" style={{ margin: '0 16px 16px' }}>
            <button className="bb-btn bb-bull v-bull">
              <div className="bb-fill" style={{ width: post.bull + '%' }} />
              🐂 Bull <span className="bb-pct">{post.bull}%</span>
            </button>
            <button className="bb-btn bb-bear">
              <div className="bb-fill" style={{ width: (100 - post.bull) + '%' }} />
              🐻 Bear <span className="bb-pct">{100 - post.bull}%</span>
            </button>
          </div>
        )}

        <div className="exp-actions">
          <div className={`exp-act-btn ${liked ? 'liked' : ''}`} onClick={() => { setLiked(v => !v); setLikes(v => liked ? v - 1 : v + 1); }}>
            ❤️ <span>{likes}</span>
          </div>
          <div className="exp-act-btn" onClick={() => savePost(post)}>
            {isSaved ? '🔖 נשמר' : '🔖 שמור'}
          </div>
          <div className="exp-act-btn">↗️ שתף</div>
        </div>

        <div className="exp-comments-header">💬 {comments.length} תגובות</div>

        <div id="exp-comments-list">
          {comments.map((c, i) => (
            <div key={i} className="exp-comment">
              <div className="exp-cm-av" style={{ background: c.color }}>{c.init}</div>
              <div className="exp-cm-body">
                <div className="exp-cm-top">
                  <span className="exp-cm-user" onClick={() => openOtherProfile(c.handle, 'expanded')} style={{ cursor: 'pointer' }}>
                    {c.user}
                  </span>
                  <span className="exp-cm-time">{c.time}</span>
                  {c.sent && <span style={{ color: c.sent === 'bull' ? 'var(--green)' : 'var(--red)', fontSize: 11 }}>{c.sent === 'bull' ? '🐂' : '🐻'}</span>}
                </div>
                <div className="exp-cm-txt">{c.txt}</div>
                <div className="exp-cm-likes">❤️ {c.likes}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="exp-input-row">
          <div className="exp-av" style={{ width: 34, height: 34, fontSize: 13, background: 'linear-gradient(135deg,#00ff88,#4da6ff)', color: '#000', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, flexShrink: 0 }}>א</div>
          <input
            className="exp-input"
            placeholder="כתוב תגובה..."
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && addComment()}
          />
          <button className="exp-send" onClick={addComment}>➤</button>
        </div>
      </div>
    </div>
  );
}
