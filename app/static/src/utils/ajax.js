/*
 * @authors :anLA7856
 * @date    :2017-10-25
 * @description :
 * ajaxjson的方法。
 */
import {API_SERVER_IP} from "src/constants/Chat";
export const ajaxJson = (options) => {

  options.url ="http://"+API_SERVER_IP+"/api/v1.0/"+options.url;

  const { url, type, data, ...others } = options;

  let opts = {
    type: type || 'get',
    url,
    data,
    success:(resData)=>{
    	//成功调用
      resHandler(resData,options)
    },
    error:(error,status)=>{
    	//失败调用
      errorHandler(error,options,status)
    },
  }
  //调用jquery的ajax方法。
  $.ajax(opts);
}


function toJson(resp, options) {
  if (resp.status >= 400) {
    return errorHandler(null, options, resp.status)
  }
  return resp.json()
}

// 请求成功处理
function resHandler(resData, options) { 

  if (resData.status && resData.status != 200) {
    return errorHandler(resData.error, options, resData.status);
  }

  if (!resData || resData.res > 20000) {
    options.error && options.error(resData)
    console.log(resData.message);
  } else {
    options.success && options.success(resData);
  }
}

// 异常处理
function errorHandler(error, options, status) {
  options.error && options.error(error);
  console.log(`网络异常，请稍后重试(${status})`)
}
