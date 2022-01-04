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
    unitPrice: number|undefined,
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
}

export interface processedSwap {
    amount: number,
    tokens: {token: tokenTx},
    date: dateObj,
    gasPaid: number,
    txHash: string,
    from: string,
    to: string,
    balanceAfterTx: {token: balanceAfterTx},
    valueAfterTx: number 
}

export interface tokenCollection{
    totalValue: number,
    amount: number
}

export interface tokenTx extends tokenCollection{
    unitPrice: number,
}

export interface balanceAfterTx extends tokenCollection{}