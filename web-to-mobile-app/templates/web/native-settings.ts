// Template: web side of templates/android/NativeSettingsPlugin.java.
// Show a "make sure reminders arrive on time" checklist in Settings, and prompt in context
// (when the user turns on a reminder or starts a timer) for anything missing.
import { Capacitor, registerPlugin } from "@capacitor/core";
import { LocalNotifications } from "@capacitor/local-notifications";

export type NativeSettingsStatus = {
  notifications: boolean;
  exactAlarms: boolean;
  /** Exempt from battery optimisation, so Android doesn't hold alarms back */
  backgroundActivity: boolean;
  /** Some OEMs (Xiaomi, Oppo, Vivo, Samsung…) add their own switch under App info */
  manufacturer: string;
};

interface NativeSettingsPlugin {
  status(): Promise<NativeSettingsStatus>;
  requestBackgroundActivity(): Promise<void>;
  openExactAlarmSettings(): Promise<void>;
  openAppSettings(): Promise<void>;
}

export const NativeSettings = registerPlugin<NativeSettingsPlugin>("NativeSettings");

// A remotely loaded site can run inside older app builds that lack the plugin, so always check first.
export function isNativeSettingsSupported() {
  return Capacitor.getPlatform() === "android" && Capacitor.isPluginAvailable("NativeSettings");
}

export async function allowNotifications() {
  const res = await LocalNotifications.requestPermissions();
  // Once denied, Android stops showing the prompt; the app info page is the only way back
  if (res.display !== "granted") await NativeSettings.openAppSettings();
}

// Re-check status when the user returns from a system settings screen:
//   document.addEventListener("visibilitychange", () => {
//     if (document.visibilityState === "visible") refresh();
//   });
