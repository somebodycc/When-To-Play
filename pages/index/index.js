// index.js
const app = getApp()
const ip = app.globalData.ip
const { myrequest } = require('../../utils/util')

var startPoint, endPoint    //处理按钮移动

Page({

    /**
     * 页面的初始数据
     */
    data: {
        wtps: [],
        loadingText: '加载中...',
        showPopup: false,
        pageHeight: "124vw",
        translateY: '0px'
    },
    
    //前往创建新的什么时候
    newWTP(){
        wx.navigateTo({
          url: '/pages/newWTP/newWTP',
        })
    },

    //显示page-container
    showPopup(){
        this.setData({
            showPopup: true
        })
    },
    //显示链接信息
    showShareLink(){
        this.setData({
            showShareLink: true
        })
        this.showPopup()
    },
    //隐藏page-container
    hidePopup(){
        this.setData({
            showPopup: false,
            showShareLink: false
        })
    },

    //获取和当前用户相关的WTP
    getRelatedWTP(){
        const openid = wx.getStorageSync('user').openid
        myrequest(ip + '/wtp/user-related', 'GET', {openid, all: 0}).then(res => {
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
                    time: wtp.format_wtp_time,
                    wtpStatus: wtp.wtp_status,
                    status: wtp.status,
                    rStyle: openid == wtp.openid ? 2 : 1
                }
            })
            this.setData({
                wtps,
                loadingText: "还没有什么时候哦，快去发起邀请吧~"
            })
        })
    },

    //检测是否为点击受邀链接进入小程序
    async detectShare(options){
        if (!options || !options.wtpInvitation) return

        const wtpid = options.wtpInvitation
        const user = wx.getStorageSync('user')
        var userStatus //用户是否已经接受/拒绝该什么时候
        //显示分享过来的什么时候
        this.showShareLink()
        //将当前用户加入分享者的名单
        await myrequest(ip + '/wtp/new-invitee', 'POST', {wtpid, openid: user.openid})
        //获取当前用户是否已经接受/拒绝该什么时候
        await myrequest(ip + '/wtp/user-status', 'GET', {wtpid, openid: user.openid}).then(res => {
            if (res.success) userStatus = res.status
        })

        myrequest(ip + '/wtp', 'GET', {wtpid}).then(res => {
            const rowWtp = res.wtp
            var wtp = {
                    id: rowWtp.wtp_id,
                    initiatorName: rowWtp.nickname,
                    initiatorAvatar: rowWtp.avatar,
                    todoName: rowWtp.todo_name,
                    todoImg: rowWtp.todo_image,
                    joinedPlayerNum: rowWtp.joined_player_num,
                    expectedPlayerNum: rowWtp.expected_player_num,
                    time: rowWtp.format_wtp_time,
                    wtpStatus: rowWtp.wtp_status,
                    status: userStatus,
            }
            this.setData({
                linkWtp: wtp
            })
        })
    },

    //当对什么时候进行改动时
    onEditWTP(){
        this.onShow()
    },

    //监听按钮移动开始
    btnStart(e){
        startPoint = e.touches[0]
    },
    //监听按钮移动
    btnMove(e){
        endPoint = e.touches[e.touches.length - 1]  //获取拖动点
        var translateY = endPoint.clientY - startPoint.clientY
        startPoint = endPoint
        var floatY = parseFloat(this.data.translateY.slice(0, -2)) + parseFloat(translateY)
        // console.log(intY)
        this.setData({
            translateY: floatY + 'px'
        })
    },

    //监听屏幕点击
    onTouch(){
        const wtpIns = this.selectAllComponents(".wtpItem")
        wtpIns.forEach(element => {
            element.hideMore()
        })
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        if (app.globalData.checkLogin) {
            this.detectShare(options)
            this.getRelatedWTP()
        } else {
            app.checkLoginReadyCallback = () => {
                this.detectShare(options)
                this.getRelatedWTP()
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
        if (app.globalData.checkLogin) {
            this.getRelatedWTP()
        } else {
            app.checkLoginReadyCallback = () => {
                this.getRelatedWTP()
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
    onShareAppMessage(info) {
        var todoName, wtpid
        var promise = new Promise((rs, rj) => {
            if (info.from == "button") {
                todoName = info.target.dataset.todoname
                wtpid = info.target.dataset.wtpid
                var nickname = wx.getStorageSync('user').nickname
                rs({
                    title: `${nickname}说: 什么时候${todoName}`,
                    path: `/pages/index/index?wtpInvitation=${wtpid}`,
                })
            }
            else rj()
        })
        
        return {
            title: `获取数据失败`,
            path: `/pages/index?wtpInvitation=${wtpid}`,
            promise
        }
    }
})