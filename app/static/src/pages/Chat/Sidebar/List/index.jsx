/*
 * @authors :anLA7856
 * @date    :2017-10-26
 * @description：用于用户列表的组件。
 */

import React, { Component, PropTypes } from 'react';
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import classnames from 'classnames';
import actions from "src/actions";
import Scroll from 'src/components/common/Scroll';
import Svg from 'src/components/common/Svg';
import {getInstance} from 'src/utils/socket'


import './Index.scss';


let socket = getInstance()
//集成父页面传来的props，这样就可以依次乡下传递
class List extends Component{
	constructor(props){
		super(props);
		this.time = null;
		this.flag = false;
    	this.state = {
    	};
	}
	//第一次加载完之后，获得message，也就是获得信息。
	componentDidMount(){
		this.getMessage();
	}
	//组件将要被清除的时候，就清除自己的定时器。。
	componentWillUnmount(){
		//clearInterval(this.time);
	}
	
	componentWillMount(){
	   
	    let {ACTIONS} = this.props;
	    let {_user} = this.props;
	    socket.onmessage = function (msg) {
            if (typeof msg.data == "string") {
                let data=msg.data;
//                dispatch({
//                    type:RECEIVE_MESSAGE,
//                    data
//                });
                ACTIONS.receive_message({
                    data
                });
            }
            else {
                console.log(req.errorMsg)
            }
        };
        
        //监听客户端断开。
        socket.onclose = function (msg) { 
            //就相当于注销，通知服务器删除该信息。
            alert("连接异常，请重试！") 
            if(_user){
                ACTIONS.set_logout(_user);
            }
           
            
       };
       
	}
	
	//去除数组，前num的数组。
	Random(num){
		let {_id_list} = this.props;
		let arr = _id_list.concat([]);
		var return_array=[];
	    for (var i = 0; i<arr.length; i++) {
	        //判断如果数组还有可以取出的元素,以防下标越界
	        if(return_array.length < num){

		        if (arr.length>0) {
		            var arrIndex = Math.floor(Math.random()*arr.length);
		            return_array[i] = arr[arrIndex];
		            arr.splice(arrIndex, 1);
		        } else {
		            break;
		        };
	        }else{
	        	break;
	        };
	    }
	    return return_array;
	}
	//获取数据，也就是方法放到列表中去获取。，获取random用户数据。定时任务，8s刷新一次。
	//定时5s从服务器拿一次，用于获取最新的用户列表序列。
	getMessage(){
        this.time = setInterval(()=>{
            let {ACTIONS} = this.props;
            if(this.flag){
                return false;
            };
            this.flag = true;
            //不管成功或失败，只有进行完这一次才能进行下一次。
            let{_currentUsers} = this.props;
            ACTIONS.update_users({
                _currentUsers,
                success:req=>{
                    this.flag = false;
                },error:err=>{
                    this.flag = false;
                }
            });
        },5000);
	}
	//使用setsession，来切换不同的会话。
	render(){
		let {_filterKey,_sessions,_currentUsers,_currentId,_currentChat,ACTIONS,_user} = this.props;
		//防止刷新时候，由于_cuurentUsers未定义为undefine而抛出错误。
		if(!_currentUsers){
		    _currentUsers=[];
		}

		return ( 
			<div className="list-wrap">
				<div className="list">
					<Scroll allowScroll={false} scrollbar="custom">
					    <ul>
					    	{
					    	    _currentUsers.map((item,i)=>{
					    		return (
					    			<li key={"index"+i} className={classnames({
					    				"active":(item.id === _currentId&&_currentId==_currentChat.id),
					    				"hide":(_filterKey != "" && item.name.indexOf(_filterKey) < 0)
					    			})} >
							            <p className="avatar">
							                <img   width="40" height="40"src={item.img||"https://ps.ssl.qhimg.com/t01531c2d8bd3dbe644.jpg"} />
							            </p>
							            <p className="name">{item.name}</p>
							            {item.status?(<i className={classnames("dot")} ></i>):(null)}
							        </li>
					    		);
					    	})
					    	}
					    </ul>
					</Scroll>
				</div>
			    <div className="logout">
			    	<a className="ic" target="_bank" href="https://github.com/anLA7856/Python_Websocket_flask_chat">
			    		<Svg />
			    		<p className="msg">如果该示例帮助了你，记得去github上帮我点颗星哦</p>
			    	</a>
			    	<span className="ic" title="退出" onClick={()=>this.props.ACTIONS.set_logout(_user)}>
			    		<Svg hash="#svg-exit" />
			    	</span>
			    	<button style={{display:"none"}}>退出登录</button>
			    </div>
			</div>
		);
	}
};

//让react和redux关联起来。，
//这样，才会把大管家的东西，如果自己需要，就从大管家那里拿一份。
let mapStateToProps=(state)=>{
	let {sessions,user,id_list,filterKey,currentChat,currentUserId,currentUsers} = state.chatIndex;
	return {
		_sessions:sessions,
		_user:user,
		_id_list:id_list,
		_filterKey:filterKey,
		_currentChat:currentChat,
		_currentId:currentUserId,
		_currentUsers:currentUsers
	};
}; 

let mapDispatchToProps=(dispatch)=>{
	return {
		ACTIONS:bindActionCreators(actions,dispatch)
	};
};
export default connect(mapStateToProps,mapDispatchToProps)(List);

