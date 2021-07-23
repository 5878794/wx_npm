const globalData = getApp().globalData;
import SETTING from './setting.js';
import sys from './sys';

let ajax = {
    //请求函数主体
    run(url, data, type, success, error) {
        url = SETTING.serverUrl + url;
        let token = sys.getSessionData('catchData') || {};
        token = token.token || '';

        wx.request({
            url: url,
            dataType: 'json',
            data: data,
            timeout: 20000,
            method: type,
            responseType: 'text',
            header: {
                // 'content-type': 'application/json' // 默认值
                'token': token,
                'content-type': 'application/x-www-form-urlencoded; charset=UTF-8'
            },
            success: function (rs) {
                //处理微信的返回
                if(rs.statusCode != 200){
                    error('服务器异常，请稍后在试！');
                    return;
                }

                rs = rs.data || {};

                //处理接口的返回
                if(rs.code != 1){
                    error(rs.msg);
                }

                success(rs.data);
            },
            fail: function (rs) {
                console.log(rs);
                error("网络错误,无法连接服务器。");
            }
        })
    },
    //发送一堆请求
    async send(arr) {

        return new Promise((success, error) => {
            Promise.all(arr).then(rs => {
                success(rs)
            }).catch(rs => {
                error(rs);
            })
        })
    }

};

let api = {
    //检查是否绑定过
    checkIsBind:{url:'weixin/check',type:'post'},
    //绑定账号
    bindUsername:{url:'weixin/wxLogin',type:'post'},
    //获取首页数据
    getIndexData:{url:'wx_index/disease_count',type:'get'},
    //获取报单的字典
    getReportDist:{url:'wx_disease/info',type:'get'},
    //创建病害
    createDisease:{url:'wx_disease/create',type:'post'},
    //获取待办事项
    getTodoList:{url:'wx_index/backlog',type:'get'},
    //获取病害跟进(所有未关闭的)
    getFollowList:{url:'wx_index/disease_list',type:'get'},
    //获取12345待处理
    getComplainList:{url:'wx_complaint/complain',type:'get'},
    //获取病害详情
    getInfo:{url:'wx_disease/getDiseaseInfo',type:'get'},
    //获取12345详情
    get12345Info:{url:'wx_complaint/complain_info',type:'get'},
    //12345驳回
    rejectFrom12345:{url:'wx_complaint/reject',type:'post'},
    //历史病害
    getHistoryList:{url:'wx_index/history_declare_list',type:'get'},

    //催单
    reminders:{url:'wx_disease/reminder',type:'post'},
    //联系投诉人截图确认
    contactTheComplainant:{url:'wx_disease/contact',type:'post'},
    //施工完成 截图确认
    constructionCompleted:{url:'wx_disease/complete',type:'post'},
    //关闭病害
    closeDisease:{url:'wx_disease/close',type:'post'},
    //复核通过
    reviewSuccess:{url:'wx_disease/review',type:'post'},
    //复核不通过
    reviewError:{url:'wx_disease/xuncha_rejected',type:'post'},
    //审核不通过
    auditError:{url:'wx_disease/rejected',type:'post'},
    //审核通过
    auditSuccess:{url:'wx_disease/audit',type:'post'},
    //批量审核
    bulkSubmission:{url:'wx_disease/batch_audit',type:'post'},
    //核验通过
    verificationSuccess:{url:'wx_disease/jianli_check',type:'post'},
    //核验驳回
    verificationError:{url:'wx_disease/jianli_not_check',type:'post'},

    //获取指定id的列表数据
    getListInfoById:{url:'wx_index/disease_id',type:'get'}

};






api = new Proxy(api, {
    get(target, key, receiver) {
        return function (data) {
            return new Promise((success, error) => {
                let url = target[key].url,
                    type = target[key].type || 'post';

                //判断是否含有一堆大括号,大括号内为参数
                let delArray = [];
                url = url.replace(/{(.+?)}/g,function(key){
                    key = key.substr(1,key.length-2);
                    delArray.push(key);
                    return data[key];
                });

                //删除data中的对象
                delArray.map(rs=>{
                    delete data[rs];
                });


                ajax.run(url, data, type, success, error);
            })
        }
    }
});




export { ajax, api };