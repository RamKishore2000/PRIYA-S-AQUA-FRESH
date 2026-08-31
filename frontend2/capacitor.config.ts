import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.priyasaquafresh.app",
  appName: "Priya Aqua Fresh",
  webDir: "out",
  server: {
    androidScheme: "https",
  },
  plugins: {
    StatusBar: {
      overlaysWebView: false,
      backgroundColor: "#F3FAFF",
      style: "LIGHT",
    },
  },
};

export default config;