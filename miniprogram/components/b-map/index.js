import mapLib from '../../lib/mapLib';
import imgHandler from "../../lib/imageHandler";




//起点 终点 图标img
let qdImg = 'data:image/png;base64,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',
	zdImg = 'data:image/png;base64,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';


Component({
	behaviors: [],
	options: {
		// styleIsolation: 'apply-shared'      //外部样式会影响内部样式，组件样式不影响外部
	},

	properties: {
		mapHeight:{
			type:String,
			value:"100%"
		},
		mapScale:{
			type:Number,
			value: 13
		},
		directionTo:{
			type:Object,
			value:{}
		},
		directionFrom:{
			type:Object,
			value:{}
		}
	},

	data: {
		longitude:'',
		latitude:'',
		polyline:[],
		map_scale:13
	},
	observers: {
		mapHeight(param){
			if(param.indexOf("%")>-1 || param.indexOf('rpx')>-1){

			}else{
				param = param+'rpx'
			}


			this.setData({
				map_height:param
			})
		},
		mapScale(param){
			this.setData({
				map_scale:param
			})
		},
		directionTo(param){
			this.directionChange(param,'to');

		},
		directionFrom(param){
			this.directionChange(param,'from');
		}
	},
	//准备好
	ready(){

	},

	map:null,

	//载入
	async attached(){
		this.map = wx.createMapContext('',this);

		this.showMyLocationFn().catch(e=>{
			console.log(e);
			console.log('定位失败！');
		});

	},
	methods: {
		directionChange(param,type){
			param = param || {};
			let lat = param.lat,
				lng = param.lng;

			if(!this.fromLocation){
				this.fromLocation = {};
			}
			if(!this.toLocation){
				this.toLocation = {};
			}

			if(type == 'from'){
				this.fromLocation = {lat,lng};
			}else{
				this.toLocation = {lat,lng};
			}

			let fromLat = this.fromLocation.lat,
				fromlng = this.fromLocation.lng,
				toLat = this.toLocation.lat,
				tolng = this.toLocation.lng;

			if(fromLat && fromlng && toLat && tolng){
				this.directionFn(fromLat,fromlng,toLat,tolng).catch(e=>{
					console.log(e)
				});
			}
		},

		//显示当前的定位
		async showMyLocationFn(){
			await mapLib.isReady();

			//获取定位
			let {lat,lng} = getApp().location;
			//在地图中间显示定位点
			await mapLib.moveMapToLocation({
				map:this.map,
				lat:lat,
				lng:lng
			});

			this.setData({
				longitude:lng,
				latitude:lat
			});
		},
		//导航到 经纬度
		async directionFn(fromLat,fromlng,toLat,tolng){
			await this.showMyLocationFn();
			//通过腾旭地图sdk 获取导航路径
			let {pl,distance,duration} = await mapLib.direction({
				fromLat:fromLat,
				fromlng:fromlng,
				toLat:toLat,
				tolng:tolng
			});
			//显示导航到地图
			this.setData({
				polyline: [{
					points: pl,
					color: '#089e50',
					arrowLine:true, //带箭头
					width: 6,
					borderColor:'#fff'
				}]
			});

			//显示完整导航路径
			await mapLib.showAllPoint({
				map:this.map,
				points:pl
			});

			//计算起始点和终点 并加固定图标
			let sp = pl[0],
				ep = pl[pl.length-1];

			let qdIcon = await imgHandler.base64ToImgUrl(qdImg),
				zdIcon = await imgHandler.base64ToImgUrl(zdImg),
				p1 = {
					id:1,
					latitude:sp.latitude,
					longitude:sp.longitude,
					iconPath:qdIcon
				},
				p2 = {
					id:2,
					latitude:ep.latitude,
					longitude:ep.longitude,
					iconPath:zdIcon
				};

			await mapLib.pointAddIcon({
				map:this.map,
				points:[p1,p2],
				del:true
			});

		}
	}
});
