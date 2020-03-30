$(function() {
	//加载日历控件
	initDate('birthdayText');

	//得到表单,遍历表单元素
	$('#registForm input').on({
		blur : function() {
			// console.log("失去焦点:"+ $(this).attr('id'))
			checkedRegistInfo(this);
		},
		focus : function() {
			// console.log("得到焦点:"+ $(this).attr('id'))
			hidenMsgBox(this);
			var a = $("#registForm input:radio[name='gender']:checked").val();
		// alert(a)
		}/*,
		mouseenter : function() {
			rockComment(this);
		}*/
	});

//    // 给提交按钮注册提交表单时间
//    $('#submitBtn').click(function(){
//    	submitRegistInfo();
//    });
});

/**
 * 检查注册信息,根据检查结果填充提示框
 * @param obj
 */
function checkedRegistInfo(obj) {
	//得到当前输入框的id和提示信息标签的id
	var msgBoxId = getCurMsgBoxId(obj);
	var curEleId = $(obj).attr('id');
	console.log("当前元素id:" + curEleId)
	//调用校验方法进行校验,返回结果数组[结果,提示信息]
	var arrRes = checkInputInfo(curEleId);
	// var arrRes = [true,'这是开发环境'];
	//判断结果,给msg标签填充错误信息
	if (arrRes[0]) { //校验通过
		//设置msg盒子字体为绿色,,清空原来内容,追加一个√图标
		$('#' + msgBoxId).css('color', 'green').html('');
		var tips = '<span class="glyphicon glyphicon-ok"></span>';
		$('#' + msgBoxId).append(tips);
	} else { //校验失败
		//设置msg盒子字体为红色,,清空原来内容,追加一个×图标
		$('#' + msgBoxId).css('color', 'red').html('');
		var tips = '<span class="glyphicon glyphicon-remove"></span>';
		tips = tips + ' ' + arrRes[1];
		$('#' + msgBoxId).append(tips);
	}

	$('#' + msgBoxId).removeClass("hidden");
}

/**
 * 隐藏消息提示框
 * @param obj
 */
function hidenMsgBox(obj) {
	var msgBoxId = getCurMsgBoxId(obj);
	$('#' + msgBoxId).addClass("hidden");
}

/**
 * 得到当前消息输入框消息盒子的id
 * @param obj
 * @returns {string}
 */
function getCurMsgBoxId(obj) {
	var curId = $(obj).attr('id');
	if ($(obj).attr('name') == 'gender') {
		return '';
	}
	curId = curId.substring(0, curId.lastIndexOf('Text'));
	//拼接消息框id
	var curMsgId = curId + "MsgBox";
	return curMsgId;
}

/**
 * 校验登陆信息
 * @param obj
 */
function checkInputInfo(obj) {
	if (obj == 'loginNameText') {
		return checkAcc(obj);
	}
	if (obj == 'showNameText') {
		return checkShowName(obj);
	}
	if (obj == 'phoneText') {
		return checkTel(obj);
	}
	if (obj == 'emailText') {
		return checkEmail(obj);
	}
	if (obj == 'birthdayText') {
		return checkBirthday(obj);
	}
	if (obj == 'boy' || obj == 'girl') {
		return [ true, '' ];
	}
	if (obj == 'loginPassText') {
		return checkPwd(obj);
	}
	if (obj == 'loginPassOkText') {
		return checkPwdOk(obj);
	}
	if (obj == 'verifyCodeText') {
		return checkVcode(obj);
	}
}

function submitRegistInfo() {
	//获得所有输入框id
	var tempId;
	var resArr = [ true, '' ];
	var idArr = $("#registForm").find(':input');
	var i = 1;
	$.each(idArr, function() {
		tempId = $(this).attr('id');

		//		console.log($(this).attr('id'));
		//筛选出不需要检查的id
		if (tempId == 'boy' || tempId == 'girl' || tempId == 'submitBtn') {
			console.log("已过滤的id元素:" + $(this).attr('id'));
			//			continue;
			return true;
		}
		//		alert(tempId+"检查结果:"+checkInputInfo(tempId)[0]);
		//		console.log("检查结果:"+checkInputInfo(tempId)[0]);
		//检查过程工发现错误,记录错误信息到resArr中,跳出循环
		var checkRes = checkInputInfo(tempId);
		console.log(tempId + "--" + checkRes);
		if (checkRes[0] == false) {
			resArr = checkRes
			return false;
		}
	});
	//如果校验通过,就提交到后台,否则弹出错误提示框
	if (resArr[0]) {
		alert('校验通过');
		//序列化表单元素
		var formDate = $('#registForm').serialize();
		//		console.log(formDate);
		$.ajax({
			url : 'ajaxRegistUser.sp', // 请求地址, 就是你的控制器, 如
			async : false, //这里设置的作用是为了把回调函数的值引用给调用者的变量
			data : formDate, // 需要传送的参数
			type : 'POST', // 请求方式
			dataType : 'json', // 返回数据的格式, 通常为JSON
			success : function(respRes) {
				if (!respRes.flag) {
					alert(respRes.msg);
				} else {
					alert(respRes.msg + "\n" + '3秒后回到登陆页面');
					window.setTimeout(function() {
						location.href = 'toLoginPage.sp';
					}, 3000);
				}
			},
			error : function() {
				alert("执行success回调函数出现了异常");
			}
		});
	} else {
		alert(resArr[1]);
	}


}



/**
 * 校验用户名
 * @param obj
 * @returns {*}
 */
function checkAcc(obj) {
	var vals = $("#" + obj).val();
	console.log(vals);
	if (!vals.replace(/ /g, '')) { // 非空校验
		console.log(vals.replace(/ /g, ''));
		return [ false, '用户名不能为空!' ];
	} else if (vals.length < 6 || vals.length > 16) { // 长度校验
		return [ false, '用户名长度不正确!' ];
	} else if (!/^[a-zA-Z]([-_a-zA-Z0-9]{5,15})+$/.test(vals)) { // 字母数字校验
		return [ false, '用户名由6-16个字母,数字,和下划线和减号组成,必须以字母开头(字母不区分大小写)!' ];
	} else {
		var result;
		$.ajax({
			//				contentType: "application/x-www-form-urlencoded; charset=utf-8",
			url : 'ajaxValidateLoginName.sp', // 请求地址, 就是你的控制器, 如
			async : false, //这里设置的作用是为了把回调函数的值引用给调用者的变量
			//				data : JSON.stringify({'loginName' : vals}), // 需要传送的参数
			data : {
				'loginName' : vals
			}, // 需要传送的参数
			type : 'POST', // 请求方式
			dataType : 'json', // 返回数据的格式, 通常为JSON
			//				contentType : 'application/json',
			success : function(respRes) {
				if (respRes.flag) {
					result = [ false, '[DB]该用户已被注册' ];
				} else {
					result = [ true, '可以使用' ];
				}
			},
			error : function() {
				alert("执行success回调函数出现了异常");
			}
		});
		return result;
	}
}

/**
 * 昵称校验
 * @param obj
 * @returns {*[]}
 */
function checkShowName(obj) {
	var showName = $("#" + obj).val().replace(/ /g, '');
	if (!showName) {
		return [ false, '您还为填写昵称!' ];
	} else if (showName.length > 21 || showName.length <4) {
		return [ false, '昵称最少4位,最多20位!' ];
	} else {
		return [ true, '昵称检查通过' ];
	}
}

/**
 * 校验手机号
 * @param obj
 * @returns {*[]}
 */
function checkTel(obj) {
	var phone = $("#" + obj).val().replace(/ /g, '');
	if (!phone) {
		return [ false, '手机号还未填写!' ];
	} else if (phone.length != 11) {
		return [ false, '请正确输入11位手机号!' ];
	} else if (!/^[1][3,4,5,7,8][0-9]{9}$/.test(phone)) {
		return [ false, '手机号码不合法' ];
	} else {
		return [ true, '手机检查通过' ];
	}
}

/**
 * 邮箱校验
 * @param obj
 * @returns {*[]}
 */
function checkEmail(obj) {
	var email = $("#" + obj).val().replace(/ /g, '');
	if (!email) {
		return [ false, '邮箱还未填写!' ];
	} else if (!/^[A-Za-z\d]+([-_.][A-Za-z\d]+)*@([A-Za-z\d]+[-.])+[A-Za-z\d]{2,4}$/.test(email)) {
		return [ false, '邮箱不合法' ];
	} else {
		return [ true, '邮箱检查通过' ];
	}
}

/**
 * 校验日期
 * @param obj
 * @returns {*[]}
 */
function checkBirthday(obj) {
	var birthday = $("#" + obj).val().replace(/ /g, '');
	if (!birthday) {
		return [ false, '生日还未填写!' ];
	} else {
		return [ true, '完美,正确' ];
	}
}

/**
 * 校验输入密码
 */
function checkPwd(password) {
	var pwd = $('#' + password).val().replace(/ /g, '');
	var reg=/^(?![0-9]+$)(?![a-zA-Z]+$)[A-Za-z_][A-Za-z_0-9]{0,}$/;
	if (!pwd || pwd.length == 0) {
		return [ false, '您还没有输入密码' ];
	} else if (pwd.length < 6 || pwd.length > 17) {
		return [ false, '密码长度不正确,请检查' ];
	} else if (!reg.test(pwd)) { //密码必须符合由数字,大写字母,小写字母,至少其中两种组成，且长度不小于6，同时第一位不能为数字。
		return [ false, '密码由数字，字母和下划线（至少包含其中两种，数字不能开头）' ];
	} else {
		return [ true, "通过" ];
	}
}

/**
 * 再次校验密码
 */
function checkPwdOk(obj) {
	//得到第一次输入的密码和再次输入的密码值
	var pwd = $('#loginPassText').val();
	var pwdOk = $('#' + obj).val();
	if (pwd != pwdOk) {
		return [ false, '密码输入不一致,请核对' ];
	} else {
		return [ true, '通过' ];
	}
}

function checkVcode(vcodeid) {
	//得到输入的验证码
	var txtCode = $('#' + vcodeid).val().replace(/ /g, "");

	//校验位数
	if (!txtCode) {
		return [ false, '您还未输入验证码' ];
	} else if (txtCode.length != 6) {
		return [ false, '验证码不是6位' ];
	} else {
		//校验是否和后台一致
		var res;
		$.ajax({
			url : '../ajaxValidateVcode.sp', // 请求地址, 就是你的控制器, 如
			async : false, //这里设置的作用是为了把回调函数的值引用给调用者的变量
			data : {
				'vCode' : txtCode
			}, // 需要传送的参数
			type : 'POST', // 请求方式
			dataType : 'json', // 返回数据的格式, 通常为JSON
			success : function(respRes) {
				res = respRes;
			}
		});
		//如果验证码错误,从新加载验证码
		if (!res.flag) {
			reloadCode();
		}
		return [ res.flag, res.msg ];
	}
}

/**
 * 重新加载验证码
 */
function reloadCode() {
	$("#imgCode").attr('src', "../getVerifyCode.sp?time=" + new Date().getTime());
}