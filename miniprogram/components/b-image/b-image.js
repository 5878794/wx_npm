
import input from '../__publish/b_input.js';
import sys from '../../lib/sys';
import imageAddWatermark from '../../lib/imageAddWatermark';


Component({
	behaviors: [input],
	options: {
		// styleIsolation: 'apply-shared'      //外部样式会影响内部样式，组件样式不影响外部
	},
    properties: {
	    nowBtnStyle:{
	    	type:String,
		    value:''
	    },
	    max:{
	    	type:String,
		    value:1
	    },
	    sizeType:{
	    	type:String,
		    value:'compressed'    //original,compressed  原图、压缩
	    },
	    sourceType:{
	    	type:String,
		    value:'album,camera'    //album,camera  相册、相机
	    },
	    showDel:{
	    	type:Boolean,
		    value:false
	    },
	    values:{
	    	type:Array,
		    value:[]
	    },
	    textWatermark:{       //默认启用水印  水印具体在imageAddWatermark中增加 默认添加日期
	    	type:Array,
		    value:[]            //[{x:'',y:'',text:'',size:''}]
	    }
    },
    data: {

    },
	observers:{
		values(prop){
			this.data.values = prop;
			this.setNowValue();
		}
	},

	attached(){
		this.setNowValue();
	},


    methods: {
		setNowValue(){
			let oldValue = this.data.values;
			let val = [];
			oldValue.map(rs=>{
				val.push(rs.src);
			});
			this.setData({
				value:val.join(',')
			})
		},
	    chooseImage(e){
	    	//判断点击的添加按钮还是图像本身
	    	let n = e.currentTarget.dataset.n,
			    _this = this,
			    ctx = wx.createCanvasContext('__canvas__',this),
	    	    canvasId = '__canvas__';


		    // query.select('#__canvas__').boundingClientRect(function(res){
			//     console.log(res);
		    // }).exec();

		    wx.chooseImage({
			    count:1,
			    sizeType:this.data.sizeType.split(','),
			    sourceType:this.data.sourceType.split(','),
			    success:async function(rs){
			    	let file = rs.tempFiles[0],
					    src = file.path,
					    size = file.size;


			    	let {width,height} = await _this.getImageInfo(src);
			    	_this.setData({
					    canvas:{width,height}
				    });

			    	if(_this.data.textWatermark.length != 0){
					    src = await imageAddWatermark.init(canvasId,src,ctx,width,height,_this,_this.data.textWatermark);
				    }

				    let oldValue = _this.data.values || [];
				    if(n || n==0){
					    oldValue[n] = {src,size};
				    }else{
					    oldValue.push({src,size});
				    }
				    _this.setData({
					    values:oldValue
				    });
				    _this.setNowValue();
			    }
		    });
	    },
	    showImage(e){
		    let n = e.currentTarget.dataset.n,
			    _this = this,
			    imgObj = this.data.values[n] || {},
			    imgSrc = imgObj.src,
			    allImages = [];
		    this.data.values.map(rs=>{
		    	allImages.push(rs.src);
		    });

		    if(imgSrc){
	            sys.openImage(allImages,imgSrc);
		    }
	    },
	    del(e){
	    	let n = e.currentTarget.dataset.n;
			let oldValue = this.data.values;

			oldValue.splice(n,1);
			this.setData({
				values:oldValue
			});
		    this.setNowValue();
	    },

	    //设置value用
	    value(value){
		    this.setData({
			    value:value
		    });
		    let newValue = (value)? value.split(',') : [];
		    let backVal = [];
		    newValue.map(rs=>{
		    	backVal.push({
				    src:rs,size:''
			    })
		    });
		    this.setData({
			    values:backVal
		    })
	    },

	    getImageInfo(src){
		    return new Promise((success,error)=>{
			    wx.getImageInfo({
				    src:src,
				    success(rs){
					    success({
						    width:rs.width,
						    height:rs.height
					    });
				    },
				    fail(e){
					    error(e);
				    }
			    })
		    });
	    },
    }
});