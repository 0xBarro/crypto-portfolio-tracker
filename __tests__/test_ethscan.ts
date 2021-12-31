import processEthWallet from "../lib/blockchainExplorers/ethScanLike/processEthWallet";

test('Test that the function gets all the transactions from a random wallet', async () => {
 const res = processEthWallet('0x00a563f9cD3B6bA70eDA8C5AE1DFfe3D79C5D8A4', 'polygon')
  });