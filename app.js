// app.js
const { myrequest, formatTime } = require("./utils/util")
const ip = "http://localhost:3000"
// const ip = "http://172.20.10.2:3000"
// const ip = "https://chengxuxiao.top"

App({
    onLaunch() {
        this.loadFont()

        this.login()
    },

    // 加载全局字体
    loadFont(){
        wx.loadFontFace({
            global: true,
            family: 'Source Han Sans CN',
            source: 'url("https://somebodycc.github.io/SourceHanSansCN-Regular.otf")'
        })
        wx.loadFontFace({
            global: true,
            family: 'Source Han Sans CN-Medium',
            source: 'url("https://somebodycc.github.io/SourceHanSansCN-Medium.otf")'
        })
    },
    // 用户登录
    async login(){
        return new Promise((resolve, reject) => {
            wx.login({
                success: res => {
                    var systemInfo = wx.getSystemInfoSync()
                    myrequest(ip + '/user/login', 'POST', {
                        code: res.code,
                        time: formatTime(new Date()),
                        system: systemInfo.system,
                        wechatVersion: systemInfo.version
                    }).then(res => {
                        resolve(res)
                    }).catch(err => {
                        reject(err)
                    })
                },
                fail: err => {
                    reject(err)
                }
            })
        }).then(async res => {
            await myrequest(ip + '/user', 'GET', {openid: res}).then(res => {
                if(res.success) {
                    const rowUser = res.user
                    var user = {
                        openid: rowUser.openid,
                        nickname: rowUser.nickname,
                        avatar: rowUser.avatar,
                        registerTime: rowUser.register_time
                    }
                    wx.setStorageSync('user', user)
                    return Promise.resolve()
                }
                return Promise.reject()
            }).then((res) => {
                this.globalData.checkLogin = true
                if (this.checkLoginReadyCallback) {
                    this.checkLoginReadyCallback()
                }
            })
            console.log("获取到用户openid: ", res)
        }).catch(err => {
            wx.showToast({
              title: '登录失败T_T请检查网络',
              icon: 'none'
            })
            console.log("登录时出现错误: ", err)
        })
    },

    globalData: {
        user: null,
        ip
    }
})