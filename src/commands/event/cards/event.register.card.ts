import { Card } from 'kbotify';

export function dioEventRegisterCard(): Card {
    return new Card()
        .addTitle('活动报名')
        .addText('请按模板填写信息，并在本频道发送')
        .addDivider()
        .addText(
            '游戏时长：（小时）\n常用斗士：（简单填写即可）\n为什么要参加：（认真填写哦，重要的选人参考）\n网络信息：（如：北京联通，可帆游港服，有线）'
        )
        .addCountdown('second', new Date().valueOf() + 180 * 1e3);
}
