import {chainProcessResult, allProcessResult } from './blockchainExplorers/interfaces'
import constObj from './blockchainExplorers/ethScanLike/consts'
import dotenv from 'dotenv'
dotenv.config()

const processWalletsChain = async (chain: string, debug: boolean): Promise<chainProcessResult | undefined> => {

    // Interate through each chain
    const blockchainName: keyof typeof process.env = chain.split('_')[0].toLowerCase()
    const wallets: string[] | undefined = process.env[chain]?.split(',').filter(w => w.length > 5)

    debug && console.log(`Found ${wallets?.length} on blockchain ${chain} - ${blockchainName}. ${wallets}`)

    if (wallets === undefined) { console.log(`No wallets found`); return undefined }
    else {
        const txGetter = constObj[blockchainName]
        const result = await Promise.all(wallets.map(wallet => txGetter.getAllTxs(wallet)))
        return [blockchainName, Object.fromEntries(result)]
    }
    }

// Get all the wallets from the .env file
const processAll = async (debug = false): Promise<allProcessResult> => {
    const chainKeys: Array<string> = ['POLYGON_WALLETS']

    const allChainsResults = chainKeys
        .filter(ck => ck in process.env)
        .map(chain => processWalletsChain(chain, debug))

    const allResults: chainProcessResult[] = await Promise.all(allChainsResults)
        .then(p => p.filter((t): t is chainProcessResult => t !== undefined))

    return Object.fromEntries(allResults)
}

export default processAll