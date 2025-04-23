export interface Team {
  id: string;
  name: string;
  department: string;
  manager?: {
    id: string;
    name: string;
  };
  members?: {
    id: string;
    name: string;
  }[];
}

export interface CreateTeamDTO {
  name: string;
  departmentId?: string;
  managerId?: string;
}