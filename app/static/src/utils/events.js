"use strict";

/*
 * @authors :anLA7856
 * @date    :2017-10-25
 * @description :storm 用来存储数据的地方。
      打开于关闭。页面组件方法。
 */
module.exports = {
  on: function (el, type, callback) {
	  //给e1添加on事件监听，如果做了什么事，就调用callback方法。
    if(el.addEventListener) {
      el.addEventListener(type, callback);
    } else {
      el.attachEvent('on' + type, function() {
        callback.call(el);
      });
    }
  },

  //给e1添加off事件监听。如果做了什么事，就调用callback方法。
  off: function (el, type, callback) {
    if(el.removeEventListener) {
      el.removeEventListener(type, callback);
    } else {
      el.detachEvent('off' + type, callback);
    }
  },
  
  once: function (el, type, callback) {
	  //移除监听事件，并且执行callback。
    let typeArray = type.split(' ');
    let recursiveFunction = function(e){
      e.target.removeEventListener(e.type, recursiveFunction);
      return callback(e);
    };
    //然后在调用给e1添加on的操作。事件就是调用一次然后移除。
    for (let i = typeArray.length - 1; i >= 0; i--) {
      this.on(el, typeArray[i], recursiveFunction);
    }
  }
}
