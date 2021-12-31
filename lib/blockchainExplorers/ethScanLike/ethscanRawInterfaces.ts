interface baseTx {
    blocknumber: string,
    timestamp: string,
    hash: string,
    gas: string,
    gasUsed: string
    from: string,
    to: string
}

export interface internalRawTx extends baseTx {
    blockHash: string,
    value: string,
    isError: string,
    input: string,
    contractAddress: string,
    errCode: string,
    traceId: string
}

export interface normalRawTx extends baseTx {
    blockHash: string,
    transactionIndex: string,
    value: string,
    gasPrice: string,
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
    value: string,
    tokenName: string,
    tokenSymbol: string,
    tokenDecimal: string,
    transactionIndex: string,
    gasPrice: string,
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
    tokenDecimal: string,
    transactionIndex: string,
    gasPrice: string,
    cumulativeGasUsed: string,
    input: string,
    confirmations: string
}