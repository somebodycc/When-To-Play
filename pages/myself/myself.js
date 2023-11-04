// pages/myself/myself.js
const { myrequest } = require('../../utils/util')
const app = getApp()
const ip = app.globalData.ip

Page({

    /**
     * 页面的初始数据
     */
    data: {

    },

    //更改头像
    changeAvatar(e){
        const avatarUrl = e.detail.avatarUrl
        var user = wx.getStorageSync('user')
        wx.uploadFile({
            filePath: avatarUrl,
            name: "avatar",
            url: ip + "/user/modify-avatar",
            formData: {
                type: "avatar",
                openid: user.openid
            },
            success: res => {
                var res = JSON.parse(res.data)
                console.log(res, res.success)
                if (!res.success) {
                    return wx.showToast({title: '上传图片失败', icon: "error"})
                }
                var avatar = res.imageUrl
                console.log("头像地址: ", avatar)
                user.avatar = avatar
                this.setData({
                    user
                })
                //同步头像数据到本地
                wx.setStorageSync('user', user)
            }
        })
    },
    //更改昵称
    changeNickname(e){
        var user = wx.getStorageSync('user')
        var nickname = e.detail.value
        if (nickname == user.nickname) return
        myrequest(ip + '/user/modify-nickname', 'POST', {
            openid: user.openid,
            nickname
        }).then(res => {
            if (res.success) {
                wx.showToast({
                    title: '更改昵称成功',
                    icon: 'none'
                })
                this.setData({
                    ['user.nickname']: nickname
                })
                user.nickname = nickname
                wx.setStorageSync('user', user)
            }
        }).catch(err => {
            wx.showToast({
              title: '更改昵称失败',
              icon: 'none'
            })
        })
    },

    //前往历史什么时候
    toWtpHistory(){
        wx.navigateTo({
          url: '/pages/historyWTP/historyWTP',
        })
    },

    //获取什么时候的数量
    getWTPnum(){
        var openid = wx.getStorageSync('user').openid
        myrequest(ip + '/wtp/user-related', 'GET', {openid, all: 1}).then(res => {
            if (res.success) {
                this.setData({wtpNum: res.wtps.length})
            }
            else {
                return Promise.reject(res)
            }
        }).catch(err => {
            console.error(err)
        })
    },

    //前往使用说明页面
    toInstruction(){
        wx.navigateTo({
            url: '../instruction/instruction',
        })
    },
    //前往意见反馈页面
    toFeedback(){
        wx.navigateTo({
          url: '../feedback/feedback',
        })
    },

    initUserInfo(){
        var user = wx.getStorageSync('user')
        this.setData({
            user
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
        if (app.globalData.checkLogin) {
            this.initUserInfo()
            this.getWTPnum()
        } else {
            app.checkLoginReadyCallback = () => {
                this.initUserInfo()
                this.getWTPnum()
            }
        }
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