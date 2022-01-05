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
        (address: string): string => {return `https://polygonscan.com/address/${address}`},
        async (address: string): Promise<number> => {
            const url = `https://api.polygonscan.com/api?module=account&action=balance&address=${address}&tag=latest&apikey=${process.env['POLYGONSCAN_KEY']}`
            const result: number = await fetch(url).then(p => p.json()).then((p: {status: string, message: string, result: string}): number => +p.result).catch(e => e)
            return result
        },
        async (address: string, tokenCA: string, tokenName: string): Promise<[string, number]> => {
            const url = `https://api.polygonscan.com/api?module=account&action=tokenbalance&contractaddress=${tokenCA}&address=${address}&tag=latest&apikey=${process.env['POLYGONSCAN_KEY']}`
            const result: Promise<number> = fetch(url).then(p => p.json()).then((p: {status: string, message: string, result: string}): number => +p.result).catch(e => e)
            return [tokenName, await result]
        }


)

const constObj: {[key: string]: EthTxGetter } = {
    polygon: polygon
}

export default constObj
