export interface coinList {
    id: string,
    symbol: string,
    name: string, 
    platforms: {platform: string}
}

export interface nameMapType {
    [chainName: string]: string
}

export interface processedCoinList {
    [chainName: string]: {
        [contractAddress: string]: {
            name: string,
            id: string,
            symbol: string,
            platforms: {
                [platform: string]: string
            }
        }
    }
}

export interface coinHistory {
    [date: string]: number
}

// export interface coinHistory {
//     [dateStr: string]: number
// }
