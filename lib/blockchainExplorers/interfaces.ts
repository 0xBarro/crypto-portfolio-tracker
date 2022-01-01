import constObj from "./ethScanLike/consts"

export type walletProcessFunc = (wallet: string, blockchainName: keyof typeof constObj, debug: boolean) =>  Promise<walletProcessResult>

export interface walletProcessResult {
    wallet: string,
    txs: processedTx[]
}

export interface chainProcessResult {
    chain: string,
    wallets: walletProcessResult[]
}

export interface allProcessResult {
    [chain: string]: walletProcessResult[]
}

export interface dateObj {
    dateStr: string,
    dateOnlyStr: string
    dateObj: Date,
    timestamp: number
}

export interface processedTx {
    amount: number,
    date: dateObj,
    gasPaid: number,
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