/**
 * 账目报表主页js
 * 
 * 进入该页面后,
 * 根据当前用户,找到该用户的报表菜单,然后加载到菜单视图中
 */ 
var menuNameArr=[];//用于存放所有报表的名称,便于后期维护,和跳转到指定的查询报表的方法和查询参数修改
var curRisk;
var curPage;
$(function(){
	//从会话域中得到用户ID
	if(!uid){
		alert('用户登陆信息已过期,即将跳转到登陆页面');
		toLoginPage();
		return;
	}
	initRiskMenu();
	initRiskQueCon();
	riskAdapter("#menu .layui-this>a");
	
	
})

/**
 * 初始化报表菜单
 */
function initRiskMenu(){
	//从后台得到用户菜单{root={menu1={child1,child2,child...,childn},menu2={child1,child2,child...,childn}}}
	var menuMap = getUesrRiskWarmMenu(uid);
	//处理菜单
	var allMenu = menuMap['menuMap'];
	var menuHtml = "";
	$.each(allMenu,function(parentMenu,childMenu){//{menu1={child1,child2,child...,childn},menu2={child1,child2,child...,childn}}
		menuHtml += "<li class=\"layui-nav-item layui-nav-itemd\"><a href=\"javascript:;\">"+parentMenu+"</a><dl class=\"layui-nav-child\">";
		var menuArr = allMenu[parentMenu];//{child1,child2,child...,childn}
		$.each(menuArr,function(i,menu){//nemu 是对象,包含报表菜单基本信息
			menuHtml += "<dd><a data-url=\""+menu["url"]+"\" onclick=\"riskAdapter(this)\">"+menu["childName"]+"</a></dd>";
			menuNameArr.push(menu["childName"]);
		});
		menuHtml+="</dl></li>";
	});
	$('#menu>ul').html(menuHtml);
	//默认展开第一个一级分类然后默认选中展开相中的第一个二级分类
	$('#menu>ul>li:first').addClass('layui-nav-itemed').find('dd:first').addClass("layui-this");
	// 加载菜单效果
	layui.use('element',function(){});
}

/**
 * 初始化查询条件
 */
function initRiskQueCon(){
	//加载日期控件
	loadDatePulg();
	
	//加载分类
	$.ajax({
		url:'report/getMoneyCon.sp',
		data:{userid:uid},
		type:'post',
		success:function(list){
			var moneyConItem = "<option value=\"全部\">全部</option>";
			$.each(list,function(i,obj){
				moneyConItem += "<option value="+obj.rootName+">"+obj.rootName+"</option>"
			})
			$("#amountType").html(moneyConItem);
		}
	}); 
	
	//监听金额条件
	$('#amountCon').on({
		'change':function(){
			var con = $('#amountCon :selected').val();
			if(con == 'ALL'){
				$(this).nextAll().addClass('hide');
			}else{
				$(this).next().removeClass('hide').next().removeClass('hide');
				if( con == '位于'){
					$('#amountCon').parent().find('span').removeClass('hide');
					$('#minAmount').attr('placeholder','最小金额');
				}else if( con =='小于' || con == '小于等于'){
					$('#amountCon').parent().find('span').addClass('hide');
					$('#minAmount').attr('placeholder','最大金额');
				}else if(con == "等于" || con == "不等于"){
					$('#amountCon').parent().find('span').addClass('hide');
					$('#minAmount').attr('placeholder','指定金额');
				}else{
					$('#amountCon').parent().find('span').addClass('hide');
					$('#minAmount').attr('placeholder','最小金额');
				}
			}
			
			
		}
	});
	//绑定查询时间
	$('#queryRisk').click(function(){
		queryRisk(1);
	});
	
	//绑定事件
	var tar = $('#riskPage .layui-input');
	if(tar){
		tar.focus(function(){
			$(this).select();
		});
	}
}

/**
 * 打开指定的报表
 */
function riskAdapter(aEle){
	var riskName = $(aEle).html();
	curRisk = $(aEle).attr('data-url');
	
	// 开始处理,匹配数据库报表是否存在
	var isExist = false;
	$.each(menuNameArr,function(i,v){
		if(v == riskName){
			isExist = true;
			return false;//跳出循环
		}
	});
	if(!isExist){
		alert("数据库匹未配到对应报表,请联系管理员")
		return;
	}
//	alert("数据库匹配到对应报表,即将执行对应方法")
	
//	执行一次查询
	queryRisk(1);
}


/**
 * 从数据库得到菜单
 */
function getUesrRiskWarmMenu(uid){
	var map = {};
	$.ajax({
		url:"report/getUesrRiskWarmMenu.sp",
		type: "post",
		dataType : 'json',
		data: "userid="+uid,
		async:false,
		success: function(resp){
			map = resp;
		}
	});
	return map;
}

/**
 * 初始化查询日期
 * 默认查询日期
 * 如果本月当前号天数小于15天,则查询上个月的今天--今天,否则本月1号--今天
 */
function loadDatePulg(){
	var date = new Date();
	var startDate,endDate;
//	date.setDate(16);
	if(date.getDate() <= 15){
		endDate = date.Format("yyyy-MM-dd");
		date.setMonth(date.getMonth()-1)
		startDate = date.Format("yyyy-MM-dd");
	}else{
		endDate = date.Format("yyyy-MM-dd");
		startDate = date.Format("yyyy-MM")+"-01"
	}
	$("#startDate").attr("value",startDate);
	$("#endDate").attr("value",endDate);
	layui.use('laydate',function(){
		var layStart = layui.laydate;
		var layEnd= layui.laydate;
		var layStatus = true;
		layStart.render({
			elem:'#startDate',
			theme : 'grid', //设置主题
			min: '1970-01-01',//可选最小日期
			max: endDate, // 可选最大日期
			calendar : 'true', // 设置公历日历
			value : startDate, // 设置默认值
			showBottom:false,
			done: function(value){
				layStatus = false;
				var $endDate = $('#endDate');
				var html = $endDate.prop('outerHTML');
				var xdNode = $endDate.prev();
				$endDate.remove();
				$(xdNode).after(html);
				layEnd.render({
					elem:'#endDate',
					theme : 'grid', //设置主题
					min: value,//可选最小日期
					max: endDate, // 可选最大日期
					calendar : 'true', // 设置公历日历
					value : endDate, // 设置默认值
					showBottom:false,
				});
			}
		});
		if(layStatus){
			layEnd.render({
				elem:'#endDate',
				theme : 'grid', //设置主题
				min: startDate,//可选最小日期
				max: endDate, // 可选最大日期
				calendar : 'true', // 设置公历日历
				value : endDate, // 设置默认值
				showBottom:false,
			})
		}
	})
}

/**
 * 查询方法
 * 本方法要坐的事情就是
 * 1 确定当前要查询的是哪一个报表
 * 2 查询的是当前报表的第几页
 */
function queryRisk(index){
	this.curPage = $("#riskPage .layui-laypage-curr>em:last").html();
	if(!this.curPage){
		this.curPage = index;
	}
	//开始从参数中获得方法名
	var funName = curRisk.substring(curRisk.lastIndexOf("/")+1,curRisk.lastIndexOf("."));
	var riskFun = funName + "('"+curRisk+"',"+this.curPage+")";
	
	console.log("当前报表:"+riskFun+",页码:"+this.curPage)
	eval(riskFun);
}

/**
 * 每日账单明细
 */
function dailyLedgerInfo(url,curPage){
	//查询条件不要修改
	
	// 获取参数
	var queCons = getQueCon(curPage);
	$.ajax({
		url:url,
		type:'POST',
		dataType:'json',
		data: "queCons="+JSON.stringify(queCons),
		success:function(resp){
			loadRiskTable(resp);
			loadPageInfo(resp.allItem,curPage);
		}
	});
}

function loadRiskTable(riskMap){
	//获取后台传来的列名 {日期,收入,消费,...,收益}
	var colNameArr = riskMap.riskColName;
	var datas = riskMap.riskMap; //"riskMap":[{"收入":"4560.56","消费":"992.95","账簿日期":"2019-02-01"}]}
	
	//初始化列名对象
	var collArr = [];
	$.each(colNameArr,function(i,v){
		if(v == '账簿日期'){
			collArr.push({
				field:v,
				title:v,
				align:'center',
				sort:true,
				fixed: 'left'
			})
		}else{
			collArr.push({
				field:v,
				title:v,
				align:'center',
				sort:true
			})
		}
	});
	
	layui.use('table',function(){
		var table = layui.table;
		table.render({
		    elem: '#demo'
		    ,height: 330
		    ,data: datas
		 /*   ,page: true //开启分页
*/		    ,cols: [collArr]
		  });
	})
	
}

/**
 * 初始化分页信息
 */
function loadPageInfo(allItems,curPage){
	initPage({
		count: allItems,index: curPage,funName: 'queryRisk'
	});
}

/**
 * 初始化分页信息(layui定制版)<pre>
 * @参数说明:
 * obj = {
 * 	count:总数据条数(从数据库获取),
 * 	showItem:每页显示数据条数(默认值10),
 * 	index:当前页(默认值0),
 * 	funName:事件响应方法名,格式:funname;
 *  
 * }
 */
function initPage(obj){
	var count = obj.count;
	var defaults = obj.showItem ? obj.showItem : 10;
	var curPage = obj.index ? obj.index: 1;
	defaults = parseInt(defaults);
	count = parseInt(count);
	var totalPage = parseInt(count / defaults) + (count % defaults != 0 ? 1 : 0) ;
	var funName = obj.funName ? obj.funName : 'defaultFunName';
	if(curPage>totalPage) curPage = totalPage;
	
	var pageArr = [];
	
	if(totalPage == 1){
		pageArr = [1];
	}
	if(totalPage <= 5 && totalPage >1){
		for(var i = 1;i<= totalPage;i++){
			pageArr.push(i);
		}
	}
	//总页数大于5的时候
	if (totalPage > 5) {
		if (curPage == 1) {
			pageArr = [ curPage, curPage + 1, curPage + 2, curPage + 3, curPage + 4 ];
		} else if (curPage == totalPage) {
			pageArr = [ curPage - 4, curPage - 3, curPage - 2, curPage - 1, curPage ];
		} else if (curPage != 1 && curPage - 1 == 1) {
			pageArr = [ curPage - 1, curPage, curPage + 1, curPage + 2, curPage + 3 ];
		} else if (curPage != totalPage && curPage + 1 == totalPage) {
			pageArr = [ curPage - 3, curPage - 2, curPage - 1, curPage, curPage + 1 ];
		} else {
			pageArr = [ curPage - 2, curPage - 1, curPage, curPage + 1, curPage + 2 ];
		}
	}
	var html = "<div id=\""+(!obj.id ? 'layui-page-defaultBox':obj.id)+"\" class=\"layui-box layui-laypage\">";
	html += "<span class=\"layui-laypage-skip\">到第<input id=\"jump-page-num\" type=\"number\" min=\"1\" max=\""+totalPage+"\" value=\"" +
			obj.index+
			"\" class=\"layui-input\">页<button type=\"button\" class=\"layui-laypage-btn\" onclick=\"" +
			"jumpPage('jump-page-num')\">确定</button></span>";
	
	// 首页 上一页 按钮相关事件 << < ...
	if(curPage == 1){ // 显示不可点击 << < 隐藏 ...
		html += "<a href=\"javascript:;\" class=\"layui-laypage-next layui-disabled\">" +
				"<icon class=\"layui-icon layui-icon-prev\"></icon></a>";
		html += "<a href=\"javascript:;\" class=\"layui-laypage-next layui-disabled\" data-page=\"1\">" +
				"<icon class=\"layui-icon layui-icon-left\"></icon></a>";
	}
	if(curPage != 1 && curPage < 5){ //显示可点击 << < 隐藏
		html += "<a  onclick=\""+funName+"(1)\" class=\"layui-laypage-next\">" +
				"<icon class=\"layui-icon layui-icon-prev\"></icon></a>";
		html += "<a  onclick=\""+funName+"("+(curPage-1)+")\" class=\"layui-laypage-next\">" +
				"<icon class=\"layui-icon layui-icon-left\"></icon></a>";
	}
	if(curPage >=5){ //显示可点击 << < 显示...
		html += "<a  onclick=\""+funName+"(1)\" class=\"layui-laypage-next\"><icon class=\"layui-icon layui-icon-prev\"></icon></a>";
		html += "<a  onclick=\""+funName+"("+(curPage-1)+")\" class=\"layui-laypage-next\"><icon class=\"layui-icon layui-icon-left\"></icon></a>";
		html += "<span class=\"layui-laypage-spr\"><icon class=\"layui-icon layui-icon-more\"></icon></span>";
	}
	
	// 分页按钮
	for(var i in pageArr){
		var num = pageArr[i];
		if(curPage == num){
			//当前页按钮禁用
			html += "<span class=\"layui-laypage-curr\"><em class=\"layui-laypage-em\"></em><em>"+curPage+"</em></span>";
		}else{
			//当前页按钮启用
			html += "<a onclick=\""+funName+"("+(num)+")\" >"+num+"</a>";
		}
	}
	
	// 下一页 尾页 相关事件 ... > >> 
	if(curPage == totalPage){ // 显示不可点击 > >> 隐藏 ...
		html += "<a href=\"javascript:;\" class=\"layui-laypage-next layui-disabled\"><icon class=\"layui-icon layui-icon-right\"></icon></a>";
		html += "<a href=\"javascript:;\" class=\"layui-laypage-next layui-disabled\" data-page=\"1\">" +
				"<icon class=\"layui-icon layui-icon-next\"></icon></a>";
	}
	if(curPage != totalPage && curPage+2 >= totalPage){ //显示可点击 > >> 隐藏...
		html += "<a onclick=\""+funName+"("+(curPage+1)+")\" class=\"layui-laypage-next\"><icon class=\"layui-icon layui-icon-right\"></icon></a>";
		html += "<a onclick=\""+funName+"("+totalPage+")\"class=\"layui-laypage-next\"><icon class=\"layui-icon layui-icon-next\"></icon></a>";
	}
	if(curPage+2 < totalPage){ //显示可点击 > >> 显示...
		html += "<span class=\"layui-laypage-spr\"><icon class=\"layui-icon layui-icon-more\"></icon></span>";
		html += "<a onclick=\""+funName+"("+(curPage+1)+")\" class=\"layui-laypage-next\"><icon class=\"layui-icon layui-icon-right\"></icon></a>";
		html += "<a onclick=\""+funName+"("+totalPage+")\"class=\"layui-laypage-next\"><icon class=\"layui-icon layui-icon-next\"></icon></a>";
	}
	html += "<span class=\"layui-laypage-count\">共 <b id=\"totalPage\">"+totalPage+"</b> 页("+count+" 条数据)</span></div>"
	document.getElementById('pageBox').innerHTML = html;
	document.getElementById('jump-page-num').onfocus=function(){
		document.getElementById('jump-page-num').select();
	}
	return [totalPage,html];
}

/**
 *	跳页
 */
function jumpPage(num){
	var pageNum = parseInt($("#"+num).val());
	pageNum = pageNum <1 ? 1 : pageNum > $("#totalPage").html() ? $("#totalPage").html():pageNum ;
	queryRisk(pageNum)
}
/**
 * 获取查询条件
 */
function getQueCon(curPage){
	return {
		userid:uid,
		curPage:curPage,
		showItems:10,
		startDate:$('#startDate').val(),
		endDate:$('#endDate').val(),
		amountType:$('#amountType :selected').val(),
		amountCon:$('#amountCon :selected').val(),
		minAmount:$('#minAmount').is(":visible") ? $('#minAmount').val():null,
		maxAmount: $('#maxAmount').is(":visible") ? $('#maxAmount').val() : null
	}
}