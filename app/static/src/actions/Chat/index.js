/*
 * @authors :anLA7856
 * @date    :2017-10-26
 * @description：用于发出具体的动作请求。
 * 也就是各种combine在一起的action
 * 本来传统，action只能返回一个action对象例如：
 * return {
 *			type:FILTER_SEARCH,
 *			data
 *		}
 * 但是呢，由于store激活了thunk中间件，所以action还能够返回一个函数了。
 * 通过这个函数延迟dispatch或者在制定的情况下dispatch。
 * 这个内部函数接受store的两个方法dispatch和getState作为参数。
 * 
 * 另外：store.dispatch()是 View 发出 Action 的唯一方法。
 * 组件免不了要与用户互动，React 的一大创新，就是将组件看成是一个状态机，
 * 一开始有一个初始状态，然后用户互动，导致状态变化，从而触发重新渲染 UI 。
 * 也就是，如果利用diff函数局部渲染的话，就会执行相应组件的render函数。
 *
 */

import {ajaxJson} from "src/utils/ajax";
import {fetchJson} from "src/utils/fetch";
import Storage from 'src/utils/storage';
import {CHAT_LOGIN,SET_SESSION,FILTER_SEARCH,CHAT_INIT,SEND_MESSAGE,RECEIVE_MESSAGE,SET_DESTROY,SET_LOGOUT} from "src/constants/Chat";

//定义一个_store对象。
let _store = new Storage(),
	Storage_Key = 'username';

//定义聊天对象action。注意里面普通对象。
let chat =  {
		//初始化方法。
	chat_init:(data)=>{
		return {
			type:CHAT_INIT,
			data
		}
	},
	//登录方法
	chatLogin:(options)=>{
		return (dispatch)=>{
			const {data,success,error}=options;
			fetchJson({
				type:"POST",
				//url:"/initSession",
				url:"/user/add",
				data:data,
				success:req=>{
					console.log(req)
					if(req.res == 10000){
						//登录成功，设置值。
						_store.set(Storage_Key,data.username,120);
						//渲染界面，也就是调用dispatch方法，即先调用store，然后reduce。绑定的。
						dispatch({
							type:CHAT_LOGIN,
							data:req
						});
					}else{

					};
					success&&success(req);
				},
				error:err=>{
					console.log(err);
					error&&error();
				}
			});
			
		};
	},
	//搜索用途。
	filter_search:(data)=>{
		return {
			type:FILTER_SEARCH,
			data
		}
	},
	//设置session
	set_session:(data)=>{
		return {
			type:SET_SESSION,
			data
		}
	},
	//发送消息
	send_message:(options)=>{
		return (dispatch)=>{
			const {user,id,content,success,error}=options;
			fetchJson({
				type:"POST",
				url:"/pushMessage?sid=" + user.sid,
				data:{
					'sid': user.sid,
                    'id': id,
                    'content':content
				},
				success:(req)=>{
					if(req.res == 10000){
						let {data}= req;
						//数据格式。
						data.unshift({
							content:content,
			                date: Date.now(),
			                self: 1
						});
						dispatch({
							type:SEND_MESSAGE,
							data
						});
					}else{
						console.log(req.errorMsg)
					};
					success&&success(req);
				},error:()=>{
					error&&error();
				}
			});
		};
	},
	//接收消息
	receive_message:(options)=>{
		return (dispatch)=>{
			const {user,id_list,success,error}=options;
			fetchJson({
				type:"POST",
				url:"/getMessage?sid=" + user.sid,
				data:{
					'id_list':id_list,
				},
				success:(req)=>{
					if(req.res == 10000){
						let {data}= req;
						dispatch({
							type:RECEIVE_MESSAGE,
							data
						});
					}else{
						console.log(req.errorMsg)
					};
					success&&success(req);
				},error:()=>{
					error&&error();
				}
			});
		};
	},
	//送客
	set_destroy:(options)=>{
		
		return (dispatch)=>{
			const {user,id,success,error}=options;
			ajaxJson({
				type:"GET",
				url:"/destroySession?sid="+user.sid+'&openid='+id,
				success:(req)=>{
					if(req.res == 10000){
						let {data}= req;
						dispatch({
							type:SET_DESTROY,
							data: content
						});
					}else{
						console.log(req.errorMsg)
					};
					success&&success(req);
				},error:()=>{
					error&&error();
				}
			});
		};
	},
	set_logout:(data)=>{
		return {
			type:SET_LOGOUT,
			data
		}
	}
};
export default chat;


