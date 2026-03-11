import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import logo from '@/assets/anyfeast-logo.png';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Phone, ArrowRight, ChevronLeft, Loader2, ShieldCheck, X, Check } from 'lucide-react';
import { useAuth, AppRole } from '@/contexts/AuthContext';

// ── Google SVG icon ───────────────────────────────────────────────────────────
const GoogleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
    <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
    <path d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332C2.438 15.983 5.482 18 9 18z" fill="#34A853"/>
    <path d="M3.964 10.706c-.18-.54-.282-1.117-.282-1.706s.102-1.166.282-1.706V4.962H.957C.347 6.175 0 7.55 0 9s.348 2.825.957 4.038l3.007-2.332z" fill="#FBBC05"/>
    <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0 5.482 0 2.438 2.017.957 4.962L3.964 7.294C4.672 5.167 6.656 3.58 9 3.58z" fill="#EA4335"/>
  </svg>
);

// ── Mock Google accounts (prototype) ─────────────────────────────────────────
const MOCK_GOOGLE_ACCOUNTS: { name: string; email: string; picture: string; role: AppRole }[] = [
  {
    name: 'Sara Trainer',
    email: 'sara.trainer@gmail.com',
    picture: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sara&backgroundColor=b6e3f4',
    role: 'trainer',
  },
  {
    name: 'Mike Owner',
    email: 'mike.owner@gmail.com',
    picture: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mike&backgroundColor=ffd5dc',
    role: 'gym_owner',
  },
  {
    name: 'John Member',
    email: 'john.member@gmail.com',
    picture: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John&backgroundColor=d1f4d1',
    role: 'member',
  },
];

// ── Mock Google Account Picker ─────────────────────────────────────────────────
const GoogleAccountPicker: React.FC<{
  onSelect: (account: typeof MOCK_GOOGLE_ACCOUNTS[0]) => void;
  onClose: () => void;
  isLoading: boolean;
  selectedEmail: string | null;
}> = ({ onSelect, onClose, isLoading, selectedEmail }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
    {/* Backdrop */}
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 bg-black/40 backdrop-blur-sm"
      onClick={onClose}
    />
    {/* Card */}
    <motion.div
      initial={{ opacity: 0, scale: 0.92, y: 16 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.92, y: 16 }}
      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
      className="relative bg-white rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <GoogleIcon />
          <span className="text-sm font-medium text-gray-700">Sign in with Google</span>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 rounded-full hover:bg-gray-100 transition-colors text-gray-400 hover:text-gray-600"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Subtitle */}
      <div className="px-6 pt-4 pb-2">
        <p className="text-xs text-gray-500 text-center">Choose an account to continue to AnyFeast</p>
      </div>

      {/* Accounts list */}
      <div className="px-3 pb-3 space-y-1">
        {MOCK_GOOGLE_ACCOUNTS.map((account) => {
          const isSelected = selectedEmail === account.email;
          return (
            <button
              key={account.email}
              onClick={() => !isLoading && onSelect(account)}
              disabled={isLoading}
              className={`w-full flex items-center gap-3 px-3 py-3 rounded-2xl transition-all duration-150 text-left ${
                isSelected
                  ? 'bg-blue-50 border border-blue-200'
                  : 'hover:bg-gray-50 border border-transparent'
              }`}
            >
              <img
                src={account.picture}
                alt={account.name}
                className="h-10 w-10 rounded-full bg-gray-100 flex-shrink-0"
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-800 truncate">{account.name}</p>
                <p className="text-xs text-gray-500 truncate">{account.email}</p>
              </div>
              {isSelected && (
                isLoading
                  ? <Loader2 className="h-4 w-4 text-blue-500 animate-spin flex-shrink-0" />
                  : <Check className="h-4 w-4 text-blue-500 flex-shrink-0" />
              )}
            </button>
          );
        })}
      </div>

      {/* Footer */}
      <div className="px-6 py-3 bg-gray-50 border-t border-gray-100">
        <p className="text-center text-[11px] text-gray-400">
          Demo mode — select any account to sign in instantly
        </p>
      </div>
    </motion.div>
  </div>
);

// ── Mock OTP constant (prototype only) ───────────────────────────────────────
const MOCK_OTP = '123456';

// ── Fake delay to simulate network ───────────────────────────────────────────
const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

// ── OTP digit boxes ───────────────────────────────────────────────────────────
const OtpInput: React.FC<{ value: string; onChange: (v: string) => void }> = ({ value, onChange }) => {
  const refs = Array.from({ length: 6 }, () => useRef<HTMLInputElement>(null));

  const handleKey = (i: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !refs[i].current?.value && i > 0) {
      refs[i - 1].current?.focus();
    }
  };

  const handleChange = (i: number, ch: string) => {
    const digit = ch.replace(/\D/g, '').slice(-1);
    const arr = value.split('');
    arr[i] = digit;
    const next = arr.join('').padEnd(6, '').slice(0, 6);
    onChange(next.trimEnd());
    if (digit && i < 5) refs[i + 1].current?.focus();
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    onChange(pasted);
    refs[Math.min(pasted.length, 5)].current?.focus();
    e.preventDefault();
  };

  return (
    <div className="flex gap-2 justify-center">
      {Array.from({ length: 6 }).map((_, i) => (
        <input
          key={i}
          ref={refs[i]}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={value[i] ?? ''}
          onChange={(e) => handleChange(i, e.target.value)}
          onKeyDown={(e) => handleKey(i, e)}
          onPaste={handlePaste}
          className="w-11 h-13 text-center text-xl font-mono font-bold rounded-lg border-2 border-input bg-background focus:border-primary focus:outline-none transition-colors"
          style={{ height: '3.25rem' }}
          autoFocus={i === 0}
        />
      ))}
    </div>
  );
};

// ── Main Login component ──────────────────────────────────────────────────────
const Login: React.FC = () => {
  const navigate = useNavigate();
  const { loginWithGoogle, loginWithMobile } = useAuth();

  // ── state ──────────────────────────────────────────────────────────────────
  const [countryCode, setCountryCode] = useState('+91');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState<'options' | 'phone' | 'otp'>('options');
  const [isLoading, setIsLoading] = useState(false);
  const [showGooglePicker, setShowGooglePicker] = useState(false);
  const [selectedGoogleEmail, setSelectedGoogleEmail] = useState<string | null>(null);

  // ── Mock Google sign-in ────────────────────────────────────────────────────
  const handleGoogleSelect = async (account: typeof MOCK_GOOGLE_ACCOUNTS[0]) => {
    setSelectedGoogleEmail(account.email);
    setIsLoading(true);
    await delay(1200); // simulate network
    loginWithGoogle({
      name: account.name,
      email: account.email,
      picture: account.picture,
      role: account.role,
    });
    toast.success(`Welcome, ${account.name}! 🎉`);
    navigate('/', { replace: true });
  };

  // ── Send mock OTP ──────────────────────────────────────────────────────────
  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    const digits = phone.replace(/\D/g, '');
    if (digits.length < 7) { toast.error('Enter a valid phone number.'); return; }
    setIsLoading(true);
    await delay(1200); // simulate network
    setIsLoading(false);
    toast.success(`OTP sent to ${countryCode} ${digits}  (use 123456 for demo)`);
    setOtp('');
    setStep('otp');
  };

  // ── Phone → role map ──────────────────────────────────────────────────────
  const PHONE_ROLE_MAP: Record<string, AppRole> = {
    '9999999999': 'trainer',
    '8888888888': 'gym_owner',
    '7777777777': 'member',
    '6666666666': 'super_admin',
  };

  // ── Verify mock OTP ────────────────────────────────────────────────────────
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length < 6) { toast.error('Enter the 6-digit OTP.'); return; }
    setIsLoading(true);
    await delay(1000); // simulate network
    if (otp !== MOCK_OTP) {
      setIsLoading(false);
      toast.error('Incorrect OTP. Use 123456 for this demo.');
      return;
    }
    const digits = phone.replace(/\D/g, '');
    const role = PHONE_ROLE_MAP[digits];
    if (!role) {
      setIsLoading(false);
      toast.error('Unknown demo number. Try: 9999999999 (Trainer), 8888888888 (Owner), 7777777777 (Member), 6666666666 (Admin)');
      return;
    }
    loginWithMobile(digits, role);
    toast.success('Verified! Welcome 🎉');
    navigate('/', { replace: true });
  };

  // ── Branding panel (shared) ────────────────────────────────────────────────
  const BrandPanel = () => (
    <div className="hidden lg:flex lg:w-1/2 bg-primary items-center justify-center p-12 relative overflow-hidden">
      {/* decorative circles */}
      <div className="absolute -top-20 -left-20 w-80 h-80 rounded-full bg-white/5" />
      <div className="absolute -bottom-20 -right-20 w-96 h-96 rounded-full bg-white/5" />
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 text-center max-w-md"
      >
        <img src={logo} alt="AnyFeast" className="h-20 w-auto mx-auto mb-8 drop-shadow-xl" />
        <h1 className="text-4xl font-display font-bold text-primary-foreground mb-4">
          Gym Partner Portal
        </h1>
        <p className="text-primary-foreground/80 text-lg leading-relaxed">
          Manage trainers, track licenses, and grow your fitness community with AnyFeast's powerful platform.
        </p>
        <div className="mt-10 flex justify-center gap-6 text-primary-foreground/60 text-sm">
          <span>✓ Role-based access</span>
          <span>✓ Analytics</span>
          <span>✓ Licenses</span>
        </div>
      </motion.div>
    </div>
  );

  // ── Right panel wrapper ────────────────────────────────────────────────────
  return (
    <div className="flex min-h-screen bg-background">
      {/* Mock Google account picker overlay */}
      <AnimatePresence>
        {showGooglePicker && (
          <GoogleAccountPicker
            onSelect={handleGoogleSelect}
            onClose={() => { if (!isLoading) { setShowGooglePicker(false); setSelectedGoogleEmail(null); } }}
            isLoading={isLoading}
            selectedEmail={selectedGoogleEmail}
          />
        )}
      </AnimatePresence>

      <BrandPanel />

      <div className="flex w-full lg:w-1/2 items-center justify-center p-6 sm:p-10">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.45, delay: 0.15 }}
          className="w-full max-w-md"
        >
          {/* Mobile logo */}
          <div className="lg:hidden flex justify-center mb-8">
            <img src={logo} alt="AnyFeast" className="h-12 w-auto" />
          </div>

          <div className="mb-8">
            <h2 className="text-3xl font-display font-bold mb-1 text-foreground">
              Welcome to AnyFeast
            </h2>
            <p className="text-muted-foreground">
              Gym Partner Portal — sign in to continue
            </p>
          </div>

          {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
              STEP: Options
          ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
          <AnimatePresence mode="wait">
            {step === 'options' && (
              <motion.div
                key="options"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.22 }}
                className="space-y-4"
              >
                {/* Google button */}
                <button
                  type="button"
                  onClick={() => { setShowGooglePicker(true); setSelectedGoogleEmail(null); }}
                  disabled={isLoading}
                  className="w-full flex items-center justify-center gap-3 h-12 bg-white border border-[#dadce0] rounded-lg text-[#3c4043] font-semibold text-sm hover:shadow-md hover:bg-gray-50 transition-all duration-200 disabled:opacity-60"
                >
                  <GoogleIcon />
                  Continue with Google
                </button>

                {/* Divider */}
                <div className="flex items-center gap-3">
                  <hr className="flex-1 border-border" />
                  <span className="text-xs text-muted-foreground uppercase tracking-wider">or</span>
                  <hr className="flex-1 border-border" />
                </div>

                {/* Mobile OTP button */}
                <button
                  type="button"
                  onClick={() => setStep('phone')}
                  className="w-full flex items-center justify-center gap-3 h-12 rounded-lg border-2 border-primary/30 bg-primary/5 hover:bg-primary/10 text-primary font-semibold text-sm transition-all duration-200"
                >
                  <Phone className="h-4 w-4" />
                  Login with Mobile Number (OTP)
                </button>

                <p className="text-center text-xs text-muted-foreground pt-2">
                  By signing in you agree to our Terms &amp; Privacy Policy.
                </p>
              </motion.div>
            )}

            {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
                STEP: Enter phone number
            ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
            {step === 'phone' && (
              <motion.form
                key="phone"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.22 }}
                onSubmit={handleSendOtp}
                className="space-y-5"
              >
                <button
                  type="button"
                  onClick={() => setStep('options')}
                  className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors mb-1"
                >
                  <ChevronLeft className="h-4 w-4" /> Back
                </button>

                <div className="space-y-2">
                  <Label htmlFor="phone">Mobile Number</Label>
                  <div className="flex gap-2">
                    <select
                      value={countryCode}
                      onChange={(e) => setCountryCode(e.target.value)}
                      className="h-12 rounded-lg border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring shrink-0"
                    >
                      <option value="+91">🇮🇳 +91</option>
                      <option value="+1">🇺🇸 +1</option>
                      <option value="+44">🇬🇧 +44</option>
                      <option value="+61">🇦🇺 +61</option>
                      <option value="+971">🇦🇪 +971</option>
                      <option value="+65">🇸🇬 +65</option>
                    </select>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="9876543210"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      required
                      className="h-12 flex-1 rounded-lg"
                      autoFocus
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    We'll send a 6-digit OTP to this number.
                  </p>
                </div>

                <Button
                  type="submit"
                  className="w-full h-12 font-semibold text-base rounded-lg"
                  disabled={isLoading}
                >
                  {isLoading
                    ? <Loader2 className="h-5 w-5 animate-spin" />
                    : <><Phone className="mr-2 h-4 w-4" />Send OTP<ArrowRight className="ml-2 h-4 w-4" /></>
                  }
                </Button>
              </motion.form>
            )}

            {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
                STEP: Enter OTP
            ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
            {step === 'otp' && (
              <motion.form
                key="otp"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.22 }}
                onSubmit={handleVerifyOtp}
                className="space-y-6"
              >
                <button
                  type="button"
                  onClick={() => { setStep('phone'); setOtp(''); }}
                  className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  <ChevronLeft className="h-4 w-4" /> Change number
                </button>

                <div className="rounded-xl border border-border bg-muted/30 p-4 text-center">
                  <ShieldCheck className="h-8 w-8 mx-auto mb-2 text-primary" />
                  <p className="text-sm text-muted-foreground">
                    OTP sent to{' '}
                    <span className="font-semibold text-foreground">
                      {countryCode} {phone}
                    </span>
                  </p>
                  <p className="text-xs text-amber-600 dark:text-amber-400 mt-1 font-medium">
                    Demo mode — use OTP: <b>123456</b>
                  </p>
                </div>

                <div className="space-y-2">
                  <Label className="text-center block">Enter 6-digit OTP</Label>
                  <OtpInput value={otp} onChange={setOtp} />
                </div>

                <Button
                  type="submit"
                  className="w-full h-12 font-semibold text-base rounded-lg"
                  disabled={isLoading || otp.length < 6}
                >
                  {isLoading
                    ? <Loader2 className="h-5 w-5 animate-spin" />
                    : <>Verify &amp; Sign In<ArrowRight className="ml-2 h-4 w-4" /></>
                  }
                </Button>

                <button
                  type="button"
                  onClick={handleSendOtp}
                  className="text-xs text-primary hover:underline w-full text-center"
                >
                  Didn't receive it? Resend OTP
                </button>
              </motion.form>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
