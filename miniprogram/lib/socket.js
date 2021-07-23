
import setting from './setting'

let socket = {
	catchList:[],
	isReady:false,
	connect(){
		return new Promise((success,error)=>{
			wx.connectSocket({
				url: setting.socketServerUrl,
				success(){
					success();
				},
				fail(e){
					error(e);
				}
			})
		})
	},
	addEvent(callback){
		wx.onSocketOpen(()=>{
			this.isReady = true;
			//发送缓存的数据
			console.log('socket connect ok');
			this.sendCatchData();
		});

		wx.onSocketMessage(rs=>{
			rs = rs.data || '{}';
			rs = JSON.parse(rs);
			if(rs.code == 1){
				rs = rs.data || {};
				callback(rs)
			}
			// console.log('收到信息')
			// console.log(rs)
		});

		wx.onSocketError(e=>{
			console.log('err');
			console.log(e);
		});

		wx.onSocketClose(e=>{
			this.isReady = false;
		})
	},
	close(){
		return new Promise((success,error)=>{
			// console.log('关闭socket连接')
			wx.closeSocket({
				code:1000,
				reason:'用户主动关闭',
				success(){
					success();
				},
				fail(){
					error();
				}
			})
		})
	},
	sendMsg(data){
		if(!this.isReady){
			this.catchList.push(data);
			return;
		}

		return new Promise((success,error)=>{
			// console.log('send');
			// console.log(JSON.stringify(data))
			wx.sendSocketMessage({
				data:JSON.stringify(data),
				success(rs){
					success(rs);
				},
				fail(e){
					this.catchList.push(data);
					error(e);
				}
			})
		})
	},
	sendCatchData(){
		let _this = this;

		let getData = function(){
			if(_this.catchList.length != 0){
				let val = _this.catchList.splice(0,1);
				val = val[0];
				send(val);
			}
		};

		let send = function(data){
			_this.sendMsg(data).then(rs=>{
				getData();
			}).catch(e=>{

			})
		};

		getData();
	}

};



export default socket;