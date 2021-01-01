import {
    TextMessage, ImageMessage, VideoMessage,
    FileMesage as FileMessage, AudioMessage, KMarkDownMessage
} from 'kaiheila-bot-root/dist/types'

export type KHLMessage = TextMessage | ImageMessage | VideoMessage | FileMessage | AudioMessage | KMarkDownMessage

function formatTime(s) {
    const dtFormat = new Intl.DateTimeFormat('en-GB', {
        timeStyle: 'short',
        timeZone: "Asia/Shanghai"
    });

    return dtFormat.format(new Date(s));
}

function dynamicSort(property) {
    var sortOrder = 1;
    if (property[0] === "-") {
        sortOrder = -1;
        property = property.substr(1);
    }
    return function (a, b) {
        /* next line works with strings and numbers, 
         * and you may want to customize it to your needs
         */
        var result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
        return result * sortOrder;
    }
}

class cloudLines {
    constructor() {
        this.lines = [
            '失落已久的知识宝藏。古代种的智慧……',
            '等着你们的只有死亡，不过不用害怕。因为，随着死亡，新的精神能量才能诞生。很快你就会作为我的一部分继续活下去了。',
            '这么冷淡啊！我可是一直都站在你这边的，来吧。',
            '这边，克劳德……好孩子。',
            '你在说什么？你是想告诉我，你也有感情吗？',
            '哈哈哈……别扮出一副悲伤的样子了。也没必要作出一幅愤怒的表情。因为，Cloud，你是个……傀儡。',
            '我看你终于明白了。',
            '哦，是吗？你只是个傀儡……你没有心……也感觉不到疼痛……这样的东西，所谓记忆还有什么意义？我给你看的才是真相，你的记忆，才是幻觉。',
            '……你明白了吗？',
            '哈哈哈……看来，你的感觉不怎么好啊。',
            '你还是不明白？那么……',
            '让我看看你跪地求饶的样子',
            '不要想太多了，恐怖只有一瞬间',
            '即使是黑暗也会燃烧殆尽。',
            '与绝望同眠吧',
            '我……是不可能成为回忆的……'
        ];
        this.calls = [];
    }
    call() {
        this.calls.push(Date.now())
        while (this.calls.length > 3) {
            this.calls.shift();
        }
        if (this.calls.length > 1 && Date.now() - this.calls[0] < 40 * 1e3) {
            return this.lines[Math.floor(Math.random() * this.lines.length)]
        }
        return false
    }
}

let callCloud = new cloudLines();

function checkRoles(user, roleStrings) {
    if (!Array.isArray(roleStrings)) {
        roleStrings = [roleStrings];
    }
    const roleMap = {
        'coach': 20684,
    }
    let result = true;
    for (let roleString of roleStrings) {
        // console.log(user.roles);
        // console.log(roleMap[roleString])
        result = result && user.roles.includes(roleMap[roleString]);
    }
    return result
}

import ParseAddress from 'address-parse';

function addParse(address) {
    return ParseAddress.default.parse(address)[0];
}

function fighterParse(fighterString) {

}



export { formatTime, dynamicSort, checkRoles, callCloud, addParse, fighterParse }