$(function() {
	//检查会话是否过期
	$.post(getRootPath() + '/user/userIsOnline.sp',function(resp){
		if(!resp.flag){
			alert(resp.msg);
			location.href=getRootPath() + '/user/toLoginPage.sp';
			return;
		}
	},'JSON');
	//加载月份默认值
	initCurMonth();
	
	initLedgerImg(new Date().Format('yyyy-MM'));
	
	
	
	console.log("%c使用中如果遇到问题,请联系%cQQ:95303084%c,验证问题:记账系统","color:blue;","color:green;font-weight:bolder;font-size:16px","color:blue;");
});

/**
 * 按月统计账目分析
 */
function countLegerInfo(){
	var date;
	// 节点.is(":visible") 如果节点可见,返回true,否则返回false
	if($("#year").is(":visible")){ //按月统计
		date = $('#year').val()+'-'+$('#month :selected').val();
		var curDate = new Date();
		var conDate = new Date(Date.parse(date+"-"+curDate.getDate()));
//		alert("查询条件日期超过当前日期:"+(conDate > curDate));
//		alert("查询条件日期超过当前日期:"+date);
		if(conDate > curDate){
			alert("您所查询的年月条件已超过当前日期,请重新选择!");
//			console.log(curDate+ " vs " +conDate)
			return;
		}
	}else{ // 按日期范围统计
		var sDate = $("#dateS").val();
		var eDate = $("#dateE").val();
		var s = Date.parse(sDate);
		var e = Date.parse(eDate);
		if(s > e){
			alert("开始日期不能大于结束日期");
			return;
		}
		date = sDate+"/"+eDate;
	}
	
	initLedgerImg(date);
}

function initCurMonth(){
	var month = new Date().getMonth()+1;
	var opHtml ='';
	for(var i = 1;i<=12;i++){
		var temp = i;
		if(i<10){
			temp = '0'+i;
		}
		if(i == month){
			opHtml += "<option value=\""+temp+"\" selected=\"true\">"+temp+"</option>";
		}else{
			opHtml += "<option value=\""+temp+"\">"+temp+"</option>";
		}
	}
	$('#month').empty().append(opHtml);
	
	var maxDate = new Date();
	var defDate = getPreMonthToday();
	var minDate = "1990-01-01";
	//初始化月份信
	initDate("dateS", defDate, minDate, maxDate);
	initDate("dateE", maxDate, minDate, maxDate);
} 

function initLedgerImg(date) {
	$.ajax({
		url : getRootPath() + '/ledger/countLedgerAmountByMonth.sp',
		dataType : 'JSON',
		data : {
			creDate : date
		},
		type : 'POST',
		success : function(resp) {
//			console.log(resp.ledgerMap);
			createLedgerImg(resp.ledgerMap,date);
		}
	});
}

function createLedgerImg(ledgerMap,date) {
	// 处理后台传递过来的数据
	var rootArr = []; //条目
	var datas = []; //数据对象
	var days = []; //x坐标
	var queMonth; //标题
	
	var map = processMap(ledgerMap);
	//初始化条目
	for(var key in ledgerMap){
		rootArr.push(key);
	}
	//初始化x坐标
	if(date.indexOf("/") == -1){ //指定月份查询
		var mon = new Date();
		var dateNum = date.split("-");
		day = date != mon.Format("yyyy-MM") ? getMaxDay(dateNum[0], dateNum[1]) : mon.getDate();
		for(var i = 1;i<=day;i++){
			days.push(i);
		}
		queMonth = dateNum[0]+"年"+dateNum[1]+"月账目统计";
	}else{ //指定日期范围统计
		var se = date.split("/");
		var tmpDays = map[0][1];
		for(var i in tmpDays){
			days.push(tmpDays[i].date);
		}
		queMonth = replaceAll(se[0], "-", "")+"-"+replaceAll(se[1], "-", "")+"\r\n账目信息统计";
	}
	console.log("当前统计的账目数据共有"+day+"天")	
	
	//封装数据
	var rootName,tmpIte,rootItem;
	for(var i in map){
		var tmArr = [];
		tmpItem = map[i][1]; // [{…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}]
		for(var j in tmpItem){
			rootItem = tmpItem[j].money;
			tmArr.push(rootItem);
		}
		datas.push(new Datas(map[i][0], tmArr));
	}
	
	
	/*//定义日期坐标
	return;
	
	//定义日期坐标(x坐标)
	var curStr = new Date().Format("yyyy-MM");
	
	var curDate = new Date(Date.parse(curStr));
	var conDate = new Date(Date.parse(date));
	//使用new Date(year,month,0)的方式,可以获取该月的最后一天
	var days = new Date().getDate() ;
	if(conDate.getTime() < curDate.getTime()){
		days = new Date($('#year').val(),$('#month').val(),0).getDate();
	}
	var queMonth = (conDate < curDate) ? conDate.getMonth()+1 : curDate.getMonth()+1;
// 	console.log(days+"--"+new Date().getDate());
// 	console.log("查询日期小于当前日期:"+(conDate < curDate));
	var day = [];
	for (var i = 1; i <= days; i++) {
		day[i - 1] = i + '';
	}
	// 基于准备好的dom，初始化echarts实例
	var myChart = echarts.init(document.getElementById('ledgerCount'));
        
	var rootArr = []; //条目
	var datas = []; //数据对象
	
	for(var i in ledgerMap){
		rootArr.push(i);
		datas.push(new Datas(i,ledgerMap[i]));
		
	}*/
	//console.log(rootArr+"--"+datas);
	// 基于准备好的dom，初始化echarts实例
	var myChart = echarts.init(document.getElementById('ledgerCount'));
	var option = {
		    //设置标题
		    title: {
		        text: queMonth
		    },
		    //鼠标悬停或经过指定坐标显示y值
		    tooltip: {
		        trigger: 'axis'
		    },
		    //这是条目
		    legend: {
		        data:rootArr,
		        type: 'scroll',
		        orient: 'horizontal',
		         right: 10,
//		         top: 20,
		         bottom: 10
		    },
		    //工具盒子
		    toolbox: {
		        show: true,
		        feature: {
		        	//数据区域放大或缩小
		            dataZoom: {
		                yAxisIndex: 'none'
		            },
		            //数据视图是否可读
		            dataView: {readOnly: true},
		            magicType: {type: ['line', 'bar']},
		            restore: {},
		            saveAsImage: {}
		        }
		    },
		    //x坐标
		    xAxis:  {
		        type: 'category',
		        boundaryGap: false,
		        data: days
		    },
		    //y坐标
		    yAxis: {
		        type: 'value',
		        axisLabel: {
		            formatter: '¥{value} '
		        }
		    },
		    //数据
		    series: datas
		};

	// 使用刚指定的配置项和数据显示图表。
	myChart.setOption(option);
}

/**
 * add in 2019年1月22日
 * 处理集合,当指定日期不存在值得时候,以0代替
 * 私有方法,不通用
 */
function processMap(map){
	var rMap;
	var resMap = [];
	for(var rKey in map){
		var tmpMap = [];
		rMap = map[rKey];
		var s = !$("#year").val() ? new Date().getFullYear() : $("#year").val();
		var e = $("#month").val();
		var days = getMaxDay(s,e);
		var sDate = s+"-"+e+"-01";
		var eDate = s+"-"+e+"-"+days;
		if($("#dateS").is(" :visible") ){
			sDate = $("#dateS").val();
			eDate = $("#dateE").val();
			eDate = addDate(eDate, 1);
			days = (Date.parse(eDate) - Date.parse(sDate))/1000/60/60/24 ;
		}
		var tmpDate =sDate;
		var money;
		for(var i = 0;i < days;i++){
			var date = tmpDate.substring(5).replace("-", "");//2018-01-01
			money = !rMap[tmpDate] ? 0.00 : rMap[tmpDate]
			tmpMap.push({date:date,money:money});
			tmpDate = addDate(tmpDate,1);
		}
		resMap.push([rKey,tmpMap]);
	}
//	var t = resMap[1][1];
//	for(var tes in t){
//		console.log(t[tes].date);
//	}
	return resMap;
}

/**
 * add in 2019年1月21日
 * 关闭当前标签页
 */
function exitSystem(){
	if(confirm("窗口即将关闭,是否继续?")){	 
		var browserName= navigator.appName;
		console.log("当前浏览器是:%c"+browserName,"color:red;font-size:16px")
		if(browserName == "Netscape"){ //非IE浏览器
			alert("当前浏览器不支持页面退出系统,请点击右上角关闭按钮关闭");
		}else if(browserName == "Microsoft Internet Explorer"){ //IE浏览器
			window.opener = null;
			window.close();
		}else{
			alert("当前浏览器不支持页面退出系统,请点击右上角关闭按钮关闭");
		}
//		window.opener = null;
//		window.open("","_self");
//		window.close();
	}
}

/**
 * add in 2019年1月21日
 * 切换统计方式
 */
function countSwitch(){
	var showYear = $("#year").parent(); 
	var showMon = $("#month").parent();
	var showDateS = $("#dateS").parent();
	var showDateE = $("#dateE").parent();
	
	if(showYear.hasClass("hide")){
		showYear.removeClass("hide");
		showMon.removeClass("hide");
		showDateS.addClass("hide");
		showDateE.addClass("hide");
		$("#queLabel").html("按月统计: ").css("font-weight","bolder");
	}else{
		showDateS.removeClass("hide");
		showDateE.removeClass("hide");
		showYear.addClass("hide");
		showMon.addClass("hide");
		$("#queLabel").html("按日期范围统计: ").css("font-weight","bolder");
	}
}
//创建数据对象,用于封装数据
function Datas(dataName,dataArr){
	this.name = dataName;
	this.type = 'line';
	this.data = dataArr,
	this.markPoint = {data: [{type: 'max', name: '最大金额'},{type: 'min', name: '最小金额'}]},
	this.markLine = {data: [{type: 'average', name: '平均值'}]}
}

function getDaysInMonth(year,month){
	month = parseInt(month,10);  //parseInt(number,type)这个函数后面如果不跟第2个参数来表示进制的话，默认是10进制。
	var temp = new Date(year,month,0);
	return temp.getDate();
}
