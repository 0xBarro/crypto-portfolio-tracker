import constObj from "./consts"
import { walletProcessResult} from "../interfaces"
import {processTimestamp } from "../../utils"
import { normalRawTx, internalRawTx, tokenERC20RawTx, tokenNFTRawTx } from "./ethscanRawInterfaces"

const getTxJson = async (url: string): Promise<Array<normalRawTx|internalRawTx|tokenERC20RawTx|tokenNFTRawTx>> => {
    console.log('Loading data from: ' + url)
    try {
        const r = await fetch(url)
        const r_1 = await r.json()
        return r_1['result']
    } catch (e) {
        throw `Error in URL ${url}. ${e}`
    }
}

const getEthWalletTx = async (wallet: string, blockchainName: keyof typeof constObj, debug=false): Promise<walletProcessResult> => {
    console.log(`Now processing wallet ${wallet} on blockchain ${blockchainName}`)

    if (!(blockchainName in constObj)) {throw `${blockchainName} not in constObj keys ${Object.keys(constObj)}`}
    const chainConsts = constObj[blockchainName]

    const normalTx: Promise<Array<normalRawTx>> = getTxJson(chainConsts.getNormalTxUrl(wallet)).catch(e => {throw `Error getting normal transactions in wallet ${wallet} on chain ${blockchainName}. ${e}`})
    const internalTx = getTxJson(chainConsts.getInternalTxUrl(wallet)).catch(e => {throw `Error getting Internal transactions in wallet ${wallet} on chain ${blockchainName}`})
    const erc20Tx = getTxJson(chainConsts.getERC20TxUrl(wallet)).catch(e => {throw `Error getting ERC20 transactions in wallet ${wallet} on chain ${blockchainName}`})
    const erc721Tx = getTxJson(chainConsts.getERC721TxUrl(wallet)).catch(e => {throw `Error getting ERC721 transactions in wallet ${wallet} on chain ${blockchainName}`})

    const allTx = await Promise.all([normalTx, internalTx, erc20Tx, erc721Tx]).then(t => t.reduce((l, r) => l.concat(r), []))

    return {wallet: wallet, txs: allTx}
}

// const processEthWalletTx = (rawTx: object): tx => {
//     return {
//         txHash: rawTx.hash,
//         tokens: {},
//         date: processTimestamp(rawTx.timeStamp),

//     }
// }

export default getEthWalletTx