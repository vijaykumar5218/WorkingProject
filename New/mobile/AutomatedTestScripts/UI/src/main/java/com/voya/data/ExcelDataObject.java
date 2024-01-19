package com.voya.data;

import com.poiji.annotation.ExcelCellName;
import com.poiji.annotation.ExcelRow;

public class ExcelDataObject extends BaseExcelDataObject{
	
	@ExcelRow
	public int index;

	@ExcelCellName ("UserId")
	public String  UserId;

	@ExcelCellName ("Password1")
	public String  Password1;

	@ExcelCellName ("OtpCode")
	public String  OtpCode;

	@ExcelCellName ("FirstName")
	public String  FirstName;

	@ExcelCellName ("LastName")
	public String  LastName;

	@ExcelCellName ("Email")
	public String  Email;

	@ExcelCellName ("Phone")
	public String  Phone;

	@ExcelCellName ("PlanName")
	public String  PlanName;

}
