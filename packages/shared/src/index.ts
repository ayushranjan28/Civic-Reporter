export type UserRole = 'CITIZEN' | 'STAFF' | 'ADMIN';

export type ReportStatus = 'SUBMITTED' | 'ACKNOWLEDGED' | 'IN_PROGRESS' | 'RESOLVED';

export interface UserDTO {
  id: string;
  email: string;
  name: string;
  role: UserRole;
}

export interface ReportDTO {
  id: string;
  citizenId: string;
  title: string;
  description: string;
  category: string;
  status: ReportStatus;
  latitude: number;
  longitude: number;
  address?: string;
  mediaUrl?: string;
  createdAt: string;
}

export interface DepartmentDTO {
  id: string;
  name: string;
  categories: string[];
}

export interface TaskAssignmentDTO {
  id: string;
  reportId: string;
  departmentId: string;
  assigneeId?: string;
  priority: number;
  notes?: string;
}


