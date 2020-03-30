<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<!DOCTYPE html>
<html lang="zh-CN">

<head>
<meta charset="utf-8">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<meta name="viewport" content="width=device-width, initial-scale=1">
<!-- 上述3个meta标签*必须*放在最前面，任何其他内容都*必须*跟随其后！ -->
<title>分类管理</title>

<!-- Bootstrap -->
<script src="<c:url value='/js/jquery-1.11.0.js' />"></script>
<!-- 加载 Bootstrap 的所有 JavaScript 插件。你也可以根据需要只加载单个插件。 -->

<!-- layUI表格插件和css -->
<link href="<c:url value='/layui/css/layui.css' />" rel="stylesheet">
<script src="<c:url value='/layui/layui.js'/>"></script>

<!-- jQuery (Bootstrap 的所有 JavaScript 插件都依赖 jQuery，所以必须放在前边) -->
<link href="<c:url value='/css/bootstrap.css' />" rel="stylesheet">
<script src="<c:url value='/js/bootstrap.js' />"></script>

<!--日历插件-->
<%-- <script src="<c:url value='/laydate/laydate.js' />"></script> --%>
<!-- 加载公共js -->
<script src="<c:url value='/js/commonjs.js' />"></script>

<!-- 加载分类管理css -->
<link href="<c:url value='/css/mng/sortMng.css' />" rel="stylesheet">
<!-- 加载分类管理js-->
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
					欢迎您 <img
						src="<c:url value='/images/${sessionScope.user.imgname}'/>"
						class="img-circle" width="40px" height="40px"
						style="margin:8px 0 8px 0"> <b style="color: darkorange;">
						${sessionScope.user.name}</b> <label class="btn btn-link"
						onclick="toProCenterPage()"><b>个人中心</b> </label> <label
						class="btn btn-link" onclick="loginOut()"><b>注销登录</b> </label>
				</div> </span> <span class="col-md-1 col-md-offset-4"><label
				class="btn btn-link" onclick="toLedgerPage()">账目管理</label> </span> <span
				class="col-md-1"><label class="btn btn-link"
				onclick="goToMainpage()"">回到主页</label> </span>
		</div>
		<div id="content" class="row">
			<div class="col-md-10 col-md-offset-1 "
				style="border-bottom: lightcyan 3px double;">
				<div class="row" style="height: 30px;"></div>
				<div class="row">
					<div class="col-md-7">
						<div class="col-md-4">
							<div class="col-md-5 selectLabel">
								<b>根分类</b>
							</div>
							<div class="col-md-7 select-con">
								<form>
									<select class="form-control" id="rootSelectedList"
										style="width: 120px;"
										onchange="changeChild('#rootSelectedList')"
										onmouseenter="initSearchText()"></select>
								</form>
							</div>
						</div>
						<div class="col-md-4">
							<div class="col-md-5 selectLabel">
								<b>父分类</b>
							</div>
							<div class="col-md-7 select-con">
								<form>
									<select class="form-control" id="parentSelectedList"
										style="width: 120px;"
										onchange="changeChild('#parentSelectedList')"></select>
								</form>
							</div>
						</div>
						<div class="col-md-4">
							<div class="col-md-5 selectLabel">
								<b>子分类</b>
							</div>
							<div class="col-md-7 select-con">
								<form>
									<select class="form-control" id="childSelectedList"
										style="width: 120px;"></select>
								</form>
							</div>
						</div>
					</div>
					<div class="col-md-5">
						<form class="navbar-form" role="search" style="padding-top: 2px">
							<div class="form-group">
								<label class="control-label">内容搜索:</label> <input type="text"
									id="searchKey" class="form-control" placeholder="输入搜索内容"
									style="width: 160px;" onfocus="javascript:initQueryCon()">
							</div>
							<button type="button" class="btn btn-info"
								style="width: 90px; margin-left: 10px;"
								onclick="querySortInfo()">
								<span class="glyphicon glyphicon-search"></span> <b>搜 索</b>
							</button>
						</form>
					</div>
				</div>

			</div>
			<div class="row">
				<div class="col-md-10 col-md-offset-1 ">
					<div class="table-responsive table1" id="sortDataTable"></div>
				</div>
			</div>
			<div class="row">
				<div class="col-md-3 col-md-offset-1" id="pageCount"
					style="padding-top: 13px;"></div>
				<div class="col-md-5 col-md-offset-3">
					<nav aria-label="Page navigation" style="padding-left: 80px;">
						<ul class="pagination pagination-sm" id="pageMsg">
							<!-- 分页信息由数据库动态加载 -->
						</ul>
					</nav>
				</div>
			</div>
			<div class="row fun_btn ">
				<div class="col-md-10 col-md-offset-1" style="margin-bottom: 15px;">
					<div class="col-md-2">
						<button class="btn btn-default btn-block" data-toggle="modal"
							data-target="#addSortDialog">
							<b>添 加</b>
						</button>
					</div>
					<div class="col-md-2 ">
						<button class="btn btn-block btn-default" data-toggle="modal"
							onclick="openSortEdit()">
							<b>修 改</b>
						</button>
					</div>
					<div class="col-md-2 ">
						<button class="btn btn-block btn-default" onclick="delSortInfo()">
							<b>删 除</b>
						</button>
					</div>
					<div class="col-md-2 ">
						<button class="btn btn-block btn-default"
							onclick="openExportView()">
							<b>导 出</b>
						</button>
					</div>
					<div class="col-md-2 ">
						<button class="btn btn-block btn-default"
							onclick="openCountView()">
							<b>分类统计</b>
						</button>
					</div>
					<div class="col-md-2 ">
						<button class="btn btn-block btn-default"
							onclick="openSortMngView()">
							<b>批量管理</b>
						</button>
					</div>
				</div>
			</div>
		</div>
	</div>

	<!--添加分类模态窗口 -->
	<div class="modal fade" id="addSortDialog" tabindex="-1" role="dialog"
		aria-labelledby="addSortDialogLabel" aria-hidden="true"
		data-backdrop="static" data-keyboard="false">
		<div class="modal-dialog">
			<div class="modal-content">
				<div class="modal-header">
					<button type="button" class="close" data-dismiss="modal"
						aria-hidden="true">&times;</button>
					<h4 class="modal-title" id="addSortDialogLabel">
						<span class="glyphicon glyphicon-plus"></span> 添加分类管理
					</h4>
				</div>
				<div class="modal-body">
					<form class="form-horizontal" id="editSortForm">
						<div class="form-group">
							<label for="addRootName,addRootNameText"
								class="col-sm-2 control-label"> 根分类 </label>
							<div class="col-sm-6">
								<select class="form-control hidden" id="addRootName"
									name="rootNameSelect" onchange="changeRootSort(this)"></select>
								<input type="text" id="addRootNameText" name="addRootNameTxt"
									class="form-control" placeholder="添加新的根分类" />
							</div>
							<button class="btn btn-default hidden" type="button"
								id="addRootBtn" onclick="showAddRootText()">
								<span class="glyphicon glyphicon-plus"></span> 新增
							</button>
							<button class="btn btn-default" type="button"
								id="choseAddRootBtn" onclick="showAddRootSelecte()">
								<span class="glyphicon glyphicon-th-list"></span> 选择
							</button>
						</div>

						<div class="form-group">
							<label for="editParentName" class="col-sm-2 control-label">
								父分类 </label>
							<div class="col-sm-6">
								<select class="form-control hidden" id="addParentName"></select>
								<input type="text" id="addParentNameText" name=""
									class="form-control" placeholder="添加新的根分类" />
							</div>
							<button class="btn btn-default hidden" type="button"
								id="addParentBtn" onclick="showAddParentText()">
								<span class="glyphicon glyphicon-plus"></span> 新增
							</button>
							<button class="btn btn-default " type="button"
								id="choseAddParentBtn" onclick="showAddParentSelecte()">
								<span class="glyphicon glyphicon-th-list"></span> 选择
							</button>
						</div>

						<div class="form-group">
							<label for="sortNameText" class="col-sm-2 control-label">
								子分类 </label>
							<div class="col-sm-6">
								<input type="text" id="sortNameText" name="sortName"
									onblur="checSortName('#sortNameText')"
									onfocus="hideMsgBox('#sortNameMsgBox')" class="form-control"
									placeholder="子分类长度为1-4个字" />
							</div>
							<div class="col-sm-4 hidden" id="sortNameMsgBox"></div>
						</div>
						<div class="form-group">
							<label class="col-sm-2 control-label"> 创建时间 </label>
							<div class="col-sm-6">
								<input type="text" id="creatrTimeText" class="form-control" />
							</div>
						</div>
						<div class="form-group">
							<label for="sortDescArea" class="col-sm-2 control-label">
								分类说明 </label>
							<div class="col-sm-8">
								<textarea id="sortDescArea" rows="4" cols="8"
									class="form-control" style="resize: none;"
									placeholder="这是分类描述的默认属性值,点击可以修改"></textarea>
							</div>
						</div>
					</form>
				</div>
				<div class="modal-footer">
					<button type="button" class="btn btn-default" data-dismiss="modal">关闭
					</button>
					<button type="button" class="btn btn-primary" onclick="addSort()">
						提交更改</button>
				</div>
			</div>
			<!-- /.modal-content -->
		</div>
		<!-- /.modal -->
	</div>

	<!-- 编辑分类模态窗口 -->
	<div class="modal fade" id="editSortDialog" tabindex="-1" role="dialog"
		aria-labelledby="editSortDialogLabel" aria-hidden="true">
		<div class="modal-dialog">
			<div class="modal-content">
				<!--模态窗口头部 -->
				<div class="modal-header">
					<button type="button" class="close" data-dismiss="modal"
						aria-hidden="true">&times;</button>
					<h4 class="modal-title" id="editSortDialogLabel">
						<span class="glyphicon glyphicon-pencil"></span> 编辑分类
					</h4>
				</div>
				<!-- 模态窗口主体 -->
				<div class="modal-body">
					<form class="form-horizontal" id="editSortForm">
						<input type="hidden" id="editSortId" name="sortID" /> <input
							type="hidden" id="editUserId" value="${sessionScope.user.id }" />
						<div class="form-group">
							<label for="editRootName" class="col-sm-2 control-label">
								根分类 </label>
							<div class="col-sm-6">
								<select class="form-control" id="editRootName" name="rootName"
									onchange="changeRootSort(this)"></select> <input type="text"
									id="editRootNameText" name="rootNameText"
									class="form-control  hidden" placeholder="添加新的根分类" />
							</div>
							<button class="btn btn-default" type="button" id="editRootBtn"
								onclick="showRootText()">
								<span class="glyphicon glyphicon-plus"></span> 新增
							</button>
							<button class="btn btn-default hidden" type="button"
								id="choseRootBtn" onclick="showRootSelecte()">
								<span class="glyphicon glyphicon-th-list"></span> 选择
							</button>
						</div>

						<div class="form-group">
							<label for="editParentName" class="col-sm-2 control-label">
								父分类 </label>
							<div class="col-sm-6">
								<select class="form-control" id="editParentName"
									name="parentName"></select> <input type="text"
									id="editParentNameText" name="parentNameText"
									class="form-control  hidden" placeholder="添加新的根分类" />
							</div>
							<button class="btn btn-default" type="button" id="editParentBtn"
								onclick="showParentText()">
								<span class="glyphicon glyphicon-plus"></span> 新增
							</button>
							<button class="btn btn-default hidden" type="button"
								id="choseParentBtn" onclick="showParentSelecte()">
								<span class="glyphicon glyphicon-th-list"></span> 选择
							</button>
						</div>

						<div class="form-group">
							<label for="editSortNameText" class="col-sm-2 control-label">
								子分类 </label>
							<div class="col-sm-6">
								<input type="text" id="editSortNameText" name="sortName"
									class="form-control" onblur="checSortName('#editSortNameText')"
									onfocus="hideMsgBox('#editSortNameMsgBox')"
									placeholder="子分类长度为1-4个字" />
							</div>
							<div class="col-sm-4 hidden" id="editSortNameMsgBox"></div>
						</div>

						<div class="form-group">
							<label class="col-sm-2 control-label" for="editCreatrTimeText">
								创建时间 </label>
							<div class="col-sm-6">
								<input type="text" id="editCreatrTimeText" name="createDate"
									readonly="readonly" class="form-control" />
							</div>
						</div>

						<div class="form-group">
							<label class="col-sm-2 control-label" for="editLastTimeText">
								最后修改时间 </label>
							<div class="col-sm-6">
								<input type="text" id="editLastTimeText" name="lastModDate"
									readonly="readonly" class="form-control" />
							</div>
						</div>
						<div class="form-group">
							<label for="editSortDescArea" class="col-sm-2 control-label">
								分类说明 </label>
							<div class="col-sm-8">
								<textarea id="editSortDescArea" name="sortDesc" rows="4"
									cols="8" class="form-control" style="resize: none;"
									placeholder="这是分类描述的默认属性值,点击可以修改"></textarea>
							</div>
						</div>
					</form>
				</div>
				<div class="modal-footer">
					<button type="button" class="btn btn-default" data-dismiss="modal">关闭
					</button>
					<button type="button" class="btn btn-primary"
						onclick="updateSort()">提交更改</button>
				</div>
			</div>
			<!-- /.modal-content -->
		</div>
		<!-- /.modal -->
	</div>

	<!-- 导出分类信息模态窗口 -->
	<div class="modal fade" id="exportSortDialog" tabindex="-1"
		role="dialog" aria-labelledby="exportSortDialogLabel"
		aria-hidden="true">
		<div class="modal-dialog">
			<div class="modal-content">
				<!--模态窗口头部 -->
				<div class="modal-header">
					<button type="button" class="close" data-dismiss="modal"
						aria-hidden="true">&times;</button>
					<h4 class="modal-title" id="editSortDialogLabel">
						<span class="glyphicon glyphicon-folder-open"></span> - 请选择导出类型
					</h4>
				</div>
				<!-- 模态窗口主体 -->
				<div class="modal-body">
					<div>
						<form action="">
							<div class="row">
								<div class="col-md-4 col-md-offset-4">
									<button class="btn btn-default btn-block" type="button"
										onclick="exportSortInfo(1)">
										<b>导出本页数据</b>
									</button>
								</div>
							</div>
							<div class="row" style="margin-top: 1%">
								<div class="col-md-4 col-md-offset-4">
									<button class="btn btn-default btn-block" type="button"
										onclick="exportSortInfo(2)">
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

	<!-- 分类信息统计 -->
	<div class="modal fade" id="countSortDialog" tabindex="-1"
		role="dialog" aria-labelledby="countSortDialogLabel"
		aria-hidden="true">
		<div class="modal-dialog">
			<div class="modal-content">
				<!--模态窗口头部 -->
				<div class="modal-header">
					<button type="button" class="close" data-dismiss="modal"
						aria-hidden="true">&times;</button>
					<h4 class="modal-title" id="editSortDialogLabel">
						<span class="glyphicon glyphicon-list-alt"></span> - 分类信息统计
					</h4>
				</div>
				<!-- 模态窗口主体 -->
				<div class="modal-body">
					<div class="row">
						<div class="col-sm-10 col-sm-offset-1" style="color:#cddc39"
							id="countSortMsg"></div>
					</div>
					<div class="row">
					<div class="col-sm-10 col-sm-offset-1">
						<!-- 写入数据 -->
						<!-- <div class="table-responsive sty" id="sortItemCountEle"> -->
							<!-- <table class="table  table-bordered  table-condensed " id="sortInfoTable"></table> -->
						<div class="sty" id="sortItemCountEle">
							<table id="sortInfoTable"></table>
						</div>
					</div>
				</div>
				<div class="modal-footer">
					<button type="button" class="btn btn-default" data-dismiss="modal">关
						闭</button>
				</div>
			</div>
			<!-- /.modal-content -->
		</div>
		<!-- /.modal -->
	</div>
	</div>

	<!-- 分类管理窗口 -->
	<div class="modal fade" id="sortMngDialog" tabindex="-1" role="dialog"
		aria-labelledby="sortMngDialogLabel" aria-hidden="true">
		<div class="modal-dialog">
			<div class="modal-content">
				<!--模态窗口头部 -->
				<div class="modal-header">
					<button type="button" class="close" data-dismiss="modal"
						aria-hidden="true">&times;</button>
					<h4 class="modal-title" id="editSortDialogLabel">
						<span class="glyphicon glyphicon-folder-open"></span> 根/父分类修改
					</h4>
				</div>
				<!-- 模态窗口主体 -->
				<div class="modal-body">
					<div class="row">
						<div class="col-md-10 col-md-offset-1">
							<div class="row"></div>
							<ul id="mngMenu" class="nav nav-tabs">
								<li class="active" onclick="querySortTypes('根分类')"><a
									href="#rootMng" data-toggle="tab">根分类</a></li>
								<li onclick="querySortTypes('父分类')"><a href="#parentMng"
									data-toggle="tab">父分类</a></li>
							</ul>
							<div id="mngContent" class="table-content" style="margin: 5%">
								<div id="sortMngTbl" class="table-responsive sty" >
									<table
										class="table table-bordered  table-condensed table-striped">
										<tr class="active">
											<th>序号</th>
											<th>根分类名称</th>
											<th>下级分类数目</th>
											<th>操作</th>
										</tr>
										<tr>
											<td>1</td>
											<td>消费</td>
											<td>12</td>
											<td>
												<button class="btn btn-primary btn-sm"
													onclick="editThis(this,1)">
													<span class="glyphicon glyphicon-pencil"></span> 编 辑
												</button>
											</td>
										</tr>
										<tr>
											<td>2</td>
											<td>收入</td>
											<td>4</td>
											<td>
												<button class="btn btn-primary btn-sm"
													onclick="editThis(this,1)">
													<span class="glyphicon glyphicon-ok"></span> 确 定
												</button>
											</td>
										</tr>
									</table>
								</div>
								<!-- <div id="parentMng" class="tab-pane fade"></div> -->
							</div>
						</div>
					</div>
					<div class="modal-footer">
						<button type="button" class="btn btn-default" data-dismiss="modal">关
							闭</button>
					</div>
				</div>
				<!-- /.modal-content -->
			</div>	
		</div>
		<!-- /.modal -->
	</div>
</body>
</html>