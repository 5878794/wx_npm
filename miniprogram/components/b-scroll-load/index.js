// components/b-scroll-load/index.js
Component({
	/**
	 * 组件的属性列表
	 */
	properties: {
		canPushLoadMore:{
			type:Boolean,
			value:true
		},
		canPullRefresh:{
			type:Boolean,
			value:false
		}
	},
	observers:{
		canPullRefresh(e){
			// console.log(e)
		}
	},

	attached(){
		this.loadEnd = false;       //是否全部分页加载完成
		this.setData({
			bottomText:'正在加载中'
		});
	},
	/**
	 * 组件的初始数据
	 */
	data: {
		loadError:false,         //加载出错
		hidden:'hidden',         //加载文字部分初始隐藏
		hiddenLoad:''            //加载动画不隐藏
	},

	/**
	 * 组件的方法列表
	 */
	methods: {
		topFn(){
			this.isRefreshing = true;
			this.triggerEvent('RefreshFn', {component:this}, {});
		},
		bottomFn(){
			if(this.loadingMore ||  //正在加载中
				this.loadEnd   || //全部加载完成
				this.isRefreshing  //正在下拉刷新页面
			)
			{
				return;
			}
			this.loadingMore = true;
			this.setData({
				hidden:''
			});

			this.triggerEvent('LoadMoreFn', {component:this}, {});
		},
		//刷新完成
		refreshEnd(){
			this.isRefreshing = false;
			this.setData({
				refreshState:false
			})
		},
		//加载下一页完成
		loadMoreEnd(){
			this.loadingMore = false;
			this.setData({
				hidden:'hidden'
			});

		},
		//加载失败调用
		loadMoreError(){
			// this.loadingMore = false;
			this.setData({
				loadError:true
			});
		},
		//加载完成  没有更多页面
		noMoreData(){
			this.loadingMore = false;
			this.loadEnd = true;

			this.setData({
				bottomText:'没有更多数据',
				hiddenLoad:'hidden',
				hidden:''
			});
		},
		//加载失败  点击重试
		errReLoad(){
			this.setData({
				loadError:false
			});
			this.triggerEvent('LoadMoreFn', {component:this}, {});
		}
	}
});
