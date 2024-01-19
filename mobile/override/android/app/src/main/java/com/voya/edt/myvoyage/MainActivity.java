package com.voya.edt.myvoyage;
import android.os.Bundle;
import com.getcapacitor.BridgeActivity;
import android.Manifest;
import android.os.Build;
import androidx.core.app.ActivityCompat;

public class MainActivity extends BridgeActivity {
    private int PERMISSION_REQUEST_CODE = 12345;

    @Override
    public void onCreate(Bundle savedInstanceState) {
        registerPlugin(PushPermissionPlugin.class);
        super.onCreate(savedInstanceState);
        if (Build.VERSION.SDK_INT > 32) {
            if (!shouldShowRequestPermissionRationale("112")){
                getNotificationPermission();
            }
        }
    }

    public void getNotificationPermission(){
        try {
            if (Build.VERSION.SDK_INT > 32) {
                ActivityCompat.requestPermissions(this,
                        new String[]{Manifest.permission.POST_NOTIFICATIONS},
                        PERMISSION_REQUEST_CODE);
            }
        }catch (Exception e){

        }
    }
}