import { BaseSession } from 'kbotify';
import Profile, { ProfileDoc } from '../../../models/Profile';

export async function profileGetorCreate(
    session: BaseSession
): Promise<ProfileDoc> {
    let profile = await Profile.findOne(
        { khlId: session.userId },
        { upsert: true }
    ).exec();
    if (!profile) {
        profile = await Profile.create(
            {
                khlId: session.userId,
                nickname: session.user.username,
            },
            { new: true }
        );
    }
    // if (!profile) throw new Error('profile not found!');
    return profile;
}
