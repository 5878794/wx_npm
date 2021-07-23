

const fsm = wx.getFileSystemManager();


let imgHandler = {
	base64ToImgUrl(base64Data,filename){
		let FILE_BASE_NAME = filename || 'temp_'+new Date().getTime();
		const [, format, bodyData] = /data:image\/(\w+);base64,(.*)/.exec(base64Data) || [];

		return new Promise((success,error)=>{
			if (!format) {
				error('base64格式错误');
			}
			const filePath = `${wx.env.USER_DATA_PATH}/${FILE_BASE_NAME}.${format}`;
			const buffer = wx.base64ToArrayBuffer(bodyData);
			fsm.writeFile({
				filePath,
				data: buffer,
				encoding: 'binary',
				success() {
					success(filePath);
				},
				fail() {
					error('图片生成失败');
				},
			});
		});

	},
	canvasToTempFilePath(opt) {
		return new Promise((success,error)=>{
			wx.canvasToTempFilePath({
				// x: 100,
				// y: 200,
				// width: 50,
				// height: 50,
				// destWidth: 100,      //输出的图片的宽度
				// destHeight: 100,     //输出的图片的高度
				canvasId: 'myCanvas',
				// canvas:'',		//画布标识，传入 canvas 组件实例 （canvas type="2d" 时使用该属性）。
				success(res) {
					console.log(res.tempFilePath)
					success(res.tempFilePath);
				},
				fail(e){
					error(e);
					console.log(e);
				}
			})
		})
	}
};



export default imgHandler;