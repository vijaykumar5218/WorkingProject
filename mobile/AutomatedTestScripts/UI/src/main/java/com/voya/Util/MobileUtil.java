package com.voya.Util;

import com.voya.base.TestBase;
import io.appium.java_client.android.AndroidDriver;
import io.appium.java_client.android.AndroidElement;
import io.appium.java_client.ios.IOSDriver;

public class MobileUtil extends TestBase {

    public AndroidDriver<AndroidElement> driverAndroid;
    public IOSDriver iosDriver;

    public MobileUtil(AndroidDriver<AndroidElement> driverAndroid) {
        this.driverAndroid = driverAndroid;
    }
    public MobileUtil(IOSDriver iosDriver){this.iosDriver=iosDriver;}

}
