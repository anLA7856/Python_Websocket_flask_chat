/*
 * @authors :anLA7856
 * @date    :2017-10-24
 * @description：消息，是放在scroll里面的。代表着发送的一条消息。，仅仅代表消息列表。
 */

import React, { Component, PropTypes } from 'react';
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import classnames from 'classnames';
import actions from "src/actions";
import Scroll from 'src/components/common/Scroll'

import './Index.scss';




class Messages extends Component{
	constructor(props){
		super(props);

    	this.state = {
    		z:1
    	};
	}
	//第一次加载进入。
	componentDidMount(){
		//dia(this);
	}
	//去到哪一个消息。
	_goTo(y){
		console.log(y)
	}
	//事件，比如几分几秒几年。
	time(date,prevDate){
		// console.log(date,prevDate)区间，超过这个时间区间，就要显示时间。
		let Interval  = 2*60*1000;
		let nowDate = new Date();
		nowDate.setTime(date)
		let intDate = parseInt(date),intPrevDate = parseInt(prevDate);
		
		let ret =intDate - intPrevDate;

		if(ret>=Interval){
			return nowDate.toLocaleString();
		};
		return "";
	}
	//超链接是返回怎样的属性。
	link (str){
		var reg = /(http:\/\/|https:\/\/)((\w|=|\?|\.|\/|&|-)+)/ig
		return str.replace(reg,'<a className="link" target="_bank" href="$1$2">$1$2</a>')
	}
	
	//render方法。
	render(){
		let {_user,_currentChat} = this.props;
		return ( 
		        /*message-w代表整个聊天框
		         * */
			<section className="message-w">
				<header className="group-name">
					<h3>公共聊天室</h3>
				</header>
			    <div className="message" >
			    	<Scroll allowScroll={false} isToBottom={true} scrollbar="custom" scrollTo={(y)=>this._goTo(y)}>
				        <ul>
				            <li className="first" ><span className="history">查看更多历史消息</span></li>
				            {
				                //把message的这个array用map的方式遍历一遍。
			            	_currentChat.messages.map((item,i)=>{
			            		return (
			            			<li key={i}>
			            				{
			            				i!=0&&this.time(item.date,_currentChat.messages[i-1].date)!=''?(
			            					<p className="time">
							                    <span>{this.time(item.date,_currentChat.messages[i-1].date)}</span>
							                </p>
			            				):(
			            				null
			            				)
			            				}
						                
						                <div className={classnames("main",{"self":item.self})}>
						                    <img className="avatar" width="35" height="35"src={item.self ? _user.img:item.pic}/>
						                    <div >
			            				        <p>{item.self ? _user.name:item.name}</p>
			            				        <div className="text" dangerouslySetInnerHTML={{ __html: this.link(item.content) }} />
						                    </div>
			            				</div>
						            </li>
			            		);
			            	})
					        }
				        </ul>
				    </Scroll>
			    </div>
			    <div className="dialog">
			        <p className="mask"></p>
			        <div className="dia-cont">
			            <div className="clearfix">
			                <p className="avatar"><img src="https://ps.ssl.qhimg.com/t01531c2d8bd3dbe644.jpg" alt=""/></p>
			                <p className="nickname fl">测试的</p>
			            </div>
			            <p className="remark">
			                <label htmlFor=""> 备注  </label>
			                <input className="input" maxLength="10"  placeholder="点击添加备注" type="text" />
			            </p>
			        </div>
			    </div>
			</section>
		);
	}
};
//传递进来state来初始化三个。
let mapStateToProps=(state)=>{
	let {sessions,user,currentChat} = state.chatIndex;
	return {
		_sessions:sessions,
		_currentChat:currentChat,
		_user:user
	};
}; 

 //绑定action
let mapDispatchToProps=(dispatch)=>{
	return {
		ACTIONS:bindActionCreators(actions,dispatch)
	};
};
//用于和redux之间的连接。
export default connect(mapStateToProps,mapDispatchToProps)(Messages);

