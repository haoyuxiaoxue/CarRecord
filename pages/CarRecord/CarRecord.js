// pages/CarRecord/CarRecord.js
/*
index页面js
1.扫码识别
  NFC识别（目前微信NFC功能尚未完善）
  接受到车辆信息
2.在数据库对应集合名下创建一个新字段，字段内容包括
  _id         默认
  openid      默认       每个用户唯一  
  startOdom   number     取上次结束里程和作为本次开始里程
  startTime   date       触发时间
  stopOdom    number
  stopTime    date
  carLaunch   number
  carBack     number
CarRecord页面js
3.获取用户定位数据，包括经度，纬度，速度，并将数据转换成要求格式（经纬度小数点后保留4位，速度保留两位小数）
4.判断数据有效性，通过经纬度判断用户是否在规定区域内，目前指定单位坐标为其实数据
5.只有当行使出当前范围，开始记录当前里程 carLaunch置1
6.当返回后，carBack置1，自动记录形式里程和结束时间，并计算最终里程，判断数据carLaunch与carBack是否都是1，都是1则存入数据库，否则丢弃数据。

*/
const app =getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    carNum:'',               // 从上个页面传过来的车牌号
    latitude: 38.0892,       //
    longitude: 114.3260,     //
    speed:0,                 //
    distance:0,              //
    src: '',                 //
    currentTime:'',          //
    nfc:null,                //
    carLaunch:0,
    carBack:0,
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({carNum:options.carNum})    
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /*
  获取实时位置
  */
 getYourRealtimeLocation:function(){
  wx.getSetting({
    success(res) {
      console.log(res)
      if (res.authSetting['scope.userLocationBackground']) {
        wx.startLocationUpdateBackground({
          success: (res) => {
            console.log('startLocationUpdate-res', res)
          },
          fail: (err) => {
            console.log('startLocationUpdate-err', err)
          }
        })
      } else {
        if (res.authSetting['scope.userLocation']==false) {
          console.log('打开设置页面去授权')
          wx.openSetting({
            withSubscriptions: true,
          })
        } else {
          wx.startLocationUpdateBackground({
            success: (res) => {
              console.log('startLocationUpdate-res', res)
            },
            fail: (err) => {
              console.log('startLocationUpdate-err', err)
              console.log('startLocationUpdata失败')
              wx.openSetting({
                withSubscriptions: true,
              })
            }
          })
        }
      }
    }
  })
},

/*
实时监听位置信息
实时监听位置
*/
onShow() {
  this.getYourRealtimeLocation();
  const _locationChangeFn = res=> {
    // console.log('location change', res.latitude, res.longitude)
    this.setData({latitude:res.latitude})
    this.setData({longitude:res.longitude})
    this.setData({speed:res.speed})
    app.globalData.distance = app.globalData.distance + this.data.speed 
    this.setData({distance:app.globalData.distance})
    //如果超出区域，carLaunch设置为1
    if(this.data.latitude>38.0880&&this.data.latitude<38.0905&&this.data.longitude>114.3250&&this.data.longitude<114.3271){      
    }else{
      this.setData({carLaunch:1})
      app.globalData.db.collection(app.globalData.carNum).orderBy('startTime','desc').get({
        success:function(res){
          app.globalData.db.collection(app.globalData.carNum).doc(res.data[0]._id).update({
            data:{
              carLaunch:1
            }
          })
        }
      })
      
    }
    // 当返回到指定区域，carBack设置为1
    if(this.data.latitude>38.0888&&this.data.latitude<38.0897&&this.data.longitude>114.3258&&this.data.longitude<114.3263&&this.data.carLaunch==1){
      this.setData({carBack:1})
      app.globalData.db.collection(app.globalData.carNum).orderBy('startTime','desc').get({
        success:function(res){
          app.globalData.db.collection(app.globalData.carNum).doc(res.data[0]._id).update({
            data:{
              carLaunch:1,
              carBack:1,
              stopTime:new Date(),
              stopOdom: app.globalData.startOdom + (app.globalData.distance/1000),
            }
          })
        }
      })
    }    
  }
  wx.onLocationChange(_locationChangeFn);
  
  // const _HCEMessageFn = res =>{
  //   console.log(res.data)
  // }
  
},


  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})