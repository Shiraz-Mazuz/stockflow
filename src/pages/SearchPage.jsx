import { useEffect, useRef, useState, useCallback } from 'react';
import { useApp } from '../context/AppContext';
import { DB } from '../data/stocks';
import { COMMUNITY_POSTS } from '../data/community';
import { gen, draw, fetchQuote } from '../utils/chart';

const HOT = ['NVDA', 'BTC', 'TSLA', 'META', 'AAPL', 'ETH', 'AMD'];

/* ─── Mini spark chart ─── */
function SparkChart({ base, tr, vol, isUp }) {
  const ref = useRef(null);
  useEffect(() => {
    const col = isUp ? '#00b864' : '#d93a4c';
    draw(ref.current, gen(base, 60, tr, vol), col);
  }, [base, tr, vol, isUp]);
  return <canvas ref={ref} style={{ width: '100%', height: '100%' }} />;
}

/* ─── Full stock detail card ─── */
function StockCard({ stock, onAddWatchlist, isInWatchlist }) {
  const chartRef = useRef(null);
  const [quote, setQuote] = useState(null);
  const [loading, setLoading] = useState(true);

  const isUp = quote ? quote.change >= 0 : stock.d === 1;
  const col = isUp ? '#00b864' : '#d93a4c';
  const displayPrice = quote
    ? '$' + quote.price.toLocaleString(undefined, { maximumFractionDigits: 2 })
    : '$' + stock.p;
  const displayChg = quote
    ? (quote.change >= 0 ? '+' : '') + quote.change + '%'
    : stock.c;

  useEffect(() => {
    setLoading(true);
    fetchQuote(stock.t).then(q => {
      setQuote(q);
      setLoading(false);
    });
  }, [stock.t]);

  useEffect(() => {
    if (!chartRef.current) return;
    const base = parseFloat(stock.p) * 0.93;
    const tr = stock.d ? 0.0005 : -0.0004;
    draw(chartRef.current, gen(base, 90, tr, 0.014), col);
  }, [stock, col]);

  const changeAbs = quote
    ? ((quote.price - quote.prev) >= 0 ? '+' : '') + (quote.price - quote.prev).toFixed(2)
    : null;

  return (
    <div className="stock-result-card">
      {/* Header */}
      <div className="src-top">
        <div>
          <div className="src-ticker" style={{ color: col }}>{stock.t}</div>
          <div className="src-name">{stock.n}</div>
        </div>
        <div style={{ textAlign: 'left' }}>
          <div className="src-price">{displayPrice}</div>
          <div className="src-chg" style={{ color: col }}>
            {displayChg}
            {changeAbs && <span style={{ color: 'var(--muted)', fontSize: 11, marginRight: 6 }}>{changeAbs}</span>}
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="src-chart">
        <canvas ref={chartRef} style={{ width: '100%', height: '100%' }} />
      </div>

      {/* Live stats */}
      {quote && (
        <div className="src-details">
          <div className="src-detail">
            <span>פתיחה</span>
            <span style={{ fontFamily: "'IBM Plex Mono',monospace" }}>${quote.open?.toFixed(2)}</span>
          </div>
          <div className="src-detail">
            <span>גבוה יומי</span>
            <span style={{ fontFamily: "'IBM Plex Mono',monospace", color: 'var(--green)' }}>${quote.high?.toFixed(2)}</span>
          </div>
          <div className="src-detail">
            <span>נמוך יומי</span>
            <span style={{ fontFamily: "'IBM Plex Mono',monospace", color: 'var(--red)' }}>${quote.low?.toFixed(2)}</span>
          </div>
          <div className="src-detail">
            <span>סגירה קודמת</span>
            <span style={{ fontFamily: "'IBM Plex Mono',monospace" }}>${quote.prev?.toFixed(2)}</span>
          </div>
        </div>
      )}
      {loading && (
        <div style={{ textAlign: 'center', padding: '8px 0', fontSize: 12, color: 'var(--muted)' }}>
          טוען נתונים אמיתיים...
        </div>
      )}

      {/* Action */}
      <button
        className="src-watch-btn"
        onClick={onAddWatchlist}
        style={isInWatchlist ? { background: 'var(--s2)', color: 'var(--green)', borderColor: 'var(--green)' } : {}}
      >
        {isInWatchlist ? '✓ ברשימת המעקב' : '+ הוסף לרשימת מעקב'}
      </button>
    </div>
  );
}

/* ─── Community post row ─── */
function CommPostRow({ p, onOpen, onOpenUser }) {
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(p.likes);
  const sentCol = p.sent === 'bull' ? 'var(--green)' : 'var(--red)';

  return (
    <div className="comm-post" onClick={() => onOpen(p)} style={{ cursor: 'pointer' }}>
      <div className="comm-top">
        <div
          className="comm-av"
          style={{ background: p.color }}
          onClick={e => { e.stopPropagation(); onOpenUser(p.handle); }}
        >
          {p.init}
        </div>
        <div className="comm-meta">
          <span
            className="comm-name"
            onClick={e => { e.stopPropagation(); onOpenUser(p.handle); }}
          >
            {p.user}
          </span>
          <span className="comm-time">{p.time}</span>
        </div>
        <div className="comm-sent" style={{ color: sentCol }}>
          {p.sent === 'bull' ? '🐂 Bull' : '🐻 Bear'}
        </div>
      </div>

      {/* Mini chart */}
      <div style={{ height: 50, margin: '8px 0', borderRadius: 8, overflow: 'hidden' }}>
        <SparkChart base={p.base} tr={p.tr} vol={p.vol} isUp={p.sent === 'bull'} />
      </div>

      <div className="comm-txt">{p.txt}</div>

      <div className="comm-acts" onClick={e => e.stopPropagation()}>
        <span
          className="comm-act"
          onClick={() => { setLiked(v => !v); setLikes(v => liked ? v - 1 : v + 1); }}
          style={{ color: liked ? 'var(--red)' : 'var(--muted)' }}
        >
          {liked ? '❤️' : '🤍'} {likes}
        </span>
        <span className="comm-act">💬 {p.comments}</span>
        <span className="comm-act" onClick={() => onOpen(p)}>↗️ פתח</span>
      </div>
    </div>
  );
}

/* ─── Main SearchPage ─── */
export default function SearchPage() {
  const { openOtherProfile, openExpandedPost, addToWatchlist, watchlist, myPosts, openStockPage } = useApp();
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [stock, setStock] = useState(null);
  const [recent, setRecent] = useState([]);
  const [showResults, setShowResults] = useState(false);

  const isInWatchlist = stock ? !!watchlist.find(s => s.t === stock.t) : false;

  const searchTicker = useCallback((t) => {
    const found = DB.find(s => s.t === t.toUpperCase());
    setSuggestions([]);
    setQuery(t.toUpperCase());
    setRecent(prev => [t.toUpperCase(), ...prev.filter(x => x !== t.toUpperCase())].slice(0, 6));
    if (!found) { setStock(null); setShowResults(false); return; }
    // Navigate straight to the stock detail page
    openStockPage(found, 'search');
  }, [openStockPage]);

  const handleQueryChange = (val) => {
    setQuery(val);
    if (val.length >= 1) {
      const q = val.toUpperCase();
      setSuggestions(DB.filter(s => s.t.startsWith(q) || s.n.toUpperCase().includes(q)).slice(0, 5));
    } else {
      setSuggestions([]);
      setShowResults(false);
      setStock(null);
    }
  };

  const handleAddWatchlist = () => {
    if (!stock) return;
    addToWatchlist({
      t: stock.t, n: stock.n, p: stock.p, c: stock.c, d: stock.d,
      base: parseFloat(stock.p) * 0.93,
      tr: stock.d ? 0.0005 : -0.0004,
      vol: 0.013,
    });
  };

  const openPost = (p) => {
    openExpandedPost({
      id: p.handle + p.time,
      ticker: stock?.t || '',
      price: '$' + p.base,
      exchange: 'NASDAQ',
      chg: p.tr > 0 ? '+' + (p.tr * 10000).toFixed(1) + '%' : (p.tr * 10000).toFixed(1) + '%',
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
    }, 'search');
  };

  const communityPosts = stock ? (COMMUNITY_POSTS[stock.t] || []) : [];
  const myActivity = stock ? myPosts.filter(p => p.ticker === stock.t) : [];

  return (
    <div className="page" id="search-page">
      <div className="search-page-inner">

        {/* Header */}
        <div className="srch-header">
          <div className="srch-title">🔍 חיפוש</div>
        </div>

        {/* Search bar */}
        <div className="srch-bar-wrap" style={{ position: 'relative' }}>
          <input
            className="srch-bar"
            placeholder="חפש מניה, קריפטו... (NVDA, BTC, TSLA)"
            value={query}
            onChange={e => handleQueryChange(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && searchTicker(query)}
            autoComplete="off"
          />
          {query && (
            <button
              className="srch-clear"
              onClick={() => { setQuery(''); setSuggestions([]); setStock(null); setShowResults(false); }}
            >
              ✕
            </button>
          )}
        </div>

        {/* Autocomplete suggestions */}
        {suggestions.length > 0 && (
          <div className="srch-suggestions">
            {suggestions.map(s => (
              <div key={s.t} className="srch-sug-row" onClick={() => searchTicker(s.t)}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ fontFamily: "'IBM Plex Mono',monospace", fontWeight: 700, color: s.d ? 'var(--green)' : 'var(--red)', width: 50 }}>{s.t}</span>
                  <span style={{ fontSize: 13, color: 'var(--muted2)' }}>{s.n}</span>
                </div>
                <div style={{ textAlign: 'left' }}>
                  <div style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 13 }}>${s.p}</div>
                  <div style={{ fontSize: 12, color: s.d ? 'var(--green)' : 'var(--red)' }}>{s.c}</div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Landing state */}
        {!showResults && suggestions.length === 0 && (
          <>
            <div className="srch-section-title">🔥 חם עכשיו</div>
            <div className="hot-chips">
              {HOT.map(t => {
                const s = DB.find(d => d.t === t);
                return (
                  <div key={t} className="hot-chip" onClick={() => searchTicker(t)}>
                    <span style={{ fontWeight: 700 }}>{t}</span>
                    {s && <span style={{ fontSize: 11, color: s.d ? 'var(--green)' : 'var(--red)', marginRight: 4 }}>{s.c}</span>}
                  </div>
                );
              })}
            </div>

            {recent.length > 0 && (
              <>
                <div className="srch-section-title">🕐 חיפושים אחרונים</div>
                <div className="hot-chips">
                  {recent.map(t => (
                    <div key={t} className="hot-chip" onClick={() => searchTicker(t)}>{t}</div>
                  ))}
                </div>
              </>
            )}
          </>
        )}

        {/* Results */}
        {showResults && stock && (
          <div id="srch-results">
            {/* Stock card with real data */}
            <StockCard
              stock={stock}
              onAddWatchlist={handleAddWatchlist}
              isInWatchlist={isInWatchlist}
            />

            {/* My analyses */}
            {myActivity.length > 0 && (
              <>
                <div className="srch-section-title">📝 הניתוחים שלי על {stock.t}</div>
                {myActivity.map((p, i) => (
                  <div
                    key={i}
                    className="saved-card"
                    style={{ cursor: 'pointer' }}
                    onClick={() => openExpandedPost({ ...p, id: 'my' + i, username: 'אור כהן', handle: 'or_trades', userColor: 'linear-gradient(135deg,#00ff88,#4da6ff)', init: 'א', time: p.date, price: '$' + p.base, exchange: 'NASDAQ' }, 'search')}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                      <span style={{ color: p.sent === 'bull' ? 'var(--green)' : 'var(--red)', fontWeight: 700, fontSize: 13 }}>
                        {p.sent === 'bull' ? '🐂 Bull' : '🐻 Bear'} · {p.chg}
                      </span>
                      <span style={{ fontSize: 11, color: 'var(--muted)' }}>{p.date}</span>
                    </div>
                    <div style={{ fontSize: 14, lineHeight: 1.5 }}>{p.txt}</div>
                    <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 6 }}>❤️ {p.likes} לייקים · לחץ לפתיחה</div>
                  </div>
                ))}
              </>
            )}

            {/* Community posts */}
            {communityPosts.length > 0 && (
              <>
                <div className="srch-section-title">💬 מה הקהילה אומרת על {stock.t}</div>
                {communityPosts.map((p, i) => (
                  <CommPostRow
                    key={i}
                    p={p}
                    onOpen={openPost}
                    onOpenUser={h => openOtherProfile(h, 'search')}
                  />
                ))}
              </>
            )}

            {communityPosts.length === 0 && myActivity.length === 0 && (
              <div className="empty" style={{ marginTop: 24 }}>
                <div className="empty-icon">📭</div>
                <div className="empty-txt">אין עדיין ניתוחים על {stock.t}</div>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
