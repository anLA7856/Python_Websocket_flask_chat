#!/usr/bin/env python
# -*- coding:utf-8 -*-
from flask import jsonify, request, current_app, url_for
from . import api
import redis
#注意，不是from ..app，而只是..

from twisted.conch.test.test_insults import methods
from ..util import *
import random

#用于最开始，新加入用户。这个是加入私聊，也就是新开房间的聊天
@api.route('/user/add',methods=['get','post'])
def joinChat():
    #每一个连接，都返回给一个redis连接。
    myRedis = redis.Redis(connection_pool=pool)
    #request方法获得
    username = request.args.get('password')
    #获取传入的原始数据，也就是请求中的body数据。
    if(username is None):
        data = request.data
        username=json.loads(data)['password']
  #  use2 = request.data['password']
    #前段判断过为null加了，所以不用判断了。
    if username is None:
        return outputJson('请输入合法用户名,please input username')
        #username = '1232'
    #判断redis里面的users是否存在
    #开始在编写测试的时候，把string里面一个也命名为users，总报错说key有问题，用del users删了就没事了
    if myRedis.sismember('usersOnlyName', username):
        print('该用户名已经存在，请重新输入！,username aready existed');
        return outputJson('该用户名已经存在，请重新输入！,username aready existed')
    else:
        mydata = []
        #保证30张以内，头像不重复。
        picture = str(random.randint(1, 30))+'.jpg';
        i = 0;
        while (myRedis.sismember('picture', picture)):
            i = i+1
            if(i >29):
                break
            picture = str(random.randint(1, 30))+'.jpg';
            
        myRedis.sadd('picture',picture)
        
        mydata.append(picture)
        mydata.append('/pic/')
        mydata.append(username)
        
        #还是以数组的方式存进去吧。
        strData = mydata[0] + "[~" + mydata[1]+"[~"+mydata[2];
        #多分出一个set，防止用户名重复。
        myRedis.sadd('usersOnlyName',username)
        myRedis.sadd('users', strData)
        
        #strre = getUserByUsername(username)
        #return strre
        strre = getLoginInData(myRedis,mydata)
        return strre


    
    
#用于，当用户点击注销登录的时候，将该用户从大厅中清除
@api.route('/user/delete/<username>',methods=['get','post'])
def deleteUser(username):
    #每一个连接，都返回给一个redis连接。
    myRedis = redis.Redis(connection_pool=pool)
    deleteUserInfoFromRedis(myRedis,username)
    return outputJson('删除成功');
    

#用于客户端的定时任务，从服务器端得到当前仍然在线的聊天人员。
@api.route('/user/update',methods=['get','post'])
def updateUserList():
    myRedis = redis.Redis(connection_pool=pool)
    returnJson = getCurrentUsersInHoll(myRedis)
    print(returnJson)
    return returnJson
    

    

    
    