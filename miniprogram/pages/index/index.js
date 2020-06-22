//index.js
const app = getApp();
import server from '../../lib/server.js';
import {ajax,api} from '../../lib/ajax.js'



Page({
  data: {

  },

  onLoad: function() {


    
  },
  async login(e){
    let rs = await server.login1();
    console.log(rs)
      
  }


})
