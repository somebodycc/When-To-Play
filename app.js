// app.js
App({
    onLaunch() {
        this.loadFont()

        // 登录
        wx.login({
            success: res => {
                // 发送 res.code 到后台换取 openId, sessionKey, unionId
            }
        })
    },

    /* 加载全局字体 */
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

    globalData: {
        userInfo: null
    }
})