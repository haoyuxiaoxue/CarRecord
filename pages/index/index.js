//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    motto: '扫码出发',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse){
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },
  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  /*
  二维码扫描，同时向数据库添加车辆信息
  */
 myScanCode:function(){
  var that = this;
  wx.scanCode({
    onlyFromCamera: true,
    success(res){
      // console.log(res)
      that.addRunInform(res.result)
    }
  })
},
  /*
  测试数据库添加数据
  */
 addRunInform:function(e){
    const db = wx.cloud.database()
    db.collection(e).add({
    data:{      
      startOdom:0,
      startTime:new Date(),
      stopTime:-1,
      stopOdom:-1,
      carLaunch:0,
      carBack:0
    },
    success:function(res){
      console.log('成功添加数据')
    },
    fail:function(res){
      console.log('添加数据失败')
    }
  })
  wx.navigateTo({
    url: '/pages/CarRecord/CarRecord?carNum='+e,
  })
  },
})
