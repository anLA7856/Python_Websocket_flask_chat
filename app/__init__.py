#!/usr/bin/env python
# -*- coding:utf-8 -*-
from flask import Flask
from flask_cors import *
from config import config
import redis
from _chat import websocket_server


pool = redis.ConnectionPool(host='127.0.0.1', port=6379)


def create_app(config_name):
    app = Flask(__name__)
    #先允许跨域，以后删除
    CORS(app, supports_credentials=True)
    app.config.from_object(config[config_name])
    config[config_name].init_app(app)
    from .restfulApi import api as api_1_0_blueprint
    app.register_blueprint(api_1_0_blueprint, url_prefix='/api/v1.0')
    #启动websocket的server。
    server = websocket_server(9000)
    server.start()
    
    return app



