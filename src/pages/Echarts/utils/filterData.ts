export const filterData = (data) => {
    let klines = data
    let list = klines.map((item, index: number) => {
        return {
            date: item[0],
            value: item[2]
        }
    })
    return list
}


// 