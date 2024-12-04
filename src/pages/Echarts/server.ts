import { request } from "@umijs/max";

// code: cn_000858
// start: 20240801
// end: 20241129
// stat: 1
// order: D
// period: d
// callback: historySearchHandler
// rt: jsonp
// r: 0.29094710759823506
// 0.6761753416533396: 



export const getDataFromSouHu = async (values) => {
    return await request(
        '/api/q.stock.sohu.com/hisHqm', {
        method: 'get',
        params: values
    }).then(res => {
        return res
    })
}

// https://hqm.stock.sohu.com/getqjson?code=cn_000858&cb=fortune_hq_cn&_=1732931203438



// https://q.stock.sohu.com/app1/stockSearch?method=search&callback=searchBox1.output&type=all&keyword=00001&_=1732931185948
export const getName = async (code) => {
    return await request(
        '/dapi/app1/stockSearch', {
        method: 'get',
        params: {
            method: 'search',
            callback: null,
            keyword: code,
            type: 'all'
        },
    }
    ).then(res => {
        let result = res.replaceAll('searchStock_cb(', '').replaceAll(')', '');
        return JSON.parse(result)
    })
}


