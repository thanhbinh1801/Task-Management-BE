import { CardResponse } from "@/modules/card/dtos/responses/card.response";

export interface ListResponse {
  id: string,          
  name: string,
  position: number,
  boardId: string,
  createAt: Date,
  updateAt: Date,
  cards: CardResponse[] 
}