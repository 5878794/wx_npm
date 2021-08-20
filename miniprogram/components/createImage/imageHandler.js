
import authorize from "./authorize";

export default {
	//获取图片信息  宽高等
	getImageInfo(src){
		return new Promise(async (success,error)=>{
			if(src.indexOf('http')== 0 || src.indexOf('https')==0){
				src = await this.downloadImg(src);
			}

			if(!src){
				success('');
			}

			wx.getImageInfo({
				src:src,
				success:function(image) {
					image.path = src;
					success(image);
				},
				fail(e){
					console.log(e);
					success('');
				}
			});
		})
	},
	//下载网络图片  需要配置 下载域名
	downloadImg(url){
		return new Promise((success,error)=>{
			wx.downloadFile({
				url: url, //仅为示例，并非真实的资源
				success: (res) => {
					if (res.statusCode === 200) {
						let src = res.tempFilePath;
						success(src);

					}else{
						console.log('文件下载失败:'+url);
						success('');
					}
				},
				fail(e){
					console.log('文件下载失败:'+url);
					success('');
				}
			});
		});
	},
	//画布转图片路径
	canvasToTempFile(canvasId,components){
		return new Promise((success,error)=>{
			wx.canvasToTempFilePath({
				canvasId: canvasId,
				success: res => {
					let src = res.tempFilePath;
					success(src);
				},
				fail: err => {
					error(err);
				}
			},components);
		});
	},
	//保存到相册
	async saveImgToAlbum(src){
		await authorize('writePhotosAlbum');

		return new Promise((success,error)=>{
			wx.saveImageToPhotosAlbum({
				filePath: src,
				success: function () {
					success();
				},
				error(){
					error('保存失败!');
				}
			});
		});
	}
};
