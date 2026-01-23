export interface CardMemberUser {
  id: string;
  email: string;
  fullName: string | null;
  avatar: string | null;
}

export interface CardMemberResponse {
  userId: string;
  cardId: string;
  assignedAt: Date;
  user: CardMemberUser;
}
