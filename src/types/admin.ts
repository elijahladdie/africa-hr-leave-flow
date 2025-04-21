export interface Department {
    id: string;
    name: string;
    description: string;
    headId?: string;
}

export interface DepartmentDTO {
    id: string;
    name: string;
    description: string;
    headId?: string;
}

export interface UserRoleUpdateDTO {
    userId: string;
    role: 'STAFF' | 'ADMIN' | 'MANAGER';
}