package com.voya.testcases;


import com.voya.Util.MobileUtil;
import com.voya.base.TestBase;
import com.voya.data.BaseExcelDataObject;
import com.voya.pageobjects.LoginScreenIOS;
import com.voya.utilities.TestUtil;
import org.testng.annotations.BeforeClass;
import org.testng.annotations.Test;

import java.io.IOException;

public class MobileTestSauceIOS extends TestBase {

    private MobileUtil mobileUtil;

    @BeforeClass
    public void set() throws IOException {
        BaseExcelDataObject obj=new BaseExcelDataObject();
        this.mobileUtil = new MobileUtil(iosDriver);
        try {
            setUp(this.getClass().getSimpleName());
        } catch (Exception e){
            System.out.println(e);
        }

    }
    @Test(dataProviderClass=TestUtil.class, dataProvider="none")
    public void test(String string) throws InterruptedException {
        System.out.println("test1");
        System.out.println(string+"iPhone execution on Saucelabs");
        LoginScreenIOS login = new LoginScreenIOS(mobileUtil, iosDriver);
        login.loginFlow();
    }

}
