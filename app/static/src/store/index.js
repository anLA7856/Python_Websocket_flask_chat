/*
 * @authors :anLA7856
 * @date    :2017-10-25
 * @description :storm 用来存储数据的地方。
 * thunk中间件，可以用来发送两个action。
 */
import {createStore,applyMiddleware} from "redux";
import thunk from "redux-thunk";
import reducers from "src/reducers";

function configStore (){
	//
    let createStoreWithMiddleware = applyMiddleware(thunk)(createStore);
    //dev环境开启redux调试
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
	//把当前状态存起来。
	localStorage.setItem("_store",JSON.stringify(currentVal));
	if (prevVal !== currentVal) {
		//console.log(currentVal,'state发生了变化')
		// console.log('Some deep nested property changed from', prevVal, 'to', currentVal)
	};
})
export default Store;