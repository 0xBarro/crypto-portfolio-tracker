import {processTimestamp} from '../lib/utils'

test('Assert timestamp transform from Ethscan API', () => {
    const testTimestamp = 1590858100
    const res = processTimestamp(testTimestamp)
    expect(res.dateStr).toBe('Sat, 30 May 2020 17:01:40 GMT')
    expect(res.dateOnlyStr).toBe('30/5/2020')
    expect(res.timestamp).toBe(testTimestamp)
    expect(Object.keys(res).length).toBe(3)
  });