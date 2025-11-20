import { WorkspaceMember } from "@prisma/client";
import { IMemberWorkspaceRepository } from "./repositories/interfaces/IMemberRepository";
import { InternalServerException } from "@/commons";

export default class MemberWorkspaceService {
  constructor(private readonly memberRepo: IMemberWorkspaceRepository
  ) {}

  async addMemberWorkspaceByEmail(email: string, workspaceId: string): Promise<WorkspaceMember | null>{
    const newMember = await this.memberRepo.addMemberWorkspace(email, workspaceId);
    if(!newMember) {
      throw new InternalServerException("can not add member to workspace");
    }
    return newMember;
  }

  async getMember(workspaceId: string): Promise<WorkspaceMember[] | null>{
    const members = await this.memberRepo.getMember(workspaceId);
    if(!members) {
      throw new InternalServerException("can not get members of workspace");
    }
    return members;
  }

  async updateMember(workspaceId: string, userId: string, role: string): Promise<WorkspaceMember | null>{
    const updatedMember = await this.memberRepo.updateMember(workspaceId, userId, role);
    if(!updatedMember) {
      throw new InternalServerException("can not update member of workspace");
    }
    return updatedMember;
  }

  async removeMember(workspaceId: string, userId: string): Promise<WorkspaceMember | null>{
    const removedMember = await this.memberRepo.removeMember(workspaceId, userId);
    if(!removedMember) {
      throw new InternalServerException("can not remove member of workspace");
    }
    return removedMember;
  }
}