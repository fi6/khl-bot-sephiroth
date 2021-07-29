import { AppCommand, AppFunc, BaseSession, Card, GuildSession } from 'kbotify';
import configs from '../../configs';
import { logger } from '../../init/logger';
import DioEvent from '../../models/DioEvent';
import { dioEventRegisterCard } from './cards/event.register.card';

class EventRegister extends AppCommand {
    trigger = '报名';
    func: AppFunc<BaseSession> = async (s) => {
        const session = await GuildSession.fromSession(s, true);
        try {
            if (!session.args.length)
                throw new Error('报名出现了错误……请私聊冰飞: no event code');
            const event = await DioEvent.findOne({
                code: session.args[0],
            }).exec();
            if (!event)
                throw new Error(
                    '报名出现了错误……请私聊冰飞: event code does not exist'
                );
            if (event.memberExists(session.user.id))
                throw new Error(
                    `你已经报名过了……请不要重复报名。\n查看活动报名汇总请点击(chn)${configs.channels.dioEvent}(chn)`
                );
            logger.debug(dioEventRegisterCard().toString());
            await session.sendCardTemp(dioEventRegisterCard());
            await session.user.grantRole(configs.roles.tempInput);
            const input = await session.awaitMessage(/.+/, 180 * 1e3);
            session.user.revokeRole(configs.roles.tempInput);
            if (!input?.content) throw new Error('未收到输入，请重试');
            input.delete();
            const lines = input.content.split(/\r?\n/);
            if (lines.length !== 3) throw new Error('格式似乎不对……请重试');

            const hours = /\d+/.exec(lines[0]);
            if (!hours) throw new Error('未找到对战时长……请重试');
            const memberNumber = event.lastNumber + 1;
            const sent = await this.client?.API.message.create(
                10,
                configs.channels.dioEvent,
                new Card()
                    .addText(`(met)${session.user.id}(met) 的报名`)
                    .addDivider()
                    .addText(input.content)
                    .toString()
            );
            await event.addMember({
                _id: session.user.id,
                nickname: session.user.nickname,
                time: parseInt(hours[0]),
                fighter: lines[1],
                reason: lines[2],
                number: memberNumber,
                register: new Date(),
                msgId: sent!.msgId,
            });
            // const sent = await this.client?.API.message.create(
            //     10,
            //     configs.channels.dioEvent,
            //     new Card()
            //         .addText(`(met)${session.user.id}(met) 的报名`)
            //         .addDivider()
            //         .addText(input.content)
            //         .toString()
            // );
            await session.user.grantRole(323723);
            session.sendTemp(
                '报名成功！已为你添加活动相关频道，请查看左侧频道列表（手机点击左上角）。\n活动前我们会在本频道公示选中的小伙伴，本次预计10人左右。'
            );
        } catch (error) {
            session.sendCardTemp(
                new Card().addText(error.message).setTheme('warning')
            );
        }
    };
}

export const eventRegister = new EventRegister();
