import fs from 'fs'
import { coinList } from '../lib/priceFeeds/interfaces'
import { processCoinsList } from '../lib/priceFeeds/coinGecko'

test('Test processCoinsList', async () => {
    const testFilePath = '__tests__/testFiles/coinGecko/processCoinsList.json'
    const file: coinList[] = JSON.parse((fs.readFileSync(testFilePath).toString()))
    const processedFile = processCoinsList(file)

    expect(processedFile['platform1']).toStrictEqual({
        '0x123': {
            name: 'TestCoin1Name',
            id: 'TestCoin1',
            symbol: 'TestCoint1Symbol',
            platforms: { platform1: '0x123', platform2: '0x1234'}
        },
        '0x1234': {
            name: 'TestCoin2Name',
            id: 'TestCoin2',
            symbol: 'TestCoint2Symbol',
            platforms: { platform1: '0x1234'}
        }
    })
})