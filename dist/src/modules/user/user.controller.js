"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const badRequest_exception_1 = require("@/commons/exceptions/badRequest.exception");
const requests_1 = require("./dtos/requests");
class UserController {
    constructor(userService) {
        this.userService = userService;
        this.getUsers = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const query = requests_1.UserRequestSchema.parse(req.pagination);
                const users = yield this.userService.getUsers(query);
                res.status(200).json({
                    status: "success",
                    message: "get user successfully",
                    data: users
                });
            }
            catch (err) {
                next(err);
            }
        });
        this.getUserById = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = req.params.userId;
                if (!userId) {
                    throw new badRequest_exception_1.BadRequestException("user id not found");
                }
                const user = yield this.userService.getUserById(userId);
                res.status(200).json({
                    status: "success",
                    message: "get user by id successfully",
                    data: user
                });
            }
            catch (err) {
                next(err);
            }
        });
        this.createUser = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const dataUser = requests_1.UserRegisterRequestSchema.parse(req.body);
                if (!dataUser) {
                    throw new badRequest_exception_1.BadRequestException("data user not found");
                }
                const newUser = yield this.userService.createUser(dataUser);
                res.status(201).json({
                    status: "success",
                    message: "create user successfully",
                    data: newUser
                });
            }
            catch (err) {
                next(err);
            }
        });
        this.updateUser = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const dataUser = requests_1.UserUpdateRequestSchema.parse(req.body);
                if (!dataUser) {
                    throw new badRequest_exception_1.BadRequestException("data user not found");
                }
                const updateUser = yield this.userService.updateUser(dataUser);
                res.status(200).json({
                    status: "success",
                    message: "update user successfully",
                    data: updateUser
                });
            }
            catch (err) {
                next(err);
            }
        });
        this.updateAvatarUser = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = req.params.id;
                if (!userId) {
                    throw new badRequest_exception_1.BadRequestException("user id not found");
                }
                const file = req.file;
                console.log("File avatar: ", file);
                if (!file) {
                    throw new badRequest_exception_1.BadRequestException("file image not found");
                }
                const avatarUrl = file.path;
                const avatarPublicId = file.filename;
                const updateAvatarUser = yield this.userService.updateAvatarUser(userId, avatarUrl, avatarPublicId);
                res.status(200).json({
                    status: "success",
                    message: "update avatar user successfully",
                    data: updateAvatarUser
                });
            }
            catch (err) {
                next(err);
            }
        });
    }
}
exports.default = UserController;
