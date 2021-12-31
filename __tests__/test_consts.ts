import constObj from "../lib/blockchainExplorers/ethScanLike/consts"

test('Test Polygon Object', () => {
    const polygon = constObj['polygon']
    expect(polygon.getNormalTxUrl('testW', 'token')).toBe("https://api.polygonscan.com/api?module=account&action=txlist&address=testW&startblock=1&endblock=99999999&sort=asc&apikey=token");
    expect(polygon.getTxUrl('tx')).toBe("https://polygonscan.com/tx/tx");
  });