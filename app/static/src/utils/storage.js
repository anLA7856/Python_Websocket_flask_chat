/*
 * @authors :anLA7856
 * @date    :2017-10-25
 * @description :storm 用来存储数据的地方。
 */
/**
 * storage方法。
 */
class storage {
  constructor(props) {
    this.props = props || {}
    this.source = this.props.source || window.localStorage
  }

  get(key) {

	  //取得data数据和过期时间。
    const data = this.source,
          timeout = data[`${key}__expires__`]

    // 过期失效
    if (new Date().getTime() >= timeout) {
      this.remove(key)
      return;
    }
    if(data[key] == 'undefined')
    	return false;
    //如果value和data[key]相等，那么久把他用json解码。
    const value = data[key]
                ? JSON.parse(data[key])
                : data[key]
    return value
  }

  // 设置缓存
  // timeout：过期时间（分钟）
  set(key, value, timeout) {
	  //debugger;
    let data = this.source
    data[key] = JSON.stringify(value)
    if (timeout)
      data[`${key}__expires__`] = new Date().getTime() + 1000*60*timeout
    return value
  }

  //删除key
  remove(key) {
    let data = this.source,
        value = data[key]
    delete data[key]
    delete data[`${key}__expires__`]
    return value
  }

}

module.exports = storage