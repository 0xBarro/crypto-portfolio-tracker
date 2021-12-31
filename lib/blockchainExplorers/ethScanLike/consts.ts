import dotenv from 'dotenv'
dotenv.config()

export const polygon = {
    getTxEndpointUrl(address: string, action: string, _token?: string): string {
        const token = (_token === undefined) ? process.env['POLYGONSCAN_KEY'] : _token // This is just to allow for the testing
        return `https://api.polygonscan.com/api?module=account&action=${action}&address=${address}&startblock=1&endblock=99999999&sort=asc&apikey=${token}`
    },
    getInternalTxUrl(address: string,  _token?: string): string {return this.getTxEndpointUrl(address, 'txlistinternal', _token)},
    getNormalTxUrl(address: string, _token?: string): string {return this.getTxEndpointUrl(address, 'txlist', _token)},
    getERC20TxUrl(address: string,  _token?: string): string {return this.getTxEndpointUrl(address, 'tokentx', _token)},
    getERC721TxUrl(address: string, _token?: string): string {return this.getTxEndpointUrl(address, 'tokenfttx', _token)},
    getTxUrl(tx: string): string {return `https://polygonscan.com/tx/${tx}`},
    getAddressUrl(address: string): string {return `https://polygonscan.com/address/${address}`}
}