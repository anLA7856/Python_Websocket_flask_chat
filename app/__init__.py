#!/usr/bin/env python
# -*- coding:utf-8 -*-
from flask import Flask
from config import config
import redis

pool = redis.ConnectionPool(host='127.0.0.1', port=6379)


def create_app(config_name):
    app = Flask(__name__)
    app.config.from_object(config[config_name])
    config[config_name].init_app(app)
    from .restfulApi import api as api_1_0_blueprint
    app.register_blueprint(api_1_0_blueprint, url_prefix='/api/v1.0')

    return app



