import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Shield, Menu, X, LayoutDashboard, LogOut, Scan } from 'lucide-react';

const PROFILE_IMG_KEY = 'cybershield_profile_image';

const Navbar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  // Profile image state — synced with SettingsPage via custom event
  const [profileImage, setProfileImage] = useState(() => localStorage.getItem(PROFILE_IMG_KEY) || null);

  useEffect(() => {
    const handler = (e) => setProfileImage(e.detail);
    window.addEventListener('profile-image-updated', handler);
    return () => window.removeEventListener('profile-image-updated', handler);
  }, []);

  const handleLogout = () => { logout(); navigate('/login'); };
  const isActive = (path) => location.pathname === path;

  const defaultAvatar = `https://api.dicebear.com/7.x/notionists/svg?seed=${user?.name || 'Felix'}&backgroundColor=d1fae5`;
  const avatarSrc = profileImage || defaultAvatar;

  const navLinks = [
    { to: '/scan', label: 'Scan', icon: Scan },
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  ];

  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
      background: 'rgba(255,255,255,0.92)',
      backdropFilter: 'blur(12px)',
      WebkitBackdropFilter: 'blur(12px)',
      borderBottom: '1px solid #e5e7eb',
      fontFamily: "'Inter', system-ui, sans-serif",
      padding: '0 24px'
    }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          height: '56px',
          width: '100%'
        }}>

          {/* Left: Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0', flexShrink: 0 }}>
            <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
              <img src="/logo.png" alt="CyberShield" style={{ width: '32px', height: '32px', objectFit: 'contain' }} />
              <span style={{ fontSize: '1rem', fontWeight: 700, color: '#111827' }}>CyberShield</span>
            </Link>

            {/* Desktop nav links (only when logged in) */}
            {user && (
              <div className="hidden-sm" style={{ display: 'flex', alignItems: 'center', gap: '4px', marginLeft: '28px' }}>
                {navLinks.map(({ to, label, icon: Icon }) => (
                  <Link key={to} to={to}>
                    <div style={{
                      display: 'flex', alignItems: 'center', gap: '6px',
                      padding: '6px 12px', borderRadius: '8px',
                      fontSize: '0.8125rem', fontWeight: 500,
                      color: isActive(to) ? '#059669' : '#6b7280',
                      background: isActive(to) ? '#ecfdf5' : 'transparent',
                      transition: 'all 0.15s'
                    }}>
                      <Icon style={{ width: '16px', height: '16px' }} />
                      {label}
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Right: Auth Buttons or User Info */}
          <div className="hidden-sm" style={{ display: 'flex', alignItems: 'center', gap: '10px', marginLeft: 'auto' }}>
            {user ? (
              <>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', paddingLeft: '12px', borderLeft: '1px solid #e5e7eb' }}>
                  <div style={{ textAlign: 'right' }}>
                    <p style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#111827', margin: 0, lineHeight: 1.3 }}>{user.name}</p>
                    <p style={{ fontSize: '0.6875rem', color: '#9ca3af', margin: 0 }}>Authenticated</p>
                  </div>
                  <img
                    src={avatarSrc}
                    alt="avatar"
                    style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#ecfdf5', border: '1px solid #a7f3d0', objectFit: 'cover' }}
                  />
                </div>
                <button onClick={handleLogout} title="Logout"
                  style={{
                    width: '32px', height: '32px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    borderRadius: '6px', border: 'none', background: 'none',
                    color: '#9ca3af', cursor: 'pointer'
                  }}>
                  <LogOut style={{ width: '16px', height: '16px' }} />
                </button>
              </>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Link to="/login">
                  <button style={{
                    padding: '7px 18px', borderRadius: '8px',
                    fontSize: '0.8125rem', fontWeight: 600,
                    color: '#374151', background: 'none', border: '1px solid #e5e7eb',
                    cursor: 'pointer', fontFamily: 'inherit',
                    transition: 'all 0.15s'
                  }}>Sign In</button>
                </Link>
                <Link to="/register">
                  <button style={{
                    padding: '7px 18px', borderRadius: '8px',
                    fontSize: '0.8125rem', fontWeight: 600,
                    color: '#fff', background: '#059669', border: 'none',
                    cursor: 'pointer', fontFamily: 'inherit',
                    transition: 'all 0.15s'
                  }}>Get Started</button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            className="show-sm"
            onClick={() => setMobileOpen(!mobileOpen)}
            style={{ padding: '6px', background: 'none', border: 'none', cursor: 'pointer', color: '#6b7280', display: 'none', marginLeft: 'auto' }}
          >
            {mobileOpen ? <X style={{ width: '20px', height: '20px' }} /> : <Menu style={{ width: '20px', height: '20px' }} />}
          </button>
        </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div style={{ background: '#fff', borderTop: '1px solid #f3f4f6', padding: '12px 16px' }} className="show-sm-block">
          {user ? (
            <>
              <div style={{
                display: 'flex', alignItems: 'center', gap: '10px',
                padding: '10px', background: '#f9fafb', borderRadius: '10px',
                marginBottom: '8px'
              }}>
                <img
                  src={avatarSrc}
                  alt="avatar"
                  style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#ecfdf5', border: '1px solid #a7f3d0', objectFit: 'cover' }}
                />
                <div>
                  <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#111827' }}>{user.name}</div>
                  <div style={{ fontSize: '0.6875rem', color: '#9ca3af' }}>{user.email}</div>
                </div>
              </div>
              {navLinks.map(({ to, label, icon: Icon }) => (
                <Link key={to} to={to} onClick={() => setMobileOpen(false)}>
                  <div style={{
                    display: 'flex', alignItems: 'center', gap: '8px',
                    padding: '8px 10px', borderRadius: '8px',
                    fontSize: '0.8125rem', fontWeight: 500,
                    color: isActive(to) ? '#059669' : '#6b7280',
                    background: isActive(to) ? '#ecfdf5' : 'transparent',
                  }}>
                    <Icon style={{ width: '16px', height: '16px' }} />
                    {label}
                  </div>
                </Link>
              ))}
              <div style={{ height: '1px', background: '#f3f4f6', margin: '8px 0' }} />
              <button onClick={handleLogout} style={{
                width: '100%', display: 'flex', alignItems: 'center', gap: '8px',
                padding: '8px 10px', borderRadius: '8px',
                fontSize: '0.8125rem', fontWeight: 500,
                color: '#dc2626', background: 'none', border: 'none',
                cursor: 'pointer', fontFamily: 'inherit'
              }}>
                <LogOut style={{ width: '16px', height: '16px' }} />
                Logout
              </button>
            </>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <Link to="/login" onClick={() => setMobileOpen(false)}>
                <button style={{
                  width: '100%', padding: '8px', borderRadius: '8px',
                  fontSize: '0.8125rem', fontWeight: 600,
                  color: '#374151', border: '1px solid #e5e7eb', background: '#fff',
                  cursor: 'pointer', fontFamily: 'inherit'
                }}>Sign In</button>
              </Link>
              <Link to="/register" onClick={() => setMobileOpen(false)}>
                <button style={{
                  width: '100%', padding: '8px', borderRadius: '8px',
                  fontSize: '0.8125rem', fontWeight: 600,
                  color: '#fff', background: '#059669', border: 'none',
                  cursor: 'pointer', fontFamily: 'inherit'
                }}>Get Started</button>
              </Link>
            </div>
          )}
        </div>
      )}

      {/* Responsive CSS */}
      <style>{`
        @media (max-width: 640px) {
          .hidden-sm { display: none !important; }
          .show-sm { display: flex !important; }
          .show-sm-block { display: block !important; }
        }
        @media (min-width: 641px) {
          .show-sm { display: none !important; }
          .show-sm-block { display: none !important; }
        }
      `}</style>
    </nav>
  );
};

export default Navbar;
