


Component({
	behaviors: [],
	options: {
		styleIsolation: 'apply-shared',      //外部样式会影响内部样式，组件样式不影响外部
		virtualHost: true           //虚拟组件
	},
    properties: {
	    class:{
		    type:String,
		    value:''
	    },
	    btt:{
		    type:String,
		    value:''
	    },
	    style:{
	    	type:String,
		    value:''
	    }

    },
    data: {

    },

	attached(){
		console.log(this.data)
	},


    methods: {

		onclick(e){
			console.log(e)
		}


    }
});