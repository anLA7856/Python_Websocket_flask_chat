//单例模式下的socket，也就是一个聊天，只有一个socket。
import {SOCKET_SERVER_IP} from "src/constants/Chat"

var instance;
function createInstance() {
	// const host = "ws://" + $("serverIP").value + ":" + $("serverPort").value;
	// 默认连接串。
	const host = "ws://"+SOCKET_SERVER_IP+"/";
	const socket = new WebSocket(host);
	return socket;
}

export const getInstance = ()=> {
	if (!instance) {
		instance = createInstance();
	}
	return instance;
}
