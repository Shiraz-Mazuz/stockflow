import { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { updateProfile } from '../lib/db';

const AVATAR_COLORS = [
  'linear-gradient(135deg,#00ff88,#4da6ff)',
  'linear-gradient(135deg,#ff2d55,#ff9500)',
  'linear-gradient(135deg,#4da6ff,#bf5af2)',
  'linear-gradient(135deg,#ffd60a,#ff9500)',
  'linear-gradient(135deg,#bf5af2,#ff2d55)',
  'linear-gradient(135deg,#00ff88,#ffd60a)',
  'linear-gradient(135deg,#ff6b6b,#ee5a24)',
  'linear-gradient(135deg,#a29bfe,#6c5ce7)',
];

export default function EditProfileModal({ onClose }) {
  const { profile, user, setProfile: setCtxProfile } = useApp();

  const [name, setName]         = useState(profile?.name || '');
  const [handle, setHandle]     = useState(profile?.handle || '');
  const [bio, setBio]           = useState(profile?.bio || '');
  const [birthYear, setBirthYear] = useState(profile?.birth_year || '');
  const [location, setLocation] = useState(profile?.location || '');
  const [twitter, setTwitter]   = useState(profile?.twitter || '');
  const [avatarColor, setAvatarColor] = useState(profile?.avatar_color || AVATAR_COLORS[0]);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState('');

  const displayInit = name?.[0]?.toUpperCase() || '?';

  const handleSave = async () => {
    if (!name.trim()) { setError('שם הוא שדה חובה'); return; }
    if (!handle.trim()) { setError('כינוי הוא שדה חובה'); return; }
    setLoading(true);
    setError('');

    const updates = {
      name: name.trim(),
      handle: handle.trim().replace(/^@/, ''),
      bio: bio.trim(),
      birth_year: birthYear ? parseInt(birthYear) : null,
      location: location.trim(),
      twitter: twitter.trim(),
      avatar_color: avatarColor,
      init: name.trim()[0]?.toUpperCase() || '?',
    };

    const { data, error: dbError } = await updateProfile(user.id, updates);
    setLoading(false);
    if (dbError) { setError('שגיאה בשמירה, נסי שוב'); return; }
    if (data && typeof useApp === 'function') {
      // update context profile
    }
    onClose(data || updates);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" style={{ maxHeight: '90vh', overflowY: 'auto' }} onClick={e => e.stopPropagation()}>
        <div className="m-head">
          <div className="m-title">✏️ עריכת פרופיל</div>
          <div className="m-close" onClick={onClose}>✕</div>
        </div>

        <div className="m-body">

          {/* Avatar color picker */}
          <div className="m-label">צבע אווטאר</div>
          <div style={{ display: 'flex', gap: 10, marginBottom: 16, flexWrap: 'wrap' }}>
            {AVATAR_COLORS.map(color => (
              <div
                key={color}
                onClick={() => setAvatarColor(color)}
                style={{
                  width: 44, height: 44, borderRadius: '50%',
                  background: color, cursor: 'pointer',
                  border: avatarColor === color ? '3px solid var(--green)' : '3px solid transparent',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 16, fontWeight: 700, color: '#fff',
                  transition: 'border .2s',
                }}
              >
                {displayInit}
              </div>
            ))}
          </div>

          {/* Name */}
          <div className="m-label">שם מלא *</div>
          <input
            className="s-inp"
            placeholder="שם מלא"
            value={name}
            onChange={e => setName(e.target.value)}
            style={{ marginBottom: 12 }}
          />

          {/* Handle */}
          <div className="m-label">כינוי (Username) *</div>
          <input
            className="s-inp"
            placeholder="my_handle"
            value={handle}
            onChange={e => setHandle(e.target.value.replace(/\s/g, '_').toLowerCase())}
            style={{ marginBottom: 12 }}
          />

          {/* Bio */}
          <div className="m-label">ביוגרפיה</div>
          <textarea
            className="ta"
            placeholder="ספר על עצמך... סגנון מסחר, מניות מועדפות"
            value={bio}
            onChange={e => setBio(e.target.value)}
            rows={3}
            maxLength={160}
            style={{ marginBottom: 4 }}
          />
          <div className="m-char" style={{ marginBottom: 12 }}>{bio.length}/160</div>

          {/* Birth year */}
          <div className="m-label">שנת לידה</div>
          <input
            className="s-inp"
            placeholder="לדוגמה: 1995"
            type="number"
            min="1940"
            max="2010"
            value={birthYear}
            onChange={e => setBirthYear(e.target.value)}
            style={{ marginBottom: 12 }}
          />

          {/* Location */}
          <div className="m-label">מיקום</div>
          <input
            className="s-inp"
            placeholder="תל אביב, ישראל"
            value={location}
            onChange={e => setLocation(e.target.value)}
            style={{ marginBottom: 12 }}
          />

          {/* Twitter/X */}
          <div className="m-label">טוויטר / X</div>
          <input
            className="s-inp"
            placeholder="@username"
            value={twitter}
            onChange={e => setTwitter(e.target.value)}
            style={{ marginBottom: 16 }}
          />

          {error && (
            <div style={{ color: 'var(--red)', fontSize: 13, marginBottom: 12, textAlign: 'center' }}>
              ⚠️ {error}
            </div>
          )}

          <button className="m-submit" onClick={handleSave} disabled={loading}>
            {loading ? '⏳ שומר...' : '💾 שמור שינויים'}
          </button>
        </div>
      </div>
    </div>
  );
}
