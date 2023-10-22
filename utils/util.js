const formatTime = date => {
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()
    const hour = date.getHours()
    const minute = date.getMinutes()
    const second = date.getSeconds()

    return `${[year, month, day].map(formatNumber).join('/')} ${[hour, minute, second].map(formatNumber).join(':')}`
}

const formatNumber = n => {
    n = n.toString()
    return n[1] ? n : `0${n}`
}

async function myrequest(url, method, data = {}, timeout = 20000) {
    return await new Promise((resolve, reject) => {
        wx.request({
            url,
            method,
            data,
            header: {
                'content-type': 'application/json'
            },
            timeout,
            success: res => {
                resolve(res.data)
            },
            fail: (err) => {
                err.from = "myrequest"
                err.url = url
                reject(err)
            }
        })
    })
}

module.exports = {
    formatTime,
    myrequest
}