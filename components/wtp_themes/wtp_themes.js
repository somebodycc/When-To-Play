// components/wtp_themes/wtp_themes.js
Component({

    /**
     * 组件的属性列表
     */
    properties: {
        themes: {
            type: Array,
            value: []
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
        //选择某个主题
        selectTheme(e){
            const image = e.currentTarget.dataset.image
            const name = e.currentTarget.dataset.name

            this.triggerEvent('select', {name, image})
        },
    }
})