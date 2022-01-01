import getEthWalletTx from './blockchainExplorers/ethScanLike/processEthWallet'
import { walletProcessResult, chainProcessResult, processedTx, allProcessResult, walletProcessFunc } from './blockchainExplorers/interfaces'
import dotenv from 'dotenv'
dotenv.config()

const chainProcessFunction: {[chain: string]: walletProcessFunc} = {
    polygon: getEthWalletTx
}

const processWalletsChain = async (chain: string, debug: boolean): Promise<chainProcessResult | undefined> => {

    const wallets: string[] | undefined = process.env[chain]?.split(',').filter(w => w.length > 5)

    if (wallets === undefined) { return undefined }
    else {
        const processFunction: CallableFunction = chainProcessFunction[chain]
        const chainResult: walletProcessResult[] = await Promise.all(wallets.map(w => processFunction(w, chain, debug)))
        return {chain: chain, wallets: chainResult}
    }
}

// Get all the wallets from the .env file
const processAll = async (debug = false): Promise<allProcessResult> => {
    const chainKeys: Array<string> = ['POLYGON_WALLETS']

    const allChainsResults = chainKeys
        .filter(ck => ck in process.env)
        .map(chain => {
            debug && console.log('Now processing chain: ' + chain)

            // Interate through each chain
            const blockchainName: keyof typeof process.env = chain.split('_')[0].toLowerCase()
            return processWalletsChain(blockchainName, debug)
        })

    const allResults = await Promise.all(allChainsResults)
        .then(p => p.filter((t): t is chainProcessResult => t !== undefined).map(p => [p.chain, p.wallets]))

    return Object.fromEntries(allResults)
}

export default processAll