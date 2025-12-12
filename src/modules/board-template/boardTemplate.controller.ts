import { Request, Response, NextFunction } from "express";
import { BadRequestException } from "@/commons";
import { TemplateService } from "./boardTemplate.service";

export default class TemplateController {
    constructor(private readonly templateService: TemplateService) { }

    getAllTemplates = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const templates = await this.templateService.getAllTemplates();

            res.status(200).json({
                status: "success",
                message: "Get templates successfully",
                data: templates
            });
        } catch (err) {
            next(err);
        }
    }

    getTemplateById = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const templateId = req.params.templateId;

            if (!templateId) {
                throw new BadRequestException("templateId not found");
            }

            const template = await this.templateService.getTemplateById(templateId);

            res.status(200).json({
                status: "success",
                message: "Get template successfully",
                data: template
            });
        } catch (err) {
            next(err);
        }
    }

    getTemplatesByCategory = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const category = req.params.category;

            if (!category) {
                throw new BadRequestException("category not found");
            }

            const templates = await this.templateService.getTemplatesByCategory(category);

            res.status(200).json({
                status: "success",
                message: "Get templates by category successfully",
                data: templates
            });
        } catch (err) {
            next(err);
        }
    }
}