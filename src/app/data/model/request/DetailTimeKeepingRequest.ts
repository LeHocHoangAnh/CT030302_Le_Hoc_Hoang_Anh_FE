import { PaginationRequest } from "./PaginationRequest";

export class DetailTimeKeepingRequest extends PaginationRequest {
    employeeCode: String;
    fullName:String;
    timeYear:String;
}
