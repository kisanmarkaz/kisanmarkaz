import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Bell, Settings as SettingsIcon, Shield, Languages, Phone, Mail, MapPin } from 'lucide-react';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/components/ui/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Language = 'en' | 'ur';

interface PreferencesState {
  language: Language;
  currency: string;
  darkMode: boolean;
  showFavorites: boolean;
  autoLocation: boolean;
}

const Settings = () => {
  const { user, updateProfile, updatePassword, updatePreferences } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const { language, setLanguage, t } = useLanguage();
  const [isChangingLanguage, setIsChangingLanguage] = useState(false);

  // Profile Settings
  const [profileForm, setProfileForm] = useState({
    fullName: user?.user_metadata?.full_name || '',
    phone: user?.phone || '',
    address: user?.user_metadata?.address || '',
    city: user?.user_metadata?.city || '',
    province: user?.user_metadata?.province || ''
  });

  // Password Settings
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // Notification Settings
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    smsNotifications: true,
    marketingEmails: false,
    newListingAlerts: true,
    messageNotifications: true,
    priceDropAlerts: true
  });

  // Preferences Settings
  const [preferences, setPreferences] = useState<PreferencesState>({
    language: language,
    currency: 'PKR',
    darkMode: false,
    showFavorites: true,
    autoLocation: true
  });

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateProfile({
        full_name: profileForm.fullName,
        phone: profileForm.phone,
        address: profileForm.address,
        city: profileForm.city,
        province: profileForm.province
      });
      toast({
        title: t('common.success'),
        description: t('settings.profile.updateSuccess'),
      });
    } catch (error) {
      toast({
        title: t('common.error'),
        description: t('settings.profile.updateError'),
        variant: "destructive"
      });
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast({
        title: "Error",
        description: "New passwords do not match.",
        variant: "destructive"
      });
      return;
    }
    try {
      await updatePassword(passwordForm.currentPassword, passwordForm.newPassword);
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      toast({
        title: "Password Updated",
        description: "Your password has been successfully updated.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update password. Please check your current password.",
        variant: "destructive"
      });
    }
  };

  const handleNotificationChange = async (key: string, value: boolean) => {
    setNotificationSettings(prev => ({ ...prev, [key]: value }));
    try {
      await updatePreferences({ notifications: { ...notificationSettings, [key]: value } });
      toast({
        title: "Preferences Updated",
        description: "Your notification settings have been saved.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update notification settings.",
        variant: "destructive"
      });
    }
  };

  const handleLanguageChange = async (newLanguage: Language) => {
    try {
      setIsChangingLanguage(true);
      await setLanguage(newLanguage);
      setPreferences(prev => ({ ...prev, language: newLanguage }));
      toast({
        title: t('common.success'),
        description: t('settings.preferences.languageUpdated'),
      });
    } catch (error) {
      toast({
        title: t('common.error'),
        description: t('settings.preferences.languageUpdateError'),
        variant: "destructive"
      });
    } finally {
      setIsChangingLanguage(false);
    }
  };

  const handlePreferenceChange = async (key: string, value: any) => {
    if (key === 'language') {
      await handleLanguageChange(value as Language);
      return;
    }

    setPreferences(prev => ({ ...prev, [key]: value }));
    try {
      await updatePreferences({ ...preferences, [key]: value });
      toast({
        title: t('common.success'),
        description: t('settings.preferences.updated'),
      });
    } catch (error) {
      toast({
        title: t('common.error'),
        description: t('settings.preferences.updateError'),
        variant: "destructive"
      });
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">{t('common.settings')}</h1>

          <Tabs defaultValue="profile" className="space-y-4">
            <TabsList>
              <TabsTrigger value="profile" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                {t('common.profile')}
              </TabsTrigger>
              <TabsTrigger value="security" className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                {t('common.security')}
              </TabsTrigger>
              <TabsTrigger value="notifications" className="flex items-center gap-2">
                <Bell className="h-4 w-4" />
                {t('common.notifications')}
              </TabsTrigger>
              <TabsTrigger value="preferences" className="flex items-center gap-2">
                <SettingsIcon className="h-4 w-4" />
                {t('common.preferences')}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="profile" className="space-y-4">
              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <h2 className="text-xl font-semibold mb-4">{t('settings.profile.title')}</h2>
                <form onSubmit={handleProfileSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="fullName">{t('settings.profile.fullName')}</Label>
                      <Input
                        id="fullName"
                        value={profileForm.fullName}
                        onChange={(e) => setProfileForm(prev => ({ ...prev, fullName: e.target.value }))}
                        placeholder={t('settings.profile.fullName')}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">{t('settings.profile.phone')}</Label>
                      <Input
                        id="phone"
                        value={profileForm.phone}
                        onChange={(e) => setProfileForm(prev => ({ ...prev, phone: e.target.value }))}
                        placeholder={t('settings.profile.phone')}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="address">{t('settings.profile.address')}</Label>
                      <Input
                        id="address"
                        value={profileForm.address}
                        onChange={(e) => setProfileForm(prev => ({ ...prev, address: e.target.value }))}
                        placeholder={t('settings.profile.address')}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="city">{t('settings.profile.city')}</Label>
                      <Input
                        id="city"
                        value={profileForm.city}
                        onChange={(e) => setProfileForm(prev => ({ ...prev, city: e.target.value }))}
                        placeholder={t('settings.profile.city')}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="province">{t('settings.profile.province')}</Label>
                      <Input
                        id="province"
                        value={profileForm.province}
                        onChange={(e) => setProfileForm(prev => ({ ...prev, province: e.target.value }))}
                        placeholder={t('settings.profile.province')}
                      />
                    </div>
                  </div>
                  <Button type="submit" className="mt-4">{t('common.save')}</Button>
                </form>
              </div>
            </TabsContent>

            <TabsContent value="security" className="space-y-4">
              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <h2 className="text-xl font-semibold mb-4">Change Password</h2>
                <form onSubmit={handlePasswordSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="currentPassword">Current Password</Label>
                    <Input
                      id="currentPassword"
                      type="password"
                      value={passwordForm.currentPassword}
                      onChange={(e) => setPasswordForm(prev => ({ ...prev, currentPassword: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="newPassword">New Password</Label>
                    <Input
                      id="newPassword"
                      type="password"
                      value={passwordForm.newPassword}
                      onChange={(e) => setPasswordForm(prev => ({ ...prev, newPassword: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm New Password</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      value={passwordForm.confirmPassword}
                      onChange={(e) => setPasswordForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                    />
                  </div>
                  <Button type="submit">Update Password</Button>
                </form>
              </div>
            </TabsContent>

            <TabsContent value="notifications" className="space-y-4">
              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <h2 className="text-xl font-semibold mb-4">Notification Preferences</h2>
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Email Notifications</Label>
                      <p className="text-sm text-gray-500">Receive notifications via email</p>
                    </div>
                    <Switch
                      checked={notificationSettings.emailNotifications}
                      onCheckedChange={(checked) => handleNotificationChange('emailNotifications', checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>SMS Notifications</Label>
                      <p className="text-sm text-gray-500">Receive notifications via SMS</p>
                    </div>
                    <Switch
                      checked={notificationSettings.smsNotifications}
                      onCheckedChange={(checked) => handleNotificationChange('smsNotifications', checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Marketing Emails</Label>
                      <p className="text-sm text-gray-500">Receive marketing and promotional emails</p>
                    </div>
                    <Switch
                      checked={notificationSettings.marketingEmails}
                      onCheckedChange={(checked) => handleNotificationChange('marketingEmails', checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>New Listing Alerts</Label>
                      <p className="text-sm text-gray-500">Get notified about new listings in your area</p>
                    </div>
                    <Switch
                      checked={notificationSettings.newListingAlerts}
                      onCheckedChange={(checked) => handleNotificationChange('newListingAlerts', checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Message Notifications</Label>
                      <p className="text-sm text-gray-500">Get notified about new messages</p>
                    </div>
                    <Switch
                      checked={notificationSettings.messageNotifications}
                      onCheckedChange={(checked) => handleNotificationChange('messageNotifications', checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Price Drop Alerts</Label>
                      <p className="text-sm text-gray-500">Get notified when items in your wishlist drop in price</p>
                    </div>
                    <Switch
                      checked={notificationSettings.priceDropAlerts}
                      onCheckedChange={(checked) => handleNotificationChange('priceDropAlerts', checked)}
                    />
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="preferences" className="space-y-4">
              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <h2 className="text-xl font-semibold mb-4">{t('settings.preferences.title')}</h2>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>{t('settings.preferences.language')}</Label>
                    </div>
                    <div className="flex items-center gap-2">
                      {isChangingLanguage && <LoadingSpinner />}
                      <Select
                        value={preferences.language}
                        onValueChange={(value) => handlePreferenceChange('language', value as Language)}
                        disabled={isChangingLanguage}
                      >
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder={t('settings.preferences.language')} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="en">{t('settings.languageOptions.en')}</SelectItem>
                          <SelectItem value="ur">{t('settings.languageOptions.ur')}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Dark Mode</Label>
                      <p className="text-sm text-gray-500">Enable dark mode theme</p>
                    </div>
                    <Switch
                      checked={preferences.darkMode}
                      onCheckedChange={(checked) => handlePreferenceChange('darkMode', checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Auto-detect Location</Label>
                      <p className="text-sm text-gray-500">Automatically detect your location</p>
                    </div>
                    <Switch
                      checked={preferences.autoLocation}
                      onCheckedChange={(checked) => handlePreferenceChange('autoLocation', checked)}
                    />
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </Layout>
  );
};

export default Settings; 