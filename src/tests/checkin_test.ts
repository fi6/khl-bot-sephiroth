import Set from '../models/Set.js'

function checkinTest(){
    Set.findOne({'entrants.ggPlayerId': '1194618'}, (err, res) => {
        console.log(res)
    });
}
export default checkinTest