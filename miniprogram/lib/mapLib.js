
//map对象 <map></map>
// @param:map    map = wx.createMapContext('',this);   id,组件内传this


import qqMapWx from './qqmap-wx-jssdk';
let TxKey = 'H3HBZ-PJACP-LXUDT-LEBRK-7NHW2-IPF3L',
	mapSDK = new qqMapWx({key:TxKey});


let lib = {
	hasLocation:false,
	tempLocationEvent:{},
	async isReady(){
		return new Promise(success=>{
			if(this.hasLocation){
				success();
				return;
			}

			this.tempLocationEvent = new Proxy({},{
				set(target, propKey, value, receiver){
					success();
					return Reflect.set(target, propKey, value, receiver);
				}
			});
		});
	},
	//全局调用的   放在app.js中   之后从 getApp().location中获取
	// this.location = {};
	// mapLib.getLocationAlways().then(rs=>{
	// 	console.log('定位启动。。。');
	// }).catch(e=>{console.log(e)});
	async getLocationAlways(){
		let {lat,lng} = await this.getLocation(),
			catchFn = function(lat,lng){
				getApp().location = {lat,lng};
			};
		catchFn(lat,lng);

		this.hasLocation = true;
		this.tempLocationEvent.t = true;

		wx.onLocationChange(function(rs){
			let lat = rs.latitude,
				lng = rs.longitude;
			catchFn(lat,lng);
		})
	},
	//获取地图中心点坐标  map 为地图对象
	getCenterPointer(map){
		return new Promise((success,error)=>{
			map.getCenterLocation({
				success(e){
					success({
						lat:e.latitude,
						lng:e.longitude
					});
				},
				fail(){
					error('获取中心点失败');
				}
			})
		})
	},
	//获取当前定位
	getLocation(){
		return new Promise((success,error)=>{
			wx.getLocation({
				type:'gcj02',
				isHighAccuracy:true,
				success(rs){
					success({
						lat:rs.latitude,
						lng:rs.longitude
					});
				},
				fail(){
					error('获取定位失败');
				}
			})
		})
	},
	//移动地图中心点到指定坐标
	moveMapToLocation(opt){
		let {map,lat,lng} = opt;

		return new Promise((success,error)=>{
			map.moveToLocation({
				longitude:lng,
				latitude:lat,
				success(){
					success();
				},
				fail(){
					error('移动错误');
				}
			})
		})
	},
	//导航到指定坐标 （使用外部app）
	navigationToLocation(opt){
		let {map,lat,lng,name} = opt;

		return new Promise((success,error)=>{
			map.openMapApp({
				longitude:lng,
				latitude:lat,
				destination:name,
				success(rs){
					success();
				},
				fail(e){
					error('打开导航App失败');
				}
			})
		})

	},


	//路径规划 用的sdk  返回路径点
	direction(opt){
		let {toLat,tolng,fromLat,fromlng} = opt;

		return new Promise((success,error)=>{
			mapSDK.direction({
				mode: 'driving',//可选值：'driving'（驾车）、'walking'（步行）、'bicycling'（骑行），不填默认：'driving',可不填
				from:{
					latitude: fromLat,
					longitude: fromlng
				},        //默认当前位置
				to:{
					latitude: toLat,
					longitude: tolng
				},
				success(rs){
					rs = rs.result || {};
					rs = rs.routes || [];     //导航方案  多个
					rs = rs[0] || {};
					let distance = rs.distance,
						duration = rs.duration;
					rs = rs.polyline || [];     //路经点
					//路径点解压
					for (let i = 2,l = rs.length; i < l ; i++) {
						rs[i] = rs[i-2] + rs[i]/1000000
					}

					//将解压后的坐标放入点串数组pl中
					let pl = [];
					for (let i = 0,l=rs.length; i < l; i += 2) {
						pl.push({ latitude: rs[i], longitude: rs[i + 1] })
					}

					success({
						pl,             //
						distance,       //距离  米
						duration        //时间    分钟
					});
				},
				fail(e){
					console.log(e);
					error('路径规划失败');
				}
			})

		})
	},
	//地址搜索 用的sdk
	search(key,pageSize,pageIndex){
		pageSize = pageSize || 20;
		pageIndex = pageIndex || 1;
		return new Promise((success,error)=>{
			if(!key){
				success([]);
				return;
			}

			mapSDK.search({
				keyword:key,
				page_size:pageSize,
				page_index:pageIndex,
				success(res){
					// res = res.data;
					success(res);
				},
				fail(e){
					console.log(e);
					error(e);
				}
			})
		})
	},
	//输入时联想搜索  用的sdk
	//需要在  await this.isReady()
	inputSearch(key,pageSize,pageIndex){
		pageSize = pageSize || 20;
		pageIndex = pageIndex || 1;
		return new Promise((success,error)=>{
			if(!key){
				success([]);
				return;
			}

			let location = getApp().location,
				{lat,lng} = location;
			location = (lat)? lat+','+lng : '';

			mapSDK.getSuggestion({
				keyword:key,
				location:location,
				page_size:pageSize,
				page_index:pageIndex,
				success(res){
					// res = res.data;
					success(res);
				},
				fail(e){
					console.log(e);
					error(e);
				}
			})
		})
	},


	//显示所有点
	showAllPoint(opt){
		let {map,points,padding=[100,100,100,100]} = opt;

		return new Promise((success,error)=>{
			map.includePoints({
				points:points,
				padding:padding,
				success(){
					success();
				},
				fail(){
					console.log('err 显示全部点')
					error();
				}
			})
		})
	},
	//标记点 增加图标
	pointAddIcon(opt){
		// points =  [{
		//  id:'',
		//  latitude:'',
		//  longitude:'',
		//  iconPath:''
		// }]

		let {map,points,del=true} = opt;
		return new Promise(success=>{
			map.addMarkers({
				markers:points,
				clear:del,
				success(){
					success();
				},
				fail(){
					success();
				}
			})
		});
	},

	//经纬度反解位置名
	//注意：返回结果中的经纬度与传入的经纬度不同  已替换成传入的经纬度
	locationToAddress(opt){
		let {lat,lng} = opt;
		return new Promise((success,error)=>{
			mapSDK.reverseGeocoder({
				location:{
					latitude:lat,
					longitude:lng
				},
				success(rs){
					rs = rs.result || {};
					let title = rs.formatted_addresses.recommend,
						address = rs.address,
						info = rs.ad_info;
					info.title = title;
					info.address = address;
					info.location = opt;
					success(info);
				},
				fail(e){
					error(e);
				}
			})
		});
	},


	//使用插件打开 地图选点
	//https://lbs.qq.com/miniProgram/plugin/pluginGuide/locationPicker
	//
	//使用
	//const chooseLocation = requirePlugin('chooseLocation');
	// Page({
	// 		     // 从地图选点插件返回后，在页面的onShow生命周期函数中能够调用插件接口，取得选点结果对象
//      onShow () {
	// 	const location = chooseLocation.getLocation(); // 如果点击确认选点按钮，则返回选点结果对象，否则返回null
	// },
	// onUnload () {
	// 	// 页面卸载时设置插件选点数据为null，防止再次进入页面，geLocation返回的是上次选点结果
	// 	chooseLocation.setLocation(null);
	// }
	// })
	openChooseLocationPage(opt){
		let {lat,lng} = opt;

		const key = TxKey; //使用在腾讯位置服务申请的key
		const referer = '代驾平台'; //调用插件的app的名称
		const location = JSON.stringify({
			latitude: lat,
			longitude: lng
		});
		const category = '';

		wx.navigateTo({
			url: 'plugin://chooseLocation/index?key=' + key + '&referer=' + referer + '&location=' + location + '&category=' + category
		});
	},



};

export default lib;