// components/chooseOne/index.js
Component({
	/**
	 * 组件的属性列表
	 */
	properties: {
		selectData:{
			type:Array,
			value:[{key:'是',val:'是'},{key:'否',val:'否'}]
		},
		value:{
			type:[Number,String],
			value:''
		}
	},

	observers:{
		value(key){
			if(!key){return;}

			let n=0;
			this.data.selectData.map((rs,i)=>{
				if(rs.key == key){
					n =i;
				}
			});

			let temp = new Array(2);
			temp[n] = 'select';

			this.setData({
				select:temp
			})
		}
	},

	data:{
		select:['select','']
	},
	/**
	 * 组件的初始数据
	 */


	/**
	 * 组件的方法列表
	 */
	methods: {

		chooseFn(e){
			let val = e.currentTarget.dataset.n;
			let selects = new Array(2);
			selects[val] = 'select';
			this.setData({
				select:selects
			});


			let data = this.data.selectData[val];
			let myEventDetail = {value:data.key}; // detail对象，提供给事件监听函数
			let myEventOption = {}; // 触发事件的选项
			this.triggerEvent('mychange', myEventDetail, myEventOption)
		}
	}
});
