export enum eRole {
  LEADER = 'LEADER_FLAG',
  HR = 'HR_FLAG',
  EMPLOYEE = 'EMPLOYEE_FLAG',
  COMTOR = 'COMTOR_FLAG',
  SUB_LEADER = 'SUB_LEADER_FLAG',
  CUSTOMER = 'CUSTOMER_FLAG'
}
export class ConstantsCommon {
  public static URL_API = "192.168.1.158:8080"; 

  // status
  public static HTTP_STATUS_200 = '200';
  public static HTTP_STATUS_500 = '500';
  public static HTTP_STATUS_405 = '405';
  
  // label
  public static STATUS_ACTIVE = 1; 
  public static STATUS_NOT_ACTIVE = 0; 

  // Employee Position
  public static DEV_POSITION = 'Developer';
  public static COM_POSITION = 'Comtor';
  public static TEST_POSITION = 'Tester';
  public static MK_POSITION = 'Marketing';
  public static OTHER_POSITION = 'Khác';

  // Booking confirm status
  public static WAIT_STATUS = 0;
  public static ACCEPT_STATUS = 1;
  public static REJECT_STATUS = 2;
  public static WAIT_FOR_APPROVER = 'Chờ phê duyệt'

  // Validator
  public static IMPORTANT_VALUE = '(*)'

  // Message
  public static RECORD_EMPTY = 'Danh sách trống'
  public static NO_FILE_CHOSEN = 'Không có tệp nào được chọn';

  // Equipment Categories
  public static EQUIPMENT_CATEGORY = [
    {value: 1, name: 'Laptop'},
    {value: 2, name: 'Máy tính Case(PC)'},
    {value: 3, name: 'Máy tính Bảng(Tablet)'},
    {value: 8, name: 'Màn hình'},
    {value: 4, name: 'Điện thoại test'},
    {value: 5, name: 'Chuột'},
    {value: 6, name: 'Bàn phím'},
    {value: 7, name: 'Phụ kiện'},
    {value: 0, name: 'Khác'},
  ]
  public static EQUIPMENT_STATUS = [
    { value: 0, name: 'Chưa Sử Dụng' },
    { value: 1, name: 'Đang Sử Dụng' },
    { value: 2, name: 'Ngừng Sử Dụng' },
    { value: 3, name: 'Trả/Lưu kho' },
    { value: 4, name: 'Đang Bảo Dưỡng' }
  ]
}
