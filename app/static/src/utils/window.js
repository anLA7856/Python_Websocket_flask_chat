import 'jquery'
//添加onunload事件

window.onbeforeunload = function(event) {
	var m = 0;
	event.returnValue = "我在这写点东西...";
	fetch('http://localhost:5000/api/v1.0/user/delete/'+username).then(res => {}).catch(err => {})
};
