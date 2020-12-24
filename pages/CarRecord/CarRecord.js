// pages/CarRecord/CarRecord.js
/*
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
3.获取用户定位数据，包括经度，纬度，速度，并将数据转换成要求格式（经纬度小数点后保留4位，速度保留两位小数）
4.判断数据有效性，通过经纬度判断用户是否在规定区域内，如果没有，延时2s继续判断，直到确定在区域内，如果连续5次判断不在规定区域，则结束，显示用户不在指定区域
5.对数据进行判断是否在石家庄境内
6.只有当行使出当前范围，开始记录当前里程 carLaunch置1
7.当返回后，carBack置1，自动记录形式里程和结束时间，并计算最终里程，判断数据carLaunch与carBack是否都是1，都是1则存入数据库，否则丢弃数据。
*/
Page({

  /**
   * 页面的初始数据
   */
  data: {
    carNum:'',               // 从上个页面传过来的车牌号
    latitude: 23.099994,     //
    longitude: 113.324520,   //
    speed:0,                 //
    distance:0,              //
    src: '',                 //
    currentTime:'',          //
    nfc:null,                //
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

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

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