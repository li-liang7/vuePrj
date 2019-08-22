import axios from 'axios';
var myaxios = {};
//导出时必须是个对象
myaxios.install = function(Vue){
    var axios_object = axios.create({
        baseURL:'http://127.0.0.1:8888/api/private/v1/',
        headers:{'Authorization':window.localStorage.getItem('token')},
    });
    Vue.prototype.$myHttp = axios_object;
 }
 export default myaxios;