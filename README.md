# Python_Websocket_flask_chat
Based on **python** ,**real-time** chat.

学习了Python和React，完成了一个demo，前端使用React+Redux实现，参考并借鉴了网上代码，后端采用Python的Flask框架，在数据存储方面，简单的利用了Redis进行缓存。
项目包括以下几块内容：

 - 登录功能，不允许重复用户名密码
 - 对在线人数进行过滤搜索
 - 每5s更新一次在线聊天人数
 - 登录时获取近一段时间的聊天室聊天数据
 - 聊天数据以localStorage存在本地，再次刷新数据不会丢失

技术栈：

 - Python Flask作为后端代码实现
 - Redis作为数据存储
 - 基于React+Redux前端框架作为实现


**下面是效果图：**

![界面效果图](https://github.com/anLA7856/Python_Websocket_flask_chat/blob/master/extra/2017-11-06%2013-43-55%E5%B1%8F%E5%B9%95%E6%88%AA%E5%9B%BE.png)

**下面是前端的代码结构：**

![前端代码截图](https://github.com/anLA7856/Python_Websocket_flask_chat/blob/master/extra/2017-11-06%2014-09-53%E5%B1%8F%E5%B9%95%E6%88%AA%E5%9B%BE.png)

**Python端代码结构：**

![python后端代码截图](https://github.com/anLA7856/Python_Websocket_flask_chat/blob/master/extra/2017-11-06%2014-11-21%E5%B1%8F%E5%B9%95%E6%88%AA%E5%9B%BE.png)


运行本项目
### 安装Node.js 
安装Nodejs：
```
sudo apt-get install nodejs
```
安装npm：
```
sudo apt-get install npm
```
配置cnpm：

```
npm install -g cnpm --registry=https://registry.npm.taobao.org
```

```
npm config set registry https://registry.npm.taobao.org
```

### 安装Python
安装python：
```
sudo apt-get install python2.7 python2.7-dev
```
安装pip：

```
sudo apt-get install python-pip
```

### 安装Redis
下载redis：
```
wget http://download.redis.io/releases/redis-4.0.2.tar.gz
tar xzf redis-4.0.2.tar.gz
cd redis-4.0.2
make
```

###运行前端代码
进入**/Python_Websocket_flask_chat/app/static**
分别执行：

```
npm install
```
运行开发环境：

```
npm run dev
```
接着访问:[http://localhost:8085/](http://localhost:8085/)
即可看到主页。

### 运行Redis
进入Redis根目录
执行：

```
./redis-server
```

### 运行python服务器
下载所需依赖：

```
pip install -r /Python_Websocket_flask_chat/requirements/requirements.txt
```

运行服务器：

```
python /Python_Websocket_flask_chat/manage.py
```
