export const DB = [
  { t: 'AAPL', n: 'Apple Inc.', p: '213.40', c: '+1.2%', d: 1 },
  { t: 'MSFT', n: 'Microsoft Corp.', p: '438.70', c: '+0.8%', d: 1 },
  { t: 'NVDA', n: 'NVIDIA Corp.', p: '924.50', c: '+4.2%', d: 1 },
  { t: 'TSLA', n: 'Tesla Inc.', p: '198.30', c: '-1.4%', d: 0 },
  { t: 'META', n: 'Meta Platforms', p: '572.10', c: '+2.1%', d: 1 },
  { t: 'AMZN', n: 'Amazon.com', p: '218.90', c: '+0.5%', d: 1 },
  { t: 'GOOGL', n: 'Alphabet Inc.', p: '175.60', c: '-0.3%', d: 0 },
  { t: 'AMD', n: 'Advanced Micro', p: '168.20', c: '+3.4%', d: 1 },
  { t: 'INTC', n: 'Intel Corp.', p: '22.10', c: '-2.1%', d: 0 },
  { t: 'BTC', n: 'Bitcoin', p: '95420', c: '+6.1%', d: 1 },
  { t: 'ETH', n: 'Ethereum', p: '3640', c: '+4.3%', d: 1 },
  { t: 'SOL', n: 'Solana', p: '172.50', c: '+5.8%', d: 1 },
  { t: 'SPY', n: 'S&P 500 ETF', p: '584.20', c: '+0.8%', d: 1 },
  { t: 'QQQ', n: 'NASDAQ 100 ETF', p: '498.10', c: '+1.2%', d: 1 },
  { t: 'TEVA', n: 'Teva Pharma', p: '18.40', c: '+0.9%', d: 1 },
  { t: 'NICE', n: 'NICE Systems', p: '142.30', c: '-0.5%', d: 0 },
];

export const INITIAL_WATCHLIST = [
  { t: 'NVDA', n: 'NVIDIA', p: '924.50', c: '+4.2%', d: 1, base: 870, tr: .0009, vol: .014 },
  { t: 'BTC', n: 'Bitcoin', p: '95,420', c: '+6.1%', d: 1, base: 82000, tr: .0011, vol: .022 },
  { t: 'AAPL', n: 'Apple', p: '213.40', c: '+1.2%', d: 1, base: 200, tr: .0004, vol: .012 },
  { t: 'META', n: 'Meta', p: '572.10', c: '+2.1%', d: 1, base: 540, tr: .0005, vol: .013 },
  { t: 'TSLA', n: 'Tesla', p: '198.30', c: '-1.4%', d: 0, base: 215, tr: -.0004, vol: .018 },
];

export const INITIAL_MY_POSTS = [
  { ticker: 'NVDA', chg: '+4.2%', d: 1, txt: 'פריצה מעל $920 על נפח גבוה, RSI=62. מטרה $980', sent: 'bull', likes: 18, date: 'היום, 09:14', base: 870, tr: .0009, vol: .014 },
  { ticker: 'META', chg: '+2.1%', d: 1, txt: 'Breakout מעל $560. מגמת עלייה ברורה לפני הדוח', sent: 'bull', likes: 11, date: 'אתמול, 14:32', base: 540, tr: .0005, vol: .013 },
  { ticker: 'INTC', chg: '-2.1%', d: 0, txt: 'Intel ממשיכה להאכזב. ציפיות נמוכות לדוח Q2', sent: 'bear', likes: 7, date: '24.05, 11:00', base: 26, tr: -.0004, vol: .016 },
];

export const FEED_POSTS = [
  {
    id: 'p1', ticker: 'NVDA', price: '$924.50', exchange: 'NASDAQ', chg: '+4.2%', d: 1,
    username: 'דניאל לוי ⭐', handle: 'danieltrader', userColor: 'linear-gradient(135deg,#00ff88,#0070f3)', init: 'ד',
    time: 'לפני 14 דק', txt: 'NVDA שוברת resistance ב-$920 על נפח גבוה 🚀 RSI=62, לא overbought. מטרה: $980. ה-AI cycle לא נגמר.',
    bull: 78, likes: 284,
    base: 870, tr: .0009, vol: .014,
    comments: [
      { av: 'מ', color: '#0070f3', user: '@mosh', txt: 'מסכים! $950 עד סוף החודש 🎯' },
      { av: 'ש', color: '#ff6b35', user: '@shira', txt: 'מחכה ל-$900 לפני שאכנס 🙏' },
    ]
  },
  {
    id: 'p2', ticker: 'TSLA', price: '$198.30', exchange: 'NASDAQ', chg: '-1.4%', d: 0,
    username: 'מיכל אברהם', handle: 'michal_fin', userColor: 'linear-gradient(135deg,#ff2d55,#ff9800)', init: 'מ',
    time: 'לפני שעה', txt: 'לא משתכנע מ-TSLA. Head & Shoulders ברור על ה-daily. ממתין ל-$180.',
    bull: 32, likes: 112,
    base: 215, tr: -.0004, vol: .018,
    comments: [
      { av: 'ג', color: '#00ff88', user: '@gal', txt: 'מסכים, Musk מסיח דעת' },
    ]
  },
  {
    id: 'p3', ticker: 'BTC/USD', price: '$95,420', exchange: 'BINANCE', chg: '+6.1%', d: 1,
    username: 'יואב כהן ⭐', handle: 'yoav_crypto', userColor: 'linear-gradient(135deg,#ffd60a,#ff9800)', init: 'י',
    time: 'לפני 3 שע', txt: 'BTC חזר מעל $95k 🔥 Golden Cross על ה-daily. Halving effect מתחיל. Target: $120k Q3 2026.',
    bull: 87, likes: 531,
    base: 82000, tr: .0011, vol: .022,
    comments: [
      { av: 'ל', color: '#bf5fff', user: '@lior', txt: 'HODL forever 💎🙌' },
      { av: 'ת', color: '#00ff88', user: '@tal', txt: 'ETF inflows חזקים השבוע 📈' },
    ]
  },
];
