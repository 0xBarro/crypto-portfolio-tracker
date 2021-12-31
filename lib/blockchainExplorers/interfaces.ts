interface walletProcessResult {
    wallet: string,
    txs: Array<processedTx>

}

interface chainProcessResult {
    chain: string,
    wallets: walletProcessResult
}

interface processedTx {
    amount: number,
    tokens: {token: tokenTx},
    date: {fullDateStr: string, dateOnlyStr: string},
    gasPaid: number,
    txHash: string,
    from: string,
    to: string,
    balanceAfterTx: {token: balanceAfterTx},
    valueAfterTx: number,
}

interface tokenCollection{
    totalValue: number,
    amount: number
}

interface tokenTx extends tokenCollection{
    unitPrice: number,
}

interface balanceAfterTx extends tokenCollection{}

export type {walletProcessResult, chainProcessResult}