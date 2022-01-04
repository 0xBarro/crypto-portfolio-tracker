import dotenv from 'dotenv'
import  {EthTxGetter} from './processEthWallet'

dotenv.config()

// Class for the polygon ecosystem
const polygon = new EthTxGetter(
        'MATIC',
        'WMATIC',
        'matic-network',
        '0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270',
        (address: string, action: string, _token?: string): string => {
            const token = (_token === undefined) ? process.env['POLYGONSCAN_KEY'] : _token // This is just to allow for the testing
            return `https://api.polygonscan.com/api?module=account&action=${action}&address=${address}&startblock=1&endblock=99999999&sort=asc&apikey=${token}`
        },
        (tx: string): string  => {return `https://polygonscan.com/tx/${tx}`},
        (address: string): string => {return `https://polygonscan.com/address/${address}`}
)

const constObj: {[key: string]: EthTxGetter } = {
    polygon: polygon
}

export default constObj
