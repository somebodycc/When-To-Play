// index.js
const app = getApp()

Page({

    /**
     * 页面的初始数据
     */
    data: {
        reservations: [{
            id: 1,
            initiatorName: "赟宝",
            initiatorAvatar: "",
            todoName: "跑团",
            todoImg: "",
            time: "今天 19:00",
            status: 1
        },{
            id: 2,
            initiatorName: "阿岚",
            initiatorAvatar: "",
            todoName: "深岩银河",
            todoImg: "",
            time: "明天 22:00",
            status: -1
        },{
            id: 3,
            initiatorName: "阿哲",
            initiatorAvatar: "",
            todoName: "APEX",
            todoImg: "",
            time: "明天 23:00",
            status: 0
        }]
    },
    
    //前往创建新的什么时候
    newWTP(){
        wx.navigateTo({
          url: '/pages/newWTP/newWTP',
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