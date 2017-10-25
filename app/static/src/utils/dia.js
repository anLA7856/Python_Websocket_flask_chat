/*
 * @authors :anLA7856
 * @date    :2017-10-25
 * @description :storm 用来存储数据的地方。
	页面组件共用方法

 * 	module.exports 初始值为一个空对象 {}
	exports 是指向的 module.exports 的引用
	require() 返回的是 module.exports 而不是 exports
 */
module.exports = (domain)=>{
	//传入domain，然后定义domain的open方法，也就是更改state
	domain.open = (key, props)=>{
		domain.setState({
		  [`${key}`]: true,
		  props
		});
	}
	//定义domain的close方法，只把key设为false。
	domain.close = (key)=>{
		domain.setState({
		  [`${key}`]: false,
		});
	}
};