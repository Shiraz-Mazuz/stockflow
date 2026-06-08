const FKEY = 'd8av7tpr01qk20sov46gd8av7tpr01qk20sov470';
const CRYPTO_MAP = { BTC: 'BINANCE:BTCUSDT', ETH: 'BINANCE:ETHUSDT', SOL: 'BINANCE:SOLUSDT' };
const priceCache = {};
const candleCache = {};

export function toFinnhub(t) { return CRYPTO_MAP[t] || t; }

export async function fetchQuote(ticker) {
  if (priceCache[ticker]) return priceCache[ticker];
  try {
    const sym = toFinnhub(ticker);
    const r = await fetch(`https://finnhub.io/api/v1/quote?symbol=${sym}&token=${FKEY}`);
    const d = await r.json();
    if (d.c && d.c > 0) {
      const chgPct = ((d.c - d.pc) / d.pc * 100).toFixed(2);
      const result = { price: d.c, change: chgPct, high: d.h, low: d.l, open: d.o, prev: d.pc };
      priceCache[ticker] = result;
      return result;
    }
  } catch (e) {}
  return null;
}

export async function fetchCandles(ticker, resolution = 'D', days = 90) {
  const key = ticker + '_' + resolution + '_' + days;
  if (candleCache[key]) return candleCache[key];
  try {
    const sym = toFinnhub(ticker);
    const to = Math.floor(Date.now() / 1000);
    const from = to - (days * 24 * 3600);
    const r = await fetch(`https://finnhub.io/api/v1/stock/candle?symbol=${sym}&resolution=${resolution}&from=${from}&to=${to}&token=${FKEY}`);
    const d = await r.json();
    if (d.s === 'ok' && d.c && d.c.length > 1) {
      candleCache[key] = d.c;
      return d.c;
    }
  } catch (e) {}
  return null;
}

export function gen(base, len, trend, vol) {
  let v = base;
  return Array.from({ length: len }, () => {
    v = v * (1 + (Math.random() - .5) * vol + trend);
    return v;
  });
}

export function draw(canvas, data, col) {
  if (!canvas) return;
  const W = canvas.clientWidth, H = canvas.clientHeight;
  if (!W || !H || !data || !data.length) return;
  canvas.width = W; canvas.height = H;
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, W, H);
  const mn = Math.min(...data) * .997, mx = Math.max(...data) * 1.003, rng = mx - mn || 1;
  const pts = data.map((v, i) => ({ x: (i / (data.length - 1)) * W, y: H - ((v - mn) / rng) * (H - 16) - 8 }));
  const g = ctx.createLinearGradient(0, 0, 0, H);
  g.addColorStop(0, col + '44'); g.addColorStop(.7, col + '11'); g.addColorStop(1, col + '00');
  ctx.beginPath(); ctx.moveTo(pts[0].x, pts[0].y);
  for (let i = 1; i < pts.length; i++) { const cx = (pts[i - 1].x + pts[i].x) / 2; ctx.bezierCurveTo(cx, pts[i - 1].y, cx, pts[i].y, pts[i].x, pts[i].y); }
  ctx.lineTo(W, H); ctx.lineTo(0, H); ctx.closePath(); ctx.fillStyle = g; ctx.fill();
  ctx.beginPath(); ctx.moveTo(pts[0].x, pts[0].y);
  for (let i = 1; i < pts.length; i++) { const cx = (pts[i - 1].x + pts[i].x) / 2; ctx.bezierCurveTo(cx, pts[i - 1].y, cx, pts[i].y, pts[i].x, pts[i].y); }
  ctx.strokeStyle = col; ctx.lineWidth = 2.2; ctx.lineJoin = 'round'; ctx.stroke();
  const l = pts[pts.length - 1];
  ctx.beginPath(); ctx.arc(l.x, l.y, 4, 0, Math.PI * 2); ctx.fillStyle = col; ctx.fill();
  ctx.beginPath(); ctx.arc(l.x, l.y, 8, 0, Math.PI * 2); ctx.fillStyle = col + '33'; ctx.fill();
}

export function drawLoading(canvas) {
  if (!canvas) return;
  const W = canvas.clientWidth, H = canvas.clientHeight;
  if (!W || !H) return;
  canvas.width = W; canvas.height = H;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#1f2433'; ctx.fillRect(0, 0, W, H);
}
