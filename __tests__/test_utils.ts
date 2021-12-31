import {processTimestamp} from '../lib/utils'

test('Assert timestamp transform from Ethscan API', () => {
    const res = processTimestamp(1590858100)
    expect(res.dateStr).toBe('5/30/2020, 6:01:40 PM')
  });