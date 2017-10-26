/*
 * @authors :anLA7856
 * @date    :2017-10-25
 * @description：纯计算函数，用于计算store
 * 整合不同的actions，做改变不同的state。
 * 首先是初始化一些数据，然后就是计算state，并返回一个state。
 * state变化会导致重新渲染ui。
 */

import {CHAT_LOGIN,SET_SESSION,FILTER_SEARCH,CHAT_INIT,SEND_MESSAGE,RECEIVE_MESSAGE,SET_DESTROY,SET_LOGOUT} from "src/constants/Chat";
import Storage from 'src/utils/storage';
let _stores = new Storage(),
	Storage_Key = 'username';
	
//初始化state数据。
let initStates = {
		//这个user代表当前用户。img是用户图标
	user:{
		name:"Bin",
		img:"https://ps.ssl.qhimg.com/t01531c2d8bd3dbe644.jpg"
	},
	//session代表一段会话，默认是和“使用帮助会话”
	sessions:[
		{
			//会话里面包括id，因为每个和每个都有固定id
	        id:1,
	        //包括“使用帮助和默认图标”
	        user: {
	            name:"使用帮助",
	            img:"https://ps.ssl.qhimg.com/t01531c2d8bd3dbe644.jpg"
	        },
	        //还包括当前一段会话内容，就是messages
	        messages:[
	            {
	                content:"该示例主要使用了react、redux、iscroll、fetch等组件实现模仿实现PC微信聊天，",
	                date: Date.now(),
	                self: 0
	            },{
	                content:"希望能对喜欢react,对于redux还处理迷茫，不知如何入手的小伙伴能起到入门指引",
	                date: Date.now(),
	                self: 0
	            },
	            {
	                content:"如有不足之处，欢迎拍砖指出",
	                date: Date.now(),
	                self: 0
	            },
	            {
	                content:"如果该项目帮助了您，请记得帮我点颗星，就是对我最大的支持",
	                date: Date.now(),
	                self: 0
	            },
	            {
	                content:"项目地址：https://github.com/anLA7856/Python_Websocket_flask_chat",
	                date: Date.now(),
	                self: 1
	            },{
	                content:"当然如果您在使用的过程中，有不懂的地方，或更好的建议，我们也可以一起来讨论，欢迎加入React\redux技术交流群一起讨论",
	                date: Date.now(),
	                self: 0
	            },
	            {
	                content:"QQ技术交流群：**",
	                date: Date.now(),
	                self: 1
	            }
	        ]
	    }
    ],
    //当前会话
	currentChat:{},
	//当前会话人id
	currentUserId:1,
	//好友列表
	id_list:[],
	//筛选关键字。
	filterKey:""
};
//当前会话
let currentChat={};
//如果多个会话，就放入这里面。
let sessions= [];

/**
 * 分割action。
 * 聊天入口,就是reducers的操作函数。，首先传入基本的state，state就是initStates。
 * @param state
 * @param action
 * @returns
 */
function chatIndex(state = initStates,action){
	//分别选择action的type。
	switch(action.type){
		//聊天登录的动作
		case CHAT_LOGIN:
			//里面有，就说明已经登录了的情况，所以直接返回咯。
			let id_list = action.data.sessions.map((item)=>{
				return item.id;
			});
			// 获取当前默认名字。
			action.data.sessions.unshift(initStates.sessions[0]);
			//重新构造一个包含原state的属性返回。
			return Object.assign({},state,{...action.data,id_list,currentUserId:1,currentChat:initStates.sessions[0]});
			//聊天初始化的动作
		case CHAT_INIT:
			var _store = JSON.parse(localStorage.getItem("_store")||"{}");
			if(!_stores.get(Storage_Key)){
				// console.log(111)
				localStorage.clear();
				return Object.assign({},state,{...initStates,sessions:[]});
			};
			if(_store && _store.chatIndex){
				let {sessions,currentUserId,user,id_list}=_store.chatIndex;
				// console.log(89,sessions);
				currentChat = (sessions.filter((item)=>item.id==currentUserId)[0]||{});
				// return Object.assign({},state,{sessions,currentUserId,user,id_list,currentChat:currentChat,filterKey:""});
			};
			return Object.assign({},state,(_store.chatIndex||{}),{currentChat:currentChat,filterKey:""});

		//搜索
		case FILTER_SEARCH:
			
			return Object.assign({},state,{
				filterKey:action.data
			});
			//设置会话的动作。
		case SET_SESSION:
			
			sessions = state.sessions.map((item)=>{
				if(item.id==action.data){
					item.status=false;
					currentChat= item;
				};
				return item;
			});
			return Object.assign({},state,{
				sessions,
				currentChat,
				currentUserId:action.data
			});
			//发送消息的动作。
		case SEND_MESSAGE: //发送消息
			// console.log("SEND_MESSAGE",action.data);
			
			sessions = state.sessions.map((item)=>{
				if(item.id==state.currentUserId){
					item.messages=item.messages.concat(action.data);
					currentChat= item;
				};
				return item;
			});
			// (sessions.filter((item)=>item.id==state.currentUserId)[0])
			return Object.assign({},state,{
				sessions:sessions,
				currentChat:currentChat
			});
		//接收消息  
		case RECEIVE_MESSAGE: 
			// console.log("SEND_MESSAGE",action.data);
			if(action.data.length <= 0){
				return state;
			};
			for(let key in action.data){
				console.log(action.data[key])
				let {id} = action.data[key];
				sessions = state.sessions.map((item)=>{

					if(item.id == id && item.id != state.currentUserId){
						item.status = true;
						item.messages=item.messages.concat(action.data[key].messages);
						
					};
					if(item.id==state.currentUserId){
						currentChat= item;
					};
					return item;
				});
			};
			// (sessions.filter((item)=>item.id==state.currentUserId)[0])
			return Object.assign({},state,{
				sessions:sessions,
				currentChat:currentChat
			});
		//	关闭会话的动作。也就是退出。
		case SET_DESTROY: 
			let _sessions = state.sessions.filter((item)=>item.id !== state.currentUserId);
			// (sessions.filter((item)=>item.id==state.currentUserId)[0])
			return Object.assign({},state,{
				sessions:_sessions,
				currentChat:_sessions[0],
				currentUserId:_sessions[0].id
			});
		//退出
		case SET_LOGOUT:
			localStorage.clear();
			return Object.assign({},state,{currentChat:1,user:{},sessions:[],filterKey:""});
		default:
			return state;
	};
};

export default chatIndex;


