// pages/newWTP/newWTP.js
const app = getApp()
const ip = app.globalData.ip
import { myrequest, formatTime } from '../../utils/util'

Page({

    /**
     * 页面的初始数据
     */
    data: {
        reservationItems: [{
            image: ip + "/images/todo-APEX.png",
            name: "APEX"
        },{
            image: ip + "/images/todo-DeepRock.png",
            name: "深岩银河"
        },{
            image: ip + "/images/todo-DontStarve.png",
            name: "饥荒"
        },{
            image: ip + "/images/todo-COC.png",
            name: "跑团"
        },{
            image: "/icons/plus.png",
            name: "自定义"
        }],
        number: [2,3,4,5,6,7,8,9,10,11,12,13,14,15,16],
        showPopup: false,
        pageHeight: "128vw"
    },

    //调整预约项目
    changeReservationMain(e){
        const image = e.currentTarget.dataset.image
        const name = e.currentTarget.dataset.name
        this.setData({
            ["wtp.todoName"]: name,
            ["wtp.todoImg"]: image
        })
        this.hidePopup()
    },
    //调整日期
    bindDateChange(e){
        this.setData({
            pickedDate: e.detail.value
        })
    },
    //调整时间
    bindTimeChange(e){
        this.setData({
            pickedTime: e.detail.value
        })
    },
    //调整预期人数
    bindPickerChange(e){
        this.setData({
            numOfParticipant: this.data.number[e.detail.value],
            ['wtp.expectedPlayerNum']: this.data.number[e.detail.value]
        })
    },
    //调整是否允许超员
    exPlayer(e){
        this.setData({
            allowExPlayer: e.detail.value
        })
    },

    //显示page-container
    showPopup(){
        this.setData({
            showPopup: true
        })
    },
    //显示预约项目
    showTodoSelect(){
        this.setData({
            showTodoSelect: true
        })
        this.showPopup()
    },
    //隐藏page-container
    hidePopup(){
        this.setData({
            showPopup: false,
            showTodoSelect: false
        })
    },

    //接收订阅消息
    async subscribe(){
        wx.requestSubscribeMessage({
            tmplIds: ['-qLQGq1AONMkeTyAE8SNlHfXmccbIpVBPvsNHgJfNFk'],
            success: res => {
                if (res['-qLQGq1AONMkeTyAE8SNlHfXmccbIpVBPvsNHgJfNFk'] === 'accept') {
                    //用户接受了订阅
                    myrequest(ip + '/wtp/mod-invitee-subscribed', 'POST', {
                        openid: wx.getStorageSync('user').openid,
                        wtpid: this.data.wtpid,
                        subscribed: 1
                    })
                }
            }
        })
    },

    //发布什么时候
    async createWTP(){
        return await new Promise((rs, rj) => {
            var rowWtp = this.data.wtp
            var user = wx.getStorageSync('user')
            var wtp = {
                initiator: user.openid,
                todo_name: rowWtp.todoName,
                todo_image: rowWtp.todoImg,
                wtp_time: this.data.pickedDate + ' ' + this.data.pickedTime,
                allow_extra_player: this.data.allowExPlayer,
                expected_player_num: this.data.numOfParticipant,
                create_time: formatTime(new Date())
            }
            myrequest(ip + '/wtp/new', 'POST', {wtp}, 2900).then(res => {   //需要设定3s内获取到res否则分享会使用错误的分享链接
                if (res.success) {
                    this.setData({
                        wtpid: res.wtpid
                    })
                    setTimeout(() => {
                        wx.navigateBack()
                    }, 3000)
                    rs({
                        title: `${user.nickname}说: 什么时候${this.data.wtp.todoName}`,
                        path: `/pages/index/index?wtpInvitation=${this.data.wtpid}`
                    })
                } else {
                    rj()
                }
            }).catch(err => {
                rj(err)
            })
        })
    },
    /* async shareTimeout(){
        return await new Promise((resolve, reject) => {
            setTimeout(() => {
                console.log('shareTimeout')
                reject()
            }, 0)
        })
    }, */

    initData(){
        var date = new Date()
        var user = wx.getStorageSync('user')
        this.setData({
            wtp: {
                initiatorName: user.nickname,
                initiatorAvatar: user.avatar,
                todoName: "APEX",
                todoImg: ip + "/images/todo-APEX.png",
                joinedPlayerNum: 1,
                expectedPlayerNum: 4,
                time: "今天 19:00(示例)",
                status: 0
            },
            today: formatTime(date).slice(0, formatTime(date).indexOf(' ')),
            pickedDate: formatTime(date).replace(/\//g, '-').slice(0, formatTime(date).indexOf(' ')),
            pickedTime: formatTime(date).slice(formatTime(date).indexOf(' ') + 1, -3),
            numOfParticipant: 4,
            allowExPlayer: true
        })
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        this.initData()
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
    onShareAppMessage(info) {
        if (info.from != "button") return {
            
        }

        return {
            title: `什么时候${this.data.wtp.todoName}`,
            path: `/pages/index/index?wtpInvitation=${this.data.wtpid}`,
            promise: this.createWTP()   //返回的Promise为rejected时候是不会触发分享的
            //promise: Promise.race([this.createWTP(), this.shareTimeout()])
        }
    }
})