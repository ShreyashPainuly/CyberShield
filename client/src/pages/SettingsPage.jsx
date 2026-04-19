import { useState, useRef } from 'react';
import { User, Mail, Lock, Camera, Save, Loader2, ArrowLeft, Upload, X, Image, CheckCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const PROFILE_IMG_KEY = 'cybershield_profile_image';
const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB
const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

const SettingsPage = ({ onBack }) => {
  const { user, updateUser } = useAuth();
  const fileInputRef = useRef(null);

  const [form, setForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');

  // Profile image state
  const [profileImage, setProfileImage] = useState(() => {
    return localStorage.getItem(PROFILE_IMG_KEY) || null;
  });
  const [previewImage, setPreviewImage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [showImagePreview, setShowImagePreview] = useState(false);

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) {
      toast.error('Name cannot be empty');
      return;
    }
    if (form.newPassword && form.newPassword.length < 6) {
      toast.error('New password must be at least 6 characters');
      return;
    }
    if (form.newPassword && form.newPassword !== form.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    setSaving(true);
    try {
      await updateUser({ name: form.name.trim(), email: form.email.trim() });
      toast.success('Profile updated successfully!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update profile');
    }
    setSaving(false);
  };

  // Handle file selection
  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!ACCEPTED_TYPES.includes(file.type)) {
      toast.error('Invalid file type. Please upload a JPG, PNG, GIF, or WebP image.');
      return;
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      toast.error('File is too large. Maximum size is 2MB.');
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onload = (event) => {
      setPreviewImage(event.target.result);
      setShowImagePreview(true);
    };
    reader.onerror = () => {
      toast.error('Failed to read file. Please try again.');
    };
    reader.readAsDataURL(file);
  };

  // Save the profile image
  const handleSaveImage = async () => {
    if (!previewImage) return;
    setUploading(true);

    try {
      // Simulate upload processing
      await new Promise(r => setTimeout(r, 800));

      // Store in localStorage (base64)
      localStorage.setItem(PROFILE_IMG_KEY, previewImage);
      setProfileImage(previewImage);
      setShowImagePreview(false);
      setPreviewImage(null);

      // Dispatch custom event so other components (Navbar, Dashboard sidebar) can update
      window.dispatchEvent(new CustomEvent('profile-image-updated', { detail: previewImage }));

      toast.success('Profile picture updated!');
    } catch {
      toast.error('Failed to save image. Please try again.');
    }

    setUploading(false);
  };

  // Remove profile image
  const handleRemoveImage = () => {
    localStorage.removeItem(PROFILE_IMG_KEY);
    setProfileImage(null);
    setPreviewImage(null);
    setShowImagePreview(false);
    window.dispatchEvent(new CustomEvent('profile-image-updated', { detail: null }));
    toast.success('Profile picture removed');
  };

  // Cancel preview
  const handleCancelPreview = () => {
    setPreviewImage(null);
    setShowImagePreview(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const defaultAvatar = `https://api.dicebear.com/7.x/notionists/svg?seed=${user?.name || 'Felix'}&backgroundColor=d1fae5`;
  const currentImage = profileImage || defaultAvatar;

  const tabs = [
    { id: 'profile', label: 'Profile' },
    { id: 'security', label: 'Security' },
    { id: 'preferences', label: 'Preferences' }
  ];

  const labelStyle = {
    display: 'block', fontSize: '0.8125rem', fontWeight: 600,
    color: '#374151', marginBottom: '6px'
  };

  const inputWrapStyle = { position: 'relative', marginBottom: '20px' };

  const iconStyle = {
    position: 'absolute', left: '12px', top: '50%',
    transform: 'translateY(-50%)', width: '16px', height: '16px', color: '#9ca3af'
  };

  return (
    <div>
      {/* Header with back */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
        <button
          onClick={onBack}
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            width: '36px', height: '36px', borderRadius: '8px',
            background: '#f9fafb', border: '1px solid #e5e7eb',
            cursor: 'pointer', color: '#6b7280'
          }}
        >
          <ArrowLeft style={{ width: '18px', height: '18px' }} />
        </button>
        <div>
          <h1 style={{ fontSize: '1.375rem', fontWeight: 700, color: '#111827', margin: 0 }}>Settings</h1>
          <p style={{ fontSize: '0.875rem', color: '#6b7280', marginTop: '2px' }}>Manage your account settings and preferences.</p>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '4px', marginBottom: '24px', borderBottom: '1px solid #e5e7eb', paddingBottom: '0' }}>
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              padding: '8px 16px', fontSize: '0.8125rem', fontWeight: 500,
              color: activeTab === tab.id ? '#059669' : '#6b7280',
              background: 'none', border: 'none', cursor: 'pointer',
              borderBottom: activeTab === tab.id ? '2px solid #059669' : '2px solid transparent',
              marginBottom: '-1px', fontFamily: 'inherit',
              transition: 'all 0.15s'
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'profile' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '24px', maxWidth: '640px' }}>
          {/* Avatar section — with real upload */}
          <div className="cs-card" style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '0.9375rem', fontWeight: 600, color: '#111827', marginBottom: '16px' }}>Profile Picture</h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
              <div style={{ position: 'relative' }}>
                <img
                  src={currentImage}
                  alt="Avatar"
                  style={{
                    width: '80px', height: '80px', borderRadius: '50%',
                    background: '#ecfdf5', border: '3px solid #a7f3d0',
                    objectFit: 'cover'
                  }}
                />
                <button
                  style={{
                    position: 'absolute', bottom: '0', right: '0',
                    width: '28px', height: '28px', borderRadius: '50%',
                    background: '#059669', border: '2px solid #fff',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    cursor: 'pointer', color: '#fff',
                    transition: 'all 0.15s'
                  }}
                  onClick={() => fileInputRef.current?.click()}
                  onMouseEnter={(e) => { e.currentTarget.style.background = '#047857'; e.currentTarget.style.transform = 'scale(1.1)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = '#059669'; e.currentTarget.style.transform = 'scale(1)'; }}
                  id="avatar-upload-btn"
                >
                  <Camera style={{ width: '14px', height: '14px' }} />
                </button>
                {/* Hidden file input */}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/gif,image/webp"
                  style={{ display: 'none' }}
                  onChange={handleFileSelect}
                  id="avatar-file-input"
                />
              </div>
              <div>
                <p style={{ fontSize: '0.9375rem', fontWeight: 600, color: '#111827' }}>{user?.name || 'User'}</p>
                <p style={{ fontSize: '0.8125rem', color: '#6b7280', marginTop: '2px' }}>{user?.email || ''}</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '8px' }}>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '6px',
                      padding: '6px 12px', borderRadius: '8px',
                      fontSize: '0.75rem', fontWeight: 600,
                      background: '#ecfdf5', border: '1px solid #a7f3d0',
                      color: '#059669', cursor: 'pointer', fontFamily: 'inherit',
                      transition: 'all 0.15s'
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = '#d1fae5'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = '#ecfdf5'; }}
                    id="change-photo-btn"
                  >
                    <Upload style={{ width: '12px', height: '12px' }} />
                    Change Photo
                  </button>
                  {profileImage && (
                    <button
                      onClick={handleRemoveImage}
                      style={{
                        display: 'flex', alignItems: 'center', gap: '6px',
                        padding: '6px 12px', borderRadius: '8px',
                        fontSize: '0.75rem', fontWeight: 600,
                        background: '#fef2f2', border: '1px solid #fecaca',
                        color: '#dc2626', cursor: 'pointer', fontFamily: 'inherit',
                        transition: 'all 0.15s'
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.background = '#fee2e2'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.background = '#fef2f2'; }}
                      id="remove-photo-btn"
                    >
                      <X style={{ width: '12px', height: '12px' }} />
                      Remove
                    </button>
                  )}
                </div>
                <p style={{ fontSize: '0.6875rem', color: '#9ca3af', marginTop: '6px' }}>
                  <Image style={{ width: '10px', height: '10px', display: 'inline', verticalAlign: 'middle', marginRight: '4px' }} />
                  JPG, PNG, GIF or WebP. Max 2MB.
                </p>
              </div>
            </div>

            {/* Image Preview Modal */}
            {showImagePreview && previewImage && (
              <div style={{
                marginTop: '20px', padding: '16px',
                background: '#f9fafb', borderRadius: '12px',
                border: '1px solid #e5e7eb',
                animation: 'fadeIn 0.25s ease-out'
              }}>
                <div style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  marginBottom: '12px'
                }}>
                  <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#374151' }}>
                    Preview
                  </span>
                  <button
                    onClick={handleCancelPreview}
                    style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      width: '24px', height: '24px', borderRadius: '6px',
                      background: 'none', border: 'none',
                      cursor: 'pointer', color: '#9ca3af'
                    }}
                  >
                    <X style={{ width: '14px', height: '14px' }} />
                  </button>
                </div>
                <div style={{
                  display: 'flex', alignItems: 'center', gap: '16px'
                }}>
                  <img
                    src={previewImage}
                    alt="Preview"
                    style={{
                      width: '64px', height: '64px', borderRadius: '50%',
                      objectFit: 'cover', border: '3px solid #a7f3d0'
                    }}
                  />
                  <div style={{ flex: 1, display: 'flex', gap: '8px' }}>
                    <button
                      onClick={handleSaveImage}
                      disabled={uploading}
                      style={{
                        display: 'flex', alignItems: 'center', gap: '6px',
                        padding: '8px 16px', borderRadius: '8px',
                        fontSize: '0.8125rem', fontWeight: 600,
                        background: '#059669', border: 'none',
                        color: '#fff', cursor: uploading ? 'not-allowed' : 'pointer',
                        fontFamily: 'inherit', opacity: uploading ? 0.7 : 1,
                        transition: 'all 0.15s'
                      }}
                      onMouseEnter={(e) => { if (!uploading) e.currentTarget.style.background = '#047857'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.background = '#059669'; }}
                      id="save-photo-btn"
                    >
                      {uploading ? (
                        <><Loader2 style={{ width: '14px', height: '14px', animation: 'spin 1s linear infinite' }} /> Saving...</>
                      ) : (
                        <><CheckCircle style={{ width: '14px', height: '14px' }} /> Save Photo</>
                      )}
                    </button>
                    <button
                      onClick={handleCancelPreview}
                      style={{
                        padding: '8px 16px', borderRadius: '8px',
                        fontSize: '0.8125rem', fontWeight: 600,
                        background: '#fff', border: '1px solid #e5e7eb',
                        color: '#6b7280', cursor: 'pointer', fontFamily: 'inherit',
                        transition: 'all 0.15s'
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Profile details form */}
          <div className="cs-card" style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '0.9375rem', fontWeight: 600, color: '#111827', marginBottom: '20px' }}>Personal Information</h3>
            <form onSubmit={handleSave}>
              <div style={inputWrapStyle}>
                <label style={labelStyle}>Full Name</label>
                <div style={{ position: 'relative' }}>
                  <User style={iconStyle} />
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="cs-input"
                    placeholder="Your full name"
                    id="settings-name"
                  />
                </div>
              </div>
              <div style={inputWrapStyle}>
                <label style={labelStyle}>Email Address</label>
                <div style={{ position: 'relative' }}>
                  <Mail style={iconStyle} />
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="cs-input"
                    placeholder="you@example.com"
                    id="settings-email"
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={saving}
                className="cs-btn"
                style={{ width: 'auto', padding: '10px 24px' }}
                id="settings-save"
              >
                {saving ? (
                  <><Loader2 style={{ width: '16px', height: '16px', animation: 'spin 1s linear infinite' }} /> Saving...</>
                ) : (
                  <><Save style={{ width: '16px', height: '16px' }} /> Save Changes</>
                )}
              </button>
            </form>
          </div>
        </div>
      )}

      {activeTab === 'security' && (
        <div style={{ maxWidth: '640px' }}>
          <div className="cs-card" style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '0.9375rem', fontWeight: 600, color: '#111827', marginBottom: '20px' }}>Change Password</h3>
            <form onSubmit={handleSave}>
              <div style={inputWrapStyle}>
                <label style={labelStyle}>Current Password</label>
                <div style={{ position: 'relative' }}>
                  <Lock style={iconStyle} />
                  <input
                    type="password"
                    value={form.currentPassword}
                    onChange={(e) => setForm({ ...form, currentPassword: e.target.value })}
                    className="cs-input"
                    placeholder="Enter current password"
                    id="settings-current-pwd"
                  />
                </div>
              </div>
              <div style={inputWrapStyle}>
                <label style={labelStyle}>New Password</label>
                <div style={{ position: 'relative' }}>
                  <Lock style={iconStyle} />
                  <input
                    type="password"
                    value={form.newPassword}
                    onChange={(e) => setForm({ ...form, newPassword: e.target.value })}
                    className="cs-input"
                    placeholder="Min. 6 characters"
                    id="settings-new-pwd"
                  />
                </div>
              </div>
              <div style={inputWrapStyle}>
                <label style={labelStyle}>Confirm New Password</label>
                <div style={{ position: 'relative' }}>
                  <Lock style={iconStyle} />
                  <input
                    type="password"
                    value={form.confirmPassword}
                    onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                    className="cs-input"
                    placeholder="Repeat new password"
                    id="settings-confirm-pwd"
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={saving}
                className="cs-btn"
                style={{ width: 'auto', padding: '10px 24px' }}
                id="settings-update-pwd"
              >
                {saving ? (
                  <><Loader2 style={{ width: '16px', height: '16px', animation: 'spin 1s linear infinite' }} /> Updating...</>
                ) : (
                  <><Lock style={{ width: '16px', height: '16px' }} /> Update Password</>
                )}
              </button>
            </form>
          </div>

          {/* Two-factor section */}
          <div className="cs-card" style={{ padding: '24px', marginTop: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3 style={{ fontSize: '0.9375rem', fontWeight: 600, color: '#111827', marginBottom: '4px' }}>Two-Factor Authentication</h3>
                <p style={{ fontSize: '0.8125rem', color: '#6b7280' }}>Add an extra layer of security to your account.</p>
              </div>
              <button
                onClick={() => toast('2FA setup coming soon!', { icon: '🔐' })}
                style={{
                  padding: '8px 16px', borderRadius: '8px', fontSize: '0.8125rem',
                  fontWeight: 600, background: '#f9fafb', border: '1px solid #e5e7eb',
                  color: '#374151', cursor: 'pointer', fontFamily: 'inherit'
                }}
              >
                Enable
              </button>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'preferences' && (
        <div style={{ maxWidth: '640px' }}>
          <div className="cs-card" style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '0.9375rem', fontWeight: 600, color: '#111827', marginBottom: '20px' }}>Notification Preferences</h3>
            {[
              { label: 'Email notifications for scan results', desc: 'Receive scan reports via email', defaultOn: true },
              { label: 'Threat alert notifications', desc: 'Get alerted when dangerous URLs are detected', defaultOn: true },
              { label: 'Weekly summary reports', desc: 'Receive weekly scan activity summaries', defaultOn: false },
            ].map((pref, i) => (
              <div key={i} style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '14px 0',
                borderBottom: i < 2 ? '1px solid #f3f4f6' : 'none'
              }}>
                <div>
                  <p style={{ fontSize: '0.875rem', fontWeight: 500, color: '#111827', margin: 0 }}>{pref.label}</p>
                  <p style={{ fontSize: '0.75rem', color: '#9ca3af', margin: '2px 0 0' }}>{pref.desc}</p>
                </div>
                <ToggleSwitch defaultOn={pref.defaultOn} />
              </div>
            ))}
          </div>

          <div className="cs-card" style={{ padding: '24px', marginTop: '16px' }}>
            <h3 style={{ fontSize: '0.9375rem', fontWeight: 600, color: '#111827', marginBottom: '12px' }}>Danger Zone</h3>
            <p style={{ fontSize: '0.8125rem', color: '#6b7280', marginBottom: '16px' }}>
              Permanently delete your account and all scan history. This action cannot be undone.
            </p>
            <button
              onClick={() => toast.error('Account deletion is disabled in this demo.')}
              style={{
                padding: '8px 16px', borderRadius: '8px', fontSize: '0.8125rem',
                fontWeight: 600, background: '#fef2f2', border: '1px solid #fecaca',
                color: '#dc2626', cursor: 'pointer', fontFamily: 'inherit'
              }}
            >
              Delete Account
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

/* Simple toggle switch */
const ToggleSwitch = ({ defaultOn = false }) => {
  const [on, setOn] = useState(defaultOn);
  return (
    <button
      onClick={() => { setOn(!on); toast.success(on ? 'Disabled' : 'Enabled'); }}
      style={{
        width: '44px', height: '24px', borderRadius: '12px',
        background: on ? '#059669' : '#d1d5db',
        border: 'none', cursor: 'pointer', position: 'relative',
        transition: 'background 0.2s', flexShrink: 0
      }}
    >
      <div style={{
        width: '20px', height: '20px', borderRadius: '50%',
        background: '#fff', position: 'absolute', top: '2px',
        left: on ? '22px' : '2px',
        transition: 'left 0.2s',
        boxShadow: '0 1px 3px rgba(0,0,0,0.15)'
      }} />
    </button>
  );
};

export default SettingsPage;
