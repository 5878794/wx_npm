
//map对象 <map></map>
// @param:map    map = wx.createMapContext('',this);   id,组件内传this


import qqMapWx from './qqmap-wx-jssdk';
let TxKey = 'H3HBZ-PJACP-LXUDT-LEBRK-7NHW2-IPF3L',
	mapSDK = new qqMapWx({key:TxKey});


let lib = {
	//获取地图中心点坐标  map 为地图对象
	getCenterPointer(map){
		return new Promise((success,error)=>{
			map.getCenterLocation({
				success(e){
					success({
						lat:e.latitude,
						lon:e.longitude
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
						lon:rs.longitude
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
		let {map,lat,lon} = opt;

		return new Promise((success,error)=>{
			map.moveToLocation({
				longitude:lon,
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
		let {map,lat,lon,name} = opt;

		return new Promise((success,error)=>{
			map.openMapApp({
				longitude:lon,
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
	//导航 用的sdk  返回路径点
	direction(opt){
		let {toLat,toLon,fromLat,fromLon} = opt;

		return new Promise((success,error)=>{
			mapSDK.direction({
				mode: 'driving',//可选值：'driving'（驾车）、'walking'（步行）、'bicycling'（骑行），不填默认：'driving',可不填
				from:{
					latitude: fromLat,
					longitude: fromLon
				},        //默认当前位置
				to:{
					latitude: toLat,
					longitude: toLon
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
	//显示所有点
	showAllPoint(opt){
		let {map,points,padding=[20,20,20,20]} = opt;

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
	}


};

export default lib;