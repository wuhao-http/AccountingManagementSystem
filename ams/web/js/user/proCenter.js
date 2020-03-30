/**
 * 个人中心js
 */
$(function() {
	// 初始化日历
	laydate.render({
		elem : '#birthday', //绑定元素id
		theme : 'grid', //设置主题
		calendar:'true', // 设置公历日历
	    btns:['now', 'confirm'],  //设置按钮 右下角显示的按钮，会按照数组顺序排列，内置可识别的值有：clear、now、confirm
	    showBottom:false //隐藏按钮
	});

	// 如果会话过期,提示从新登陆
	var id = $("#uid").html();
	if (!id) {
		alert('用户身份信息已过期,请从新登陆');
		location.href = "toLoginPage.sp";
	}
	
	//刷新页面后记住当前标签页
	$(document).ready(function() {
	    if(location.hash) {
	        $('a[href=' + location.hash + ']').tab('show');
	    }
	    $(document.body).on("click", "a[data-toggle]", function(event) {
	        location.hash = this.getAttribute("href");
	    });
	});
	$(window).on('popstate', function() {
	    var anchor = location.hash || $("a[data-toggle=tab]").first().attr("href");
	    $('a[href=' + anchor + ']').tab('show');
	});
});

/**
 * 回到主页
 */
function toMainPage() {
	location.href = "toMainPage.sp";
}

/**
 * 修改个人说明
 */
function editDesc() {
	// 移除不可编辑属性
	$("#descArea").attr({
		'readonly' : false
	});
	$("#descArea").css('background', 'white');
}

// 失去焦点的时后
function updateDesc() {
	// 获取个人说明
	var desc = $.trim($("#descArea").val());
	// 设置个人说明框只读
	$("#descArea").attr('readonly', true).css('background', 'none');
	console.log("当前个人说明字数:"+desc.length);
	if (desc.length >= 0 && desc.length <=200) {
		if (desc.length > 0) {
			// 进行ajax更新
			$.ajax({
				type : 'post',
				url : 'updateDesc.sp',
				data : {desc : desc},
				success : function(respRes) {
					if (!respRes.flag) {// 如果更新失败,回显session中的描述值
						if (desc == respRes.msg) {
							$("#descArea").val(respRes.msg);
						}else{
							alert(respRes.msg);
						}
					} else {
						location.reload();
					}
				}
			});
		}
	}else{
		alert("个人说明不能超过200字,请检查");
	}
}

/**
 * 回显图片
 * showPositon 回显标签name
 * upFile input 文件标签
 */
function viewImg(showPositon,upFile){
	//获取当前图片文件名
	var fileName = upFile.files[0].name;
	//得到文件名后缀
	var fileSuf = fileName.substring(fileName.lastIndexOf(".")+1).toLowerCase();
	var sufs = ['ico','jpg','jepg','bmp','png','gif'];
	/*测试for循环,i是自增量,sufs是循环对象*/
	//判断当前选中的是不是图片
	var flag = false;
	for(i in sufs){
		if(sufs[i] == fileSuf){
			flag = true;
			break;
		}
	}
	if(!flag){
		alert("所选文件不是图片或不满足以下图片后缀:\n\t'ico','jpg','jepg','bmp','png','gif'");
		$('#showImg').attr('src','../images/default.png');
		return;
	}
	if(upFile.files && fileName){
		//火狐下，直接设img属性
		//mypic.src = upfile.files[0].getAsDataURL();
		 
		 //火狐7以上版本不能用上面的getAsDataURL()方式获取，需要一下方式  
		showPositon.src = window.URL.createObjectURL(upFile.files[0]);
	}
	else{
		//IE下
		if (upFile.files[0]){
			showPositon.src=upFile.files[0];
			showPositon.style.display="";
			showPositon.border=1;
		}
	}
}

/**
 * 更新昵称和头像
 */
function updateBaseInfo(){
	if($('#imgName').val() || $('#name').val()){
		var form = new FormData(document.getElementById("baseInfoForm"));
		$.ajax({
			type : 'post',
			url : 'updateBaseInfo.sp',
			data :form,
			contentType : false,    //不设置Content-Type请求头
			processData : false,    // 不处理发送的数据
			success : function(respRes) {
				if(respRes.flag){
					//选中当前标签页
					location.reload();
				}else{
					alert(respRes.msg);
				}
			}
		});
	}else{
		alert("不需要更新")
	}
}

/**
 * 修改电话
 * @param strid
 */
function editTel(strid){
	//获取placeholder属性值
	var telLabel = $(strid).attr('placeholder');
	//获取电话标签框input框的值
	var phone = trim($(strid).val());
	console.log(phone);
	if (!phone) {
		alert('还未输入手机号!');
		return;
	}else if(phone == telLabel){
		alert('当前手机号和原手机号一致,无需修改!');
		return;
	} else if (phone.length != 11) {
		alert('请正确输入11位手机号!');
	} else if (!/^[1][3,4,5,7,8][0-9]{9}$/.test(phone)) {
		alert('手机号码不合法!');
		return;
	} else {
		$.ajax({
			type:"post",
			url:'updateTel.sp',
			data:{'phone':phone},
			success:function(resp){
				if (resp.flag) {
					alert("修改成功");
					location.reload();
				}else{
					alert(resp.msg);
				}
			}
		});
	}
}

/**
 * 修改邮箱
 * @param emailId
 */
function updateEmail(emailId){
	var email = $(emailId).val().trim();
	if (!email) {
		alert("邮箱还未填写!");
		return;
	} else if (!/^[A-Za-z\d]+([-_.][A-Za-z\d]+)*@([A-Za-z\d]+[-.])+[A-Za-z\d]{2,4}$/.test(email)) {
		alert("邮箱不合法!");
		return;
	}
	//进行异步更新
	$.post('updateEmail.sp',{email:email},function(resp){
		if (resp.flag) {
			alert("修改成功");
			location.reload();
		}else{
			alert(resp.msg);
		}
	});
}

/**
 * 更新生日
 * @param birthDayID
 */
function updateBirthday(birthDayID){
	var birthday = $("#birthday").val().trim();
	if (!birthday) {
		alert("生日还未填写!");
		return;
	} 
	if (!/^[1-2]{1}([0-9]{3})-([0-1]{1})([0-9]{1})-(([0-2]){1}([0-9]{1})|([3]{1}[0-1]{1}))$/.test(birthday)) {
		alert("生日不合法!");
		return;
	}
	//进行异步更新
	$.post('updateBirthday.sp',{birthday:birthday},function(resp){
		if (resp.flag) {
			alert("修改成功");
			location.reload();
		}else{
			alert(resp.msg);
		}
	});
}

//检查密码
function checkOrgPass(obj){
	/**
	 * 只有当原始密码输入正确后,新密码才能输入
	 */
	//得到当前输入的密码
	var pwd = $(obj).val().trim();
	console.log(pwd);
	var resArr =  checkPass(pwd)
	console.log(resArr);
	if (resArr[0]) { //校验通过
		//设置msg盒子字体为绿色,,清空原来内容,追加一个√图标
		$('#oldPwdMsgBox').css('color', 'green').html('');
		var tips = '<span class="glyphicon glyphicon-ok"></span>'+resArr[1];
		$('#oldPwdMsgBox').append(tips).removeClass("hidden");
		$('#newPwdA').attr({'readonly':false,'placeholder': '请输入新密码'});
		$('#newPwdB').attr({'readonly':false,'placeholder': '请确认新密码'});
	} else { //校验失败
		//设置msg盒子字体为红色,,清空原来内容,追加一个×图标
		$('#oldPwdMsgBox').css('color', 'red').html('');
		var tips = '<span class="glyphicon glyphicon-remove"></span>'+resArr[1];
		$('#oldPwdMsgBox').append(tips).removeClass("hidden");
		//设置新密码框不可可编辑
		$('#newPwdA').attr({'readonly':true,'placeholder': '请先输入原密码'});
		$('#newPwdB').attr({'readonly':true,'placeholder': '请先输入原密码'});
	}
}
/**
 * 校验输入密码
 */
function checkPass(pwd) {
	console.log("待校验密码:"+pwd);
	var reg=/^(?![0-9]+$)(?![a-zA-Z]+$)[A-Za-z_][A-Za-z_0-9]{0,}$/;
	if (!pwd || pwd.length == 0) {
		return [ false, '您还没有输入密码' ];
	} else if (pwd.length < 6 || pwd.length > 17) {
		return [ false, '密码长度不正确,请检查' ];
	} else if (!reg.test(pwd)) { //密码必须符合由数字,大写字母,小写字母,至少其中两种组成，且长度不小于6，同时第一位不能为数字。
		return [ false, '密码由数字，字母和下划线（至少包含其中两种，数字不能开头）' ];
	} else {
		var res;
		//后台校验
		$.ajax({
			url:'checkOrgPass.sp',
			async:false,
			data:{password:pwd},
			dataType: "json",
			type:"POST",
			success:function(resp){
				res = resp;
			}
		});
		return [res.flag,res.msg];
	}
}


//提交更新密码
function updatePassword(){
	//得到原始密码
	var orgPass = $("#oldPwd").val().trim();
	var newPass = $("#newPwdA").val().trim();
	var okPass = $("#newPwdB").val().trim();
	var res = checkPass(orgPass);
	
	if(!res[0]){
		alert(res[1]);
		return;
	}
	
	if(newPass != okPass){
		alert("新密码输入不一致!");
		return;
	}
	if(newPass == orgPass){
		alert("新密码和原密码重复!");
		return;
	}
	if(newPass.length < 6 || newPass.length >16){ 
		alert("新密码长度不在6 -- 16位之间!");
		return;
	}
	if(!/^(?![0-9]+$)(?![a-zA-Z]+$)[A-Za-z_][A-Za-z_0-9]{6,16}$/.test(newPass)){
		alert("新密码不是由数字，字母和下划线（至少包含其中两种，数字不能开头）组成!");
		return;
	}
	if(!confirm('!警告:\n密码更新成功后需要重新登录用户,是否继续')){
		return;
	}
	//前台校验通过,ajax到后台
	$.ajax({
		url:'updatePass.sp',
		async:false,
		data:{password:newPass,passwordOK:okPass,orgPass:orgPass},
		dataType:'json',
		type:'POST',
		success:function(resp){
			if(resp.flag){
				alert(resp.msg+'请使用新密码重新登录!!');
				location.href='toLoginPage.sp';
				
			}else{
				alert(resp.msg);
			}
		}
	});
}




