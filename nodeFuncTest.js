/**
 *
 * ProjectName：blogme
 * Description：
 * Created by qimuyunduan on 16/4/4 .
 * Revise person：qimuyunduan
 * Revise Time：16/4/4 下午3:06
 * @version
 *
 */
var _ = require('lodash'),
	moment = require('./core/server/utils/moment');
	//moment = require('moment');
//moment.locale('zh-cn');
//console.log(typeof moment().format('d'));



var mystring = "insureNumber=agewg&insureUnit=";
var myarray = mystring.split(/[=&]/);
console.log(myarray);
console.log(myarray.length);
