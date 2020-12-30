import Set from '../models/Set.js'
import Account from '../models/Account.js'

async function khl2gg() {

}

async function gg2khl(ggPlayerId) {
    let id = 0;
    let khlUser = await Account.findOne({ ggPlayerId: ggPlayerId }).exec()
    if (khlUser) {
        id = khlUser.id;
    }
    return id
}

export { gg2khl }