/**
 * 登陆页面js
 */
var path;

/**
 * 当登录页面打开的时候,就会从cookie中查找对应的cookie,填充到登录框密码和复选框中,如果用户名,密码都存在,
 * 就把复选框选中
 */
$(function() {
	loadLoginInfo();
	var ie = getBrowserType();
	if(ie == 'IE'){
		$("#tipsModal").fadeIn('3000');
		var time = 5;
		var t = setInterval(function() {
			$("#tipsModal>div:eq(0)>span").html("0"+time).css("color","orange");
			time--;
		}, 1000)
		var m = setTimeout(function() {
			$("#tipsModal").fadeOut('3000');
		}, 5000)
	}
});

/**
 * 加载cookie
 */
function loadLoginInfo(){
	// 1 获取到指定名字的cookie
	var cookies = document.cookie; //BG_asd=123456,loginInfo="admin01,test123456",""a
	
	// 2 找到需要的cookie
	// 以=号拆分cookie,
	var cookArr = cookies.split('=');
	if (cookArr[0] != 'loginInfo') {
		return;
	}
	//处理值,去掉前后""
	var cookieVal = cookArr[1].replace(/"/g,"");
	cookArr = cookieVal.split(",");
	var loginName = cookArr[0];
	var loginPass = cookArr[1];
	if (loginName.length>0&&loginPass.length>0) {
		//勾选复选框
		$('#ck_rmbUser').prop("checked",true);
		//填充到页面
		$('#loginName').val(loginName);
		$('#loginPass').val(loginPass);
		return;
	}else{
		$('#loginName').val(loginName);
	}
}

/**
 * 检查登陆名
 */
function checkLoginName() {
	// 获取用户名
	var flag = checkLogin($("#loginName"));
	if (flag[0]) {
		// 清空loginNameMemsgBox
		$('#loginNameMesgBox').html('');
		var tips = '<span class="glyphicon glyphicon-ok"></span>';
		$('#loginNameMesgBox').append(tips);
		$('#loginNameMesgBox').css('color', 'green').show();
		return true;
	} else {
		$('#loginNameMesgBox').html('');
		var tips = '<span class="glyphicon glyphicon-remove"></span>';
		tips = tips + ' ' + flag[1];
		$('#loginNameMesgBox').append(tips);
		$('#loginNameMesgBox').css('color', 'red').show();
		return false;
	}
}

/**
 * 检查登陆密码
 */
function checkLoginPass() {
	var flag = checkLogin($("#loginPass"));
	if (flag[0]) {
		// 清空loginNameMemsgBox
		$('#loginPassMesgBox').html('');
		var tips = '<span class="glyphicon glyphicon-ok"></span>';
		$('#loginPassMesgBox').append(tips);
		$('#loginPassMesgBox').css('color', 'green').show();
		return true;
	} else {
		$('#loginPassMesgBox').html('');
		var tips = '<span class="glyphicon glyphicon-remove"></span>';
		tips = tips + ' ' + flag[1];
		$('#loginPassMesgBox').append(tips);
		$('#loginPassMesgBox').css('color', 'red').show();
		return false;
	}
}

/**
 * 是否保存cookie
 */
function isSaveCookie(){
	var res = $("#ck_rmbUser").prop('checked');
	if(res){
		if(confirm('警告!\n        该功能不适合在公共场所使用,请确保是您本人的个人电脑,防止账号被他人盗用!!')){
			$("#ck_rmbUser").attr('checked',true);
		}else{
			$("#ck_rmbUser").attr('checked',false);
		}
	}
	
}

/**
 * 登陆
 */
var loginCount = 1;
function login() {
	// 获取复选框是否选中,用于确定是不是要添加到cookie中
	var isSaveUser = $("#ck_rmbUser").prop("checked");
	// 获取用户名
	var loginName = $("#loginName").val();
	// 获取密码
	var loginPass = $("#loginPass").val();
	// 提交校验
	var submitChecked = checkLoginName(loginName) && checkLoginPass(loginPass);

	if(loginCount>3){
		if(confirm("您的登陆次数过多,是否需要找回密码?")){
			initFindPwdView();
			$("#findLoginPwd").modal("show");
			return;
		}
	}

	if (submitChecked) {
		// 提交到后台
		$.ajax({ // 一个Ajax过程
			url : 'ajaxLogin.sp', // 请求地址, 就是你的控制器, 如
			async:false,//这里设置的作用是为了把回调函数的值引用给调用者的变量
//			data : JSON.stringify({'loginName' : vals}), // 需要传送的参数
			data : {'account':loginName,'password':loginPass,'isSaveUser':isSaveUser}, // 需要传送的参数
			type : 'POST', // 请求方式
			dataType : 'json', // 返回数据的格式, 通常为JSON
//			contentType : 'application/json',
			success : function(respRes){
				if (respRes.flag) {
					location.href='toMainPage.sp';
				}else{
					loginCount++;
					$("#loginPassMesgBox").html(respRes.msg).css('color','red');
				}
			},
			error:function(){
				alert("执行success回调函数出现了异常");
			}
		});
	} else {
		alert("登陆信息有误,请检查")	
	}
}

/**
 * 校验用户名和密码
 * 
 * @param obj
 *            jQuery对象
 * @returns {*[校验结果,校验信息]}
 */
function checkLogin(obj) {
	var res = true;
	var msg = '';
	var vals = '';
	// 校验用户名
	if (obj.attr('id') == 'loginName') {
		vals = obj.val();
		if (!vals.trim()) {// 非空校验
			res = false;
			msg = '用户名不能为空!';
			return [ res, msg ];
		} else if (vals.length < 6 || vals.length > 15) { // 长度校验
			res = false;
			msg = '用户名长度不正确!';
			return [ res, msg ];
		} else if (!/^[a-zA-Z]([-_a-zA-Z0-9]{5,15})+$/.test(vals)) { // 字母数字校验
			res = false;
			msg = '用户名不是数字&字母组合!';
			return [ res, msg ];
		} else {
			var result ;
			$.ajax({
//				contentType: "application/x-www-form-urlencoded; charset=utf-8", 
				url : 'ajaxValidateLoginName.sp', // 请求地址, 就是你的控制器, 如
				async:false,//这里设置的作用是为了把回调函数的值引用给调用者的变量
//				data : JSON.stringify({'loginName' : vals}), // 需要传送的参数
				data : {'loginName':vals}, // 需要传送的参数
				type : 'POST', // 请求方式
				dataType : 'json', // 返回数据的格式, 通常为JSON
//				contentType : 'application/json',
				success : function(respRes){
					result = respRes;
					res = respRes.flag;
					msg = respRes.msg;
				},
				error:function(){
					alert("执行success回调函数出现了异常");
				}
			});
//			console.log(result);
			return [ res, msg ];
		}
	}
	
	// 校验密码
	if (obj.attr('id') == 'loginPass') {
		vals = obj.val();
		if (!vals.trim()) {// 非空校验
			res = false;
			msg = '密码不能为空!';
			return [ res, msg ];
		} else if (vals.length < 6 || vals.length > 16) { // 长度校验
			res = false;
			msg = '密码长度不正确!';
			return [ res, msg ];
		} else { // 校验通过
			res = true;
			msg = '';
			return [ res, msg ];
		}
	}
}

/* 跳转到注册页面 */
function toRegist() {
	window.location.href = 'toRegistPage.sp';
}



/*
	更新日期:2018年11月25日
*/
var mark ;
var times = 0;//用于判断当前验证码是否已找回过密码
function getCode(id){
	if(times!=0)times=0;
    var thisID = id+"Btn";
    var num = $(id).val();
    var type = "";
    var msg = "<span class=\"label label-info\">提示</span> ";
    //获取账号
	var res;

    if(id == "#tel"){
        type = "tel";
        msg += "验证码已发送到 <span class=\"glyphicon glyphicon-phone\"></span><span class=\"tel-msg-span\">"+num+"</span>,请打开手机短信中查看!";
        if(!/^[1][3,4,5,7,8][0-9]{9}$/.test(num)){
            alert("请输入有效的手机号码!");
            return;
        }else{ //手机号未注册校验
            res = ajaxCheck(num,type);
        }
	}else if(id == "#email"){
    	type = "email";
        msg += "验证码已发送到 <span class=\"glyphicon glyphicon-envelope\"></span><span class=\"tel-msg-span\">"+num+"</span>中,请在邮件中查看!";
    	if(!/^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/.test(num)){
    		alert("邮箱不合法,请检查!");
    		return;
		}else{
            res = ajaxCheck(num,type);
		}
	}
	//邮箱或手机号是注册手机号
	if(!res.flag){
    	alert(res.msg);
    	return;
	}

	//发送验证码到手机或者邮箱
    
    //获取验证码方法
	$.ajax({ url:"getVerfyCode.sp", type:"post", async:false, data:{type:type,num:num,account:$("#loginName").val()}, success:function (resp) { res = resp; }});
	if(res.flag){
		$(id+"Code").attr("readonly",false);
	}else {
		alert(res.msg);
		$(id+"Code").attr("readonly",true);
		return;
	}
	// 等待60秒,60秒后可以再次获取验证码
	var time = 60;
	if(id == "#email") time = 180;
    mark = window.setInterval(function () {
		time--;
		$(thisID).html("<small>"+time+"秒后重新获取</small>").attr("disabled",true);
		$(id).attr("readonly",true);
		$(id+"Msg").empty().append(msg);
		if(time == 0){
			clearInterval(mark);
            $(thisID).html("获取验证码").attr("disabled",false);
            $(id).attr("readonly",false);
            $(id+"Code").attr("readonly",true);
            $(id+"Msg").empty().append("　");
		}
	},1000);
}

/**
 * 获取验证结果
 * @param coreID
 */
function getLoginPwd(coreID){
	if(times != 0){
		alert('该验证码已使用过,请重新获取!');
		return;
	}
	var code = $(coreID+'Code').val();
	var telOrEmail = $(coreID).val();
	var account = $('#loginName').val();
	var res;
	$.ajax({
		url:'getLoginPwd.sp',
		type:'post',
		data:{vCode:code,telOrEmail:telOrEmail,account:account,type:coreID},
		async:false,
		success:function(resp){
			res = resp;
		}
	});
	if(res.flag){
		loginCount = 1;
		times = 1;
	}else{
		times = 0;
	}
	$('#pwdView label').html(res.msg);
	$('#pwdView').modal('show');
}

function closeView(){
	initFindPwdView();
	$('#pwdView,#findLoginPwd').modal('hide');
}

function initFindPwdView(){
	$("#tel,#telCode,#email,#emailCode,#pwdView label").val('');
	$("#tel,#email").attr("readonly",false);
	$("#telCode,#emailCode").attr("readonly",true);
	$("#telBtn,#emailBtn").html("获取验证码").attr("disabled",false);
	times = 0;
	if(mark){
		clearInterval(mark);
		$("#telMsg,#emailMsg").html('');
	} 
}

/**
 * 验证码框监听事件
 * @param idStr
 */
function checkCode(idStr) {
	var code = $(idStr).val();
	if(''==code || !code){
		$(idStr+'Btn').attr("disabled",true);
	}else{
        $(idStr+'Btn').attr("disabled",false);
	}
}

function ajaxCheck(num,type) {
	var res;
    $.ajax({
        url:'ajaxNumIsRegist.sp',
        type:'post',
		async:false,
        data:{type:type,value:num,account:$("#loginName").val()},
        success:function (resp) {
            res = resp;
        }
    });
    return res;
}