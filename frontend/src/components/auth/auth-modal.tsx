"use client";

import { FormEvent, useState, type ReactNode } from "react";
import { Eye, EyeOff, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { registerCustomer } from "@/services/auth-service";

type AuthModalProps = {
  open: boolean;
  onClose: () => void;
};

type AuthTab = "login" | "register";

export function AuthModal({ open, onClose }: AuthModalProps) {
  const [tab, setTab] = useState<AuthTab>("login");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isRegistering, setIsRegistering] = useState(false);
  const [showRegisterPassword, setShowRegisterPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const submitLogin = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const nextErrors: Record<string, string> = {};
    if (!data.get("identifier")) nextErrors.identifier = "Email or mobile number is required.";
    if (!data.get("password")) nextErrors.password = "Password is required.";
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;
    toast.success("Login successful.");
    onClose();
  };

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
        {tab === "login" ? (
          <form onSubmit={submitLogin} className="grid gap-4">
            <FieldError error={errors.identifier}>
              <Input name="identifier" placeholder="Email or Mobile Number" />
            </FieldError>
            <FieldError error={errors.password}>
              <Input name="password" type="password" placeholder="Password" />
            </FieldError>
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 font-semibold text-slate-600">
                <input type="checkbox" className="h-4 w-4 accent-teal-600" /> Remember Me
              </label>
              <button type="button" className="font-semibold text-teal-700">Forgot Password?</button>
            </div>
            <Button type="submit" className="w-full">Login</Button>
            <p className="text-center text-sm text-slate-600">
              Don&apos;t have an account?{" "}
              <button type="button" className="font-bold text-teal-700" onClick={() => setTab("register")}>
                Create Account
              </button>
            </p>
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
