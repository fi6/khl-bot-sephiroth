class Data {
    constructor(command, args, msg) {
        this.command = command;
        this.args = args;
        this.msg = msg;
    }
}

function pipeline(val, ...funcs) {
    return funcs.reduce(function (pre, cur) {
        return cur(pre);
    }, val);
}

export {
    Data,
    pipeline
}