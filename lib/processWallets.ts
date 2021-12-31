import processEthWallet from './blockchainExplorers/ethScanLike/processEthWallet'
import { walletProcessResult, chainProcessResult } from './blockchainExplorers/interfaces'
import dotenv from 'dotenv'
dotenv.config()

const chainProcessFunction: chainProcess = {
    polygon: processEthWallet
}

const processWalletsChain = async (chain: string): Promise<chainProcessResult> => {

    const wallets: Array<string> | undefined = process.env[chain]?.split(',').filter(w => w.length > 5)

    if (wallets === undefined) { return undefined }
    else {
        const processFunction: CallableFunction = chainProcessFunction[blockchainName]
        const chainResult: Promise<Array<number>> = Promise.all(wallets.map(w => processFunction(w, blockchainName, debug)))
        return chainResult
    }
}

// Get all the wallets from the .env file
const processAll = (debug = false): Promise<{ chain: string, wallets: { wallet: string, txs: Array<object> } }> => {
    const chainKeys: Array<string> = ['POLYGON_WALLETS']

    const allChainsResults = chainKeys.filter(ck => ck in process.env).map(chain => {

        // Interate through each chain
        const blockchainName: keyof typeof process.env = chain.split('_')[0].toLowerCase()


    })

    const allWallsts = Promise.all(allChainsResults).then(p => [...p.filter(k => k !== undefined)])
    return allWallsts
}

export default processWallets