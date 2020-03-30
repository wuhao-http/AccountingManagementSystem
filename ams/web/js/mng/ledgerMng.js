/**
 * 账目管理js
 */

var curRows; //用来记录当前行数据
var mark; //计时器标志
var dataList; //用来记录当前查询出来的数据

/**
 * 首加载方法
 */
$(function() {

	if (!$('#userID').html()) {
		alert("登录信息已过期,请重新登录!!");
		location.href = getRootPath + "index.jsp";
		return;
	}

	/*$('#startDate').bind('input propertychange',function(){
		alert("AAA");
	});*/

	// 初始化日期参数控件
	initDateCon();
	// 加载查询条件
	loadQueryCon();
	// 加载账目数据
	loadLedgerData();


	// 打开添加账目窗口前做的事情
	$('#addLedger').on('show.bs.modal', function() {
		loadViewCon('#addLedger');
	});
	
});

function processMoeny(money){
	money = parseFloat(money);
	money+='';
	if(money.indexOf(".")== -1){
		money += ".00";
	}else{
		var moneyArr = money.split(".");
		if(moneyArr[1].length == 1){
			moneyArr[1] += "0";
		}else if(moneyArr[1].length > 2){
			moneyArr[1] = moneyArr[1].substring(0,2);
		}
		money = moneyArr[0]+"."+moneyArr[1];
	}
	return money;
}



/**
 * 初始化日期参数控件
 */
function initDateCon() {
	//初始化起止日期
	var curDate = new Date();
	var month = curDate.getMonth() + 1;
	month = month < 10 ? "0" + month : month;
	var startDate = (curDate.getFullYear()) + '-' + month + '-' + '01';
	var endDate = curDate.Format('yyyy-MM-dd');
	laydate.render({
		elem : '#startDate', //绑定元素id
		theme : 'grid', //设置主题
		min : '1900-01-01', //可选最小日期
		max : endDate, // 可选最大日期
		trigger: 'click',
		calendar : 'true', // 设置公历日历
		value : startDate, // 设置默认值
		btns : [ 'now', 'confirm' ], //按钮
		showBottom : true, //隐藏按钮
		done : function(value, dateObj) {
			var endDateHtml = "<input type=\"text\" id=\"endDate\" class=\"form-control cal len\" readonly=\"readonly\" style=\"width: 120px;\">";
			//得到父亲
			var parent = $('#endDate').parent();
			//删除自己
			$('#endDate').remove();
			//父亲添加自己
			$(parent).append(endDateHtml);
			//			console.log(value);
			laydate.render({
				elem : '#endDate', //绑定元素id
				theme : 'grid', //设置主题
				min : value, //可选最小日期
				max : endDate, // 可选最大日期
				calendar : 'true', // 设置公历日历
				trigger: 'click',
				value : endDate, // 设置默认值
				btns : [ 'now', 'confirm' ], //按钮
				showBottom : true //隐藏按钮
			});
		}
	});
	initDate('endDate', endDate, startDate, endDate);
}

/**
 * 加载查询条件
 */
function loadQueryCon() {
	// 得到根分类html
	var rootOptinHtml = getEmptyOptionHtml() + getRootInfo();
	// 填充到查询框中
	$('#rootSelect').empty().append(rootOptinHtml);
	$('#parentSelect,#childSelect').empty().append(getEmptyOptionHtml());
}

/**
 * 加载查询数据
 */
function loadLedgerData() {
	queryLedgerInfo();
}

/**
 * 打开窗口
 */
function loadViewCon(viewID) {
	var prefix = "";
	if (viewID == "#addLedger") {
		prefix = "#add";
	} else if (viewID == "#editLedger") {
		prefix = "#edit";
	} else {
		prefix = "#";
	}
	//加载分类选择
	$(prefix + "RootSelect").empty().append(getRootInfo());
	if (viewID == "#addLedger") 
		defaultSelected("#addRootSelect", "消费");
	$(prefix + "ParentSelect").empty().append(getParentSortType($(prefix + "RootSelect :selected").val()));
	if (viewID == "#addLedger")
		defaultSelected("#addParentSelect", "餐饮开支");
	//根据根分类定义金额颜色和字体
	if (prefix != "#") {
		loadAmountColor(prefix);
	}
	// 查询子分类 填充到子分类下拉列表
	changeChilds(prefix);
	if (viewID == "#addLedger") {
		defaultSelected("#addChildSelect", "三餐支出");
		var addHtml = "<input type=\"text\" id=\"addDateText\" name=\"creDate\" class=\"form-control\"" +
				" style=\"font-weight: bolder;\">";
		$('#addDateBox').html(addHtml)
		laydate.render({
			elem : '#addDateText', //绑定元素id
			theme : 'grid', //设置主题
			calendar : 'true', // 设置公历日历
			min : '1900-01-01 00:00:00',
			max : new Date().Format("yyyy-MM-dd hh:mm:ss"),
			value : new Date().Format("yyyy-MM-dd hh:mm"), // 设置默认值
            trigger: 'click',
			btns : [ 'now', 'confirm' ], //设置按钮 右下角显示的按钮，会按照数组顺序排列，内置可识别的值有：clear、now、confirm
			showBottom : true, //隐藏按钮
			format : 'yyyy-MM-dd HH:mm',
			type : 'datetime',
		});
	}
}

/**
 * 根据根分类类型加载添加和编辑窗口的金额字体颜色
 */
function loadAmountColor(prefix) { //#add
	var amountID = prefix + "AmountText";
	var rootVal = $(prefix + "RootSelect :selected").val();
	// 得到父分类 然后把它的所有input框都设置为粗体
	var parent = $(amountID).parent().parent().parent()[0];
	$(parent).find(".form-control").css("font-weight", "bolder");
	//	console.log($(parent).find(".form-control"));

	//默认颜色
	$(amountID).css("color", "#333333");
	if (rootVal == "收入") {
		$(amountID).css({
			"font-weight" : "bolder",
			"color" : "#36C700"
		});
		if (prefix == "#add") {
			$("#addPayMethodText").val("转入");
		}
	}
	if (rootVal == "消费" || rootVal == "支出" || rootVal == "开销") {
		$(amountID).css({
			"font-weight" : "bolder",
			"color" : "#FF6F02"
		});
		if (prefix == "#add") {
			$("#addPayMethodText").val("支付");
		}
	}
	if (rootVal == "借贷" || rootVal == "借还款" || rootVal == "信贷") {
		$(amountID).css({
			"font-weight" : "bolder",
			"color" : "#808000"
		});
	}
}

/**
 * 下拉列表默认值选中
 */
function defaultSelected(selectID, selecteVal) {
	var options = $(selectID).find('option');
	var tmpVal;
	$.each(options, function(i, v) {
		tmpVal = $(v).val();
		if (tmpVal == selecteVal) {
			$(v).attr({
				'selected' : true
			}).siblings().attr('selected', false);
			//			console.log(tmpVal+"=="+selecteVal)
			return false; //匹配成功后跳出循环
		}
	});
}


/**
 * 父分类随根分类联动
 */
function changeParent(selId) {
	var prefix = '';
	if (selId == '#addRootSelect') {
		prefix = '#add';
	} else if (selId == '#editRootSelect') {
		prefix = '#edit';
	} else {
		prefix = '#';
	}
	var rootID = "";
	var parentID = "";
	var childID = "";
	// 自动定位当前选择的是哪个窗口
	if (prefix == "#") {
		rootID = "#rootSelect";
		parentID = "#parentSelect"
		childID = "#childSelect";
	} else {
		rootID = prefix + "RootSelect";
		parentID = prefix + "ParentSelect"
		childID = prefix + "ChildSelect";
		loadAmountColor(prefix);
	}
	var rootVal = $(rootID + ' :selected').val();
	if (!rootVal && prefix == "#") {
		var tem = parentID + ',' + childID;
		$(tem).empty().append(getEmptyOptionHtml());
		return;
	}
	var parentHtml = prefix == "#" ? getEmptyOptionHtml() + getParentSortType(rootVal, '父分类') : getParentSortType(rootVal, '父分类');
	$(parentID).empty().append(parentHtml);
	changeChilds(prefix);
}

/**
 * 子分类随父分类联动
 */
function changeChilds(prefix, chdVal) {
	/**
	 * 子分类联动改进版
	 */
	prefix = !prefix ? "#" : prefix;
	var flag = prefix == "#";
	var parentVal = $(flag ? prefix + 'parentSelect :selected' : prefix + 'ParentSelect :selected').val();
	if (!parentVal) {
		$(flag ? prefix + 'childSelect' : prefix + 'ChildSelect').empty().append(getEmptyOptionHtml());
		return;
	}
	var rootVal = $(flag ? prefix + 'rootSelect :selected' : prefix + 'RootSelect :selected').val();
	//查询分类信息
	$.ajax({
		url : 'sort/getSortInfoByRPC.sp',
		data : {
			rootName : rootVal,
			parentName : parentVal,
			sortCon : '子分类'
		},
		type : 'POST',
		success : function(resp) {
			var childItems = "";
			if (resp.flag) {
				$(resp.sortList).each(
					function(i, v) {
						childItems += '<option value=\"' + v.childName
							+ '\">' + v.childName + '</option>'
					});
				$(flag ? prefix + 'childSelect' : prefix + 'ChildSelect').empty().append(flag ? getEmptyOptionHtml() + childItems : childItems);
				if (prefix == "#edit" && typeof (chdVal) != "undefined") {
					defaultSelected("#editChildSelect", chdVal);
				}
			} else
				alert(resp.msg);
		}
	});
}

/**
 * queryLedgerInfo
 */
var start = 1;
function queryLedgerInfo(index) {
	// 得到查询条件
	var starDate = $('#startDate').val();
	var endDate = $('#endDate').val();
	var rootName = $('#rootSelect :selected').val();
	var parentName = $('#parentSelect :selected').val();
	var childName = $('#childSelect :selected').val();
	var ledgerKey = $('#searchKey').val();
	if (index) {
		start = index;
	}
	$.ajax({
		url : "ledger/queryLedgerInfo.sp",
		type : "post",
		data : {
			'creDate' : starDate,
			'lastModDate' : endDate,
			'sort.rootName' : rootName,
			'sort.parentName' : parentName,
			'sort.childName' : childName,
			'ledgerKey' : ledgerKey,
			'start' : start
		},
		success : function(resp) {
			if (!resp.flag) {
				alert(resp.msg);
				return;
			}
			//清空成员变量
			curRows = undefined;
			//填充表格
			fillLedgerData(resp.ledgerList);
			//填充分页信息
			$('#ledgerPage').empty().append(resp.ledPageInfo.pageHtml);
			//填充页码信息
			var page = resp.ledPageInfo;
			var pageNums = "当前第 <b style=\"color: #0C77CF;font-size: 16px\">" +
				page.curPage + "</b> 页,共 <b style=\"color: #0C77CF;font-size: 16px\">" +
				page.totalPages + "</b> 页,共 <b style=\"color: #0C77CF;font-size: 16px\">" +
				page.totalItems + "</b> 条数据";
			$('#pageMesg').empty().append(pageNums);

			rockLedgeShow();
		}
	});
}

/**
 * 填充待滚动消息
 */
function rockLedgeShow() {
	$.ajax({
		url : "ledger/countLedgerMoney.sp",
		type : "post",
		dataType : 'json',
		data : {
			'creDate' : $('#startDate').val(),
			'lastModDate' : $('#endDate').val(),
			'sort.rootName' : $('#rootSelect :selected').val(),
			'sort.parentName' : $('#parentSelect :selected').val(),
			'sort.childName' : $('#childSelect :selected').val(),
			'ledgerKey' : $('#searchKey').val()
		},
		success : function(resp) {
			resp = eval(resp);
			dataList = resp;
//			console.log(dataList);
			var curRoot = "";
			var curRootMoney = "";
			var curParent = "";
			var curParentMoney = "";
			var head = "※当前查询账目信息分析- "
			var temp = "";
			var color = "";
			$.each(resp.rootAmount, function(key, rootMoney) { //第一层循环
				curRoot = key;
				curRootMoney = rootMoney;
				if (curRoot == '收入') {
					color = "#36C700";
				} else if (curRoot == '消费') {
					color = "#FF6F02";
				} else if (curRoot == '借贷') {
					color = "#FFDB03";
				} else if (curRoot == '账户') {
					color = "#590092";
				} else {
					color = "#808000";
				}
				temp += "<span style=\"color:" + color + ";font-size:16px\">" + curRoot + "</span>总金额<span style=\"color:" + color + "\"> ¥ " + curRootMoney + "</span>元,其中( ";
				$.each(resp.parentAmount, function(i, p) {
					var tempMoneyMap = p;
					if (curRoot == i) {
						$.each(tempMoneyMap, function(i, v) {
							curParent = i;
							curParentMoney = v;
							temp += "<span style=\"color:" + color + "\">" + curParent + " ¥ " + curParentMoney + "</span>元,";
						});
						if (temp.lastIndexOf(',')) {
							temp = temp.substring(0, temp.length - 1);
						}
					}
				});
				temp += " ); "
			});
			//			console.log(temp)

			if (temp == '') {
				$("#scroll_begin").empty().append(head);
				$("#scroll_end").html('');
			} else {
				$("#scroll_begin").empty().append(head + temp);
				$("#scroll_end").html('');
			}
			//检查计时器是否已打开,如果已打开,就停掉
			ScrollImgLeft();
		}
	});
}

/**
 * 将按条件筛选得到的数据添加到表格中
 * 20190806
 */
function fillLedgerData(ledgerList) {
	var thead = "<tr class=\"active\">" +
        "<td style=\"text-align: center;width:100px;\">序号</td>" +
        "<td style=\"text-align: center;width:271px;\">账单信息</td>" +
        "<td style=\"lext-align: left;width:450px\">补充说明</td>" +
        "<td>最后修改时间</td>" +
        "<td class=\"hide\">账目编号</td>" +
        "</tr>";

	/*var tableHtml = "<table id=\"dataTable\" class=\"table table-hover table-striped table-condensed table-bordered\">" +
		"<tr class=\"active\">" +
		"<td style=\"text-align: center;width:100px;\">序号</td>" +
		"<td style=\"text-align: center;width:260px;\">账单信息</td>" +
		"<td style=\"lext-align: left;width:450px\">补充说明</td>" +
		"<td style='width:125px'>最后修改时间</td>" +
		"<td class=\"hide\">账目编号</td>" +
		"</tr>";*/
	var tableHtml = "";
	var preAll = (start - 1) * 10;
	var isEmpty = true,m = 0;
	$.each(ledgerList, function(i, ledger) {
		if (!ledger) {
			tableHtml += "<tr style='height:68px'><td colspan='8'>　</td></tr>";
		} else {
			//20190805
			var type = ledger.sort.rootName;
			tableHtml += "<tr>";
			tableHtml += "<td align='center' width='100px' class='y-center'><div class='ledger-list-sty' style='width:100%;height:56px;line-height:56px'>" + (preAll + i + 1) + "</div></td>" //序号
			tableHtml += "<td width='260px'><div class='ledger-list-sty'> <table width='100%'> <tr> <td class='ledName'>"+ledger.ledgerName+"</td> " + "<td class='amount' >¥ <span style='color:"+setEleColor(type)+"';>"+
				processMoeny(ledger.amount)+"</span></td> </tr> <tr> <td class='ledType' colspan='2' style='color:"+setEleColor(type)+"';>"+
				ledger.sort.rootName+"."+ledger.sort.parentName+"."+ledger.sort.childName+"</td> </tr> <tr> <td class='ledTime' width='140'>"+
				ledger.creDate+"</td> <td class='payType' >"+
				(!ledger.settlleMethod ? "其他" : ledger.settlleMethod)+"</td> </tr> </table> </div></td>" ;//账目信息
			tableHtml += "<td class='y-center' style='text-align:left;width: 450px;' title='"+ledger.ledgerDesc+"'><div class='ledger-list-sty' style='width:100%;height:56px;overflow: auto;'>" +ledger.ledgerDesc+ "</div></td>";
			tableHtml += "<td class='y-center'><div class='ledger-list-sty' style='width:100%;height:56px;line-height:56px'>"+ (!ledger.lastModDate ? "" : ledger.lastModDate) + "</div></td>";
			tableHtml += "<td class='hide' ledgerId='"+ledger.ledgerID+"'>" + ledger.ledgerID + "</td></tr>";
			tableHtml += "</tr>"; 
		}
	});
	// tableHtml += "</table>";
	// $('#ledgerTable').empty().append(tableHtml);
	// $('#ledgerTable').find(".active").find('td').css({
	// 	'font-weight' : 'bolder',
	// 	'background' : '#cccccc',
	// 	'border-bottom' : '#f3f3f3 3px groove '
	// });
    $("#thead").empty().append(thead).find('td').css({
		'background-color':'#67b73396',
		'border-right':'2px white solid',
		'font-weight':'bolder',
		'font-size':'14px'
	});
    $("#dataTable").empty().append(tableHtml);
	//加载单击和双击事件
	/* 给表格的每一行注入单击事件 */
	$('#dataTable>tbody>tr').click(function() {
		$(this).css('background', '#d4ab4b70').siblings().css('background', '');
		if ($(this).find('td')[0].innerHTML != "　") {
			curRows = this;
		} else {
			curRows = undefined;
		}
	});
	$('tbody tr').dblclick(function() {
		editLedger();
	});
}

/**
 * 添加账目
 */
function AddLedgerSubmit() {
	var ledgerIngo = $("#addLedger form").serialize();
	if (!$("#addLedgerText").val()) {
		alert("账目名称还未填写!!");
		return;
	}
	if ($("#addLedgerText").val().length > 20) {
		alert("账目名称长度不能超过20个字符或10个汉字!!");
		return;
	}
	if ($("#addAmountText").val() == '0.00' || $("#addAmountText").val() == '0') {
		if (!confirm("账目金额为初始金额( 0.00 元),是否继续提交?")) {
			return;
		}
	} else if (!/^\d+(\.\d+)?$/.test($("#addAmountText").val())) {
		alert("金额不合法,请检查!!");
		return;
	}
	var curPage = $('#ledgerPage').find('.active').text();
	$.ajax({
		url : "ledger/addLedgerInfo.sp",
		data : ledgerIngo,
		type : "post",
		success : function(resp) {
			if (!resp.flag) {
				alert(resp.msg);
				return;
			}
			alert(resp.msg);
			$('#addLedger').modal("hide");
			clearAddLedgerView();
			queryLedgerInfo(curPage);
		}
	});

}

/**
 * 提交编辑账目
 */
function editLedgerSubmit() {
	var checkLedgerNameRes = checkName("#edit");
	var checkAmountRes = checkAmount("#edit");
	if (!checkLedgerNameRes[0]) {
		alert(checkLedgerNameRes[1]);
		return;
	} else if (!checkAmountRes[0]) {
		alert(checkAmountRes[1]);
		return;
	} else if (checkAmountRes[0] == 'warm') {
		if (!confirm("警告!\n当前账目信息金额值为 0.00 元,确定使用此金额?")) {
			return;
		}
	} else {
		var tdArr = $(curRows).find('td');
		//校验数据是否发生变化
		if (
			$('#editRootSelect').val() == tdArr[2].innerHTML &&
			$('#editParentSelect').val() == tdArr[3].innerHTML &&
			$('#editChildSelect').val() == tdArr[4].innerHTML &&
			$('#editLedgerText').val() == tdArr[1].innerHTML &&
			$('#editAmountText').val() == tdArr[5].innerHTML &&
			$('#editSettlleMethodText').val() == tdArr[6].innerHTML &&
			$('#editLedgerArea').val() == tdArr[7].innerHTML
		) {
			alert("当前账目信息未进行修改,不需要提交!");
			return;
		}
	}
	//保存账目信息
	var editForm = $('#editLedger form').serialize();
	$.ajax({
		url : 'ledger/editLedgerInfo.sp',
		type : 'post',
		data : editForm,
		success : function(resp) {
			if (!resp.flag) alert(resp.msg);
			alert(resp.msg);
			//重新加载数据
			queryLedgerInfo($('#ledgerPage').find('.active').text());
			//关闭模态窗口 
			$('#editLedger').modal('hide');
		}
	});
}

/** 删除账目 */
function delLedger() {
	if (typeof (curRows) == 'undefined') {
		alert("请先选中需要删除的账目在进行操作!");
		return;
	}
	var ledgerID = $($(curRows).find('td.hide')[0]).attr('ledgerid');
	if (typeof (ledgerID) == 'undefined') {
		alert("当前行存在无效的数据,请重新选择!");
		return;
	}
	if (confirm("确定要删除该条账目!")) {
		$.post('ledger/delLedgerInfo.sp', {
			ledgerID : ledgerID
		}, function(resp) {
			if (!resp.flag) {
				alert(resp.msg);
				return;
			}
			alert(resp.msg);
			//重新加载数据
			curRows = undefined;
			queryLedgerInfo($('#ledgerPage').find('.active').text());
		});
	} else {
		return;
	}

}

/**
 * 导出账目信息
 */
function exportLedgerInfo(con) {
	var index = con != 'curPage' ? null : $('#ledgerPage').find('.active').text();
	var startDate = $('#startDate').val();
	var endDate = $('#endDate').val();
	var rootName = $('#rootSelect :selected').val() == '' ? null : $('#rootSelect :selected').val();
	var parentName = $('#parentSelect :selected').val() == '' ? null : $('#parentSelect :selected').val();
	var childName = $('#childSelect :selected').val() == '' ? null : $('#childSelect :selected').val();

	postCall('ledger/exportLedger.sp', {
		start : index,
		creDate : startDate,
		lastModDate : endDate,
		'sort.rootName' : rootName,
		'sort.parentName' : parentName,
		'sort.childName' : childName
	});

}
;

function clearSearchKey() {
	$('#searchKey').val(null);
}

/**
 * 还原打开窗口至第一次加载状态
 */
function clearAddLedgerView() {
	loadViewCon("#addLedger");
	$("#addLedgerText").val("");
	$("#addAmountText").val("0.00");
	$.each($("#addPayMethodText").find("optoin"), function(i, v) {
		if ($(v).val() == "支付宝支付") {
			$(v).attr("selected", true).siblings().attr("selected", false);
		}
	});
	$("#addDateText").val(new Date());
	$("#addLedgerDescArea").val("");
	$("#addAmountMsg,#addLedgerMsg").addClass("hide");
}


/**
 * 打开编辑账目视图
 */
function editLedger() {
	if (typeof (curRows) == 'undefined') {
		alert("请先选中数据在进行操作!!");
		return;
	}
	
	// 得到当前行数据
	
	/* 将colArr数据填充到模态窗口中 */
	$('#ledgerId').val($(curRows).find('td.hide')[0].innerHTML);

	//加载当前根分类和父分类
	$('#editRootSelect').empty().append(getRootInfo());
	//默认选中项
	// var sortArr = colArr[3].firstElementChild.innerHTML.split("."); // 0 根分类 1 父分类 2 子分类
	
	//20190806
	// 得到当前行中账目信息
	var type = $(curRows).find('table').find('td.ledType')[0].innerHTML;
	type = type.split('.');
	//
	defaultSelected("#editRootSelect", type[0]);

	//根据根分类查询子分类
	$("#editParentSelect").empty().append(getParentSortType($("#editRootSelect :selected").val()));
	//默认选中项
	defaultSelected("#editParentSelect", type[1]);

	//查询当前子分类 
	changeChilds("#edit", type[2]);
	loadAmountColor("#edit");

	//默认选回显子分类
	//	defaultSelected("#editChildSelect", sortArr[2]);

	/* 设置账目名称 */
	$('#editLedgerText').val($(curRows).find('table').find('td.ledName')[0].innerHTML);

	/* 设置金额 */
	$('#editAmountText').val(replaceAll($(curRows).find('table').find('td span')[0].innerHTML, "　", ""));

	/*设置结算类型*/
	$('#editSettlleMethodText').val($(curRows).find('table').find('td.payType')[0].innerHTML);

	/* 设置创建时间 */
	$('#editStartDate').val($(curRows).find('table').find('td.ledTime')[0].innerHTML);

	/* 设置最后修改时间 */
	$('#editEndDate').val($($(curRows).find('>td')[3]).find('div').html());

	/* 设置账目说明 */
	$('#editLedgerArea').val($($(curRows).find('>td')[2]).find('div').html());

	/* 显示编辑模态窗口 */
	$('#editLedger').modal("show");
}

/**
 * 打开账目分析窗口
 * 20190708更新
 */
function openLedgerAnalysisView() {
	//加载标签卡
	var tabs = "<li class=\"active\"  onclick=\"ledgerAnalysis('总览')\"><a data-toggle=\"tab\"><strong>总览</strong></a></li>";
	//得到主分类标签卡
	var tabArr = dataList.rootAmount;
		console.log(tabArr)
	$.each(dataList.rootAmount, function(i, v) {
		tabs += "<li onclick=\"ledgerAnalysis('" + i + "')\"><a data-toggle=\"tab\"><strong>" + i + "</strong></a></li>";
	});
	//加载筛选项
	$('#analysisUl').html(tabs);
	//加载很分类查询数据
	ledgerAnalysis('总览');
	$('#ledgerAnalysis').modal('show');
}

/**
 * 将yyyy-MM-dd日期转换为"yyyy年MM月dd日"
 * @param ymdStr
 */
function formatDate(ymdStr) {
	var ymdDate = new Date(ymdStr);
	var year = ymdDate.getYear() + 1900;
	var month = (ymdDate.getMonth() + 1);
	var day = ymdDate.getDate();
	//	console.log(day.length);
	return year + '年' + month + '月' + day + '日';
}

/**
 * 分析账目数据
 * @param obj
 */
function ledgerAnalysis(strCon) {
	/**
	 * 思路:
	 * 当strCon=总览的时候,
	 * 列表: 显示总分类数据,点击的时候显示详细信息
	 * 饼图: 内饼显示按根分类统计,外饼显示按父分类统计
	 */
	var list;
	var ledgerCon = strCon;
	if (strCon == "总览") { //内层根分类,外层二级分类
		list = dataList["rootAmount"];
	} else {//内层二级分类,外层三级分类
		list = dataList["parentAmount"][ledgerCon];
	}

	var amount = 0.0;
	var tbHtml = "<table id='countTbl' class=\"table table-hover table-condensed table-bordered\"><thead><tr class=\"active\">" +
			"<th> 账目名称 </th><th> 金 额 (¥) </th>"+(ledgerCon=='总览'?'':'<th>操 作</th>')+"</tr></thead><tbody>";
	$.each(list, function(td1, td2) {
		tbHtml += "<tr class=\"parentStyle\">" +
				"<td>" + td1 + "</td><td>" + processMoeny(td2)+"</td>" +
				(ledgerCon == '总览' ? "":"<td><a isHiden=\"no\" onclick=\"fiterThis(this)\" class=\"btn btn-xs btn-link\">隐藏</a></td></tr>");
		amount += parseFloat(td2);
	});
	if (ledgerCon == '总览') {
		tbHtml += "</tbody></table>"
	} else {
		tbHtml += "<tr style=\"color:#ff4300;font-weight:bolder;\"><td> 共 计 </td><td colspan=\"2\">" + processMoeny(amount.toFixed(2)) + "元</td></tr>"
		tbHtml += "</tbody></table>"
	}
	tbHtml += "</tbody></table>";
	$("#moneyRiskWarm").html(tbHtml);
	$("#moneyRiskWarmLabel span").html(ledgerCon + " ");
	//给表格的行添加元素
	$("#moneyRiskWarm tbody>tr").each(function(i,v){
		// v 是当前行
		var td0 = $(v).find('td')[0];
		var td1 = $(v).find("td")[1];
		//给第一列和第二列绑定鼠标点击和进入事件
		$(td0).on({
			click:function(){
				if (td0.innerHTML != ' 共 计 ' ) {
					getChildMoneyItem($(td0).html());
					$('#queCurSortChild').modal();
				}
			},
			mouseenter:function(){
				if (td0.innerHTML != ' 共 计 ') {
					$(v).attr("title", "点击查看 [ " + (ledgerCon == '总览' ? '' : ledgerCon + " · ") + (td0.innerHTML) + " ] 分类详细信息");
				}
			}
		});
		$(td1).on({
			click:function(){
				if (td0.innerHTML != ' 共 计 ' ) {
					getChildMoneyItem($(td0).html());
					$('#queCurSortChild').modal();
				}
			},
			mouseenter:function(){
				if (td0.innerHTML != ' 共 计 ') {
					$(v).attr("title", "点击查看 [ " + (ledgerCon == '总览' ? '' : ledgerCon + " · ") + (td0.innerHTML) + " ] 分类详细信息");
				}
			}
		});
	 })
	 
	 //创建图片
	 createLedgerAmountImg('dynamicImg', dataList, ledgerCon);
	 return;
}

/**
 * 筛选统计金额
 */
function fiterThis(obj){
	// 得到当前按钮属性
	if($(obj).html() == '隐藏'){
//		点击隐藏,将当前行添加中划线,改变按钮为显示,同时属性改为yes
		$(obj).html('显示').attr('isHiden','yes').parent().prev().css('text-decoration','line-through');
	}else{
//		点击显示,将金额中划线,改变按钮为隐藏,同时属性改为no
		$(obj).html('隐藏').attr('isHiden','no').parent().prev().css('text-decoration','none');
	}
	// 重新统计不是隐藏属性的行数金额
	var rows = $(obj).parent().parent().parent().find('tr:last').siblings();
	// 遍历每一行
	var allMoney = 0.0;
	$.each(rows,function(i,tr){
		var condition = $(tr).find('td:eq(2)>a').attr('isHiden');
		if(condition=='no'){
			console.log($(tr).find('td:eq(1)').html());
			allMoney += parseFloat($(tr).find('td:eq(1)').html());
		}
	});
	$(obj).parent().parent().parent().find('tr:last td:last').html(processMoeny(allMoney));
}

function createLedgerAmountImg(targetID, resp, led) {
	var curArr;
	var nextArr;
	var itemArr = [];
	var headItem = [];
	var mainItem = [];
	
	// 根据当前的分类决定下级分类
	if(led == '总览'){
		curArr = resp['rootAmount'];
		nextArr = resp['parentAmount'];
	}else{
		curArr = resp['parentAmount'][led];
		nextArr = resp['childAmount'][led];
	}
	
	//遍历根条目数据
	$.each(curArr,function(i,v){
		itemArr.push(i);
		headItem.push(new DataMap(i, v));
	});
	//遍历父条目数据
	$.each(nextArr,function(i){
		$.each(nextArr[i],function(j,v){
			itemArr.push(j);
			mainItem.push(new DataMap(j, v));
		});
	});
	
	/**
	 * 2019年2月27日改进版,点击可以显示下一级金额统计信息,参考表格
	 */
	var option = initOption(itemArr,headItem,led+" 金额信息统计");
	var myChart = echarts.init(document.getElementById(targetID));
	myChart.setOption(option);
	$('#'+targetID).attr('title','点击任意饼块查看下一级');
//	$('#'+targetID).css('display','block');
//	$('#'+targetID+'2').css('display','none');
	myChart.on('click',function(params){
		//获得当前选择的根分类
		var parent = params.name;
		var root = $("#analysisUl .active").text()
		//根据条件找从集合找到需要的数据
		var datas;
		if(root == '总览'){
			datas = dataList['parentAmount'][parent];
		}else{
			datas = dataList['childAmount'][root][parent];
		}
		if(!datas){
//			alert('当前没有数据')
			myChart.setOption(option);
			return;
		}
//		console.log(datas);
		var label = [];
		var data = [];
		$.each(datas,function(i,v){
			label.push(i);
			data.push(new DataMap(i, v));
		});
//		$('#'+targetID).css('display','none');
//		$('#'+targetID+2).css('display','block');
		var option2 = initOption(label, data, (root == '总览' ? '':root+'·') + parent + ' 金额信息统计');
		myChart.setOption(option2);
		$('#'+targetID).attr('title','点击任意饼块返回上一级');
	});
	
	return;
}
/**
 * 初始化饼图配置
 * @itemArr 配置可折叠标题,格式:['条目1',...,'条目n']
 * @dataArr 配置需要处理的数据,格式:[{name:数据名1,value:数据值1},...,{name:数据名n,value:数据值n}]
 * @title	配置饼图的标题
 */
function initOption(itemArr,dataArr,title){
	var option = {
			title : {
				text: title,
				x:'center'
			},
			tooltip : {
				trigger : 'item',
				formatter : '{b} ¥:{c}元({d}%)'
			},
			legend : {
//				orient: 'vertical',
				type : 'scroll',
				bottom : 0,
				x : 'left',
				data : itemArr //条目数组
			},
			series : [
				{
					type : 'pie',
					radius : [ '1%', '60%' ],
					label : {
						normal : {
							formatter : '{b|{b}} ¥ {c}元 {per|{d}%}',
							backgroundColor : '#eee',
							borderColor : '#aaa',
							borderWidth : 1,
							borderRadius : 4,
							shadowBlur : 3,
							shadowOffsetX : 2,
							shadowOffsetY : 2,
							shadowColor : '#999',
							padding : [ 0, 3 ],
							rich : {
								hr : {
									borderColor : '#aaa',
									width : '100%',
									borderWidth : 0.5,
									height : 0
								},
								b : {
									fontSize : 16,
									lineHeight : 33
								},
								per : {
									color : '#eee',
									backgroundColor : '#334455',
									padding : [ 2, 4 ],
									borderRadius : 2
								}
							}
						}
					},
					data : dataArr //数据对象集合 格式 [{name=数据名称;value=值}]
				}
			]
		};
	return option;
}

function initMoneyRiskWarm(smpLedList, con) {
	var allMoney = 0;
	var tableHtml = "<table  class=\"table table-condensed table-striped table-bordered\">" +
		"<thead><tr class=\"active\"><th> 账目名称 </th><th> 金 额 (¥) </th></tr></thead><tbody>";
	for (var i in smpLedList) {
		tableHtml += "<tr class=\"parentStyle\"><td>" + smpLedList[i].name + "</td><td>" + smpLedList[i].value + "</td></tr>";
		allMoney += smpLedList[i].value;
	}
	/*for(var i in allLedList){
		tableHtml += "<tr><td>"+allLedList[i].name+"</td><td>"+allLedList[i].value+"</td></tr>";
	}*/
	if (con == '') {
		tableHtml += "</tbody></table>"
	} else {
		tableHtml += "<tr style=\"color:#ff4300;font-weight:bolder;\"><td> 共 计 </td><td>" + allMoney.toFixed(2) + "元</td></tr>"
		tableHtml += "</tbody></table>"
	}
	$("#moneyRiskWarm").html(tableHtml);
	var mark = '';
	$("#moneyRiskWarm tbody>tr").on({
		mouseenter : function() {
			var sort = $(this).find('td')[0].innerHTML;
			var title = '点击查 [ ' + (con == '' ? '' : con + ' · ') + sort + ' ] 分类详细统计';
			if (sort != ' 共 计 ') {
				$(this).attr('title', title);
			}
		},
		mouseout : function() {
			clearTimeout(mark);
		},
		click : function() {
			var sort = $(this).find('td')[0].innerHTML;
			if (sort != ' 共 计 ') {
				getChildMoneyItem(this);
				$('#queCurSortChild').modal();
			}
		//				console.log($(curRow).find('td'));
		/*	if(lastTd.find('td')[0].innerHTML != ' 共 计 '){
//				$('#queCurSortChild').modal();
				getChildMoneyItem(curRow);
			}*/
		}
	});
}

/**
 * 账目分析-查看下一级分类信息统计
 * update 20190708
 */
function getChildMoneyItem(obj) {
	
	// 获取当前查询条件
	var curParent = $("#analysisUl .active").text();
	var creDate = $("#startDate").val();
	var endDate = $("#endDate").val();
	var con = $('#searchKey').val();
	var rootName,parentName;
	if (curParent == "总览") {
		rootName = obj;
		parentName = "";
	}else{
		rootName = curParent;
		parentName = obj;
	}
	
	$.ajax({
		url : "ledger/detailCountLedMoney.sp",
		type : "post",
		data : {
			"sort.rootName" : rootName,
			"sort.parentName" : parentName,
			"sort.sortCon":con,
			"creDate" : creDate,
			"lastModDate" : endDate
		},
		dataType : "text",
		success : function(resp) {
			$(obj).attr("title", resp);
			var tds = (resp).split(",");
			var tblHtml = "<table class=\"table table-condensed table-striped table-bordered\">" +
				"<thead><tr class=\"active\">" +
				"<th> 账目名称 </th><th> 金 额 (¥) </th><td>操 作</td</tr></thead><tbody>";
			var money = 0.0;
			$(tds).each(function(i, v) { //虚拟开销 ¥ 47.55 元
				var amount = v.substring(v.indexOf("¥") + 1, v.indexOf("元"));
				//				console.log(name+":"+amount.trim());
				amount = $.trim(amount);
				tblHtml += "<tr><td>" + v.substring(0, v.indexOf("¥") - 1) + "</td>";
				tblHtml += "<td>" + amount + "</td><td><a isHiden=\"no\" onclick=\"fiterThis(this)\" class=\"btn btn-xs btn-link\">隐藏</a></td></tr>";
				money += parseFloat(amount);
			});
			
//			tds = curParent + (curThis == "" ? "" : ".") + curThis;
			tds = curParent+ (parentName == "" ? "" : ".") + parentName;
			tblHtml += "<tr style=\"color:red;font-weight:bolder\"><td>" + tds + "共计 (¥)</td><td colspan=\"2\">" + processMoeny(money) + " 元</td></tr></tbody></table>";
			$("#ledDetail").html(tblHtml);
			$("#queCurSortChildLabel span").html(tds).css({
				"font-weight" : "bolder",
				"color" : "#cfd6d5"
			});
		}
	});

}


/**
 * 图片方式查看
 */
function showStyle(sty) {
	//显示饼状视图,
	if (sty == 'img') {
		$("#imgBtn,#imgView").removeClass("hide");
		$("#tblBtn,#tblView").addClass("hide");
		$("#moneyRiskWarmLabel").css("display", "none");
	}
	if (sty == 'tbl') {
		$("#imgBtn,#imgView").addClass("hide");
		$("#tblBtn,#tblView").removeClass("hide");
		$("#moneyRiskWarmLabel").css("display", "block");
	}

}

/**
 * 初始化查询条件
 * add in 2019年1月25日
 */
function initQueCon() {
	loadQueryCon();
	clearSearchKey();
}

//判断对象是否为空
function isEmptyObject(obj) {
	for (var key in obj) {
		return false; //返回false，不为空对象
	}
	return true; //返回true，为空对象
}

function DataMap(name, value) {
	this.name = name;
	this.value = value;
}

/**
 * 动态校验
 */
function checkAmount(viewPrefix) {
	var curAmountID = viewPrefix + 'AmountText';
	var curAmountMsgID = viewPrefix + 'AmountMsg';

	$(curAmountMsgID).removeClass('hide');
	var amount = $(curAmountID).val();
	if (!/^\d+(\.\d+)?$/.test(amount)) {
		$(curAmountMsgID).css("color", "red").empty().append("<span class=\"glyphicon glyphicon-remove\"></span> <b>金额不合法</b>");
		return [ false, '金额不合法!' ];
	} else if (amount == "0.00" || amount == "0.0" || amount == "0") {
		$(curAmountMsgID).css("color", "#f1c232").empty().append("<span class=\"glyphicon glyphicon-alert\"></span> <b><small>金额未设置</small></b>");
		return [ 'warm', '金额未设置!' ];
	} else {
		$(curAmountMsgID).css("color", "green").empty().append("<span class=\"glyphicon glyphicon-ok\"></span> <b>正 确</b>");
		return [ true, '通过!' ];
	}
}
function checkName(viewPrefix) {
	var curNameID = viewPrefix + "LedgerText";
	var curNameMsgID = viewPrefix + "LedgerMsg";
	var ledgerName = $(curNameID).val();
	$(curNameMsgID).removeClass('hide');
	if (!ledgerName) {
		$(curNameMsgID).css("color", "red").empty().append("<span class=\"glyphicon glyphicon-remove\"></span> <b>不能为空</b>");
		return [ false, "账目名称不能为空!" ];
	} else if (ledgerName.length > 20) {
		$(curNameMsgID).css("color", "red").empty().append("<span class=\"glyphicon glyphicon-remove\"></span> <b>字数过长</b>");
		return [ false, "账目名称长度过长!" ];
		;
	} else {
		$(curNameMsgID).css("color", "green").empty().append("<span class=\"glyphicon glyphicon-ok\"></span> <b>正 确</b>");
		return [ true, "正确!" ];
		;
	}
}
function hideMsg(lid) {
	var msgID = lid.substring(0, lid.lastIndexOf('Text')) + "Msg";
	$(lid).select();
	$(msgID).addClass('hide');
}

/**
 * 文字滚动
 */
function ScrollImgLeft() {
	//定义滚动速度
	var speed = 40;
	//找到元素
	var scroll_begin = document.getElementById("scroll_begin");
	var scroll_end = document.getElementById("scroll_end");
	var scroll_div = document.getElementById("scroll_div");
	//将scroll_begin的内容添加到scroll_end中
	var content = scroll_div.innerHTML;
	// 得到scroll_div的内容以及字体和大小
	var fontName = window.getComputedStyle(scroll_div).fontFamily;
	var fontSize = window.getComputedStyle(scroll_div).fontSize;
	var eleStr = $(scroll_div).text();
	var contentLen = getEleLen(eleStr, fontSize, fontName)
	//	alert(eleStr);
	//	console.log("当前内容宽度:"+contentLen+",标签实际宽度:"+scroll_div.offsetWidth);
	//当前内容宽度:679,标签实际宽度:600
	scroll_end.innerHTML = scroll_begin.innerHTML;
	if (contentLen < scroll_div.offsetWidth) {
		scroll_end.innerHTML = "";
	}

	function Marquee() {
		if (scroll_end.offsetWidth - scroll_div.scrollLeft <= 0)
			scroll_div.scrollLeft -= scroll_begin.offsetWidth;
		else
			scroll_div.scrollLeft++;
	}
	if (mark) {
		clearInterval(mark);
		mark = setInterval(Marquee, speed);
	} else {
		mark = setInterval(Marquee, speed);
	}
	scroll_div.onmouseover = function() {
		clearInterval(mark);
	}
	scroll_div.onmouseout = function() {
		mark = setInterval(Marquee, speed);
	}
}

function getEleLen(eleStr, fontSize, fontName) {
	if (!eleStr) var eleStr = '';
	if (!fontSize) var fontSize = '12px';
	else
		fontSize = fontSize + 'px';
	if (!fontName) var fontName = '宋体';

	var span = document.createElement("span");
	var len = span.offsetWidth;
	span.style.fontSize = fontSize;
	span.style.fontFamily = fontName;
	span.style.display = 'inline-block';
	span.innerHTML = eleStr;
	document.body.appendChild(span);
	len = parseInt(window.getComputedStyle(span).width) - len;
	//	console.log("当前滚动标内容宽度:"+len);
	document.body.removeChild(span);
	return len;
}

//导出表格数据到excel
//添加于2019年5月3日
function exportTable(tblID){
	var tblOrg = $('#'+tblID).find('table')[0];
	var tblNew = processTbl(tblOrg);
	if(!tblNew){
		alert('没有可以下载的账目数据,数据不存在或者已经被过滤掉');
		return;
	}
	//将字符串表格转换成table元素
	if(typeof (tblNew) == 'string'){
		var tbl = document.createElement('div');
		tbl.innerHTML = tblNew;
		tblNew = tbl.firstElementChild;
		tbl = null;
	}
	//判断浏览器类型选择下载方式
    var fileName = $('#').is(':hidden') ? $('#moneyRiskWarmLabel>label').innerText :
        $('#queCurSortChildLabel>span').innerText;
	var browser = getBrowserType();
	if(browser == 'IE'){
		alert("IE浏览器仅提供查看功能,如需下载,推荐使用Chrome浏览器");
		return;
	}else{
		// 使用outerHTML属性获取整个table元素的HTML代码（包括<table>标签），然后包装成一个完整的HTML文档，设置charset为urf-8以防止中文乱码
        var html = "<html><head><meta charset='utf-8' />"+
        	+"</head><body>" + tblNew.outerHTML + "</body></html>";
        // 实例化一个Blob对象，其构造函数的第一个参数是包含文件内容的数组，第二个参数是包含文件类型属性的对象
        var blob = new Blob([html], { type: "application/vnd.ms-excel"});
        // 利用URL.createObjectURL()方法为a元素生成blob URL
        location.href = URL.createObjectURL(blob);
	}
}

//IE浏览器导出Excel
function tableExportToExcelForIE(tableid, filename) {
	try {
		var curTbl = document.getElementById(tableid);
		var oXL;
		try {
			oXL = new ActiveXObject("Excel.Application"); //创建AX对象excel  
		} catch (e) {
			alert("无法启动Excel!\n\n如果您确信您的电脑中已经安装了Excel，" + "那么请调整IE的安全级别。\n\n具体操作：\n\n" +"工具 → Internet选项 → 安全 → 自定义级别 → 对没有标记为安全的ActiveX进行初始化和脚本运行 → 启用");
			return false;
		}
		var oWB = oXL.Workbooks.Add(); //获取workbook对象  
		var oSheet = oWB.ActiveSheet; //激活当前sheet  
		var sel = document.body.createTextRange();
		sel.moveToElementText(curTbl); //把表格中的内容移到TextRange中  
		try {
			sel.select(); //全选TextRange中内容  
		} catch (e1) {
			e1.description
		}
		sel.execCommand("Copy"); //复制TextRange中内容  
		oSheet.Paste(); //粘贴到活动的EXCEL中  
		oXL.Visible = true; //设置excel可见属性  
		var fname = oXL.Application.GetSaveAsFilename(filename + ".xls", "Excel Spreadsheets (*.xls), *.xls");
		oWB.SaveAs(fname);
		oWB.Close();
		oXL.Quit();

	} catch (e) {
		alert(e.description);
	}
}

/**
 * 处理表格数据
 * @param tblNode
 * @return 处理后的表格字符串形式
 */
function processTbl(tblNode){
	var tag = $('#analysisUl').find('.active')[0];
	tag = $(tag).find('strong')[0].innerHTML;
    var trs = tblNode.rows;
    if(trs.length < 2){
        return;
    }
    var tbl;
    var fileName;
	if($('#queCurSortChild').is(':hidden') && tag == '总览'){
		fileName = "总览 账目分析";
		tbl = "<table id=\"exptTbl\" border=\"1\"> <caption>"+fileName+"</caption> " +
			"<tr><th> 账目名称 </th><th> 金 额 (¥) </th></tr>";
		$.each(trs,function(i,v){
			if(i==0) return true;
			tbl+= "<tr><td>"+v.cells[0].innerHTML+"</td><td>"+v.cells[1].innerHTML+"</td></tr>"
		});
		tbl+="</table>";
	}else{
		fileName = $('#queCurSortChild').is(':hidden') && tag != '总览' ? $('#moneyRiskWarmLabel').text():
			$('#queCurSortChildLabel>span').text() +"账目分析";
		tbl = "<table id=\"exptTbl\" border=\"1\"> <caption>"+fileName+"</caption> " +
			"<tr><th> 账目名称 </th><th colspan=\"2\"> 金 额 (¥) </th></tr>";
		var tr = "";
        //遍历行数 得到需要的行数
        $.each(trs,function(i,v){
        	if(i==0 || i == (trs.length - 1))return true;
        	//判断当前行是不是隐藏的属性
			var tds = v.cells;
			if($(tds[2]).find('a').attr('isHiden') != 'yes'){
                tr += "<tr><td>"+tds[0].innerHTML+"</td><td colspan=\"2\">"+tds[1].innerHTML+"</td></tr>";
			}
		});
        if(!tr){
        	return;
		}
		tbl = tbl + tr + trs[trs.length-1].innerHTML+ "</table>";
	}
	return tbl;
}

//20190806 根据账单类型定义元素显示颜色
function setEleColor(type){
	if(type == '消费' || type == '支出'){
		return 'orangered';
	}
	if(type == '收入'){
		return 'green';
	}
	if(type == '提现' || type == '兑换'){
		return 'royalblue';
	}
	if(type == '信贷' || type == '借贷' || type == '贷还款'){
		return 'olivedrab';
	}
	return 'white';
}

