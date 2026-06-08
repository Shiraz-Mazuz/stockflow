import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { signUpEmail, signInEmail, signInGoogle } from '../lib/auth';

const SLIDES = [
  {
    emoji: '📊',
    title: <>נתח מניות<br />כמו <span>מקצוען</span></>,
    desc: 'שתף ניתוחים טכניים, קרא דעות של טריידרים אחרים, ועקוב אחרי מניות שמעניינות אותך.',
    preview: (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <div style={{ background: 'var(--s2)', borderRadius: 10, padding: '10px 14px', border: '1px solid var(--border)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: 'var(--green)', fontFamily: "'IBM Plex Mono',monospace", fontWeight: 700 }}>NVDA</span>
            <span style={{ color: 'var(--green)', fontSize: 13 }}>+4.2% ↑</span>
          </div>
          <div style={{ fontSize: 12, color: 'var(--muted2)', marginTop: 4 }}>פריצה מעל $920 על נפח גבוה 🚀</div>
        </div>
        <div style={{ background: 'var(--s2)', borderRadius: 10, padding: '10px 14px', border: '1px solid var(--border)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: 'var(--gold)', fontFamily: "'IBM Plex Mono',monospace", fontWeight: 700 }}>BTC</span>
            <span style={{ color: 'var(--green)', fontSize: 13 }}>+6.1% ↑</span>
          </div>
          <div style={{ fontSize: 12, color: 'var(--muted2)', marginTop: 4 }}>Golden Cross על ה-daily 💎</div>
        </div>
      </div>
    ),
  },
  {
    emoji: '🔥',
    title: <>פיד <span>חי</span><br />כמו TikTok</>,
    desc: 'גלול דרך ניתוחים בזמן אמת. לייק, הגב, ותן את דעתך על כל מניה.',
    preview: (
      <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 24 }}>🐂</div>
          <div style={{ color: 'var(--green)', fontSize: 13, fontWeight: 700 }}>78%</div>
          <div style={{ color: 'var(--muted2)', fontSize: 11 }}>בול</div>
        </div>
        <div style={{ width: 1, background: 'var(--border)' }} />
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 24 }}>🐻</div>
          <div style={{ color: 'var(--red)', fontSize: 13, fontWeight: 700 }}>22%</div>
          <div style={{ color: 'var(--muted2)', fontSize: 11 }}>בר</div>
        </div>
      </div>
    ),
  },
  {
    emoji: '📡',
    title: <>מחירים <span>אמיתיים</span><br />בזמן אמת</>,
    desc: 'גרפים חיים, מחירים מעודכנים, ונתונים ישירות מהבורסה — הכל במקום אחד.',
    preview: (
      <div style={{ fontSize: 13, color: 'var(--muted2)', display: 'flex', flexDirection: 'column', gap: 6 }}>
        {[['NVDA', '$924.50', '+4.2%', 'green'], ['TSLA', '$198.30', '-1.4%', 'red'], ['BTC', '$95,420', '+6.1%', 'green']].map(([t, p, c, col]) => (
          <div key={t} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid var(--border)' }}>
            <span style={{ color: `var(--${col})`, fontFamily: "'IBM Plex Mono',monospace", fontWeight: 700 }}>{t}</span>
            <span style={{ fontFamily: "'IBM Plex Mono',monospace" }}>{p}</span>
            <span style={{ color: `var(--${col})` }}>{c}</span>
          </div>
        ))}
      </div>
    ),
  },
  {
    emoji: '🏆',
    title: <>בנה את ה-<span>מוניטין</span><br />שלך</>,
    desc: 'כל ניתוח שפרסמת נמדד. עלה בדירוג, צבור עוקבים, הפוך למומחה.',
    preview: (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, alignItems: 'center' }}>
          <span style={{ color: 'var(--muted2)' }}>דיוק תחזיות</span>
          <span style={{ color: 'var(--green)', fontFamily: "'IBM Plex Mono',monospace", fontWeight: 700 }}>78%</span>
        </div>
        <div style={{ height: 6, background: 'var(--border)', borderRadius: 3, overflow: 'hidden' }}>
          <div style={{ width: '78%', height: '100%', background: 'var(--green)', borderRadius: 3 }} />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, alignItems: 'center', marginTop: 4 }}>
          <span style={{ color: 'var(--muted2)' }}>P&L מצטבר</span>
          <span style={{ color: 'var(--gold)', fontFamily: "'IBM Plex Mono',monospace", fontWeight: 700 }}>+31%</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, alignItems: 'center' }}>
          <span style={{ color: 'var(--muted2)' }}>דירוג</span>
          <span style={{ fontFamily: "'IBM Plex Mono',monospace", fontWeight: 700 }}>#3 🥉 השבוע</span>
        </div>
      </div>
    ),
  },
];

/* ── Google icon SVG ── */
const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 48 48">
    <path fill="#FFC107" d="M43.6 20H24v8h11.3C33.7 33.5 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.1 8 3l5.7-5.7C34.2 6.2 29.4 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20c11 0 20-8 20-20 0-1.3-.1-2.7-.4-4z"/>
    <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.5 16.1 18.9 13 24 13c3.1 0 5.9 1.1 8 3l5.7-5.7C34.2 6.2 29.4 4 24 4 16.3 4 9.6 8.4 6.3 14.7z"/>
    <path fill="#4CAF50" d="M24 44c5.2 0 9.9-1.9 13.5-5l-6.2-5.2C29.4 35.6 26.8 36.5 24 36.5c-5.2 0-9.6-3.4-11.2-8.2l-6.5 5C9.5 39.5 16.2 44 24 44z"/>
    <path fill="#1565C0" d="M43.6 20H24v8h11.3c-.8 2.5-2.4 4.6-4.6 6l6.2 5.2C40.5 35.5 44 30.2 44 24c0-1.3-.1-2.7-.4-4z"/>
  </svg>
);

/* ════════════════════════════════
   SPLASH SCREEN
════════════════════════════════ */
function SplashScreen({ onDone }) {
  return (
    <div className="splash-screen" onClick={onDone} style={{ cursor: 'pointer' }}>
      <div className="splash-name">Stock<span>Flow</span></div>
      <div className="splash-tagline">TRADE SMARTER · TOGETHER</div>
      <div style={{ marginTop: 40, fontSize: 13, color: 'var(--muted)', animation: 'fadeUp 1s 0.8s ease both' }}>
        הקש להמשיך
      </div>
    </div>
  );
}

/* ════════════════════════════════
   AUTH SCREEN (signup + login)
════════════════════════════════ */
function AuthScreen() {
  const { showToast } = useApp();
  const [mode, setMode] = useState('signup'); // 'signup' | 'login'
  const [name, setName]       = useState('');
  const [email, setEmail]     = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const handleSubmit = async () => {
    if (!email || !password) { showToast('מלא אימייל וסיסמה', 'error'); return; }
    if (mode === 'signup' && !name) { showToast('מלא שם מלא', 'error'); return; }
    setLoading(true);
    try {
      if (mode === 'signup') {
        const { error } = await signUpEmail(email, password, name);
        if (error) { showToast(error.message, 'error'); return; }
        showToast('ברוך הבא! בדוק את האימייל לאישור ✓');
      } else {
        const { error } = await signInEmail(email, password);
        if (error) { showToast('אימייל או סיסמה שגויים', 'error'); return; }
        // Navigation handled by onAuthChange in AppContext
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setGoogleLoading(true);
    const { error } = await signInGoogle();
    if (error) { showToast(error.message, 'error'); setGoogleLoading(false); }
    // On success, browser redirects to Google — no need to set loading false
  };

  return (
    <div className="signup-screen">
      <div className="signup-title">
        {mode === 'signup' ? <>מצטרף ל-<span style={{ color: 'var(--green)' }}>StockFlow</span></> : <>ברוך הבא בחזרה 👋</>}
      </div>
      <div className="signup-sub">
        {mode === 'signup' ? 'הצטרף לאלפי משקיעים שכבר מנתחים ביחד' : 'התחבר לחשבון שלך'}
      </div>

      {mode === 'signup' && (
        <input
          className="signup-field"
          placeholder="שם מלא"
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
        />
      )}
      <input
        className="signup-field"
        placeholder="אימייל"
        type="email"
        value={email}
        onChange={e => setEmail(e.target.value)}
      />
      <input
        className="signup-field"
        placeholder="סיסמה"
        type="password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        onKeyDown={e => e.key === 'Enter' && handleSubmit()}
      />

      <button className="signup-btn" onClick={handleSubmit} disabled={loading}>
        {loading ? '⏳ רגע...' : mode === 'signup' ? '🚀 יאללה, מצטרף!' : '🔑 התחבר'}
      </button>

      <div className="signup-or">— או —</div>

      <button className="signup-google" onClick={handleGoogle} disabled={googleLoading}>
        {googleLoading ? <span>⏳</span> : <GoogleIcon />}
        &nbsp;{googleLoading ? 'מתחבר...' : 'המשך עם Google'}
      </button>

      <div className="signup-login">
        {mode === 'signup'
          ? <>כבר יש חשבון? <span onClick={() => setMode('login')}>התחבר</span></>
          : <>עדיין אין חשבון? <span onClick={() => setMode('signup')}>הרשם</span></>
        }
      </div>
    </div>
  );
}

/* ════════════════════════════════
   MAIN ONBOARDING
════════════════════════════════ */
export default function Onboarding() {
  const [step, setStep] = useState('splash'); // splash | slides | auth
  const [slideIdx, setSlideIdx] = useState(0);

  if (step === 'splash') {
    return (
      <div className="onboard-overlay">
        <SplashScreen onDone={() => setStep('slides')} />
      </div>
    );
  }

  if (step === 'auth') {
    return (
      <div className="onboard-overlay">
        <AuthScreen />
      </div>
    );
  }

  const slide = SLIDES[slideIdx];
  const isLast = slideIdx === SLIDES.length - 1;

  return (
    <div className="onboard-overlay">
      <div className="slides-screen">
        <div className="slide active">
          <div className="slide-emoji">{slide.emoji}</div>
          <div className="slide-title">{slide.title}</div>
          <div className="slide-preview">{slide.preview}</div>
          <div className="slide-desc">{slide.desc}</div>
        </div>

        <div className="slide-dots">
          {SLIDES.map((_, i) => (
            <div key={i} className={`slide-dot ${i === slideIdx ? 'on' : ''}`} onClick={() => setSlideIdx(i)} />
          ))}
        </div>

        <div className="slide-nav">
          <div className="slide-skip" onClick={() => setStep('auth')}>דלג</div>
          <button
            className="slide-next"
            onClick={() => isLast ? setStep('auth') : setSlideIdx(i => i + 1)}
          >
            {isLast ? 'בואו נתחיל! 🚀' : 'הבא ←'}
          </button>
        </div>
      </div>
    </div>
  );
}
