import {
    FuncResult,
    FunctionCommand,
    ResultTypes,
} from 'commands/command.helpers';
import { ProfileData } from './profile.types';

const createProfile = new FunctionCommand({
    code: 'createProfile',
    alias: ['档案'],
    help: '',
    func: createProfileFunc,
});

async function createProfileFunc(data: ProfileData) {
    const result: FuncResult<ProfileData> = {
        type: ResultTypes.PENDING,
        returnData: data,
    };
    if (!data.args.length) {
        result.type = ResultTypes.HELP;
        return result;
    }

    return result;
}

async function createProfileMsgs(type) {
    switch (type) {
        case 'success':
            return (
                `(met)${msg.authorId}(met) 建房成功！\n关闭房间后记得发送\`.关房\`删除记录。\n---\n` +
                (await findArenaMsg())
            );
        case 'fail':
            return '创建失败，请检查房间号、密码格式，并确认房间信息文字长度小于8。';
        case 'help':
            return '创建房间请发送：`.建房 房间号 密码 房间信息 (留言)`\n如：`.建房 BPTC1 147 港服3人 萌新马里奥想找个剑人练习~`\n房间号、密码、房间信息必填，留言选填。';
        default:
            break;
    }
}

export default createProfile;
