package com.priyasaquafresh.app;

import android.graphics.Color;
import android.os.Bundle;
import android.view.View;
import android.view.Window;

import androidx.core.splashscreen.SplashScreen;

import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    private static final long SPLASH_MIN_DURATION_MS = 2800L;
    private long splashStartTime;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        requestWindowFeature(Window.FEATURE_NO_TITLE);
        splashStartTime = System.currentTimeMillis();
        SplashScreen splashScreen = SplashScreen.installSplashScreen(this);
        splashScreen.setKeepOnScreenCondition(() -> System.currentTimeMillis() - splashStartTime < SPLASH_MIN_DURATION_MS);
        setTitle("");
        applyLightSystemBars();
        super.onCreate(savedInstanceState);
        if (getSupportActionBar() != null) {
            getSupportActionBar().hide();
        }
        setTitle("");
        applyLightSystemBars();
    }

    private void applyLightSystemBars() {
        Window window = getWindow();
        window.setStatusBarColor(Color.parseColor("#F8F3EC"));
        window.setNavigationBarColor(Color.parseColor("#FFF9F1"));
        window.getDecorView().setSystemUiVisibility(
            View.SYSTEM_UI_FLAG_LIGHT_STATUS_BAR | View.SYSTEM_UI_FLAG_LIGHT_NAVIGATION_BAR
        );
    }
}