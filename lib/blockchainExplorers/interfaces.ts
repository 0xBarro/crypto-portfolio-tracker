import constObj from "./ethScanLike/consts"

export type walletProcessFunc = (wallet: string, blockchainName: keyof typeof constObj, debug: boolean) =>  Promise<walletProcessResult>

export type walletProcessResult  = [string, processedTx[]]

export type chainProcessResult = [string, {[wallet: string]: processedTx[]}]

export interface allProcessResult {
    [chain: string]: {[wallet: string]: processedTx[]}
}

export interface dateObj {
    dateStr: string,
    dateOnlyStr: string
    timestamp: number
}

export interface processedTx {
    unitPrice: number|null,
    contractAddress: string,
    timestamp: number,
    dateStr: string,
    dateOnlyStr: string,
    amount: number,
    tokenName: string,
    tokenSymbol: string,
    gasPaid: number,
    gasUsed: number,
    txHash: string,
    from: string,
    to: string,
    txType?: string
}

export interface processedTxWGains extends processedTx {
    buysList: sellResult,
    capGains: number|null,
    unitCostBasis: number|null,
    balanceAfterTx: {[token: string]: token}
}

export interface buyQueueReg {dateStr: string, unitPrice: number|undefined, amount: number}

export interface buyQueueInt {
    [tokenCA: string]: buyQueueReg[]
}

export interface sellResult {capGains: number|undefined, buyList: buyQueueReg[], costBasis: number|undefined}


export interface token{
    tokenExplorerLink: string,
    tokenName: string,
    tokenSymbol: string,
    tokenCA: string,
    totalValue?: number,
    amount: number
    unitPrice?: number
}

export interface txFlow {
    tokensIn: Set<string>,
    tokensOut: Set<string>, 
    nTotalTokens: number, 
    defValueIn: number|undefined, 
    defValueOut: number|undefined, 
    defTotalValue: number|undefined
}

export interface taggedTx {
    flow(): txFlow,
    type: string|undefined,
    tokens: token[],
    balanceAfterTx: {[token: string]: token}
}

export interface taggedTxs {
    [txHash: string]: taggedTx
}