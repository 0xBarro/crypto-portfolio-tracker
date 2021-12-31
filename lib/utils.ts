const getJson = async (url: string): Promise<JSON> => {
    return fetch(url).then(r => r.json())
}

const dateToDateStr = (date: Date): string => {
    return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`
}

const processTimestamp = (timestamp: number, mult=1000): {dateObj: Date, dateStr: string, dateOnly: string} => {
    const dateObj =  new Date(timestamp*mult)
    const dateStr =  dateObj.toUTCString()  
    return {dateObj: dateObj, dateStr: dateStr, dateOnly: dateToDateStr(dateObj)}
}

export {getJson, processTimestamp}