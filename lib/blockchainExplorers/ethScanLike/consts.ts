import dotenv from 'dotenv'
dotenv.config()

export const polygon = {
    getTxEndpointUrl(address: string, action: string): string {
        const token = process.env['POLYGONSCAN_KEY']
        return `https://api.polygonscan.com/api?module=account&action=${action}&address=${address}&startblock=1&endblock=99999999&sort=asc&apikey=${token}`
    },
    getInternalTxUrl(address: string): string {return this.getTxEndpointUrl(address, 'txlistinternal')},
    getNormalTxUrl(address: string): string {return this.getTxEndpointUrl(address, 'txinternal')},
    getERC20TxUrl(address: string): string {return this.getTxEndpointUrl(address, 'tokentx')},
    getERC721TxUrl(address: string): string {return this.getTxEndpointUrl(address, 'tokenftt')}
}