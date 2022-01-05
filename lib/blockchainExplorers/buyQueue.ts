import { buyQueueInt, buyQueueReg, sellResult} from "./interfaces"

class buyQueue {
    buyHist: buyQueueInt = {}
    amountLim = 0.0001

    addBuy(tokenCA: string, dateStr: string, amount: number, unitPrice: number|undefined): void {   
         if (!(tokenCA in this.buyHist)) {
             this.buyHist[tokenCA] = []
         }
         this.buyHist[tokenCA].push({amount: amount, unitPrice: unitPrice, dateStr: dateStr})
     }

     calcGainsSell(tokenCA: string, dateStr: string, amountSell: number, priceSell: number|undefined): sellResult {
         if (!(tokenCA in this.buyHist)){throw `Attempting to sell ${amountSell} Token ${tokenCA} with no buy History.  `}

         const result: sellResult = {capGains: 0, buyList: []}

         let amountLeftToSell = amountSell
         while (amountLeftToSell > this.amountLim) {
            if (this.buyHist[tokenCA].length === 0) {throw `Now more tokens left to sell for tokenCA ${tokenCA} with ${amountLeftToSell} left to sell.`}
            const {amount, dateStr, unitPrice} = this.buyHist[tokenCA][0]

            const amountSold = Math.min(amountLeftToSell, amount)
            const deltaPrice: number | undefined = (priceSell === undefined ||unitPrice === undefined ) ? undefined : priceSell - unitPrice  
            const capGains: number | undefined = (deltaPrice === undefined) ? undefined : deltaPrice * amountSold

            result.buyList.push({amount: amountSold, dateStr: dateStr, unitPrice: unitPrice})
            result.capGains = (capGains === undefined || result.capGains === undefined) ? undefined : result.capGains + capGains

            if (amountSold >= amount) {
                amountLeftToSell -= amountSold
                this.buyHist[tokenCA] = this.buyHist[tokenCA].slice(1)
            } else {
                amountLeftToSell = 0
                this.buyHist[tokenCA][0].amount -= amountSold
            }
            
         }

         return result
     }
}

export default buyQueue
