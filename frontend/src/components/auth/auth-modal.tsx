"use client";

import { FormEvent, useState, type ReactNode } from "react";
import { Eye, EyeOff, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { loginUser, registerCustomer, type AuthUser } from "@/services/auth-service";

type AuthModalProps = {
  open: boolean;
  onClose: () => void;
  onLogin?: (user: AuthUser) => void;
};

type AuthTab = "login" | "register";
type LoginMode = "password" | "otp";

export function AuthModal({ open, onClose, onLogin }: AuthModalProps) {
  const [tab, setTab] = useState<AuthTab>("login");
  const [loginMode, setLoginMode] = useState<LoginMode>("password");
  const [otpSent, setOtpSent] = useState(false);
  const [otpMobile, setOtpMobile] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isRegistering, setIsRegistering] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [showRegisterPassword, setShowRegisterPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const submitLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const identifier = String(data.get("identifier") ?? "").trim();
    const password = String(data.get("password") ?? "");
    const nextErrors: Record<string, string> = {};
    if (!identifier) nextErrors.identifier = "Email or mobile number is required.";
    if (!password) nextErrors.password = "Password is required.";
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;
    setIsLoggingIn(true);
    try {
      const result = await loginUser({ email: identifier, password, rememberMe: Boolean(data.get("rememberMe")) });
      if (result.data?.user) {
        onLogin?.(result.data.user);
      }
      toast.success("Login successful.");
      onClose();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Login failed.");
    } finally {
      setIsLoggingIn(false);
    }
  };

  function sendOtp(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const mobile = otpMobile.trim();
    const nextErrors: Record<string, string> = {};
    if (!/^[6-9][0-9]{9}$/.test(mobile)) {
      nextErrors.otpMobile = "Enter a valid 10 digit Indian mobile number.";
    }
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;
    setOtpSent(true);
    toast.info("OTP login design ready. Backend integration pending.");
  }

  function verifyOtp(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors: Record<string, string> = {};
    if (!/^[0-9]{6}$/.test(otpCode.trim())) {
      nextErrors.otpCode = "Enter the 6 digit OTP.";
    }
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;
    toast.info("OTP verification will be enabled soon.");
  }

  const submitRegister = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isRegistering) return;

    const form = event.currentTarget;
    const data = new FormData(form);
    const fullName = String(data.get("name") ?? "").trim();
    const mobile = String(data.get("mobile") ?? "").trim();
    const email = String(data.get("email") ?? "").trim();
    const password = String(data.get("password") ?? "");
    const confirmPassword = String(data.get("confirmPassword") ?? "");
    const nextErrors: Record<string, string> = {};
    if (fullName.length < 2) nextErrors.name = "Full name is required.";
    if (!/^[6-9][0-9]{9}$/.test(mobile)) nextErrors.mobile = "Enter a valid 10 digit Indian mobile number.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) nextErrors.email = "Enter a valid email.";
    if (!password) nextErrors.password = "Password is required.";
    else if (!/^\d{4}$/.test(password)) nextErrors.password = "Password must be a 4 digit number.";
    if (password !== confirmPassword) nextErrors.confirmPassword = "Passwords must match.";
    if (!data.get("terms")) nextErrors.terms = "Please accept the terms.";
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setIsRegistering(true);
    try {
      await registerCustomer({
        fullName,
        mobile,
        email,
        password,
        confirmPassword,
      });
      toast.success("Registration successful. Please login.");
      form.reset();
      setErrors({});
      setTab("login");
    } catch (error) {
      const registerError = error as Error & { fieldErrors?: Record<string, string> };
      const fieldErrors = registerError.fieldErrors ?? {};
      const { fullName: fullNameError, ...visibleFieldErrors } = fieldErrors;
      setErrors({
        ...visibleFieldErrors,
        ...(fullNameError ? { name: fullNameError } : {}),
      });
      toast.error(registerError.message || "Registration failed. Please try again.");
    } finally {
      setIsRegistering(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
      <button className="absolute inset-0 bg-slate-950/50" aria-label="Close auth modal" onClick={onClose} />
      <div className="relative w-full max-w-[500px] rounded-lg bg-white p-5 shadow-2xl md:p-6">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-teal-600">Account</p>
            <h2 className="mt-1 text-2xl font-bold text-slate-950">
              {tab === "login" ? "Welcome Back" : "Create Account"}
            </h2>
          </div>
          <Button variant="ghost" size="icon" aria-label="Close modal" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>
        <div className="mb-5 grid grid-cols-2 rounded-md bg-slate-100 p-1">
          {(["login", "register"] as AuthTab[]).map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => {
                setTab(item);
                setLoginMode("password");
                setOtpSent(false);
                setErrors({});
              }}
              className={cn(
                "h-10 rounded-md text-sm font-bold capitalize transition",
                tab === item ? "bg-white text-teal-700 shadow-sm" : "text-slate-600",
              )}
            >
              {item}
            </button>
          ))}
        </div>
        {tab === "login" && loginMode === "password" ? (
          <form onSubmit={submitLogin} className="grid gap-4">
            <FieldError error={errors.identifier}>
              <Input name="identifier" placeholder="Email or Mobile Number" />
            </FieldError>
            <FieldError error={errors.password}>
              <Input name="password" type="password" placeholder="Password" />
            </FieldError>
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 font-semibold text-slate-600">
                <input name="rememberMe" type="checkbox" className="h-4 w-4 accent-teal-600" /> Remember Me
              </label>
              <button type="button" className="font-semibold text-teal-700">Forgot Password?</button>
            </div>
            <Button type="submit" className="w-full" disabled={isLoggingIn}>{isLoggingIn ? "Logging in..." : "Login"}</Button>
            <button
              type="button"
              className="text-center text-sm font-bold text-teal-700"
              onClick={() => {
                setLoginMode("otp");
                setErrors({});
              }}
            >
              Login with OTP
            </button>
            <p className="text-center text-sm text-slate-600">
              Don&apos;t have an account?{" "}
              <button type="button" className="font-bold text-teal-700" onClick={() => setTab("register")}>
                Create Account
              </button>
            </p>
          </form>
        ) : tab === "login" ? (
          <form onSubmit={otpSent ? verifyOtp : sendOtp} className="grid gap-4">
            <div className="rounded-md border border-teal-100 bg-teal-50 px-4 py-3">
              <p className="text-sm font-bold text-slate-950">Login with OTP</p>
              <p className="mt-1 text-xs font-semibold text-slate-600">
                {otpSent ? `Enter the 6 digit OTP sent to ${otpMobile}.` : "Use your registered mobile number to continue."}
              </p>
            </div>
            {!otpSent ? (
              <FieldError error={errors.otpMobile}>
                <Input
                  inputMode="numeric"
                  maxLength={10}
                  placeholder="Mobile Number"
                  value={otpMobile}
                  onChange={(event) => setOtpMobile(event.target.value.replace(/\D/g, "").slice(0, 10))}
                />
              </FieldError>
            ) : (
              <>
                <FieldError error={errors.otpCode}>
                  <OtpBoxes value={otpCode} onChange={setOtpCode} className="border-slate-200 focus:border-teal-500 focus:ring-teal-100" />
                </FieldError>
                <div className="flex items-center justify-between text-sm">
                  <button type="button" className="font-bold text-teal-700" onClick={() => toast.info("OTP resend will be enabled soon.")}>
                    Resend OTP
                  </button>
                  <button
                    type="button"
                    className="font-semibold text-slate-600"
                    onClick={() => {
                      setOtpSent(false);
                      setOtpCode("");
                      setErrors({});
                    }}
                  >
                    Change mobile
                  </button>
                </div>
              </>
            )}
            <Button type="submit" className="w-full">{otpSent ? "Verify OTP" : "Send OTP"}</Button>
            <button
              type="button"
              className="text-center text-sm font-bold text-teal-700"
              onClick={() => {
                setLoginMode("password");
                setOtpSent(false);
                setErrors({});
              }}
            >
              Login with password
            </button>
          </form>
        ) : (
          <form onSubmit={submitRegister} className="grid gap-4">
            <FieldError error={errors.name}><Input name="name" placeholder="Full Name" /></FieldError>
            <FieldError error={errors.mobile}><Input name="mobile" placeholder="Mobile Number" /></FieldError>
            <FieldError error={errors.email}><Input name="email" placeholder="Email" /></FieldError>
            <FieldError error={errors.password}>
              <PasswordInput
                name="password"
                placeholder="Password"
                visible={showRegisterPassword}
                onToggle={() => setShowRegisterPassword((current) => !current)}
              />
            </FieldError>
            <FieldError error={errors.confirmPassword}>
              <PasswordInput
                name="confirmPassword"
                placeholder="Confirm Password"
                visible={showConfirmPassword}
                onToggle={() => setShowConfirmPassword((current) => !current)}
              />
            </FieldError>
            <FieldError error={errors.terms}>
              <label className="flex items-center gap-2 text-sm font-semibold text-slate-600">
                <input name="terms" type="checkbox" className="h-4 w-4 accent-teal-600" /> I agree to the Terms & Conditions
              </label>
            </FieldError>
            <Button type="submit" className="w-full" disabled={isRegistering}>
              {isRegistering ? "Creating Account..." : "Create Account"}
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}

function FieldError({ children, error }: { children: ReactNode; error?: string }) {
  return (
    <label className="grid gap-1">
      {children}
      {error ? <span className="text-xs font-semibold text-rose-600">{error}</span> : null}
    </label>
  );
}

function OtpBoxes({ value, onChange, className }: { value: string; onChange: (value: string) => void; className?: string }) {
  const digits = value.padEnd(6, " ").slice(0, 6).split("");

  function updateDigit(index: number, nextValue: string) {
    const digit = nextValue.replace(/\D/g, "").slice(-1);
    const nextDigits = value.padEnd(6, " ").slice(0, 6).split("");
    nextDigits[index] = digit || " ";
    onChange(nextDigits.join("").replace(/\s/g, "").slice(0, 6));
    if (digit) {
      const nextInput = document.getElementById(`frontend-otp-${index + 1}`) as HTMLInputElement | null;
      nextInput?.focus();
    }
  }

  return (
    <div className="grid grid-cols-6 gap-2">
      {digits.map((digit, index) => (
        <input
          key={index}
          id={`frontend-otp-${index}`}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={digit.trim()}
          onChange={(event) => updateDigit(index, event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Backspace" && !digit.trim() && index > 0) {
              const previousInput = document.getElementById(`frontend-otp-${index - 1}`) as HTMLInputElement | null;
              previousInput?.focus();
            }
          }}
          className={cn(
            "h-12 rounded-md border bg-white text-center text-lg font-black text-slate-950 outline-none transition focus:ring-2",
            className,
          )}
          aria-label={`OTP digit ${index + 1}`}
        />
      ))}
    </div>
  );
}

function PasswordInput({
  name,
  placeholder,
  visible,
  onToggle,
}: {
  name: string;
  placeholder: string;
  visible: boolean;
  onToggle: () => void;
}) {
  const Icon = visible ? EyeOff : Eye;

  return (
    <div className="relative">
      <Input name={name} type={visible ? "text" : "password"} placeholder={placeholder} className="pr-11" />
      <button
        type="button"
        onClick={onToggle}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 transition hover:text-slate-900"
        aria-label={visible ? `Hide ${placeholder}` : `Show ${placeholder}`}
      >
        <Icon className="h-4 w-4" />
      </button>
    </div>
  );
}
