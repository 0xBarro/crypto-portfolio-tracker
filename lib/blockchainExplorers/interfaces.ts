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
    capGains: string,
    unitPrice: number|undefined,
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
}

export interface buyQueueReg {dateStr: string, unitPrice: number|undefined, amount: number}

export interface buyQueueInt {
    [tokenCA: string]: buyQueueReg[]
}

export interface sellResult {capGains: number|undefined, buyList: buyQueueReg[]}


export interface tokenCollection{
    totalValue: number,
    amount: number
}

export interface tokenTx extends tokenCollection{
    unitPrice: number,
}

export interface balanceAfterTx extends tokenCollection{}