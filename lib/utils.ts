import { dateObj } from "./blockchainExplorers/interfaces"

const dateToDateStr = (date: Date): string => {
    return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`
}

const processTimestamp = (timestamp: number, mult=1000): dateObj => {
    const dateObj =  new Date(timestamp*mult)
    const dateStr =  dateObj.toUTCString()  
    return {dateStr: dateStr, dateOnlyStr: dateToDateStr(dateObj), timestamp: timestamp}
}

export {processTimestamp}

