const arenaReg = /^\w{5}$/;
const passReg = /^\d{0,8}$/;

export function argsCheckerToLimit(args: string[]): string | void {
    const limit = /\d/.exec(args[3]) as RegExpExecArray;
    if (
        !arenaReg.test(args[0]) ||
        !passReg.test(args[1]) ||
        !limit.length ||
        args[2].length > 7
    )
        return;
    return limit[0];
}
