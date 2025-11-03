import { BoardMember } from "@prisma/client";
import { IMemberBoardRepository } from "./repositories/interfaces/IMemberBoardRepository";
import { InternalServerException } from "@/commons";
import { IUserRepository } from "@/modules/user/repository/interface/IUserRepository";

export default class MemberBoardService {
  constructor(private readonly memberRepo: IMemberBoardRepository
    , private readonly userRepo: IUserRepository
  ) {}

  async addMemberBoardByEmail(email: string, boardId: string): Promise<BoardMember | null>{
    const newMember = await this.memberRepo.addMemberBoard(email, boardId);
    if(!newMember) {
      throw new InternalServerException("can not add member to board");
    }
    return newMember;
  }

  async getMember(boardId: string): Promise<BoardMember[] | null>{
    const members = await this.memberRepo.getMember(boardId);
    if(!members) {
      throw new InternalServerException("can not get members of board");
    }
    return members;
  }

  async updateMember(boardId: string, userId: string, role: string): Promise<BoardMember | null>{
    const updatedMember = await this.memberRepo.updateMember(boardId, userId, role);
    if(!updatedMember) {
      throw new InternalServerException("can not update member of board");
    }
    return updatedMember;
  }

  async removeMember(boardId: string, userId: string): Promise<BoardMember | null>{
    const removedMember = await this.memberRepo.removeMember(boardId, userId);
    if(!removedMember) {
      throw new InternalServerException("can not remove member of board");
    }
    return removedMember;
  }

  async addMemberBoardByLink(token: string, userId: string): Promise<BoardMember | null> {
    const userRecord = await this.userRepo.findById(userId);
    const { boardId } = await this.memberRepo.getBoardIdByLink(token);
    if (!userRecord || !boardId) {
      throw new InternalServerException("can not get userRecord or boardId from link");
    }
    return this.addMemberBoardByEmail(userRecord.email, boardId);
  }
}