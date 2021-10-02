function audioAA(){
	var ele = $("#audio")[0];
	var rangeEle    = $("#audioRange");
	var maxTEle     = $("#maxTime");
	var currTEle    = $("#currTime");
	
	var controlsEle = $('#audioControls');
	
	var eleSrc = ele.src;
	console.log("eleSrc:",eleSrc);
	
	var isPlay = 0;
	var duration = 0;
	var clearTime;
	var _self = this;
	
	ele.addEventListener("canplay",function(){
		duration=ele.duration;
		rangeEle.attr({'max':duration});
		maxTEle.html(_self.timeToStr(duration));
	});
	
	ele.addEventListener("ended",function(){
		_self.pause();
		controlsEle.attr("data-isPlay",0);
		controlsEle.removeClass("active");
	},false);
	
	this.changeSource = function(){
		console.log(ele.src);
		clearTimeout(clearTime);
		ele.currentTime = 0;
		rangeEle.val(0);
		currTEle.text(_self.timeToStr(0));
		controlsEle.attr("data-isPlay",0);
		controlsEle.removeClass("active");
	}
	
	this.initAudio = function(){
		ele.load();
		// duration = ele.duration;
		// console.log(ele);
		// console.log("duration:",duration,typeof(duration));
		// rangeEle.attr({'max':duration});
		// maxTEle.html(_self.timeToStr(duration));
	}
	
	this.play=function(){
		ele.play();
		_self.timer();
		controlsEle.attr("data-isPlay",1);
		controlsEle.addClass("active");
	}
	
	this.pause = function(){
		console.log('----pause当前时间:',ele.currentTime);
		ele.pause();
		controlsEle.attr("data-isPlay",0);
		controlsEle.removeClass("active");
	}
	
	this.changeRange = function(){
		console.log(rangeEle.val());
		console.log('----changeRange当前时间:',ele.currentTime);
		
		clearTimeout(clearTime);
		ele.currentTime =  rangeEle.val();
		ele.play();
		_self.timer();
		controlsEle.attr("data-isPlay",1);
		controlsEle.addClass("active");
		
	}
	
	this.timer = function(){
		var t=parseInt(Math.round(ele.currentTime));
		rangeEle.val(t);
		currTEle.text(_self.timeToStr(t));
		t=parseInt(ele.currentTime);
		if(t<duration){
		  clearTime = setTimeout(_self.timer, 1000);
		}else{
		  clearTimeout(clearTime);
		}
	}
	
	this.timeToStr = function(time) {
	    var m = 0,
	    s = 0,
	    _m = '00',
	    _s = '00';
	    time = Math.floor(time % 3600);
	    m = Math.floor(time / 60);
	    s = Math.floor(time % 60);
	    _s = s < 10 ? '0' + s : s + '';
	    _m = m < 10 ? '0' + m : m + '';
	    return _m + ":" + _s;
	}
}

var audioBoxTop = $("#audioAnchor").offset().top-610;
function audioFixed(){
 var bodyScrollTop = document.documentElement.scrollTop || document.body.scrollTop;
 if (bodyScrollTop > audioBoxTop) {
     $("#audioBox").removeClass("audio-fixed");
 }else{
  $("#audioBox").addClass("audio-fixed");
 };
 
}

$(function(){
	//------------音频------------------------
	//audio fixed
	 // audioFixed();
	 // $(window).scroll(function(){
	 //  audioFixed();
	 // });
	 var audioObj;
	 if($("#audio")[0] != undefined){
	 	audioObj = new audioAA();
		audioObj.initAudio();
	 }
	
	//hidden tip
	$(document).click(function(){
		$("#audioTip").hide();
	});
	//switch
	$("#audioSwitch").click(function(event){
		event.stopPropagation();    
		var _this = $(this);
		var csrfToken = $("#_csrf").val();
		var specId = $(this).attr("data-specId");
		var audioSrc = $("#audioSrc").val();
		var premission = $("#premission").val();
		var isVip = $("#isVip").val();
		var freeTab = $("#freeTab").val();
		if(isVip == "0" && freeTab == "1"){
			$("#audioTip").addClass("left-tip").removeClass("right-tip").show();
			return false;
		}
		
		$(".aswitch-text").removeClass("active");
		if(_this.hasClass("example")){
			var audioBzSrc = $("#audioBzSrc").val();
			$("#audio").attr("src",audioBzSrc);
			audioObj.changeSource();
			audioObj.initAudio();
			
			_this.addClass("accompany").removeClass("example");
			$(".aswitch-text").eq(1).addClass("active");
		}else{
			$(this).addClass("example").removeClass("accompany");
			$(".aswitch-text").eq(0).addClass("active");
			$("#audio").attr("src", audioSrc);
			audioObj.changeSource();
			audioObj.initAudio();
		}
	});
	
	//audio
	var audio=document.getElementById('audio');
	$('#audioControls').on('click',function(event){
	    event.stopPropagation();
		var audioSrc = $('#audio').attr('src');
		var userName = $('#userName').val();
		if(userName == undefined  || userName == null || userName == ""){
			layer.msg("请登录！");
			return false;
		}
		if(audioSrc == ""){
			layer.msg("该曲谱暂无试听！");
			return false;
		}
		var isplay = $(this).attr("data-isPlay");
		if(isplay == 0){
			audioObj.play();
		}else{
			audioObj.pause();
		}
	});
	
	$("#audioRange").change(function(){
		audioObj.changeRange();
	});
	
	//download
	$("#audioDownload").click(function(event){
		event.stopPropagation();
		var freeTab = $("#freeTab").val();
		var isVip = $("#isVip").val();
		if(isVip == "0" && freeTab == "1"){
			$("#audioTip").removeClass("left-tip").addClass("right-tip").show();
			return false;
		}
	});
	
	//lock switch
	$("#audioLockSwitch").click(function(event){
		event.stopPropagation();
		$("#audioTip").addClass("left-tip").removeClass("right-tip").show();
	});
	
	// lock download
	$("#audioLosckDownload").click(function(event){
		event.stopPropagation();
		$("#audioTip").removeClass("left-tip").addClass("right-tip").show();
	});
	
	//无权限
	$("#audioNoaccess").click(function(event){
		event.stopPropagation();
		layer.alert('请登录后享受');
	});

});