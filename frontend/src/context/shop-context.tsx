"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import { toast } from "sonner";
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
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  increaseQuantity: (productId: string) => void;
  decreaseQuantity: (productId: string) => void;
  toggleWishlist: (product: Product) => void;
  isWishlisted: (productId: string) => boolean;
};

const ShopContext = createContext<ShopContextValue | null>(null);

export function ShopProvider({ children }: { children: ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [wishlistIds, setWishlistIds] = useState<string[]>([]);

  const addToCart = (product: Product) => {
    setCartItems((items) => {
      const existing = items.find((item) => item.product.id === product.id);
      if (existing) {
        return items.map((item) =>
          item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item,
        );
      }
      return [...items, { product, quantity: 1 }];
    });
    toast.success(`${product.name} added to cart.`);
  };

  const removeFromCart = (productId: string) => {
    setCartItems((items) => items.filter((item) => item.product.id !== productId));
    toast.success("Cart updated.");
  };

  const increaseQuantity = (productId: string) => {
    setCartItems((items) =>
      items.map((item) =>
        item.product.id === productId ? { ...item, quantity: item.quantity + 1 } : item,
      ),
    );
    toast.success("Cart updated.");
  };

  const decreaseQuantity = (productId: string) => {
    setCartItems((items) =>
      items
        .map((item) =>
          item.product.id === productId
            ? { ...item, quantity: Math.max(0, item.quantity - 1) }
            : item,
        )
        .filter((item) => item.quantity > 0),
    );
    toast.success("Cart updated.");
  };

  const toggleWishlist = (product: Product) => {
    setWishlistIds((ids) => {
      if (ids.includes(product.id)) {
        toast.success("Removed from wishlist.");
        return ids.filter((id) => id !== product.id);
      }
      toast.success("Added to wishlist.");
      return [...ids, product.id];
    });
  };

  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);
  const subtotal = cartItems.reduce(
    (total, item) => total + item.product.price * item.quantity,
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
