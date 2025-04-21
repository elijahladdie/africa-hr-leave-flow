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
  leaveBalances: string[];
  leaveRequests: string[];
  teams: string[];
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
  description: string;
  departmentId: string;
  managerId: string;
  memberIds: string[];
};


export interface ResponseData {
  data: any;
  resp_msg: string;
  resp_code: number;
}