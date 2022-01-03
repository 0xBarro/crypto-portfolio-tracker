import { processTimestamp} from "../utils";
import { coinList, processedCoinList, nameMapType, coinHistory } from "./interfaces";


export const listCoins = async (): Promise<processedCoinList> => {
    const url = "https://api.coingecko.com/api/v3/coins/list?include_platform=true"
    const r: Array<coinList> = await fetch(url).then(r => r.json())

    return processCoinsList(r)
}

// Platform name map
export const platformNameMap: nameMapType = {
    "polygon-pos": 'polygon',
    "harmony-shard-0": 'harmony'
}

export const processCoinsList = (coinsList: coinList[]): processedCoinList => {
    const contractDict: processedCoinList = {} // Stores tokens by platform, by contract address. If there is not contract address, then stores id

    // Cycle through each listed platform
    coinsList.forEach(e => {

        const platforms: {[platform: string]: string} = e.platforms
        const platformsKeys = Object.keys(platforms)
        platformsKeys.forEach(p => {

            // Create platform key if it does not exist
            const p_name: string = (p in platformNameMap) ? platformNameMap[p] : p
            if (!(p_name in contractDict)) {contractDict[p_name] = {}}

            const contractAddress = platforms[p]
            
            contractDict[p_name][contractAddress] = {
                name: e.name,
                id: e.id,
                symbol: e.symbol,
                platforms: e.platforms
            }
            
        })
    });

    return contractDict
}

export const getCoinHistory = async (token: string, currency='eur', days=365): Promise<coinHistory> => {
    const url = `https://api.coingecko.com/api/v3/coins/${token}/market_chart?vs_currency=${currency}&days=${days}`
    const r: Array<[number, number]> = await fetch(url).then(r => r.json()).then(x => x['prices'])
    const processedResult:coinHistory = Object.fromEntries(r.map(p => [processTimestamp(p[0], 1).dateStr, p[1]]))
    return processedResult
}

export const getTokenPriceAtDate = (tokenHistory: coinHistory, dateStr: string): number | undefined => {
    if (dateStr in tokenHistory){return tokenHistory[dateStr]}
    else {return undefined}
}