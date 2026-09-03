import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.priyasaquafresh.app",
  appName: "Priyas Aquafresh",
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