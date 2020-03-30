<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<!DOCTYPE html>
<html lang="zh-CN">
  <head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <!-- 上述3个meta标签*必须*放在最前面，任何其他内容都*必须*跟随其后！ -->
    <title>欢迎进入主页</title>

    <!-- Bootstrap -->
    <link href="<c:url value='/css/bootstrap.css'/>" rel="stylesheet">
    <!-- jQuery (Bootstrap 的所有 JavaScript 插件都依赖 jQuery，所以必须放在前边) -->
    <script src="<c:url value='/js/jquery-1.11.0.js'/>"></script>
    <!-- 加载 Bootstrap 的所有 JavaScript 插件。你也可以根据需要只加载单个插件。 -->
    <script src="<c:url value='/js/bootstrap.js'/>"></script>

	<%--加载主页面css--%>
	<link href="<c:url value='/css/mainPage.css'/>" rel="stylesheet">
	<%--加载主页面js--%>
	<script src="<c:url value='/js/mainPage.js'/>"></script>
	<script src="<c:url value='/js/commonjs.js'/>"></script>
	<!-- 加载生成表格插件 -->
	<script src="<c:url value='/js/echarts.min.js'/>"></script>
	<!--日历插件-->
	<script src="<c:url value='/laydate/laydate.js' />"></script>

    <!-- HTML5 shim 和 Respond.js 是为了让 IE8 支持 HTML5 元素和媒体查询（media queries）功能 -->
    <!-- 警告：通过 file:// 协议（就是直接将 html 页面拖拽到浏览器中）访问页面时 Respond.js 不起作用 -->
    <!--[if lt IE 9]>
      <script src="https://cdn.bootcss.com/html5shiv/3.7.3/html5shiv.min.js"></script>
      <script src="https://cdn.bootcss.com/respond.js/1.4.2/respond.min.js"></script>
    <![endif]-->
	</head>
  <body>
	  <div class="container">
		  <div id="head" class="row">
			  <span class="col-md-8">
				  <div>
					  欢迎您　
					  <img src="<c:url value='/images/${sessionScope.user.imgname}'/>" class="img-circle" width="40px" height="40px" style="margin:8px 0 8px 0">
					  <b style="color: darkorange;">　${sessionScope.user.name}</b>　
					  <label class="btn btn-link" onclick="toProCenterPage('${sessionScope.user.id}')"><b>个人中心</b></label>
					  <label class="btn btn-link" onclick="loginOut('${sessionScope.user.id}')"><b>注销登录</b></label>
					</div>
			  </span>
			  <span class="col-md-2 col-md-offset-2"><label class="btn btn-link" onclick="exitSystem()">退出系统(IE有效)</label></span>
		  </div>
		  <div id="fun" class="row" style="height: 100%;"> 
			 <span id="left" class="col-md-4 col-md-offset-1" style="height: 380px;">
			 	<div id="title" class="row" style="height: 80px;">
			 		<span class="col-md-12 ">
			 		<h4>欢迎使用</h4>
			 		<h2>账簿管理系统<small> v2.1</small></h2>
			 		</span>
			 	</div>
				<div class="row">
					<span class="col-md-8 ">
						<button class="btn btn-default btn-block areaSize" onclick="toLedgerPage()">账务管理</button>
					</span>
				</div>
				<div class="row">
					<span class="col-md-8 ">
						<button class="btn btn-default btn-block areaSize" onclick="toReportPage()">账簿报表</button>
					</span>
				</div>
				<div class="row">
					<span class="col-md-8 ">
						<button class="btn btn-default btn-block areaSize" onclick="toSortMngPage()">分类管理</button>
					</span>
				</div>
			 </span>
			 <span class="col-md-6 ">
				<div class="row" id="imdTitle">
					<!-- <label class="h4"><b>账目信息收支统计</b></label> -->
				</div>
				<div class="row " style="margin-top: 1%">
					<div class="col-md-12">
						<div id="ledgerCount"></div>
					</div>
				</div>
				<div class="row" style="margin-top: 2%">
					<div id="queLabel" class="col-sm-3" style="line-height: 33px;padding-right: 0px;text-align: right;">
						<label>按月统计: </label>
					</div>
					<div class="col-sm-9"style="padding-left: 0px">
						<form id="queForm" class="form-inline" style="padding-left: 2%; color: #2F4554	">
						  <!-- 默认查询 -->
						  <div class="form-group" >
						    <input type="text" class="form-control" id="year" readonly="readonly" style="width: 60px">
							<label for="year"><b> 年</b></label>						    
						  </div>
						  <div class="form-group">
						    <select class="form-control" id="month" style="width: 65px">
						    </select>
						    <label for="month"> <b> 月</b> </label>
						  </div>
						  
						  <!-- 高级多月统计 -->
				  		  <div class="form-group hide">
							<label for="dateS"><b>开始日期:</b></label>
						    	<input type="text" class="form-control" id="dateS" readonly="readonly" style="width:65px;padding: 0;font-size: 8px">
						  </div>
						  <div class="form-group hide">
							<label for="dateE"><b>结束日期:</b></label>
						   		<input type="text" class="form-control" id="dateE" readonly="readonly" style="width:65px;padding: 0;font-size: 8px">
						  </div>
						  <div class="form-group" style="float: right;">
						  	<button type="button" onclick="countSwitch()" class="btn btn-block"  title="点击切换统计方式">...</button>
						  </div>
						  <div class="form-group" style="float: right;padding-right: 1%">
						  	<button type="button" class="btn btn-block" onclick="countLegerInfo()" >
						  		<span class="glyphicon glyphicon-search"></span>&nbsp;查 询
						  	</button>
						  </div> 
						</form>
					</div>
				</div>
			 </span>
		  </div>
	  </div>
	  <canvas id="cav" style="position: center; left:0;top: 0;"></canvas>
	  <script type="text/javascript" >
	  	laydate.render({
		  elem: '#year'
		  ,type: 'year'
		  ,value: new Date().getFullYear()
		});
	  </script>
  </body>
</html>