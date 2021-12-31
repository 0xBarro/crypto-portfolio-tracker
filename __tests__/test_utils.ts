import {processTimestamp} from '../lib/utils'

test('Assert timestamp transform from Ethscan API', () => {
    const res = processTimestamp(1590858100)
    expect(res.dateStr).toBe('Sat, 30 May 2020 17:01:40 GMT')
    expect(res.dateOnly).toBe('30/5/2020')
    expect(Object.keys(res).length).toBe(3)
  });