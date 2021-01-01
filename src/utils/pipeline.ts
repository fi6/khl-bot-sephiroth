import { TextMessage } from "kaiheila-bot-root/dist/types"

interface Data {
    command: string
    args: string[]
    msg: TextMessage
}

const pipeline = (
    val: Data,
    ...funcs: Array<(x: Data) => Data>
) => funcs.reduce(
    (pre, cur) => cur(pre),
    val
)

export {
    Data,
    pipeline
}