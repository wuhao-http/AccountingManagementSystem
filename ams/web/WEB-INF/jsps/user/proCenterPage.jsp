<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%
	String path = request.getContextPath();
	String basePath = request.getScheme() + "://"
			+ request.getServerName() + ":" + request.getServerPort()
			+ path + "/";
%>
<%@taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html lang="zh-CN">

<head>
<meta charset="utf-8">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<meta name="viewport" content="width=device-width, initial-scale=1">
<!-- 上述3个meta标签*必须*放在最前面，任何其他内容都*必须*跟随其后！ -->
<title>个人中心</title>

<!-- Bootstrap -->
<link href="<%=path %>/css/bootstrap.css" rel="stylesheet">
<!-- jQuery (Bootstrap 的所有 JavaScript 插件都依赖 jQuery，所以必须放在前边) -->
<script src="<%=path %>/js/jquery-1.11.0.js"></script>
<!-- 加载 Bootstrap 的所有 JavaScript 插件。你也可以根据需要只加载单个插件。 -->
<script src="<%=path %>/js/bootstrap.js"></script>
<!--日历插件-->
<script src="<%=path %>/laydate/laydate.js"></script>
<!-- 加载个人中心css -->
<link href="<%=path %>/css/user/proCenter.css" rel="stylesheet">
<!-- 加载个人中心js -->
<script src="<%=path %>/js/user/proCenter.js"></script>
<!-- 加载公共js -->
<script src="<%=path %>/js/commonjs.js"></script>
<script src="<%=path %>/js/mainPage.js"></script>
<!-- 加载表单js -->
<script src="<%=path %>/js/jquery-form.js"></script>


<!-- HTML5 shim 和 Respond.js 是为了让 IE8 支持 HTML5 元素和媒体查询（media queries）功能 -->
<!-- 警告：通过 file:// 协议（就是直接将 html 页面拖拽到浏览器中）访问页面时 Respond.js 不起作用 -->
<!--[if lt IE 9]>
      <script src="https://cdn.bootcss.com/html5shiv/3.7.3/html5shiv.min.js"></script>
      <script src="https://cdn.bootcss.com/respond.js/1.4.2/respond.min.js"></script>
    <![endif]-->

</head>

<body>
	<label id="uid" class="hidden">${sessionScope.user.id }</label>
	<div class="container tab-content">
		<div id="head" class="row">
			<div class="col-md-6 col-md-offset-1">
				<div>
					  欢迎您　
					  <img src="<%=path %>/images/${sessionScope.user.imgname}" class="img-circle" width="40px" height="40px" style="margin:8px 0 8px 0">
					  <b style="color: darkorange;">　${sessionScope.user.name}</b>　
					  <label class="btn btn-link" style="color: blue" disabled="disabled"><b>个人中心</b></label>
					  <label class="btn btn-link" onclick="loginOut()"><b>注销登录</b></label>
					</div>
			</div>
			<div class="col-md-4 " style="line-height: 40px;">
				<div class="col-md-4 col-md-offset-4">
					<label class="btn  btn-link" onclick="toMainPage()"> <b>回到主页</b> </label>
				</div>
				<div class="col-md-4">
					<label class="btn  btn-link"> <b></b> </label>
				</div>
			</div>
		</div>
		<div id="content" class="row " style="margin-top: 50px;height: 100%">
			<div class="col-md-6 col-md-offset-3 ">
				<ul id="proTable" class="nav nav-tabs"
					style="border-bottom:2px solid slateblue;">
					<li id="proMsg"><a href="#proMain" data-toggle="tab">个人信息</a></li>
					<li id="proBase"><a href="#editName" data-toggle="tab">修改昵称</a></li>
					<li id="proTel"><a href="#editTel" data-toggle="tab">修改手机</a></li>
					<li id="proEmail"><a href="#editEmail" data-toggle="tab">修改邮箱</a></li>
					<li id="proBirth"><a href="#editBirthday" data-toggle="tab">修改生日</a></li>
					<li  id="proPass"><a href="#editPass" data-toggle="tab">修改密码</a></li>
				</ul>
				<div id="proContent" class="tab-content">
					<div class="tab-pane fade in active" id="proMain">
						<form class="form-horizontal" style="padding-top: 30px;">
							<div class="form-group underLine">
								<label class="col-md-4 control-label" >账 号:</label>
								<div class="col-md-4">
									<label class="showStyle">${sessionScope.user.account }</label>
								</div>
							</div>
							<div class="form-group underLine">
								<label class="col-md-4 control-label" style="line-height: 60px">昵
									称:</label>
								<div class="col-md-6">
									<div class="col-md-4">
										<img src="<%=path %>/images/${sessionScope.user.imgname }" class="img-circle"
											width="60px" height="60px" />
									</div>
									<div class="col-md-6">
										<span class="showStyle" style="line-height: 70px;">${sessionScope.user.name}</span>
									</div>
								</div>
							</div>
							<div class="form-group underLine">
								<label class="col-md-4 control-label">手 机:</label>
								<div class="col-md-4">
									<label class="showStyle">${sessionScope.user.phone}</label>
								</div>
							</div>
							<div class="form-group underLine">
								<label class="col-md-4 control-label" >邮 箱:</label>
								<div class="col-md-4">
									<label class="showStyle">${sessionScope.user.email}</label>
								</div>
							</div>
							<div class="form-group underLine">
								<label class="col-md-4 control-label">生 日:</label>
								<div class="col-md-4">
									<label class="showStyle">${sessionScope.user.birthday} (
									<b>${sessionScope.user.gender } 
									${sessionScope.user.age}岁
									</b>)</label>
								</div>
							</div>
							<div class="form-group underLine">
								<label class="col-md-4 control-label">个人说明:</label>
								<div class="col-md-4">
									<textarea rows="3" id="descArea" cols="40" 
										onblur="updateDesc()" ondblclick="editDesc()"
									class="form-tontrol" readonly="true" placeholder="您还未定义个人说明,双击进行新增">${sessionScope.user.desc}</textarea>
								</div>
							</div>
						</form>
					</div>
					
					<!-- 编辑名称和头像 -->
					<div class="tab-pane fade" id="editName">
						<form id="baseInfoForm" 
							action="updateBaseInfo.sp"
							class="form-horizontal" 
							style="padding-top: 15px;" 
							enctype="multipart/form-data">
							<div class="form-group">
								<label class="control-label col-md-2" style="line-height: 50px;">
									头 像 </label>
								<div class="col-md-2">
									<img name="showImg" src="<%=path %>/images/${sessionScope.user.imgname}" width="60px" height="60px"
									<%-- <img id="showImg" name="showImg" src="<%=path %>/images/2016062318473448623.gif" width="60px" height="60px" --%>
										class="" />
								</div>
								<div class="col-md-6" style="padding-top: 32px;">
									<!-- onchange=viewImg(showImg,this.form.imgname)用于回显图片到头像框 -->
									<!-- <input type="file" id="imgname" name="imgname" onchange="viewImg(showImg,this)"/> -->
									<input type="file" id="imgName" name="imgName" onchange="viewImg(showImg,this)"/>
								</div>
							</div>
							<div class="form-group">
								<label class="control-label col-md-2" style="line-height: 50px;">
									昵 称 </label>
								<div class="col-md-6" style="padding-top: 15px;">
									<input type="text" id="name" name="name" class="form-control"
										placeholder="${sessionScope.user.name }"
										disabled="disabled" />
								</div>
								<div class="col-md-2" style="padding-top: 15px;">
									<button type="button" id="editNameBtn"
										class="btn btn-block btn-warning editNameBtn">修改</button>
								</div>
							</div>
							<div class="row">
								<div class="col-md-4 col-md-offset-3">
									<button type="button" id="summitBaseInfo" class="btn btn-info btn-block" 
									onclick="updateBaseInfo()">提交修改</button>
								</div>
							</div>
						</form>
					</div>
					
					<!-- 修改手机 -->
					<div class="tab-pane fade" id="editTel" style="padding-top: 5%;">
						<form class="form-horizontal">
							<div class="form-group">
								<label class="control-label col-md-2" style="line-height: 50px;">
									手 机 </label>
								<div class="col-md-6" style="padding-top: 15px;">
									<input type="text" id="telText" name="phone" class="form-control"
										placeholder="${sessionScope.user.phone }" disabled="disabled" />
								</div>
								<div class="col-md-2" style="padding-top: 15px;">
									<button type="button" id="editTelBtn"
										class="btn btn-block btn-warning " >修改</button>
								</div>
							</div>
							<div class="row">
								<div class="col-md-4 col-md-offset-3">
									<button type="button" class="btn btn-info btn-block" onclick="editTel('#telText')">提交修改</button>
								</div>
							</div>
						</form>
					</div>

					<!-- 修改邮箱 -->
					<div class="tab-pane fade" id="editEmail" style="padding-top: 5%;">
						<form class="form-horizontal ">
							<div class="form-group">
								<label class="control-label col-md-2" style="line-height: 50px;">
									邮 箱 </label>
								<div class="col-md-6"  style="padding-top: 15px;">
									<input type="text" id="emailText" name="email" class="form-control"
										placeholder="${sessionScope.user.email}" disabled="disabled" style="font-weight: bolder;"/>
								</div>
								<div class="col-md-2"   style="padding-top: 15px;">
									<button type="button" id="editEmailBtn" class="btn btn-block btn-warning">修改</button>
								</div>
							</div>
							<div class="row">
								<div class="col-md-4 col-md-offset-3">
									<button type="button" class="btn btn-info btn-block" onclick="updateEmail('#emailText')">提交修改</button>
								</div>
							</div>
						</form>
					</div>

					<!-- 修改生日 -->
					<div class="tab-pane fade" id="editBirthday"
						style="padding-top: 5%;">
						<form class="form-horizontal">
							<div class="form-group">
								<label class="control-label col-md-2" style="line-height: 50px;">
									生 日 </label>
								<div class="col-md-6" style="padding-top: 15px;">
									<input type="text" id="birthday" name="birthday"
										class="form-control" value="${sessionScope.user.birthday }" disabled="disabled" />
								</div>
								<div class="col-md-2" style="padding-top: 15px;">
									<button type="button" id="editBirthBtn"
										class="btn btn-block btn-warning ">修改</button>
								</div>
							</div>
							<div class="row">
								<div class="col-md-4 col-md-offset-3">
									<button type="button" class="btn btn-info btn-block" onclick="updateBirthday()">提交修改</button>
								</div>
							</div>
						</form>
					</div>

					<!-- 修改密码 -->
					<div class="tab-pane fade" id="editPass" style="padding-top: 5%;">
						<form class="form-horizontal">
							<div class="form-group">
								<label class="control-label col-md-3" style="line-height: 45px;">
									原密码 </label>
								<div class="col-md-5" style="padding-top: 15px;">
									<input type="password" id="oldPwd" name="pass" class="form-control"
										placeholder="请输入原密码" 
										onblur = "checkOrgPass(this)"/>
								</div>
								<label class="hidden col-md-4" id="oldPwdMsgBox" style="padding-top: 22px"></label>
							</div>
							<div class="form-group">
								<label class="control-label col-md-3" style="line-height: 45px;">
									新密码 </label>
								<div class="col-md-5" style="padding-top: 15px;">
									<input type="password" id="newPwdA" name="tel"
										class="form-control" placeholder="原密码正确后,才能够无输入新密码" 
										onblur=""
										readonly="true"/>
								</div>
								<div class="col-md-4" style="line-height: 63px;">
									<label class="hidden"></label>
								</div>
							</div>
							<div class="form-group">
								<label class="control-label col-md-3" style="line-height: 45px;">
									再次确认 </label>
								<div class="col-md-5" style="padding-top: 15px;">
									<input type="password" id="newPwdB" name="tel"
										class="form-control" placeholder="原密码正确后,才能够无输入新密码" readonly="true"/>
								</div>
								<div class="col-md-4" style="line-height: 63px;">
									<label class="hidden">新密码不一致</label>
								</div>
							</div>
							<div class="row">
								<div class="col-md-4 col-md-offset-3">
									<button type="button" class="btn btn-info btn-block" onclick="javascript:updatePassword()">提交修改</button>
								</div>
							</div>
						</form>
					</div>
				</div>
			</div>
		</div>
	</div>
	<!--[if IE]>
		修改按钮功能
		点击修改,input框可以修改
		<![endif]-->
	<script>
		$('#editNameBtn').click(function() {
			$('#name').removeAttr('disabled');
			$('#name').attr('readonly',false);
			
		});

		$('#editTelBtn').click(function() {
			$('#telText').removeAttr('disabled');
		});

		$('#editEmailBtn').click(function() {
			$('#emailText').removeAttr('disabled');
		});

		$('#editBirthBtn').click(function() {
			$('#birthday').removeAttr('disabled');
		});

	</script>
</body>
</html>
