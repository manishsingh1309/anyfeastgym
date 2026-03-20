import React, { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { useAuth, AppRole } from '@/contexts/AuthContext';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import {
  User, Bell, Shield, Camera, Mail, Phone, CheckCircle2,
  Lock, Eye, EyeOff, Palette, Globe,
} from 'lucide-react';

// ── Role colour mapping ────────────────────────────────────────────────────────
const roleBadgeClass: Record<AppRole, string> = {
  super_admin: 'bg-amber-100 text-amber-800 border-amber-200',
  gym_owner:   'bg-purple-100 text-purple-800 border-purple-200',
  trainer:     'bg-blue-100  text-blue-800  border-blue-200',
  member:      'bg-green-100 text-green-800 border-green-200',
};

const roleLabel: Record<AppRole, string> = {
  super_admin: 'Super Admin',
  gym_owner:   'Gym Owner',
  trainer:     'Trainer',
  member:      'Member',
};

function getInitials(name?: string | null, email?: string | null): string {
  if (name?.trim()) {
    return name.split(' ').slice(0, 2).map((w) => w[0]).join('').toUpperCase();
  }
  return email?.[0]?.toUpperCase() || '?';
}

// ─────────────────────────────────────────────────────────────────────────────
const Settings: React.FC = () => {
  const { user, primaryRole } = useAuth();

  const fullName  = user?.user_metadata?.full_name || user?.user_metadata?.name || '';
  const email     = user?.email     || '';
  const phone     = user?.phone     || '';
  const avatarUrl = user?.user_metadata?.avatar_url || '';

  // ── Profile form ────────────────────────────────────────────────────────────
  const [displayName, setDisplayName] = useState(fullName);
  const [savedProfile, setSavedProfile] = useState(false);

  const handleSaveProfile = () => {
    setSavedProfile(true);
    toast.success('Profile updated successfully!');
    setTimeout(() => setSavedProfile(false), 2500);
  };

  // ── Password form ────────────────────────────────────────────────────────────
  const [currentPw, setCurrentPw]   = useState('');
  const [newPw, setNewPw]           = useState('');
  const [confirmPw, setConfirmPw]   = useState('');
  const [showCur, setShowCur]       = useState(false);
  const [showNew, setShowNew]       = useState(false);
  const [showCon, setShowCon]       = useState(false);

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPw)         { toast.error('Enter your current password.');           return; }
    if (newPw.length < 6)   { toast.error('New password must be at least 6 chars.'); return; }
    if (newPw !== confirmPw){ toast.error('Passwords do not match.');                return; }
    toast.success('Password changed! (demo — no real auth modified)');
    setCurrentPw(''); setNewPw(''); setConfirmPw('');
  };

  // ── Notification toggles ─────────────────────────────────────────────────────
  const [notif, setNotif] = useState({
    email_alerts:    true,
    sms_alerts:      false,
    coupon_updates:  true,
    commission:      true,
    member_activity: false,
    system_updates:  true,
  });

  const toggleNotif = (key: keyof typeof notif) => {
    setNotif((prev) => {
      const next = { ...prev, [key]: !prev[key] };
      toast.success(`${key.replace(/_/g, ' ')} ${next[key] ? 'enabled' : 'disabled'}.`);
      return next;
    });
  };

  const notifItems: { key: keyof typeof notif; label: string; desc: string }[] = [
    { key: 'email_alerts',    label: 'Email Alerts',          desc: 'Receive important updates via email.' },
    { key: 'sms_alerts',      label: 'SMS / WhatsApp Alerts', desc: 'Get notifications on your mobile number.' },
    { key: 'coupon_updates',  label: 'Coupon Activity',       desc: 'When coupons are created, redeemed, or expire.' },
    { key: 'commission',      label: 'Commission Payouts',    desc: 'Alerts when commissions are calculated or paid.' },
    { key: 'member_activity', label: 'Member Activity',       desc: 'When members join or renew subscriptions.' },
    { key: 'system_updates',  label: 'Platform Updates',      desc: 'Release notes and important platform changes.' },
  ];

  // ── Password strength helper ─────────────────────────────────────────────────
  const pwStrength = newPw.length >= 8 ? 4 : newPw.length >= 6 ? 3 : newPw.length >= 4 ? 2 : newPw.length > 0 ? 1 : 0;
  const pwStrengthLabel = ['', 'Weak', 'Fair', 'Good', 'Strong'][pwStrength];
  const pwStrengthColor = ['', 'bg-red-400', 'bg-amber-400', 'bg-blue-400', 'bg-green-500'][pwStrength];

  return (
    <DashboardLayout>
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>

        {/* Page header */}
        <div className="mb-8">
          <h1 className="text-3xl font-display font-bold">Settings</h1>
          <p className="text-muted-foreground mt-1">Manage your account, preferences and security.</p>
        </div>

        {/* ── Profile hero card ────────────────────────────────────────────── */}
        <Card className="mb-6 shadow-card border-border">
          <CardContent className="flex flex-col sm:flex-row items-center gap-5 pt-6 pb-6">
            {/* Avatar */}
            <div className="relative flex-shrink-0">
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt={displayName || email}
                  className="h-20 w-20 rounded-full object-cover ring-4 ring-primary/20"
                />
              ) : (
                <div className="h-20 w-20 rounded-full bg-primary flex items-center justify-center ring-4 ring-primary/20">
                  <span className="text-2xl font-bold text-primary-foreground">
                    {getInitials(displayName || fullName, email)}
                  </span>
                </div>
              )}
              <button className="absolute bottom-0 right-0 bg-card border border-border rounded-full p-1.5 shadow-sm hover:bg-muted transition-colors">
                <Camera className="h-3.5 w-3.5 text-muted-foreground" />
              </button>
            </div>

            {/* Info */}
            <div className="flex-1 text-center sm:text-left">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 flex-wrap">
                <h2 className="text-xl font-display font-bold">
                  {displayName || email || (phone && `+${phone}`) || 'Your Account'}
                </h2>
                {primaryRole && (
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${roleBadgeClass[primaryRole]}`}>
                    {roleLabel[primaryRole]}
                  </span>
                )}
              </div>
              <p className="text-sm text-muted-foreground mt-0.5">
                {email || (phone ? `+${phone}` : 'No contact info on file')}
              </p>
              <p className="text-xs text-muted-foreground mt-1.5 flex items-center gap-1 justify-center sm:justify-start">
                <CheckCircle2 className="h-3.5 w-3.5 text-green-500" /> Account active
              </p>
            </div>
          </CardContent>
        </Card>

        {/* ── Tabs ─────────────────────────────────────────────────────────── */}
        <Tabs defaultValue="profile">
          <TabsList className="mb-6 grid w-full grid-cols-3 max-w-md">
            <TabsTrigger value="profile"       className="flex items-center gap-1.5"><User  className="h-4 w-4" />Profile</TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center gap-1.5"><Bell  className="h-4 w-4" />Notifications</TabsTrigger>
            <TabsTrigger value="security"      className="flex items-center gap-1.5"><Shield className="h-4 w-4" />Security</TabsTrigger>
          </TabsList>

          {/* ── Profile ────────────────────────────────────────────────────── */}
          <TabsContent value="profile">
            <div className="grid gap-6 md:grid-cols-2">

              {/* Personal info */}
              <Card className="shadow-card border-border">
                <CardHeader>
                  <CardTitle className="text-base font-display">Personal Information</CardTitle>
                  <CardDescription>Update your display name and review your contact details.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="displayName">Display Name</Label>
                    <Input
                      id="displayName"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      placeholder="Your name"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="flex items-center gap-1.5 text-muted-foreground">
                      <Mail className="h-3.5 w-3.5" /> Email
                    </Label>
                    <Input value={email || '—'} disabled className="bg-muted/40 text-muted-foreground cursor-not-allowed" />
                    <p className="text-xs text-muted-foreground">Managed by your sign-in method — cannot be changed here.</p>
                  </div>

                  <div className="space-y-2">
                    <Label className="flex items-center gap-1.5 text-muted-foreground">
                      <Phone className="h-3.5 w-3.5" /> Phone
                    </Label>
                    <Input value={phone ? `+${phone}` : '—'} disabled className="bg-muted/40 text-muted-foreground cursor-not-allowed" />
                  </div>

                  <Button onClick={handleSaveProfile} className="w-full mt-2" disabled={savedProfile}>
                    {savedProfile
                      ? <span className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4" /> Saved!</span>
                      : 'Save Changes'}
                  </Button>
                </CardContent>
              </Card>

              {/* Account details */}
              <Card className="shadow-card border-border">
                <CardHeader>
                  <CardTitle className="text-base font-display">Account Details</CardTitle>
                  <CardDescription>Your role, ID and access information.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label className="text-xs text-muted-foreground uppercase tracking-wide">Role</Label>
                    <div className="mt-2">
                      {primaryRole && (
                        <Badge variant="outline" className={`${roleBadgeClass[primaryRole]} text-sm px-3 py-1`}>
                          {roleLabel[primaryRole]}
                        </Badge>
                      )}
                    </div>
                  </div>
                  <Separator />
                  <div>
                    <Label className="text-xs text-muted-foreground uppercase tracking-wide">User ID</Label>
                    <p className="mt-1 text-sm font-mono text-muted-foreground break-all">{user?.id || '—'}</p>
                  </div>
                  <Separator />
                  <div>
                    <Label className="text-xs text-muted-foreground uppercase tracking-wide">Sign-in Method</Label>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {email ? 'Google / Email' : phone ? 'Mobile OTP' : '—'}
                    </p>
                  </div>
                  <Separator />
                  <div>
                    <Label className="text-xs text-muted-foreground uppercase tracking-wide">Portal Route</Label>
                    <p className="mt-1 text-sm text-muted-foreground font-mono">
                      {primaryRole === 'super_admin' && '/admin'}
                      {primaryRole === 'gym_owner'   && '/owner'}
                      {primaryRole === 'trainer'     && '/trainer'}
                      {primaryRole === 'member'      && '/member'}
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Appearance */}
              <Card className="shadow-card border-border md:col-span-2">
                <CardHeader>
                  <CardTitle className="text-base font-display flex items-center gap-2">
                    <Palette className="h-4 w-4" /> Appearance &amp; Locale
                  </CardTitle>
                  <CardDescription>Visual preferences for your dashboard experience.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label className="flex items-center gap-1.5 text-muted-foreground">
                        <Globe className="h-3.5 w-3.5" /> Language
                      </Label>
                      <Input value="English (US)" disabled className="bg-muted/40 text-muted-foreground cursor-not-allowed" />
                    </div>
                    <div className="space-y-2">
                      <Label>Timezone</Label>
                      <Input value="Asia/Kolkata (IST +5:30)" disabled className="bg-muted/40 text-muted-foreground cursor-not-allowed" />
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-4">Language and timezone settings will be customisable in a future update.</p>
                </CardContent>
              </Card>

            </div>
          </TabsContent>

          {/* ── Notifications ───────────────────────────────────────────────── */}
          <TabsContent value="notifications">
            <Card className="shadow-card border-border max-w-2xl">
              <CardHeader>
                <CardTitle className="text-base font-display">Notification Preferences</CardTitle>
                <CardDescription>Choose what events you want to be notified about.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-0">
                {notifItems.map(({ key, label, desc }, idx) => (
                  <React.Fragment key={key}>
                    <div className="flex items-center justify-between py-4">
                      <div>
                        <p className="text-sm font-medium">{label}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">{desc}</p>
                      </div>
                      <Switch
                        checked={notif[key]}
                        onCheckedChange={() => toggleNotif(key)}
                      />
                    </div>
                    {idx < notifItems.length - 1 && <Separator />}
                  </React.Fragment>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          {/* ── Security ────────────────────────────────────────────────────── */}
          <TabsContent value="security">
            <div className="grid gap-6 max-w-2xl">

              {/* Change password */}
              <Card className="shadow-card border-border">
                <CardHeader>
                  <CardTitle className="text-base font-display flex items-center gap-2">
                    <Lock className="h-4 w-4" /> Change Password
                  </CardTitle>
                  <CardDescription>
                    Update your account password. Minimum 6 characters.{' '}
                    <span className="text-primary font-medium">(Demo — no real password is stored.)</span>
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleChangePassword} className="space-y-4">
                    {/* Current */}
                    <div className="space-y-2">
                      <Label htmlFor="currentPw">Current Password</Label>
                      <div className="relative">
                        <Input
                          id="currentPw"
                          type={showCur ? 'text' : 'password'}
                          value={currentPw}
                          onChange={(e) => setCurrentPw(e.target.value)}
                          placeholder="••••••••"
                          className="pr-10"
                        />
                        <button type="button" onClick={() => setShowCur(!showCur)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                          {showCur ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>

                    {/* New */}
                    <div className="space-y-2">
                      <Label htmlFor="newPw">New Password</Label>
                      <div className="relative">
                        <Input
                          id="newPw"
                          type={showNew ? 'text' : 'password'}
                          value={newPw}
                          onChange={(e) => setNewPw(e.target.value)}
                          placeholder="••••••••"
                          className="pr-10"
                        />
                        <button type="button" onClick={() => setShowNew(!showNew)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                          {showNew ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                      {/* Strength bar */}
                      {pwStrength > 0 && (
                        <div className="flex items-center gap-1 mt-1">
                          {[1, 2, 3, 4].map((l) => (
                            <div key={l} className={`h-1 flex-1 rounded-full transition-colors ${l <= pwStrength ? pwStrengthColor : 'bg-muted'}`} />
                          ))}
                          <span className="text-xs text-muted-foreground ml-1">{pwStrengthLabel}</span>
                        </div>
                      )}
                    </div>

                    {/* Confirm */}
                    <div className="space-y-2">
                      <Label htmlFor="confirmPw">Confirm New Password</Label>
                      <div className="relative">
                        <Input
                          id="confirmPw"
                          type={showCon ? 'text' : 'password'}
                          value={confirmPw}
                          onChange={(e) => setConfirmPw(e.target.value)}
                          placeholder="••••••••"
                          className={`pr-10 ${confirmPw && confirmPw !== newPw ? 'border-destructive focus-visible:ring-destructive' : ''}`}
                        />
                        <button type="button" onClick={() => setShowCon(!showCon)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                          {showCon ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                      {confirmPw && confirmPw !== newPw && (
                        <p className="text-xs text-destructive">Passwords do not match.</p>
                      )}
                    </div>

                    <Button type="submit" className="w-full">Update Password</Button>
                  </form>
                </CardContent>
              </Card>

              {/* Session info */}
              <Card className="shadow-card border-border">
                <CardHeader>
                  <CardTitle className="text-base font-display flex items-center gap-2">
                    <Shield className="h-4 w-4" /> Active Session
                  </CardTitle>
                  <CardDescription>Your current login session details.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">Current Device</p>
                      <p className="text-xs text-muted-foreground">
                        Web Browser &middot; {new Date().toLocaleDateString('en-US', { dateStyle: 'medium' })}
                      </p>
                    </div>
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Active</Badge>
                  </div>
                  <Separator />
                  <p className="text-xs text-muted-foreground">
                    This session is stored locally in demo mode. In production, sessions are managed securely by Supabase Auth.
                  </p>
                </CardContent>
              </Card>

            </div>
          </TabsContent>
        </Tabs>

      </motion.div>
    </DashboardLayout>
  );
};

export default Settings;
