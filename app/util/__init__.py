#!/usr/bin/env python
# -*- coding:utf-8 -*-

#工具方法包

#判断用户名是否存在。
def verify(redis,username):
    value = redis.get(username);
    if value:
        return False
    return True
    
