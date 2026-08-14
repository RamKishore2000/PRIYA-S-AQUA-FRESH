"use client";

import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import { getStoredUser, loginUser, logoutUser, registerCustomer, type AuthUser } from "@/services/auth-service";
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
  const [mode, setMode] = useState<"login" | "register">("login");
  const [message, setMessage] = useState("");
  const [toast, setToast] = useState<ToastState>(null);

  function showToast(title: string, tone: "success" | "error" | "info" = "success") {
    const id = Date.now();
    setToast({ id, title, tone });
    window.setTimeout(() => {
      setToast((current) => (current?.id === id ? null : current));
    }, 2600);
  }

  useEffect(() => {
    const sync = () => {
      const storedUser = getStoredUser();
      setUser(storedUser);
      if (storedUser) {
        fetchCart().then(setCart).catch(() => undefined);
        fetchWishlist().then((wishlist) => setWishlistIds(wishlist.productIds.map(String))).catch(() => undefined);
      }
    };
    sync();
    window.addEventListener("priyas-auth-changed", sync);
    return () => window.removeEventListener("priyas-auth-changed", sync);
  }, []);

  const refreshCart = useCallback(async () => {
    if (!user) return;
    setCart(await fetchCart());
  }, [user]);

  async function submitLogin(formData: FormData) {
    setMessage("");
    try {
      if (mode === "register") {
        await registerCustomer({
          fullName: String(formData.get("fullName") || ""),
          mobile: String(formData.get("mobile") || ""),
          email: String(formData.get("email") || ""),
          password: String(formData.get("password") || ""),
          confirmPassword: String(formData.get("password") || ""),
        });
        setMode("login");
        setMessage("Account created. Please login now.");
        showToast("Account created. Please login now.", "success");
        return;
      }
      const loggedInUser = await loginUser({
        email: String(formData.get("email") || ""),
        password: String(formData.get("password") || ""),
      });
      setUser(loggedInUser);
      setLoginOpen(false);
      showToast("Login successful", "success");
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

  const value: ShopContextValue = {
    user,
    cartItems: cart?.items || [],
    cartCount: cart?.count || 0,
    subtotal: cart?.subtotal || 0,
    wishlistCount: wishlistIds.length,
    wishlistIds,
    openLogin: () => setLoginOpen(true),
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
        <div className="fixed inset-0 z-[100] grid place-items-center bg-[#071624]/70 px-5 backdrop-blur-sm">
          <div className="w-full max-w-md overflow-hidden rounded-[1.35rem] border border-[#E5D8C7] bg-[#FFF9F1] text-[#1D2D2E] shadow-[0_40px_120px_rgba(43,35,22,0.24)]">
            <div className="h-2 bg-[linear-gradient(90deg,#0A3A38,#12a8e6,#D8B879)]" />
            <div className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.24em] text-[#B68A45]">{mode === "login" ? "Login" : "Register"}</p>
                <h2 className="mt-2 font-serif text-3xl font-semibold text-[#1D2D2E]">Welcome to Priya&apos;s</h2>
              </div>
              <button onClick={() => setLoginOpen(false)} className="h-10 w-10 rounded-full border border-[#E5D8C7] bg-white text-[#0A3A38] transition hover:bg-[#F5E9D8]">x</button>
            </div>
            <form action={submitLogin} className="mt-6 grid gap-3">
              {mode === "register" ? <input name="fullName" placeholder="Full name" className="rounded-xl border border-[#E5D8C7] bg-white px-4 py-3 font-semibold text-[#1D2D2E] outline-none placeholder:text-[#7D7B75]" /> : null}
              {mode === "register" ? <input name="mobile" placeholder="Mobile" className="rounded-xl border border-[#E5D8C7] bg-white px-4 py-3 font-semibold text-[#1D2D2E] outline-none placeholder:text-[#7D7B75]" /> : null}
              <input name="email" placeholder="Email or mobile" className="rounded-xl border border-[#E5D8C7] bg-white px-4 py-3 font-semibold text-[#1D2D2E] outline-none placeholder:text-[#7D7B75]" />
              <input name="password" type="password" placeholder="Password" className="rounded-xl border border-[#E5D8C7] bg-white px-4 py-3 font-semibold text-[#1D2D2E] outline-none placeholder:text-[#7D7B75]" />
              <button className="mt-2 rounded-full bg-[#0A3A38] px-5 py-3 font-black text-white transition hover:bg-[#12383A]">{mode === "login" ? "Login" : "Create Account"}</button>
            </form>
            {message ? <p className="mt-4 rounded-lg bg-[#F5E9D8] px-3 py-2 text-sm font-semibold text-[#8A5F23]">{message}</p> : null}
            <button onClick={() => setMode(mode === "login" ? "register" : "login")} className="mt-5 text-sm font-black text-[#0A3A38]">
              {mode === "login" ? "Create new account" : "Back to login"}
            </button>
            </div>
          </div>
        </div>
      ) : null}
      {toast ? (
        <div className="fixed bottom-5 left-1/2 z-[120] w-[min(340px,calc(100vw-2rem))] -translate-x-1/2">
          <div className={`rounded-xl border bg-white px-4 py-3 text-sm font-black text-[#1D2D2E] shadow-[0_18px_48px_rgba(43,35,22,0.2)] ${toast.tone === "error" ? "border-red-200 border-l-red-500" : toast.tone === "info" ? "border-[#D8B879] border-l-[#B68A45]" : "border-emerald-200 border-l-emerald-500"} border-l-4`}>
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
