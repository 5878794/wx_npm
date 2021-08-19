
import b_input from '../__publish/b_input.js';

Component({
	behaviors: [b_input],
	options: {
		// styleIsolation: 'apply-shared'      //外部样式会影响内部样式，组件样式不影响外部
	},
    properties: {
	    selectData:{
		    type:Array,
		    value:[]
	    },
	    arrow:{
	    	type:Boolean,
		    value:true
	    }
    },
    data: {

    },

	observers: {

	},

	attached(){
		this.init();

	},


	methods: {
		init(){
			//处理select
			console.log(this.data.value);
			let selected = this.data.value;


			this.setData({
				value:selected
			});
		},

		onSelect(e){

			let value = e.detail.value;
			value = value.join(',');

			console.log(value)
			this.setData({
				value:value
			});


			let myEventDetail = {value:value}; // detail对象，提供给事件监听函数
			let myEventOption = {}; // 触发事件的选项
			this.triggerEvent('mychange', myEventDetail, myEventOption)

		},

		getValue(){
			return this.data.value;
		},

		value(value){
			if(!value){return;}


			this.setData({
				value:value
			});

			let myEventDetail = {value:value}; // detail对象，提供给事件监听函数
			let myEventOption = {}; // 触发事件的选项
			this.triggerEvent('mychange', myEventDetail, myEventOption);

		}
	}
});
