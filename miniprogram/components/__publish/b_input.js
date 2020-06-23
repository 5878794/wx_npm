


let b_input = Behavior({
	properties: {
		icon:{
			type: String,
			value: ''
		},
		type:{
			type: String,
			value: 'text'
		},
		placeholder:{
			type: String,
			value: ''
		},
		err:{
			type: String,
			value: ''
		},
		name:{
			type: String,
			value: ''
		},
		rule:{
			type: String,
			value: ''
		},
		value:{
			type: String,
			value: ''
		}
	},




	// 生命周期函数，可以为函数，或一个在methods段中定义的方法名
	attached: function () {
		//处理普通的组件
		this.setData({
			name:this.data.name,
			iconSrc:this.data.icon,
			type:this.data.type,
			placeholder:this.data.placeholder,
			err:this.data.err,
			rule:this.data.rule,
			value:this.data.value,
		});




	}, // 此处attached的声明会被lifetimes字段中的声明覆盖
	ready: function() { },



});



export default b_input;