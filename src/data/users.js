export const USERS_DATA = {
  danieltrader: {
    name: 'דניאל לוי', handle: '@danieltrader', init: 'ד',
    color: 'linear-gradient(135deg,#00ff88,#0070f3)',
    bio: 'טריידר טכני מזה 8 שנים | מתמחה ב-momentum ו-breakouts | NVDA 🚀',
    posts: 28, acc: 78, bullAcc: 82, bearAcc: 71, followers: '8.2K', following: '124', pnl: '+31%',
    bannerColor: '#00ff88',
    analyses: [
      { ticker: 'NVDA', chg: '+4.2%', d: 1, txt: 'פריצה מעל $920 על נפח גבוה. Target $980 🚀', sent: 'bull', likes: 284, date: 'היום', base: 870, tr: .0009, vol: .014 },
      { ticker: 'META', chg: '+2.1%', d: 1, txt: 'Breakout מעל $560. מגמת עלייה לפני הדוח', sent: 'bull', likes: 156, date: 'אתמול', base: 540, tr: .0005, vol: .013 },
      { ticker: 'AMD', chg: '+3.4%', d: 1, txt: 'AMD עוקבת אחרי NVDA. Target $185', sent: 'bull', likes: 98, date: '24.05', base: 155, tr: .0007, vol: .016 },
    ]
  },
  yoav_crypto: {
    name: 'יואב כהן', handle: '@yoav_crypto', init: 'י',
    color: 'linear-gradient(135deg,#ffd60a,#ff9800)',
    bio: 'קריפטו מאניאק | BTC HODLer מ-2017 | מנתח on-chain data 🔗',
    posts: 34, acc: 87, bullAcc: 89, bearAcc: 81, followers: '12K', following: '89', pnl: '+67%',
    bannerColor: '#ffd60a',
    analyses: [
      { ticker: 'BTC', chg: '+6.1%', d: 1, txt: 'Golden Cross על daily. Target $120k Q3 2026 💎', sent: 'bull', likes: 531, date: 'היום', base: 82000, tr: .0011, vol: .022 },
      { ticker: 'ETH', chg: '+4.3%', d: 1, txt: 'Pectra upgrade מחזק את ETH. Target $4k', sent: 'bull', likes: 278, date: 'אתמול', base: 3200, tr: .0008, vol: .020 },
      { ticker: 'SOL', chg: '+5.8%', d: 1, txt: 'SOL שוברת $170. Momentum חזק מאוד', sent: 'bull', likes: 189, date: '23.05', base: 145, tr: .001, vol: .025 },
    ]
  },
  michal_fin: {
    name: 'מיכל אברהם', handle: '@michal_fin', init: 'מ',
    color: 'linear-gradient(135deg,#ff2d55,#ff9800)',
    bio: 'אנליסטית ערך | שונאת hype | מאמינה בפונדמנטלס בלבד 📊',
    posts: 15, acc: 68, bullAcc: 61, bearAcc: 74, followers: '3.1K', following: '201', pnl: '+18%',
    bannerColor: '#ff2d55',
    analyses: [
      { ticker: 'TSLA', chg: '-1.4%', d: 0, txt: 'H&S ברור על daily. ממתין ל-$180 לפני כניסה', sent: 'bear', likes: 112, date: 'היום', base: 215, tr: -.0004, vol: .018 },
      { ticker: 'INTC', chg: '-2.1%', d: 0, txt: 'Intel ממשיכה להאכזב. Q2 יהיה חלש', sent: 'bear', likes: 67, date: 'אתמול', base: 26, tr: -.0004, vol: .016 },
    ]
  },
  noa_macro: {
    name: 'נועה גל', handle: '@noa_macro', init: 'נ',
    color: 'linear-gradient(135deg,#a855f7,#4da6ff)',
    bio: 'מאקרו אקונומיסטית | Fed watcher | אוהבת data 📈',
    posts: 19, acc: 74, bullAcc: 70, bearAcc: 78, followers: '5.1K', following: '167', pnl: '+22%',
    bannerColor: '#a855f7',
    analyses: [
      { ticker: 'SPY', chg: '+0.8%', d: 1, txt: 'Fed dovish surprise — risk-on. SPY target $600', sent: 'bull', likes: 203, date: 'היום', base: 560, tr: .0002, vol: .009 },
      { ticker: 'GOOGL', chg: '-0.3%', d: 0, txt: 'Regulatory risk מתגבר. זהירות לטווח קצר', sent: 'bear', likes: 134, date: 'אתמול', base: 180, tr: -.0001, vol: .012 },
    ]
  },
};

export const SAMPLE_COMMENTS = {
  NVDA: [
    { user: 'מוש טריידס', handle: 'mosh_trades', init: 'מ', color: '#0070f3', time: 'לפני 8 דק', sent: 'bull', txt: 'מסכים! $950 עד סוף החודש בבטחה 🎯', likes: 12 },
    { user: 'שירה השקעות', handle: 'shira_inv', init: 'ש', color: '#ff6b35', time: 'לפני 22 דק', sent: 'bear', txt: 'מחכה ל-pullback ל-$900 לפני שאכנס 🙏', likes: 7 },
    { user: 'נועה מאקרו', handle: 'noa_macro', init: 'נ', color: '#a855f7', time: 'לפני שעה', sent: 'bull', txt: 'Blackwell ramp מפתיע לטובה, data center demand ממשיך 🔥', likes: 19 },
  ],
  'BTC/USD': [
    { user: 'ליאור הודל', handle: 'lior_hodl', init: 'ל', color: '#bf5fff', time: 'לפני 2 דק', sent: 'bull', txt: 'HODL forever 💎🙌 never selling below $200k', likes: 45 },
    { user: 'טל דפי', handle: 'tal_defi', init: 'ת', color: '#ff2d55', time: 'לפני 18 דק', sent: 'bear', txt: 'Overbought על weekly RSI — ציפיה ל-pullback ל-$88k', likes: 17 },
  ],
  TSLA: [
    { user: 'גל שפיר', handle: 'gal_trades', init: 'ג', color: '#00ff88', time: 'לפני 15 דק', sent: 'bear', txt: 'מסכים 100%, Musk עסוק ב-X ו-SpaceX, TSLA מוזנחת 😤', likes: 8 },
    { user: 'איל בולס', handle: 'eyal_bulls', init: 'א', color: '#4da6ff', time: 'לפני 45 דק', sent: 'bull', txt: 'לא מסכים! FSD v13 משנה הכל — Robotaxi יגיע 🚗', likes: 14 },
  ],
};
