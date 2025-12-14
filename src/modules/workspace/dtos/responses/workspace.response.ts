export interface WorkspaceMemberResponse {
  userId: string;
  userName: string;    
  userEmail: string;   
  workspaceId: string;
  roleId: string;
  roleName: string;   
  avatarUrl?: string;   
  createdAt: Date;
  updatedAt: Date;
}

export interface BoardResponse {
  id: string;
  name: string;
  workspaceId?: string | null;
  isTemplate: boolean;
  category?: string | null;
  description?: string | null;
  createdAt: Date;
  updatedAt: Date;  
}

export interface WorkspaceResponse {
  id: string;
  name: string;
  visibility: string;
  createdAt: Date;
  updatedAt: Date;
  members: WorkspaceMemberResponse[];
  boards: BoardResponse[];
}
