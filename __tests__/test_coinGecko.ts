import fs from 'fs'
import {coinList} from '../lib/priceFeeds/interfaces'
import {processCoinsList} from '../lib/priceFeeds/coinGecko'

test('Test processCoinsList', async () => {
    const testFilePath = '__tests__/testFiles/coinGecko/processCoinsList.json'
    const file = JSON.parse((fs.readFileSync(testFilePath).toString()))
    const processedFile = processCoinsList(file)
    console.log(processedFile)
})