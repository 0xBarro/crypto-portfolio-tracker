export interface baseTx {
    blocknumber: string,
    timestamp: string,
    hash: string,
    gas: string,
    gasUsed: string
    from: string,
    to: string
    blockHash: string
    txType?: string,
    gasPrice?: number
    contractAddress: string
}

export interface internalRawTx extends baseTx {
    value: number,
    tokenDecimal: number,
    isError: string,
    input: string,
    errCode: string,
    traceId: string
}

export interface normalRawTx extends baseTx {
    tokenDecimal: number,
    value: number,
    transactionIndex: string,
    isError: string,
    txreceipt_status: string,
    input: string,
    cumulativeGasUsed: string,
    confirmations: string
}

export interface tokenERC20RawTx extends baseTx {
    tokenDecimal: number,
    value: number
    nonce: string,
    tokenName: string,
    tokenSymbol: string,
    transactionIndex: string,
    cumulativeGasUsed: string,
    input: string,
    confirmations: string
}

export interface tokenNFTRawTx  extends baseTx {
    nonce: string,
    tokenID: string,
    tokenName: string,
    tokenSymbol: string,
    transactionIndex: string,
    cumulativeGasUsed: string,
    input: string,
    confirmations: string
}