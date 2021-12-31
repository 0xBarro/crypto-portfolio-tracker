const getJson = async (url: string): Promise<JSON> => {
    return fetch(url).then(r => r.json())
}

const processTimestamp = (timestamp: number, mult=1000, onlyDate=false): {dateObj: Date, dateStr: string} => {
    const dateObj =  new Date(timestamp*mult)
    const dateStr = (onlyDate) ? dateObj.toLocaleDateString() : dateObj.toLocaleString()
    return {dateObj: dateObj, dateStr: dateStr}
}

export {getJson, processTimestamp}