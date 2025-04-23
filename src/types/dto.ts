export interface LeaveRequestDTO {
    startDate: string;
    endDate: string;
    type: string;
    reason: string;
    attachments?: File[];
}

export interface TeamDTO {
    id: number;
    name: string;
    description: string;
    departmentId: string;
    managerId: string;
}

export interface DepartmentDTO {
    id: number;
    name: string;
    description: string;
    headId?: string;
}

export interface UserUpdateDTO {
    id: number;
    firstName?: string;
    lastName?: string;
    role?: string;
    departmentId?: string;
    teamId?: string;
}

export interface TeamMember {
    id: string;
    name: string;
    email: string;
    role: string;
    department: string;
    avatar?: string;
    joinDate: string;
    joinedAt: string;
    teamId: string;
}

export interface TeamMemberDTO {
    name: string;
    email: string;
    role: string;
    department: string;
    teamId: string;
    joinedAt: string
    avatar?: string;
}