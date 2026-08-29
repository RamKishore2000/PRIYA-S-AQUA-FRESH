"use client";

import { useEffect } from "react";
import { App } from "@capacitor/app";
import { Capacitor } from "@capacitor/core";
import { StatusBar, Style } from "@capacitor/status-bar";

export function CapacitorAppRuntime() {
  useEffect(() => {
    if (!Capacitor.isNativePlatform()) {
      document.body.classList.remove("priyas-native-app");
      return;
    }

    document.body.classList.add("priyas-native-app");

    const configureStatusBar = async () => {
      try {
        await StatusBar.setOverlaysWebView({ overlay: false });
        await StatusBar.setBackgroundColor({ color: "#F8F3EC" });
        await StatusBar.setStyle({ style: Style.Light });
      } catch {
        // Keep startup usable even if a device blocks status bar updates.
      }
    };

    void configureStatusBar();

    const backListener = App.addListener("backButton", async () => {
      const event = new Event("priyas-native-back", { cancelable: true });
      const shouldContinue = window.dispatchEvent(event);
      if (!shouldContinue || event.defaultPrevented) return;

      if (window.location.pathname !== "/") {
        window.history.back();
        return;
      }

      await App.exitApp();
    });

    return () => {
      document.body.classList.remove("priyas-native-app");
      void backListener.then((listener) => listener.remove());
    };
  }, []);

  return null;
}