/*
 * @authors :anLA7856
 * @date    :2017-10-25
 * @description :storm 用来存储数据的地方。
 * storage就代表着window.localstorage，
 * 注意定义方法，只定义了even_storage这个空方法，就是()>=void，lamda表达式。
 * store和_api都是声明。
 */
var storage = window.localStorage,store,_api,even_storage=function(){};

/**
 * 判断是否为json格式。
 * @param obj
 * @returns
 */
function isJSON(obj){
    return typeof(obj) === "object" && Object.prototype.toString.call(obj).toLowerCase() === "[object object]" && !obj.length;
}
/**
 * 返回val的string串。
 * @param val
 * @returns
 */
function stringify (val) {
    return val === undefined || typeof val === "function" ? val+'' : JSON.stringify(val);
}
/**
 * 把json数据的value解析成他原来的格式。
 * @param value
 * @returns
 */
function deserialize(value){
    if (typeof value !== 'string') { return undefined ;}
    try { return JSON.parse(value) ;}
    catch(e) { return value || undefined ;}
}
/**
 * 判断是value是否是一个方法。
 * @param value
 * @returns
 */
function isFunction(value) { return ({}).toString.call(value) === "[object Function]";}
/**
 * 判断value是否为数组
 * @param value
 * @returns
 */
function isArray(value) { return value instanceof Array;}

/**
 * 如果store不存在，那么久new一个store。
 * 就是他的构造方法，js里面的单例模式。
 * @returns
 */
function Store(){
    if(!(this instanceof Store)){
        return new Store();
    }
}

/**
 * 在prototype里面可以定义他的函数。
 */
Store.prototype = {
		//set方法，应该就是设置。
    set: function(key, val){
        even_storage('set',key,val);
        if(key&&!isJSON(key)){
        	//把key和val存到本地浏览器数据库。
            storage.setItem(key, stringify(val));
        }else if(key&&isJSON(key)&&!val){
        	//如果key是json，name就把key里面的每个一个个都存到本地浏览器数据库
            for (var a in key) this.set(a, key[a]);
        }
        //方便链式存储
        return this;
    },
    //由key获取value值。
    get: function(key){
    	//key不存在，不是个变量。的情况。
        if(!key) {
            var ret = {};
            this.forEach(function(key, val) {
                ret[key] = val;
            });
            return ret;
        }
        return deserialize(storage.getItem(key));
    },
    //清空操作。
    clear: function(){
        this.forEach(function(key, val) {
            even_storage('clear',key,val);
        });
        storage.clear();
        return this;
    },
    //移除操作。
    remove: function(key) {
        var val = this.get(key);
        storage.removeItem(key);
        even_storage('remove',key,val);
        return val;
    },
    //判断是否含有。
    has:function(key){return storage.hasOwnProperty(key);},
    //返回key的集合。
    keys:function(){
        var d=[];
        this.forEach(function(k, list){
            d.push(k);
        });
        return d;
    },
    //返回key的大小。
    size: function(){ return this.keys().length;},
    //遍历本集合。
    forEach: function(callback) {
        for (var i=0; i<storage.length; i++) {
            var key = storage.key(i);
            if(callback(key, this.get(key))===false) break;
        }
        return this;
    },
    //搜索集合，把符合要求的放入str中。
    search: function(str) {
        var arr = this.keys(),dt= {};
        for (var i = 0; i < arr.length; i++) {
            if(arr[i].indexOf(str)>-1) dt[arr[i]]=this.get(arr[i]);
        }
        return dt;
    },
    //如果cb是个方法，那么把这个方法给even_storage.
    onStorage: function(cb){
        if(cb && isFunction(cb)) even_storage = cb;
        return this;
    }
}

/**
 * 这个是个小写的store，代表数据。，代表一个方法。
 */
store = function(key, data){
	//arguments，就代表这传入此方法的参数。
	//更具传入的参数不同，可以分为几种解决方案。
	//类似于java里面的重载，但没有重载好。
    var argm = arguments,_Store = Store(),dt = null;
    if(argm.length ===0) return _Store.get();
    if(argm.length ===1){
    	//如果argm有值，分为两种，如果是string就通过key获得值
    	//如果是json，那么久把值存储进去。
        if(typeof(key) === "string") return _Store.get(key);
        if(isJSON(key)) return _Store.set(key);
    }
    //当有两个参数的时候处理。
    if(argm.length === 2 && typeof(key) === "string"){
        if(!data)return _Store.remove(key);
        if(data&&typeof(data) === "string")return _Store.set(key,data);
        if(data&&isFunction(data)) {
            dt = null
            dt = data(key,_Store.get(key))
            return dt?store.set(key, dt):store;
        }
    }
    //两个参数，并且key是数组。data是方法。
    //类似于java8里面的customer类，在data里面需要进行数据处理。
    if(argm.length === 2 && isArray(key) && isFunction(data)){
        for (var i = 0; i < key.length; i++) {
            dt = data(key[i],_Store.get(key[i]))
            store.set(key[i], dt)
        }
        return store
    }
}
//把Store里面的各种方法都给store。
for (var a in Store.prototype) store[a] = Store.prototype[a];

module.exports = store;