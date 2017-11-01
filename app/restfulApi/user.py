#!/usr/bin/env python
# -*- coding:utf-8 -*-
from flask import jsonify, request, current_app, url_for
from . import api
import redis
#注意，不是from ..app，而只是..

from twisted.conch.test.test_insults import methods
from ..util import *

import random

#from ..util import getLoginInData,outputJson

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
    if myRedis.sismember('users', username):
        return outputJson('该用户名已经存在，请重新输入！,username aready existed')
    else:
        mydata = []
        mydata.append(str(random.randint(1, 4))+'.jpeg')
        mydata.append('/pic/')
        mydata.append(username)

        myRedis.sadd('users', mydata)
        
        #strre = getUserByUsername(username)
        #return strre
        strre = getLoginInData(myRedis,mydata)
        print(strre)
        return strre


    
    
    
    
    
    

    

    
    