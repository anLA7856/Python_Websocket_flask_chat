/*
 * @authors :anLA7856
 * @date    :2017-10-25
 * @description :storm 用来存储数据的地方。
 * 里面引入了thunk中间件，所以就能够在action中返回函数。
 * store是用来dispatch的，里面有个state和action嘛，根据不同action去返回
 * state的值，加了中间件thunk的话，让action创建函数先不返回action，而是返回一个函数。
 * 通过这个函数延迟dispatch或者只有满足条件在dispatch。
 */
import {createStore,applyMiddleware} from "redux";
import thunk from "redux-thunk";
import reducers from "src/reducers";

function configStore (){
	//
    let createStoreWithMiddleware = applyMiddleware(thunk)(createStore);
    //dev环境开启redux调试，用thunk中间件创建出来的store。激活thunk。并且
    //把reducers放了进去。
    let cStore  = createStoreWithMiddleware(reducers,(__DEBUG__ && window.devToolsExtension ? window.devToolsExtension() : undefined));
    return cStore;
};
//整个Store
let Store = configStore();

let currentVal ;
//订阅，当store放生改变时，就一定会调用这里面的东西。
Store.subscribe(() => {
	let prevVal = currentVal;
	//Store的到state这个状态。
	currentVal = Store.getState();
	//把当前状态存起来。也就是，每当store对象一变，然后我就重新存下_store。
	localStorage.setItem("_store",JSON.stringify(currentVal));
	if (prevVal !== currentVal) {
		//console.log(currentVal,'state发生了变化')
		// console.log('Some deep nested property changed from', prevVal, 'to', currentVal)
	};
})
export default Store;