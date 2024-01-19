#import <Capacitor/Capacitor.h>
#import "TOCropViewController.h"

CAP_PLUGIN(PhotoCroppingPlugin, "PhotoCropping",
    CAP_PLUGIN_METHOD(cropPhoto, CAPPluginReturnPromise);
)
