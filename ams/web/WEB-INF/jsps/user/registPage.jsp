<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%
	String path = request.getContextPath();
	String basePath = request.getScheme() + "://" + request.getServerName() + ":" + request.getServerPort()
			+ path + "/";
%>
<!DOCTYPE html>
<html lang="zh-CN">
  <head>
    <meta chars
et="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <!-- 上述3个meta标签*必须*放在最前面，任何其他内容都*必须*跟随其后！ -->
    <title>用户注册</title>

    <!-- Bootstrap -->
    <link href="<%=path %>/css/bootstrap.css" rel="stylesheet">
	<!-- jQuery (Bootstrap 的所有 JavaScript 插件都依赖 jQuery，所以必须放在前边) -->
	<script src="<%=path %>/js/jquery-1.11.0.js"></script>
	<!-- 加载 Bootstrap 的所有 JavaScript 插件。你也可以根据需要只加载单个插件。 -->
	<script src="<%=path %>/js/bootstrap.js"></script>
	
	 <!--加载日期插件 -->
	 <script src="<%=path %>/laydate/laydate.js"></script>
	 <!-- 加载注册页面局部css -->
	 <link href="<%=path %>/css/user/registPage.css" rel="stylesheet">
	  <%--加载注册页面js--%>
	  <script src="<c:url value="/js/user/registPage.js"/>"></script>
	  <%--加载通用js--%>
	  <script src="<c:url value="/js/commonjs.js"/>"></script>

    <!-- HTML5 shim 和 Respond.js 是为了让 IE8 支持 HTML5 元素和媒体查询（media queries）功能 -->
    <!-- 警告：通过 file:// 协议（就是直接将 html 页面拖拽到浏览器中）访问页面时 Respond.js 不起作用 -->
    <!--[if lt IE 9]>
      <script src="https://cdn.bootcss.com/html5shiv/3.7.3/html5shiv.min.js"></script>
      <script src="https://cdn.bootcss.com/respond.js/1.4.2/respond.min.js"></script>
    <![endif]-->
	<script>
		// 回到主页
		function toLogin() {
			window.location.href ='toLoginPage.sp';
		}
	</script>
  </head>
  <body>
		
		<div class="container">
			<br/>
			<div class="row">
				<span class="col-md-8 col-md-offset-2">
					<label id="mes" class="col-md-4  col-md-offset-1"> 用 户 注 册</label>
					<button class="btn btn-link col-md-2 col-md-offset-4 " id="" onclick="toLogin()">返回登陆</button>
				</span>
			</div>
			<br/>
			<div class="row">
				<div class="col-md-6 col-md-offset-3 ">
					<form class="form-horizontal" id="registForm">

						<div class="form-group">
							<label for="loginNameText" class="col-md-2 control-label">用 户 名</label>
							<div class="col-md-6">
								<input type="text" id="loginNameText" name="account" maxlength="16" class="form-control" placeholder="用户名由可以使用6-16个字母,数字,和下划线和减号,必须以字母开头(字母不区分大小写);" />
							</div>
							<label id="loginNameMsgBox"  class="tips col-md-4 hidden"></label>
						</div>
						
						<div class="form-group">
							<label for="showNameText" class="col-md-2 control-label">昵 称</label>
							<div class="col-md-6">
								<input type="text" id="showNameText" name="name" maxlength="12" class="form-control" placeholder="昵称最多12个字符" />
							</div>
							<label id="showNameMsgBox"  class="tips col-md-4 hidden"></label>
						</div>
						
						<div class="form-group">
							<label for="phoneText" class="col-md-2 control-label">手 机 号</label>
							<div class="col-md-6">
								<input type="tel" id="phoneText" name="phone" maxlength="11" class="form-control" placeholder="请输入11位手机号码" />
							</div>
							<label id="phoneMsgBox"  class="tips col-md-4 hidden"></label>
						</div>
						
						<div class="form-group">
							<label for="emailText" class="col-md-2 control-label">邮 箱</label>
							<div class="col-md-6">
								<input type="email" id="emailText" name="email" class="form-control" placeholder="请输入邮箱" />
							</div>
							<label id="emailMsgBox"  class="tips col-md-4 hidden"></label>
						</div>
						
						<div class="form-group">
							<label class="col-md-2 control-label">生 日</label>
							<div class="col-md-6">
								<input type="text" id="birthdayText" name="birthday" readonly="readonly" class="form-control"  placeholder="请选择生日"/>
							</div>
							<label id="birthdayMsgBox"  class="tips col-md-4 hidden"></label>
						</div>
						<div id="sexRadio" class="form-group">
							<label class="col-md-2 control-label">性 别</label>
							<span class="col-md-1">
								<div class="radio">
									<label>
										<input type="radio" id="boy" name="gender" checked="checked" value="男"/> 男
									</label>
								</div>
							</span>
							<span class="col-md-1">
								<div class="radio">
									<label>
										<input type="radio" id="girl"  name="gender" value="女"/> 女
									</label>
								</div>
							</span>
						</div>
						
						<div class="form-group">
							<label for="loginPassText" class="col-md-2 control-label">密 码 </label>
							<span class="col-md-6">
								<input type="password" id="loginPassText" name="password" class="form-control"  placeholder="请输入密码" />
							</span>
							<label id="loginPassMsgBox"  class="tips col-md-4 hidden"></label>
						</div>
						
						<div class="form-group">
							<label for="loginPassOkText" class="col-md-2 control-label">确认密码 </label>
							<span class="col-md-6">
								<input type="password" id="loginPassOkText" name="passwordOK" class="form-control"  placeholder="请再次输入密码" />
							</span>
							<label id="loginPassOkMsgBox"  class="tips col-md-4 hidden"></label>
						</div>
						
						<div class="form-group">
							<label class="col-md-2 control-label">验 证 码</label>
							<span class="col-md-4" style="padding-right: 3px">
								<input type="text" id="verifyCodeText" name="verifyCode" class="form-control"  placeholder="请输入验证码" />
							</span>
							<span class="col-md-3" style="padding: 0px">
								<img src="<%=request.getContextPath()%>/getVerifyCode.sp" id="imgCode" 
									alt="看不清楚？请点击刷新验证码" onclick="reloadCode();"class="img-rounded" 
									style="height: 33px;width: 120px ;"/>
							</span>
							<label id="verifyCodeMsgBox"  class="tips col-md-3 hidden" ></label>
						</div>
						<span class="row">
							<button type="button" class="btn btn-info col-md-4 col-md-offset-3" style="width: 200px;" id="submitBtn"
								onclick="submitRegistInfo()">提   交</button>
						</span>
					</form>
				</div>
			</div>
		</div>
  </body>
</html>