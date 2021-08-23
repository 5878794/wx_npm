// components/add_cut_input/index.js
Component({
	/**
	 * 组件的属性列表
	 */
	properties: {
		value:{
			type:[Number,String],
			value:0
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
		addFn(){
			let val = this.data.value;
			val++;
			this.setData({
				value:val
			});

			this.callBack(val);
		},
		cutFn(){
			let val = this.data.value;
			val--;
			this.setData({
				value:val
			});
			this.callBack(val);
		},
		inputFn(e){
			let val = e.detail.value;
			this.setData({
				value:val
			});
			this.callBack(val);
		},
		callBack(val){
			let myEventDetail = {value:val}; // detail对象，提供给事件监听函数
			let myEventOption = {}; // 触发事件的选项
			this.triggerEvent('mychange', myEventDetail, myEventOption)
		}
	}
});
