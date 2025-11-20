

export interface WorkspaceMemberResponse {
  userId: string;
  userName: string;    
  userEmail: string;   
  workspaceId: string;
  roleId: string;
  roleName: string;      
  createdAt: Date;
  updatedAt: Date;
}

export interface BoardResponse {
  id: string;
  title: string;
  workspaceId: string;
  createdAt: Date;
  updatedAt: Date;  
}

export interface WorkspaceResponse {
  id: string;
  name: string;
  visibility: string | null;
  createdAt: Date;
  updatedAt: Date;
  members: WorkspaceMemberResponse[];
  boards: BoardResponse[];
}
