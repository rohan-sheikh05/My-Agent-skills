// Template: android/app/src/main/java/<package path>/MainActivity.java
// Replace com.example.app with the app ID from capacitor.config.ts.
//
// Why: Android's WebView reports navigator.onLine = true forever unless the app tells it otherwise,
// so the web app never sees "offline" (no indicator, and reads wait on the network instead of the
// cache). This mirrors the real connection into the WebView, which also fires online/offline events.
// Keep registerPlugin() lines for any local plugins (e.g. NativeSettingsPlugin) before super.onCreate.
package com.example.app;

import android.content.Context;
import android.net.ConnectivityManager;
import android.net.Network;
import android.net.NetworkCapabilities;
import android.os.Bundle;
import android.webkit.WebView;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {

    private ConnectivityManager connectivityManager;
    private ConnectivityManager.NetworkCallback networkCallback;

    @Override
    public void onCreate(Bundle savedInstanceState) {
        // registerPlugin(NativeSettingsPlugin.class);
        super.onCreate(savedInstanceState);
        watchNetwork();
    }

    @Override
    public void onDestroy() {
        if (connectivityManager != null && networkCallback != null) {
            try {
                connectivityManager.unregisterNetworkCallback(networkCallback);
            } catch (IllegalArgumentException ignored) {}
        }
        super.onDestroy();
    }

    private void watchNetwork() {
        connectivityManager = (ConnectivityManager) getSystemService(Context.CONNECTIVITY_SERVICE);
        if (connectivityManager == null) return;
        setWebViewOnline(isConnected());
        networkCallback = new ConnectivityManager.NetworkCallback() {
            @Override
            public void onAvailable(Network network) {
                setWebViewOnline(true);
            }

            @Override
            public void onLost(Network network) {
                // Another network (e.g. mobile data after Wi-Fi drops) may already be the default
                setWebViewOnline(isConnected());
            }
        };
        connectivityManager.registerDefaultNetworkCallback(networkCallback);
    }

    private boolean isConnected() {
        Network network = connectivityManager.getActiveNetwork();
        if (network == null) return false;
        NetworkCapabilities caps = connectivityManager.getNetworkCapabilities(network);
        return caps != null && caps.hasCapability(NetworkCapabilities.NET_CAPABILITY_INTERNET);
    }

    private void setWebViewOnline(boolean online) {
        runOnUiThread(() -> {
            if (bridge == null) return;
            WebView webView = bridge.getWebView();
            if (webView != null) webView.setNetworkAvailable(online);
        });
    }
}
