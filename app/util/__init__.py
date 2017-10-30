#!/usr/bin/env python
# -*- coding:utf-8 -*-
from ..models import Message,Ownuser,User,Sessions,ReturnJson
import json
import time
#工具方法包

current_milli_time = lambda: int(round(time.time() * 1000))
#初始登录，得到初始化json，也一般是进入大厅得到未来24小时会话。
def getLoginInData(myredis,username):
    #需要从大厅取数据。，这里默认大厅的聊天代号为:room_000，其他房间为unix时间戳。
    #获得某个房间的所有存在于系统的所有聊天记录，这里默认
    roomNum = 'room_000'
    returnJson = ReturnJson()
    returnJson.res = 10000
    returnJson.user = getUserByUsername(username)
    returnJson.sessions = getSessionsByRoomNum(myredis, roomNum)
    returnJson.message = 'ok'
    return returnJson.to_json()
    
#下周一来写这里，此时这种方法能不能返回正确json，因为我是用面向对象思想写的。
def getRoomNumByUsername(myredis,username):
    #调用这个方法的，肯定都是私聊的
    name = 'room_'+current_milli_time()
    #把这个套装存到redis里面。
    myredis.set(username,name)
    return name

def getUserByUsername(username):
    ownuser = Ownuser()
    ownuser.createOwnuser('default.jpg',username,username)
    ownuser.img = '123.jpg'
    strsss = ownuser.to_json()
    return strsss

def getSessionsByRoomNum(myredis,roomNum):
    sessions = Sessions()
    sessions.id = current_milli_time()
    sessions.user = getRoomInfoByRoomNum(roomNum)
    sessions.messages = getChatDataByRoomNum(myredis,roomNum)
    stre = sessions.to_json()
    return stre

def getChatDataByRoomNum(myredis,roomNum):
        #先从某个list里面取得所有数据。
    length = myredis.llen(roomNum);
    messages = []
    for i in range(1,length):
        tempMessage = myredis.rpoplpush(roomNum,roomNum)
        ##下次存的时候，记得是存一个json格式的字符串到redis
        jsonDate = json.load(tempMessage)
        message = Message()
        message.content = jsonDate['content']
        message.date = jsonDate['date']
        message.self = jsonDate['self']
        messages.append(message)
        
    return messages
        
        
def getRoomInfoByRoomNum(roomNum):
    user = User()
    user.name = roomNum
    user.img = "defuat.jpg"
    user.status = 'true'
    user.history = 'false'
    return user.to_json()


        
def outputJson(message):
    json_json = json.dumps({
        'message': message
    })
    return json_json
        

        
        
        
        
        
        
        
        
        
        
        
        
        
        
        