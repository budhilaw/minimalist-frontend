import React, { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import { useAuth } from '../../hooks/useAuth';
import { ProfileService, UpdateProfileRequest, ChangePasswordRequest } from '../../services/profileService';
import { useNavigate } from 'react-router-dom';
import { formatTableDate } from '../../utils/dateFormatter';

interface ProfileFormData {
  name: string;
  username: string;
  email: string;
  phone: string;
}

interface PasswordFormData {
  current_password: string;
  new_password: string;
  confirm_password: string;
}

export const AdminProfile: React.FC = () => {
  const { user, updateUser, logout } = useAuth();
  const navigate = useNavigate();
  
  // Profile form state
  const [profileData, setProfileData] = useState<ProfileFormData>({
    name: user?.full_name || '',
    username: user?.username || '',
    email: user?.email || '',
    phone: user?.phone || ''
  });

  // Password form state
  const [passwordData, setPasswordData] = useState<PasswordFormData>({
    current_password: '',
    new_password: '',
    confirm_password: ''
  });

  // UI state
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isProfileLoading, setIsProfileLoading] = useState(false);
  const [isPasswordLoading, setIsPasswordLoading] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [profileError, setProfileError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  // Update form data when user data changes
  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.full_name || '',
        username: user.username || '',
        email: user.email || '',
        phone: user.phone || ''
      });
    }
  }, [user]);

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear success/error messages when user starts typing
    if (profileSuccess) setProfileSuccess('');
    if (profileError) setProfileError('');
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!passwordData.current_password || !passwordData.new_password) {
      setPasswordError('Please fill in all password fields');
      return;
    }

    if (passwordData.new_password !== passwordData.confirm_password) {
      setPasswordError('New passwords do not match');
      return;
    }

    if (passwordData.new_password.length < 8) {
      setPasswordError('New password must be at least 8 characters long');
      return;
    }

    setIsPasswordLoading(true);
    setPasswordError('');
    setPasswordSuccess('');

    try {
      const response = await ProfileService.changePassword({
        current_password: passwordData.current_password,
        new_password: passwordData.new_password
      });

      if (response.error) {
        setPasswordError(response.error);
        return;
      }

      if (response.data) {
        // Check if re-authentication is required
        if (response.data.requires_reauth) {
          // Clear user session and redirect to login with message
          logout();
          navigate('/admin/login', { 
            state: { 
              message: 'Your password has been changed successfully. Please sign in again with your new password for security.' 
            },
            replace: true 
          });
          return;
        }

        setPasswordSuccess(response.data.message);
        setPasswordData({
          current_password: '',
          new_password: '',
          confirm_password: ''
        });
      }
    } catch (error: any) {
      console.error('Password change error:', error);
      setPasswordError(error.message || 'Failed to change password. Please try again.');
    } finally {
      setIsPasswordLoading(false);
    }
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProfileLoading(true);
    setProfileError('');
    setProfileSuccess('');

    try {
      const updateRequest: UpdateProfileRequest = {
        full_name: profileData.name,
        username: profileData.username,
        email: profileData.email,
        phone: profileData.phone || undefined
      };

      const response = await ProfileService.updateProfile(updateRequest);
      
      if (response.error) {
        setProfileError(response.error);
        return;
      }

      if (response.data) {
        setProfileSuccess(response.data.message || 'Profile updated successfully!');
        // Update the user context with new data
        if (updateUser) {
          updateUser(response.data.data.user);
        }
      }
    } catch (error) {
      console.error('Profile update error:', error);
      setProfileError('Failed to update profile. Please try again.');
    } finally {
      setIsProfileLoading(false);
    }
  };

  const validatePasswordStrength = (password: string): string | null => {
    if (password.length < 8) {
      return 'Password must be at least 8 characters long.';
    }

    const hasLowercase = /[a-z]/.test(password);
    const hasUppercase = /[A-Z]/.test(password);
    const hasDigit = /\d/.test(password);
    const hasSpecial = /[!@#$%^&*()_+\-=\[\]{}|;:,.<>?]/.test(password);

    const criteriaMet = [hasLowercase, hasUppercase, hasDigit, hasSpecial].filter(Boolean).length;

    if (criteriaMet < 3) {
      return 'Password must contain at least 3 of the following: lowercase letters, uppercase letters, numbers, and special characters (!@#$%^&*()_+-=[]{}|;:,.<>?).';
    }

    return null;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[rgb(var(--color-foreground))]">Profile Settings</h1>
        <p className="text-[rgb(var(--color-muted-foreground))] mt-2">
          Manage your account information and security settings.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Profile Information */}
        <div className="bg-[rgb(var(--color-card))] p-6 rounded-lg border border-[rgb(var(--color-border))]">
          <div className="flex items-center mb-6">
            <Icon icon="lucide:user" className="text-[rgb(var(--color-primary))] mr-3" width={24} height={24} />
            <h2 className="text-xl font-semibold text-[rgb(var(--color-foreground))]">
              Profile Information
            </h2>
          </div>

          <form onSubmit={handleProfileSubmit} className="space-y-4">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-[rgb(var(--color-foreground))] mb-2">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                value={profileData.name}
                onChange={handleProfileChange}
                className="w-full px-4 py-3 bg-[rgb(var(--color-background))] border border-[rgb(var(--color-border))] rounded-md text-[rgb(var(--color-foreground))] placeholder-[rgb(var(--color-muted-foreground))] focus:ring-2 focus:ring-[rgb(var(--color-primary))] focus:border-transparent transition-colors"
                placeholder="Enter your full name"
                required
              />
            </div>

            {/* Username */}
            <div>
              <label className="block text-sm font-medium text-[rgb(var(--color-foreground))] mb-2">
                Username
              </label>
              <input
                type="text"
                name="username"
                value={profileData.username}
                onChange={handleProfileChange}
                className="w-full px-4 py-3 bg-[rgb(var(--color-background))] border border-[rgb(var(--color-border))] rounded-md text-[rgb(var(--color-foreground))] placeholder-[rgb(var(--color-muted-foreground))] focus:ring-2 focus:ring-[rgb(var(--color-primary))] focus:border-transparent transition-colors"
                placeholder="Enter your username"
                required
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-[rgb(var(--color-foreground))] mb-2">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={profileData.email}
                onChange={handleProfileChange}
                className="w-full px-4 py-3 bg-[rgb(var(--color-background))] border border-[rgb(var(--color-border))] rounded-md text-[rgb(var(--color-foreground))] placeholder-[rgb(var(--color-muted-foreground))] focus:ring-2 focus:ring-[rgb(var(--color-primary))] focus:border-transparent transition-colors"
                placeholder="Enter your email address"
                required
              />
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-[rgb(var(--color-foreground))] mb-2">
                Phone (WhatsApp)
              </label>
              <input
                type="tel"
                name="phone"
                value={profileData.phone}
                onChange={handleProfileChange}
                className="w-full px-4 py-3 bg-[rgb(var(--color-background))] border border-[rgb(var(--color-border))] rounded-md text-[rgb(var(--color-foreground))] placeholder-[rgb(var(--color-muted-foreground))] focus:ring-2 focus:ring-[rgb(var(--color-primary))] focus:border-transparent transition-colors"
                placeholder="+1 234 567 8900"
              />
            </div>

            {/* Success/Error Messages */}
            {profileSuccess && (
              <div className="p-3 bg-green-100 dark:bg-green-900/20 border border-green-300 dark:border-green-700 rounded-md">
                <p className="text-sm text-green-700 dark:text-green-300">{profileSuccess}</p>
              </div>
            )}

            {profileError && (
              <div className="p-3 bg-red-100 dark:bg-red-900/20 border border-red-300 dark:border-red-700 rounded-md">
                <p className="text-sm text-red-700 dark:text-red-300">{profileError}</p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isProfileLoading}
              className="w-full flex items-center justify-center px-4 py-3 bg-[rgb(var(--color-primary))] text-white rounded-md hover:bg-[rgb(var(--color-primary))]/90 focus:ring-2 focus:ring-[rgb(var(--color-primary))] focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isProfileLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <Icon icon="lucide:save" width={16} height={16} className="mr-2" />
                  Update Profile
                </>
              )}
            </button>
          </form>
        </div>

        {/* Change Password */}
        <div className="bg-[rgb(var(--color-card))] p-6 rounded-lg border border-[rgb(var(--color-border))]">
          <div className="flex items-center mb-6">
            <Icon icon="lucide:key" className="text-[rgb(var(--color-primary))] mr-3" width={24} height={24} />
            <h2 className="text-xl font-semibold text-[rgb(var(--color-foreground))]">
              Change Password
            </h2>
          </div>

          <form onSubmit={handlePasswordChange} className="space-y-4">
            {/* Current Password */}
            <div>
              <label className="block text-sm font-medium text-[rgb(var(--color-foreground))] mb-2">
                Current Password
              </label>
              <div className="relative">
                <input
                  type={showCurrentPassword ? "text" : "password"}
                  name="current_password"
                  value={passwordData.current_password}
                  onChange={(e) => setPasswordData({ ...passwordData, current_password: e.target.value })}
                  className="w-full px-4 py-3 pr-12 bg-[rgb(var(--color-background))] border border-[rgb(var(--color-border))] rounded-md text-[rgb(var(--color-foreground))] placeholder-[rgb(var(--color-muted-foreground))] focus:ring-2 focus:ring-[rgb(var(--color-primary))] focus:border-transparent transition-colors"
                  placeholder="Enter current password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[rgb(var(--color-muted-foreground))] hover:text-[rgb(var(--color-foreground))]"
                >
                  {showCurrentPassword ? <Icon icon="lucide:eye-off" width={16} height={16} /> : <Icon icon="lucide:eye" width={16} height={16} />}
                </button>
              </div>
            </div>

            {/* New Password */}
            <div>
              <label className="block text-sm font-medium text-[rgb(var(--color-foreground))] mb-2">
                New Password
              </label>
              <div className="relative">
                <input
                  type={showNewPassword ? "text" : "password"}
                  name="new_password"
                  value={passwordData.new_password}
                  onChange={(e) => setPasswordData({ ...passwordData, new_password: e.target.value })}
                  className="w-full px-4 py-3 pr-12 bg-[rgb(var(--color-background))] border border-[rgb(var(--color-border))] rounded-md text-[rgb(var(--color-foreground))] placeholder-[rgb(var(--color-muted-foreground))] focus:ring-2 focus:ring-[rgb(var(--color-primary))] focus:border-transparent transition-colors"
                  placeholder="Enter new password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[rgb(var(--color-muted-foreground))] hover:text-[rgb(var(--color-foreground))]"
                >
                  {showNewPassword ? <Icon icon="lucide:eye-off" width={16} height={16} /> : <Icon icon="lucide:eye" width={16} height={16} />}
                </button>
              </div>
              <p className="text-xs text-[rgb(var(--color-muted-foreground))] mt-1">
                Password must be at least 8 characters and contain at least 3 of: lowercase, uppercase, numbers, special characters
              </p>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-[rgb(var(--color-foreground))] mb-2">
                Confirm New Password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirm_password"
                  value={passwordData.confirm_password}
                  onChange={(e) => setPasswordData({ ...passwordData, confirm_password: e.target.value })}
                  className="w-full px-4 py-3 pr-12 bg-[rgb(var(--color-background))] border border-[rgb(var(--color-border))] rounded-md text-[rgb(var(--color-foreground))] placeholder-[rgb(var(--color-muted-foreground))] focus:ring-2 focus:ring-[rgb(var(--color-primary))] focus:border-transparent transition-colors"
                  placeholder="Confirm new password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[rgb(var(--color-muted-foreground))] hover:text-[rgb(var(--color-foreground))]"
                >
                  {showConfirmPassword ? <Icon icon="lucide:eye-off" width={16} height={16} /> : <Icon icon="lucide:eye" width={16} height={16} />}
                </button>
              </div>
            </div>

            {/* Success/Error Messages */}
            {passwordSuccess && (
              <div className="p-3 bg-green-100 dark:bg-green-900/20 border border-green-300 dark:border-green-700 rounded-md">
                <p className="text-sm text-green-700 dark:text-green-300">{passwordSuccess}</p>
              </div>
            )}

            {passwordError && (
              <div className="p-3 bg-red-100 dark:bg-red-900/20 border border-red-300 dark:border-red-700 rounded-md">
                <p className="text-sm text-red-700 dark:text-red-300">{passwordError}</p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isPasswordLoading}
              className="w-full flex items-center justify-center px-4 py-3 bg-[rgb(var(--color-primary))] text-white rounded-md hover:bg-[rgb(var(--color-primary))]/90 focus:ring-2 focus:ring-[rgb(var(--color-primary))] focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isPasswordLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <Icon icon="lucide:key" width={16} height={16} className="mr-2" />
                  Change Password
                </>
              )}
            </button>
          </form>
        </div>
      </div>

      {/* Account Information */}
      <div className="bg-[rgb(var(--color-card))] p-6 rounded-lg border border-[rgb(var(--color-border))]">
        <h2 className="text-xl font-semibold text-[rgb(var(--color-foreground))] mb-4">
          Account Information
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <span className="text-sm font-medium text-[rgb(var(--color-muted-foreground))]">Account Type:</span>
            <p className="text-[rgb(var(--color-foreground))] capitalize">{user?.role || 'Admin'}</p>
          </div>
          <div>
            <span className="text-sm font-medium text-[rgb(var(--color-muted-foreground))]">Last Login:</span>
            <p className="text-[rgb(var(--color-foreground))]">
              {user?.lastLogin ? formatTableDate(user.lastLogin) : 'Today'}
            </p>
          </div>
          <div>
            <span className="text-sm font-medium text-[rgb(var(--color-muted-foreground))]">Account Status:</span>
            <p className="text-green-600 font-medium">Active</p>
          </div>
          <div>
            <span className="text-sm font-medium text-[rgb(var(--color-muted-foreground))]">Member Since:</span>
            <p className="text-[rgb(var(--color-foreground))]">January 2024</p>
          </div>
        </div>
      </div>
    </div>
  );
}; 