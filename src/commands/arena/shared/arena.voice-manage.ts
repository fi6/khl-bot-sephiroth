import { EventEmitter } from 'events';
import { Channel, GuildSession, KBotify } from 'kbotify';
import configs, { channels, roles } from '../../../configs';
import bot from '../../../init/bot_init';
import { log } from '../../../init/logger';
import { ArenaDoc } from '../../../models/Arena';

class VoiceChannelManager extends EventEmitter {
    constructor() {
        super();
    }
    create = async (session: GuildSession): Promise<Required<Channel>> => {
        const result = await bot.API.channel.create(
            session.guild.id,
            '🎤 ' + (session.user.nickname ?? session.user.username),
            '2',
            channels.voiceCategory,
            16,
            3
        );

        const voiceChannelId: string = result.id;

        this.publish(voiceChannelId);
        this._grantPermission(voiceChannelId, bot.userId, 'user_id', 68640);
        // this._grantPermission(voiceChannelId, 142399, 'role_id', 2048, 32768);
        this.grantUserPermission(voiceChannelId, session.userId, true);
        return result;
    };

    get = async (arena: ArenaDoc) => {
        const result = await bot.get('v3/channel/view', {
            target_id: arena.voice,
        });
        if (result.data.code !== 0) throw new Error('channel not found');
        // this.grantUserPermission(result.data.data.id, profile.id);
        return result.data.data;
    };

    publish = async (channelId: string) => {
        await bot
            .post('v3/channel-role/create', {
                channel_id: channelId,
                value: roles.basic,
                type: 'role_id',
            })
            .catch(console.error);
        bot.post('v3/channel-role/update', {
            channel_id: channelId,
            value: roles.basic,
            type: 'role_id',
            allow: 146835456, // visible and free to talk. invisible: 146833408
        });
    };

    recycle = async (channelId: string) => {
        try {
            await bot.post('v3/channel/delete', {
                channel_id: channelId,
            });
        } catch (e) {
            console.error(e);
        }
        // bot.post('v3/channel-role/update', {
        //     channel_id: channelId,
        //     value: 142399,
        //     type: 'role_id',
        //     deny: 2048,
        // });
    };

    grantUserPermission = async (
        channelId: string,
        userId: string,
        owner = false
    ) => {
        try {
            await bot.API.channelRole.create(channelId, 'user_id', userId);
        } catch (error) {
            console.error(error);
        }
        // bot.API.channelRole.update(channelId, 'user_id', userId, owner ? 146900992 : 146833408, 0)
        bot.post('v3/channel-role/update', {
            channel_id: channelId,
            type: 'user_id',
            value: userId,
            allow: owner ? 146900992 : 146833408,
        });
    };

    revokePermission = async (channelId: string, userId: string) => {
        bot.API.channelRole.delete(channelId, 'user_id', userId);
    };

    _grantPermission = async (
        channelId: string,
        value: string,
        type: 'role_id' | 'user_id',
        allow = 0,
        deny = 0
    ) => {
        try {
            await bot.API.channelRole.create(channelId, type, value.toString());
        } catch (error) {
            console.error(error);
        }
        bot.post('v3/channel-role/update', {
            channel_id: channelId,
            value: value,
            type: type,
            allow: allow,
            deny: deny,
        });
    };
}

export const voiceChannelManager = new VoiceChannelManager();
