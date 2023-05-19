import { PaginationRequest } from "./PaginationRequest";

export class ListProjectsRequest extends PaginationRequest {
    codeProjects: String;
    nameProjects:String;
}
