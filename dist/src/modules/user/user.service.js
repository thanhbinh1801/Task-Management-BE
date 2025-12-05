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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const commons_1 = require("@/commons");
const responses_1 = require("./dtos/responses");
const zod_1 = __importDefault(require("zod"));
const cloudinary_1 = require("cloudinary");
class UserService {
    constructor(userRepo) {
        this.userRepo = userRepo;
    }
    getUsers(_a) {
        return __awaiter(this, arguments, void 0, function* ({ skip, take, name, email }) {
            const [users, totalItems] = yield this.userRepo.findUsers({ skip, take, name, email });
            if (!users) {
                throw new commons_1.NotFoundException("No users found");
            }
            const ResponseUsers = zod_1.default.array(responses_1.UserResponseSchema).parse(users);
            const totalPages = totalItems / take;
            const page = skip / take + 1;
            const limit = take;
            return {
                data: ResponseUsers,
                meta: {
                    page,
                    limit,
                    totalItems,
                    totalPages
                }
            };
        });
    }
    getUserById(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.userRepo.findById(userId);
            if (!user) {
                throw new commons_1.NotFoundException("User not found");
            }
            const responseUser = responses_1.UserResponseSchema.parse(user);
            return responseUser;
        });
    }
    createUser(dataUser) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!dataUser) {
                throw new commons_1.BadRequestException("data user not found");
            }
            const user = yield this.userRepo.createUser(dataUser);
            if (!user) {
                throw new commons_1.InternalServerException("Can not create user");
            }
            return user;
        });
    }
    updateUser(dataUser) {
        return __awaiter(this, void 0, void 0, function* () {
            const existingUser = yield this.userRepo.findById(dataUser.id);
            if (!existingUser) {
                throw new commons_1.NotFoundException("User not found");
            }
            if (existingUser.avatarPublicId) {
                yield cloudinary_1.v2.uploader.destroy(existingUser.avatarPublicId);
            }
            const updateUser = yield this.userRepo.updateUser(dataUser);
            if (!updateUser) {
                throw new commons_1.InternalServerException("Can not update user");
            }
            return updateUser;
        });
    }
    updateAvatarUser(userId, avatarUrl, avatarPublicId) {
        return __awaiter(this, void 0, void 0, function* () {
            const existingUser = yield this.userRepo.findById(userId);
            if (!existingUser) {
                throw new commons_1.NotFoundException("User not found");
            }
            if (existingUser.avatarPublicId) {
                yield cloudinary_1.v2.uploader.destroy(existingUser.avatarPublicId);
            }
            const updateAvatarUser = yield this.userRepo.updateAvatarUser(userId, avatarUrl, avatarPublicId);
            if (!updateAvatarUser) {
                throw new commons_1.InternalServerException("Can not update user avatar");
            }
            return updateAvatarUser;
        });
    }
    getUserByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.userRepo.findByEmail(email);
            return user !== null && user !== void 0 ? user : null;
        });
    }
    createGoogleUser(dataUser) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!dataUser) {
                throw new commons_1.BadRequestException("data user not found");
            }
            const user = yield this.userRepo.createGoogleUser(dataUser);
            if (!user) {
                throw new commons_1.InternalServerException("Can not create user");
            }
            return user;
        });
    }
}
exports.default = UserService;
