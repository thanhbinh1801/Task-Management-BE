import { ITemplateRepository } from "./interfaces/ITemplateRepository";
import { NotFoundException } from "@/commons";
import { TemplateDetails } from "./interfaces/ITemplateRepository";

export class TemplateService {
    constructor(private readonly templateRepo: ITemplateRepository) { }

    async getAllTemplates(): Promise<TemplateDetails[]> {
        const templates = await this.templateRepo.getAllTemplates();

        if (!templates) {
            throw new NotFoundException('No templates found');
        }

        return templates
    }

    async getTemplateById(templateId: string): Promise<TemplateDetails> {
        const template = await this.templateRepo.getTemplateById(templateId);

        if (!template) {
            throw new NotFoundException('Template not found');
        }

        return template;
    }

    async getTemplatesByCategory(category: string): Promise<TemplateDetails[]> {
        const templates = await this.templateRepo.getTemplatesByCategory(category);

        if (!templates || templates.length === 0) {
            throw new NotFoundException('No templates found for the specified category');
        }

        return templates;
    }
}