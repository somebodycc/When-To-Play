// components/more-option/more-option.js
Component({

    /**
     * 组件的属性列表
     */
    properties: {
        options: {
            type: Array,
            value: []
        },
        showMore: {
            type: Boolean,
            value: false
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
        tapMore(){
            this.setData({showMore: true})
            this.triggerEvent('showmore')
        },
        select(e){
            var index = e.currentTarget.dataset.index
            this.triggerEvent(`select${index}`)
        }
    }
})