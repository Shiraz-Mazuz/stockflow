import { useState } from 'react';
import { useApp } from '../context/AppContext';

export default function NotificationsPage() {
  const { setNotifications, navigate } = useApp();
  const [tab, setTab] = useState('activity');

  const handleTabChange = (t) => {
    setTab(t);
    setNotifications(0);
  };

  return (
    <div className="page" id="notif-page">
      <div className="notif-inner">
        <div className="notif-header">
          <div className="notif-title">🔔 התראות</div>
        </div>

        <div className="notif-tabs">
          <div className={`notif-tab ${tab === 'activity' ? 'on' : ''}`} onClick={() => handleTabChange('activity')}>📊 פעילות</div>
          <div className={`notif-tab ${tab === 'social' ? 'on' : ''}`} onClick={() => handleTabChange('social')}>❤️ חברתי</div>
          <div className={`notif-tab ${tab === 'alerts' ? 'on' : ''}`} onClick={() => handleTabChange('alerts')}>🚨 התראות מחיר</div>
        </div>

        {tab === 'activity' && (
          <div className="notif-content on">
            <div className="notif-group-date">היום</div>
            <div className="notif-item unread" onClick={() => navigate('feed')}>
              <div className="notif-av" style={{ background: 'linear-gradient(135deg,#ffd60a,#ff9800)', color: '#000' }}>
                י<div className="notif-badge">💬</div>
              </div>
              <div className="notif-body">
                <div className="notif-text"><strong>יואב כהן</strong> הגיב על הניתוח שלך על NVDA</div>
                <div className="notif-preview">Blackwell demand חזק! מסכים לחלוטין 🔥</div>
                <div className="notif-time">לפני 5 דקות</div>
              </div>
              <div className="notif-dot" />
            </div>
            <div className="notif-item unread">
              <div className="notif-av" style={{ background: 'linear-gradient(135deg,#00ff88,#0070f3)', color: '#000' }}>
                ד<div className="notif-badge">❤️</div>
              </div>
              <div className="notif-body">
                <div className="notif-text"><strong>דניאל לוי</strong> לייקד את הניתוח שלך על META</div>
                <div className="notif-time">לפני 22 דקות</div>
              </div>
              <div className="notif-dot" />
            </div>
            <div className="notif-item unread">
              <div className="notif-av" style={{ background: 'linear-gradient(135deg,#ff2d55,#ff9800)', color: '#fff' }}>
                מ<div className="notif-badge">🏆</div>
              </div>
              <div className="notif-body">
                <div className="notif-text">הניתוח שלך על <strong>NVDA</strong> נכנס ל-Top 10 השבוע!</div>
                <div className="notif-preview">18 לייקים · 5 תגובות · דיוק: 76%</div>
                <div className="notif-time">לפני שעה</div>
              </div>
              <div className="notif-dot" />
            </div>
            <div className="notif-group-date">אתמול</div>
            <div className="notif-item">
              <div className="notif-av" style={{ background: 'linear-gradient(135deg,#bf5fff,#4da6ff)', color: '#fff' }}>
                ר<div className="notif-badge">💬</div>
              </div>
              <div className="notif-body">
                <div className="notif-text"><strong>רועי שפיר</strong> הגיב על הניתוח שלך על BTC</div>
                <div className="notif-preview">$100k עד סוף יוני בטוח! 🔥</div>
                <div className="notif-time">אתמול, 18:42</div>
              </div>
            </div>
            <div className="notif-item">
              <div className="notif-av" style={{ background: 'rgba(255,45,85,.15)', color: 'var(--red)', fontSize: 20 }}>📉</div>
              <div className="notif-body">
                <div className="notif-text"><strong style={{ color: 'var(--red)' }}>TSLA</strong> ירדה מתחת ל-$200 — רמת מעקב שלך</div>
                <div className="notif-alert-txt" style={{ fontSize: 12, color: 'var(--muted2)', marginTop: 4 }}>מחיר נוכחי: $198.30 · -1.4% היום</div>
                <div className="notif-time">אתמול, 14:20</div>
              </div>
            </div>
            <div className="notif-item">
              <div className="notif-av" style={{ background: 'rgba(0,255,136,.12)', color: 'var(--green)', fontSize: 18 }}>🏆</div>
              <div className="notif-body">
                <div className="notif-text">הניתוח שלך על <strong>NVDA</strong> נכנס ל-Top 10 השבוע!</div>
                <div className="notif-preview">47 לייקים · 12 תגובות · דיוק: 78%</div>
                <div className="notif-time">אתמול, 09:15</div>
              </div>
            </div>
          </div>
        )}

        {tab === 'social' && (
          <div className="notif-content on">
            <div className="notif-group-date">היום</div>
            <div className="notif-item unread">
              <div className="notif-av" style={{ background: 'linear-gradient(135deg,#ffd60a,#ff9800)', color: '#000' }}>י<div className="notif-badge">❤️</div></div>
              <div className="notif-body">
                <div className="notif-text"><strong>יואב כהן</strong> לייקד את הניתוח שלך על NVDA</div>
                <div className="notif-time">לפני 5 דקות</div>
              </div>
              <div className="notif-dot" />
            </div>
            <div className="notif-item unread">
              <div className="notif-av" style={{ background: 'linear-gradient(135deg,#0070f3,#a855f7)', color: '#fff' }}>ד<div className="notif-badge">💬</div></div>
              <div className="notif-body">
                <div className="notif-text"><strong>דניאל לוי</strong> הגיב: "מסכים לגמרי! RSI מאשר 📈"</div>
                <div className="notif-time">לפני 12 דקות</div>
              </div>
              <div className="notif-dot" />
            </div>
            <div className="notif-item unread">
              <div className="notif-av" style={{ background: 'linear-gradient(135deg,#00ff88,#0070f3)', color: '#000' }}>מ<div className="notif-badge">👤</div></div>
              <div className="notif-body">
                <div className="notif-text"><strong>מיכל אברהם</strong> התחילה לעקוב אחריך</div>
                <div className="notif-time">לפני 28 דקות</div>
              </div>
              <div className="notif-dot" />
            </div>
          </div>
        )}

        {tab === 'alerts' && (
          <div className="notif-content on">
            <div className="notif-alert-card">
              <div className="notif-alert-top">
                <div className="notif-alert-icon">🚀</div>
                <div className="notif-alert-ticker" style={{ color: 'var(--green)' }}>NVDA</div>
                <div className="notif-alert-chg" style={{ color: 'var(--green)' }}>+4.2%</div>
              </div>
              <div className="notif-alert-txt">עלתה מעל יעד $920 · מחיר נוכחי <strong>$924.50</strong></div>
              <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 6, fontFamily: "'IBM Plex Mono',monospace" }}>לפני שעה</div>
            </div>
            <div className="notif-alert-card">
              <div className="notif-alert-top">
                <div className="notif-alert-icon">📉</div>
                <div className="notif-alert-ticker" style={{ color: 'var(--red)' }}>TSLA</div>
                <div className="notif-alert-chg" style={{ color: 'var(--red)' }}>-1.4%</div>
              </div>
              <div className="notif-alert-txt">ירדה מתחת ל-$200 · מחיר נוכחי <strong>$198.30</strong></div>
              <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 6, fontFamily: "'IBM Plex Mono',monospace" }}>אתמול, 14:20</div>
            </div>
            <div className="notif-alert-card">
              <div className="notif-alert-top">
                <div className="notif-alert-icon">🔥</div>
                <div className="notif-alert-ticker" style={{ color: 'var(--gold)' }}>BTC</div>
                <div className="notif-alert-chg" style={{ color: 'var(--gold)' }}>+6.1%</div>
              </div>
              <div className="notif-alert-txt">חצה מעל $95,000 · מחיר נוכחי <strong>$95,420</strong></div>
              <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 6, fontFamily: "'IBM Plex Mono',monospace" }}>לפני 3 שעות</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
