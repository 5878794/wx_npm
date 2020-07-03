
import b_input from '../__publish/b_input.js';

Component({
	behaviors: [b_input],
	options: {
		styleIsolation: 'apply-shared'      //外部样式会影响内部样式，组件样式不影响外部
	},
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


			let myEventDetail = {value:val}; // detail对象，提供给事件监听函数
			let myEventOption = {}; // 触发事件的选项
			this.triggerEvent('mychange', myEventDetail, myEventOption)

		},

		getValue(){
			return this.data.selectKey[this.data.selectIndex];
		},


		value(value){
			let index = this.data.selectKey.indexOf(value);

			if(index == -1){return;}


			this.setData({
				selectIndex:index
			});
			let val = this.getValue();
			this.setData({
				value:val
			});
		}
	}
});