import { Profile } from 'passport-google-oauth20';

export interface GoogleAuthData {
    accessToken: string;
    refreshToken: string;
    profile: Profile;
    user: {
        googleId: string;
        email?: string;
        name?: string;
        avatar?: string;
        emailVerifiedAt: Date;
    };
}