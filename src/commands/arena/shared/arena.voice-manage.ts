import { EventEmitter } from 'events';
import { Channel, GuildSession, KBotify } from 'kbotify';
import configs, { channels, roles } from '../../../configs';
import bot from '../../../init/bot_init';
import { log } from '../../../init/logger';
import Arena, { ArenaDoc } from '../../../models/Arena';

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

    list = async () => {
        const result = await bot.API.channel.list('1843044184972950');
        const voices = result.items.filter((c) => {
            return (
                c.parentId == channels.voiceCategory && c.name.startsWith('🎤')
            );
        });
        return voices;
    };

    recycleUnused = async () => {
        const channels = await this.list();
        for (const channel of channels) {
            const arena = await Arena.findOne({ voice: channel.id }).exec();
            if (!arena) {
                log.info('arena not found for channel, recycling', channel);
                this.recycle(channel.id);
            } else if (
                arena.expireAt < new Date() &&
                (await this.isChannelEmpty(channel.id))
            ) {
                log.info(
                    'arena expired with no people, recycling voice channel',
                    channel
                );
                this.recycle(channel.id);
            }
        }
    };

    get = async (arena: ArenaDoc) => {
        const result = await bot.API.channel.view(arena.voice);
        return result;
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
            deny: 0,
        });
    };

    isChannelEmpty = async (channelId: string) => {
        try {
            const result = bot.get('v3/channel/user-list', {
                channel_id: channelId,
            });
            if ((await result).data.items.length == 0) return true;
        } catch (e) {
            log.error(e);
            return false;
        }
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
            allow: owner ? 146901000 : 146833408,
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
