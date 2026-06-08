import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { onAuthChange, getSession } from '../lib/auth';
import {
  getProfile,
  getMyPosts, createPost as dbCreatePost, deletePost as dbDeletePost,
  getWatchlist, addToWatchlistDB, removeFromWatchlistDB,
  getMySavedIds, savePostDB, unsavePostDB, getSavedPosts,
  getMyLikes, likePost, unlikePost,
  getMyVotes, vote as dbVote,
  getFollowing,
} from '../lib/db';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  /* ── Theme ── */
  const [theme, setTheme] = useState('dark');

  /* ── Navigation ── */
  const [page, setPage]           = useState('onboarding');
  const [prevPage, setPrevPage]   = useState(null);
  const [expandedPost, setExpandedPost] = useState(null);
  const [otherUser, setOtherUser] = useState(null);
  const [currentStock, setCurrentStock] = useState(null);
  const [prefilledTicker, setPrefilledTicker] = useState('');

  /* ── Auth / User ── */
  const [session, setSession]     = useState(null);   // supabase session
  const [user, setUser]           = useState(null);   // auth.users row
  const [profile, setProfile]     = useState(null);   // profiles row
  const [authLoading, setAuthLoading] = useState(true);

  /* ── Data ── */
  const [watchlist, setWatchlist] = useState([]);
  const [myPosts, setMyPosts]     = useState([]);
  const [savedPosts, setSavedPosts] = useState([]);
  const [savedIds, setSavedIds]   = useState([]);     // set of post ids
  const [likedIds, setLikedIds]   = useState([]);
  const [myVotes, setMyVotes]     = useState([]);

  /* ── UI ── */
  const [toast, setToast]         = useState(null);
  const [notifications, setNotifications] = useState(0);
  const [composeOpen, setComposeOpen] = useState(false);

  /* ════════════════════════════════
     HELPERS
  ════════════════════════════════ */
  const showToast = useCallback((msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 2500);
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme(t => {
      const next = t === 'dark' ? 'light' : 'dark';
      document.body.classList.toggle('light', next === 'light');
      return next;
    });
  }, []);

  /* ════════════════════════════════
     NAVIGATION
  ════════════════════════════════ */
  const navigate = useCallback((to, from) => {
    setPrevPage(prev => from ?? prev);
    setPage(to);
  }, []);

  const goBack = useCallback(() => {
    setPage(prev => { setPrevPage(null); return prevPage || 'feed'; });
  }, [prevPage]);

  const openExpandedPost  = useCallback((post, from) => { setExpandedPost(post); navigate('expanded', from); }, [navigate]);
  const openOtherProfile  = useCallback((u, from)    => { setOtherUser(u);       navigate('other-profile', from); }, [navigate]);
  const openStockPage     = useCallback((stock, from) => { setCurrentStock(stock); navigate('stock', from); }, [navigate]);

  /* ════════════════════════════════
     LOAD USER DATA
  ════════════════════════════════ */
  const loadUserData = useCallback(async (uid) => {
    const [
      { data: profileData },
      { data: postsData },
      { data: watchData },
      { data: savedData },
      likedArr,
      votesArr,
    ] = await Promise.all([
      getProfile(uid),
      getMyPosts(uid),
      getWatchlist(uid),
      getSavedPosts(uid),
      getMyLikes(uid),
      getMyVotes(uid),
    ]);

    if (profileData) setProfile(profileData);
    if (postsData)   setMyPosts(postsData);
    if (watchData)   setWatchlist(watchData.map(w => ({
      t: w.ticker, n: w.name, p: w.price, c: w.change_pct, d: w.direction,
      base: w.base, tr: w.tr, vol: w.vol,
    })));
    if (savedData) {
      setSavedPosts(savedData.map(s => s.posts));
      setSavedIds(savedData.map(s => s.post_id));
    }
    setLikedIds(likedArr);
    setMyVotes(votesArr);
  }, []);

  /* ════════════════════════════════
     AUTH STATE LISTENER
  ════════════════════════════════ */
  useEffect(() => {
    // Check existing session on mount
    getSession().then(sess => {
      if (sess) {
        setSession(sess);
        setUser(sess.user);
        loadUserData(sess.user.id).finally(() => setAuthLoading(false));
      } else {
        setAuthLoading(false);
      }
    });

    // Subscribe to future changes
    const sub = onAuthChange(async (event, sess) => {
      setSession(sess);
      setUser(sess?.user ?? null);
      if (sess?.user) {
        // Small delay so Supabase trigger can create profile row
        setTimeout(() => loadUserData(sess.user.id), 800);
        setPage('feed');
      } else {
        // Signed out — clear data
        setProfile(null);
        setMyPosts([]);
        setWatchlist([]);
        setSavedPosts([]);
        setSavedIds([]);
        setLikedIds([]);
        setMyVotes([]);
        setPage('onboarding');
      }
    });

    return () => sub.unsubscribe();
  }, [loadUserData]);

  /* ════════════════════════════════
     WATCHLIST
  ════════════════════════════════ */
  const addToWatchlist = useCallback(async (stock) => {
    if (watchlist.find(s => s.t === stock.t)) return;
    setWatchlist(prev => [...prev, stock]);
    showToast(`${stock.t} נוסף לרשימת המעקב ✓`);
    if (user) {
      await addToWatchlistDB(user.id, {
        ticker: stock.t, name: stock.n, price: stock.p,
        change_pct: stock.c, direction: stock.d,
        base: stock.base, tr: stock.tr, vol: stock.vol,
      });
    }
  }, [watchlist, user, showToast]);

  const removeFromWatchlist = useCallback(async (ticker) => {
    setWatchlist(prev => prev.filter(s => s.t !== ticker));
    if (user) await removeFromWatchlistDB(user.id, ticker);
  }, [user]);

  /* ════════════════════════════════
     POSTS
  ════════════════════════════════ */
  const addPost = useCallback(async (post) => {
    if (!user) { showToast('יש להתחבר תחילה', 'error'); return; }
    const dbPost = {
      user_id: user.id,
      ticker: post.ticker,
      text: post.txt,
      sentiment: post.sent,
      likes: 0,
      price: post.chg,
      change_pct: post.chg,
      direction: post.d ?? 1,
      base: post.base,
      tr: post.tr,
      vol: post.vol,
    };
    const { data, error } = await dbCreatePost(dbPost);
    if (error) { showToast('שגיאה בפרסום', 'error'); return; }
    setMyPosts(prev => [data, ...prev]);
    showToast('הניתוח פורסם! ✓');
    return data;
  }, [user, showToast]);

  const removePost = useCallback(async (postId) => {
    await dbDeletePost(postId);
    setMyPosts(prev => prev.filter(p => p.id !== postId));
    showToast('הפוסט נמחק');
  }, []);

  /* ════════════════════════════════
     SAVE / LIKE / VOTE
  ════════════════════════════════ */
  const savePost = useCallback(async (post) => {
    if (!user) { showToast('יש להתחבר תחילה', 'error'); return; }
    const isSaved = savedIds.includes(post.id);
    if (isSaved) {
      setSavedIds(prev => prev.filter(id => id !== post.id));
      setSavedPosts(prev => prev.filter(p => p.id !== post.id));
      showToast('הוסר מהשמורים');
      await unsavePostDB(user.id, post.id);
    } else {
      setSavedIds(prev => [...prev, post.id]);
      setSavedPosts(prev => [post, ...prev]);
      showToast('נשמר! ✓');
      await savePostDB(user.id, post.id);
    }
  }, [user, savedIds, showToast]);

  const toggleLike = useCallback(async (postId) => {
    if (!user) { showToast('יש להתחבר תחילה', 'error'); return; }
    const isLiked = likedIds.includes(postId);
    if (isLiked) {
      setLikedIds(prev => prev.filter(id => id !== postId));
      await unlikePost(postId, user.id);
    } else {
      setLikedIds(prev => [...prev, postId]);
      await likePost(postId, user.id);
    }
  }, [user, likedIds, showToast]);

  const castVote = useCallback(async (postId, direction) => {
    if (!user) { showToast('יש להתחבר תחילה', 'error'); return; }
    setMyVotes(prev => {
      const existing = prev.find(v => v.post_id === postId);
      if (existing) return prev.map(v => v.post_id === postId ? { ...v, direction } : v);
      return [...prev, { post_id: postId, direction }];
    });
    await dbVote(postId, user.id, direction);
  }, [user, showToast]);

  return (
    <AppContext.Provider value={{
      /* theme */
      theme, toggleTheme,
      /* navigation */
      page, navigate, goBack, prevPage,
      expandedPost, openExpandedPost,
      otherUser, openOtherProfile,
      currentStock, openStockPage,
      prefilledTicker, setPrefilledTicker,
      /* auth */
      session, user, profile, authLoading,
      /* data */
      watchlist, addToWatchlist, removeFromWatchlist,
      myPosts, addPost, removePost,
      savedPosts, savedIds, savePost,
      likedIds, toggleLike,
      myVotes, castVote,
      /* ui */
      toast, showToast,
      notifications, setNotifications,
      composeOpen, setComposeOpen,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);
