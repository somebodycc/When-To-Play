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
            image: ip + "/images/todo-COC.png",
            name: "跑团"
        }],
        searchThemes: [],
        recentThemes: [],
        wtp: {},
        number: [2,3,4,5,6,7,8,9,10,11,12,13,14,15,16],
        showPopup: false,
        pageHeight: "75vh"
    },

    //调整预约项目
    changeReservationMain(e){
        const image = e.detail.image
        const name = e.detail.name
        
        //将最近选择添加到localStorage
        var history = wx.getStorageSync('themeSelectHistory')
        if (!history) history = []
        if (!history.some((value => {   //选择的主题不存在历史记录
            return value.name === name && value.image === image
        }))) {
            history.unshift({image, name})
            history = history.slice(0, 4)  //最近选择不能超过四个
        }
        else {
            history.forEach((value, index) => {    //选择的主题不存在历史记录, 将该记录提前
                if (value.name === name && value.image === image) {
                    history.unshift(history.splice(index, 1)[0])
                }
            })
        }
        wx.setStorageSync('themeSelectHistory', history)
        
        this.setData({
            ["wtp.todoName"]: name,
            ["wtp.todoImg"]: image,
            recentThemes: history
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
            showTodoSelect: true,
            showCostomTheme: false
        })
        this.showPopup()
    },
    showCostomTheme(){
        this.setData({
            showTodoSelect: false,
            showCostomTheme: true
        })
    },
    //隐藏page-container
    hidePopup(){
        this.setData({
            showPopup: false,
            showTodoSelect: false,
            searchThemes: []    //清空搜索内容
        })
    },

    //搜索什么时候的主题
    searchWTPitem(e){
        var keyword
        if (e.type === 'submit') keyword = e.detail.value.search
        else keyword = e.detail.value
        if (!keyword) return wx.showToast({title: '搜索内容不能为空!', icon: 'none'})

        myrequest(ip + '/wtp-theme/search', 'GET', {keyword}).then(res => {
            if (!res.success) {
                return Promise.reject()
            }
            const searchThemes = res.themes.map(theme => {
                return {
                    themeid: theme.themeid,
                    image: theme.theme_img,
                    name: theme.theme_name
                }
            })
            if (searchThemes.length === 0) wx.showToast({
                title: '找不到相关的主题',
                icon: 'none'
            })
            this.setData({
                searchThemes
            })
        }).catch(err => {
            wx.showToast({title: '搜索失败!', icon: 'none'})
        })
    },

    //选择自定义主题图片
    chooseCustomThemeImg(){
        wx.chooseMedia({
            count: 1,
            mediaType: ['image'],
            sourceType: ['album'],
            success: res => {
                wx.cropImage({
                    cropScale: '1:1',
                    src: res.tempFiles[0].tempFilePath,
                    success: res => {
                        this.setData({
                            customThemeImg: res.tempFilePath
                        })
                    }
                })
            }
        })
    },
    //输入自定义主题名
    inputCustomThemeName(e){
        this.setData({
            customThemeName: e.detail.value
        })
    },
    //是否公开自定义主题
    themePubilc(e){
        this.setData({
            themePubilc: e.detail.value
        })
    },
    //上传自定义主题
    newTheme(){
        var openid = wx.getStorageSync('user').openid
        var {customThemeImg, customThemeName, themePubilc} = this.data
        customThemeName = customThemeName.trim()
        if (!customThemeImg) return wx.showToast({title: '请选择主题图片',icon: 'none'})
        else if (customThemeName == '') return wx.showToast({title: '请输入主题名',icon: 'none'})

        //上传
        wx.showLoading({
            title: "上传中",
            mask: true
        })
        wx.uploadFile({
            filePath: customThemeImg,
            name: 'image',
            url: ip + '/wtp-theme/new',
            formData: {
                type: "wtpThemeImage",
                customThemeName,
                themePubilc: themePubilc ? 1 : 0,
                openid
            },
            success: res => {
                var res = JSON.parse(res.data)
                if (res.success) {
                    wx.showToast({
                      title: '上传成功!',
                      icon: 'none'
                    })
                    this.showTodoSelect()
                    this.setData({  //清空草稿
                        customThemeImg: '',
                        customThemeName: '',
                        themePubilc: true
                    })
                }
                else wx.showToast({
                    title: '上传失败!',
                    icon: 'none'
                })
            },
            fail: res => {
                wx.showToast({
                    title: '上传失败!',
                    icon: 'none'
                })
            },
            complete: res => {
                wx.hideLoading({noConflict: true})
                this.getWtpThemes()
            }
        })

        /* myrequest(ip + '/wtp-theme/new', 'POST', {
            customThemeImg,
            customThemeName,
            themePubilc,
            openid
        }).then(res => {
            if (res.success) {
                wx.showToast({
                  title: '上传成功!',
                  icon: 'none'
                })
                this.showTodoSelect()
                this.setData({  //清空草稿
                    customThemeImg: '',
                    customThemeName: '',
                    themePubilc: true
                })
            }
            else return Promise.reject()
        }).catch(err => {
            
        }) */
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
            if (!wtp.todo_name || wtp.todo_name == '') {
                wx.showToast({
                  title: '请选择主题',
                  icon: 'none'
                })
                return rj()
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

    //查找所有用户能看到的主题
    getWtpThemes(){
        var openid = wx.getStorageSync('user').openid
        myrequest(ip + '/wtp-theme/user-related-all', 'GET', {openid}).then(res => {
            if (!res.success) {
                return Promise.reject()
            }
            const allThemes = res.themes.map(theme => {
                return {
                    themeid: theme.themeid,
                    image: theme.theme_img,
                    name: theme.theme_name
                }
            })
            this.setData({
                reservationItems: allThemes
            })
        }).catch(err => {
            wx.showToast({title: '获取全部主题失败', icon: 'none'})
        })
    },

    initData(){
        var date = new Date()
        var user = wx.getStorageSync('user')
        var recentThemes = wx.getStorageSync('themeSelectHistory') //判断是否有历史选择过的主题

        this.setData({
            wtp: {
                initiatorName: user.nickname,
                initiatorAvatar: user.avatar,
                todoName: "",
                todoImg: "",
                joinedPlayerNum: 1,
                expectedPlayerNum: 4,
                time: "今天 19:00(示例)",
                status: 0,
                wtpStatus: 0
            },
            today: formatTime(date).slice(0, formatTime(date).indexOf(' ')),
            pickedDate: formatTime(date).replace(/\//g, '-').slice(0, formatTime(date).indexOf(' ')),
            pickedTime: formatTime(date).slice(formatTime(date).indexOf(' ') + 1, -3),
            numOfParticipant: 4,
            allowExPlayer: true,
            recentThemes,
            themePubilc: false,
        })
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        this.initData()
        this.getWtpThemes()
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