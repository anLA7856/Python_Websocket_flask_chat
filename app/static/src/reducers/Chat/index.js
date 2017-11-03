/*
 * @authors :anLA7856
 * @date    :2017-10-25
 * @description：纯计算函数，用于计算store
 * 整合不同的actions，做改变不同的state。
 * 首先是初始化一些数据，然后就是计算state，并返回一个state。
 * state变化会导致重新渲染ui。
 */

import {CHAT_LOGIN,SET_SESSION,FILTER_SEARCH,CHAT_INIT,SEND_MESSAGE,RECEIVE_MESSAGE,SET_DESTROY,SET_LOGOUT,UPDATE_USERS} from "src/constants/Chat";
import Storage from 'src/utils/storage';
let _stores = new Storage(),
	Storage_Key = 'username';
	
//初始化state数据。
let initStates = {
		//这个user代表当前用户。img是用户图标
	user:{
		name:"defaultUser",
		img:"/pic/1.jpeg"
	},
	//session代表一段会话，默认是和“使用帮助会话”
	sessions:[
		{
			//会话里面包括id，因为每个和每个都有固定id
	        id:1,
	        //包括“使用帮助和默认图标”
	        user: {
	            name:"大厅",
	            img:"/pic/1.jpeg"
	        },
	        //还包括当前一段会话内容，就是messages
	        messages:[
	            {
	                content:"欢迎来到公共聊天室",
	                date: Date.now(),
	                self: 0
	            }
	        ]
	    }
    ],
    _currentUsers:{},
    //当前会话
	currentChat:{},
	//当前会话人id
	currentUserId:1,
	//好友列表
	id_list:[],
	//筛选关键字。
	filterKey:""
};
//当前会话，代表着，当前处于的会话窗口。
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
	//分别选择action的type。action.data就是你执行一项任务，返回的值。
	switch(action.type){
		//聊天登录的动作
		case CHAT_LOGIN:
			//里面有，就说明已经登录了的情况，所以直接返回咯。
			let id_list = action.data.sessions.map((item)=>{
				return item.id;
			});
			//把默认窗口赋值为当前id。会话消息为当前会话。
			return Object.assign({},state,{...action.data,id_list,currentUserId:action.data.sessions[0].id,currentChat:action.data.sessions[0]});
		case CHAT_INIT:
			var _store = JSON.parse(localStorage.getItem("_store")||"{}");
			if(!_stores.get(Storage_Key)){
				// console.log(111)
				//退出的界面。
				localStorage.clear();
				return Object.assign({},state,{...initStates,sessions:[]});
			};
			if(_store && _store.chatIndex){
				//本页面刷新，则消息保留。
				let {sessions,currentUserId,user,id_list,currentUsers}=_store.chatIndex;
				// console.log(89,sessions);
				currentChat = (sessions.filter((item)=>item.id==currentUserId)[0]||{});
				return Object.assign({},state,(_store.chatIndex||{}),{currentChat:currentChat,filterKey:""},currentUsers);
			};
			return Object.assign({},state,(_store.chatIndex||{}),{currentChat:currentChat,filterKey:""},currentUsers);

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
					//直接往后面加
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
			//如果长度为0，不渲染，直接跳过。
			if(action.options.data.length <= 0){
				return state;
			};
			//判断是谁的，
			var temp = action.options.data.split('[~');
			var tempSelf = 0;
			if(temp[0] == state.user.name){
				return state;
			}
			var tempJson = {
					name:temp[0],
					pic:temp[1],
					content: temp[2],
					date: temp[3],
					self: tempSelf
			}
			//还是在initState上面做文章，这里要注意后台返回的数据格式啦，直接返回一个message的格式json串。
			//state.sessions[0].messages.unshift(tempJson);
			//state.currentChat.messages.unshift(tempJson);
			//现在的问题是，数据收到了到state里面了，但是没有刷新。
			sessions = state.sessions.map((item)=>{
				//当前会话。
				if(item.id==state.currentUserId){
					//直接往后面加
					item.messages=item.messages.concat(tempJson);
					currentChat= item;
				};
				return item;
			});
			return Object.assign({},state,{
				sessions:sessions,
				currentChat:currentChat
			});
		//	定时任务从服务器中获取当前大厅聊天人员人数。
		case UPDATE_USERS:
			//里面有，就说明已经登录了的情况，所以直接返回咯。
			//把默认窗口赋值为当前id。会话消息为当前会话。
			var t = Object.assign({},state,{currentUsers:action.data});
			return Object.assign({},state,{currentUsers:action.data});
		//退出
		case SET_LOGOUT:
			localStorage.clear();
			return Object.assign({},state,{currentChat:1,user:{},sessions:[],filterKey:""});
		default:
			return state;
	};
};

export default chatIndex;


