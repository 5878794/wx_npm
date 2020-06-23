//index.js
const app = getApp();
import server from '../../lib/server.js';
import {ajax,api} from '../../lib/ajax.js'



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


    
  },
  async login(e){
    let rs = await server.login1();
    console.log(rs)
      
  },
  inputMyChange(e){
    console.log(e);
    console.log(e.detail.value)

  }


})
