import constObj from "./consts"
import { walletProcessResult, processedTx} from "../interfaces"
import {processTimestamp } from "../../utils"
import { normalRawTx, internalRawTx, tokenERC20RawTx, tokenNFTRawTx,} from "./ethscanRawInterfaces"
import { text } from "stream/consumers"

const flattenObject = (obj: {[k: string]: object}): object[] => {
    return Object.keys(obj).map(k => obj[k])
}

const getTxJson = async (url: string): Promise<Array<normalRawTx>|Array<internalRawTx>|Array<tokenERC20RawTx>|Array<tokenNFTRawTx>> => {
    console.log('Loading data from: ' + url)
    try {
        const r = await fetch(url)
        const r_1  = await r.json()
        const r_2  = r_1['result']
        return r_2
    } catch (e) {
        throw `Error in URL ${url}. ${e}`
    }
}

const getEthWalletTx = async (wallet: string, blockchainName: keyof typeof constObj, debug=false): Promise<walletProcessResult> => {
    console.log(`Now processing wallet ${wallet} on blockchain ${blockchainName}`)

    if (!(blockchainName in constObj)) {throw `${blockchainName} not in constObj keys ${Object.keys(constObj)}`}
    const chainConsts = constObj[blockchainName]

    const normalTx = getTxJson(chainConsts.getNormalTxUrl(wallet)).catch(e => {throw `Error getting normal transactions in wallet ${wallet} on chain ${blockchainName}. ${e}`})
    const internalTx = getTxJson(chainConsts.getInternalTxUrl(wallet)).catch(e => {throw `Error getting Internal transactions in wallet ${wallet} on chain ${blockchainName}`})
    const erc20Tx = getTxJson(chainConsts.getERC20TxUrl(wallet)).catch(e => {throw `Error getting ERC20 transactions in wallet ${wallet} on chain ${blockchainName}`})
    const erc721Tx = getTxJson(chainConsts.getERC721TxUrl(wallet)).catch(e => {throw `Error getting ERC721 transactions in wallet ${wallet} on chain ${blockchainName}`})

    const allTxTypes = await Promise.all([normalTx, internalTx, erc20Tx, erc721Tx]).then(t => t.flat())
    const allTx: processedTx[] = allTxTypes.map(t => processEthWalletTx(wallet, t)).filter((t): t is processedTx => t.txHash !== undefined)

    const result: walletProcessResult = {}
    result[wallet] = allTx

    return result
}

const processEthWalletTx = (wallet: string, rawTx: normalRawTx | internalRawTx | tokenERC20RawTx | tokenNFTRawTx): processedTx => {
    const tokenDecimal: number = (rawTx.tokenDecimal === undefined) ? 1 : (10 ** +rawTx.tokenDecimal)
    const amount: number = (rawTx.value === undefined) ? 1 : rawTx.value / tokenDecimal
    const gasPrice: number = (rawTx.gasPrice === undefined) ? 0 : rawTx.gasPrice
    const gasPaid: number = (rawTx.from === wallet) ?  gasPrice * +rawTx.gasUsed * (10 ** -18) : 0

    return {
        amount: amount,
        date: processTimestamp(+rawTx.timestamp),
        gasPaid: gasPaid,
        txHash: rawTx.hash,
        from: rawTx.from,
        to: rawTx.to,
        gasUsed: +rawTx.gasUsed
    }
}

export default getEthWalletTx