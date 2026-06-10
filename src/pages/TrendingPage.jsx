import { useEffect, useRef, useState } from 'react';
import { useApp } from '../context/AppContext';
import { GAINERS, LOSERS, VOLUME, CRYPTO_TREND, LEADERS } from '../data/trending';
import { gen, draw, fetchQuote } from '../utils/chart';

function SparkCanvas({ item }) {
  const ref = useRef(null);
  useEffect(() => {
    const col = item.c.startsWith('+') ? '#00b864' : '#d93a4c';
    draw(ref.current, gen(item.base, 30, item.tr, item.vol), col);
  }, [item]);
  return <canvas ref={ref} style={{ width: '100%', height: '100%' }} />;
}

function TrendRow({ item, idx, onClick }) {
  const [price, setPrice] = useState(item.p);
  const [chg, setChg] = useState(item.c);
  const isUp = chg.startsWith('+');
  const col = isUp ? 'var(--green)' : 'var(--red)';
  const rankClass = idx === 0 ? 'gold' : idx === 1 ? 'silver' : idx === 2 ? 'bronze' : '';

  useEffect(() => {
    fetchQuote(item.t).then(q => {
      if (!q) return;
      const sign = q.change >= 0 ? '+' : '';
      setPrice(q.price.toLocaleString(undefined, { maximumFractionDigits: 2 }));
      setChg(`${sign}${q.change}%`);
    });
  }, [item.t]);

  return (
    <div className="trend-row" onClick={onClick}>
      <div className={`trend-rank ${rankClass}`}>{idx + 1}</div>
      <div className="trend-ticker-wrap">
        <div className="trend-ticker" style={{ color: col }}>{item.t}</div>
        <div className="trend-name">{item.n}</div>
        <div className="trend-posts">💬 {item.posts} ניתוחים היום</div>
      </div>
      <div className="trend-spark"><SparkCanvas item={item} /></div>
      <div className="trend-price-wrap">
        <div className="trend-price">${price}</div>
        <div className="trend-chg" style={{ color: chg.startsWith('+') ? 'var(--green)' : 'var(--red)' }}>{chg}</div>
      </div>
    </div>
  );
}

function LeaderCard({ l, rank, onOpen }) {
  return (
    <div className="leader-card" onClick={() => onOpen(l.handle)}>
      <div className="leader-rank">{rank === 0 ? '🥇' : rank === 1 ? '🥈' : rank === 2 ? '🥉' : `#${rank + 1}`}</div>
      <div className="leader-av" style={{ background: l.color, color: '#000' }}>{l.init}</div>
      <div className="leader-info">
        <div className="leader-name">{l.name}</div>
        <div className="leader-handle">@{l.handle} · {l.spec}</div>
      </div>
      <div className="leader-stats">
        <div className="leader-acc" style={{ color: 'var(--green)' }}>{l.acc}%</div>
        <div style={{ fontSize: 11, color: 'var(--muted)' }}>דיוק</div>
      </div>
      <div className="leader-stats">
        <div style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 13 }}>{l.followers}</div>
        <div style={{ fontSize: 11, color: 'var(--muted)' }}>עוקבים</div>
      </div>
    </div>
  );
}

export default function TrendingPage() {
  const { navigate, openOtherProfile } = useApp();
  const [tab, setTab] = useState('stocks');

  const goToSearch = (ticker) => navigate('search');

  return (
    <div className="page" id="trend-page">
      <div className="trend-inner">
        <div className="trend-header">
          <div className="trend-title">🔥 טרנדינג</div>
          <div className="trend-subtitle">עדכון אחרון: עכשיו</div>
        </div>

        <div className="market-bar">
          <div className="mkt-item"><span className="mkt-name">S&amp;P 500</span><span className="mkt-val up">5,842 <span>+0.8%</span></span></div>
          <div className="mkt-item"><span className="mkt-name">NASDAQ</span><span className="mkt-val up">18,920 <span>+1.2%</span></span></div>
          <div className="mkt-item"><span className="mkt-name">VIX</span><span className="mkt-val dn">14.3 <span>-5.1%</span></span></div>
          <div className="mkt-item"><span className="mkt-name">זהב</span><span className="mkt-val up">$2,380 <span>+0.4%</span></span></div>
        </div>

        <div className="trend-tabs">
          <div className={`trend-tab ${tab === 'stocks' ? 'on' : ''}`} onClick={() => setTab('stocks')}>📈 מניות</div>
          <div className={`trend-tab ${tab === 'crypto' ? 'on' : ''}`} onClick={() => setTab('crypto')}>₿ קריפטו</div>
          <div className={`trend-tab ${tab === 'leaders' ? 'on' : ''}`} onClick={() => setTab('leaders')}>🏆 מנתחים</div>
        </div>

        {tab === 'stocks' && (
          <div className="trend-content on">
            <div className="trend-section-lbl">🚀 עולות הכי חזק</div>
            <div className="trend-list">
              {GAINERS.map((item, i) => <TrendRow key={item.t} item={item} idx={i} onClick={() => goToSearch(item.t)} />)}
            </div>
            <div className="trend-section-lbl" style={{ marginTop: 8 }}>📉 יורדות הכי חזק</div>
            <div className="trend-list">
              {LOSERS.map((item, i) => <TrendRow key={item.t} item={item} idx={i} onClick={() => goToSearch(item.t)} />)}
            </div>
            <div className="trend-section-lbl" style={{ marginTop: 8 }}>📊 נפח גבוה</div>
            <div className="trend-list">
              {VOLUME.map((item, i) => <TrendRow key={item.t + i} item={item} idx={i} onClick={() => goToSearch(item.t)} />)}
            </div>
          </div>
        )}

        {tab === 'crypto' && (
          <div className="trend-content on">
            <div className="trend-section-lbl">₿ קריפטו</div>
            <div className="trend-list">
              {CRYPTO_TREND.map((item, i) => <TrendRow key={item.t} item={item} idx={i} onClick={() => goToSearch(item.t)} />)}
            </div>
          </div>
        )}

        {tab === 'leaders' && (
          <div className="trend-content on">
            <div className="trend-section-lbl">🏆 המנתחים המובילים השבוע</div>
            <div className="leaders-list">
              {LEADERS.map((l, i) => <LeaderCard key={l.handle} l={l} rank={i} onOpen={(h) => openOtherProfile(h, 'trending')} />)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
