/**
 *
 * ProjectName：blogme
 * Description：
 * Created by qimuyunduan on 16/5/3 .
 * Revise person：qimuyunduan
 * Revise Time：16/5/3 下午2:29
 * @version
 *
 */


//clear left and right blanks
function trimLeftRight(strArr) {
	var length = 0;
	if ($.isArray(strArr)) {
		length = strArr.length;
		for (var i = 0; i < length; i++) {
			strArr[i] = strArr[i].replace(/^\s+|\s+$/g, "");
		}
	}
	return strArr;
}


// check :is empty for every field and trim blanks

function checkTrim(values) {
	var sumLength = 0;
	if ($.isArray(values)) {
		var count = values.length;
		for (var i = 0; i < count; i++) {
			//去掉所有空格
			values[i] = values[i].replace(/\s+/g, "");
			sumLength += values[i].length;
		}
	}
	if (sumLength == 0) {
			alertMsg.warn("输入内容不能为空......");
			return false;
	}
	else {
		return values;
	}


}
//check field values length
function checkLength(min,max,values){
	var length = 0;
	if ($.isArray(values)) {
		length = values.length;
		for (var i = 0; i < length-1; i++) {
			if(values[i].length<min||values[i].length>max){
				setMessage("用户名和密码长度不小于4...");
				return false;
			}
		}
	}
	return true;
}


// merge two array to object
function mergeToObject(keys,values){
	var hash = {};
	if($.isArray(keys) && $.isArray(values)&& keys.length == values.length){
		var length = keys.length;
		for (i = 0;i < length; i++) {
			hash[keys[i]] = values[i];
		}
	}
	return hash;
}

function isContainSpecialChar(strArr,isLogin) {

	//匹配特殊字符
	var pattern=/[`~!@#$%^&*()_+<>?:"{},.\/;'[\]]/im;
	if ($.isArray(strArr)) {
		var count = strArr.length;
		for (var i = 0; i < count; i++) {
			if (pattern.test(strArr[i])) {

				if(isLogin){
					setMessage("用户名或密码包含有非法字符......");
					return true;
				}
				alertMsg.warn("输入框内包含有非法字符......");
				return true;

			}
		}
	}
	return false;

}
//antiSQL
function antiSQL(values,isLogin) {

	var regex = /select|update|delete|insert|exec|count|’|"|=|;|>|<|%/i;
	var length = values.length;

	if ($.isArray(values)) {
		for (var i = 0; i < length; i++) {
			if (regex.test(values[i])) {

				if(isLogin){
					setMessage("用户名或密码含有特殊字符串...");
					return false;
				}
				alertMsg.warn("请不要输入特殊字符串...");
				return false;

			}
		}
	}

	return true;
}


//获取去除空格后每个查询字段的值
function getQueryObject(formID) {
	var form = $('#' + formID);
	var keys = [];
	var values = [];
	var queryObject = {};
	if (form) {
		var querySer = form.serializeArray();
		$.each(querySer, function (i, field) {
			keys.push(field.name);
			values.push(field.value);
		});

	}
	//add control for showing records
	keys.push("numPerPage");
	keys.push("currentPage");
	var results = checkTrim(values);
	if (results) {
		if (!isContainSpecialChar(results,false)) {
			if (antiSQL(values,false)) {
				results.push("50");
				results.push("1");
				queryObject = mergeToObject(keys, results);
				return queryObject;
			}
		}

	}
	return false;
}

// get table row data
function getRowData(){

}

function changePageNum(){

}
//send request

function sendRequest(formID, url,method){
	var formData = getQueryObject(formID);
	if(formData){
		$.ajax({
			type: method,
			url: url,
			data: formData,
			async: false,
			error: function () {
				alertMsg.error("sorry!链接服务器失败...");
			}
		});
	}

}



function setMessage(message){
	$('#loginUserName').val(message);
	$('pwd').val("");
}

//dispose user login
function login() {
	var form = $('#loginForm');
	var keys = [];
	var values = [];
	var queryObject = {};
	if (form) {
		var querySer = form.serializeArray();
		$.each(querySer, function (i, field) {
			keys.push(field.name);
			values.push(field.value);
		});

	}

	var result = checkTrim(values);

	if (checkLength(4, 20, result)) {
		if (!isContainSpecialChar(result,true)) {

			if (antiSQL(result,true)) {
				queryObject = mergeToObject(keys, result);
				$.ajax({
					type: "post",
					url: "index",
					data: queryObject,
					async: false,
					error: function () {
						alert("error connection...");
					},
					success:function(data){

						if(data=="success"){
							window.location = "/authorized"
						}
						else{
							setMessage("用户名或密码错误...");
						}
					}
				});

			}
		}

	}

}


// request
//$.ajax({
//	type: "POST”,//PUT GET DELETE
//	url:ajaxCallUrl,
//	data:$('#yourformid').serialize(),// 你的formid
//	async: false,
//	error: function(request) {
//		alert("Connection error");
//	},
//	success: function(data) {
//		$("#commonLayout_appcreshi").parent().html(data);
//	}
//});


//alert
//alertMsg.confirm("msg")
//alertMsg.correct("msg");
//alertMsg.error("msg");
//alertMsg.warn("msg");
//alertMsg.info("msg");


//navTab

//open
//navTab.openTab(tabid,title,url,[data])
//reload
//navTab.reload(url,data.[tabid])
//close
//navTab.closeTab(tabid)
//navTab.closeCurrent()