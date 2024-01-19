#import <Capacitor/Capacitor.h>
#import "TOCropViewController.h"

CAP_PLUGIN(PushPermissionPlugin, "PushPermission",
    CAP_PLUGIN_METHOD(checkPushPermissions, CAPPluginReturnPromise);
)
