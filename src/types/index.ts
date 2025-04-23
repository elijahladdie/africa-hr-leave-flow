/* eslint-disable @typescript-eslint/no-explicit-any */
export interface User {
  id: string;
  createdAt: string;
  updatedAt: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  azureId: string;
  profilePictureUrl: string;
  role: 'STAFF' | 'ADMIN' | 'MANAGER';
  leaveBalances: any[];
  leaveRequests: string[];
  teams: TeamDTO[];
  active: boolean;
  username: string;
  enabled: boolean;
  fullName: string;
  accountNonLocked: string;
  authorities: string[];
  accountNonExpired: boolean;
  credentialsNonExpired: boolean;

}

export interface Department {
  id: string;
  name: string;
  description: string;
}


export type DepartmentDTO = Omit<Department, 'id'>;
export type TeamDTO = {
  name: string;
  id: string;
  description: string;
  department: Department;
  managerName?: string;
  managerId: string;
  memberIds: string[];
};


export interface ResponseData {
  data: any;
  resp_msg: string;
  resp_code: number;
}

export interface PaginationParams {
  page: number;
  limit: number;
}