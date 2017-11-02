/*
 * @authors :anLA7856
 * @date    :2017-10-25
 * @description：聊天列表下面的输入框。
 */

import React, { Component, PropTypes } from 'react';
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import classnames from 'classnames';
import actions from "src/actions";

import dia from 'src/utils/dia';

import './Index.scss';




class Messages extends Component{
	constructor(props){
		super(props);
		this.time = null;
		this.flag = false;
    	this.state = {
    		content:"",
    		tips:false
    	};
	}
	//第一次加载完成之后。
	componentDidMount(){
		dia(this);
	}
	//输入内容为null的提示。
	isTisp(){
        clearTimeout(this.time);
        this.open("tips");
        this.tips=true;
        this.time = setTimeout(()=>{
            this.close("tips");
        },2400);
    }
	Set(e){
		let {name,value}= e.target;
		if(e.ctrlKey && e.keyCode === 13){
			value=value+"\n";
		};
		this.setState({
			[`${name}`]:value
		});

	}
	//过滤非法字符。
	filter(str){
		return str(/[|`|~|#|$|^|{|}|\\|[\\]|<|>|~#|——|{|}|【|】]/)
	}
	//验证字符串，
	validate(e){
		let {content} = this.state;
		if(( content.trim().length <= 0) ){
            this.setState({content:content.trim()});
            e.target.value=content.trim();
            //为null就显示提示。
            this.isTisp();
            return false;
        };
        return true;

	}
	//发送消息，ACTION就是个大集合卧槽
	save(){
		let {ACTIONS,_user,_currentId} = this.props;
		let {content} = this.state;
		if(this.flag){
		    //由于更改了逻辑，也就是不是异步ajax发送，而是通过socekt，所以就不用这个判断是否发送成功的bool标志了。
			//return false;
		};
		this.flag = true;
		//成功传入一个回调函数，失败传入一个回调函数。
		ACTIONS.send_message({
			user:_user,id:_currentId,content:content,
			success:(req)=>{
				this.flag = false;
			},
			error:()=>{
				this.flag = false;
			}
		});
		//把内容设置为null，并且把textarea也设为null。
		this.setState({
			content:""
		},()=>{
			this.refs.textarea.value ="";
		});
	}
	//按住回车，直接发送。
	enter(e){
		let {ACTIONS,_user,_currentId} = this.props;
		let {name,value}= e.target;	
		let {content} = this.state;
		if(e.keyCode === 13 && !this.validate(e)){
			return false;
		}else if(e.ctrlKey && e.keyCode === 13){
			value=value+"\n";
			e.target.value= value;
			this.setState({
				[`${name}`]:value
			});
			return false;
		};
		if( ( content.trim().length && e.keyCode === 13 )){
			this.save();
    console.log("发送内容")
            return false;
        };
        this.setState({
			[`${name}`]:value
		});
	}
	sends(e){
	    //debugger;
		if(!this.validate(e)){
			return false;
		}else{
			this.save();
		};
	}
	//销毁。
	destroy(){
		let {ACTIONS,_user,_currentId} = this.props;
		if(_currentId == 1){
			return;
		};
		ACTIONS.set_destroy({
			user:_user,id:_currentId
		});
	}
	//渲染的函数。就是一个套间。class=send的套间。
	render(){
		let {tips,content}=this.state;
		return ( 
			<div className="send">
			    <textarea placeholder="按 Enter 发送, Ctrl + Enter 可换行" ref="textarea" name="content" onKeyUp={(e)=>this.enter(e)}></textarea>
			    <p className="hadler clearfix">
			        <button className="fl hide" onClick={()=>this.destroy()}>送客</button>
			        <button className="fr" onClick={(e)=>this.sends(e,"enter")}>发送</button>
			        <span className={classnames("tips",{"show":tips})} >不能发送空白信息或特殊字符</span>
			    </p>
			</div>
		);
	}
};
//下面就是把react和redux绑定起来的几个方法。
let mapStateToProps=(state)=>{
	let {sessions,user,currentUserId} = state.chatIndex;
	return {
		_sessions:sessions,
		_user:user,
		_currentId:currentUserId
	};
}; 

let mapDispatchToProps=(dispatch)=>{
	return {
		ACTIONS:bindActionCreators(actions,dispatch)
	};
};
export default connect(mapStateToProps,mapDispatchToProps)(Messages);

