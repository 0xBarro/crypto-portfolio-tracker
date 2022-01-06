import buyQueue from "../lib/blockchainExplorers/buyQueue"
import { buyQueueReg } from "../lib/blockchainExplorers/interfaces"

const totalTokenAmount = (bq: buyQueueReg[]): number => {
    return bq.map(e => e.amount).reduce((l, r) => l + r)
}

test('Test the buyQ results1', async () => {
    const buyQ = new buyQueue()

    const tokenCA = 'buyTokenCA'
    buyQ.addBuy(tokenCA, '01/01/2000', 100, 1)
    buyQ.addBuy(tokenCA, '02/01/2000', 100, 1)
    buyQ.addBuy(tokenCA, '03/01/2000', 100, 1)
    expect(tokenCA in buyQ.buyHist).toBeTruthy()
    expect(totalTokenAmount(buyQ.buyHist[tokenCA])).toBe(300)

    const res = buyQ.calcGainsSell(tokenCA, '01/02/2000', 50, 2)
    expect(totalTokenAmount(buyQ.buyHist[tokenCA])).toBe(250)
    expect(res.capGains).toBe(50)
})