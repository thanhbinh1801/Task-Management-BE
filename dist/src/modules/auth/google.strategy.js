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
exports.GoogleStrategy = void 0;
const passport_1 = __importDefault(require("passport"));
const passport_google_oauth20_1 = require("passport-google-oauth20");
const configs_1 = require("@/configs");
// import prisma from "@/configs/prisma";
class GoogleStrategy {
    constructor() {
        passport_1.default.use('google', new passport_google_oauth20_1.Strategy({
            clientID: configs_1.appEnv.GOOGLE_CLIENT_ID,
            clientSecret: configs_1.appEnv.GOOGLE_CLIENT_SECRET,
            callbackURL: configs_1.appEnv.GOOGLE_CALLBACK_URL,
            scope: ['profile', 'email'],
            state: true
        }, this.validate.bind(this)));
    }
    validate(accessToken, refreshToken, profile, done) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c, _d;
            try {
                const googleAuthData = {
                    accessToken,
                    refreshToken,
                    profile,
                    user: {
                        email: (_b = (_a = profile.emails) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.value,
                        name: profile.displayName,
                        isActive: 1,
                        avatarUrl: (_d = (_c = profile.photos) === null || _c === void 0 ? void 0 : _c[0]) === null || _d === void 0 ? void 0 : _d.value,
                        createAt: new Date(),
                        emailVerifiedAt: null,
                        account: {
                            provider: 'google',
                            providerId: profile.id,
                        }
                    }
                };
                done(null, googleAuthData);
            }
            catch (err) {
                done(err, false);
            }
        });
    }
}
exports.GoogleStrategy = GoogleStrategy;
// passport.use(
//   new Strategy(
//     {
//     clientID: appEnv.GOOGLE_CLIENT_ID,
//     clientSecret: appEnv.GOOGLE_CLIENT_SECRET,
//     callbackURL: appEnv.GOOGLE_CALLBACK_URL,
//     state: true
//     },
//     async (_accessToken: string, _refreshToken: string, profile: Profile, done) => {
//       try {
//         const email = profile.emails?.[0]?.value?.toLowerCase() ?? null;
//         const avatarUrl = profile.photos?.[0]?.value ?? null;
//         const providerId = profile.id;
//         const nameCandidate = profile.displayName ?? [profile.name?.givenName, profile.name?.familyName].filter(Boolean).join(" ");
//         const name = nameCandidate || null;
//         let user;
//         if (email) {
//           user = await prisma.user.upsert({
//             where: { email },
//             update: { name, avatarUrl, provider: "google", providerId, isActive: 1 },
//             create: { email, name, avatarUrl, provider: "google", providerId, isActive: 1 },
//           });
//         } else {
//           user =
//             (await prisma.user.findFirst({ where: { provider: "google", providerId } })) ||
//             (await prisma.user.create({
//               data: {
//                 email: `${providerId}@google.local`,
//                 name,
//                 avatarUrl,
//                 provider: "google",
//                 providerId,
//                 isActive: 1,
//               },
//             }));
//         }
//         const { passwordHash, ...safeUser } = user as any;
//         return done(null, safeUser);
//       } catch (ex) {
//         return done(ex as any);
//       }
//     }
//   )
// );
// passport.serializeUser((user: any, done) => done(null, user.id));
// passport.deserializeUser(async (id: string, done) => {
//   try {
//     const user = await prisma.user.findUnique({ where: { id } });
//     if (!user) return done(null, false);
//     const { passwordHash, ...safeUser } = user as any;
//     done(null, safeUser);
//   } catch (e) {
//     done(e as any);
//   }
// });
// export default passport;
