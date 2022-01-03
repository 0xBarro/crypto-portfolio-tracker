import constObj from "./consts"
import { walletProcessResult, processedTx } from "../interfaces"
import { processTimestamp } from "../../utils"
import { normalRawTx, internalRawTx, tokenERC20RawTx, tokenNFTRawTx } from "./ethscanRawInterfaces"
import internal from "stream"

// This is the class used to download and process al  
export class EthTxGetter {

    getTxEndpointUrl: (address: string, action: string, _token?: string) => string
    getTxUrl: (tx: string) => string
    getAddressUrl: (address: string) => string

    gasToken: string
    wrappedGasToken: string
    wrappedGasTokenAddress: string

    constructor(
        gasToken: string,
        wrappedGasToken: string,
        wrappedGasTokenAddress: string,
        getTxEndpointUrl: (address: string, action: string, _token?: string) => string,
        getTxUrl: (tx: string) => string,
        getAddressUrl: (address: string) => string) {
        this.gasToken = gasToken
        this.wrappedGasToken = wrappedGasToken
        this.wrappedGasTokenAddress = wrappedGasTokenAddress
        this.getTxEndpointUrl = getTxEndpointUrl
        this.getTxUrl = getTxUrl
        this.getAddressUrl = getAddressUrl
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
            iTx.tokenName = 'Matic',
                iTx.tokenSymbol = 'Matic',
                iTx.contractAddress = ''
            return iTx
        }))

        // Is unwrapping?. If it's receiving tokens from the wrapped token address, then it's unwrapping the token.
        const wrapMaticTc: internalRawTx[] = internalRawTx
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

        return internalRawTx
    }


    async getNormalTx(address: string, _token?: string): Promise<normalRawTx[]> {

        const normalRawtx: normalRawTx[] = await this.getTxJson(this.getNormalTxUrl(address, _token)).then(p => {
            return p.filter((nTx: normalRawTx) => nTx.txreceipt_status === '1')
             .map((nTx: normalRawTx): normalRawTx => {
                nTx.tokenDecimal = 18
                nTx.tokenName = 'Matic',
                nTx.tokenSymbol = 'Matic',
                nTx.contractAddress = ''
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

        return normalRawtx.concat(normalRawtx)
    }

    getERC20Txs(address: string, _token?: string): Promise<tokenERC20RawTx[]> {
        return this.getTxJson(this.getERC20TxUrl(address, _token))
    }

    getERC721Txs(address: string, _token?: string): Promise<tokenNFTRawTx[]> {
        return this.getTxJson(this.getERC721TxUrl(address, _token)).then(p => p.map((nftTx: tokenNFTRawTx): tokenNFTRawTx => {nftTx.value = 1; return nftTx}))
    }

    async getAllTxs(address: string, _token?: string): Promise<walletProcessResult> {
        const allTx = Promise.all([
            this.getNormalTx(address, _token),
            this.getInternalTxs(address, _token),
            this.getERC20Txs(address, _token),
            this.getERC721Txs(address, _token),
        ]).then(p => p.flat().map(rTx => processEthWalletTx(address, rTx)))

        return [address, await allTx]
    }
}


const processEthWalletTx = (wallet: string, rawTx: normalRawTx | internalRawTx | tokenERC20RawTx | tokenNFTRawTx): processedTx => {
    const tokenDecimal: number = (rawTx.tokenDecimal === undefined) ? 1 : (10 ** -rawTx.tokenDecimal)
    const amount: number = (rawTx.value === undefined) ? 1 : rawTx.value * tokenDecimal // For NFT transactionst here is no value field
    const gasPrice: number = (rawTx.gasPrice === undefined) ? 0 : rawTx.gasPrice
    const gasPaid: number = (rawTx.from === wallet) ?  gasPrice * +rawTx.gasUsed * (10 ** -18) : 0

    // TODO: Fix amount for gas token because there is not tokenDecimal field
    // TODO: Infer Matic/WMATIC transactions
    // TODO: Process the swaps
    // TODO: Merge with coingecko API
    // TODO: Identify swap type
    // TODO: Calculate Gains

    return {
        amount: amount,
        date: processTimestamp(+rawTx.timestamp),
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