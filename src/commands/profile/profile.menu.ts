import { TextMessage } from 'kaiheila-bot-root/dist/types';
import { MenuCommand } from 'kbotify';
import { FuncResult, ResultTypes } from 'kbotify/dist/commands/shared/types';
import { pipeline } from 'stream';
import createProfile from './profile.create';
import { ProfileData } from './profile.types';

class profileMenu extends MenuCommand<ProfileData> {
    code = 'profile';
    trigger = '档案';
    menu = '';
    func = profileMenuFunc;
}

async function profileMenuFunc(
    command: string,
    args: string[],
    msg: TextMessage
): Promise<FuncResult<ProfileData>> {
    const data = {
        command: command,
        commandCode: profileMenu.code,
        args: args,
        msg: msg,
        result_status: 'not_available',
        result: {},
    };
    const funcResult: FuncResult<ProfileData> = {
        type: ResultTypes.PENDING,
        returnData: data,
    };

    if (args.length == 4) {
        //.档案 创建 奈斯，露琪娜 日港裸 北京，天津 娱乐向玩家
        return pipeline(data, createProfile, sendMsg);
    }

    let subCommand = args.shift();
    data.command = subCommand;
    data.args = args;
    switch (subCommand) {
        case '创建': // <== .档案 创建
            return pipeline(data, createProfile, sendMsg);
        case '查看':
            return pipeline(data, checkProfile, sendMsg);
        case '修改':
            return pipeline(data, modifyProfile, sendMsg);
        default:
            return sendMsg('help', null, msg);
    }

    return funcResult;
}

export default profileMenu;
