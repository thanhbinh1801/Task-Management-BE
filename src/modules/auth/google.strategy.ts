import passport from "passport";
import { Strategy , Profile, VerifyCallback } from "passport-google-oauth20";
import { appEnv } from "@/configs";
import prisma from "@/configs/prisma";

export class GoogleStrategy {
  constructor(){
    passport.use('google', new Strategy(
      {
        clientID: appEnv.GOOGLE_CLIENT_ID,
        clientSecret: appEnv.GOOGLE_CLIENT_SECRET,
        callbackURL: appEnv.GOOGLE_CALLBACK_URL,
        scope: ['profile', 'email'],
        state: true
      },
      this.validate.bind(this)
    ))
  }

  async validate(accessToken: string, refreshToken: string, profile: Profile, done: VerifyCallback): Promise<void> {
    try {
      const googleAuthData = {
        accessToken,
        refreshToken,
        profile,
        user: {
          email: profile.emails?.[0]?.value,
          name: profile.displayName,
          isActive: 1,
          avatarUrl: profile.photos?.[0]?.value,
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
  }
}


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