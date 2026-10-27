// Template: android/app/src/main/java/<package path>/NativeSettingsPlugin.java
// Replace com.example.app with the app ID. Register it in MainActivity.onCreate (before super.onCreate):
//   registerPlugin(NativeSettingsPlugin.class);
// The web side is templates/web/native-settings.ts.
//
// Why: alarms and reminders arrive late or never when the app is in the background unless the user
// allows notifications, exact alarms (denied by default on fresh installs on Android 14+) and
// unrestricted battery use. No official Capacitor plugin reports all three or opens their screens.
//
// Manifest permissions it relies on (add only the ones the app really needs; Play reviews them):
//   <uses-permission android:name="android.permission.POST_NOTIFICATIONS" />
//   <uses-permission android:name="android.permission.SCHEDULE_EXACT_ALARM" />
//   <uses-permission android:name="android.permission.REQUEST_IGNORE_BATTERY_OPTIMIZATIONS" />
package com.example.app;

import android.app.AlarmManager;
import android.content.Context;
import android.content.Intent;
import android.net.Uri;
import android.os.Build;
import android.os.PowerManager;
import android.provider.Settings;
import androidx.core.app.NotificationManagerCompat;
import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

@CapacitorPlugin(name = "NativeSettings")
public class NativeSettingsPlugin extends Plugin {

    @PluginMethod
    public void status(PluginCall call) {
        Context context = getContext();
        JSObject result = new JSObject();
        result.put("notifications", NotificationManagerCompat.from(context).areNotificationsEnabled());
        result.put("exactAlarms", canScheduleExactAlarms(context));
        result.put("backgroundActivity", isIgnoringBatteryOptimizations(context));
        result.put("manufacturer", Build.MANUFACTURER);
        call.resolve(result);
    }

    /** System dialog: "Let app always run in background?" Falls back to the battery settings list. */
    @PluginMethod
    public void requestBackgroundActivity(PluginCall call) {
        String pkg = getContext().getPackageName();
        if (!open(new Intent(Settings.ACTION_REQUEST_IGNORE_BATTERY_OPTIMIZATIONS, Uri.parse("package:" + pkg)))) {
            open(new Intent(Settings.ACTION_IGNORE_BATTERY_OPTIMIZATION_SETTINGS));
        }
        call.resolve();
    }

    @PluginMethod
    public void openExactAlarmSettings(PluginCall call) {
        String pkg = getContext().getPackageName();
        if (Build.VERSION.SDK_INT < Build.VERSION_CODES.S
                || !open(new Intent(Settings.ACTION_REQUEST_SCHEDULE_EXACT_ALARM, Uri.parse("package:" + pkg)))) {
            openAppDetails();
        }
        call.resolve();
    }

    /** App info page, where OEM switches like "Allow background activity" or "Autostart" live. */
    @PluginMethod
    public void openAppSettings(PluginCall call) {
        openAppDetails();
        call.resolve();
    }

    private void openAppDetails() {
        open(new Intent(Settings.ACTION_APPLICATION_DETAILS_SETTINGS, Uri.parse("package:" + getContext().getPackageName())));
    }

    private boolean open(Intent intent) {
        try {
            intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
            getContext().startActivity(intent);
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    private static boolean canScheduleExactAlarms(Context context) {
        if (Build.VERSION.SDK_INT < Build.VERSION_CODES.S) return true;
        AlarmManager alarmManager = (AlarmManager) context.getSystemService(Context.ALARM_SERVICE);
        return alarmManager != null && alarmManager.canScheduleExactAlarms();
    }

    private static boolean isIgnoringBatteryOptimizations(Context context) {
        PowerManager powerManager = (PowerManager) context.getSystemService(Context.POWER_SERVICE);
        return powerManager != null && powerManager.isIgnoringBatteryOptimizations(context.getPackageName());
    }
}
