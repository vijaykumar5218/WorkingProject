package com.voya.edt.myvoyage;

import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.content.Context;
import android.os.Build;

import androidx.core.app.NotificationManagerCompat;

import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

import java.util.List;

@CapacitorPlugin(name = "PushPermission")
public class PushPermissionPlugin extends Plugin {

    @PluginMethod()
    public void checkPushPermissions(PluginCall call) {
        JSObject ret = new JSObject();
        ret.put("result", areNotificationsEnabled());
        call.resolve(ret);
    }

    public boolean areNotificationsEnabled() {
        try {
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                NotificationManager manager = (NotificationManager) getContext().getSystemService(Context.NOTIFICATION_SERVICE);
                if (!manager.areNotificationsEnabled()) {
                    return false;
                }
                List<NotificationChannel> channels = manager.getNotificationChannels();
                for (NotificationChannel channel : channels) {
                    if (channel.getImportance() == NotificationManager.IMPORTANCE_NONE) {
                        return false;
                    }
                }
                return true;
            } else {
                return NotificationManagerCompat.from(getContext()).areNotificationsEnabled();
            }
        }
        catch(Exception e) {
            return false;
        }

    }
}
