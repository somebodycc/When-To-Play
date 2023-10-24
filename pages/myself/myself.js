// pages/myself/myself.js
const { myrequest } = require('../../utils/util')
const app = getApp()
const ip = app.globalData.ip

Page({

    /**
     * 页面的初始数据
     */
    data: {
        avatar: ""
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
        if (app.globalData.checkLogin) {
            this.initUserInfo()
        } else {
            app.checkLoginReadyCallback = () => {
                this.initUserInfo()
            }
        }
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