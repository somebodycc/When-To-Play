// components/wtp/wtp.js
const app = getApp()
const ip = app.globalData.ip
const { myrequest } = require("../../utils/util")

Component({

    /**
     * 组件的属性列表
     */
    properties: {
        wtp: {
            type: Object,
            value: {}
        },
        rStyle: {
            type: Number,
            value: 1
        }
    },

    /**
     * 组件的初始数据
     */
    data: {

    },

    /**
     * 组件的方法列表
     */
    methods: {

        
        //接受邀请
        acceptWTP(e){
            console.log(1)
            var status = 1
            const openid = wx.getStorageSync('user').openid
            const wtpid = e.currentTarget.dataset.wtpid
            myrequest(ip + '/wtp/mod-invitee-status', 'POST', {
                openid,
                wtpid,
                status
            }).then(res => {
                if (res.success) {
                    //请求订阅消息
                    wx.requestSubscribeMessage({
                        tmplIds: ['-qLQGq1AONMkeTyAE8SNlHfXmccbIpVBPvsNHgJfNFk'],
                        success: res => {
                            if (res['-qLQGq1AONMkeTyAE8SNlHfXmccbIpVBPvsNHgJfNFk'] === 'accept') {
                                //用户接受了订阅
                                myrequest(ip + '/wtp/mod-invitee-subscribed', 'POST', {
                                    openid,
                                    wtpid,
                                    subscribed: 1
                                })
                            }
                        }
                    })
                    wx.showToast({
                      title: '接受成功！记得准时赴约哦',
                      icon: 'none'
                    })
                    this.setData({
                        ['wtp.joinedPlayerNum']: this.data.wtp.joinedPlayerNum + 1,
                        ['wtp.status']: status
                    })
                }
            })
        },
        //拒绝邀请
        rejectWTP(e){
            var status = -1
            const openid = wx.getStorageSync('user').openid
            const wtpid = e.currentTarget.dataset.wtpid
            myrequest(ip + '/wtp/mod-invitee-status', 'POST', {
                openid,
                wtpid,
                status
            }).then(res => {
                if (res.success) {
                    wx.showToast({
                      title: '已拒绝邀请！相信你有更重要的事',
                      icon: 'none'
                    })
                    this.setData({
                        ['wtp.joinedPlayerNum']: this.data.wtp.joinedPlayerNum - 1,
                        ['wtp.status']: status
                    })
                }
            })
        },
        //删除什么时候
        deleteWTP(e){
            const openid = wx.getStorageSync('user').openid
            const wtpid = e.currentTarget.dataset.wtpid
            wx.showModal({
                title: "删除什么时候",
                content: "该操作不可撤销！",
                confirmColor: "#ff0000",
                success: res => {
                    if (res.confirm) {
                        //用户点击确定
                        myrequest(ip + '/wtp/delete', 'POST', {
                            openid,
                            wtpid,
                        }).then(res => {
                            if (res.success) {
                                wx.showToast({
                                  title: '删除成功',
                                  icon: 'none'
                                })
                                this.triggerEvent('delete')
                            }
                        })
                    } else if (res.cancel) {
                        //用户点击取消
                    }
                }
            })
            
        },

        //更多操作点击
        tapMore(){
            this.setData({
                showMore: this.data.showMore ? false : true
            })
        },
        //显示更多操作
        showMore(){
            this.setData({
                showMore: true
            })
        },
        //关闭更多操作
        hideMore(){
            this.setData({
                showMore: false
            })
        },
        doNothing(){
            return console.log('I have done nothing');
        }
    }
})