# coding=utf-8
'''
Created on 2017年10月20日

@author: anla7856
'''
#初始化
from flask import Flask
app = Flask(__name__)

#路由和视图函数
@app.route('/')
def index():
    return '<h1> Hello World!</h1>'

#启动服务器，默认ip端口为127.0.0.1:5000
if __name__ == '__main__':
    app.run(debug=True)
