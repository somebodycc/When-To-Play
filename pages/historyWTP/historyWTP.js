// pages/historyWTP/historyWTP.js
const app = getApp()
const ip = app.globalData.ip
const { myrequest } = require('../../utils/util')

Page({

    /**
     * 页面的初始数据
     */
    data: {
        loadingText: "加载中...",
        wtps: []
    },
    

    //获取和当前用户相关的WTP
    getRelatedWTP(){
        const openid = wx.getStorageSync('user').openid
        myrequest(ip + '/wtp/user-related', 'GET', {openid, all: 1}).then(res => {
            const rowWtps = res.wtps
            var wtps = rowWtps.map(wtp => {
                return {
                    wtpid: wtp.wtp_id,
                    initiatorName: wtp.nickname,
                    initiatorAvatar: wtp.avatar,
                    todoName: wtp.todo_name,
                    todoImg: wtp.todo_image,
                    joinedPlayerNum: wtp.joined_player_num,
                    expectedPlayerNum: wtp.expected_player_num,
                    time: wtp.wtp_time,
                    createTime: wtp.create_time,
                    status: wtp.status,
                    wtpStatus: wtp.wtp_status,
                    archived: wtp.archived,
                    openid: wtp.openid
                }
            })
            return wtps
        }).then(async wtps => {
            for(var wtp of wtps){
                await myrequest(ip + '/wtp/joined', 'GET', {wtpid: wtp.wtpid}).then(res => {
                    if (res.success) {
                        wtp.participants = res.users
                    }
                    else return Promise.reject("获取wtp的加入用户失败")
                })
            }
            this.setData({
                loadingText: '没有了哦~',
                wtps
            })
        }).catch(err => {
            wx.showToast({
              title: '获取什么时候历史失败',
              icon: 'none'
            })
            this.setData({
                loadingText: '加载失败TT',
            })
        })
    },

    //监听屏幕点击
    onTouch(){
        const wtpIns = this.selectAllComponents(".wtpItem")
        wtpIns.forEach(element => {
            element.hideMore()
        })
    },
    //当对什么时候进行改动时
    onEditWTP(){
        this.onShow()
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
        this.getRelatedWTP()
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