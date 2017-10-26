/*
 * @authors :anLA7856
 * @date    :2017-10-24
 * @description：
 * 这个组件是dialogue外面的一层。也就是用来装配Dialogue和Send的外面的一层
 * 
 */

import React, { Component, PropTypes } from 'react';
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import classnames from 'classnames';
import actions from "src/actions";
import Scroll from 'src/components/common/Scroll'
// import dia from 'src/utils/dia';
import Dialogue from "../Dialogue";
import Send from "../Send";
import './Index.scss';




class Messages extends Component{
	constructor(props){
		super(props);
    	this.state = {
    	};
	}
	componentDidMount(){
		//dia(this);
	}
	
	render(){
		let {_sessions,_currentChat,_currentId} = this.props;

		if(!Object.keys(_currentChat).length || _currentChat.id != _currentId){
			return (
				<div className="dialogue-tips">请选择要对话的用户</div>
			);
		};
		//把一个dialog和send套在这这里面。
		return ( 
			<div className="chat-main">
				<Dialogue />
				<Send />
			</div>
		);
	}
};

//因为这个系统是提供跟不同人私聊的，所以，这个index也有以下和redux进行交互的功能。
let mapStateToProps=(state)=>{
	let {sessions,user,currentChat,currentUserId} = state.chatIndex;
	return {
		_sessions:sessions,
		_user:user,
		_currentId:currentUserId,
		_currentChat:currentChat
	};
}; 

let mapDispatchToProps=(dispatch)=>{
	return {
		ACTIONS:bindActionCreators(actions,dispatch)
	};
};
export default connect(mapStateToProps,mapDispatchToProps)(Messages);

