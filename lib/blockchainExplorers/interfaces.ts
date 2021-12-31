interface walletProcessResult {
    wallet: string,
    txs: Array<processedTx>

}

interface chainProcessResult {
    chain: string,
    wallets: walletProcessResult
}

interface dateObj {
    dateStr: string,
    dateOnlyStr: string
    dateObj: Date,
    timestamp: number
}

interface processedTx {
    amount: number,
    date: dateObj,
    gasPaid: number,
    txHash: string,
    from: string,
    to: string,
}

interface processedSwap {
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

interface tokenCollection{
    totalValue: number,
    amount: number
}

interface tokenTx extends tokenCollection{
    unitPrice: number,
}

interface balanceAfterTx extends tokenCollection{}

export type {walletProcessResult, chainProcessResult, processedTx, processedSwap, dateObj}