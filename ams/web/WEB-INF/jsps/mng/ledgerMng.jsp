<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<!DOCTYPE html>
<html lang="zh-CN">
	<head>
		<meta charset="utf-8">
		<meta http-equiv="X-UA-Compatible" content="IE=edge">
		<meta name="viewport" content="width=device-width, initial-scale=1">
		<title>账目管理</title>

		<!-- Bootstrap -->
		<link href="<c:url value='/css/bootstrap.css' />" rel="stylesheet">
		<script src="<c:url value='/js/jquery-1.11.0.js' />"></script>
		<script src="<c:url value='/js/bootstrap.js' />"></script>
		<!--日历插件-->
		<script src="<c:url value='/laydate/laydate.js' />"></script>
		
		<script src="<c:url value='/laydate/laydate.js' />"></script>
		<!-- 加载公共js -->
		<script src="<c:url value='/js/commonjs.js'/>"></script>
		<!-- 加载绘图js -->
		<script src="<c:url value='/js/echarts.min.js'/>"></script>
		
		<!-- 加载账目管理css -->
		<link href="<c:url value='/css/mng/ledgerMng.css' />" rel="stylesheet">
		<!-- 加载账目管理js-->
		<script src="<c:url value='/js/mng/ledgerMng.js' />"></script>
		<!-- 加载为了调用部分方法 -->
		<script src="<c:url value='/js/mng/sortMng.js' />"></script>
		<!-- HTML5 shim 和 Respond.js 是为了让 IE8 支持 HTML5 元素和媒体查询（media queries）功能 -->
		<!-- 警告：通过 file:// 协议（就是直接将 html 页面拖拽到浏览器中）访问页面时 Respond.js 不起作用 -->
		<!--[if lt IE 9]>
      <script src="https://cdn.bootcss.com/html5shiv/3.7.3/html5shiv.min.js"></script>
      <script src="https://cdn.bootcss.com/respond.js/1.4.2/respond.min.js"></script>
    <![endif]-->
	</head>

	<body>
		<div id="index" class="hidden">${sessionScope.index}</div>
		<div id="userID" class="hidden">${sessionScope.user.id}</div>
		<div class="container tab-content">
			<div id="head" class="row">
				<span class="col-md-6">
				  <div>
					  欢迎您　
					  <img src="<c:url value='/images/${sessionScope.user.imgname}'/>" class="img-circle" width="40px" height="40px" style="margin:8px 0 8px 0">
					  <b style="color: darkorange;">　${sessionScope.user.name}</b>　
					  <label class="btn btn-link" onclick="toProCenterPage()"><b>个人中心</b></label>
					  <label class="btn btn-link" onclick="loginOut()"><b>注销登录</b></label>
					</div>
			  </span>
			  <span class="col-md-1 col-md-offset-4"><label class="btn btn-link" onclick="toSortMngPage()">分类管理</label></span>
			  <span class="col-md-1"><label class="btn btn-link" onclick="goToMainpage()">回到主页</label></span>
			</div>
			<div id="content" class="row">
				<div id="queryCon" class="col-md-10 col-md-offset-1 "
					 style="border-bottom: lightcyan 3px double;font-size:10px">
					<div class="row">
						<div class="col-md-8" style="height:35px;">
							<form class="navbar-form" role="con"  style="padding:0">
								<div class="form-group">
									<label class="control-label">开始日期 :</label>
									<input type="text" id="startDate" class="form-control cal len" readonly="readonly"
										style="width: 118px;margin-left: 9px"
										>
								</div>
								<div class="form-group" style="margin-left: 15px">
									<label class="control-label ">结束日期 :</label>
									<input type="text" id="endDate" class="form-control cal len" readonly="readonly"
										style="width: 118px;"
										>
								</div>
							</form>
						</div>
					</div>
					<div class="row">
						<div class="col-md-7" style="padding:0">
							<div class="col-md-4">
								<div class="col-md-5 selectLabel" style="width: 66px;">
									<b>账目类型 :</b>
								</div>
								<div class="col-md-6 select-con">
									<form>
										<select id="rootSelect" class="form-control" onchange="changeParent()" style="    width: 118px;padding-right: 0px;"></select>
									</form>
								</div>
							</div>
							<div class="col-md-4">
								<div class="col-md-6 selectLabel" style="padding-left: 15px;
		width: 66px;">
									<b>主分类 :</b>
								</div>
								<div class="col-md-6 select-con">
									<form>
										<select id="parentSelect" class="form-control" onchange="changeChilds()"
												style="width: 118px;margin-left: 5px"></select>
									</form>
								</div>
							</div>
							<div class="col-md-4">
								<div class="col-md-5 selectLabel" style="padding-left: 15px;
		width: 66px;">
									<b>次分类 :</b>
								</div>
								<div class="col-md-6 select-con">
									<form>
										<select id="childSelect" class="form-control" style="width: 118px;"></select>
									</form>
								</div>
							</div>
						</div>
						<div class="col-md-5 col-md-offset-0" style="padding-top: 10px;">
							<form class="form-inline" style="float: right;">
							<table border="0">
								<tr>
									<td>
										<div class="form-group">
											<label class="control-label">账目搜索 :</label>
											<input
												id="searchKey"
												type="text"
												class="form-control"
												title="输入需要查询的账目包含的信息进行查询"
												style="width: 160px;"/>
										</div>
									</td>
									<td>
										<button type="button" class="btn btn-info btn-sm" style="margin-left: 1px;" onclick="queryLedgerInfo(1)">
											<span class="glyphicon glyphicon-search"></span>
											查 询
										</button>
										<button type="button" class="btn btn-primary  btn-sm" style="width: 33px;" title="清空查询条件" onclick="initQueCon()">
											<span class="glyphicon glyphicon-trash"></span>
										</button>
									</td>
								</tr>
							</table>
							</form>
						</div>

					</div>
				</div>
			<div class="row">
				<div class="col-md-10 col-md-offset-1 ">
					<div class="table table1" style="height: 350px;width: 100%">
						<div style="height: 30px;width: 100%">
							<table id="thead" class="table table-hover table-striped table-condensed table-bordered">

							</table>
						</div>
						<div style="height: 318px;width: 100%;overflow: auto">
							<table id="dataTable" class="table table-hover table-striped table-condensed table-bordered">
								<tr>

								</tr>
							</table>
						</div>
					</div>
					<%--<div class="table-responsive table1" id="ledgerTable" >

					</div>--%>
				</div>
			</div>
			<!-- 分页 -->
			<div class="row">
				<div class="col-md-6  col-md-offset-1" style="height: 30px;padding-top: 1pt;">
					<label id="pageMesg" style="margin-bottom: 1px">
						当前第 <b style="color: #0C77CF;font-size: 16px">2</b> 页,共 <b style="color: #0C77CF;font-size: 16px">10</b> 页,共 <b style="color: #0C77CF;font-size: 16px">100</b> 条数据
					</label>
					<div id="ledgMesg" style="width: 600px;height: 24px;overflow:hidden;">
						<div id="gongao"> 
							<div style="white-space: nowrap;overflow:hidden;" id="scroll_div" class="scroll_div"> 
								<div id="scroll_begin"> 
								</div> 
								<div id="scroll_end"></div> 
							</div> 
						</div>
						
						<!-- <b>在期间</b> <span style="color:blue;">信贷  </span><span style="color:blue;">5500元</span>(其中
						<span style="color:blue;">贷款3000</span>元,<span style="color:blue;">还款2000元</span>);
						<span style="color: red">消费 1250</span>元(其中<span style="color: red">三餐支出 550</span> 元,<span style="color: red">购买生活用品250</span>元
						,<span style="color: red">购买衣服400</span>元);
						<span style="color:green">收入5610</span>收入5610元(其中<span style="color:green">工资收入 4420</span> 元,
						<span style="color:green">出差补贴 800</span>元,<span style="color:green">其他消费 490</span>元) -->
					</div>
				</div>
				<div class="col-md-4 col-md-offset-0" style="height: 50px;">
					<nav aria-label="Page navigation " style="float:right;">
						<ul class="pagination pagination-sm" id="ledgerPage"></ul>
					</nav>
				</div>
			</div>
			<div class="row fun_btn " style="margin-bottom: 10px;">
				<div class="col-md-10 col-md-offset-1" style="margin-bottom: 5px;">
					<div class="col-md-2">
						<button class="btn btn-block btn-default " data-toggle="modal" data-target="#addLedger">
							<span class="glyphicon glyphicon-plus"></span>
							<b>添 加</b>
						</button>
					</div>
					<div class="col-md-2 ">
						<button class="btn btn-block btn-default" data-toggle="modal" onclick="editLedger()">
							<span class="glyphicon glyphicon-pencil"></span>
							<b>修 改</b>
						</button>
					</div>
					<div class="col-md-2 ">
						<button class="btn btn-block btn-default" title="点击删除选定的账簿条目" onclick="delLedger()">
							<span class="glyphicon glyphicon-remove"></span>
							<b>删 除</b>
						</button>
					</div>
					<div class="col-md-2 ">
						<button class="btn btn-block btn-default" title="点击导出当前账簿数据" data-toggle="modal" data-target="#exportLedger">
							<span class="glyphicon glyphicon-download-alt"></span>
							<b>导 出</b>
						</button>
					</div>
					<div class="col-md-2 ">
						<button class="btn btn-block btn-default" title="点击分析当前查询的账目信息" onclick="openLedgerAnalysisView()">	
							<span class="glyphicon glyphicon-th-list"></span>
							<b>分 析</b>
						</button>
					</div>
					<div class="col-md-2 ">
						<button class="btn btn-block btn-default" title="回到账簿系统主页" onclick="goToMainpage()">
							<span class="glyphicon glyphicon-share-alt"></span>
							<b>返 回</b>
						</button>
					</div>
				</div>
			</div>
		</div>
	</div>

	<!--添加账务对话框 -->
	<div class="modal fade" id="addLedger" tabindex="-1" role="dialog" aria-labelledby="addLedger" aria-hidden="true" data-backdrop="static">
		<div class="modal-dialog modal-position">
			<div class="modal-content myModal">
				<div class="modal-header">
					<label class="h4" style="color: white;">
						<span class="glyphicon glyphicon-plus"></span>
						添加账目
					</label>
					<span class="glyphicon glyphicon-remove" data-dismiss="modal"  style="float: right;padding-right: 15px;padding-top: 15px"></span>
				</div>
				<div class="modal-body">
					<form class="form-inline" style="text-align: center;">
						<div class="form-group">
							<label class="control-label">账目类型 :</label>
							<select class="form-control" id="addRootSelect" name="sort.rootName" onchange="changeParent('#addRootSelect')">
							</select>
						</div>
						<div class="form-group">
							<label class="control-label">主分类 :</label>
							<select class="form-control" id="addParentSelect"  name="sort.parentName" onchange="changeChilds('#add')">
							</select>
						</div>
						<div class="form-group">
							<label class="control-label" >次分类 :</label>
							<select class="form-control" id="addChildSelect" name="sort.childName">
							</select>
						</div>
				</form><br>
					<form class="form-horizontal" id="addLedgerForm">
						<div class="form-group">
							<label class="col-md-2 col-md-offset-1 control-label">账目名称 :</label>
							<div class="col-md-6">
								<input type="text" id="addLedgerText" name="ledgerName" class="form-control" 
									onblur="checkName('#add')" onfocus="hideMsg('#addLedgerText')" 
									placeholder="账目名称字数不能超过20个" maxlength="20" list="lNameList"/>
							</div>
							<div class="col-md-2 hide" id="addLedgerMsg" style="color: red;padding: 0;padding-top: 6px;">
								<span class="glyphicon glyphicon-remove"></span>
							</div>
						</div>
						<div class="form-group">
							<label class="col-md-2 col-md-offset-1 control-label">
								账目金额 :
							</label>
							<div class="col-md-6">
								<input type="text" id="addAmountText" name="amount" 
									onblur="checkAmount('#add')" onfocus="hideMsg('#addAmountText')" 
									class="form-control" value="0.00" />
							</div>
							<div class="col-md-2 hide" id="addAmountMsg" style="color: red;padding: 0;padding-top: 6px;">
								<span class="glyphicon glyphicon-remove"></span>
							</div>
						</div>
						<div class="form-group">
							<label class="col-md-2 col-md-offset-1 control-label">
								结算方式 :
							</label>
							<div class="col-md-6">
								<input type="text" id="addPayMethodText" name="settlleMethod" class="form-control" list="payMethod"/>
							</div>
						</div>
						<div class="form-group">
							<label class="col-md-2 col-md-offset-1 control-label">
								账目日期 :
							</label>
							<div class="col-md-6" id="addDateBox">
								<input type="text" id="addDateText" name="creDate" class="form-control"/>
							</div>
						</div>
						<div class="form-group">
							<label class="col-md-2 col-md-offset-1 control-label">
								账目说明 :
							</label>
							<div class="col-md-6">
								<textarea id="addLedgerDescArea" name="ledgerDesc"
								 style="font-size: 10px;resize: none;"
								 class="form-control" cols="8" rows="3"placeholder="这是分类描述的默认属性值,点击可以修改"></textarea>
							</div>
						</div>
					</form>
				</div>
				<div class="modal-footer">
					<div class="col-md-6 col-md-offset-3">
						<div class="col-md-5">
							<button type="button" class="btn btn-default btn-block" data-dismiss="modal">取 消</button>
						</div>
						<div class="col-md-5 col-md-offset-2">
							<button type="button" class="btn btn-success btn-block" onclick="AddLedgerSubmit()">提 交</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>

	<!--编辑账务对话框 -->
	<div class="modal fade" id="editLedger" tabindex="-1" role="dialog" aria-labelledby="editLedger" aria-hidden="true" data-backdrop="static">
		<div class="modal-dialog modal-position" style="">
			<div class="modal-content" style="margin-top: 5%;">
				<div class="modal-header">
					<label class="h4" style="color: white;">
						<span class="glyphicon glyphicon-pencil" ></span>
						编辑账目
					</label>
					<span class="glyphicon glyphicon-remove" data-dismiss="modal"  style="float: right;padding-right: 15px;padding-top: 15px"></span>
				</div>
				<div class="modal-body">
					<form class="form-inline" style="text-align: center;">
							<div class="form-group">
								<label class="control-label">账目类型 :</label>
								<select class="form-control" id="editRootSelect" name="sort.rootName" onchange="changeParent('#addRootSelect')">
								</select>
							</div>
							<div class="form-group">
								<label class="control-label">主分类 :</label>
								<select class="form-control" id="editParentSelect"  name="sort.parentName" onchange="changeChilds('#add')">
								</select>
							</div>
							<div class="form-group">
								<label class="control-label" >次分类 :</label>
								<select class="form-control" id="editChildSelect" name="sort.childName">
								</select>
							</div>
					</form><br>
					<form class="form-horizontal" id="editLedgerForm">
						<input type="hidden" id="ledgerId" name="ledgerID"/>
						<div class="form-group">
							<label class="col-md-2 col-md-offset-1 control-label">账目名称 :</label>
							<div class="col-md-7">
								<input type="text" id="editLedgerText" name="ledgerName" 
									class="form-control" placeholder="账目名称不能超过8个字" 
									onblur="checkName('#edit')" onfocus="hideMsg('#editLedgerText')" 
									list="lNameList"
									/>
							</div>
							<div class="col-md-2 hide" id="editLedgerMsg" style="color: red;padding: 0;padding-top: 6px;">
								<span class="glyphicon glyphicon-remove"></span>
							</div>
						</div>
						<div class="form-group">
							<label class="col-md-2 col-md-offset-1 control-label">
								金 额 :
							</label>
							<div class="col-md-7">
								<input type="text" id="editAmountText" name="amount" 
								class="form-control" value="0.00" 
								onblur="checkAmount('#edit')" onfocus="hideMsg('#editAmountText')" 
								/>
							</div>
							<div class="col-md-2 hide" id="editAmountMsg" style="color: red;padding: 0;padding-top: 6px;">
								<span class="glyphicon glyphicon-remove"></span>
							</div>
						</div>
						<div class="form-group">
							<label class="col-md-2 col-md-offset-1 control-label">
								结算方式 :
							</label>
							<div class="col-md-7">
								<input type="text" class="form-control" id="editSettlleMethodText" name="settlleMethod" list="payMethod">
							</div>
						</div>
						<div class="form-group">
							<label class="col-md-2 col-md-offset-1 control-label">
								创建时间 :
							</label>
							<div class="col-md-7">
								<input type="text" id="editStartDate" name="creDate" readonly="readonly" class="form-control" value="2018-09-05" />
							</div>
						</div>
						<div class="form-group">
							<label class="col-md-2 col-md-offset-1 control-label">
								最后修改时间 :
							</label>
							<div class="col-md-7">
								<input type="text" id="editEndDate" name="lastModDate" readonly="readonly" class="form-control" value="2018-09-05" />
							</div>
						</div>
						<div class="form-group" sty>
							<label class="col-md-2 col-md-offset-1 control-label">
								账目说明 :
							</label>
							<div class="col-md-7">
								<textarea id="editLedgerArea" name="ledgerDesc" class="form-control" cols="6" rows="3" style="resize: none;font-size: 10px;"></textarea>
							</div>
						</div>
					</form>
				</div>
				<div class="modal-footer">
					<div class="col-md-6 col-md-offset-6 ">
						<div class="col-md-5 col-md-offset-1">
							<button type="button" class="btn btn-default btn-block" data-dismiss="modal">取 消</button>
						</div>
						<div class="col-md-5 col-md-offset-1">
							<button type="button" class="btn btn-success btn-block" onclick="editLedgerSubmit()">提 交</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
	
	<!-- 导出对话框 -->
	<div class="modal fade" id="exportLedger" tabindex="-1" role="dialog"
		aria-labelledby="exportLedger" aria-hidden="true">
		<div class="modal-dialog">
			<div class="modal-content">
				<!--模态窗口头部 -->
				<div class="modal-header">
					<button type="button" class="close" data-dismiss="modal"
						aria-hidden="true">&times;</button>
					<h4 class="modal-title" id="editSortDialogLabel">
						<span class="glyphicon glyphicon-folder-open"></span> 请选择导出类型
					</h4>
				</div>
				<!-- 模态窗口主体 -->
				<div class="modal-body">
					<div>
						<form action="">
							<div class="row">
								<div class="col-md-4 col-md-offset-4">
									<button class="btn btn-default btn-block" type="button"
										onclick="exportLedgerInfo('curPage')">
										<b>导出本页数据</b>
									</button>
								</div>
							</div>
							<div class="row" style="margin-top: 1%">
								<div class="col-md-4 col-md-offset-4">
									<button class="btn btn-default btn-block" type="button"
										onclick="exportLedgerInfo('allPage')">
										<b>导出全部数据</b>
									</button>
								</div>
							</div>
						</form>
					</div>
				</div>
				<div class="modal-footer">
					<button type="button" class="btn btn-default" data-dismiss="modal">取
						消</button>
				</div>
			</div>
			<!-- /.modal-content -->
		</div>
		<!-- /.modal -->
	</div>
	
	<!-- 账目数据分析统计 -->
	<div class="modal fade" id="ledgerAnalysis" tabindex="-1" role="dialog"
		aria-labelledby="ledgerAnalysis" aria-hidden="true">
		<div class="modal-dialog modal-position">
			<div class="modal-content">
				<!--模态窗口头部 -->
				<div class="modal-header">
					<button type="button" class="close" data-dismiss="modal"
						aria-hidden="true">&times;</button>
					<h4 class="modal-title">
						<span class="glyphicon glyphicon-calendar"></span> <strong>账簿数据统计</strong>
					</h4>
				</div>
				<!-- 模态窗口主体 -->
				<div class="modal-body">
					<div class="row">
						<ul id="analysisUl" class="nav nav-tabs"></ul>
					</div>
					<div class="row" style="padding-top: 5px">
						<div id="moneyRiskWarmLabel" class="col-sm-4 col-sm-offset-4">
							<label><span>总</span>账目分析</label>
						</div>
					</div>
					<div id="imgView" class="row hide">
						<!-- 为 ECharts 准备一个具备大小（宽高）的 DOM -->
				    	<div id="dynamicImg" style="width: 596px;height:375px;"></div>
					</div>
					<div id="tblView" class="row">
						<div class="col-md-10 col-md-offset-1">
							<div class="row">
								<div class="col-sm-12">
									<div class="table-responsive sty" id="moneyRiskWarm">
									</div>
								</div>
							</div>
						</div>
					</div>
					<div id="cond" class="row" style="padding-top: 20px"><div id="queCond" class="col-md-12"></div></div>
				</div>
				<div class="modal-footer">
					<div class="row">
						<div class="col-md-4" style="padding-left: 0">
							<label>当前查看方式:</label>
							<button id="tblBtn" type="button" class="btn btn-info" onclick="showStyle('img')" title="点击切换到图片样式">表格样式</button>
							<button id="imgBtn" type="button" class="btn btn-info  hide"  onclick="showStyle('tbl')" title="点击切换到表格样式" style="margin: 0">视图样式</button>
						</div>
						<div class="col-md-6 col-md-offset-2">
							
							<button type="button" class="btn btn-info" onclick="exportTable('moneyRiskWarm')">
								<span class="glyphicon glyphicon-download-alt"></span>
								<b>下载到本地</b>
							</button>
							
							<button type="button" class="btn btn-default" data-dismiss="modal">关　闭</button>
						</div>
					</div>
					
					
					
				</div>
			</div>
			<!-- /.modal-content -->
		</div>
		<!-- /.modal -->
	</div>
	
	<!-- 查看下级分类模态床窗口 add in 2019年2月18号-->
	<div class="modal fade" id="queCurSortChild" tabindex="-1" role="dialog"
		aria-labelledby="queCurSortChild" aria-hidden="true">
		<div class="modal-dialog modal-position">
			<div class="modal-content" style="margin-top: 5%">
				<!--模态窗口头部 -->
				<div class="modal-header">
					<button type="button" class="close" data-dismiss="modal"
						aria-hidden="true">&times;</button>
					<h4 class="modal-title" id="queCurSortChildLabel">当前分类: <span>收入-工作薪资</span>
					</h4>
				</div>
				<!-- 模态窗口主体 -->
				<div class="modal-body">
					<div id="ledDetail" class="table table-responsive sty">
					</div>
				</div>
				<div class="modal-footer">
					<div class="row">
						<div class="col-md-6 col-md-offset-6">
							<button type="button" class="btn btn-default" onclick="exportTable('ledDetail')">
								<span class="glyphicon glyphicon-download-alt"></span>
								 下 载
							</button>
							<button type="button" class="btn btn-default" data-dismiss="modal">
								<span class="glyphicon glyphicon-remove"></span>
								 关 闭
							</button>
						</div>
					</div>
				</div>
			</div>
			<!-- /.modal-content -->
		</div>
		<!-- /.modal -->
	</div>
	
	<!-- 账目名称候选标签 -->
	<datalist id="lNameList">
		<option value="早餐">早餐</option>
		<option value="早餐(外卖)">早餐(外卖)</option>
		<option value="午餐">午餐</option>
		<option value="午餐(外卖)">午餐(外卖)</option>
		<option value="晚餐">晚餐</option>
		<option value="晚餐(外卖)">晚餐(外卖)</option>
		<option value="酒店住宿">酒店住宿</option>
		<option value="网购衣服">网购衣服</option>
		<option value="乘坐公交">乘坐公交</option>
		<option value="乘坐地铁">乘坐地铁</option>
		<option value="逛超市">逛超市</option>
		<option value="交话费">交话费</option>
		<option value="游戏充值">游戏充值</option>
		<option value="发红包">发红包</option>
		<option value="交房租">交房租</option>
	</datalist>
	<!-- 结算方式候选标签 -->
	<datalist id="payMethod">
		<option value="现金支付">现金支付</option>
		<option value="微信余额支付">微信余额支付</option>
		<option value="微信信用卡支付">微信信用卡支付</option>
		<option value="微信银行卡支付">微信银行卡支付</option>
		<option value="支付宝余额支付">支付宝余额支付</option>
		<option value="支付宝信用卡支付">支付宝信用卡支付</option>
		<option selected="selected" value="支付宝银行卡支付">支付宝银行卡支付</option>
		<option value="支付宝花呗支付">支付宝花呗支付</option>
		<option value="支付宝余额宝支付">支付宝余额宝支付</option>
		<option value="QQ钱包支付">QQ钱包支付</option>
		<option value="QQ卡支付">QQ卡支付</option>
		<option value="银行卡支付">银行卡支付</option>
		<option value="信用卡支付">信用卡支付</option>
		<option value="消费卡支付">消费卡支付</option>
		<option value="支票支付">支票支付</option>
		<option value="银行卡转入">银行卡转入</option>
		<option value="QQ钱包转入">QQ钱包转入</option>
		<option value="消费卡转入">消费卡转入</option>
		<option value="花呗转入">花呗转入</option>
		<option value="余额宝转入">余额宝转入</option>
		<option value="微信余额转入">微信余额转入</option>
		<option value="支付宝余额转入">支付宝余额转入</option>
		<option value="现金结算转入">现金结算转入</option>
		<option value="支票转入">支票转入</option>
	</datalist >
	</body>
</html>