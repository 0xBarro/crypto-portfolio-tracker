import getEthWalletTx from './blockchainExplorers/ethScanLike/processEthWallet'
import { walletProcessResult, chainProcessResult, processedTx, allProcessResult, walletProcessFunc } from './blockchainExplorers/interfaces'
import dotenv from 'dotenv'
dotenv.config()

const chainProcessFunction: {[chain: string]: walletProcessFunc} = {
    polygon: getEthWalletTx
}

const processWalletsChain = async (chain: string, debug: boolean): Promise<chainProcessResult | undefined> => {

    // Interate through each chain
    const blockchainName: keyof typeof process.env = chain.split('_')[0].toLowerCase()
    const wallets: string[] | undefined = process.env[chain]?.split(',').filter(w => w.length > 5)

    debug && console.log(`Found ${wallets?.length} on blockchain ${chain} - ${blockchainName}. ${wallets}`)

    if (wallets === undefined) { console.log(`No wallets found`); return undefined }
    else {
        const processFunction: CallableFunction = chainProcessFunction[blockchainName]
        const chainResult: walletProcessResult[] = await Promise.all(wallets.map(w => processFunction(w, blockchainName, debug)))
        return {chain: blockchainName, wallets: chainResult}
    }
}

// Get all the wallets from the .env file
const processAll = async (debug = false): Promise<allProcessResult> => {
    const chainKeys: Array<string> = ['POLYGON_WALLETS']

    const allChainsResults = chainKeys
        .filter(ck => ck in process.env)
        .map(chain => processWalletsChain(chain, debug))

    const allResults = await Promise.all(allChainsResults)
        .then(p => p.filter((t): t is chainProcessResult => t !== undefined).map(p => [p.chain, p.wallets]))

    return Object.fromEntries(allResults)
}

export default processAll