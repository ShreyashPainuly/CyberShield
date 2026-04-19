import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  LayoutDashboard, ShieldCheck, ShieldAlert, AlertOctagon,
  Settings, HelpCircle, LogOut, Search, Bell, Scan,
  ChevronLeft, ChevronRight, Filter, Menu, X,
  User, Mail, ExternalLink, Clock, Shield, BookOpen
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { historyAPI } from '../services/api';
import ResultCard from '../components/ResultCard';
import SettingsPage from './SettingsPage';
import HelpPage from './HelpPage';
import DocumentationPage from './DocumentationPage';
import QuickStartPage from './QuickStartPage';
import SecurityTipsPage from './SecurityTipsPage';
import toast from 'react-hot-toast';

const PROFILE_IMG_KEY = 'cybershield_profile_image';

/* ─── Sidebar Item ─── */
const SidebarItem = ({ icon: Icon, label, active, onClick, badge }) => (
  <button
    onClick={onClick}
    style={{
      width: '100%',
      display: 'flex', alignItems: 'center', gap: '10px',
      padding: '9px 12px',
      borderRadius: '8px',
      fontSize: '0.875rem', fontWeight: active ? 500 : 400,
      color: active ? '#059669' : '#6b7280',
      background: active ? '#ecfdf5' : 'transparent',
      border: 'none', cursor: 'pointer',
      transition: 'all 0.15s',
      fontFamily: 'inherit',
      textAlign: 'left',
      position: 'relative'
    }}
    onMouseEnter={(e) => { if (!active) e.currentTarget.style.background = '#f9fafb'; }}
    onMouseLeave={(e) => { if (!active) e.currentTarget.style.background = 'transparent'; }}
  >
    <Icon style={{ width: '18px', height: '18px', color: active ? '#059669' : '#9ca3af', flexShrink: 0 }} />
    <span style={{ flex: 1 }}>{label}</span>
    {badge && (
      <span style={{
        fontSize: '0.625rem', fontWeight: 700,
        background: '#ef4444', color: '#fff',
        padding: '1px 6px', borderRadius: '999px',
        lineHeight: '16px'
      }}>{badge}</span>
    )}
  </button>
);

/* ─── Stat Card ─── */
const StatCard = ({ title, value, type }) => {
  const icons = { total: Scan, safe: ShieldCheck, suspicious: ShieldAlert, danger: AlertOctagon };
  const IconComp = icons[type] || Scan;

  const colors = {
    total: { bg: 'linear-gradient(135deg, #065f46, #064e3b)', iconBg: 'rgba(255,255,255,0.15)', iconColor: '#fff', titleColor: '#a7f3d0', valueColor: '#fff', subColor: 'rgba(167,243,208,0.6)' },
    safe: { bg: '#fff', iconBg: '#ecfdf5', iconColor: '#059669', titleColor: '#6b7280', valueColor: '#111827', subColor: '#9ca3af' },
    suspicious: { bg: '#fff', iconBg: '#fffbeb', iconColor: '#d97706', titleColor: '#6b7280', valueColor: '#111827', subColor: '#9ca3af' },
    danger: { bg: '#fff', iconBg: '#fef2f2', iconColor: '#dc2626', titleColor: '#6b7280', valueColor: '#111827', subColor: '#9ca3af' },
  };
  const c = colors[type] || colors.safe;
  const isPrimary = type === 'total';

  return (
    <div style={{
      background: c.bg,
      border: isPrimary ? 'none' : '1px solid #e5e7eb',
      borderRadius: '16px',
      padding: '20px',
      display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
      minHeight: '130px',
      transition: 'box-shadow 0.2s, transform 0.2s'
    }}
      onMouseEnter={(e) => { e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.06)'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
      onMouseLeave={(e) => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'translateY(0)'; }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <span style={{ fontSize: '0.8125rem', fontWeight: 500, color: c.titleColor }}>{title}</span>
        <div style={{
          width: '36px', height: '36px',
          background: c.iconBg, borderRadius: '8px',
          display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          <IconComp style={{ width: '18px', height: '18px', color: c.iconColor }} />
        </div>
      </div>
      <div>
        <div style={{ fontSize: '1.75rem', fontWeight: 700, color: c.valueColor, letterSpacing: '-0.02em' }}>{value}</div>
        <div style={{ fontSize: '0.6875rem', color: c.subColor, marginTop: '2px' }}>Lifetime metric</div>
      </div>
    </div>
  );
};

/* ─── Sample Notifications ─── */
const sampleNotifications = [
  { id: 1, type: 'success', title: 'Scan completed', message: 'google.com was scanned and marked as safe.', time: '2 min ago', read: false },
  { id: 2, type: 'danger', title: 'Threat detected', message: 'paypal-secure-login.xyz flagged as dangerous.', time: '15 min ago', read: false },
  { id: 3, type: 'warning', title: 'Suspicious URL', message: 'bit.ly/abc123 has suspicious redirects.', time: '1 hour ago', read: true },
  { id: 4, type: 'info', title: 'Weekly report ready', message: 'Your scan activity summary is available.', time: '3 hours ago', read: true },
  { id: 5, type: 'success', title: 'Account secured', message: 'Two-factor authentication enabled.', time: '1 day ago', read: true },
];

/* ─── Main Dashboard ─── */
const DashboardPage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [activeView, setActiveView] = useState('dashboard');
  const [stats, setStats] = useState(null);
  const [scans, setScans] = useState([]);
  const [selectedScan, setSelectedScan] = useState(null);
  const [filter, setFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ pages: 1 });
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Profile image state
  const [profileImage, setProfileImage] = useState(() => localStorage.getItem(PROFILE_IMG_KEY) || null);

  // Listen for profile image changes from SettingsPage
  useEffect(() => {
    const handler = (e) => setProfileImage(e.detail);
    window.addEventListener('profile-image-updated', handler);
    return () => window.removeEventListener('profile-image-updated', handler);
  }, []);

  // Dropdowns
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState(sampleNotifications);

  const profileRef = useRef(null);
  const notifRef = useRef(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handler = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) setShowProfileDropdown(false);
      if (notifRef.current && !notifRef.current.contains(e.target)) setShowNotifications(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const fetchData = useCallback(async () => {
    try {
      const [statsRes, historyRes] = await Promise.all([
        historyAPI.getStats(),
        historyAPI.getHistory({ page, limit: 10, filter: filter || undefined })
      ]);
      setStats(statsRes.data.stats);
      setScans(historyRes.data.scans);
      setPagination(historyRes.data.pagination);
    } catch {
      toast.error('Failed to load dashboard data');
    }
    setLoading(false);
  }, [page, filter]);

  useEffect(() => { fetchData(); }, [fetchData]);
  const handleLogout = () => { logout(); navigate('/login'); };

  const chartData = (stats?.dailyActivity || []).map(d => ({
    date: new Date(d._id).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    scans: d.count,
    threats: d.threats
  }));

  const filterOptions = [
    { value: '', label: 'All' },
    { value: 'safe', label: 'Safe' },
    { value: 'suspicious', label: 'Suspicious' },
    { value: 'dangerous', label: 'Dangerous' }
  ];

  // Filter scans by search query (client-side)
  const filteredScans = searchQuery.trim()
    ? scans.filter(s =>
      s.url.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.riskLevel.toLowerCase().includes(searchQuery.toLowerCase())
    )
    : scans;

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    toast.success('All notifications marked as read');
  };

  const sidebarContent = (
    <>
      {/* Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '16px 16px', borderBottom: '1px solid #f3f4f6' }}>
        <img src="/logo.png" alt="CyberShield" style={{ width: '32px', height: '32px', objectFit: 'contain' }} />
        <span style={{ fontSize: '1rem', fontWeight: 700, color: '#111827' }}>CyberShield</span>
      </div>

      {/* Nav sections */}
      <div style={{ flex: 1, overflow: 'auto', padding: '16px 12px' }}>
        <div style={{ marginBottom: '24px' }}>
          <div style={{ fontSize: '0.6875rem', fontWeight: 600, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.05em', padding: '0 12px', marginBottom: '8px' }}>
            Menu
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
            <SidebarItem
              icon={LayoutDashboard}
              label="Dashboard"
              active={activeView === 'dashboard'}
              onClick={() => { setActiveView('dashboard'); setSidebarOpen(false); }}
            />
            <SidebarItem
              icon={Scan}
              label="New Scan"
              onClick={() => { navigate('/scan'); setSidebarOpen(false); }}
            />
          </div>
        </div>
        <div>
          <div style={{ fontSize: '0.6875rem', fontWeight: 600, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.05em', padding: '0 12px', marginBottom: '8px' }}>
            General
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
            <SidebarItem
              icon={Settings}
              label="Settings"
              active={activeView === 'settings'}
              onClick={() => { setActiveView('settings'); setSidebarOpen(false); }}
            />
            <SidebarItem
              icon={HelpCircle}
              label="Help & Support"
              active={activeView === 'help'}
              onClick={() => { setActiveView('help'); setSidebarOpen(false); }}
            />
            <SidebarItem icon={LogOut} label="Logout" onClick={handleLogout} />
          </div>
        </div>
      </div>

      {/* Bottom user card in sidebar */}
      <div style={{
        padding: '12px 16px', borderTop: '1px solid #f3f4f6',
        display: 'flex', alignItems: 'center', gap: '10px'
      }}>
        <img
          src={profileImage || `https://api.dicebear.com/7.x/notionists/svg?seed=${user?.name || 'Felix'}&backgroundColor=d1fae5`}
          alt="User"
          style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#ecfdf5', border: '1px solid #a7f3d0' }}
        />
        <div style={{ minWidth: 0, flex: 1 }}>
          <p style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#111827', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user?.name || 'User'}</p>
          <p style={{ fontSize: '0.6875rem', color: '#9ca3af', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user?.email || ''}</p>
        </div>
      </div>
    </>
  );

  return (
    <div style={{ display: 'flex', height: '100vh', background: '#f3f4f6', overflow: 'hidden', fontFamily: "'Inter', system-ui, sans-serif" }}>

      {/* ── Desktop Sidebar ── */}
      <aside style={{
        width: '240px', background: '#fff',
        borderRight: '1px solid #e5e7eb',
        display: 'flex', flexDirection: 'column',
        flexShrink: 0
      }}
        className="hidden-mobile"
      >
        {sidebarContent}
      </aside>

      {/* ── Mobile Sidebar Overlay ── */}
      {sidebarOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 100 }}>
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.3)' }} onClick={() => setSidebarOpen(false)} />
          <aside style={{
            position: 'relative', width: '260px', height: '100%',
            background: '#fff', display: 'flex', flexDirection: 'column',
            boxShadow: '4px 0 24px rgba(0,0,0,0.12)'
          }}>
            <button onClick={() => setSidebarOpen(false)}
              style={{ position: 'absolute', top: '12px', right: '12px', background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af', padding: '4px' }}>
              <X style={{ width: '20px', height: '20px' }} />
            </button>
            {sidebarContent}
          </aside>
        </div>
      )}

      {/* ── Main area ── */}
      <main style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

        {/* Top bar */}
        <header style={{
          height: '60px', padding: '0 24px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          background: '#fff', borderBottom: '1px solid #e5e7eb',
          flexShrink: 0
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1, minWidth: 0 }}>
            <button onClick={() => setSidebarOpen(true)}
              className="show-mobile"
              style={{ padding: '6px', background: 'none', border: 'none', cursor: 'pointer', color: '#6b7280', display: 'none' }}>
              <Menu style={{ width: '20px', height: '20px' }} />
            </button>
            <div className="hidden-mobile" style={{ position: 'relative', maxWidth: '320px', width: '100%' }}>
              <Search style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', width: '16px', height: '16px', color: '#9ca3af' }} />
              <input
                type="text"
                placeholder="Search scans by URL or status..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="cs-input"
                style={{ paddingLeft: '34px', paddingRight: '12px', padding: '8px 12px 8px 34px', borderRadius: '8px', fontSize: '0.8125rem' }}
                id="dashboard-search"
              />
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
            {/* Notification Button */}
            <div ref={notifRef} style={{ position: 'relative' }}>
              <button
                onClick={() => { setShowNotifications(!showNotifications); setShowProfileDropdown(false); }}
                style={{
                  position: 'relative', width: '36px', height: '36px',
                  background: showNotifications ? '#ecfdf5' : '#f9fafb',
                  border: `1px solid ${showNotifications ? '#a7f3d0' : '#e5e7eb'}`,
                  borderRadius: '8px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer', color: showNotifications ? '#059669' : '#6b7280',
                  transition: 'all 0.15s'
                }}
                id="notification-bell"
              >
                <Bell style={{ width: '16px', height: '16px' }} />
                {unreadCount > 0 && (
                  <span style={{
                    position: 'absolute', top: '5px', right: '5px',
                    width: '8px', height: '8px',
                    background: '#ef4444', borderRadius: '50%',
                    border: '1.5px solid #fff'
                  }} />
                )}
              </button>

              {/* Notification Dropdown */}
              {showNotifications && (
                <div style={{
                  position: 'absolute', top: '44px', right: 0,
                  width: '360px', maxHeight: '440px',
                  background: '#fff', borderRadius: '12px',
                  border: '1px solid #e5e7eb',
                  boxShadow: '0 12px 40px rgba(0,0,0,0.12)',
                  zIndex: 200, display: 'flex', flexDirection: 'column',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    padding: '14px 16px', borderBottom: '1px solid #f3f4f6',
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <h3 style={{ fontSize: '0.875rem', fontWeight: 600, color: '#111827', margin: 0 }}>Notifications</h3>
                      {unreadCount > 0 && (
                        <span style={{
                          fontSize: '0.625rem', fontWeight: 700,
                          background: '#ef4444', color: '#fff',
                          padding: '1px 6px', borderRadius: '999px'
                        }}>{unreadCount}</span>
                      )}
                    </div>
                    {unreadCount > 0 && (
                      <button
                        onClick={markAllRead}
                        style={{
                          fontSize: '0.75rem', fontWeight: 500, color: '#059669',
                          background: 'none', border: 'none', cursor: 'pointer',
                          fontFamily: 'inherit'
                        }}
                      >
                        Mark all read
                      </button>
                    )}
                  </div>
                  <div style={{ flex: 1, overflowY: 'auto' }}>
                    {notifications.length > 0 ? notifications.map(notif => {
                      const typeColors = {
                        success: { bg: '#ecfdf5', color: '#059669', icon: ShieldCheck },
                        danger: { bg: '#fef2f2', color: '#dc2626', icon: AlertOctagon },
                        warning: { bg: '#fffbeb', color: '#d97706', icon: ShieldAlert },
                        info: { bg: '#eef2ff', color: '#6366f1', icon: Bell },
                      };
                      const tc = typeColors[notif.type] || typeColors.info;
                      const NotifIcon = tc.icon;
                      return (
                        <div
                          key={notif.id}
                          style={{
                            padding: '12px 16px',
                            borderBottom: '1px solid #f9fafb',
                            display: 'flex', gap: '12px',
                            background: notif.read ? 'transparent' : '#f9fafb',
                            cursor: 'pointer',
                            transition: 'background 0.15s'
                          }}
                          onMouseEnter={(e) => e.currentTarget.style.background = '#f3f4f6'}
                          onMouseLeave={(e) => e.currentTarget.style.background = notif.read ? 'transparent' : '#f9fafb'}
                          onClick={() => {
                            setNotifications(prev => prev.map(n => n.id === notif.id ? { ...n, read: true } : n));
                          }}
                        >
                          <div style={{
                            width: '32px', height: '32px', borderRadius: '8px',
                            background: tc.bg,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            flexShrink: 0
                          }}>
                            <NotifIcon style={{ width: '16px', height: '16px', color: tc.color }} />
                          </div>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                              <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#111827' }}>{notif.title}</span>
                              {!notif.read && (
                                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#059669', flexShrink: 0 }} />
                              )}
                            </div>
                            <p style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '2px', lineHeight: 1.4 }}>{notif.message}</p>
                            <span style={{ fontSize: '0.6875rem', color: '#9ca3af', marginTop: '4px', display: 'block' }}>{notif.time}</span>
                          </div>
                        </div>
                      );
                    }) : (
                      <div style={{ padding: '40px 16px', textAlign: 'center' }}>
                        <Bell style={{ width: '28px', height: '28px', color: '#d1d5db', margin: '0 auto 8px' }} />
                        <p style={{ fontSize: '0.875rem', color: '#9ca3af' }}>No notifications</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            <div style={{ width: '1px', height: '28px', background: '#e5e7eb' }} className="hidden-mobile" />

            {/* Profile dropdown */}
            <div ref={profileRef} style={{ position: 'relative' }} className="hidden-mobile">
              <button
                onClick={() => { setShowProfileDropdown(!showProfileDropdown); setShowNotifications(false); }}
                style={{
                  display: 'flex', alignItems: 'center', gap: '10px',
                  background: showProfileDropdown ? '#f9fafb' : 'transparent',
                  border: 'none', cursor: 'pointer', padding: '4px 8px',
                  borderRadius: '8px', transition: 'all 0.15s',
                  fontFamily: 'inherit'
                }}
                id="profile-button"
              >
                <div style={{ textAlign: 'right' }}>
                  <p style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#111827', lineHeight: 1.3, margin: 0 }}>{user?.name || 'User'}</p>
                  <p style={{ fontSize: '0.6875rem', color: '#9ca3af', margin: 0 }}>{user?.email || ''}</p>
                </div>
                <img
                  src={profileImage || `https://api.dicebear.com/7.x/notionists/svg?seed=${user?.name || 'Felix'}&backgroundColor=d1fae5`}
                  alt="User"
                  style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#ecfdf5', border: '1px solid #a7f3d0', objectFit: 'cover' }}
                />
              </button>

              {/* Profile Dropdown */}
              {showProfileDropdown && (
                <div style={{
                  position: 'absolute', top: '48px', right: 0,
                  width: '280px',
                  background: '#fff', borderRadius: '12px',
                  border: '1px solid #e5e7eb',
                  boxShadow: '0 12px 40px rgba(0,0,0,0.12)',
                  zIndex: 200, overflow: 'hidden'
                }}>
                  {/* User Info */}
                  <div style={{
                    padding: '16px',
                    borderBottom: '1px solid #f3f4f6',
                    display: 'flex', alignItems: 'center', gap: '12px'
                  }}>
                    <img
                      src={profileImage || `https://api.dicebear.com/7.x/notionists/svg?seed=${user?.name || 'Felix'}&backgroundColor=d1fae5`}
                      alt="User"
                      style={{ width: '44px', height: '44px', borderRadius: '50%', background: '#ecfdf5', border: '2px solid #a7f3d0' }}
                    />
                    <div style={{ minWidth: 0 }}>
                      <p style={{ fontSize: '0.875rem', fontWeight: 600, color: '#111827', margin: 0 }}>{user?.name || 'User'}</p>
                      <p style={{ fontSize: '0.75rem', color: '#6b7280', margin: '2px 0 0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user?.email || ''}</p>
                    </div>
                  </div>

                  {/* Menu Items */}
                  <div style={{ padding: '6px' }}>
                    {[
                      { icon: User, label: 'My Profile', onClick: () => { setActiveView('settings'); setShowProfileDropdown(false); } },
                      { icon: Settings, label: 'Settings', onClick: () => { setActiveView('settings'); setShowProfileDropdown(false); } },
                      { icon: HelpCircle, label: 'Help & Support', onClick: () => { setActiveView('help'); setShowProfileDropdown(false); } },
                    ].map((item, i) => (
                      <button
                        key={i}
                        onClick={item.onClick}
                        style={{
                          width: '100%', display: 'flex', alignItems: 'center', gap: '10px',
                          padding: '9px 12px', borderRadius: '8px',
                          fontSize: '0.8125rem', fontWeight: 500, color: '#374151',
                          background: 'transparent', border: 'none',
                          cursor: 'pointer', fontFamily: 'inherit',
                          transition: 'background 0.15s', textAlign: 'left'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.background = '#f9fafb'}
                        onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                      >
                        <item.icon style={{ width: '16px', height: '16px', color: '#9ca3af' }} />
                        {item.label}
                      </button>
                    ))}
                  </div>

                  <div style={{ borderTop: '1px solid #f3f4f6', padding: '6px' }}>
                    <button
                      onClick={handleLogout}
                      style={{
                        width: '100%', display: 'flex', alignItems: 'center', gap: '10px',
                        padding: '9px 12px', borderRadius: '8px',
                        fontSize: '0.8125rem', fontWeight: 500, color: '#dc2626',
                        background: 'transparent', border: 'none',
                        cursor: 'pointer', fontFamily: 'inherit',
                        transition: 'background 0.15s', textAlign: 'left'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.background = '#fef2f2'}
                      onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                    >
                      <LogOut style={{ width: '16px', height: '16px', color: '#dc2626' }} />
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Scrollable content */}
        <div style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden' }}>
          <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '24px 24px 40px' }}>

            {/* Conditional page rendering */}
            {activeView === 'settings' && (
              <SettingsPage onBack={() => setActiveView('dashboard')} />
            )}

            {activeView === 'docs' && (
              <DocumentationPage onBack={() => setActiveView('help')} />
            )}

            {activeView === 'quickstart' && (
              <QuickStartPage onBack={() => setActiveView('help')} />
            )}

            {activeView === 'security-tips' && (
              <SecurityTipsPage onBack={() => setActiveView('help')} />
            )}

            {activeView === 'help' && (
              <HelpPage onBack={() => setActiveView('dashboard')} onNavigate={(view) => setActiveView(view)} />
            )}

            {activeView === 'dashboard' && (
              <>
                {/* Page header */}
                <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '12px', marginBottom: '24px' }}>
                  <div>
                    <h1 style={{ fontSize: '1.375rem', fontWeight: 700, color: '#111827', margin: 0 }}>
                      Welcome back, {user?.name?.split(' ')[0] || 'User'} 👋
                    </h1>
                    <p style={{ fontSize: '0.875rem', color: '#6b7280', marginTop: '2px' }}>Monitor scanning activity and threat detections.</p>
                  </div>
                  <button onClick={() => navigate('/scan')} style={{
                    display: 'flex', alignItems: 'center', gap: '6px',
                    background: '#059669', color: '#fff',
                    border: 'none', borderRadius: '10px',
                    padding: '9px 18px',
                    fontSize: '0.8125rem', fontWeight: 600,
                    cursor: 'pointer', fontFamily: 'inherit',
                    transition: 'background 0.15s'
                  }}
                    onMouseEnter={(e) => e.currentTarget.style.background = '#047857'}
                    onMouseLeave={(e) => e.currentTarget.style.background = '#059669'}
                  >
                    <Scan style={{ width: '16px', height: '16px' }} />
                    New Scan
                  </button>
                </div>

                {/* Stats grid */}
                {loading ? (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px', marginBottom: '20px' }}>
                    {[1,2,3,4].map(i => (
                      <div key={i} style={{ height: '130px', background: '#e5e7eb', borderRadius: '16px', animation: 'skeleton-pulse 1.5s ease-in-out infinite' }} />
                    ))}
                  </div>
                ) : (
                  <>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px', marginBottom: '20px' }}>
                      <StatCard title="Total Scans" value={stats?.totalScans || 0} type="total" />
                      <StatCard title="Safe URLs" value={stats?.safeScans || 0} type="safe" />
                      <StatCard title="Suspicious URLs" value={stats?.suspiciousScans || 0} type="suspicious" />
                      <StatCard title="Dangerous URLs" value={stats?.dangerousScans || 0} type="danger" />
                    </div>

                    {/* Chart + History */}
                    <div className="chart-history-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>

                      {/* Chart */}
                      <div className="cs-card" style={{ padding: '20px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                          <h3 style={{ fontSize: '0.9375rem', fontWeight: 600, color: '#111827', margin: 0 }}>7-Day Threat Activity</h3>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#059669' }} />
                              <span style={{ fontSize: '0.6875rem', color: '#6b7280' }}>Scans</span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#ef4444' }} />
                              <span style={{ fontSize: '0.6875rem', color: '#6b7280' }}>Threats</span>
                            </div>
                          </div>
                        </div>
                        {chartData.length > 0 ? (
                          <div style={{ height: '260px' }}>
                            <ResponsiveContainer width="100%" height="100%">
                              <AreaChart data={chartData} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                                <defs>
                                  <linearGradient id="gS" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#059669" stopOpacity={0.15} />
                                    <stop offset="95%" stopColor="#059669" stopOpacity={0} />
                                  </linearGradient>
                                  <linearGradient id="gT" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.15} />
                                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                                  </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                                <XAxis dataKey="date" stroke="#9ca3af" fontSize={11} tickLine={false} axisLine={false} dy={8} />
                                <YAxis stroke="#9ca3af" fontSize={11} tickLine={false} axisLine={false} />
                                <Tooltip contentStyle={{
                                  background: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px',
                                  fontSize: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
                                }} />
                                <Area type="monotone" dataKey="scans" stroke="#059669" fill="url(#gS)" strokeWidth={2} dot={false} />
                                <Area type="monotone" dataKey="threats" stroke="#ef4444" fill="url(#gT)" strokeWidth={2} dot={false} />
                              </AreaChart>
                            </ResponsiveContainer>
                          </div>
                        ) : (
                          <div style={{ height: '260px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#9ca3af' }}>
                            <LayoutDashboard style={{ width: '32px', height: '32px', color: '#d1d5db', marginBottom: '8px' }} />
                            <span style={{ fontSize: '0.875rem' }}>No activity to display</span>
                            <span style={{ fontSize: '0.75rem', marginTop: '2px' }}>Start scanning URLs to see data here</span>
                          </div>
                        )}
                      </div>

                      {/* Recent Scans */}
                      <div className="cs-card" style={{ padding: '20px', display: 'flex', flexDirection: 'column' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                          <h3 style={{ fontSize: '0.9375rem', fontWeight: 600, color: '#111827', margin: 0 }}>Recent Scans</h3>
                          <div style={{
                            padding: '6px', background: '#f9fafb', borderRadius: '6px',
                            cursor: 'pointer', border: '1px solid #e5e7eb'
                          }}>
                            <Filter style={{ width: '14px', height: '14px', color: '#6b7280' }} />
                          </div>
                        </div>

                        {/* Filter pills */}
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '14px' }}>
                          {filterOptions.map(f => (
                            <button
                              key={f.value}
                              onClick={() => { setFilter(f.value); setPage(1); }}
                              style={{
                                fontSize: '0.75rem', fontWeight: 500,
                                padding: '4px 12px', borderRadius: '6px',
                                border: `1px solid ${filter === f.value ? '#a7f3d0' : '#e5e7eb'}`,
                                background: filter === f.value ? '#ecfdf5' : '#fff',
                                color: filter === f.value ? '#059669' : '#6b7280',
                                cursor: 'pointer', fontFamily: 'inherit',
                                transition: 'all 0.15s'
                              }}
                            >
                              {f.label}
                            </button>
                          ))}
                        </div>

                        {/* Search indicator */}
                        {searchQuery.trim() && (
                          <div style={{
                            display: 'flex', alignItems: 'center', gap: '6px',
                            padding: '6px 10px', borderRadius: '6px',
                            background: '#ecfdf5', border: '1px solid #a7f3d0',
                            marginBottom: '10px', fontSize: '0.75rem', color: '#059669'
                          }}>
                            <Search style={{ width: '12px', height: '12px' }} />
                            Filtering by: "{searchQuery}" — {filteredScans.length} result{filteredScans.length !== 1 ? 's' : ''}
                            <button
                              onClick={() => setSearchQuery('')}
                              style={{ marginLeft: 'auto', background: 'none', border: 'none', cursor: 'pointer', color: '#059669', padding: '0 2px', fontFamily: 'inherit', fontSize: '0.75rem', fontWeight: 600 }}
                            >
                              Clear
                            </button>
                          </div>
                        )}

                        {/* Scan list */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1, overflowY: 'auto' }}>
                          {filteredScans.length > 0 ? filteredScans.map(scan => (
                            <div
                              key={scan._id}
                              onClick={() => setSelectedScan(scan)}
                              style={{
                                padding: '12px',
                                background: '#f9fafb',
                                border: '1px solid #f3f4f6',
                                borderRadius: '10px',
                                cursor: 'pointer',
                                transition: 'all 0.15s'
                              }}
                              onMouseEnter={(e) => { e.currentTarget.style.background = '#ecfdf5'; e.currentTarget.style.borderColor = '#a7f3d0'; }}
                              onMouseLeave={(e) => { e.currentTarget.style.background = '#f9fafb'; e.currentTarget.style.borderColor = '#f3f4f6'; }}
                            >
                              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                  <Clock style={{ width: '12px', height: '12px', color: '#9ca3af' }} />
                                  <span style={{ fontSize: '0.6875rem', fontWeight: 500, color: '#9ca3af' }}>
                                    {new Date(scan.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                  </span>
                                </div>
                                <span style={{
                                  fontSize: '0.625rem', fontWeight: 700,
                                  textTransform: 'uppercase',
                                  padding: '2px 8px', borderRadius: '999px',
                                  background: scan.riskLevel === 'safe' ? '#ecfdf5' : scan.riskLevel === 'suspicious' ? '#fffbeb' : '#fef2f2',
                                  color: scan.riskLevel === 'safe' ? '#059669' : scan.riskLevel === 'suspicious' ? '#d97706' : '#dc2626'
                                }}>
                                  {scan.riskLevel}
                                </span>
                              </div>
                              <div style={{
                                display: 'flex', alignItems: 'center', gap: '6px',
                                fontSize: '0.8125rem', fontWeight: 500, color: '#374151',
                                overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'
                              }}>
                                <ExternalLink style={{ width: '12px', height: '12px', color: '#9ca3af', flexShrink: 0 }} />
                                {scan.url}
                              </div>
                            </div>
                          )) : (
                            <div style={{ textAlign: 'center', padding: '32px 0', color: '#9ca3af' }}>
                              <Scan style={{ width: '28px', height: '28px', color: '#d1d5db', margin: '0 auto 8px' }} />
                              <p style={{ fontSize: '0.875rem' }}>
                                {searchQuery.trim() ? 'No scans match your search.' : 'No scans found.'}
                              </p>
                            </div>
                          )}
                        </div>

                        {/* Pagination */}
                        {!searchQuery.trim() && pagination.pages > 1 && (
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', marginTop: '16px', paddingTop: '12px', borderTop: '1px solid #f3f4f6' }}>
                            <button
                              onClick={() => setPage(p => Math.max(1, p - 1))}
                              disabled={page <= 1}
                              style={{
                                padding: '6px', border: '1px solid #e5e7eb', borderRadius: '6px',
                                background: '#fff', cursor: page <= 1 ? 'not-allowed' : 'pointer',
                                opacity: page <= 1 ? 0.3 : 1,
                                display: 'flex'
                              }}
                            >
                              <ChevronLeft style={{ width: '16px', height: '16px', color: '#6b7280' }} />
                            </button>
                            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#6b7280' }}>
                              {page} / {pagination.pages}
                            </span>
                            <button
                              onClick={() => setPage(p => Math.min(pagination.pages, p + 1))}
                              disabled={page >= pagination.pages}
                              style={{
                                padding: '6px', border: '1px solid #e5e7eb', borderRadius: '6px',
                                background: '#fff', cursor: page >= pagination.pages ? 'not-allowed' : 'pointer',
                                opacity: page >= pagination.pages ? 0.3 : 1,
                                display: 'flex'
                              }}
                            >
                              <ChevronRight style={{ width: '16px', height: '16px', color: '#6b7280' }} />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </>
                )}
              </>
            )}
          </div>
        </div>
      </main>

      {/* ── Modal ── */}
      {selectedScan && (
        <div
          style={{ position: 'fixed', inset: 0, zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px', background: 'rgba(0,0,0,0.3)', backdropFilter: 'blur(4px)' }}
          onClick={() => setSelectedScan(null)}
        >
          <div
            style={{ width: '100%', maxWidth: '640px', background: '#fff', borderRadius: '16px', overflow: 'hidden', maxHeight: '90vh', display: 'flex', flexDirection: 'column', boxShadow: '0 20px 60px rgba(0,0,0,0.15)' }}
            onClick={e => e.stopPropagation()}
          >
            <div style={{ padding: '16px 20px', borderBottom: '1px solid #f3f4f6', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 }}>
              <h2 style={{ fontSize: '1rem', fontWeight: 600, color: '#111827', margin: 0 }}>Scan Details</h2>
              <button onClick={() => setSelectedScan(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af', padding: '4px', display: 'flex' }}>
                <X style={{ width: '18px', height: '18px' }} />
              </button>
            </div>
            <div style={{ padding: '20px', overflowY: 'auto', flex: 1 }}>
              <ResultCard scan={selectedScan} />
            </div>
          </div>
        </div>
      )}

      {/* CSS for responsive sidebar */}
      <style>{`
        @media (max-width: 768px) {
          .hidden-mobile { display: none !important; }
          .show-mobile { display: flex !important; }
        }
        @media (min-width: 769px) {
          .show-mobile { display: none !important; }
        }
        @media (max-width: 900px) {
          .chart-history-grid { grid-template-columns: 1fr !important; }
        }
        @keyframes skeleton-pulse {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 0.7; }
        }
      `}</style>
    </div>
  );
};

export default DashboardPage;
