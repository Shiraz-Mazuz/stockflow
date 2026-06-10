import { useEffect, useRef, useState } from 'react';
import { useApp } from '../context/AppContext';
import { COMMUNITY_POSTS } from '../data/community';
import { gen, draw, fetchQuote } from '../utils/chart';

/* ─── Mini spark for community posts ─── */
function SparkChart({ base, tr, vol, isUp }) {
  const ref = useRef(null);
  useEffect(() => {
    draw(ref.current, gen(base, 60, tr, vol), isUp ? '#00b864' : '#d93a4c');
  }, [base, tr, vol, isUp]);
  return <canvas ref={ref} style={{ width: '100%', height: '100%' }} />;
}

/* ─── Community post card ─── */
function CommCard({ p, onOpen, onOpenUser }) {
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(p.likes);
  const isBull = p.sent === 'bull';
  return (
    <div className="comm-post" onClick={() => onOpen(p)}>
      <div className="comm-top">
        <div className="comm-av" style={{ background: p.color }} onClick={e => { e.stopPropagation(); onOpenUser(p.handle); }}>
          {p.init}
        </div>
        <div className="comm-meta">
          <span className="comm-name" onClick={e => { e.stopPropagation(); onOpenUser(p.handle); }}>{p.user}</span>
          <span className="comm-time">{p.time}</span>
        </div>
        <div className="comm-sent" style={{ color: isBull ? 'var(--green)' : 'var(--red)' }}>
          {isBull ? '🐂 Bull' : '🐻 Bear'}
        </div>
      </div>
      <div style={{ height: 48, margin: '8px 0', borderRadius: 8, overflow: 'hidden', position: 'relative', background: 'var(--s2)' }}>
        <div style={{ position: 'absolute', inset: 0 }}>
          <SparkChart base={p.base} tr={p.tr} vol={p.vol} isUp={isBull} />
        </div>
      </div>
      <div className="comm-txt">{p.txt}</div>
      <div className="comm-acts" onClick={e => e.stopPropagation()}>
        <span className="comm-act" style={{ color: liked ? 'var(--red)' : 'var(--muted)' }}
          onClick={() => { setLiked(v => !v); setLikes(v => liked ? v - 1 : v + 1); }}>
          {liked ? '❤️' : '🤍'} {likes}
        </span>
        <span className="comm-act">💬 {p.comments}</span>
        <span className="comm-act" onClick={() => onOpen(p)}>↗️ פתח פוסט</span>
      </div>
    </div>
  );
}

/* ─── Main StockPage ─── */
export default function StockPage() {
  const { currentStock, goBack, addToWatchlist, watchlist, openExpandedPost, openOtherProfile, setComposeOpen, setPrefilledTicker, myPosts } = useApp();
  const chartRef = useRef(null);
  const [quote, setQuote] = useState(null);
  const [loading, setLoading] = useState(true);

  const stock = currentStock;
  if (!stock) return null;

  const isInWatchlist = !!watchlist.find(s => s.t === stock.t);
  const isUp = quote ? quote.change >= 0 : stock.d === 1;
  const col = isUp ? '#00b864' : '#d93a4c';

  const displayPrice = quote
    ? '$' + quote.price.toLocaleString(undefined, { maximumFractionDigits: 2 })
    : '$' + stock.p;
  const displayChg = quote
    ? (quote.change >= 0 ? '+' : '') + quote.change + '%'
    : stock.c;
  const changeAbs = quote
    ? (quote.price - quote.prev >= 0 ? '+' : '') + (quote.price - quote.prev).toFixed(2)
    : null;

  useEffect(() => {
    setLoading(true);
    fetchQuote(stock.t).then(q => { setQuote(q); setLoading(false); });
  }, [stock.t]);

  useEffect(() => {
    if (!chartRef.current) return;
    const base = parseFloat(stock.p) * 0.93;
    draw(chartRef.current, gen(base, 90, stock.d ? 0.0005 : -0.0004, 0.014), col);
  }, [stock, col]);

  const communityPosts = COMMUNITY_POSTS[stock.t] || [];
  const myActivity = myPosts.filter(p => p.ticker === stock.t);

  const handleAddWatchlist = () => {
    addToWatchlist({
      t: stock.t, n: stock.n, p: stock.p, c: stock.c, d: stock.d,
      base: parseFloat(stock.p) * 0.93,
      tr: stock.d ? 0.0005 : -0.0004,
      vol: 0.013,
    });
  };

  const handleAnalyze = () => {
    setPrefilledTicker(stock.t);
    setComposeOpen(true);
  };

  const openPost = (p) => {
    openExpandedPost({
      id: p.handle + p.time,
      ticker: stock.t,
      price: displayPrice,
      exchange: 'NASDAQ',
      chg: p.tr >= 0 ? '+' + (p.tr * 10000).toFixed(1) + '%' : (p.tr * 10000).toFixed(1) + '%',
      d: p.sent === 'bull' ? 1 : 0,
      username: p.user,
      handle: p.handle,
      userColor: p.color,
      init: p.init,
      time: p.time,
      txt: p.txt,
      bull: p.sent === 'bull' ? 72 : 31,
      likes: p.likes,
      base: p.base, tr: p.tr, vol: p.vol,
    }, 'stock');
  };

  return (
    <div className="page" id="stock-page">
      <div className="stock-page-inner">

        {/* Back bar */}
        <div className="stock-back-bar">
          <button className="stock-back-btn" onClick={goBack}>← חזור</button>
          <div style={{ flex: 1 }} />
          <button
            className="stock-watchlist-btn"
            onClick={handleAddWatchlist}
            style={isInWatchlist ? { color: 'var(--green)', borderColor: 'var(--green)' } : {}}
          >
            {isInWatchlist ? '★ במעקב' : '☆ הוסף למעקב'}
          </button>
        </div>

        {/* Header */}
        <div className="stock-header">
          <div>
            <div className="stock-ticker" style={{ color: col }}>{stock.t}</div>
            <div className="stock-name">{stock.n}</div>
          </div>
          <div style={{ textAlign: 'left' }}>
            <div className="stock-price">{displayPrice}</div>
            <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', alignItems: 'center' }}>
              <span className="stock-chg" style={{ color: col }}>{displayChg} {isUp ? '↑' : '↓'}</span>
              {changeAbs && <span style={{ color: 'var(--muted)', fontSize: 12, fontFamily: "'IBM Plex Mono',monospace" }}>{changeAbs}</span>}
            </div>
          </div>
        </div>

        {/* Chart */}
        <div className="stock-chart-wrap">
          <canvas ref={chartRef} style={{ width: '100%', height: '100%' }} />
        </div>

        {/* Live stats grid */}
        {loading ? (
          <div className="stock-loading">⏳ טוען נתונים אמיתיים...</div>
        ) : quote && (
          <div className="stock-stats-grid">
            <div className="stock-stat">
              <div className="stock-stat-lbl">פתיחה</div>
              <div className="stock-stat-val">${quote.open?.toFixed(2)}</div>
            </div>
            <div className="stock-stat">
              <div className="stock-stat-lbl">גבוה יומי</div>
              <div className="stock-stat-val" style={{ color: 'var(--green)' }}>${quote.high?.toFixed(2)}</div>
            </div>
            <div className="stock-stat">
              <div className="stock-stat-lbl">נמוך יומי</div>
              <div className="stock-stat-val" style={{ color: 'var(--red)' }}>${quote.low?.toFixed(2)}</div>
            </div>
            <div className="stock-stat">
              <div className="stock-stat-lbl">סגירה קודמת</div>
              <div className="stock-stat-val">${quote.prev?.toFixed(2)}</div>
            </div>
          </div>
        )}

        {/* ★ CTA — Analyze this stock */}
        <div className="stock-cta-row">
          <button className="stock-analyze-btn" onClick={handleAnalyze}>
            <span>✍️</span>
            <div>
              <div style={{ fontWeight: 700, fontSize: 15 }}>פרסם ניתוח על {stock.t}</div>
              <div style={{ fontSize: 11, opacity: 0.75, marginTop: 2 }}>שתף את התחזית שלך עם הקהילה</div>
            </div>
          </button>
        </div>

        {/* My analyses */}
        {myActivity.length > 0 && (
          <>
            <div className="srch-section-title">📝 הניתוחים שלי</div>
            {myActivity.map((p, i) => (
              <div key={i} className="comm-post" style={{ cursor: 'pointer' }}
                onClick={() => openExpandedPost({ ...p, id: 'my' + i, username: 'אור כהן', handle: 'or_trades', userColor: 'linear-gradient(135deg,#00ff88,#4da6ff)', init: 'א', time: p.date, price: displayPrice, exchange: 'NASDAQ' }, 'stock')}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                  <span style={{ color: p.sent === 'bull' ? 'var(--green)' : 'var(--red)', fontWeight: 700, fontSize: 13 }}>
                    {p.sent === 'bull' ? '🐂 Bull' : '🐻 Bear'} · {p.chg}
                  </span>
                  <span style={{ fontSize: 11, color: 'var(--muted)' }}>{p.date}</span>
                </div>
                <div style={{ fontSize: 14, lineHeight: 1.5 }}>{p.txt}</div>
                <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 6 }}>❤️ {p.likes} · לחץ לפתיחה ↗</div>
              </div>
            ))}
          </>
        )}

        {/* Community posts */}
        <div className="srch-section-title">
          💬 מה הקהילה אומרת
          {communityPosts.length > 0 && <span style={{ color: 'var(--muted)', marginRight: 6 }}>({communityPosts.length})</span>}
        </div>

        {communityPosts.length > 0 ? (
          communityPosts.map((p, i) => (
            <CommCard key={i} p={p} onOpen={openPost} onOpenUser={h => openOtherProfile(h, 'stock')} />
          ))
        ) : (
          <div className="empty" style={{ marginTop: 16, paddingBottom: 80 }}>
            <div className="empty-icon">📭</div>
            <div className="empty-txt">אין עדיין ניתוחים על {stock.t}</div>
            <div style={{ fontSize: 13, color: 'var(--muted)', marginTop: 8 }}>היה הראשון לנתח!</div>
          </div>
        )}

        <div style={{ height: 80 }} />
      </div>
    </div>
  );
}
