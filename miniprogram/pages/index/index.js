//index.js
const app = getApp();
import server from '../../lib/server.js';



Page({
  data: {

  },

  onLoad: function() {


    
  },
  async login(e){
    let rs = await server.login1();
    console.log(rs)
      
  },
    getPhoneNumber(e) {
        console.log(e.detail.errMsg)
        console.log(e.detail.iv)
        console.log(e.detail.encryptedData)
    }


})
