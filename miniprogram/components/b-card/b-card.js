
import sys from '../../lib/sys';


Component({
    properties: {
	    sizeType:{
	    	type:String,
		    value:'compressed'    //original,compressed  原图、压缩
	    },
	    sourceType:{
	    	type:String,
		    value:'album,camera'    //album,camera  相册、相机
	    },
	    placeholder:{
	    	type:String,
		    value:''
	    },
	    rule:{
	    	type:String,
		    value:''
	    }
    },
    data: {
	    value:''
    },
	observers:{

	},

	attached(){

	},


    methods: {
	    chooseImage(e){
	    	let _this = this;

		    wx.chooseImage({
			    count:1,
			    sizeType:this.data.sizeType.split(','),
			    sourceType:this.data.sourceType.split(','),
			    success:function(rs){
			    	let file = rs.tempFiles[0],
					    src = file.path,
					    size = file.size;

				    _this.setData({
						value:src
				    });
			    }
		    });
	    },
	    value(value){
	    	this.setData({
			    value:value
		    })
	    }
    }
});