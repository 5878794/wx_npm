
import server from "./server";
import setting from './setting';
import authorize from "./authorize";



let sys = {
    //延迟1秒显示loading 运行后自动关闭loading
    showLoadingRunDetail(obj, fn, notNeedLoading, param) {
        let showT = '',
            _this = this,
            showTimeoutFn = '',
            showLoading = function () {
                showTimeoutFn = setTimeout(e => {
                    showT = new Date().getTime();
                    _this.loading.show();
                }, 1000);

            },
            closeLoading = function () {
                //还没显示
                if (!showT) {
                    clearTimeout(showTimeoutFn);
                    return;
                }


                let et = new Date().getTime();
                if (et - showT > 1000) {
                    _this.loading.hide();
                } else {
                    let t = 1000 - et + showT;
                    setTimeout(e => {
                        _this.loading.hide();
                    }, t);
                }
            };


        if (!notNeedLoading) {
            showLoading();
        }
        obj[fn].call(obj, param).then(() => {
            if (!notNeedLoading) {
                closeLoading();
            }
        }).catch(e => {
            console.log(e);
            if (!notNeedLoading) {
                closeLoading();
            }
            this.alert(e);
        });
    },
    //显示loading 运行后自动关闭loading
    showLoadingRun(obj, fn, notNeedDetail, notNeedLoading, param) {
        let st = new Date().getTime(),
            _this = this,
            closeLoading = function () {
                let et = new Date().getTime();
                if (et - st > 1000) {
                    _this.loading.hide();
                } else {
                    if (!notNeedDetail) {
                        let t = 1000 - et + st;
                        setTimeout(e => {
                            _this.loading.hide();
                        }, t);
                    } else {
                        _this.loading.hide();
                    }

                }
            };


        if (!notNeedLoading) {
            this.loading.show();
        }
        obj[fn].call(obj, param).then(() => {
            if (!notNeedLoading) {
                closeLoading();
            }
        }).catch(e => {
            console.log(e);
            if (!notNeedLoading) {
                closeLoading();
            }
            this.alert(e);
        });
    },

    //生成guid
    createGuid() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            //取16以内的随机数
            let r = Math.random() * 16 | 0,
                //x直接返回随机数
                //y返回 r&0x3|0x8 的位运算
                v = (c == 'x') ? r : (r & 0x3 | 0x8);
            //返回16进制值
            return v.toString(16);
        });
    },


    //执行父级函数
    runParentPageFn(fn, param) {
        let pages = getCurrentPages();
        if (pages.length < 2) {
            console.log('没有父级页面');
            return;
        }
        let parentPage = pages[pages.length - 2];
        return parentPage[fn](param);
    },




    //alert promise
    //@param:msg     str
    //@param:title   str
    alert(msg, title,confirmText) {
        msg = (typeof msg == 'string') ? msg : JSON.stringify(msg);
        confirmText = confirmText || "确定";
        return new Promise(success => {
            title = title || "系统提示";
            wx.showModal({
                title: title,
                content: msg,
                showCancel: false,
                confirmText: confirmText,
                success: function () {
                    success();
                }
            });
        });
    },
    confirm(msg, title,confirmText) {
        msg = (typeof msg == 'string') ? msg : JSON.stringify(msg);
        confirmText = confirmText || "确定";
        return new Promise((success, error) => {
            title = title || "系统提示";
            wx.showModal({
                title: title,
                content: msg,
                confirmText: confirmText,
                success: function (res) {
                    if (res.confirm) {
                        success();
                    } else if (res.cancel) {
                        error();
                    }
                }
            });
        });

    },

    //显示提示
    //info.show(text);
    //info.hide()
    info: {
        show(msg) {
            if (typeof msg != 'string') {
                msg = JSON.stringify(msg);
            }
            wx.showToast({
                title: msg,
                icon: 'none',
                duration: 2000
            });
        },
        hide() {
            wx.hideToast();
        }
    },


    //loading
    //loading.show(text)
    //loading.hide();
    loading: {
        show: function (text = '极速加载中') {
            wx.showLoading({
                title: text,
                mask: true
            });
        },
        hide: function () {
            wx.hideLoading();
        }
    },



    //设置标题
    //#param:title  str
    setTitle(title) {
        wx.setNavigationBarTitle({
            title: title,
        });
    },


    //设置顶部系统条颜色
    //@param  fontColor:str   '#ffffff'
    //@param  bgColor:str     '#ffffff'
    //注意其中fontColor 只能是#ffffff 或  #000000
    setNavigationBarColor(fontColor, bgColor) {
        wx.setNavigationBarColor({
            frontColor: fontColor,
            backgroundColor: bgColor,
            animation: {
                duration: 0,
                timingFunc: 'easeIn'
            }
        });
    },


    //打开新页面
    //@param:url   str
    openUrl(url) {
        wx.navigateTo({ url: url });
    },
    //关闭当前页面跳转到新页面，goback无法返回被关闭页面
    closeAndOpenUrl(url) {
        wx.redirectTo({ url: url });
    },
    //关闭所有打开的页面跳转到新页面
    closeAllAndOpen(url) {
        wx.reLaunch({
            url: url
        });
    },
    //打开tab页面
    openTabUrl(url) {
        wx.switchTab({
            url: url
        });
    },

    //返回前几页
    //@param  number:number
    goBack(number = 1) {
        wx.navigateBack({
            delta: number
        });
    },


    //打电话
    //@param:tel   number
    tel(tel) {
        wx.makePhoneCall({
            phoneNumber: tel
        });
    },



    //本地数据缓存  promise 一堆
    //10M空间
    //@param   key:str
    //@param   val:str/obj
    setLocalData(key, val) {
        return new Promise((success, error) => {
            wx.setStorage({
                key: key,
                data: val,
                success: function () {
                    success();
                },
                error: function (msg) {
                    error(msg);
                }
            });
        });
    },
    //@param   key:str
    getLocalData(key) {
        return new Promise(success => {
            wx.getStorage({
                key: key,
                complete: function (obj) {
                    obj = obj || {};
                    obj = obj.data || '';
                    success(obj);
                }
            });
        });
    },
    //@param   key:str
    delLocalData(key) {
        return new Promise(success => {
            wx.removeStorage({
                key: key,
                success: function (res) {
                    success();
                }
            });
        });
    },
    //清除所有缓存
    clearLocalData() {
        wx.clearStorageSync();
    },




    //滚动页面到指定位置
    scrollTo(top = 0, duration = 300) {
        wx.pageScrollTo({
            scrollTop: top,
            duration: duration
        });
    },



    //获取指定元素的实际属性
    //如果传入的是class获取的是第一个找到的class的dom的属性
    //@param:id    .class/#id
    getDomParam(id) {
        return new Promise(success => {
            let query = wx.createSelectorQuery();
            query.select(id).boundingClientRect();
            query.exec(function (res) {
                if (res[0]) {
                    let backData = res[0] || {
                        top: 0,
                        bottom: 0,
                        left: 0,
                        right: 0,
                        width: 0,
                        height: 0
                    };
                    success(backData);
                }
            });
        });
    },


    //获取视窗滚动的距离
    getScrollState() {
        return new Promise(success => {
            wx.createSelectorQuery().selectViewport().scrollOffset(function (res) {
                //res.scrollLeft
                //res.scrollTop
                //res.id
                //res.dataset
                success({
                    left: res.scrollLeft,
                    top: res.scrollTop
                });
            }).exec();
        });
    },


    device() {
        return wx.getSystemInfoSync();
    },


    sleep(ms) {
        return new Promise(success => {
            setTimeout(function () {
                success();
            }, ms);
        });
    },

    //设置剪贴板内容
    setClipboard(text) {
        return new Promise(success => {
            wx.setClipboardData({
                data: text,
                success() {
                    success();
                }
            });
        });

    },


    //tab页面传参用
    // text:    name=123&a=222
    async setTabParam(text) {
        await this.setLocalData('__temp_tab_param__', text);
    },
    async getTabParam() {
        let text = await this.getLocalData('__temp_tab_param__');
        text = text.split('&');
        let backData = {};
        text.map(rs => {
            let item = rs.split('=');
            backData[item[0]] = item[1];
        });
        return backData;
    },
    //保存用户信息及openid等
    saveUserInfo(info) {
        let app = getApp();
        app.globalData.openId = info.openId;
        app.globalData.appId = info.appId;
    },
    //获取用户信息  必须在用户点击事件内调用
    getUserInfo() {
        return new Promise((success, error) => {
            wx.getUserProfile({
                desc: '用于完善会员资料', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
                success: (res) => {
                    success(res.userInfo);
                },
                fail(e) {
                    console.log(e);
                    error('用户拒绝授权!');
                }
            });
        });
    },

    //文件上传
    //serverUrl 服务器地址
    //filePath  本地文件路径
    //data      其它form表单
    //name      file文件对应的key
    //header    其它header内的对象
    uploadFile(api, filePath, data, name, header) {
        name = name || 'file';
        data = data || {};
        header = header || {};
        return new Promise((success, error) => {
            //判断是否是本地图片
            if(
                filePath.indexOf(':\/\/tmp\/') != -1  &&
                filePath.indexOf('wxfile:') != -1
            ){
                filePath = filePath.replace(setting.imageUrl,'');
                success({
                    data:{url:filePath}
                });
            }else{
                wx.uploadFile({
                    url: setting.uploadFileServerUrl,
                    filePath: filePath,
                    name: name,
                    formData: data,
                    header: header,
                    timeout: 20000,
                    success(res) {
                        if(res.statusCode != 200){
                            error('服务器异常,请稍后再试！');
                            return;
                        }

                        let data = res.data;
                        data = JSON.parse(data);

                        if (data.err) {
                            error(data.info);
                            return;
                        }

                        success(data);
                    },
                    fail(e) {
                        error(e);
                    }
                });
            }
        });
    },

    setSessionData(key, val) {
        if (!getApp().__tempData__) {
            getApp().__tempData__ = {};
        }
        getApp().__tempData__[key] = val;
    },
    getSessionData(key) {
        let data = getApp().__tempData__ || {};
        return data[key];
    },

    //新窗口显示大图
    openImage(urls, nowShowSrc) {
        urls = urls || [];
        nowShowSrc = nowShowSrc || urls[0];
        wx.previewImage({
            urls: urls,
            showmenu: false,
            current: nowShowSrc
        });
    },



    //地图选点 不需要sdk等
    async chooseLocation() {
        return new Promise((success, error) => {
            authorize('userLocation').then(rs=>{
                if(rs.state){
                    wx.chooseLocation({
                        success(rs) {
                            success(rs);
                        },
                        fail(e) {
                            let msg = e.errMsg;
                            if(msg.indexOf('cancel') >-1){
                                success({});
                            }else{
                                error(msg);
                            }
                        }
                    });
                }else{
                    error(rs.msg);
                }
            })
        });
    },


    //获取微信授权
    getWxAuth(scope) {
        const _this = this;
        const authsName = {
            "scope.userInfo": "用户信息",
            "scope.userLocation": "地理位置",
            "scope.userLocationBackground": "后台定位",
            "scope.address": "通讯地址",
            "scope.invoiceTitle": "发票抬头",
            "scope.invoice": "获取发票",
            "scope.werun": "微信运动步数",
            "scope.record": "录音功能",
            "scope.writePhotosAlbum": "保存到相册",
            "scope.camera": "摄像头",
        };
        return new Promise(r => {
            wx.authorize({
                scope: scope,
                success() { r(); },
                async fail() {
                    await _this.confirm('点击 “去设置” 按钮，打开 “' + authsName[scope] + '” 的权限设置界面',
                        '权限申请', {
                        confirmText: '去设置'
                    }).then(_ => {
                        wx.openSetting({
                            success: res => {
                                if (res.authSetting[scope]) r();
                            },
                            fail: async res => {
                                let msg = '打开设置失败，请从小程序右上角打开。';
                                await _this.alert(msg);

                                throw {
                                    msg,
                                    err
                                };
                            }
                        });
                    });
                }
            });
        });
    },
};



export default sys;