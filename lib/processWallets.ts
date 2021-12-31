import processEthWallet from './blockchainExplorers/ethScanLike/processEthWallet'
import dotenv from 'dotenv'
dotenv.config()

interface chainProcess {
    [blockchainName: string]: CallableFunction
}

const chainProcessFunction: chainProcess = {
    polygon: processEthWallet
}

// Get all the wallets from the .env file
const processWallets = async (debug=false): Promise<Array<Promise<object>>> => {
    const chainKeys: Array<string> = ['POLYGON_WALLETS']

    return chainKeys.map(chain => {

        // Interate through each chain
        const blockchainName: keyof chainProcess = chain.split('_')[0].toLowerCase()
        const wallets: string|undefined = process.env[chain]

        if (wallets === undefined){return Promise.all([])} 
        else {
            const processFunction: CallableFunction = chainProcessFunction[blockchainName]
            return Promise.all(wallets.split(',').map(w => processFunction(w, chain, debug)))
        }
    })
} 

export default processWallets