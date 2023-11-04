// components/wtp-history/wtp-history.js
const app = getApp()
const ip = app.globalData.ip
const { myrequest } = require('../../utils/util')

Component({

    /**
     * 组件的属性列表
     */
    properties: {
        wtp: {
            type: Object,
            value: {}
        },
    },

    /**
     * 组件的初始数据
     */
    data: {
        arrowRotateDeg: '-90deg'
    },

    /**
     * 组件的方法列表
     */
    methods: {
        //展示更多
        showMore(){
            this.setData({
                showMore: this.data.showMore === true ? false : true,
                arrowRotateDeg: this.data.arrowRotateDeg === '-90deg' ? '-180deg' : '-90deg'
            })
        },

        //归档什么时候
        archiveWTP(){
            var archived = 1
            const openid = wx.getStorageSync('user').openid
            const wtpid = this.data.wtp.wtpid
            myrequest(ip + '/wtp/mod-user-archived', 'POST', {
                openid,
                wtpid,
                archived
            }).then(res => {
                if (res.success) {
                    wx.showToast({
                        title: '归档成功！',
                        icon: 'none'
                      })
                    this.triggerEvent('archive')
                    this.setData({
                        ['wtp.archived']: archived
                    })
                    this.parseArchived()
                }
            }).catch(err => {
                wx.showToast({
                    title: '操作失败',
                    icon: 'none'
                })
            })
        },
        //取消归档什么时候
        unarchiveWTP(){
            var archived = 0
            const openid = wx.getStorageSync('user').openid
            const wtpid = this.data.wtp.wtpid
            myrequest(ip + '/wtp/mod-user-archived', 'POST', {
                openid,
                wtpid,
                archived
            }).then(res => {
                if (res.success) {
                    wx.showToast({
                        title: '取消归档成功！',
                        icon: 'none'
                      })
                    this.triggerEvent('unarchive')
                    this.setData({
                        ['wtp.archived']: archived
                    })
                    this.parseArchived()
                }
            }).catch(err => {
                wx.showToast({
                    title: '操作失败',
                    icon: 'none'
                })
            })
        },
        //接受邀请
        acceptWTP(){
            var status = 1
            const openid = wx.getStorageSync('user').openid
            const wtpid = this.data.wtp.wtpid
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
                    this.triggerEvent('accept')
                    this.setData({
                        ['wtp.joinedPlayerNum']: this.data.wtp.joinedPlayerNum + 1,
                        ['wtp.status']: status
                    })
                }
                else return Promise.reject()
            }).catch(err => {
                wx.showToast({
                    title: '操作失败',
                    icon: 'none'
                })
            })
        },
        //拒绝邀请
        rejectWTP(){
            var status = -1
            const openid = wx.getStorageSync('user').openid
            const wtpid = this.data.wtp.wtpid
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
                    this.triggerEvent('reject')
                    this.setData({
                        ['wtp.joinedPlayerNum']: this.data.wtp.joinedPlayerNum - 1,
                        ['wtp.status']: status
                    })
                }
                else return Promise.reject()
            }).catch(err => {
                wx.showToast({
                    title: '操作失败',
                    icon: 'none'
                })
            })
        },
        //隐藏什么时候(删除记录)
        hideWTP(){
            var hidden = 1
            const openid = wx.getStorageSync('user').openid
            const wtpid = this.data.wtp.wtpid
            myrequest(ip + '/wtp/mod-user-hidden', 'POST', {
                openid,
                wtpid,
                hidden
            }).then(res => {
                if (res.success) {
                    wx.showToast({
                        title: '删除成功！',
                        icon: 'none'
                      })
                    this.triggerEvent('hide')
                }
            }).catch(err => {
                wx.showToast({
                    title: '操作失败',
                    icon: 'none'
                })
            })
        },
        //撤回什么时候
        deleteWTP(){
            const openid = wx.getStorageSync('user').openid
            const wtpid = this.data.wtp.wtpid
            wx.showModal({
                title: "撤回什么时候",
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
                                  title: '撤回成功',
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

        //判断是否是自己发送的什么时候
        judgeSelf(){
            var user = this.data.me
            this.setData({  
                self: user.openid == this.data.wtp.openid ? true : false
            })
        },
        //将状态转换为文字
        parseWtpStatus(){
            var status = this.data.wtp.wtpStatus
            var statusStr, statusColor
            switch (status) {
                case 0:
                    statusStr = '进行中'
                    statusColor = 'slateblue'
                    break
                case 1:
                    statusStr = '已完成'
                    statusColor = 'orange'
                    break
                default:
                    statusStr = '未知'
                    break
            }
            this.setData({
                wtpStatusStr: statusStr,
                statusColor
            })
        },
        //将归档转换为文字
        parseArchived(){
            var archived = this.data.wtp.archived
            var archivedStr
            switch (archived) {
                case 0:
                    archivedStr = ''
                    break
                case 1:
                    archivedStr = '已归档'
                    break
                default:
                    archivedStr = '未知'
                    break
            }
            this.setData({
                archivedStr,
            })
        },
        //将选择转换为文字
        parseStatus(){
            var status = this.data.wtp.status
            var statusStr, statusColor
            switch (status) {
                case 0:
                    statusStr = '未响应'
                    statusColor = 'slateblue'
                    break
                case 1:
                    statusStr = '已接受'
                    statusColor = 'orange'
                    break
                case -1:
                    statusStr = '已拒绝'
                    statusColor = 'indianred'
                    break
                default:
                    statusStr = '未知'
                    break
            }
            this.setData({
                myStatusStr: statusStr,
                myStatusColor: statusColor
            })
        },

        //初始化数据
        initData(){
            this.setData({me: wx.getStorageSync('user')})
        }
    },

    /**
     * 组件的生命周期
     */
    lifetimes: {
        attached() {
            this.initData()
            this.judgeSelf()
            this.parseWtpStatus()
            this.parseArchived()
            this.parseStatus()
        },
        detached() {
          // 在组件实例被从页面节点树移除时执行
        },
      },
})