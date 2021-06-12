

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

	}
};



export default imgHandler;