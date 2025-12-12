import { Board } from "@prisma/client";

export interface TemplateDetails {
    id: string;
    name: string;
    category: string | null;
    description: string | null;
    lists: Array<{
        id: string;
        name: string;
        position: number;
        cards: Array<{
            id: string;
            name: string;
            description: string | null;
            position: number;
        }>;
    }>
}

export interface ITemplateRepository {
    getAllTemplates(): Promise<TemplateDetails[]>;
    getTemplateById(templateId: string): Promise<TemplateDetails | null>;

    // get templates by category
    getTemplatesByCategory(category: string): Promise<TemplateDetails[]>;
    // Create a new board by cloning a template
    cloneTemplateToBoard(templateId: string, boardName: string, workspaceId: string, userId: string): Promise<Board>;
}