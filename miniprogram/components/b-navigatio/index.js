
Component({
	behaviors: [],
	options: {
		// styleIsolation: 'apply-shared'      //外部样式会影响内部样式，组件样式不影响外部
	},

	properties: {
		showBack:{
			type:Boolean,
			value:true
		},
		title:{
			type:String,
			value:''
		},
		type:{
			type:String,
			value:'black'
		}
	},

	data: {
		titleName:'',
		showBackType:'',
		iosStyle:'',
		backIcon:'./back.png',
		color:'#333',
		otherStyle:'',
		btnStyle:'',
		imgStyle:''
	},
	observers: {
		showBack(param){
			let className = (param)? '' : 'hidden';
			this.setData({
				showBackType:className
			})
		},
		title(param){
			this.setData({
				titleName:param
			})
		},
		type(param){
			if(param == 'black'){
				this.setData({
					backIcon:'./back.png',
					color:'#333'
				})
			}else{
				this.setData({
					backIcon:'./back1.png',
					color:'#fff'
				})
			}
		}
	},
	//准备好
	ready(){

	},


	//载入
	async attached(){
		//没有历史记录
		let pageLength = getCurrentPages().length;

		let sys = wx.getSystemInfoSync();
		sys = sys.system.toLocaleLowerCase();
		if(sys.indexOf('ios') == -1){
			//android
			this.setData({
				otherStyle:'text-align:left;font-size:32rpx;font-weight:400;',
				btnStyle:'width:80rpx;',
				iosStyle:'height:130rpx;'
			});

			if(pageLength == 1){
				this.setData({
					imgStyle:'display:none;',
					btnStyle:'width:30rpx;'
				})
			}
		}else{
			if(pageLength == 1){
				this.setData({
					imgStyle:'display:none;',
				})
			}
		}



	},
	methods: {
		backFn(){
			wx.navigateBack({
				delta: 1
			})
		}
	}
});
