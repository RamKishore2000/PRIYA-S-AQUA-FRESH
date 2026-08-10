"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { toast } from "sonner";
import {
  addCartItem,
  addWishlistItem,
  fetchCart,
  fetchWishlist,
  hasAccessToken,
  removeCartItem,
  removeWishlistItem,
  updateCartItem,
} from "@/services/shop-service";
import { getProductDisplayPrice } from "@/lib/pricing";
import { getStoredUser } from "@/services/auth-service";
import type { Product } from "@/types/product";

type CartItem = {
  product: Product;
  quantity: number;
};

type ShopContextValue = {
  cartItems: CartItem[];
  wishlistIds: string[];
  cartCount: number;
  subtotal: number;
  addToCart: (product: Product) => Promise<boolean>;
  removeFromCart: (productId: string) => Promise<void>;
  increaseQuantity: (productId: string) => Promise<void>;
  decreaseQuantity: (productId: string) => Promise<void>;
  toggleWishlist: (product: Product) => Promise<void>;
  isWishlisted: (productId: string) => boolean;
  clearCartState: () => void;
  requestLogin: () => void;
};

const ShopContext = createContext<ShopContextValue | null>(null);

export function ShopProvider({ children, onRequireLogin }: { children: ReactNode; onRequireLogin?: () => void }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [wishlistIds, setWishlistIds] = useState<string[]>([]);
  const [apiEnabled, setApiEnabled] = useState(false);
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    function syncAuthState() {
      setApiEnabled(hasAccessToken());
      setRole(getStoredUser()?.role || null);
    }
    syncAuthState();
    window.addEventListener("priyas-auth-changed", syncAuthState);
    return () => window.removeEventListener("priyas-auth-changed", syncAuthState);
  }, []);

  useEffect(() => {
    if (!apiEnabled) {
      const frame = window.requestAnimationFrame(() => {
        setCartItems([]);
        setWishlistIds([]);
      });
      return () => window.cancelAnimationFrame(frame);
    }
    fetchCart().then((cart) => setCartItems(cart.items)).catch(() => undefined);
    fetchWishlist().then((wishlist) => setWishlistIds(wishlist.productIds)).catch(() => undefined);
  }, [apiEnabled]);

  const addToCart = async (product: Product) => {
    if (!apiEnabled) {
      onRequireLogin?.();
      toast.error("Login required", { description: "Please login to add products to cart." });
      return false;
    }
    try {
      const cart = await addCartItem(product.id, 1);
      setCartItems(cart.items);
      toast.success("Product added to cart");
      return true;
    } catch (error) {
      toast.error("Unable to add", { description: error instanceof Error ? error.message : "Please try again." });
      return false;
    }
  };

  const removeFromCart = async (productId: string) => {
    try {
      if (!apiEnabled) return;
      const cart = await removeCartItem(productId);
      setCartItems(cart.items);
      toast.success("Cart updated");
    } catch (error) {
      toast.error("Unable to update cart", { description: error instanceof Error ? error.message : "Please try again." });
    }
  };

  const increaseQuantity = async (productId: string) => {
    const current = cartItems.find((item) => item.product.id === productId);
    const quantity = (current?.quantity ?? 0) + 1;
    try {
      if (!apiEnabled) return;
      const cart = await updateCartItem(productId, quantity);
      setCartItems(cart.items);
      toast.success("Cart updated");
    } catch (error) {
      toast.error("Unable to update cart", { description: error instanceof Error ? error.message : "Please try again." });
    }
  };

  const decreaseQuantity = async (productId: string) => {
    const current = cartItems.find((item) => item.product.id === productId);
    const quantity = Math.max(0, (current?.quantity ?? 1) - 1);
    try {
      if (!apiEnabled) return;
      const cart = await updateCartItem(productId, quantity);
      setCartItems(cart.items);
      toast.success("Cart updated");
    } catch (error) {
      toast.error("Unable to update cart", { description: error instanceof Error ? error.message : "Please try again." });
    }
  };

  const toggleWishlist = async (product: Product) => {
    const active = wishlistIds.includes(product.id);
    if (!apiEnabled) {
      onRequireLogin?.();
      toast.error("Login required", { description: "Please login to use wishlist." });
      return;
    }
    try {
      const wishlist = active ? await removeWishlistItem(product.id) : await addWishlistItem(product.id);
      setWishlistIds(wishlist.productIds);
      toast.success(active ? "Removed from wishlist" : "Added to wishlist");
    } catch (error) {
      toast.error("Unable to update wishlist", { description: error instanceof Error ? error.message : "Please try again." });
    }
  };

  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);
  const subtotal = cartItems.reduce(
    (total, item) => total + getProductDisplayPrice(item.product, role).price * item.quantity,
    0,
  );

  const value: ShopContextValue = {
    cartItems,
    wishlistIds,
    cartCount,
    subtotal,
    addToCart,
    removeFromCart,
    increaseQuantity,
    decreaseQuantity,
    toggleWishlist,
    isWishlisted: (productId: string) => wishlistIds.includes(productId),
    clearCartState: () => setCartItems([]),
    requestLogin: () => onRequireLogin?.(),
  };

  return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>;
}

export function useShop() {
  const context = useContext(ShopContext);
  if (!context) {
    throw new Error("useShop must be used within ShopProvider");
  }
  return context;
}
