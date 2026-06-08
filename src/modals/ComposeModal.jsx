import { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { DB } from '../data/stocks';

export default function ComposeModal() {
  const {
    composeOpen, setComposeOpen,
    addPost, showToast,
    prefilledTicker, setPrefilledTicker,
    user,
  } = useApp();

  const [ticker, setTicker]       = useState('');
  const [sentiment, setSentiment] = useState('bull');
  const [text, setText]           = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading]     = useState(false);

  // Pre-fill ticker when opened from stock page
  useEffect(() => {
    if (composeOpen && prefilledTicker) {
      setTicker(prefilledTicker);
      setPrefilledTicker('');
    }
    if (!composeOpen) {
      setTicker(''); setText(''); setSentiment('bull'); setSuggestions([]);
    }
  }, [composeOpen, prefilledTicker]);

  if (!composeOpen) return null;

  const handleTickerChange = (val) => {
    setTicker(val.toUpperCase());
    if (val.length >= 1) {
      setSuggestions(DB.filter(s => s.t.startsWith(val.toUpperCase())).slice(0, 4));
    } else {
      setSuggestions([]);
    }
  };

  const selectTicker = (t) => { setTicker(t); setSuggestions([]); };

  const submit = async () => {
    if (!user) { showToast('יש להתחבר תחילה', 'error'); return; }
    if (!ticker || !text.trim()) { showToast('מלא טיקר וטקסט', 'error'); return; }

    const stock = DB.find(s => s.t === ticker);
    setLoading(true);
    await addPost({
      ticker,
      chg: stock?.c || '+0.0%',
      d: stock?.d ?? 1,
      txt: text,
      sent: sentiment,
      base: parseFloat(stock?.p || 100),
      tr: sentiment === 'bull' ? 0.0005 : -0.0004,
      vol: 0.013,
    });
    setLoading(false);
    setTicker(''); setText(''); setSentiment('bull');
    setComposeOpen(false);
  };

  return (
    <div className="modal-overlay" onClick={() => setComposeOpen(false)}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="m-head">
          <div className="m-title">✏️ ניתוח חדש</div>
          <div className="m-close" onClick={() => setComposeOpen(false)}>✕</div>
        </div>

        <div className="m-body">
          <div className="m-label">מניה / קריפטו</div>
          <div style={{ position: 'relative' }}>
            <input
              className="s-inp"
              placeholder="NVDA, BTC, TSLA..."
              value={ticker}
              onChange={e => handleTickerChange(e.target.value)}
            />
            {suggestions.length > 0 && (
              <div className="ticker-suggestions">
                {suggestions.map(s => (
                  <div key={s.t} className="ticker-sug-item" onClick={() => selectTicker(s.t)}>
                    <span style={{ fontFamily: "'IBM Plex Mono',monospace", fontWeight: 700 }}>{s.t}</span>
                    <span style={{ color: 'var(--muted)', fontSize: 12, marginRight: 8 }}>{s.n}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="m-label" style={{ marginTop: 12 }}>כיוון</div>
          <div className="sent-row">
            <button
              className={`sent-btn bull ${sentiment === 'bull' ? 'on' : ''}`}
              onClick={() => setSentiment('bull')}
            >
              🐂 Bull — עלייה
            </button>
            <button
              className={`sent-btn bear ${sentiment === 'bear' ? 'on' : ''}`}
              onClick={() => setSentiment('bear')}
            >
              🐻 Bear — ירידה
            </button>
          </div>

          <div className="m-label" style={{ marginTop: 12 }}>הניתוח שלך</div>
          <textarea
            className="ta"
            placeholder="שתף את הניתוח שלך... (תמיכה/התנגדות, יעד מחיר, רמת כניסה)"
            value={text}
            onChange={e => setText(e.target.value)}
            rows={4}
            maxLength={280}
          />
          <div className="m-char">{text.length}/280</div>

          <button
            className="m-submit"
            onClick={submit}
            disabled={!ticker || !text.trim() || loading}
          >
            {loading ? '⏳ מפרסם...' : '🚀 פרסם ניתוח'}
          </button>
        </div>
      </div>
    </div>
  );
}
