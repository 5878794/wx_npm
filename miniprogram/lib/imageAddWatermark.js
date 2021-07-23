
//b-image组件用的插件   给文件加水印   返回图片路径  默认左上会加日期
// let newSrc = await imageAddWatermark.init(
// 	canvasId,       //canvas的id
// 	src,            //要加水印的图片地址   chooseImage返回的本地临时文件路径
// 	ctx,            //content对象   wx.createCanvasContext(canvasId,this)
// 	width,          //图片宽度
// 	height,         //图片高度
// 	_this,           //自定组件类
//  textWatermarks       //要加的水印   [{x:'',y:'',text:'',size:'',color1:'',color2:''}]
// );




import stamp2date from "./fn/stamp2date";

//文件加水印功能
let fn = {
	async init(canvasId,src,ctx,width,height,component,textWatermarks){
		this.canvasId = canvasId;
		this.ctx = ctx;
		this.image = src;
		this.imageWidth = width;
		this.imageHeight = height;
		this.component = component;
		this.textWatermarks = textWatermarks;


		//将图片写入画布
		return await this.writeImageToCanvas();

	},
	writeImageToCanvas(){
		return new Promise((success,error)=>{
			this.ctx.drawImage(this.image,0,0,this.imageWidth,this.imageHeight);

			// {x:'',y:'',text:'',size:'',color1:'',color2:''}

			this.ctx.setGlobalAlpha(0.8);
			this.textWatermarks.map(rs=>{
				this.ctx.setFontSize(rs.size);
				this.ctx.setLineWidth(10);
				this.ctx.setStrokeStyle(rs.color1);
				this.ctx.strokeText(rs.text,rs.x,rs.y);
				this.ctx.setFillStyle(rs.color2);
				this.ctx.fillText(rs.text,rs.x,rs.y);
			});
			this.ctx.setGlobalAlpha(1);





			this.ctx.draw('',e=>{
				setTimeout(e=>{
					wx.canvasToTempFilePath({
						x: 0,
						y: 0,
						width: this.imageWidth,
						height: this.imageHeight,
						canvasId: this.canvasId,
						fileType:'jpg',
						quality:0.8,
						success(res) {
							success(res.tempFilePath);
						},
						error(e){
							error(e);
						}
					},this.component)
				},200)
			});
		});
	}
};



export default fn;