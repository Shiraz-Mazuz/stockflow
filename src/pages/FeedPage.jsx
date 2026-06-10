import { useEffect, useRef, useState, useCallback } from 'react';
import { useApp } from '../context/AppContext';
import { getFeedPosts, getComments, addComment as dbAddComment } from '../lib/db';
import { gen, draw, fetchQuote } from '../utils/chart';

const TF_OPTIONS = ['1D', '3D', '1W', '1M', '3M', '1Y'];
const TF_VOL = { '1D': 0.5, '3D': 0.7, '1W': 1, '1M': 1.5, '3M': 2, '1Y': 3 };

/* ── normalise a DB post row into the shape the UI expects ── */
function normalise(row) {
  const prof = row.profiles || {};
  return {
    id:        row.id,
    ticker:    row.ticker,
    txt:       row.text,
    sent:      row.sentiment,
    likes:     row.likes ?? 0,
    bull:      row.bull_pct ?? 50,
    price:     row.price  || '',
    chg:       row.change_pct || '',
    exchange:  row.exchange || 'NASDAQ',
    d:         row.direction ?? 1,
    base:      row.base   ?? 100,
    tr:        row.tr     ?? 0.0005,
    vol:       row.vol    ?? 0.013,
    date:      row.created_at,
    username:  prof.name   || 'משתמש',
    userId:    row.user_id,
    handle:    prof.handle || 'user',
    init:      prof.init   || '?',
    userColor: prof.avatar_color || 'linear-gradient(135deg,#00ff88,#4da6ff)',
    accuracy:  prof.accuracy ?? 0,
    comments:  [],
  };
}

/* ════════════════════════════════
   POST CHART
════════════════════════════════ */
function PostChart({ post, tf }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const col = post.d ? '#00b864' : '#d93a4c';
    const volMult = TF_VOL[tf] || 1;
    draw(canvasRef.current, gen(post.base, 60, post.tr, post.vol * volMult), col);
  }, [post, tf]);

  useEffect(() => {
    const observer = new ResizeObserver(() => {
      const col = post.d ? '#00b864' : '#d93a4c';
      draw(canvasRef.current, gen(post.base, 60, post.tr, post.vol), col);
    });
    if (canvasRef.current) observer.observe(canvasRef.current);
    return () => observer.disconnect();
  }, [post]);

  return <canvas ref={canvasRef} style={{ width: '100%', height: '100%' }} />;
}

/* ════════════════════════════════
   SINGLE POST
════════════════════════════════ */
function Post({ post }) {
  const {
    openExpandedPost, openOtherProfile,
    savePost, savedIds,
    likedIds, toggleLike,
    myVotes, castVote,
    showToast, user,
    followingIds, toggleFollow,
  } = useApp();

  const [likes, setLikes]   = useState(post.likes);
  const [tf, setTf]         = useState('1D');
  const [bull, setBull]     = useState(post.bull);
  const [comments, setComments] = useState([]);
  const [commentInput, setCommentInput] = useState('');
  const [livePrice, setLivePrice] = useState(null);
  const [liveChg, setLiveChg]   = useState(null);

  const liked   = likedIds.includes(post.id);
  const myVote  = myVotes.find(v => v.post_id === post.id)?.direction ?? null;
  const isSaved = savedIds.includes(post.id);
  const bear    = 100 - bull;

  /* load comments from DB */
  useEffect(() => {
    getComments(post.id).then(({ data }) => {
      if (data) setComments(data);
    });
  }, [post.id]);

  useEffect(() => {
    const ticker = post.ticker.replace('/USD', '');
    fetchQuote(ticker).then(q => {
      if (!q) return;
      setLivePrice('$' + q.price.toLocaleString(undefined, { maximumFractionDigits: 2 }));
      const sign = q.change >= 0 ? '+' : '';
      setLiveChg(`${sign}${q.change}%`);
    });
  }, [post.ticker]);

  const handleLike = (e) => {
    e.stopPropagation();
    setLikes(v => liked ? v - 1 : v + 1);
    toggleLike(post.id);
  };

  const handleVote = (e, side) => {
    e.stopPropagation();
    if (myVote === side) return;
    if (side === 'bull') setBull(v => Math.min(99, v + 3));
    else setBull(v => Math.max(1, v - 3));
    castVote(post.id, side);
  };

  const addComment = async (e) => {
    e.stopPropagation();
    if (!commentInput.trim()) return;
    if (!user) { showToast('יש להתחבר כדי להגיב', 'error'); return; }
    const text = commentInput.trim();
    setCommentInput('');
    const { data, error } = await dbAddComment(post.id, user.id, text);
    if (error) { showToast('שגיאה בשליחת תגובה', 'error'); return; }
    if (data) setComments(prev => [...prev, data]);
  };

  return (
    <div className="post">
      <div className="p-top" onClick={() => openExpandedPost(post, 'feed')} style={{ cursor: 'pointer' }}>
        <div>
          <div className="p-ticker">{post.ticker}</div>
          <div className="p-sub">{post.exchange} · {livePrice || post.price}</div>
        </div>
        <div className={`p-chg ${post.d ? 'up-bg' : 'dn-bg'}`}>{liveChg || post.chg} {post.d ? '↑' : '↓'}</div>
      </div>

      <div className="p-chart">
        <PostChart post={post} tf={tf} />
      </div>

      <div className="tf-row">
        {TF_OPTIONS.map(t => (
          <div key={t} className={`tf ${tf === t ? 'on' : ''}`} onClick={() => setTf(t)}>{t}</div>
        ))}
      </div>

      <div className="p-actions">
        <div className="a-btn">
          <div className={`a-icon ${liked ? 'liked' : ''}`} onClick={handleLike}>❤️</div>
          <div className="a-num">{likes}</div>
        </div>
        <div className="a-btn">
          <div className="a-icon" onClick={() => openExpandedPost(post, 'feed')}>💬</div>
          <div className="a-num">{comments.length}</div>
        </div>
        <div className="a-btn">
          <div className={`a-icon ${isSaved ? 'saved' : ''}`} onClick={(e) => { e.stopPropagation(); savePost(post); }}>🔖</div>
          <div className="a-num">שמור</div>
        </div>
        <div className="a-btn">
          <div className="a-icon" onClick={(e) => { e.stopPropagation(); showToast('קישור הועתק ✓'); }}>↗️</div>
          <div className="a-num">שתף</div>
        </div>
      </div>

      <div className="p-bottom">
        <div className="p-user">
          <div className="av" style={{ background: post.userColor }}>
            {post.init}
          </div>
          <div>
            <div
              className="p-name"
              onClick={(e) => { e.stopPropagation(); openOtherProfile(post.handle, 'feed'); }}
              style={{ cursor: 'pointer' }}
            >
              {post.username}
            </div>
            <div className="p-handle">@{post.handle}</div>
          </div>
          {user?.id !== post.userId && (
            <button
              className={`follow${followingIds.includes(post.userId) ? ' following' : ''}`}
              onClick={(e) => { e.stopPropagation(); toggleFollow(post.userId); }}
            >
              {followingIds.includes(post.userId) ? '✓ עוקב' : '+ עקוב'}
            </button>
          )}
        </div>

        <div className="p-text">{post.txt} <span className="p-tag">#{post.ticker}</span></div>

        <div className="bb">
          <button className={`bb-btn bb-bull ${myVote === 'bull' ? 'v-bull' : ''}`} onClick={(e) => handleVote(e, 'bull')}>
            <div className="bb-fill" style={{ width: bull + '%' }} />
            🐂 Bull <span className="bb-pct">{bull}%</span>
          </button>
          <button className={`bb-btn bb-bear ${myVote === 'bear' ? 'v-bear' : ''}`} onClick={(e) => handleVote(e, 'bear')}>
            <div className="bb-fill" style={{ width: bear + '%' }} />
            🐻 Bear <span className="bb-pct">{bear}%</span>
          </button>
        </div>

        <div className="comments">
          {comments.map((c, i) => {
            const prof = c.profiles || {};
            const name = prof.name || c.user || 'משתמש';
            const init = prof.init || name[0]?.toUpperCase() || '?';
            const color = prof.avatar_color || c.color || 'var(--s2)';
            const txt = c.text ?? c.txt ?? '';
            return (
              <div key={c.id || i} className="cm">
                <div className="cm-av" style={{ background: color }}>{init}</div>
                <div className="cm-txt"><span className="cm-u">{name}</span> {txt}</div>
              </div>
            );
          })}
        </div>

        <div className="c-row" onClick={(e) => e.stopPropagation()}>
          <input
            className="c-in"
            placeholder="הוסף תגובה..."
            value={commentInput}
            onChange={e => setCommentInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && addComment(e)}
          />
          <button className="c-go" onClick={addComment}>➤</button>
        </div>
      </div>
    </div>
  );
}

/* ════════════════════════════════
   FEED PAGE
════════════════════════════════ */
export default function FeedPage() {
  const { myPosts } = useApp();
  const [dbPosts, setDbPosts]   = useState([]);
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    getFeedPosts(40).then(({ data }) => {
      if (data) setDbPosts(data.map(normalise));
      setLoading(false);
    });
  }, []);

  // Merge DB posts with freshly created posts from context (myPosts)
  // myPosts come in DB row format already (from createPost), normalise them too
  const allPosts = [
    ...myPosts.map(p => p.ticker ? normalise(p) : p),
    ...dbPosts.filter(dp => !myPosts.find(mp => mp.id === dp.id)),
  ].sort((a, b) => new Date(b.date) - new Date(a.date));

  return (
    <div className="page" id="feed-page">
      <div className="feed">
        {loading && (
          <div style={{ textAlign: 'center', padding: 40, color: 'var(--muted)' }}>
            ⏳ טוען פוסטים...
          </div>
        )}
        {!loading && allPosts.length === 0 && (
          <div style={{ textAlign: 'center', padding: 40, color: 'var(--muted)' }}>
            <div style={{ fontSize: 40 }}>📭</div>
            <div style={{ marginTop: 12 }}>עדיין אין פוסטים — היה ראשון!</div>
          </div>
        )}
        {allPosts.map(post => <Post key={post.id} post={post} />)}
      </div>
    </div>
  );
}
