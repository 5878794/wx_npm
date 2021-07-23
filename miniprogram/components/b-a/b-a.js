
import sys from '../../lib/sys';

Component({
	options: {},
    properties: {
		type:{          //打开页面的类型  page tab
			type:String,
			value:'page'
		},
	    url:{           //打开页面的地址  tab页面不能带参数
			type:String,
		    value:''
	    },
	    localData:{     //tab页面不能带参数  走本地缓存
			type:String,
		    value:''
	    },
	    boxType:{
			type:String,
		    value:''
	    },
	    target:{
			type:String,
		    value:''
	    }
    },
    data: {

    },
	observers:{
		boxType(param){
			this.setData({
				className:param
			});
		}
	},

	attached(){

	},


    methods: {
	    async onclick(e){
	    	let target = e.currentTarget.dataset,
			    url = target.url,
			    type = target.type,
			    _target = target.target,
			    localData = target.localdata;

	    	if(!url){return;}

	    	//判断是否是电话
		    if(url.indexOf('tel:')>-1){
		    	let phone = url.split(':')[1];
			    wx.makePhoneCall({
				    phoneNumber: phone //仅为示例，并非真实的电话号码
			    });
		    	return;
		    }


	    	if(type=='tab'){
			    if(localData){
				    await sys.setTabParam(localData)
			    }
			    wx.switchTab({url:url});

		    }else{
	    		if(_target == 'self'){
				    wx.redirectTo({url:url});
			    }else{
				    wx.navigateTo({url:url});
			    }
		    }
	    }
    }
});