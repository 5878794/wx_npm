
//权限主动申请
// scope	对应接口	描述
// scope.userInfo	wx.getUserInfo	用户信息
// scope.userLocation	wx.getLocation, wx.chooseLocation	地理位置
// scope.userLocationBackground	wx.startLocationUpdateBackground	后台定位
// scope.address	wx.chooseAddress	通讯地址（已取消授权，可以直接调用对应接口）
// scope.invoiceTitle	wx.chooseInvoiceTitle	发票抬头（已取消授权，可以直接调用对应接口）
// scope.invoice	wx.chooseInvoice	获取发票（已取消授权，可以直接调用对应接口）
// scope.werun	wx.getWeRunData	微信运动步数
// scope.record	wx.startRecord	录音功能
// scope.writePhotosAlbum	wx.saveImageToPhotosAlbum, wx.saveVideoToPhotosAlbum	保存到相册
// scope.camera	camera 组件	摄像头


//申请 userLocation 权限时还需要在json中配置
// "permission": {
// 	"scope.userLocation": {
// 		"desc": "你的位置信息将用于地图选点"
// 	}
// }

//调用
// import authorize from "../../lib/authorize";
// await authorize('userInfo');
const authsName = {
	"userInfo": "用户信息",
	"userLocation": "地理位置",
	"userLocationBackground": "后台定位",
	"address": "通讯地址",
	"invoiceTitle": "发票抬头",
	"invoice": "获取发票",
	"werun": "微信运动步数",
	"record": "录音功能",
	"writePhotosAlbum": "保存到相册",
	"camera": "摄像头"
};



import sys from './sys';

let authorize = {
	async init(key){
		let setting = await this.getSysSetting();

		if(!setting['scope.'+key]){
			//需要申请权限
			let rs = await this.setSysAuthorize(key);

			if(rs.state){
				return {
					state:true,
					msg:''
				};
			}else{
				return {
					state:false,
					msg:rs.msg
				}
			}
		}else{
			return {
				state:true,
				msg:''
			};
		}
	},
	//获取授权信息
	getSysSetting(){
		return new Promise(success=>{
			wx.getSetting({
				success(res){
					success(res.authSetting)
				}
			})
		});
	},
	//申请权限  同意、不同意都返回成功
	setSysAuthorize(key){
		let _this = this;
		return new Promise((success,error)=>{
			wx.authorize({
				scope: 'scope.'+key,
				success () {
					// 用户已经同意小程序使用录音功能，后续调用 wx.startRecord 接口不会弹窗询问
					success({
						state:true,
						msg:''
					});
				},
				async fail(e){
					let text = '点击 “去设置” 按钮，打开 “' + authsName[key] + '” 的权限设置界面';

					await sys.confirm(text,'权限申请','去设置');

					let rs = await _this.openSetting(key);
					if(rs.state){
						success({
							state:true,
							msg:''
						});
					}else{
						success({
							state:false,
							msg:rs.msg
						});
					}

				}
			})
		})
	},
	//打开权限设置页面  需要在tap事件中处理
	openSetting(key){
		key = 'scope.'+key;
		return new Promise((success,error)=>{
			wx.openSetting({
				success: res => {
					if (res.authSetting[key]){
						success({
							state:true,
							msg:''
						});
					}else{
						success({
							state:false,
							msg:'未授权'
						});
					}
				},
				fail: async res => {
					let msg = '打开设置失败，请从小程序右上角打开。';
					success({
						state:false,
						msg:msg
					});
				}
			});
		})
	}
};


export default async function(opt){
	return await authorize.init(opt);
};