<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%@ page contentType="text/html;charset=UTF-8" language="java"%>
<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="utf-8">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<meta name="viewport" content="width=device-width, initial-scale=1">
<!-- 上述3个meta标签*必须*放在最前面，任何其他内容都*必须*跟随其后！ -->
<title>欢迎登陆家庭管家记账系统</title>

<!-- Bootstrap -->
<link href="<c:url value='/css/bootstrap.css'/>" rel="stylesheet">
<script src="<c:url value='/js/jquery-1.11.0.js'/>"></script>
<script src="<c:url value='/js/bootstrap.js'/>"></script>

<%--加载登陆页面css--%>
<link href="<c:url value='/css/user/login.css'/>" rel="stylesheet">
<script src="<c:url value='/js/user/login.js'/>"></script>
<script src="<c:url value='/js/commonjs.js'/>"></script>

<!-- HTML5 shim 和 Respond.js 是为了让 IE8 支持 HTML5 元素和媒体查询（media queries）功能 -->
<!-- 警告：通过 file:// 协议（就是直接将 html 页面拖拽到浏览器中）访问页面时 Respond.js 不起作用 -->
<!--[if lt IE 9]>
    <script src="https://cdn.bootcss.com/html5shiv/3.7.3/html5shiv.min.js"></script>
    <script src="https://cdn.bootcss.com/respond.js/1.4.2/respond.min.js"></script>
    <![endif]-->
</head>
<body>
<!-- 模态窗口 -->
<div id="tipsModal" class="my-modal">
	<div class="my-modal-head color-orange">
		系统提示(<span style="color: orange;">05</span>秒后自动关闭)
	</div>
	<div class="my-modal-body">
		<p>
			系统检测都当前浏览器为IE浏览器,部分功能可能无法使用,推荐使用Chrome浏览器获取更好使用体验,如需下载,请访问:
			<a href="https://www.google.cn/chrome/">https://www.google.cn/chrome/</a>
		</p>
	</div>
	<div class="my-modal-foot">
		<button class="btn btn-block btn-warning" onclick="{
			$('#tipsModal').fadeOut('slow');
		}">确定</button>
	</div>
</div>
	<div class="container">
		<div id="head" class="row">
			<div id="title" class="col-md-6 col-md-offset-3 ">
				<h2>欢迎使电子账簿管理系统</h2>
				<p>--版本:v2.1--</p>
			</div>
		</div>
		<div class="row ">
			<span id="loginForn" class="col-md-6 col-md-offset-3">
				<div class="row ">
					<div class="col-md-9 col-md-offset-1">
						<h3> 账号登录<small>----登陆后轻松管理您的账目信息</small></h3>
						<hr>
					</div>
				</div>

				<div class="row">
					<div class="col-md-12">
						<div class="form-horizontal " style="width: 580px">
							<form>
								<div class="form-group">
									<label for="loginName"
										class=" col-md-2 col-md-offset-2 control-label">用户名</label>
									<div class=" col-md-4">
										<input type="text" class="form-control" id="loginName"
											onblur="checkLoginName()" placeholder="请输入登陆账号">
									</div>
									<label id="loginNameMesgBox" class=" col-md-4 tips"></label>
								</div>
								<div class="form-group">
									<label for="loginPass"
										class=" col-md-2 col-md-offset-2 control-label">密 码</label>
									<div class=" col-md-4">
										<input type="password" class="form-control" id="loginPass"
											onblur="checkLoginPass()" placeholder="请输入密码">
									</div>
									<label id="loginPassMesgBox" class=" col-md-4 tips"></label>
								</div>
								<div class="form-group">
									<div class="col-md-2 col-md-offset-4">
										<div class="checkbox">
											<input type="checkbox" id="ck_rmbUser" onchange="isSaveCookie()"/> 7天免登录
										</div>
									</div>
									<div class="col-md-4">
										<div class="checkbox">
											<!--淘宝推荐方法 -->
											<a href="javascript:void(0);" onclick="toRegist()">还没账号?点击这里注册</a>
										</div>
									</div>
								</div>
								<div class="form-group">
									<div class=" col-md-6 col-md-offset-3 ">
										<span class="col-md-5">
											<button type="reset" class="btn btn-default btn-block">重 填</button> </span> <span
											class="col-md-5 col-md-offset-1">
											<button type="button" class="btn btn-info btn-block"
												id="loginAccSys" onclick="login()">登 录</button> </span>
									</div>
								</div>
							</form>
						</div>
					</div>
				</div> </span>
		</div>
	</div>

	<!-- 找回密码模态窗口 -->
	<div class="modal fade" id="findLoginPwd" tabindex="-1" role="dialog" aria-labelledby="findLoginPwdLabel">
		<div class="modal-dialog" role="document">
			<div class="modal-content">
				<div class="modal-header">
					<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
					<h4 class="modal-title" id="myModalLabel">请选择密码找回方式</h4>
				</div>
				<div class="modal-body">
					<div>
						<div class="row">
							<div class="col-sm-10 col-sm-offset-1">
								<ul  class="nav nav-tabs">
									<li class="active">
										<a href="#telFind" data-toggle="tab">手机方式找回</a>
									</li>
									<li><a href="#emailFind" data-toggle="tab">邮箱方式找回</a></li>
								</ul>
							</div>
						</div>
						<div  class="tab-content">
							<div class="tab-pane fade in active" id="telFind">
								<div class="row" style="padding-top: 15px">
									<div class="col-sm-8 col-sm-offset-2">
										<table>
											<tr>
												<td align="right">
													<label for="tel" class="control-label find-name"> 密保手机 : </label>
												</td>
												<td style="padding-left:3%;">
													<input class="form-control find-value" id="tel" name="tel" maxlength="11" type="tel" placeholder="输入注册手机号码" />
												</td>
												<td>
													<button id="telBtn" class="btn btn-success find-btn" onclick="getCode('#tel')"> 获取验证码 </button>
												</td>
											</tr>
											<tr>
												<td align="right" >
													<label for="telCode" class="control-label"> 验证码 : </label>
												</td>
												<td style="padding-left:3%">
													<input class="form-control" id="telCode" name="telCode" type="tel" maxlength="6"
                                                           onpropertychange="checkCode('#telCode')" oninput="checkCode('#telCode')"
                                                           readonly="readonly"
                                                           placeholder="输入6位验证码" />
												</td>
												<td style="padding: 5%;">
													<button class="btn btn-success" id="telCodeBtn"
															onclick="getLoginPwd('#tel')"
															disabled="disabled"> 下一步 </button>
												</td>
											</tr>
										</table>
										<small id="telMsg">　<%--验证码已发送给<span class="tel-msg-span">18085360162</span>,请打开手机查看--%></small>
									</div>
								</div>
							</div>
							<div class="tab-pane fade" id="emailFind">
								<div class="row" style="padding-top: 15px">
									<div class="col-sm-8 col-sm-offset-2">
										<table>
											<tr>
												<td align="right" >
													<label for="email" class="control-label find-name"> 密保邮箱 : </label>
												</td>
												<td style="padding-left:3%;">
													<input class="form-control find-value" id="email" name="email" maxlength="50" type="email"placeholder="输入注册邮箱" />
												</td>
												<td>
													<button class="btn btn-success find-btn" id="emailBtn" onclick="getCode('#email')"> 获取验证码 </button>
												</td>
											</tr>
											<tr>
												<td align="right" >
													<label for="emailCode" class="control-label"> 验证码 : </label>
												</td>
												<td style="padding-left:3%">
													<input class="form-control" id="emailCode" name="emailCode" type="text" maxlength="6"
														onpropertychange="checkCode('#emailCode')" oninput="checkCode('#emailCode')"
                                                        readonly="readonly"placeholder="输入6位验证码" />
												</td>
												<td style="padding: 5%;">
													<button class="btn btn-success" id="emailCodeBtn" onclick="getLoginPwd('#email')"
															disabled="disabled"> 下一步 </button>
												</td>
											</tr>
										</table>
										<small style="padding-top: 1%;" id="emailMsg">　</small>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div class="modal-footer">
					<button type="button" class="btn btn-default"  onclick="closeView()">回到登陆</button>
				</div>
			</div>
		</div>
	</div>

	<div class="modal fade" id="pwdView" tabindex="-1" role="dialog" aria-labelledby="pwdViewLabel">
		<div class="modal-dialog" role="document">
			<div class="modal-content">
				<div class="modal-header">
					<h4>密码找回结果</h4>
				</div>
				<div class="modal-body">
					<label></label>
				</div>
				<div class="modal-footer">
					<button type="button" class="btn btn-default" data-dismiss="modal">返 回</button>
					<button type="button" class="btn btn-default" onclick="closeView()">回到登陆</button>
				</div>
			</div>
		</div>
	</div>
</body>
</html>
