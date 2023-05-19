import { PaginationRequest } from "./PaginationRequest";

export class EmployeeRequest extends PaginationRequest {
    employeeCode: String;
    fullName:String;
}
