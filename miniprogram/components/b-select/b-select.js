
import b_input from '../__publish/b_input.js';

Component({
	behaviors: [b_input],

    properties: {
	    selectData:{
		    type:Array,
		    value:[]
	    }
    },
    data: {

    },

	attached(){
		//处理select
		let data = this.data.selectData,
			newData = [],
			newKey = [],
			selected = this.data.value,
			selectIndex = 0;
		data.map((rs,i)=>{
			if(rs.key == selected){
				selectIndex = i;
			}
			newData.push(rs.value);
			newKey.push(rs.key);
		});
		this.setData({
			selectValue:newData,
			selectKey:newKey,
			selectIndex:selectIndex,
			value:selected
		});

	},


	methods: {
		onSelect(e){

			this.setData({
				selectIndex:e.detail.value
			});
			let val = this.getValue();
			this.setData({
				value:val
			});


			// var myEventDetail = {value:val}; // detail对象，提供给事件监听函数
			// var myEventOption = {}; // 触发事件的选项
			// this.triggerEvent('mychange', myEventDetail, myEventOption)

		},

		getValue(){
			return this.data.selectKey[this.data.selectIndex];
		}
	}
});