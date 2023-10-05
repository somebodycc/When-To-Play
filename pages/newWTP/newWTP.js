// pages/newWTP/newWTP.js
import {formatTime} from '../../utils/util'

Page({

    /**
     * 页面的初始数据
     */
    data: {
        reservationItems: [{
            image: "",
            name: "APEX"
        },{
            image: "",
            name: "深岩银河"
        },{
            image: "",
            name: "饥荒"
        },{
            image: "",
            name: "跑团"
        },{
            image: "",
            name: "自定义"
        }],
        showPopup: false,
        pageHeight: "128vw"
    },

    //调整预约项目
    changeReservationMain(e){
        const image = e.currentTarget.dataset.image
        const name = e.currentTarget.dataset.name
        this.setData({
            ["reservation.todoName"]: name,
            ["reservation.todoImg"]: image
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
            numOfParticipant: e.detail.value
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

    initData(){
        var date = new Date()
        this.setData({
            reservation: {
                initiatorName: "赟宝",
                initiatorAvatar: "",
                todoName: "跑团",
                todoImg: "",
                time: "今天 19:00",
                status: 0
            },
            pickedDate: formatTime(date).slice(0, formatTime(date).indexOf(' ')),
            pickedTime: formatTime(date).slice(formatTime(date).indexOf(' '), -3),
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
    onShareAppMessage() {

    }
})