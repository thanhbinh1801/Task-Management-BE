import { INotificationRepository } from "./repository/interfaces/IWorkspaceRepository";

export default class NotificationService {
  constructor(private readonly notificationRepo: INotificationRepository) {}

 
}