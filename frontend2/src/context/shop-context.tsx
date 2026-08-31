"use client";

import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import { getStoredUser, logoutUser, resendLoginOtp, sendLoginOtp, verifyLoginOtp, type AuthUser, type LoginType } from "@/services/auth-service";
import {
  addCartItem,
  addWishlistItem,
  fetchCart,
  fetchWishlist,
  removeCartItem,
  removeWishlistItem,
  updateCartItem,
  type CartItem,
  type CartState,
} from "@/services/shop-service";

type ShopContextValue = {
  user: AuthUser | null;
  cartItems: CartItem[];
  cartCount: number;
  subtotal: number;
  wishlistCount: number;
  wishlistIds: string[];
  openLogin: () => void;
  logout: () => void;
  addToCart: (productId: string, quantity?: number) => Promise<boolean>;
  removeFromCart: (productId: string) => Promise<void>;
  increaseQuantity: (productId: string) => Promise<void>;
  decreaseQuantity: (productId: string) => Promise<void>;
  toggleWishlist: (productId: string) => Promise<void>;
  refreshCart: () => Promise<void>;
  clearCartState: () => void;
};

const ShopContext = createContext<ShopContextValue | null>(null);

type ToastState = {
  id: number;
  title: string;
  tone: "success" | "error" | "info";
} | null;

export function ShopProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [cart, setCart] = useState<CartState | null>(null);
  const [wishlistIds, setWishlistIds] = useState<string[]>([]);
  const [loginOpen, setLoginOpen] = useState(false);
  const [mode, setMode] = useState<"otp">("otp");
  const [otpSent, setOtpSent] = useState(false);
  const [loginType, setLoginType] = useState<LoginType>("CUSTOMER");
  const [otpMobile, setOtpMobile] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [message, setMessage] = useState("");
  const [otpBusy, setOtpBusy] = useState(false);
  const [toast, setToast] = useState<ToastState>(null);

  function showToast(title: string, tone: "success" | "error" | "info" = "success") {
    const id = Date.now();
    setToast({ id, title, tone });
    window.setTimeout(() => {
      setToast((current) => (current?.id === id ? null : current));
    }, 2600);
  }

  useEffect(() => {
    if (!loginOpen) return;
    const handleNativeBack = (event: Event) => {
      event.preventDefault();
      setLoginOpen(false);
    };
    window.addEventListener("priyas-native-back", handleNativeBack);
    return () => window.removeEventListener("priyas-native-back", handleNativeBack);
  }, [loginOpen]);

  useEffect(() => {
    const sync = () => {
      const storedUser = getStoredUser();
      setUser(storedUser);
      if (storedUser) {
        fetchCart().then(setCart).catch(() => undefined);
        fetchWishlist().then((wishlist) => setWishlistIds(wishlist.productIds.map(String))).catch(() => undefined);
        return;
      }
      setCart(null);
      setWishlistIds([]);
    };
    sync();
    window.addEventListener("priyas-auth-changed", sync);
    return () => window.removeEventListener("priyas-auth-changed", sync);
  }, []);

  const refreshCart = useCallback(async () => {
    if (!user) return;
    setCart(await fetchCart());
  }, [user]);

  async function submitLogin() {
    setMessage("");
    try {
      if (!otpSent) {
        const mobile = otpMobile.trim();
        if (!/^[6-9][0-9]{9}$/.test(mobile)) {
          setMessage("Enter a valid 10 digit Indian mobile number.");
          showToast("Enter a valid 10 digit Indian mobile number.", "error");
          return;
        }
        setOtpBusy(true);
        try {
          await sendLoginOtp(mobile, loginType);
          setOtpSent(true);
          setOtpCode("");
          setMessage("OTP sent successfully.");
          showToast("OTP sent successfully.", "success");
        } finally {
          setOtpBusy(false);
        }
        return;
      }

      if (!/^[0-9]{6}$/.test(otpCode.trim())) {
        setMessage("Enter the 6 digit OTP.");
        showToast("Enter the 6 digit OTP.", "error");
        return;
      }
      setOtpBusy(true);
      try {
        const loggedInUser = await verifyLoginOtp({ mobile: otpMobile.trim(), otp: otpCode.trim(), loginType });
        setUser(loggedInUser);
        setLoginOpen(false);
        setOtpSent(false);
        setOtpCode("");
        showToast("Login successful", "success");
      } finally {
        setOtpBusy(false);
      }
    } catch (error) {
      const nextMessage = error instanceof Error ? error.message : "Login failed.";
      setMessage(nextMessage);
      showToast(nextMessage, "error");
    }
  }
  const addToCart = useCallback(async (productId: string, quantity = 1) => {
    if (!user) {
      setLoginOpen(true);
      showToast("Please login to add products to cart.", "info");
      return false;
    }
    try {
      setCart(await addCartItem(productId, quantity));
      showToast("Product added to cart", "success");
      return true;
    } catch (error) {
      showToast(error instanceof Error ? error.message : "Unable to add product", "error");
      return false;
    }
  }, [user]);

  async function removeFromCart(productId: string) {
    if (!user) return;
    try {
      setCart(await removeCartItem(productId));
      showToast("Cart updated", "success");
    } catch (error) {
      showToast(error instanceof Error ? error.message : "Unable to update cart", "error");
    }
  }

  async function increaseQuantity(productId: string) {
    if (!user) return;
    const current = cart?.items.find((item) => item.product.id === productId);
    setCart(await updateCartItem(productId, (current?.quantity || 0) + 1));
    showToast("Cart updated", "success");
  }

  async function decreaseQuantity(productId: string) {
    if (!user) return;
    const current = cart?.items.find((item) => item.product.id === productId);
    const quantity = Math.max(0, (current?.quantity || 1) - 1);
    setCart(await updateCartItem(productId, quantity));
    showToast("Cart updated", "success");
  }

  async function toggleWishlist(productId: string) {
    if (!user) {
      setLoginOpen(true);
      showToast("Please login to use wishlist.", "info");
      return;
    }
    if (wishlistIds.includes(productId)) {
      const next = await removeWishlistItem(productId);
      setWishlistIds(next.productIds.map(String));
      showToast("Removed from wishlist", "success");
      return;
    }
    const next = await addWishlistItem(productId);
    setWishlistIds(next.productIds.map(String));
    showToast("Added to wishlist", "success");
  }

  const loginCopy = loginType === "DEALER"
    ? {
        eyebrow: "Dealer OTP Login",
        title: "Dealer Login",
        label: "Dealer mobile number",
        description: "Enter your registered dealer mobile number to continue.",
      }
    : {
        eyebrow: "Customer OTP Login",
        title: "Customer Login",
        label: "Customer mobile number",
        description: "Enter your customer mobile number to continue.",
      };

  function selectLoginType(nextType: LoginType) {
    if (otpBusy || loginType === nextType) return;
    setLoginType(nextType);
    setOtpSent(false);
    setOtpCode("");
    setMessage("");
  }

  const value: ShopContextValue = {
    user,
    cartItems: user ? cart?.items || [] : [],
    cartCount: user ? cart?.count || 0 : 0,
    subtotal: user ? cart?.subtotal || 0 : 0,
    wishlistCount: user ? wishlistIds.length : 0,
    wishlistIds,
    openLogin: () => {
      setMode("otp");
      setOtpSent(false);
      setOtpCode("");
      setLoginType("CUSTOMER");
      setMessage("");
      setLoginOpen(true);
    },
    logout: () => {
      logoutUser();
      setUser(null);
      setCart(null);
      setWishlistIds([]);
    },
    addToCart,
    removeFromCart,
    increaseQuantity,
    decreaseQuantity,
    toggleWishlist,
    refreshCart,
    clearCartState: () => setCart(null),
  };

  return (
    <ShopContext.Provider value={value}>
      {children}
      {loginOpen ? (
        <div className="fixed inset-0 z-[1600] grid place-items-center bg-[#071624]/70 px-5 backdrop-blur-sm">
          <div className="w-full max-w-md overflow-hidden rounded-[1.35rem] border border-[#D8EAF8] bg-[#FFFFFF] text-[#102033] shadow-[0_40px_120px_rgba(16,32,51,0.22)]">
            <div className="h-2 bg-[linear-gradient(90deg,#0057C8,#12a8e6,#28B463)]" />
            <div className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.24em] text-[#0057C8]">{loginCopy.eyebrow}</p>
                <h2 className="mt-2 font-serif text-3xl font-semibold text-[#102033]">{loginCopy.title}</h2>
              </div>
              <button onClick={() => setLoginOpen(false)} className="h-10 w-10 rounded-full border border-[#D8EAF8] bg-white text-[#0057C8] transition hover:bg-[#EAF6FF]">x</button>
            </div>
            <div className="mt-6 grid grid-cols-2 gap-2 rounded-xl border border-[#D8EAF8] bg-[#EAF6FF] p-1">
              {(["CUSTOMER", "DEALER"] as LoginType[]).map((type) => {
                const active = loginType === type;
                return (
                  <button
                    key={type}
                    type="button"
                    onClick={() => selectLoginType(type)}
                    disabled={otpBusy}
                    className={`h-11 rounded-lg text-sm font-black transition ${active ? "bg-[#0057C8] text-white shadow-[0_8px_20px_rgba(0,87,200,0.18)]" : "text-[#40576C] hover:bg-white"}`}
                  >
                    {type === "CUSTOMER" ? "Customer Login" : "Dealer Login"}
                  </button>
                );
              })}
            </div>
            <form action={submitLogin} className="mt-4 grid gap-3">
              <div className="rounded-xl border border-[#D8EAF8] bg-white/70 px-4 py-3">
                <p className="text-sm font-black text-[#102033]">{loginCopy.label}</p>
                <p className="mt-1 text-xs font-semibold text-[#40576C]">
                  {otpSent ? `Enter the 6 digit OTP sent to ${otpMobile}.` : loginCopy.description}
                </p>
              </div>
              {!otpSent ? (
                <input
                  name="otpMobile"
                  inputMode="numeric"
                  maxLength={10}
                  placeholder={loginCopy.label}
                  value={otpMobile}
                  onChange={(event) => setOtpMobile(event.target.value.replace(/\D/g, "").slice(0, 10))}
                  className="rounded-xl border border-[#D8EAF8] bg-white px-4 py-3 font-semibold text-[#102033] outline-none placeholder:text-[#74879A]"
                />
              ) : (
                <>
                  <OtpBoxes value={otpCode} onChange={setOtpCode} />
                  <div className="flex items-center justify-between text-sm">
                    <button type="button" className="font-black text-[#0057C8]" onClick={async () => { if (otpBusy) return; setOtpBusy(true); try { await resendLoginOtp(otpMobile.trim(), loginType); setOtpCode(""); setMessage("OTP resent successfully."); showToast("OTP resent successfully.", "success"); } catch (error) { const nextMessage = error instanceof Error ? error.message : "Unable to resend OTP."; setMessage(nextMessage); showToast(nextMessage, "error"); } finally { setOtpBusy(false); } }}>Resend OTP</button>
                    <button type="button" className="font-bold text-[#74879A]" onClick={() => { setOtpSent(false); setOtpCode(""); setMessage(""); }}>Change mobile</button>
                  </div>
                </>
              )}
              <button disabled={otpBusy} className="mt-2 rounded-full bg-[#0057C8] px-5 py-3 font-black text-white transition hover:bg-[#063B7A] disabled:opacity-60">{otpBusy ? "Please wait..." : otpSent ? "Verify OTP" : "Send OTP"}</button>
            </form>
            {message ? <p className="mt-4 rounded-lg bg-[#EAF6FF] px-3 py-2 text-sm font-semibold text-[#075985]">{message}</p> : null}

          </div>
        </div>
        </div>
      ) : null}
      {toast ? (
        <div className="fixed bottom-5 left-1/2 z-[1700] w-[min(340px,calc(100vw-2rem))] -translate-x-1/2">
          <div className={`rounded-xl border bg-white px-4 py-3 text-sm font-black text-[#102033] shadow-[0_18px_48px_rgba(16,32,51,0.18)] ${toast.tone === "error" ? "border-red-200 border-l-red-500" : toast.tone === "info" ? "border-[#28B463] border-l-[#0057C8]" : "border-emerald-200 border-l-emerald-500"} border-l-4`}>
            {toast.title}
          </div>
        </div>
      ) : null}
    </ShopContext.Provider>
  );
}

export function useShop() {
  const value = useContext(ShopContext);
  if (!value) throw new Error("useShop must be used inside ShopProvider");
  return value;
}

function OtpBoxes({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  const digits = value.padEnd(6, " ").slice(0, 6).split("");

  function updateDigit(index: number, nextValue: string) {
    const digit = nextValue.replace(/\D/g, "").slice(-1);
    const nextDigits = value.padEnd(6, " ").slice(0, 6).split("");
    nextDigits[index] = digit || " ";
    onChange(nextDigits.join("").replace(/\s/g, "").slice(0, 6));
    if (digit) {
      const nextInput = document.getElementById(`frontend2-otp-${index + 1}`) as HTMLInputElement | null;
      nextInput?.focus();
    }
  }

  return (
    <div className="grid grid-cols-6 gap-2">
      {digits.map((digit, index) => (
        <input
          key={index}
          id={`frontend2-otp-${index}`}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={digit.trim()}
          onChange={(event) => updateDigit(index, event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Backspace" && !digit.trim() && index > 0) {
              const previousInput = document.getElementById(`frontend2-otp-${index - 1}`) as HTMLInputElement | null;
              previousInput?.focus();
            }
          }}
          className="h-12 rounded-xl border border-[#D8EAF8] bg-white text-center text-lg font-black text-[#102033] outline-none transition focus:border-[#0057C8] focus:ring-2 focus:ring-[#28B463]/30"
          aria-label={`OTP digit ${index + 1}`}
        />
      ))}
    </div>
  );
}


