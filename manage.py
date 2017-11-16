#!/usr/bin/env python
# -*- coding:utf-8 -*-
#用于启动python服务端。
import os
#引入系统环境变量
if os.path.exists('.env'):
    print('import data from .env')
    for line in open('.env'):
        temp = line.strip().split('=')
        if(len(temp) == 2):
            os.environ[temp[0]] = temp[1]

#引入依赖包。
from app import create_app
app = create_app(os.getenv('FLASK_CONFIG') or 'default')


#启动项目
if __name__ == '__main__':
   app.run(host='0.0.0.0',port=5000,debug=True)