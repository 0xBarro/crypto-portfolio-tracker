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
    tokenName: string,
    tokenSymbol: string,
    tokenDecimal: number,
    value: number,
}

export interface internalRawTx extends baseTx {
    isError: string,
    input: string,
    errCode: string,
    traceId: string
}

export interface normalRawTx extends baseTx {
    tokenDecimal: number,
    transactionIndex: string,
    isError: string,
    txreceipt_status: string,
    input: string,
    cumulativeGasUsed: string,
    confirmations: string
}

export interface tokenERC20RawTx extends baseTx {
    tokenDecimal: number,
    nonce: string,
    transactionIndex: string,
    cumulativeGasUsed: string,
    input: string,
    confirmations: string
}

export interface tokenNFTRawTx  extends baseTx {
    nonce: string,
    tokenID: string,
    transactionIndex: string,
    cumulativeGasUsed: string,
    input: string,
    confirmations: string
}