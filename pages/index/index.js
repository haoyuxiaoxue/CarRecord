//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    motto: '扫码出发',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),    
    carNum:'',
    MaxOdom:'',
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
  onShow:function(){    
    // 建立数据库链接
    app.globalData.db = wx.cloud.database() 
  },
  /*
  二维码扫描，同时向数据库添加车辆信息
  */
 myScanCode:function(){
   console.log('alreadyScan:',app.globalData.alreadyScan)
  if(app.globalData.alreadyScan == 1){
    console.log(app.globalData.carNum)
    wx.navigateTo({
      url: '/pages/CarRecord/CarRecord?carNum='+app.globalData.carNum,
    })
    return
  }
  console.log('alreadyScan:',app.globalData.alreadyScan)
  var that = this;
  wx.scanCode({
    onlyFromCamera: true,
    success(res){
      // console.log(res)
      that.setData({carNum:res.result})
      app.globalData.carNum = res.result
      that.getMaxOdom(res.result)
    }
  })
},
/*
*/
test:function(){
  return
},
  /*
  获取最大里程
  */
 getMaxOdom:function(e){  
  var that = this
  app.globalData.db.collection(this.data.carNum).orderBy('stopOdom','desc').get({
    success:function(res){      
      console.log('get最大Odom是：',res.data[0].stopOdom)  
      console.log('开始执行setData')    
      that.setData({MaxOdom:res.data[0].stopOdom})
      app.globalData.startOdom = res.data[0].stopOdom
      console.log('data中的MaxOdom是：',that.data.MaxOdom)      
      console.log('开始执行addRunInfo')
      that.addRunInform()   
      console.log('结束addRunInfo')   
    }
  })  
},
  /*
  测试数据库添加数据
  */
 addRunInform:function(){    
  console.log('进入addRunInfo') 
  console.log('add最大Odom是：',this.data.MaxOdom)
  var that = this
  app.globalData.db.collection(this.data.carNum).add({
  data:{      
    startOdom:this.data.MaxOdom,
    startTime:new Date(),
    stopTime:0,
    stopOdom:0,
    carLaunch:0,
    carBack:0
  },  
  success:function(res){
    console.log('成功添加数据,跳转CarRecord页面')    
    app.globalData.alreadyScan = 1
    wx.navigateTo({
      url: '/pages/CarRecord/CarRecord?carNum='+that.data.carNum,
    })  
  },
  fail:function(res){
    console.log('添加数据失败')      
  }
})  
},
})
