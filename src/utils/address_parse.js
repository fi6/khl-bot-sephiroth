import ParseAddress, { Utils } from 'address-parse';

function parse(address){
    return ParseAddress.default.parse(address)[0];
}

export default parse