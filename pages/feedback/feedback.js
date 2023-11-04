// pages/feedback/feedback.js
const app = getApp()
const ip = app.globalData.ip
const { myrequest } = require("../../utils/util")

Page({

    /**
     * 页面的初始数据
     */
    data: {
        mainValue: '',
        placeholder: "非常感谢能使用“什么时候”小程序！这是我个人尝试制作的小程序。如有任何意见欢迎指出，我会尽力解答。您也可以直接联系邮箱gsomebodycc@gmail.com和作者取得联系"
    },

    //发送反馈
    sendFeedback(e){
        const openid = wx.getStorageSync('user').openid
        var content = e.detail.value
        if (content.main == "") {
            return wx.showToast({
              title: '请填写反馈内容',
              icon: 'none'
            })
        }

        myrequest(ip + '/feedback', 'POST', {...content, openid}).then(res => {
            if (res.success) {
                this.setData({
                    mainValue: ''
                })
                wx.showToast({
                  title: '发送成功',
                  icon: 'none'
                })
                setTimeout(() => {
                    wx.navigateBack()
                }, 500)
            }
            else return Promise.reject()
        }).catch(err => {
            wx.showToast({
                title: '发送失败',
                icon: 'none'
            })
            console.error(err)
        })
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {

    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady() {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow() {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide() {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload() {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh() {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom() {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage() {

    }
})