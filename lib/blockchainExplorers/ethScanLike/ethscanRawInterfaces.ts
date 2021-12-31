export interface baseTx {
    blocknumber: string,
    timestamp: string,
    hash: string,
    gas: string,
    gasUsed: string
    from: string,
    to: string
    txType?: string,
    value?: number,
    gasPrice?: number
    tokenDecimal?: string,
}

export interface internalRawTx extends baseTx {
    blockHash: string,
    isError: string,
    input: string,
    contractAddress: string,
    errCode: string,
    traceId: string
}

export interface normalRawTx extends baseTx {
    blockHash: string,
    transactionIndex: string,
    isError: string,
    txreceipt_status: string,
    input: string,
    contractAddress: string,
    cumulativeGasUsed: string,
    confirmations: string
}

export interface tokenERC20RawTx extends baseTx {
    nonce: string,
    blockHash: string,
    contractAddress: string,
    tokenName: string,
    tokenSymbol: string,
    transactionIndex: string,
    cumulativeGasUsed: string,
    input: string,
    confirmations: string
}

export interface tokenNFTRawTx  extends baseTx {
    nonce: string,
    blockHash: string,
    contractAddress: string,
    tokenID: string,
    tokenName: string,
    tokenSymbol: string,
    transactionIndex: string,
    cumulativeGasUsed: string,
    input: string,
    confirmations: string
}