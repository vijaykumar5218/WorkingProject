package com.voya.testcases;


import com.voya.Util.MobileUtil;
import com.voya.base.TestBase;
import com.voya.data.BaseExcelDataObject;
import com.voya.pageobjects.LoginScreen;
import com.voya.utilities.TestUtil;
import org.testng.annotations.AfterClass;
import org.testng.annotations.BeforeClass;
import org.testng.annotations.Test;

import java.io.IOException;

public class MobileTestSauce extends TestBase {

    private MobileUtil mobileUtil;

    @BeforeClass
    public void set() throws IOException {
        BaseExcelDataObject obj=new BaseExcelDataObject();
        this.mobileUtil = new MobileUtil(driverAndroid);
        try {
            setUp(this.getClass().getSimpleName());
        } catch (Exception e){
            System.out.println(e);
        }

    }
    @Test(dataProviderClass=TestUtil.class, dataProvider="none")
    public void test(String string) throws InterruptedException {
        System.out.println("Test started ");
        System.out.println(string+" = Android execution on Saucelabs");
    }

}
