//app.js
App({
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
    // 建立微信云连接
    if(!wx.cloud){
      console.error('没有创建微信云，请现创建微信云')
    }else{
      wx.cloud.init({
        env:'dev-5glhwy6x6b21a16e',//根据使用环境设置env 这里使用开发环境的dev
        traceUser:true,
      })
      console.log('初始化cloud')      
    }  
  },
  globalData: {
    userInfo: null,
    carNum:null,
    db:null,
    alreadyScan:0,
    distance:0,
    startOdom:0,
  }
})