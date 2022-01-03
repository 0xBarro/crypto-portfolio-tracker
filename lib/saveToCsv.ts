import fs from 'fs'
import path from 'path/posix'
import { processedTx } from './blockchainExplorers/interfaces'

const saveToCsv = (obj: processedTx[], fileName: string, outputFolder='output'): void => {

    // Create the folder
    if (!fs.existsSync(outputFolder)){
        console.log('Creating folder: ' + outputFolder)
        fs.mkdirSync(outputFolder)
    }

    // Delete file if it exists
    const fullFilePath = path.join(outputFolder, fileName)

    if (!fs.existsSync(fullFilePath)){
        console.log('Removing file: ' + fullFilePath)
    }

    //  Save the columns
    const columnsToSave = Object.keys(obj[0])
    fs.writeFileSync(fullFilePath, columnsToSave.reduce((l, r) => l + ',' + r) + '\n')

    obj.forEach(e => {
        const rowToSave = Object.values(e).reduce((l, r) => l + ',' + r) + '\n'
        fs.appendFileSync(fullFilePath, rowToSave)
    })

}

export default saveToCsv