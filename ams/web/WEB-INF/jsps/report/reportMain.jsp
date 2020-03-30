<!-- 
	报表系统主页,进入本系统会预先加载报表菜单,然后查询第一项
 -->
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<!DOCTYPE html>
<html lang="zh-CN">
  <head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>欢迎进入主页</title>

    <!-- Bootstrap -->
    <link href="<c:url value='/css/bootstrap.css'/>" rel="stylesheet">
    <link href="<c:url value='/layui/css/layui.css'/>" rel="stylesheet">
    <script src="<c:url value='/js/jquery-1.11.0.js'/>"></script>
    <script src="<c:url value='/js/bootstrap.js'/>"></script>

	<%--加载css--%>
	<link href="<c:url value='/css/riskwarm/reportMain.css'/>" rel="stylesheet">
	
	<!-- 加载生成表格插件 -->
	<script src="<c:url value='/js/echarts.min.js'/>"></script>
	<!--日历插件-->
	<script src="<c:url value='/layui/layui.js' />"></script>
	
	<%--加载主页面js--%>
	<script src="<c:url value='/js/riskwarm/reportMain.js'/>"></script>
	<script src="<c:url value='/js/commonjs.js'/>"></script>
	</head>
<body>
	<div class="container">
		<div id="head" class="row">
			<span class="col-md-8">
				<div>
					欢迎您 <img
						src="<c:url value='/images/${sessionScope.user.imgname}'/>"
						class="img-circle" width="40px" height="40px"
						style="margin:8px 0 8px 0"> <b style="color: darkorange;">
						${sessionScope.user.name}</b> <label class="btn btn-link"
						onclick="toProCenterPage('${sessionScope.user.id}')"><b>个人中心</b></label>
					<label class="btn btn-link"
						onclick="loginOut('${sessionScope.user.id}')"><b>注销登录</b></label>
				</div>
			</span> <span class="col-md-2 col-md-offset-2"><label
				class="btn btn-link" onclick="goToMainpage()">回到主页</label></span>
		</div>
		<div id="main" class="row">
			<!-- 报表菜单 -->
			<div id="riskMenu" class="col-md-3 col-md-offset-0">
				<!-- 报表导航菜单 -->
				<div id="menu">
					<h3>电子账簿报表系统</h3>
					<ul class="layui-nav layui-nav-tree layui-bg-cyan"
						style="overflow: auto;height: 420px" layui-filter="demo">
						<li class="layui-nav-item layui-nav-itemd"><a
							href="javascript:;">账目金额统计</a>
							<dl class="layui-nav-child">
								<dd>
									<a href="javascript:;">账目概况统计</a>
								</dd>
								<dd>
									<a href="javascript:;">每日流水账单统计</a>
								</dd>
								<dd>
									<a href="javascript:;">主分类消费统计</a>
								</dd>
								<dd>
									<a href="javascript:;">父分类消费统计</a>
								</dd>
							</dl></li>
						<li class="layui-nav-item layui-nav-itemd"><a
							href="javascript:;">账目金额明细</a>
							<dl class="layui-nav-child">
								<dd>
									<a href="javascript:;">大额金额明细</a>
								</dd>
								<dd>
									<a href="javascript:;">每日流水账单明细</a>
								</dd>
								<dd>
									<a href="javascript:;">主分类消费明细</a>
								</dd>
								<dd>
									<a href="javascript:;">父分类消费明细</a>
								</dd>
								<dd>
									<a href="javascript:;">账目明细流水统计</a>
								</dd>
							</dl></li>

					</ul>
				</div>
			</div>
			<!-- 报表区域 -->
			<div id="riskMain" class="col-md-9">
				<div class="row riskQueCon">
					<div class="col-md-8 col-md-offset-1">
						<div class="border">
							<div class="row buttom-spacing">
								<form class="form-inline ">
									<div class="form-group">
										<label for="startDate">开始日期:</label> <input id="startDate"
											type="text" class="form-control bold rDate" style="width: 100px;"
											placeholder="格式:yyyy-MM-dd">
									</div>
									<div class="form-group">
										<label for="endDate">截止日期:</label> <input id="endDate"
											type="text" class="form-control bold rDate" style="width: 100px"
											placeholder="2019-03-05">
									</div>
								</form>
							</div>
							<div class="row buttom-spacing">
								<form class="form-inline">
									<div class="form-group">
										<label for="exampleInputName2">金额条件:</label> <select
											id="amountType" class="form-control bold">
											<option>全部</option>
											<option>消费</option>
											<option>收入</option>
											<option>转账</option>
											<option>借还款</option>
										</select><b class="bold" style="color: #ffb405;font-size: 14px;">
											金额 </b> <select id="amountCon" class="form-control bold">
											<option value="ALL" title="不筛选金额">不选择</option>
											<option value="小于" title="查询结果小于指定金额">＜</option>
											<option value="小于等于" title="查询结果中金额小于或等于条件金额">≤</option>
											<option value="等于" title="查询结果中金额等于条件金额">＝</option>
											<option value="不等于" title="查询结果中金额不等于条件金额">≠</option>
											<option value="大于" title="查询结果中金额大于条件金额">＞</option>
											<option value="大于等于" title="查询结果中金额大于或等于条件金额">≥</option>
											<option value="位于" title="查询结果中金额在最小金额--最大金额之间">[...]</option>
										</select> <input id="minAmount" type="text" min="0" 
											class="form-control bold hide" style="width: 90px"
											placeholder="输入金额"> <b>元</b> <span class="bold hide">
											到 <input id="maxAmount" type="text" min="0"
											class="form-control " style="width: 90px" placeholder="最大金额">
											元 之间
										</span>
									</div>
								</form>
							</div>
							<div class="row"></div>
						</div>
					</div>
					<div class="col-md-2">
						<div style="padding-top: 5px">
							<div class="row" style="padding-bottom: 3%">
								<div class="col-md-10 col-md-offset-1">
									<button id="queryRisk" class="btn btn-info btn-block">
										<span class="glyphicon glyphicon-search"></span> 查 询
									</button>
								</div>
							</div>
							<div class="row buttom-spacing">
								<div class="col-md-10 col-md-offset-1">
									<button class="btn btn-info btn-block">
										<span class="glyphicon glyphicon glyphicon-download-alt"></span>
										导 出
									</button>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div id="riskData" class="row">
					<div class="col-md-12 col-md-offset-0">
						<table id="demo" lay-size="sm"></table>
					</div>
				</div>
				<!-- 报表分页区域 -->
				<div class="row">
					<div class="col-md-12 col-md-offset-0">
						<div id="pageBox"></div>
						<!-- <div id="riskPage"  class="layui-box layui-laypage">
							<span class="layui-laypage-skip">
								到第<input type="text" min="1" value="1" class="layui-input">页
								<button type="button" class="layui-laypage-btn">确定</button>
							</span>
							<a href="javascript:;" class="layui-laypage-prev layui-disabled" data-page="0">
								<i class="layui-icon layui-icon-left"></i>
							</a>
							<span class="layui-laypage-curr">
								<em class="layui-laypage-em"></em>
								<em>1</em>
							</span>
							<a href="javascript:;" data-page="2">2</a>
							<a href="javascript:;" data-page="3">3</a>
							<a href="javascript:;" data-page="4">4</a>
							<a href="javascript:;" data-page="5">5</a>
							<span class="layui-laypage-spr">…</span>
							<a href="javascript:;" class="layui-laypage-last" title="尾页" data-page="12">12</a>
							<a href="javascript:;" class="layui-laypage-next" data-page="2"><i class="layui-icon layui-icon-right"></i></a><span class="layui-laypage-count">共 120 条</span></div>
						</div> -->
					</div>
				</div>
			</div>
		</div>
		<script type="text/javascript">
			var uid = '${sessionScope.user.id}';
		</script>
  </body>
</html>