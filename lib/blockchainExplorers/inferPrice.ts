import { normalRawTx, internalRawTx, tokenERC20RawTx, tokenNFTRawTx } from "./ethScanLike/ethscanRawInterfaces"
import { processedTx, taggedTx, taggedTxs, token, txFlow } from "./interfaces"

export const swap =  (): taggedTx  => {
    return {
        flow() {
            const res: txFlow = {tokensIn: new Set(), 
                                 tokensOut: new Set(), 
                                 get nTotalTokens() {return this.tokensIn.size, this.tokensOut.size}, 
                                 defValueIn: 0, 
                                 defValueOut: 0, 
                                 get defTotalValue() {
                                     if (this.defValueIn === undefined && this.defValueOut === undefined) {return undefined}
                                     else {
                                        return [this.defValueIn, this.defValueOut].filter((v): v is number => !(v === undefined)).reduce((l, r) => l + r)
                                     }}
                                }
            // Fill the object 
            this.tokens.forEach((token: token): void  => { 
                if (token.amount < 0) {
                    res.tokensOut.add(token.tokenName)

                } else {
                    res.tokensIn.add(token.tokenName)
                }
            })
            return res},
        type: undefined,
        tokens: [],
        balanceAfterTx: {}
    }
}

export const inferTxType = (tx: taggedTx): string|undefined => {
    // Infer the swap type
    return undefined
}

const txTagger = (processedTx: processedTx[]): processedTx[] => {
    const aggregatedTx: {[txHash: string]: taggedTx} = {}
    
    // Build the aggregated tx object
    processedTx.forEach( tx => {
        if (!(tx.txHash in aggregatedTx)){
            aggregatedTx[tx.txHash] = swap()

        }})

    // Insert the infered prices on the initial object

    return processedTx
}

export default txTagger