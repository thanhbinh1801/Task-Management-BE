export interface BoardMemberResponse {
  userId: string;
  userName: string;    
  userEmail: string;   
  boardId: string;
  roleId: string;
  roleName: string;   
  avatarUrl?: string;   
  createdAt: Date;
  updatedAt: Date;
}

export interface CardResponse {
  id: string;
  name: string;
  isComplete: boolean;
}

export interface ListResponse {
  id: string;
  name: string;
  boardId: string;
  position: number;
  cards: CardResponse[];
}

export interface BoardResponse {
  id: string;
  name: string;
  workspaceId: string;
  lists: ListResponse[];
  members: BoardMemberResponse[];
}