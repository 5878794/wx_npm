//index.js
const app = getApp();
// import server from '../../lib/server.js';
// import {ajax,api} from '../../lib/ajax.js';
import sys from '../../lib/sys.js';
import $ from '../../lib/jq.js';


Page({
	data: {
		input:{
			select:33
		},
		selectData:[
			{key:11,value:'a'},
			{key:22,value:'b'},
			{key:33,value:'c'},
			{key:44,value:'d'},
			{key:55,value:'e'}
		]
	},

	onLoad: function() {
		console.log(this.selectComponent('#name'))


		// $('#name').data({tt:123});
		// console.log($('#name').data('tt'));
		// console.log($('#name').data());



	},
	async login(e){
		let rs = await server.login1();
		console.log(rs)

	},
	inputMyChange(e){
		console.log(e);
		console.log(e.detail.value)

	},


	getVal(){
		// console.log($('#select').val())
		//
		// $('#select').val(55)
		//
		// console.log($('#select').val())
		// $('#name').attr({icon:'../../images/4@1x.png'});

		// console.log($('#name').attr());

		// console.log($('#name').attr('icon'));

		// console.log($('#name').attr('rule'));


		console.log($('#name').attr('rule'))

		this.submit().then().catch(async e=>{
			await sys.alert(e.msg);
			await sys.alert(e.id);
		})

	},


	async submit(){

		await $('#name').check();

		console.log('can submit!!!')


	}


})
