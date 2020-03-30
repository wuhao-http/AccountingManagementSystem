/**
 * 分类管理js
 */
$(function() {
	if(!$('#userID').html()){
		alert("登录信息已过期,请重新登录!!");
		location.href="index.jsp";
		return;
	}
	
	rootSort = $('#addRootName').val();

	initSortPage();

	//初始化分类查询条件

	//编辑模态创口关闭事件 
	$('#editSortDialog').on('hide.bs.modal', function() {
		revertEditSortDialog();
	});

	//添加分类模态窗口关闭事件
	$('#addSortDialog').on('hide.bs.modal', function() {
		revertAddSortDialog();
	});

	//打开添加分类窗口模态窗口
	$('#addSortDialog').on('show.bs.modal', function() {
		// 加载日期控件
//		initDate("creatrTimeText");
		loadDatePlugs("#creatrTimeText");
	})

	//编辑分类模态窗口打开事件
	$('#editSortDialog').on('show.bs.modal', function() {
		
	})
	
});

var curRows;
var rootSort;

/**
 * 初始化页面信息
 */
function initSortPage() {
	//显示第一页数据
	querySortInfo(1);
	//加载新增分类窗口下拉列表
	loadAddViewInfo();
	//加载编辑分类窗口下拉列表
	loadEditViewInfo();
	//初始化查询条件
	initQueryCon();
	
}
/**
 * 查询指定页码页的页面信息,并获取分页标签信息
 * @param index
 */
function showPageByIndex(index) {
	$.ajax({
		type : 'post', //方法类型
		url : 'sort/getCurPageInfoByIndex.sp', //请求地址
		dataType : 'json', //数据类型
		data : {
			index : index
		}, //请求到接口的对象
		success : function(resp) { //请求成功处理函数
			if (resp.flag) {
				//填充数据
				fillTable(resp.sortList);
				$('#index').empty().html(resp.index);
				reloadSortCon(resp.sortCon);
			//填充分页
			//				 fillPage(resp.pageList);
			} else {
				alert(resp.msg);
			}
		}
	});
}

/**
 * 加载新增分类窗口下拉列表<br/>
 */
function loadAddViewInfo() {
	fillList('#addRootName','#addParentName');
}

/**
 * 加载编辑分类窗口下拉列表<br/>
 */
function loadEditViewInfo(){
	fillList('#editRootName','#editParentName');
}

/**
 * 初始化日期插件
 */
function loadDatePlugs(eleId){
	//调用layUI日历插件
	layui.use('laydate',function(){
		var date = layui.laydate;
		var maxDate =  new Date().Format("yyyy-MM-dd hh:mm:ss");
		alert(maxDate);
		date.render({
			elem:eleId,
			theme : 'grid',
			min: '1900-01-01 00:00',//可选最小日期
			max:maxDate, // 可选最大日期
			calendar : 'true', // 设置公历日历
			value : new Date(), // 设置默认值
			btns : [ 'now', 'confirm' ], //设置按钮 右下角显示的按钮，会按照数组顺序排列，内置可识别的值有：clear、now、confirm
			showBottom : true,//隐藏按钮
			format : 'yyyy-MM-dd HH:mm',
			type:'datetime'
		})
	});
}

/**
 * 初始化分类管理页面查询条件
 */
function initQueryCon(){
	var html = getEmptyOptionHtml()+getRootInfo();
	$('#rootSelectedList').empty().append(html);
	$('#parentSelectedList').empty().append(getEmptyOptionHtml());
	$('#childSelectedList').empty().append(getEmptyOptionHtml());
}

/**
 * 分类管理页面查询条件联动
 */
function changeChild(curid){
	if(curid == '#rootSelectedList'){
		changeParentItems();
	}else if(curid == '#parentSelectedList'){
		changeChildItems();
	}
}

/**
 * 根据选中的根分类填充当前根分类已有的子分类
 */
function changeParentItems(){
	var emptyHtml = getEmptyOptionHtml();
	var rootVal = $('#rootSelectedList :selected').val();
	if(rootVal == ''){
		// 父分类和子分类都中设置为请选择
		$('#parentSelectedList,#childSelectedList').empty().append(emptyHtml);
		return;
	}
	var po =getParentSortType(rootVal, '父分类');
	$('#parentSelectedList').empty().append(emptyHtml+po);
	$('#childSelectedList').empty().append(emptyHtml);
}

/**
 * 根据选中的父分类名称查询到对应的子分类,然后填充到子分类列表中
 */
function changeChildItems(){
	var emptyHtml = getEmptyOptionHtml();
	var valParent = $('#parentSelectedList :selected').val();
	if(valParent == ''){
		$('#childSelectedList').empty().append(emptyHtml);
		return;
	}
	var valRoot = $('#rootSelectedList :selected').val();
	//查询分类信息
	$.ajax({
		url:'sort/getSortInfoByRPC.sp',
		data:{rootName:valRoot,parentName:valParent,sortCon:'子分类'},
		type:'POST',
		success:function(resp){
			var childItems = "";
			if(resp.flag){
				$(resp.sortList).each(function(i,v){
					childItems += '<option value=\"'+v.childName+'\">'+v.childName+'</option>'
				});
				$('#childSelectedList').empty().append(emptyHtml+childItems);
//				console.log(childItems);
			}else{
				alert(resp.msg);
			}
		}
	});
	
	
}
function getEmptyOptionHtml() {
	return '<option value=\"\" > - 请选择 - </option>';
}

/**
 * 搜索功能
 */
function querySortInfo(index){
	var key = $('#searchKey').val().trim();
	var pageIndex = !index ? 1 : index;
	searchSortInfoByKey(key,pageIndex);
}

/**
 * 按关键字搜索分类信息
 */
function searchSortInfoByKey(keyStr,index){
	$.ajax({
		url:'sort/querySortInfo.sp',
		data:{
			sortCon:keyStr,
			rootName:$('#rootSelectedList :selected').val(),
			parentName:$('#parentSelectedList :selected').val(),
			childName:$('#childSelectedList :selected').val(),
			start:index
		},
		type:'post',
		success:function(resp){
			if(!resp.flag){
				alert(resp.msg);
				return;
			}
			fillTable(resp.sortList);
			initPageNums(resp.sortPage);
		}
	});
}


/**
 * 将查询到的数据填充到表格中
 */
function fillTable(sortList) {
	//	 console.log(sortList);
	//清空原来的tbody
	$('#sortDataTable').empty();
	//添加新的数据
	var tbodyHtml = "<table id=\"dataTbl\" class=\"table table-hover table-striped table-condensed \"><thead><tr class=\"active\">" +
			"<th style=\"text-align: center;\">序号</th><th>根分类</th><th>父分类</th><th>子分类</th><th>分类描述</th><th>创建时间</th><th>最后修改时间</th></tr></thead><tbody>";
	$.each(sortList, function(index, sort) {
		tbodyHtml = tbodyHtml + "<tr>";
		if (!sort.sortID) {
			tbodyHtml = tbodyHtml
			+ "<td>　</td>"
			+ "<td></td>"
			+ "<td></td>"
			+ "<td></td>"
			+ "<td></td>"
			+ "<td></td>"
			+ "<td></td>"		
		} else {
			tbodyHtml = tbodyHtml
			+ "<td align=\"center\">" + ++index + "</td>"
			+ "<td>" + (typeof (sort.rootName) == "undefined" ? "" : sort.rootName) + "</td>"
			+ "<td>" + (typeof (sort.parentName) == "undefined" ? "" : sort.parentName)+"</td>"
			+ "<td>" + (typeof (sort.childName) == "undefined" ? "" : sort.childName)+"</td>"
			+ "<td>" + (typeof (sort.sortDesc) == "undefined" ? "" : sort.sortDesc)+"</td>"
			+ "<td>" + (typeof (sort.createDate) == "undefined" ? "" : sort.createDate) + "</td>"
			+ "<td>" + (typeof (sort.lastModDate) == "undefined" ? "无" : sort.lastModDate) + "</td>"
			+ "<td class='hide'>" + (typeof (sort.sortID) == "undefined" ? "　" : sort.sortID) + "</td>"
		}
	});
	tbodyHtml = tbodyHtml + "</tbody></table>";
	//	alert(tbodyHtml);
	$('#sortDataTable').empty().append(tbodyHtml);
	initTableAction();
}

/**
 * 初始化分页信息
 */
function initPageNums(sortPage){
	var pageHtml = '';
	/*if(sortPage.curPage != 1){
		pageHtml += '<li><a href="javascript:querySortInfo(1)"><span class="glyphicon glyphicon-fast-backward"></span></a></li>';
		pageHtml += '<li><a href="javascript:querySortInfo('+sortPage.prePage+')"><span class="glyphicon glyphicon-chevron-left"></span></a></li>';
	}else{
		pageHtml += '<li><a><span class="glyphicon glyphicon-fast-backward"></span></a></li>';
		pageHtml += '<li><a><span class="glyphicon glyphicon-chevron-left"></span></a></li>';
	}
	if (sortPage.pageNums.length > 1) {
		$(sortPage.pageNums).each(function(){
			if(sortPage.curPage == this){
				pageHtml += '<li class=\"active\" disable=\"disable\" style=\"color:#cccccc\"><a>'+this+'</a></li>';
			}else{
				pageHtml += '<li><a href="javascript:querySortInfo('+this+')"><b>'+this+'</b></a></li>';
			}
		});
	}
	if(sortPage.curPage != sortPage.totalPages){
		pageHtml += '<li><a href="javascript:querySortInfo('+sortPage.nextPage+')"><span class="glyphicon glyphicon-chevron-right"></span></a></li>';
		pageHtml += '<li><a href="javascript:querySortInfo('+sortPage.prePage+')"><span class="glyphicon glyphicon-fast-forward"></span></a></li>';
	}else{
		pageHtml += '<li><a><span class="glyphicon glyphicon-chevron-right"></span></a></li>';
		pageHtml += '<li><a><span class="glyphicon glyphicon-fast-forward"></span></a></li>';
	}*/
	pageHtml = sortPage.pageHtml;
	$("#pageMsg").empty().append(pageHtml);
	$("#pageCount").empty().append('<label style="padding-left: 15px"> 总数据: <b>'+sortPage.totalItems+'</b> 条 &nbsp;&nbsp;总页数: <b>'+sortPage.totalPages+'</b> 页</label>')
	
}

/**
 * 每次查询后重新为每一行数据加载单击和双击事件
 */
function initTableAction() {
	//添加事件
	var rows = $('#dataTbl tbody').find('tr');
	//	alert(rows.length);
	$.each(rows, function(index, row) {
		$(row).on({
			click : function() {
				saveCurRowData(this);
			},
			dblclick : function() {
				openEditView(this);
			}
		});
	});
}

/**
 * 填充分类
 */
function fillList(r,p){
	//#addRootName','#addParentName
	var rootHtml = getRootInfo();
	//添加到根分类下拉列表
	$(r).empty().append(rootHtml);
	//得到根分类选中项
	var con = r+' :selected'
	var curRoot = $(con).val();
	//从后台得到当前根分类对应的父分类
	var parentHtml = getParentSortType(curRoot,'父分类');
	//添加到父分类下拉列表
	$(p).empty().append(parentHtml);
}

/**
 * 查询所有根分类
 */
function getRootInfo(){
	var rootHtml = '';
	//1 查询父分类
	$.ajax({
		url : 'sort/getAllRootSort.sp',
		type : 'POST',
		async : false,
		success : function(resp) {
			if (resp.flag) {
				$.each(resp.sortList, function() {
					rootHtml = rootHtml + "<option value=\""+this.rootName+"\">" + this.rootName + "</option>";
				});
			} else {
				alert(resp.msg);
			}
		}
	});
	return rootHtml;
}

/**
 * 根据根分类查询该根分类拥有的父分类
 * @param sortName 具体分类名,若无,查询
 * @param sortType
 * @returns {String}
 */
function getParentSortType(rootName){
	var optionHtml ='';
	$.ajax({
		url : 'sort/getSortInfoByRPC.sp',
		type : 'POST',
		data : {rootName:rootName,sortCon:'父分类'},
		async : false,
		success : function(resp) {
			if (resp.flag) {
				$.each(resp.sortList, function() {
					optionHtml = optionHtml + "<option value=\""+this.parentName+"\">" + this.parentName + "</option>";
				});
			} else {
				alert(resp.msg);
				return;
			}
		}
	});
	return optionHtml;
}

/**
 * 填充根分类
 */
function reloadSortCon(sortCon) {
}

/**
 * 保存当前行数据
 * 选中当前行,然后保存当前行数据到成员属性中
 */
function saveCurRowData(row) {
	// 改变当前行颜色
	$(row).css('background', 'blueviolet').siblings().css('background', '');
	// 保存数据到全局变量中
	curRows = row;
//	showCur();
}

/**
 * 打开编辑窗口
 */
function openEditView(row) {
	//	$(row).css('background', 'blue').siblings().css('background', '');
	openSortEdit();
}

/**
 * 打开根(父)分类管理窗口
 */
function openSortMngView(){
	//打开前 查询所有根分类
	querySortTypes('根分类');
	$("#sortMngDialog").modal("show");
}

/**
 * 打开编辑窗口
 * 将当前行数据设置到模态窗口中,然后打开模态窗口
 */
function openSortEdit() {
	if (!curRows) {
		alert('请先选中需要编辑的分类,在进行修改!!');
		return;
	}
	//得到选中行的对象的td数据
	var tdsArr = $(curRows).find('td');

	if (!tdsArr[0].innerHTML.trim()) {
		alert('当前行不存在有效数据,请选择有效行!!');
		return;
	}
	// 设置编号
	$("#editSortId").val(tdsArr[7].innerHTML);
	//得到根分类下拉列表的值
	var rootArr = $('#editRootName').find('option');
	//根据对象值选择默认状态
	var flag = false;
	$.each(rootArr,function(i,v) {
		console.log('选中数据根分类:' + tdsArr[1].innerHTML + ",模态窗口根分类:" + this.value);
		if (tdsArr[1].innerHTML == this.innerHTML) {
			console.log(tdsArr[1].innerHTML == this.value);
//			$("#editRootName option[value='"+this.value+"']").attr("selected", true).siblings().attr("selected", false);
			$(this).attr("selected", true).siblings().attr("selected", false);			
			return false;
		}
	});

	var parentHtml = getParentSortType(tdsArr[1].innerHTML,'父分类');
	$("#editParentName").empty().append(parentHtml);
	
	//得到父分类下拉列表的值 editParentName
	var parentArr = $("#editParentName").find('option')
	//根据对象值选择默认状态
	$(parentArr).each(function() {
		//		console.log('当前模态框获取到的根分类:'+tdsArr[2].innerHTML);
		if (tdsArr[2].innerHTML == $(this).val()) {
			$(this).attr("selected", true).siblings().attr("selected", false);
			return false;
		}
	});

	//回显子分类
	$("#editSortNameText").val(tdsArr[3].innerHTML);
	
	//回显创建时间
	$('#editCreatrTimeText').val(tdsArr[5].innerHTML);
	
	// 回显分类说明
	$("#editSortDescArea").val(tdsArr[4].innerHTML);
	//	$("#").val(tdsArr[4]);
	
	//回显最后修改时间
	$("#editLastTimeText").val(tdsArr[6].innerHTML);
	
	
	//回显数据处理完成,打开模态窗口
	$('#editSortDialog').modal({
		backdrop : 'static',
		keyboard : false
	});
}

/**
 * 新增根分类事件
 * 点击后,隐藏选择框,新增按钮,显示输入框,选择按钮
 * 清空选择框的值
 */
function showRootText() {
	//选择框隐藏,显示输入框
	$('#editRootNameText,#choseRootBtn').removeClass('hidden');
	$('#editRootName,#editRootBtn').addClass('hidden');
	$('#editRootNameText').attr('disabled', false);
	$('#editRootName').attr('disabled', true);
}

//切换选择根分类列表
function showRootSelecte() {
	$('#editRootName,#editRootBtn').removeClass('hidden');
	$('#editRootNameText,#choseRootBtn').addClass('hidden');

	//清空选项
	$('#editRootNameText').attr('disabled', true);
	$('#editRootName').attr('disabled', false);
}

/**
 * 新增父分类事件
 * 点击后,隐藏选择框,新增按钮,显示输入框,选择按钮
 * 清空选择框的值
 */
function showParentText() {
	//选择框隐藏,显示输入框
	$('#editParentNameText,#choseParentBtn').removeClass('hidden');
	$('#editParentName,#editParentBtn').addClass('hidden');

	//清空选项
	$('#editParentNameText').attr('disabled', false).val('');
	$('#editParentName').attr('disabled', true);
}

//切换选择根分类列表
function showParentSelecte() {
	$('#editParentName,#editParentBtn').removeClass('hidden');
	$('#editParentNameText,#choseParentBtn').addClass('hidden');

	//清空选项
	$('#editParentNameText').attr('disabled', true);
	$('#editParentName').attr('disabled', false);
}


//====
/**
 * 新增根分类事件
 * 点击后,隐藏选择框,新增按钮,显示输入框,选择按钮
 * 清空选择框的值
 */
function showAddRootText() {


	//选择框隐藏,显示输入框
	$('#addRootNameText,#choseAddRootBtn').removeClass('hidden');
	$('#addRootName,#addRootBtn').addClass('hidden');

	//清空选项
	$('#addRootNameText').attr('disabled', false).val('');
	$('#addRootName').attr('disabled', true);
}

/**
 * 新增分类窗口中点击根分类后的"选择按钮"的时候触发该方法
 */
function showAddRootSelecte(){
	// 清空选择框,设置为不可选取
	$('#addRootNameText').attr('disabled',false).val('');
	// 显示下拉列表,新增按钮
	$('#addRootName,#addRootBtn').removeClass('hidden');
	// 隐藏根分类输入框,选择按钮
	$('#addRootNameText,#choseAddRootBtn').addClass('hidden');
	
	$('#addRootNameText').attr('disabled',true);
	$('#addRootName').attr('disabled',false);
}



/**
 * 新增父分类事件
 * 点击后,隐藏选择框,新增按钮,显示输入框,选择按钮
 * 清空选择框的值
 */
function showAddParentText() {
	//获取当前根分类选中的值
	var rootSort = $('#addRootName option:selected').val();
//	//后天查询

	//选择框隐藏,显示输入框
	$('#addParentNameText,#choseAddParentBtn').removeClass('hidden');
	$('#addParentName,#addParentBtn').addClass('hidden');

	//清空选项
	$('#addParentNameText').attr('disabled', false).val('');
	$('#addParentName').attr('disabled', true);
}

/**
 * 切换选择根分类列表
 */
function showAddParentSelecte() {
	//切换到父分类下拉列表,清空父分类输入框的内容
	$('#addParentNameText').val('');

	//显示父分类下拉列表,新增父分类按钮
	$('#addParentName,#addParentBtn').removeClass('hidden');
	$('#addParentNameText,#choseAddParentBtn').addClass('hidden');

	//清空选项
	$('#addParentNameText').attr('disabled', true);
	$('#addParentName').attr('disabled', false);
}


/**
 * 还原编辑模态窗口
 */
function revertEditSortDialog() {
	//显示根选择框,新增按钮
	$('#editRootName,#editRootBtn').removeClass('hidden');
	// 隐藏根分类输入框,选择按钮
	$('#editRootNameText,#choseRootBtn').addClass('hidden');

	// 显示父选择框,新增按钮
	$('#editParentName,#editParentBtn').removeClass('hidden');
	// 隐藏父分类输入框,选择按钮
	$('#editParentNameText,#choseParentBtn,#editSortNameMsgBox').addClass('hidden');
	
}

/**
 * 还原新增模态窗口
 */
function revertAddSortDialog() {
	//显示根选择框,新增按钮showAddRootSelecte()
	$('#addRootNameText,#choseAddRootBtn').removeClass('hidden').attr('disabled', false);
	// 隐藏根分类输入框,选择按钮
	$('#addRootName,#addRootBtn').addClass('hidden');

	// 显示父选择框,新增按钮
	$('#addParentNameText,#choseAddParentBtn').removeClass('hidden').attr('disabled', false);
	// 隐藏父分类输入框,选择按钮
	$('#addParentName,#addParentBtn,#sortNameMsgBox').addClass('hidden');

	//清空已有内容
	$('#sortNameText,#sortDescArea').val('');
	$('#createTimeText').empty().val(new Date());
}


function showCur() {
	var tds = $(curRows).find('td');
	$.each(tds, function(i, val) {
		console.log(i + '--' + val.innerHTML);
	})
}

/**
 * 根分类联动事件
 */
function changeRootSort(curObj) {
	var curId = "#"+$(curObj).attr('id'); // #addRootName
	rootSort = $(curId).val();
	if (!rootSort) {
		alert('根分类不合法,请重新选择');
		return;
	}
	var targetID = getTargetID(curId);
	
	if(targetID == ''){
		alert('还未设置目标id');
		return;
	}
	// 让控制器从后台查询满足该分类子分类信息
	var parentHtml = getParentSortType(rootSort,'父分类');
	// 将父分类信息放在指定位置
	$(targetID).empty().append(parentHtml);
}
/**
 * 得到id
 * #addRootName #editRootName
 */
function getTargetID(curId){
	var tID = '';
	if(curId.substring(0,5) == '#edit'){
		tID = '#editParentName';
	}else if(curId.substring(0, 4) == '#add'){
		tID = '#addParentName';
	}
	return tID;
}

/**
 * 填充父分类选项框
 */
function fillParentSelectedBox(sortList,pre) {
	var rootHtml = "";
	for (i in sortList) {
		//		console.log("根分类:"+sortList[i].rootName+",父分类:"+sortList[i].parentName+",子分类:"+sortList[i].childName);
		rootHtml = rootHtml + "<option value=" + sortList[i].parentName + ">" + sortList[i].parentName + "</option>";
	}
	//清除原来的分类
	$('#'+pre+'ParentName').empty().append(rootHtml);
	console.log('#'+pre+'ParentName');
}

/**
 * 保存分类数据
 */
function addSort() {
	// 得到保存的数据
	var rootName = $('#addRootNameText').is(':visible') ? $('#addRootNameText').val() : $('#addRootName').val();
	var parentName = $('#addParentNameText').is(':visible') ? $('#addParentNameText').val() : $('#addParentName').val();
	var childName = $('#sortNameText').val();
	var createDate = $('#creatrTimeText').val();
	var sortDesc = $('#sortDescArea').val();
	console.log("根分类:" + rootName + ",父分类:" + parentName + ",子分类:" +
		childName + ",创建时间:" + createDate + ",分类描述:" + sortDesc);
	// 校验 
	if (!rootName) {
		alert('根分类还未填写,请填写!!');
		return;
	}
	if (!parentName) {
		alert('父分类还未填写,请填写!!');
		return;
	}
	var sortFlag = checSortName('#sortNameText');
	if (!sortFlag) {
		return
	}

	// 校验通过 保存,否则,返回错误信息
	$.ajax({
		url : 'sort/saveSortInfo.sp',
		data : {
			rootName : rootName,
			parentName : parentName,
			childName : childName,
			createDate : createDate,
			sortDesc : sortDesc
		},
		type : 'POST',
		success : function(resp) {
			if (resp.flag) {
				alert(resp.msg);
				querySortInfo($('#pageMsg').find('.active').text());
				$('#addSortDialog').modal('hide');
			} else {
				alert(resp.msg);
				$("#sortNameMsgBox").css({
					'color' : 'red',
					'line-height' : '36px'
				}).empty().append("<span class=\"glyphicon glyphicon-remove\"></span>"+resp.msg);
				return;
			}
		}
	});
}

/**
 * 子分类非空和长度校验
 */
function checSortName(obj) {
	var sortName = $(obj).val();
	var msgBox = obj.substring(0,obj.lastIndexOf("T"))+'MsgBox';
	console.log(obj+"-"+msgBox+'-'+sortName);
	$(msgBox).removeClass('hidden');
	if (!sortName) {
		console.log(msgBox);
		$(msgBox).css({
			'color' : 'red',
			'line-height' : '36px'
		}).empty().append("<span class=\"glyphicon glyphicon-remove\"></span>　子分类不能为空");
		return false;
	} else if (sortName.length < 1 || sortName.length > 10) {
		$(msgBox).css({
			'color' : 'red',
			'line-height' : '36px'
		}).empty().append("<span class=\"glyphicon glyphicon-remove\"></span>　子分类长度不合法");
		return false;
	}else {
		$(msgBox).css({
			'color' : 'green',
			'line-height' : '36px'
		}).empty().append("<span class=\"glyphicon glyphicon-ok\"></span>　分类正确");
		return true;
	}
}

function hideMsgBox(obj) {
	$(obj).addClass('hidden');
}

function updateSort(){
	var sort = new SortBean(
		$('#editSortId').val(),
		$('#editRootName').is(':visible') ?  $('#editRootName :selected').val() : $('#editRootNameText').val(),
		$('#editParentName').is(':visible') ?  $('#editParentName :selected').val() : $('#editParentNameText').val(),
		$('#editSortNameText').val(),
		$('#editSortDescArea').val(),
		$('#editCreatrTimeText').val(),
		$('#editLastTimeText').val(),
		$('#editUserId').val()
	);
	// 校验 
	if (!sort.rootName) {
		alert('根分类还未填写,请填写!!');
		return;
	}
	if (!sort.parentName) {
		alert('父分类还未填写,请填写!!');
		return;
	}
	var sortFlag = checSortName('#editSortNameText');
	if (!sortFlag) {
		alert('分类名称存在错误,请检查!!');
		return;
	}
	
	//校验通过,提交给后台,根据后台反馈结果进行处理
	$.ajax({
		url:'sort/updateSortInfo.sp',
		data:sort,
		type:'POST',
		success:function(resp){
			if(resp.flag){
				alert('更新成功!!');
				$('#editSortDialog').modal('hide');
				querySortInfo($('#pageMsg').find('.active').text());
			}else{
				alert(resp.msg);
			}
		}
	});
}

/**
 * 删除分类信息
 */
function delSortInfo(){
	if(typeof(curRows) == 'undefined'){
		alert('请先选中需要删除的分类信息,再进行操作!!!');
		return;
	}
	var sortID = $(curRows).find('td')[7].innerHTML;
	if (sortID == "　") {
		alert('当前行不存在数据,本次操作无效!!!');
		return;
	}
	if(confirm("确定要删除本条数据?")){
		$.ajax({
			url:"sort/delSortInfo.sp",
			type:"POST",
			data:{sortID:sortID},
			success:function(resp){
				if(resp.flag){
					querySortInfo($('#pageMsg').find('.active').text());
				}else{
					alert(resp.msg);
				}
			}
		});
	}
}

/**
 * 打开导出分类信息
 */
function openExportView(){
	//回显数据处理完成,打开模态窗口
	$('#exportSortDialog').modal({
		backdrop : 'static',
		keyboard : false
	});
}


function exportSortInfo(type){
	var pageNum;
	if(type == 1){
		pageNum = $('#index').html();
	}
	if(type == 2){
		pageNum = "";
	}
	location.href="sort/exportSortInfo.sp?pageNum="+pageNum;
	$('#exportSortDialog').modal('hide');
	
}

/**
 * 打开分类统计窗口
 */
function openCountView(){
	//查询到每个分类的分类信息
	$.ajax({
		url:"sort/countSortItems.sp",
		type:"POST",
		success:function(resp){
			//塞进模态窗口
			if(resp.flag){
				var html = "<h4>" +
						"<label class=\"btn btn-link\" onclick=\"querySortItems('根分类')\">" +
						"<b>"+resp.list.rootItems+"</b></label>条根分类," +
						"<label class=\"btn btn-link\" onclick=\"querySortItems('父分类')\">" +
						"<b>"+resp.list.parentItems+"</b></label>条父分类," +
						"<label class=\"btn btn-link\" onclick=\"querySortItems('子分类')\">" +
						"<b>"+resp.list.childItems+"</b></label>条子分类" +
								"</h4>";
				$("#countSortMsg").empty().append(html);
				//默认显示有多少条根分类
				querySortItems('根分类');
				//打开模态窗口
				$('#countSortDialog').modal({
					backdrop : 'static',
					keyboard : false
				});
			}else{
				alert(resp.msg)
			}
		}
	});
}

/**
 * 分类信息统计
 * 
 */
function querySortItems(sortName){
	$.ajax({
		url:"sort/getSortItemsByRPC.sp",
		data:{sortType:sortName},
		type:'POST',
		success:function(resp){
			if(resp.flag){//{"flag":true,"msg":"","sortList":[{"sortType":"借还款"},{"sortType":"收入"},{"sortType":"消费"}]}
				var tblHead =[
					{field: 'id', title: '编号', sort: true,align:'center', fixed: 'left',unresize:true},
					{field: 'sortName', title: sortName+'名称',align:'center',unresize:true}
				];
				var tblDatas = [];
				for(var key in resp.sortList){
					tblDatas.push({'id':parseInt(key)+1,sortName:resp.sortList[key].sortType})
				}
				console.log()
				$("#sortInfoTable").empty();
				initTable("sortInfoTable",tblDatas,tblHead);
				return;
				//更新于2019年1月26日晚上
				//优化了显示,表头固定 ---- 开始
				
				//定义固定表头
				var html = "<table class=\"table table-bordered table-striped table-condensed fixedhead\" id=\"fixedhead\"><thead><tr>" +
						"<th>编号</th><th>"+sortName+"名称</th></tr></thead></table>";
				//写入到指定元素中
				$("#sortItemCountEle").html(html);
				
				// --- 表头处理完毕
				// --- 开始写数据
				
				html ="<table class=\"table table-bordered table-hover table-striped table-condensed \" id=\"sortInfoTable\"><thead><tr>" +
					"<th>编号</th><th>"+sortName+"名称</th></tr></thead><tbody>";
				for(var key in resp.sortList){
					var num = parseInt(key)+1;
					html += "<tr>" +
							"<td>"+ num +"</td>" + //编号
							"<td>"+resp.sortList[key].sortType+"</td>" + //分类名称
							"</tr>"
				}
				html +=	"</tbody></table>";
				// 追加到指定元素中
				$("#sortItemCountEle").append(html);
				
				// 设置宽度
				var targetObj = $('#sortInfoTable');
				console.log(targetObj.width());
				$('#fixedhead,#sortInfoTable').css('width','450px');
				//优化了显示,表头固定 ---- 结束
				/*
				 * 旧代码
				 * if(sortName == '父分类'){
					html = html + "<thead><tr><th>编 号</th><th>父分类名称</th></tr></thead><tbody>";
				}else if(sortName == '子分类'){
					html = html + "<thead><tr><th>编 号</th><th>子分类名称</th></tr></thead><tbody>";
				}else{
					html = html + "<thead><tr><th>编 号</th><th>根分类名称</th></tr></thead><tbody>";
				}
				for(var i in resp.sortList){
					html += "<tr>";
					var n = i;
					html = html + "<td>"+ ++n +"</td>";
					if(sortName == '父分类'){
						html = html + "<td>"+resp.sortList[i].sortType+"</td>";
					}else if(sortName == '子分类'){
						html = html + "<td>"+resp.sortList[i].sortType+"</td>";
					}else{
						html = html + "<td>"+resp.sortList[i].sortType+"</td>";
					}
					html = html + "</tr>";
				}
				html = html + "</tbody>";
				$("#sortInfoTable").empty().append(html);*/
			}else{
				alert(resp.msg)
			}
		}
	});
}

function initSearchText(){
	$('#searchKey').val(null);
}

/**
 * 初始化表格
 * dataArr 数据对象 格式: [{属性名1:属性值1},{属性名2:属性值2},{属性名3:属性值3},...,{属性名n:属性值n}]<br>
 * colArr 列名对象 格式:[{field: '属性名', title: '列名', sort: 是否排序,unresize:是否可拖动},...]
 */
function initTable(eleId,dataArr,colArr){
	var cols = [colArr];
	eleId = eleId.indexOf("#") == -1 ? '#'+eleId : eleId;
	layui.use('table',function(){
		var table = layui.table;
		table.render({
			elem:eleId,
			height:'375',
//			width:,
			data:dataArr,
			page:dataArr.length < 200 ? false : true,
			limit:200,
			cols:cols,
			even:true
		});
	});
}


function querySortTypes(sortType){
	$.ajax({
		url:'sort/queSortCount.sp',
		data:{sortType:sortType},
		type:'post',
		success:function(resp){
			console.log(resp);
			if(resp.flag){
				loadSortMngData(resp.list);
			}
		}
	});
}

/**
 * 根/父分类管理
 */
/*function loadSortMngData(mapList){
	if(!isEmptyObj(mapList)){
//		fillSortMngViewTbl(dataList);
		var datas = mapList.list;
		var tblHtml = '';
		var i = 0;
		if (mapList['sortType'] == '根分类') {
			tblHtml += "<table class=\"table table-bordered  table-condensed table-striped\"><tr class=\"active\">" +
					"<th>序号</th><th>根分类</th><th>父分类数目(个)</th><th>操作</th></tr>";
			for ( var key in datas) {
				i++;
				tblHtml += "<tr>" +
						"<td>"+i+"</td>" +
						"<td>"+datas[key].rname+"</td>" +
						"<td>"+datas[key].items+"</td>" +
						"<td><button class=\"btn btn-info btn-sm\" onclick=\"editThis(this,"+i+")\"><span class=\"glyphicon glyphicon-pencil\"></span> 编 辑</button></td>" +
						"</tr>";
//				console.log(key+":"+datas[key].rname);
			}
		} else if(mapList['sortType'] == '父分类'){
			tblHtml += "<table class=\"table table-bordered  table-condensed table-striped\"><tr class=\"active\">" +
				"<th>序号</th><th>父分类</th><th>子分类数目(个)</th><th>所属根分类</th><th>操作</th></tr>";
			for ( var key in datas) {
				i++;
				tblHtml += "<tr>" +
						"<td>"+i+"</td>" +
						"<td>"+datas[key].pname+"</td>" +
						"<td>"+datas[key].items+"</td>" +
						"<td>"+datas[key].rname+"</td>" +
						"<td><button class=\"btn btn-info btn-sm\" onclick=\"editThis(this,"+i+")\"><span class=\"glyphicon glyphicon-pencil\"></span> 编 辑</button></td>" +
						"</tr>";
		//		console.log(key+":"+datas[key].rname);
			}
		}
		tblHtml += "</table>"
		$("#sortMngTbl").empty().append(tblHtml);
	}
}*/
function loadSortMngData(mapList){
	if(!isEmptyObj(mapList)){
		var datas = mapList.list;
		var tbBody = '';
		var tbHead="<table id=\"smTblHead\" class=\"table table-bordered  table-condensed table-striped fixedhead\"><thead></thead>";
				
		var i = 0;
		if (mapList['sortType'] == '根分类') {
			tbHead += "<tr><td>1</td><td>借还款</td><td>8</td><td><button class=\"btn btn-info btn-sm\"\><span class=\"glyphicon glyphicon-pencil\"></span> 编 辑</button></td></tr>";
			tbBody ="<table id=\"smTblBody\" class=\"table table-bordered  table-condensed table-striped\">" +
					"<thead><tr class=\"active\">" +
					"<th>序号</th><th>根分类</th><th>父分类数目(个)</th><th>操作</th></tr></thead><tbody>";
			for ( var key in datas) {
				i++;
				tbBody += "<tr>" +
						"<td>"+i+"</td>" +
						"<td>"+datas[key].rname+"</td>" +
						"<td>"+datas[key].items+"</td>" +
						"<td><button class=\"btn btn-info btn-sm\" onclick=\"editThis(this,"+i+")\"><span class=\"glyphicon glyphicon-pencil\"></span> 编 辑</button></td>" +
						"</tr>";
			}
		} else if(mapList['sortType'] == '父分类'){
			tbHead += "<tr><td>7</td><td>医疗健康</td><td>2</td><td>消费</td><td><button class=\"btn btn-info btn-sm\"><span class=\"glyphicon glyphicon-pencil\"></span> 编 辑</button></td></tr></table>";
			tbBody = "<table id=\"smTblBody\" class=\"table table-bordered  table-condensed table-striped\"><thead>" +
					"<tr class=\"active\">" +
					"<th>序号</th>" +
					"<th>父分类</th>" +
					"<th>子分类数目(个)</th>" +
					"<th>所属根分类</th>" +
					"<th>操作</th>" +
					"</tr></thead><tbody>";
			for ( var key in datas) {
				i++;
				tbBody += "<tr>" +
						"<td>"+i+"</td>" +
						"<td>"+datas[key].pname+"</td>" +
						"<td>"+datas[key].items+"</td>" +
						"<td>"+datas[key].rname+"</td>" +
//						"<td onclick=\"editThis(this,"+i+")\">编 辑</td>" +
						"<td><button class=\"btn btn-info btn-sm\" onclick=\"editThis(this,"+i+")\"><span class=\"glyphicon glyphicon-pencil\"></span> 编 辑</button></td>" +
						"</tr>";
			}
		}
		tbBody += "</tbody></table>"
		$("#sortMngTbl").empty().append(tbHead+tbBody)
		$("#smTblHead thead").append($("#smTblBody thead").html());
//		$('#smTblHead').find('th').each(function(){
//			console.log( $(this).index());
//		    $(this).width($('#smTblBody').find('th:eq(' + $(this).index() + ')').width());
//		});
//		console.log($("#sortMngTbl").width());
		$("#smTblHead,#smTblBody").width('421px');
		$("#smTblHead tbody td").css("visibility","hidden");
	}
}

//判断对象是否为空
function isEmptyObj(obj) {   
　　for (var key in obj){
　　　　return false;//返回false，不为空对象
　　}　　
　　return true;//返回true，为空对象
}

var orgHtml;
var orgSortName;
var len = 0;
function editThis(obj,rowNum){
    len = $("#sortMngTbl input").length;
	if(len > 0){
		alert("编辑过程中不允许进行其他操作!")
		return;
	}
	// 根据当前按钮事件得到当前行
	var tds = $(obj).parent().parent().find('td');
	// 得到需要修改的分类名称
	var sortName= tds[1].innerHTML;
	orgSortName = sortName;
	// 清空当前单元格
	$(tds[1]).empty().append("<input name=\"sortName"+rowNum+"\" type=\"text\" maxlength=\"10\" class=\"form-control\" value=\""+sortName+"\"/>");
	$(tds[1]).children().css({"text-align":"center","width":"100px","margin":"0 auto"}).focus().select();
	
	//参数当前按钮,新增确定按钮
	orgHtml = $(obj).parent().html();
	var newHtml = "<button class=\"btn btn-primary btn-sm\" onclick=\"subThis(this,"+rowNum+")\"><span class=\"glyphicon glyphicon-ok\"></span> 确 定</button>";
	$(obj).parent().empty().append(newHtml);
	

}

function subThis(obj,rowNum){
	var tds = $(obj).parent().parent().find('td')[1];
	var sortName = $(tds).children().val();
	var orgName = orgSortName;
	
	if(sortName.length>0){
		var sortType = $("#mngMenu .active").text();
		//传入后台进行修改
		if(orgName != sortName){
			$.ajax({
				url:"sort/editSortMng.sp",
				data:{
					newSortName:sortName,
					oldSortName:orgName,
					sortType:sortType
				},
				type:"post",
				success:function(resp){
					if(resp.flag){
						alert(resp.msg);
						initSortPage();
						$(tds).empty().append(sortName);
						$(obj).parent().empty().append(orgHtml);
						len = $("#sortMngTbl input").length;
					}
				}
			});
		}else{
			$(tds).empty().append(sortName);
			$(obj).parent().empty().append(orgHtml);
			len = $("#sortMngTbl input").length;
		}
	}
	
}


/**
 * 分类信息实体类对象
 */
function SortBean(sortID,rootName,parentName,childName,sortDesc,createDate,lastModDate,userID){
	this.sortID = sortID;
	this.rootName = rootName;
	this.parentName = parentName;
	this.childName = childName;
	this.sortDesc = sortDesc;
	this.createDate = createDate;
	this.lastModDate = lastModDate;
	this.userID = userID;
	this.showInfo = function(){
		return this.sortID+"\n"+
			this.rootName+"\n"+
			this.parentName+"\n"+
			this.childName+"\n"+
			this.sortDesc+"\n"+
			this.createDate+"\n"+
			this.lastModDate;
	}
}