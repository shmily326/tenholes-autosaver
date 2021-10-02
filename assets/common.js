/*!function(e,t){function n(){var n=l.getBoundingClientRect().width;t=t||540,n>t&&(n=t);var i=100*n/e;r.innerHTML="html{font-size:"+i+"px;}"}var i,d=document,o=window,l=d.documentElement,r=document.createElement("style");if(l.firstElementChild)l.firstElementChild.appendChild(r);else{var a=d.createElement("div");a.appendChild(r),d.write(a.innerHTML),a=null}n(),o.addEventListener("resize",function(){clearTimeout(i),i=setTimeout(n,300)},!1),o.addEventListener("pageshow",function(e){e.persisted&&(clearTimeout(i),i=setTimeout(n,300))},!1),"complete"===d.readyState?d.body.style.fontSize="16px":d.addEventListener("DOMContentLoaded",function(e){d.body.style.fontSize="16px"},!1)}(640,640);*/

//	弹出底部二维码
function previewImg(obj,src) {
	var img = new Image();  
	// img.src = obj.src;
	//var height = img.height + 50; // 原图片大小
	//var width = img.width; //原图片大小
	var imgHtml = "<img src='" + src + "' width='500px' height='500px'/>";  
	// var imgHtml = "<img src='/images/ewm.jpg' width='500px' height='500px'/>";
	//弹出层
	layer.open({  
		type: 1,  
		shade: 0.8,
		offset: 'auto',
		area: [500 + 'px',550+'px'],  // area: [width + 'px',height+'px']  //原图显示
		shadeClose:true,
		scrollbar: false,
		title: "请用微信扫描二维码", //不显示标题  
		content: imgHtml, //捕获的元素，注意：最好该指定的元素要存放在body最外层，否则可能被其它的相对元素所影响  
		cancel: function () {  
			//layer.msg('捕获就是从页面已经存在的元素上，包裹layer的结构', { time: 5000, icon: 6 });  
		}  
	}); 
}


function WX(bind){
	var from = encodeURIComponent(location.href);
	bind = bind ? 1 : 0;
	var redirectUrl = 'http://' + location.host + '/wx-login/index?from=' + from + '&bind=' + bind;
	if(location.host != 'www.tenholes.com'){
		redirectUrl = 'http://www.tenholes.com/wx_redirect.php?redirect=' + encodeURIComponent(redirectUrl);
	}
	var params = {
		self_redirect: false,
		appid: "wx615451e947731286", 
		scope: "snsapi_login", 
		redirect_uri: redirectUrl,
		state: "tenholes",
		style: "black",//二维码黑白风格 
	};
	var url = 'https://open.weixin.qq.com/connect/qrconnect?' + $.param(params);
	layer.open({
		type: 2,
		area: ['300px', '400px'],
		title: false,
		anim: 2,
		shadeClose: true, //开启遮罩关闭
		content: [url, 'no'],
	});
}

function QQ(){
	var csrfToken = $('#_csrf').val();
	window.location.href = "/login/auth?authclient=qq&_csrf-frontend="+ csrfToken;
}

//	60秒倒计时
var codeTime = 60;  
function countDown(e) {  
    codeTime = codeTime - 1;  
	console.log("============codeTime:",codeTime);
    $(".CAPTCHABtn").html(codeTime+"秒后重新发送");  
    $(".CAPTCHABtn").attr("data-status","1");
    if (codeTime == 0) {  
        $(".CAPTCHABtn").html("重新发送");
        codeTime = 60; 
        $(".CAPTCHABtn").attr("data-status","0");
        return;  
    }  
    setTimeout('countDown()',1000);  
} 

//时间
Date.prototype.toLocaleString = function() {
      return this.getFullYear() + "-" + (this.getMonth() + 1) + "-" + this.getDate() + " " + this.getHours() + ":" + this.getMinutes();
};
Date.prototype.toyymmhhss = function() {
      return (this.getMonth() + 1) + "月" + this.getDate() + "日  " + this.getHours() + ":" + this.getMinutes();
};
Date.prototype.toyymmdd = function() {
	var mouth = this.getMonth() + 1;
	var day   = this.getDate();
	mouth = mouth <10 ? "0"+mouth : mouth;
	day   = day <10 ? "0"+day : day;
	return this.getFullYear() + "-" + mouth + "-" + day;
};

function closeLayerBox(){
	layer.closeAll();
}

//注册box
function showRegister(){
	closeLayerBox()
	layer.open({
	  type: 1,
	  title: false,
	  shadeClose: true,
	  shade:  [0.3, '#000'],
	  maxmin: false, 
	  area: ['848px', '480px'],
	  content: $('#register')
	});
}
//	弹框注册
function register(){
	var tel      = $("input[name=tel]").val();
	var nickName   = $("input[name=uname]").val();
	var password   = $("input[name=pwd]").val();
	var rePassword = $("input[name=cpwd]").val();
	var code       = $("input[name=code]").val();
	
	
	if(nickName == ""){
		layer.msg('请输入用户名');
		return false;
	}else if(password == ""){
		layer.msg('请输入密码');
		return false;
	}else if(password != rePassword){
		layer.msg('两次密码不一致');
		return false;
	}
	var patt = new RegExp(/^(?=.*[a-zA-Z])(?=.*[0-9])[a-zA-Z0-9]{8,16}$/);
	if (!patt.test(password) || !patt.test(rePassword)) {
	    layer.msg('密码格式不正确，密码长度为8-16位，必须包含数字、字母');
	    return false;
	}
	
	var r = $("#registerForm").serialize();
	console.log(r);
	
	$.ajax({
		type : "POST",
		dataType:"json",
		url : "/register/index/",
		data : $("#registerForm").serialize(),
		success : function(result) {
			 // console.log(result);
			 // if(result.errcode == '100'){
			 //     layer.msg("用户名已经存在"); 
			 // }
			 // if(result.errcode == '104'){
			 //     layer.msg("验证码错误"); 
			 // }
			 if(result.errcode == 0){
			      window.location.href = "/user/index/"; 
			 }else{
				 layer.msg(result.errmsg); 
			 }
			 //layer.closeAll();
		},
		error: function(result){
			layer.msg("系统繁忙！");
			console.log(result);
		}
	});
}
//	静态页注册
function register1(){
	var csrfToken = $('#_csrf').val();
	var uname   = $("input[name=uname1]").val();
	var password   = $("input[name=pwd1]").val();
	var rePassword = $("input[name=cpwd1]").val();
	if(uname == ""){
		layer.msg('请输入用户名');
		return false;
	}
	if(password == ""){
		layer.msg('请输入密码');
		return false;
	}
	if(password != rePassword){
		layer.msg('两次密码不一致');
		return false;
	}
	var patt = new RegExp(/^(?=.*[a-z])(?=.*[0-9])[a-zA-Z0-9]{8,16}$/);
	if (!patt.test(password) || !patt.test(rePassword)) {
	    layer.msg('密码格式不正确，密码长度为8-16位，必须包含数字、字母');
	    return false;
	}
	
	$.ajax({
		type : "POST",
		dataType:"json",
		url : "/register/index/",
		data : {"_csrf-frontend": csrfToken, "uname":uname, "pwd":password, "cpwd":rePassword},
		success : function(result) {
			 // console.log(result);
			 // if(result.errcode == '100'){
			 //     layer.msg("用户名已经存在"); 
			 // }
			 // if(result.errcode == '104'){
			 //     layer.msg("验证码错误"); 
			 // }
			 if(result.errcode == 0){
			      window.location.href = "/user/index/"; 
			 }else{
				 layer.msg(result.errmsg); 
			 }
			 //layer.closeAll();
		},
		error: function(result){
			layer.msg("系统繁忙！");
			console.log(result);
		}
	});
}

//获取验证码
function getRegisterCAPTCHA(e) {
	var csrfToken = $('#_csrf').val();
	var tel = $("input[name=tel]").val();
	var status = $(e).attr("data-status");
	if(status == 1){
		layer.msg("请60秒后再次获取~~");
		return false;
	}
	$.ajax({
		type: "POST",
		dataType: "json",
		url: "/mobile/registersend/",
		data: {"_csrf-frontend": csrfToken, "tel": tel},
		success: function(result) {
			if (result.errcode == '200') {
				if (status == 0) {
					countDown(e);
				}
			} else {
				layer.msg(result.errmsg);
			}
		}
	});
}

//登录box
function showLogin(){
	layer.closeAll();
	layer.open({
	  type: 1,
	  title: false,
	  shadeClose: true,
	  shade:  [0.3, '#000'],
	  maxmin: false, 
	  area: ['848px', '470px'],
	  content: $('#login')
	});
}
//	弹框登录
function login(){
	var csrfToken = $('#_csrflogin').val();
	var loginUser = $("input[name=loginuname]").val();
	var loginPassword = $("input[name=loginpwd]").val();
	var localurl = $("input[name=localurl]").val();
	if(loginUser == ""){
		layer.msg('请输入手机号或用户名');
		return false;
	}else if(loginPassword == ""){
		layer.msg('请输入密码');
		return false;
	}
	
	$.ajax({
		type : "POST",
		dataType:"json",
		url : "/login/index/",
		data : {"_csrf-frontend": csrfToken, "uname":loginUser, "pwd":loginPassword, "localurl":localurl},
		success : function(result) {
			
			if(result.errcode == '200'){
				 window.location.reload();
			}else{
				layer.msg(result.errmsg);
			}
			 console.log(result);
			 //layer.closeAll();
		},
		error: function(result){
			layer.msg("系统繁忙！");
			console.log(result);
		}
	});
}

//	静态页登录
function login1(){
	var csrfToken = $('#_csrflogin1').val();
	var loginUser = $("input[name=loginuname1]").val();
	var loginPassword = $("input[name=loginpwd1]").val();
	var localurl = $("input[name=localurl1]").val();
	if(loginUser == ""){
		layer.msg('请输入手机号或用户名');
		return false;
	}else if(loginPassword == ""){
		layer.msg('请输入密码');
		return false;
	}
	
	$.ajax({
		type : "POST",
		dataType:"json",
		url : "/login/index/",
		data : {"_csrf-frontend": csrfToken, "uname":loginUser, "pwd":loginPassword, "localurl":localurl},
		success : function(result) {
			// if(result.errcode == '200'){
			// 	 window.location.href=result.errmsg;
			// }else{
			// 	layer.msg(result.errmsg);
			// }
			
			if(result.errcode == '200'){
				 window.location.reload();
			}else{
				layer.msg(result.errmsg);
			}
			 console.log(result);
			 //layer.closeAll();
		},
		error: function(result){
			layer.msg("系统繁忙！");
			console.log(result);
		}
	});
}

//找回密码
function showFindPassword(){
	layer.closeAll();
	layer.open({
	  type: 1,
	  title: false,
	  shadeClose: true,
	  shade:  [0.3, '#000'],
	  maxmin: false, 
	  area: ['848px', '360px'],
	  content: $('#findPassword')
	});
}
//下一步
function nextStepPassword(){
	var csrfToken = $('#_csrffind').val();
	var username = $("input[name=login_username]").val();
	var findPhone = $("input[name=findtel]").val();
	var findCode  = $("input[name=findCode]").val();
	if(username == ""){
		layer.msg('请输入用户名');
		return false;
	}else if(findPhone == ""){
		layer.msg('请输入手机号');
		return false;
	}else if(findCode == ""){
		layer.msg('请输入验证码');
		return false;
	}
	
	$.ajax({
		type : "POST",
		dataType:"json",
		url : "/lost-password/index/",
		data : {"_csrf-frontend": csrfToken,"findPhone":findPhone, "findCode":findCode, "username": username},
		success : function(result) {
			 if (result.errcode == 200) {
				 //校验短信验证码 成功的话
				 layer.closeAll();
				 layer.open({
				   type: 1,
				   title: false,
				   shadeClose: true,
				   shade:  [0.3, '#000'],
				   maxmin: false, 
				   area: ['848px', '300px'],
				   content: $('#resetPassword')
				 });
			 }else{
			     layer.msg(result.errmsg);
			 }
			 
		},
		error: function(result){
			layer.msg("系统繁忙！");
			console.log(result);
		}
	});
	
}

function getVerificationCodeSend(e) {
        var status = $(e).attr("data-status");
		var csrfToken = $('#_csrffind').val();
		var username = $("input[name=login_username]").val();
		var findPhone = $("input[name=findtel]").val();
		
		if(status == 1){
			layer.msg("请60秒后再次获取~~");
			return false;
		}
		
		if(username == ''){
			layer.msg('请输入用户名');
			return false;
		}
		
		if(findPhone == ''){
			layer.msg('请输入手机号');
			return false;
		}
        $.ajax({
            type: "POST",
            dataType: "json",
            url: "/mobile/user/",
            data: {"_csrf-frontend": csrfToken, "tel": findPhone, "username": username},
            success: function(result) {
                if (result.errcode == '200') {
                    if (status == 0) {
                        countDown(e);
                    }
                } else {
                    layer.msg(result.errmsg);
                }
            },
            error: function(result) {
            }
        });
    }

//重置密码
function changePassword() {
	var patt = new RegExp(/^(?=.*[A-z])(?=.*[0-9])[a-zA-Z0-9]{8,16}$/);
	var username = $("input[name=login_username]").val();
	var newPass = $("input[name=setpassword]").val();
	var rePass = $("input[name=reSetPassword]").val();
	var csrfToken = $('#_csrfrset').val();
	if (!patt.test(newPass) || !patt.test(rePass)) {
		layer.msg("密码格式不正确");
		return false;
	}
	if (newPass != rePass) {
		layer.msg("您两次输入的新密码不一致，请重新输入");
		return false;
	}
	$.ajax({
		type: "POST",
		dataType: "json",
		url: "/lost-password/setpassword/",
		data: {"_csrf-frontend": csrfToken,  'new': newPass, "username": username},
		success: function(result) {
			if (result.errcode == '200') {
				setTimeout(function() {
					layer.msg(result.errmsg);
					window.location.href="/"
				}, 2000);
				
			} 
			if (result.errcode == '101') {
				setTimeout(function() {
					layer.msg(result.errmsg);
					window.location.href="/"
				}, 2000);
			} 
			if(result.errcode != 101 && result.errcode != 200){
				layer.msg(result.errmsg);
			}
		},
		error: function(result) {
		}
	});

}

$(function(){
	//搜索
	var searchType=[
				{name:'曲谱',id:'0'},
				{name:'教程',id:'1'},
				{name:'文章',id:'2'}
			],
		fnBack=function(result){
				//console.log(result.name+' '+result.id);
				$("#searchType").val(result.id);
		};
	new SelectBox($('#comSearch'),searchType,fnBack,
	{
		dataName:'name',//option的html
		dataId:'id',//option的value						
		fontSize:'14',//字体大小
		optionFontSize:'14',//下拉框字体大小
		textIndent:0,//字体缩进						
		color:'#4a4a4a',//输入框字体颜色
		optionColor:'#4a4a4a',//下拉框字体颜色
		arrowColor:'#ccc',//箭头颜色
		backgroundColor:'#eee',//背景色颜色
		borderColor:'#ececec',//边线颜色
		hoverColor:'#ccc',//下拉框HOVER颜色	
		borderWidth:0,//边线宽度
		arrowBorderWidth:0,//箭头左侧分割线宽度。如果为0则不显示
		borderRadius:0,//边线圆角						
		placeholder:'请输入文字',//默认提示
		defalut:'firstData',//默认显示内容。如果是'firstData',则默认显示第一个
		allowInput:false,//是否允许输入						
		width:55,//宽
		height:30,//高
		optionMaxHeight:500//下拉框最大高度
	});

	
	$("[data-sel-text]").click(function(){
		$("[data-select]").show();
		$(this).addClass("active");
		/*if($(this).hasClass("active")){
			$(this).removeClass("active");
		}*/
	});
	$(document).on("click","[data-select] li",function(){
		var sText = $(this).text();
		var sValue = $(this).attr("data-option");
		$("[data-sel-text]").removeClass();
		$("[data-sel-text]").text(sText);
		$("[data-sel-value]").val(sValue);
		$("[data-select]").hide();
	});
	
	var initCommentTotal = $("#commentWrap .comment").length;
	var _maxCommentChars = 50;
	//评论
	$("#commentCon").keyup(function(){
		var inputChars = $(this).val();
		if (inputChars.length > _maxCommentChars) {
			$(this).val(inputChars.substring(0,_maxCommentChars));  
			$("#surplusCommentNum").html(0);
			return false;
		}  
		var curr = _maxCommentChars - inputChars.length;   
		$("#surplusCommentNum").html(curr.toString());  
	});
	$("#commentTar").click(function(){
		var type = $(this).attr("data-type");
		var id   = $(this).attr("data-id");
		var _uid   = $("#_uid").val();
		var csrfToken = $('#_csrf').val();
		var content = $("#commentCon").val();
		
		if(_uid == "" || _uid==null || _uid==0){
			layer.msg("请登录后评论");
			return false;
		}
		
		if(content == "" || content==null){
			layer.msg("请输入内容");
			return false;
		}
		
		$.ajax({
			type : "POST",
			dataType:"json",
			url : "/comment/create/",
			data : {"_csrf-frontend":csrfToken,"item_id":id,"type":type,'content':content },
			success : function(result) {
				 console.log(result);
				 if(result.errcode == '200'){
					 showCommentDetail(content,result.data.field);
					 $("#commentCon").val("");
					 $("#surplusCommentNum").html(_maxCommentChars);
				 }else if(result.errcode == '110'){
					 layer.msg(result.errmsg);
				 }else{
					 layer.msg("系统繁忙，稍后评论！");
				 }
				 if( $("#getMore").length > 0 ){
					 $("#commentWrap .cm-item:last").remove();
				 }
			},
			error: function(result){
				layer.msg("系统繁忙，稍后评论！");
				console.log(result);
			}
		});
	});
	
	function showCommentDetail(text,field){
		var currTime = new Date();
		var userAvatar = field.avatar;
		currTime = currTime.toyymmdd();
		var userName = $("#userName").val();
		var html = '';
		html += '<div class="cm-item clearfix">';
		html += '	<a href="/user/tipinfo?fid='+ field.uid +'"><div class="cm-user" style="background: url('+ userAvatar +') no-repeat center center;background-size: cover;"></div></a>';
		html += '	<div class="cm-con">';
		html += '		<div class="cm-t clearfix">';
		html += '			<span class="cm-tu">'+ field.nickname +'</span>';
		html += '			<span class="cm-time">'+ currTime +'</span>';
		html += '			<span class="cm-tr replayTar" data-type="'+field.type+'" data-id="'+field.item_id+'" data-uid="'+field.uid+'" data-cid="'+field.id+'">回复</span>';
		html += '		</div>';
		html += '		<div class="cm-c">'+ text +'</div>';
		html += '	</div>';
		html += '</div>';
		
		$("#commentWrap").prepend(html);
	}
	
	//回复
	$(document).on("click",".replayTar", function(){
		var type = $(this).attr("data-type");
		var id   = $(this).attr("data-id");
		var uid  = $(this).attr("data-uid");
		var cid  = $(this).attr("data-cid");
		var _uid   = $("#_uid").val();
		var csrfToken = $('#_csrf').val();
		var _this = $(this);
		if(_uid == "" || _uid==null || _uid==0){
			layer.msg("请登录后回复");
			return false;
		}
		layer.prompt({title: '回复', formType: 2,maxlength: 50,}, function(text, index){
			//console.log("回复内容",text,"===Type：",type,"====id：",id, "====UID：", uid,"====Cid：", uid);
			$.ajax({
				type : "POST",
				dataType:"json",
				url : "/comment/create/",
				data : {"_csrf-frontend":csrfToken,"item_id":id,"type":type,'to_uid':uid,'cid':cid,'content':text },
				success : function(result) {
					 console.log(result);
					 if(result.errcode == '200'){
						 showReplayDetail(result.data.field, _this);
						 layer.close(index);
					 }else if(result.errcode == '110'){
	                     layer.msg(result.errmsg);
						 layer.close(index);
					 }else{
						 layer.msg("系统繁忙，稍后评论！");
					 }
					 if( $("#getMore").length > 0 ){
						 $("#commentWrap .cm-item:last").remove();
					 }
				},
				error: function(result){
					console.log(result);
				}
			});
		});
	});
	
	function showReplayDetail(field,e){
		console.log("====field:",field);
		var userAvatar = field.avatar;
		var html = '';
		html += '<div class="cm-item clearfix">';
		html += '	<a href="/user/tipinfo?fid='+ field.uid +'"><div class="cm-user" style="background: url('+ userAvatar +') no-repeat center center;background-size: cover;"></div></a>';
		html += '	<div class="cm-con">';
		html += '		<div class="cm-t clearfix">';
		html += '			<span class="cm-tu">'+ field.nickname +'</span>';
		html += '			<span class="cm-time">'+ field.time +'</span>';
		html += '			<span class="cm-tr replayTar" data-type="'+field.type+'" data-id="'+field.item_id+'" data-uid="'+field.to_uid+'" data-cid="'+field.id+'">回复</span>';
		html += '		</div>';
		html += '		<div class="cm-c">'+ field.content +'</div>';
		html += '		<div class="cm-reply">@'+ field.to_nickname +'：'+ field.to_content +'</div>';
		html += '	</div>';
		html += '</div>';
		
		$("#commentWrap").prepend(html);
	}
	
});