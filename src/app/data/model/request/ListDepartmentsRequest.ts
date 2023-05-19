import { Timestamp } from 'rxjs/internal/operators/timestamp';
import { PaginationRequest } from './PaginationRequest';

export class ListDepartmentsRequest extends PaginationRequest {
  departmentName: String;
}

export class updateDepartment {
  id: number;
  name: string;
  action: number;
  member: number;
}
