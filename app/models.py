#!/usr/bin/env python
# -*- coding:utf-8 -*-
#实体类
import json

class Message():
    content=""
    date=""
    self=""
    
    def to_json(self):
        json_message = json.dumps({
            'content': self.content,
            'date': self.date,
            'self': self.self
        })
        return json_message
    

class Ownuser():
    img=""
    sid=""
    name=""
    def createOwnuser(self,img,sid,name):
        self.img = img
        self.sid = sid
        self.name=name
    
    def to_json(self):
        #需要这样返回，否则汇报错，说dict，不能被识别，resolve a type。
        json_ownuser = json.dumps({
            'img': self.img,
            'sid': self.sid,
            'name': self.name
        })
        return json_ownuser

class User():
    name=""
    img=""
    status=""
    history=""
    
    def to_json(self):
        json_user = json.dumps({
            'name': self.name,
            'img': self.img,
            'status': self.status,
            'history': self.history
        })
        return json_user
    

class Sessions():
    id=""
    user=""
    messages=""
    
    def to_json(self):
        json_sessions = json.dumps({
            'id': self.id,
            'user': self.user,
            'messages': self.messages
        })
        return json_sessions
    
class ReturnJson():
    res=""
    #这个user是ownuser。
    user=""
    sessions=""
    message=""
    
    def to_json(self):
        json_returnJson = json.dumps({
            'res' : self.res,
            'user': self.user,
            'sessions': self.sessions,
            'message': self.message
        })
        return json_returnJson

