import { walletProcessResult, processedTx, sellResult} from "../interfaces"
import buyQueue from "../buyQueue"
import { processTimestamp } from "../../utils"
import { normalRawTx, internalRawTx, tokenERC20RawTx, tokenNFTRawTx } from "./ethscanRawInterfaces"
import priceObj from "../../priceFeeds/consts"
import saveToCsv from "../../saveToCsv"

// This is the class used to download and process al  
export class EthTxGetter {

    getTxEndpointUrl: (address: string, action: string, _token?: string) => string
    getTxUrl: (tx: string) => string
    getAddressUrl: (address: string) => string
    getCurrentGasBalance: (address: string, gasToken: string) => Promise<number>
    getCurrentTokenBalance: (address: string, tokenCA: string, tokenName: string) => Promise<[string, number]>

    gasToken: string
    wrappedGasToken: string
    gasTokenCGId: string
    wrappedGasTokenAddress: string

    constructor(
        gasToken: string,
        wrappedGasToken: string,
        gasTokenCGId: string,
        wrappedGasTokenAddress: string,
        getTxEndpointUrl: (address: string, action: string, _token?: string) => string,
        getTxUrl: (tx: string) => string,
        getAddressUrl: (address: string) => string,
        getCurrentGasBalance: (address: string, gasToken: string) => Promise<number>,
        getCurrentTokenBalance: (address: string, tokenCA: string, tokenName: string) => Promise<[string, number]>) {
        this.gasTokenCGId = gasTokenCGId
        this.gasToken = gasToken
        this.wrappedGasToken = wrappedGasToken
        this.wrappedGasTokenAddress = wrappedGasTokenAddress
        this.getTxEndpointUrl = getTxEndpointUrl
        this.getTxUrl = getTxUrl
        this.getAddressUrl = getAddressUrl
        this.getCurrentGasBalance = getCurrentGasBalance
        this.getCurrentTokenBalance = getCurrentTokenBalance
    }

    getInternalTxUrl(address: string, _token?: string): string { return this.getTxEndpointUrl(address, 'txlistinternal', _token) }
    getNormalTxUrl(address: string, _token?: string): string { return this.getTxEndpointUrl(address, 'txlist', _token) }
    getERC20TxUrl(address: string, _token?: string): string { return this.getTxEndpointUrl(address, 'tokentx', _token) }
    getERC721TxUrl(address: string, _token?: string): string { return this.getTxEndpointUrl(address, 'tokennfttx', _token) }

    async getTxJson(url: string) {
        console.log('Loading data from: ' + url)
        try {
            const r = await fetch(url)
            const r_1 = await r.json()
            const r_2 = r_1['result']
            return r_2
        } catch (e) {
            throw `Error in URL ${url}. ${e}`
        }
    }

    async getInternalTxs(address: string, _token?: string): Promise<internalRawTx[]> {
        const internalRawTx: internalRawTx[] = await this.getTxJson(this.getInternalTxUrl(address, _token)).then(p => p.map((iTx: internalRawTx): internalRawTx => {
            iTx.tokenDecimal = 18
            iTx.tokenName = this.gasToken,
            iTx.tokenSymbol = this.gasToken,
            iTx.contractAddress = this.gasToken
            return iTx
        }))

        // Is unwrapping?. If it's receiving tokens from the wrapped token address, then it's unwrapping the token.
        const unWrapMaticTc: internalRawTx[] = internalRawTx
            .filter(nTx => nTx.from === this.wrappedGasTokenAddress)
            .map(nTx => {
                const wrapTokenTx = Object.assign({}, nTx)

                // Create the add WMATIC tx
                wrapTokenTx.from = nTx.to
                wrapTokenTx.to = nTx.from
                wrapTokenTx.contractAddress = this.wrappedGasTokenAddress
                wrapTokenTx.tokenName = this.wrappedGasToken,
                    wrapTokenTx.tokenSymbol = this.wrappedGasToken
                return wrapTokenTx
            })

        return internalRawTx.concat(unWrapMaticTc)
    }


    async getNormalTx(address: string, _token?: string): Promise<normalRawTx[]> {

        const normalRawtx: normalRawTx[] = await this.getTxJson(this.getNormalTxUrl(address, _token)).then(p => {
            return p.filter((nTx: normalRawTx) => nTx.txreceipt_status === '1')
             .map((nTx: normalRawTx): normalRawTx => {
                nTx.tokenDecimal = 18
                nTx.tokenName = this.gasToken,
                nTx.tokenSymbol = this.gasToken,
                nTx.contractAddress = this.gasToken
                return nTx
            })
        })

        // Is wrapping?. If it's sending to the wrapped token address, then it's wrapping the token.
        const wrapMaticTc: normalRawTx[] = normalRawtx
            .filter(nTx => nTx.to === this.wrappedGasTokenAddress)
            .map(nTx => {
                const wrapTokenTx = Object.assign({}, nTx)

                // Create the add WMATIC tx
                wrapTokenTx.from = nTx.to
                wrapTokenTx.to = nTx.from
                wrapTokenTx.contractAddress = this.wrappedGasTokenAddress
                wrapTokenTx.tokenName = this.wrappedGasToken,
                wrapTokenTx.tokenSymbol = this.wrappedGasToken
                return wrapTokenTx
            })

        return normalRawtx.concat(wrapMaticTc)
    }

    getERC20Txs(address: string, _token?: string): Promise<tokenERC20RawTx[]> {
        return this.getTxJson(this.getERC20TxUrl(address, _token))
    }

    async getERC721Txs(address: string, _token?: string): Promise<tokenNFTRawTx[]> {
        const p = await this.getTxJson(this.getERC721TxUrl(address, _token))
        return p.map((nftTx: tokenNFTRawTx): tokenNFTRawTx => { nftTx.value = 1; return nftTx })
    }

    async getAllTxs(address: string, _token?: string): Promise<walletProcessResult> {

        const buyQ: buyQueue= new buyQueue()

        const allTx = await Promise.all([
            this.getNormalTx(address, _token),
            this.getInternalTxs(address, _token),
            this.getERC20Txs(address, _token),
            this.getERC721Txs(address, _token),
        ]).then(p => p.flat())

        const processedAllTx = []
        allTx.sort((l, r) => +l.timeStamp - +r.timeStamp)

        for (let i=0; i < allTx.length; i++) {
            const rTx = allTx[i]
            processedAllTx.push(await processEthWalletTx(address, rTx, this.gasToken, this.gasTokenCGId, buyQ))
        }

        // Save file to csv-
        saveToCsv(processedAllTx, `${address}.csv`)

        const tokensNameCAMap = Object.fromEntries(
            processedAllTx.map(t => [t.contractAddress, t.tokenName])
        ) 

        // TODO: Get current balance for every token
        // const allTokensCurrentBalance: [string, number][] = await Promise.all(Object.entries(tokensNameCAMap).map(([tokenCA, tokenName]) => this.getCurrentTokenBalance(address, tokenCA, tokenName)))
        // const allTokensCurrentBalanceObj = Object.fromEntries(allTokensCurrentBalance)

        // allTokensCurrentBalanceObj[this.gasToken] = await this.getCurrentGasBalance(address, this.gasToken)
        // console.log(allTokensCurrentBalance)

        return [address, processedAllTx]
    }

    async getCurrentWalletBalance(address: string, tokenList: Set<String>): Promise<{[token: string]: number}> {
        return {}
    }
}

const processEthWalletTx = async (wallet: string, rawTx: normalRawTx | internalRawTx | tokenERC20RawTx | tokenNFTRawTx, gasToken: string, gasTokenCGId: string, buyQ: buyQueue): Promise<processedTx> => {
    const tokenDecimal: number = (rawTx.tokenDecimal === undefined) ? 1 : (10 ** -rawTx.tokenDecimal)
    const amount: number = (rawTx.value === undefined) ? 1 : rawTx.value * tokenDecimal // For NFT transactionst here is no value field
    const gasPrice: number = (rawTx.gasPrice === undefined) ? 0 : rawTx.gasPrice
    const gasPaid: number = (rawTx.from === wallet) ?  gasPrice * +rawTx.gasUsed * (10 ** -18) : 0
    const {dateStr, dateOnlyStr, timestamp} = processTimestamp(+rawTx.timeStamp)

    let valueSign = 0
    if (rawTx.to === wallet) {valueSign =  1}
    else if (rawTx.from === wallet) {valueSign = -1}
    else {throw `Transaction does not contain wallet ${wallet}`}

    const isGasTokenTx = rawTx.tokenName === gasToken
    const unitPrice = (isGasTokenTx) ? priceObj.getTokenPriceID(gasTokenCGId, dateOnlyStr) : priceObj.getTokenPriceCA(gasToken.toLowerCase(), rawTx.contractAddress, dateOnlyStr)

    let capGains: sellResult = {capGains: undefined, buyList: [], costBasis: undefined}
    if (valueSign === 1) {
        buyQ.addBuy(rawTx.contractAddress, dateStr, amount, await unitPrice)
    }
    else {
        capGains = buyQ.calcGainsSell(rawTx.contractAddress, dateStr, amount, await unitPrice)
    }

    // TODO: Process the swaps
    // TODO: Merge with coingecko API
    // TODO: Identify swap type
    // TODO: Calculate Gains

    return {
        capGains: capGains['capGains'],
        buyList: JSON.stringify(capGains?.buyList),
        amount: valueSign * amount,
        timestamp: timestamp,
        contractAddress: rawTx.contractAddress,
        unitPrice: await unitPrice,
        dateStr: dateStr,
        dateOnlyStr: dateOnlyStr,
        gasPaid: gasPaid,
        txHash: rawTx.hash,
        from: rawTx.from,
        to: rawTx.to,
        gasUsed: +rawTx.gasUsed,
        tokenName: rawTx.tokenName,
        tokenSymbol: rawTx.tokenSymbol
    }
}

export default EthTxGetter