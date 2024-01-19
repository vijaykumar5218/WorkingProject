package com.voya.pageobjects;


import com.voya.Util.MobileUtil;
import com.voya.base.TestBase;
import io.appium.java_client.AppiumDriver;
import io.appium.java_client.MobileElement;
import io.appium.java_client.android.AndroidDriver;
import io.appium.java_client.android.AndroidElement;
import io.appium.java_client.ios.IOSDriver;
import org.openqa.selenium.By;
import org.openqa.selenium.support.PageFactory;

public class LoginScreenIOS extends TestBase {
    public IOSDriver iosDriver;
    public AppiumDriver driver;

    public MobileUtil mobileUtil;

    public LoginScreenIOS(MobileUtil mobileUtil, IOSDriver iosDriver)
    {
        this.iosDriver = iosDriver;
        PageFactory.initElements(iosDriver, this);
        this.mobileUtil = mobileUtil;
    }

    public void loginFlow() throws InterruptedException {

        // steps to login
        Thread.sleep(15000);
        System.out.println("test started to first step");
        try {
            Thread.sleep(3000);
            iosDriver.findElement(By.xpath(Locators.btn_register)).click();
        } catch (Exception e){
            System.out.println( e);
        }
        try {
            Thread.sleep(3000);
            iosDriver.findElement(By.xpath("/hierarchy/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.FrameLayout/android.view.ViewGroup/android.webkit.WebView/android.webkit.WebView/android.view.View/android.view.View/android.view.View/android.view.View/android.view.View[2]/android.view.View/android.view.View[7]/android.view.View/android.view.View/android.view.View[1]/android.view.View")).click();
        } catch (Exception e){
            System.out.println( e);
        }
        MobileElement el7 = (MobileElement)  iosDriver.findElementByXPath("/hierarchy/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.FrameLayout/android.view.ViewGroup/android.webkit.WebView/android.webkit.WebView/android.view.View/android.view.View/android.app.Dialog/android.app.Dialog/android.view.View[1]/android.widget.Button[1]");
        el7.click();
        MobileElement el3 = (MobileElement)  iosDriver.findElementByXPath("/hierarchy/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.FrameLayout/android.view.ViewGroup/android.webkit.WebView/android.webkit.WebView/android.view.View/android.view.View/android.view.View/android.view.View/android.view.View[2]/android.view.View/android.view.View[15]/android.view.View/android.widget.EditText");
        el3.sendKeys("125");
        MobileElement el4 = (MobileElement)  iosDriver.findElementByXPath("/hierarchy/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.FrameLayout/android.view.ViewGroup/android.webkit.WebView/android.webkit.WebView/android.view.View/android.view.View/android.view.View/android.view.View/android.view.View[2]/android.view.View/android.view.View[22]/android.view.View/android.widget.EditText");
        el4.sendKeys("12545");
        MobileElement el5 = (MobileElement)  iosDriver.findElementByXPath("/hierarchy/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.FrameLayout/android.view.ViewGroup/android.webkit.WebView/android.webkit.WebView/android.view.View/android.view.View/android.view.View/android.view.View/android.view.View[2]/android.view.View/android.view.View[35]/android.view.View/android.widget.Button");
        el5.click();


    }
}