import Capacitor

@objc(PushPermissionPlugin)
public class PushPermissionPlugin: CAPPlugin {

    @objc func checkPushPermissions(_ call: CAPPluginCall) {
            let current = UNUserNotificationCenter.current()

            current.getNotificationSettings(completionHandler: { (settings) in
                call.resolve(["result":settings.authorizationStatus == .authorized])
            })
    }
}
