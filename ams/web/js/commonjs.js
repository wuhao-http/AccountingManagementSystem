/**
 * 通用js
 */

/**
 * 初始化日历插件
 * @selectorID 选择器编号
 * @defVal 默认值 
 * @minVal 最小值
 * @maxVal 最大值
 */
function initDate(selectorID,defVal,minVal,maxVal,format) {
	var minDate = minVal == '' || typeof(minVal) == 'undefined' ? '1900-01-01' : minVal;
	var maxDate = maxVal == '' || typeof(maxDate) == 'undefined' ?  new Date().Format("yyyy-MM-dd") : maxVal;
	var defaultVal = defVal == '' || typeof(defVal) == 'undefined' ?  new Date().Format("yyyy-MM-dd hh:mm"): defVal;
	
	var fm = 'yyyy-MM-dd';
	var showButton = false;
	var type = 'date';
	if(format){
		fm = 'yyyy-MM-dd HH:ss'
		showButton = true;
		type = 'datetime';
	}
	
	laydate.render({
		elem : '#' + selectorID, //绑定元素id
		theme : 'grid', //设置主题
		min: minDate,//可选最小日期
		max: maxDate, // 可选最大日期
		calendar : 'true', // 设置公历日历
		trigger: 'click',
		value : defaultVal, // 设置默认值
		btns : [ 'now', 'confirm' ], //设置按钮 右下角显示的按钮，会按照数组顺序排列，内置可识别的值有：clear、now、confirm
		showBottom : showButton,//隐藏按钮
		format : fm,
		type:type
		/*,done:function(value,date){
			document.getElementById(selectorID).value=value+" "+new Date().Format("hh:mm");
		}*/
	});
}

/**
 * 去掉前后空格
 * @param str 需要处理的字符串
 * @returns 去掉前后空格的字符串
 */
function trim(str) {
	return str.replace(/(^\s*)|(\s*$)/g, "");
}

/**
 * 获取项目路径(示例: http://localhost:8088/项目名)
 */
function getRootPath() {
	//获取当前网址，如： http://localhost:8088/test/test.jsp
	var curPath = window.document.location.href;
	//获取主机地址之后的目录，如： test/test.jsp
	var pathName = window.document.location.pathname;
	var pos = curPath.indexOf(pathName);
	//获取主机地址，如： http://localhost:8088
	var localhostPath = curPath.substring(0, pos);
	//获取带"/"的项目名，如：/test
	var projectName = pathName.substring(0, pathName.substr(1).indexOf('/') + 1);
	return (localhostPath + projectName); //发布前用此
}

//格式化日期
//对Date的扩展，将 Date 转化为指定格式的String
//月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符， 
//年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字) 
//例子： 
//(new Date()).Format("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423 
//(new Date()).Format("yyyy-M-d h:m:s.S")      ==> 2006-7-2 8:9:4.18 
Date.prototype.Format = function(fmt) { //author: meizz 
	var o = {
		"Y+" : this.getYear(), //年
		"M+" : this.getMonth() + 1, //月份 
		"d+" : this.getDate(), //日 
		"h+" : this.getHours(), //小时 
		"m+" : this.getMinutes(), //分 
		"s+" : this.getSeconds(), //秒 
	};
	if (/(y+)/.test(fmt))
		fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
	for (var k in o)
		if (new RegExp("(" + k + ")").test(fmt))
			fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
	return fmt;
}

/**
 * 获取上个月的今天
 */
function getPreMonthToday(){
	var curDate = new Date();
	var year = curDate.Format("yyyy");
	var month = curDate.Format("MM");
	var day = curDate.Format("dd");
//	console.log("当前月:"+month)
	if(month-1 < 1){
		year--;
		month = 12;
	}else{
		month--;
	}
	return year+"-"+month+"-"+day;
}
/**
 * 获取指定年月的最大天数
 * add in 2019年1月22日
 */
function getMaxDay(year,month){
	return new Date(year,month,0).getDate();
}

/**
 * 字符串日期增加指定天数,返回新的字符串日期
 * add in 2019年1月22日
 */
function addDate(dateStr,days){
	var d = new Date(dateStr);
	d.setDate(d.getDate()+days);
	var year = d.getFullYear();
	var month = d.getMonth()+1;
	var day = d.getDate();
	month = month<10 ? "0"+month : month;
	day = day<10 ? "0"+day : day;
	return year+"-"+month+"-"+day;
}

/**
 * 获取两个日期差,返回天数
 * add in 2019年1月22日
 */
function getTwoDateNum(dStrMax,dStrMin){
	var dA = new Date(dStrMax);
	var dB = new Date(dStrMin);
	var res = (dA - dB)/1000/60/60/24;
	return res;
}

/**
 * 替换字符串中所有指定的字符
 * pattern - string|RegExp
 * replacement - string
 */
function replaceAll(str,pattern,replacement){
	while(str.indexOf(pattern) != -1){
		str = str.replace(pattern, replacement);
	}
//	console.log(str)
	return str;
}

/**
 * js模拟表单提交
 * 调用:
 * 	postcall( 'newAnime', {page_num:1,page_size:10}); 
 * 或者: 
 * 	postcall( 'newAnime', {page_num:1,page_size:10}, '_blank');
 */
function postCall(url, params, target) {
	//创建form元素并设置其相关属性。参数url:表单提交去向;参数target:链接打开方式。 
	var tempForm = document.createElement("form");
	tempForm.action = url;
	tempForm.method = "post";
	tempForm.style.display = "none"
	if (target) {
		tempForm.target = '_blank';
	}
	//创建input元素并设置提交的数据。参数params:提交的数据(JSON结构)。 
	for (var x in params) {
		var ipt = document.createElement("input");
		ipt.name = x;
		ipt.value = params[x];
		tempForm.appendChild(ipt);
	}
	//创建提交按钮元素 
	var ipt = document.createElement("input");
	ipt.type = "submit"; tempForm.appendChild(ipt);
	//创建->提交->删除 
	document.body.appendChild(tempForm);
	tempForm.submit();
	document.body.removeChild(tempForm);
}

/**
 * 生成饼状图片
 * @param targetID 在容器编号为targetID的容器中生成
 * @param itemsArr 饼块名称数据,格式为['列1','列2',...]
 * @param datasColl 数据,格式为[{name:'名称',value:值}[,...]]
 */
function createCountImg(targetID,itemsArr,datasColl){
	// 基于准备好的dom，初始化echarts实例
    var myChart = echarts.init(document.getElementById(targetID));
//    var items = ['交通出行','社交开销','住房缴费'];
//    var datas = [{value:1,name:'交通出行'},{value:157,name:'社交开销'},{value:500,name:'住房缴费'}]
    // 使用刚指定的配置项和数据显示图表。
    myChart.setOption({
		 title : {
			text: '',
			subtext: '',
			x:'center'
		},
		tooltip : {
			trigger: 'item',
			formatter: "{a} <br/>{b} : {c} ({d}%)"
		},
		legend: {
			orient: 'vertical',
			left: 'left',
			data: itemsArr
		},
		series:[{
			name:'账目分析',
			type:'pie',
			radius:'75%',
			data:datasColl
		}],
		itemStyle: {
			// 阴影的大小
			shadowBlur: 200,
			// 阴影水平方向上的偏移
			shadowOffsetX: 0,
			// 阴影垂直方向上的偏移
			shadowOffsetY: 0,
			// 阴影颜色
			shadowColor: 'rgba(0, 0, 0, 0.5)'
		}
	});
	
}

//获取浏览器标识
function getBrowserType(){
  var explorer = window.navigator.userAgent;
  //Chrome
  if (explorer.indexOf("Firefox") >= 0) {
      return 'Firefox';
  }
  //Chrome
  else if (explorer.indexOf("Chrome") >= 0) {
      return 'Chrome';
  }
  //Opera
  else if (explorer.indexOf("Opera") >= 0) {
      return 'Opera';
  }
  //Safari
  else if (explorer.indexOf("Safari") >= 0) {
      return 'Safari';
  }
  //IE
  else {
      return 'IE';
  }
}


/**
 * ==========================页面跳转
 */

/**
 * 回到主页
 */
function goToMainpage(){
	location.href=getRootPath()+"/goToMainpage.sp";
}

/**
 * 跳转到账目账目管理
 */
function toLedgerPage(){
	location.href=getRootPath()+"/toLedgerPage.sp";
}

/**
 * 打开账目报表页面
 * add:2019年2月15日
 */
function toReportPage(){
	$.post(getRootPath()+"/isTimeout.sp",{addr:"/toReportPage.sp"},function(resp){
		if(resp.flag){
			location.href=getRootPath()+resp.msg;
		}else{
			alert(resp.msg);
		}
	},"json");
}

/**
 * 跳转到分类管理页面
 */
function toSortMngPage(){
	location.href=getRootPath()+"/toSortPage.sp";
}

/**
 * 跳转到个人中心
 */
function toProCenterPage(){
	location.href="toProCenterPage.sp";
}

/**
 * 注销登录
 */
function loginOut(){
	if(confirm("确定要注销登录吗?注销后系统将自动跳转到登陆页面!")){
		location.href =getRootPath()+ "/loginOut.sp";
	}
}
/**
 * 返回登陆页面
 */
function toLoginPage(){
	location.href =getRootPath()+ "/loginOut.sp";
}