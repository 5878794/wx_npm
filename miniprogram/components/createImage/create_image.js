// components/createImage/create_image.js

import imageLib from './imageHandler';
import qrcode from './qrcode';


Component({
	/**
	 * 组件的属性列表
	 */
	properties: {
		items:{
			type:Array,
			value:[]
		}
	},
	observers:{
		items(newData){
			if(newData.length != 0){
				this.init();
			}
		}
	},

	async attached(){
	},

	/**
	 * 组件的初始数据
	 */
	data: {
		canvasItems:[]
	},

	methods: {
		async init(){
			this.canvasId = '__createImage_canvas__';
			this.ctx = wx.createCanvasContext(this.canvasId, this);

			let style = await this.getCanvasStyle();
			this.width = style.width;
			this.height = style.height;
			this.winWidth = wx.getSystemInfoSync().windowWidth;

			this.setData({
				canvasItems:this.data.items
			});
			this.clearCanvas();
			await this.draw();
		},
		getCanvasStyle(){
			let query = wx.createSelectorQuery().in(this);
			return new Promise(success=>{
				setTimeout(e=>{
					query.select('#'+this.canvasId).boundingClientRect(rs => {
						success(rs);
					}).exec();
				},2000)

			});
		},
		clearCanvas(){
			this.ctx.clearRect(0,0,this.width,this.height);
		},

		async draw(){
			for(let i=0,l=this.data.canvasItems.length;i<l;i++){
				let thisItem = this.data.canvasItems[i];
				if(thisItem.type=='img'){
					let info = await imageLib.getImageInfo(thisItem.src);
					if(info){
						this.drawImage(thisItem,info);
					}
				}else if(thisItem.type=='text'){
					this.drawText(thisItem);
				}else if(thisItem.type=='qrcode'){

					let src = await this.drawQrCode(thisItem);
					let info = {
						path:src,
						width:this.winWidth,
						height:this.winWidth
					};

					this.drawImage(thisItem,info);
				}else if(thisItem.type=='bg'){
					this.drawBg(thisItem);
				}
			}


			let _this = this;
			this.ctx.draw(true,async function(){
				let outPath = await imageLib.canvasToTempFile(_this.canvasId,_this);
				let myEventDetail = {value:outPath}; // detail对象，提供给事件监听函数
				let myEventOption = {}; // 触发事件的选项
				_this.triggerEvent('success', myEventDetail, myEventOption);
			});



			//
			// console.log(outPath)
			// let temp = await imageLib.getImageInfo(outPath);
			// console.log(temp)
		},
		rpx2px(val){
			return val / 750 * this.winWidth;
		},
		drawImage(data,img){
			let x = this.rpx2px(data.x),
				y = this.rpx2px(data.y),
				w = this.rpx2px(data.width),
				h = this.rpx2px(data.height);
			this.ctx.drawImage(img.path,0,0,img.width,img.height,x,y,w,h);
		},
		drawText(data){
			let x = this.rpx2px(data.x),
				y = this.rpx2px(data.y),
				size = this.rpx2px(data.fontSize),
				color = data.color,
				text = data.text,
				lineWidth = data.lineWidth;

			this.ctx.setTextBaseline('top');
			this.ctx.setFontSize(size);
			this.ctx.setLineWidth(lineWidth);
			this.ctx.setFillStyle(color);
			this.ctx.fillText(text,x,y);
		},
		drawQrCode(data) {
			let w = this.winWidth,
				h = w,
				url = data.src,
				color = data.color || '#333,#fff';
			color = color.split(',');

			return new Promise((success,error)=>{
				new qrcode('__canvas_qrcode__', {
					text: url,
					usingIn:this,
					// image:'/images/bg.jpg',
					width: w,
					height: h,
					colorDark: color[0],
					colorLight: color[1],
					correctLevel: qrcode.CorrectLevel.H,
					callback(res){
						let path = res.path;
						success(path);
					}
				});
			});

		},
		drawBg(obj){
			this.ctx.setFillStyle(obj.color);
			this.ctx.fillRect(0, 0, this.width, this.height);
		}
	}
});
