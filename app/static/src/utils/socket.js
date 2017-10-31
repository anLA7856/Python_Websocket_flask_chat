//单例模式下的socket，也就是一个聊天，只有一个socket。

var instance;

function createInstance() {
	// const host = "ws://" + $("serverIP").value + ":" + $("serverPort").value;
	// 默认连接串。
	const host = "ws://127.0.0.1:9000/";
	const socket = new WebSocket(host);
	return socket;
}

export const getInstance = ()=> {
	if (!instance) {
		instance = createInstance();
	}
	return instance;
}
