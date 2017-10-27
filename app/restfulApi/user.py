#!/usr/bin/env python
# -*- coding:utf-8 -*-
from flask import jsonify, request, current_app, url_for
from . import api
import redis
#注意，不是from ..app，而只是..
from .. import pool
from twisted.conch.test.test_insults import methods
from ..util import verify

#用于最开始，新加入用户。
@api.route('/user/add',methods=['GET'])
def joinChat():
    myRedis = redis.Redis(connection_pool=pool)
    username = request.args.get('username')
    #前段判断过为null加了，所以不用判断了。
    if username is None:
        return '请输入合法用户名'
    #判断redis里面的users是否存在
    #开始在编写测试的时候，把string里面一个也命名为users，总报错说key有问题，用del users删了就没事了
    if myRedis.sismember('users', username):
        return '[该用户名已经存在，请重新输入！]'
    else:
        myRedis.sadd('users', username)
        return '[1]'
    

    
    
    
    
    
    
    

    

    
    