import { BaseSession, GuildSession } from 'kbotify';
import Profile, { ProfileDoc } from '../../../models/Profile';

export function profileGetBySession(session: BaseSession): Promise<ProfileDoc> {
    let nickname = session.user.username;
    if (session instanceof GuildSession)
        nickname = session.user.nickname ?? session.user.username;
    const profile = Profile.findOneAndUpdate(
        { kid: session.userId },
        { nickname: nickname },
        { upsert: true, new: true }
    ).exec();
    return profile;
}
