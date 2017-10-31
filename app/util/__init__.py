#!/usr/bin/env python
# -*- coding:utf-8 -*-
from ..models import Message,Ownuser,User,Sessions,ReturnJson
import json
import time
#工具方法包

current_milli_time = lambda: int(round(time.time() * 1000))
#初始登录，得到初始化json，也一般是进入大厅得到未来24小时会话。

def getLoginInData(myredis,mydata):
    #需要从大厅取数据。，这里默认大厅的聊天代号为:room_000，其他房间为unix时间戳。
    #获得某个房间的所有存在于系统的所有聊天记录，这里默认
    #只能进入公共聊天室算了，不能进入私人聊天室，以后有机会实现。
    roomNum = 'room_000'
    returnJson = ReturnJson()
    returnJson.res = 10000
    returnJson.user = getUserByUsername(mydata)
    returnJson.sessions = getSessionsByRoomNum(myredis, roomNum)
    returnJson.message = 'ok'
    tes = returnJson.to_json()
    return tes
    
#下周一来写这里，此时这种方法能不能返回正确json，因为我是用面向对象思想写的。
def getRoomNumByUsername(myredis,username):
    #调用这个方法的，肯定都是私聊的
    name = 'room_'+current_milli_time()
    #把这个套装存到redis里面。
    myredis.set(username,name)
    return name

def getUserByUsername(mydata):
    ownuser = Ownuser()
    ownuser.createOwnuser('default.jpg',mydata['name'],['name'])
    ownuser.img = mydata['location']+mydata['picName']
    strsss = ownuser.to_json()
    return strsss

#虽然设定是单人的方式但是打算搞成多人的方式，供扩展。由于是根据roomnum得的，所以最终只能有一个session返回。
def getSessionsByRoomNum(myredis,roomNum):
    sessions = []
    #这里里面就只放一个,就只是大厅的
    session = Sessions()
    session.id = current_milli_time()
    session.user = getRoomInfoByRoomNum(roomNum)
    session.messages = getChatDataByRoomNum(myredis,roomNum)
    temp = session.to_json()
    sessions.append(temp)

    return sessions

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
        temp = message.to_json()
        messages.append(temp)
        
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
        




        
        
        
        
        
        
        
        
        
        
        
        
        