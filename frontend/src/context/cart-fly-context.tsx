"use client";

import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from "react";

type CartFlyPayload = {
  image: string;
  startRect: DOMRect;
};

type CartFlyItem = {
  id: number;
  image: string;
  fromX: number;
  fromY: number;
  toX: number;
  toY: number;
  phase: "from" | "to";
};

type CartFlyContextValue = {
  flyToCart: (payload: CartFlyPayload) => void;
};

const CartFlyContext = createContext<CartFlyContextValue | null>(null);

export function CartFlyProvider({ children }: { children: ReactNode }) {
  const [item, setItem] = useState<CartFlyItem | null>(null);
  const frameRef = useRef<number | null>(null);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (frameRef.current) window.cancelAnimationFrame(frameRef.current);
      if (timerRef.current) window.clearTimeout(timerRef.current);
    };
  }, []);

  function flyToCart({ image, startRect }: CartFlyPayload) {
    const cartTarget = document.getElementById("header-cart-target");
    if (!cartTarget) return;

    const targetRect = cartTarget.getBoundingClientRect();
    const id = Date.now();
    const startSize = Math.min(76, Math.max(52, startRect.width * 0.22));
    const nextItem: CartFlyItem = {
      id,
      image,
      fromX: startRect.left + startRect.width / 2 - startSize / 2,
      fromY: startRect.top + startRect.height / 2 - startSize / 2,
      toX: targetRect.left + targetRect.width / 2 - startSize / 2,
      toY: targetRect.top + targetRect.height / 2 - startSize / 2,
      phase: "from",
    };

    setItem(nextItem);

    if (frameRef.current) window.cancelAnimationFrame(frameRef.current);
    frameRef.current = window.requestAnimationFrame(() => {
      setItem((current) => (current?.id === id ? { ...current, phase: "to" } : current));
    });

    if (timerRef.current) window.clearTimeout(timerRef.current);
    timerRef.current = window.setTimeout(() => {
      setItem(null);
      cartTarget.classList.remove("cart-target-pop");
      window.requestAnimationFrame(() => cartTarget.classList.add("cart-target-pop"));
    }, 720);
  }

  return (
    <CartFlyContext.Provider value={{ flyToCart }}>
      {children}
      {item ? (
        <div
          aria-hidden="true"
          className="cart-fly-item"
          style={{
            backgroundImage: `url("${item.image}")`,
            transform:
              item.phase === "to"
                ? `translate3d(${item.toX}px, ${item.toY}px, 0) scale(0.34) rotate(12deg)`
                : `translate3d(${item.fromX}px, ${item.fromY}px, 0) scale(1) rotate(0deg)`,
            opacity: item.phase === "to" ? 0.55 : 1,
          }}
        />
      ) : null}
    </CartFlyContext.Provider>
  );
}

export function useCartFly() {
  const context = useContext(CartFlyContext);
  if (!context) {
    throw new Error("useCartFly must be used within CartFlyProvider");
  }
  return context;
}
