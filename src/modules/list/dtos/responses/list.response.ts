export interface CardResponse {
  id: string,
  name: string,
  isComplete: boolean,
  createAt: Date,
  updateAt: Date
}

export interface ListResponse {
  id: string,           // ← Thêm id
  name: string,
  position: number,
  boardId: string,
  createAt: Date,
  updateAt: Date,
  cards: CardResponse[] // ← Sửa thành array
}