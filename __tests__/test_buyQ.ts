import buyQueue from "../lib/blockchainExplorers/buyQueue"

test('Test the buyQ results', async () => {
    const buyQ = new buyQueue()

    const tokenCA = 'buyTokenCA'
    buyQ.addBuy(tokenCA, '01/01/2000', 100, 1)
    expect(tokenCA in buyQ.buyHist).toBeTruthy()

    const res = buyQ.calcGainsSell(tokenCA, '01/02/2000', 50, 2)
    expect(res.capGains).toBe(100)

})
