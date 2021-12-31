import constObj from "./consts"
import { getJson } from "../../utils"

const processEthWallet = async (wallet: string, blockchainName: keyof typeof constObj, debug=false): Promise<object> => {
    console.log(`Now processing wallet ${wallet} on blockchain ${blockchainName}`)
    const chainConsts = constObj[blockchainName]

    const normalTx = getJson(chainConsts.getNormalTxUrl(wallet))
    const internalTx = getJson(chainConsts.getInternalTxUrl(wallet))
    const erc20Tx = getJson(chainConsts.getERC20TxUrl(wallet))
    const erc721Tx = getJson(chainConsts.getERC721TxUrl(wallet))

    return {}
}

export default processEthWallet