/*
 * @authors :anLA7856
 * @date    :2017-10-24
 * @description：python聊天工具
 * 这个是登录框，先更改。
 */

import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import classnames from 'classnames';             //就是类名。
import actions from "src/actions";
import Sidebar from "../Sidebar/Index";
import Messages from "../Messages/Index";
import { fetchJson } from "src/utils/fetch";


import './Index.scss';



class Login extends Component {
    constructor( props ) {
        super( props );
        //自定义set和state
        this.flag = false;
        this.state = {
            password: '',
            error: "请随意输入一个名字，重复将不得进入"
        };
    }
    //set方法，通过e传过来的target，动态设定值，名字非name！获取name属性里面含有的值
    set( e ) {
        let { name, value } = e.target;
        this.setState( {
            [`${name}`]: value
        } );
    }
    //提交表单的方法，获取从父类传来的props作为actions。不同于ACTION
    submit() {
        let { ACTIONS } = this.props;
        //从state里面获取name和password
        let { password } = this.state;
        var pwd_reg = /^([a-zA-Z0-9]){3,15}$/;
        if ( !password.trim() ) {
            this.setState( { error: "请输入您的房间号" } );
            return false;
        } else if ( !pwd_reg.test( password.trim() ) ) {
            this.setState( { error: "房间号格式有误，请重新输入" } );
            return false;
        } else {
            this.setState( { error: "正在进入中……" } );
            if ( this.flag ) {
                return false;
            };
            this.flag = true;
            //用actions这个统一登录类进行登录。有点像jq
            ACTIONS.chatLogin( {
                data: { password: password },
                success: ( req ) => {
                    this.flag = false;
                }, error: () => {
                    this.flag = false;
                }
            } );
        };
    }

    keyUp( e ) {
        //键盘监听，回车
        if ( e.keyCode === 13 ) {
            this.submit();
        }
    }
    //渲染ui的界面。
    render() {
        let { error } = this.state;
        return (
            <div className="login-form">
                <h1>小房间</h1>
                <p className="row account"><input className="lg-inp" type="text" onChange={( e ) => this.set( e )} onKeyUp={( e ) => this.keyUp( e )} name="password" placeholder="房间号" /></p>
                <p className="row-error" id="error" style={{ color: "red" }}>{error}</p>
                <div className="login-btn">
                    <a href="javascript:void(0)" id="submit" onClick={() => this.submit()} >进入聊天室</a>
                </div>

            </div>
        );
    }
};
//整体布局，通过props来改变，所以先传入state，用state来更改props
let mapStateToProps = ( state ) => {
    let { sessions, user } = state.chatIndex;
    return {
        _sessions: sessions,
        _user: user
    };
};
//绑定dispatch和actions。把action和dispatch连接起来。
//react和redux连接。渲染，一旦发生变化，就又重新渲染。变化内容是actions里面的，通过dispatch来辨别。
//绑定dispatch。
//在组件里面的。
let mapDispatchToProps = ( dispatch ) => {
    return {
        //把整个actions都给这个组件。
        ACTIONS: bindActionCreators( actions, dispatch )
    };
};
//login这个组件。连接，把react和redux连接。
export default connect( mapStateToProps, mapDispatchToProps )( Login );

