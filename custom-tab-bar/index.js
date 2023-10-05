// components/custom-tab-bar/custom-tab-bar.js
Component({

    /**
     * 组件的属性列表
     */
    properties: {

    },

    /**
     * 组件的初始数据
     */
    data: {
        selected: 0,
        color: "#BFBFBF",
        selectedColor: "#000000",
        list: [{
            pagePath: "/pages/index/index",
            iconPath: "/icons/home.png",
            selectedIconPath: "/icons/home_selected.png",
            text: "主页"
        }, {
            pagePath: "/pages/myself/myself",
            iconPath: "/icons/myself.png",
            selectedIconPath: "/icons/myself_selected.png",
            text: "我的"
        }]
    },

    /**
     * 组件的方法列表
     */
    methods: {
        switchTab(e) {
            const data = e.currentTarget.dataset
            const url = data.path
            wx.switchTab({
                url
            })
            this.setData({
                selected: data.index
            })
        }
    }
})