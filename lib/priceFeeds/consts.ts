import {listCoins, getCoinHistory, getTokenPriceAtDate} from './coinGecko'
import { coinHistory, processedCoinList } from './interfaces'


const coinList = listCoins()
const _coinstPricePerID: {[id: string]: coinHistory} = {}

const priceObj = {
    coinstPricePerID: _coinstPricePerID, // Currently fetched coin List
    async updatePriceId(tokenId: string): Promise<void> {
        if (!(tokenId in this.coinstPricePerID)){
            this.coinstPricePerID[tokenId] = await getCoinHistory(tokenId)
        }
    },
    async getIdFromCA(chain: string, tokenCA: string): Promise<string|undefined> {return  (await coinList)[chain][tokenCA]?.id},
    async getTokenPriceCA(chain: string, tokenCA: string, dateStr: string): Promise<number|undefined> {
        // Check the ID corresponding to the Smart Contract Address
        const tokenId = await this.getIdFromCA(chain, tokenCA)
        if (tokenId === undefined) {return undefined}
        else{return this.getTokenPriceID(tokenId, dateStr)}
    },
    async getTokenPriceID(tokenId: string, dateStr: string): Promise<number|undefined>  {
        await this.updatePriceId(tokenId) // Update the token Price list
        const priceAtDate: number|undefined =  getTokenPriceAtDate(this.coinstPricePerID[tokenId], dateStr)
        return priceAtDate
    }
}

export default priceObj