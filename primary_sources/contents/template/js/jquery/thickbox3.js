/*
 * Thickbox 3.1 - One Box To Rule Them All.
 * By Cody Lindley (http://www.codylindley.com)
 * Copyright (c) 2007 cody lindley
 * Licensed under the MIT License: http://www.opensource.org/licenses/mit-license.php
*/
		  
var tb_pathToImage = "images/loadingAnimation.gif";
var mv;
var params;

/*!!!!!!!!!!!!!!!!! edit below this line at your own risk !!!!!!!!!!!!!!!!!!!!!!!*/

//on page load call tb_init
$(document).ready(function(){
	var ua = navigator.userAgent;
	if (ua.indexOf("Wii") != -1){// || ua.indexOf("MSIE 6.0") != -1) {
		wii_init();
	} else {
		tb_init('a.thickbox, area.thickbox, input.thickbox');//pass where to apply thickbox
		//imgLoader = new Image();// preload image
		//imgLoader.src = tb_pathToImage;
		first_show();
	}
});

//add thickbox to href & area elements that have a class of .thickbox
function tb_init(domChunk){
	var u = navigator.userAgent;
	if (u.indexOf("Wii") != -1) {
		
	} else {
		$(domChunk).click(function(){
		var t = this.title || this.name || null;
		var a = this.href || this.alt;
		var g = this.rel || false;
		tb_show(t,a,g);
		this.blur();
		return false;
		});
	}
}

function wii_init() {
	$('a.thickbox').each(function() {
		var url = this.href;
		url = url.split("player").join("player_wii");
		url = url + "&caption=" + encodeURI(this.title);
		this.href = url;
		//$(this).after("<span><a href='" + url + "'>" + this.innerHTML + "</a></span>");
		//$(this).css({display: "none"});
	});
}

function first_show() {
	if (location.hash.match("id=([^&]+)")) {
        var id = RegExp.$1;
        var obj = $("a."+id).get(0);
        if (obj) {
          return setTimeout(function(){tb_show.call(obj, obj.title, obj.href, false); return false;}, 1000);
        }
    }	
}

function tb_show(caption, url, imageGroup) {//function called when the user clicks on a thickbox link

	try {
		if (typeof document.body.style.maxHeight === "undefined") {//if IE 6
			$("body","html").css({height: "100%", width: "100%"});
			$("html").css("overflow","hidden");
			if (document.getElementById("TB_HideSelect") === null) {//iframe to hide select elements in ie6
				$("body").append("<iframe id='TB_HideSelect'></iframe><div id='TB_overlay'></div><div id='TB_window'></div>");
				$("#TB_overlay").click(tb_remove);
			}
		}else{//all others
			if(document.getElementById("TB_overlay") === null){
				$("body").append("<div id='TB_overlay'></div><div id='TB_window'></div>");
				$("#TB_overlay").click(tb_remove);
			}
		}
		if(tb_detectMacXFF()){
			$("#TB_overlay").addClass("TB_overlayMacFFBGHack");//use png overlay so hide flash
		}else{
			$("#TB_overlay").addClass("TB_overlayBG");//use background and opacity
		}
		
		if(caption===null){caption="";}
		//$("body").append("<div id='TB_load'><img src='"+imgLoader.src+"' /></div>");//add loader to the page
		//$('#TB_load').show();//show loader
		
		var baseURL;
	    if(url.indexOf("?")!==-1){ //ff there is a query string involved
			baseURL = url.substr(0, url.indexOf("?"));
	    }else{ 
	   		baseURL = url;
	    }
	   
	   var urlString = /\.jpg$|\.jpeg$|\.png$|\.gif$|\.bmp$/;
	   var urlType = baseURL.toLowerCase().match(urlString);
	   

		if(urlType == '.jpg' || urlType == '.jpeg' || urlType == '.png' || urlType == '.gif' || urlType == '.bmp'){//code to show images
				
			TB_PrevCaption = "";
			TB_PrevURL = "";
			TB_PrevHTML = "";
			TB_NextCaption = "";
			TB_NextURL = "";
			TB_NextHTML = "";
			TB_imageCount = "";
			TB_FoundURL = false;
			if(imageGroup){
				TB_TempArray = $("a[@rel="+imageGroup+"]").get();
				for (TB_Counter = 0; ((TB_Counter < TB_TempArray.length) && (TB_NextHTML === "")); TB_Counter++) {
					var urlTypeTemp = TB_TempArray[TB_Counter].href.toLowerCase().match(urlString);
						if (!(TB_TempArray[TB_Counter].href == url)) {						
							if (TB_FoundURL) {
								TB_NextCaption = TB_TempArray[TB_Counter].title;
								TB_NextURL = TB_TempArray[TB_Counter].href;
								TB_NextHTML = "<span id='TB_next'>&nbsp;&nbsp;<a href='#'>Next &gt;</a></span>";
							} else {
								TB_PrevCaption = TB_TempArray[TB_Counter].title;
								TB_PrevURL = TB_TempArray[TB_Counter].href;
								TB_PrevHTML = "<span id='TB_prev'>&nbsp;&nbsp;<a href='#'>&lt; Prev</a></span>";
							}
						} else {
							TB_FoundURL = true;
							TB_imageCount = "Image " + (TB_Counter + 1) +" of "+ (TB_TempArray.length);											
						}
				}
			}

			imgPreloader = new Image();
			imgPreloader.onload = function(){		
			imgPreloader.onload = null;
				
			// Resizing large images - orginal by Christian Montoya edited by me.
			var pagesize = tb_getPageSize();
			var x = pagesize[0] - 150;
			var y = pagesize[1] - 150;
			var imageWidth = imgPreloader.width;
			var imageHeight = imgPreloader.height;
			if (imageWidth > x) {
				imageHeight = imageHeight * (x / imageWidth); 
				imageWidth = x; 
				if (imageHeight > y) { 
					imageWidth = imageWidth * (y / imageHeight); 
					imageHeight = y; 
				}
			} else if (imageHeight > y) { 
				imageWidth = imageWidth * (y / imageHeight); 
				imageHeight = y; 
				if (imageWidth > x) { 
					imageHeight = imageHeight * (x / imageWidth); 
					imageWidth = x;
				}
			}
			// End Resizing
			
			TB_WIDTH = imageWidth + 30;
			TB_HEIGHT = imageHeight + 60;
			$("#TB_window").append("<a href='' id='TB_ImageOff' title='Close'><img id='TB_Image' src='"+url+"' width='"+imageWidth+"' height='"+imageHeight+"' alt='"+caption+"'/></a>" + "<div id='TB_caption'>"+caption+"<div id='TB_secondLine'>" + TB_imageCount + TB_PrevHTML + TB_NextHTML + "</div></div><div id='TB_closeWindow'><a href='#' id='TB_closeWindowButton' title='Close'>close</a></div>"); 		
			
			$("#TB_closeWindowButton").click(tb_remove);
			
			if (!(TB_PrevHTML === "")) {
				function goPrev(){
					if($(document).unbind("click",goPrev)){$(document).unbind("click",goPrev);}
					$("#TB_window").remove();
					$("body").append("<div id='TB_window'></div>");
					tb_show(TB_PrevCaption, TB_PrevURL, imageGroup);
					return false;	
				}
				$("#TB_prev").click(goPrev);
			}
			
			if (!(TB_NextHTML === "")) {		
				function goNext(){
					$("#TB_window").remove();
					$("body").append("<div id='TB_window'></div>");
					tb_show(TB_NextCaption, TB_NextURL, imageGroup);				
					return false;	
				}
				$("#TB_next").click(goNext);
				
			}

			document.onkeydown = function(e){ 	
				if (e == null) { // ie
					keycode = event.keyCode;
				} else { // mozilla
					keycode = e.which;
				}
				if(keycode == 27){ // close
					tb_remove();
				} else if(keycode == 190){ // display previous image
					if(!(TB_NextHTML == "")){
						document.onkeydown = "";
						goNext();
					}
				} else if(keycode == 188){ // display next image
					if(!(TB_PrevHTML == "")){
						document.onkeydown = "";
						goPrev();
					}
				}	
			};
			
			tb_position();
			//$("#TB_load").remove();
			$("#TB_ImageOff").click(tb_remove);
			$("#TB_window").css({display:"block"}); //for safari using css instead of show
			};
			
			imgPreloader.src = url;
		}else{//code to show html
			
			var queryString = url.replace(/^[^\?]+\??/,'');
			params = tb_parseQuery( queryString );

			TB_WIDTH = (params['width']*1) || 630; //defaults to 630 if no paramaters were added to URL
			TB_HEIGHT = (params['height']*1) || 440; //defaults to 440 if no paramaters were added to URL
			ajaxContentW = TB_WIDTH;
			ajaxContentH = TB_HEIGHT;
			
			mv = params['mv'];
			
			var id = params['id'];
			var hash;
			if (navigator.userAgent.toLowerCase().indexOf('safari') > -1) {
				hash = "id="+ id;
			} else {
				hash = "#id="+ id;
			}
			
			if(url.indexOf('TB_iframe') != -1){// either iframe or ajax window		
					urlNoQuery = url.split('TB_');
					$("#TB_iframeContent").remove();
					if(params['modal'] != "true"){//iframe no modal
						$("#TB_window").append("<div id='TB_title'><div id='TB_ajaxWindowTitle'>"+caption+"</div><div id='TB_closeAjaxWindow'><a href='#' id='TB_closeWindowButton' title='Close'>close</a></div></div><iframe frameborder='0' hspace='0' src='"+urlNoQuery[0]+"' id='TB_iframeContent' name='TB_iframeContent"+Math.round(Math.random()*1000)+"' onload='tb_showIframe()' style='width:"+(ajaxContentW + 29)+"px;height:"+(ajaxContentH + 17)+"px;' > </iframe>");
					}else{//iframe modal
					$("#TB_overlay").unbind();
						$("#TB_window").append("<iframe frameborder='0' hspace='0' src='"+urlNoQuery[0]+"' id='TB_iframeContent' name='TB_iframeContent"+Math.round(Math.random()*1000)+"' onload='tb_showIframe()' style='width:"+(ajaxContentW + 29)+"px;height:"+(ajaxContentH + 17)+"px;'> </iframe>");
					}
			}else{// not an iframe, ajax
					if($("#TB_window").css("display") != "block"){
						if(params['modal'] != "true"){//ajax no modal
						//$("#TB_window").append("<div id='TB_title'><div id='TB_ajaxWindowTitle'>"+caption+"</div><div id='TB_closeAjaxWindow'><a href='#' id='TB_closeWindowButton'>close</a></div></div><div id='TB_ajaxContent' style='width:"+ajaxContentW+"px;height:"+ajaxContentH+"px'></div>");
						$("#TB_window").append("<div id='TB_header'><div id='TB_ajaxCaption'>"+caption+"</div><div id='TB_closeAjaxWindow'><a href='#' id='TB_closeWindowButton'><img src='../template/imgcmn/box_close.gif' alt='CLOSE' width='11' height='11' border='0'></a></div><br clear='all'></div><div id='TB_ajaxContent' style='width:"+ajaxContentW+"px;height:"+ajaxContentH+"px;'></div>");
						
						}else{//ajax modal
						$("#TB_overlay").unbind();
						$("#TB_window").append("<div id='TB_ajaxContent' class='TB_modal' style='width:"+ajaxContentW+"px;height:"+ajaxContentH+"px;'></div>");	
						}
					}else{//this means the window is already up, we are just loading new content via ajax
						$("#TB_ajaxContent")[0].style.width = ajaxContentW +"px";
						$("#TB_ajaxContent")[0].style.height = ajaxContentH +"px";
						$("#TB_ajaxContent")[0].scrollTop = 0;
						$("#TB_ajaxWindowTitle").html(caption);
					}
			}
					
			$("#TB_closeWindowButton").click(tb_remove);
				if(url.indexOf('TB_inline') != -1){	
					$("#TB_ajaxContent").append($('#' + params['inlineId']).children());
					$("#TB_window").unload(function () {
						$('#' + params['inlineId']).append( $("#TB_ajaxContent").children() ); // move elements back when you're finished
					});
					tb_position();
					//$("#TB_load").remove();
					$("#TB_window").css({display:"block"}); 
				}else if(url.indexOf('TB_iframe') != -1){
					tb_position();
					if($.browser.safari){//safari needs help because it will not fire iframe onload
						//$("#TB_load").remove();
						$("#TB_window").css({display:"block"});
					}
				}else{
					//$("#TB_ajaxContent").load(url += "&random=" + (new Date().getTime()),function(){//to do a post change this load method
					$("#TB_ajaxContent").load(url,function(){//to do a post change this load method
						tb_position();
						//$("#TB_load").remove();
						tb_init("#TB_ajaxContent a.thickbox");
						$("#TB_window").css({display:"block"});
						location.hash = hash;
					});
				}
			
		}

		if(!params['modal']){
			document.onkeyup = function(e){ 	
				if (e == null) { // ie
					keycode = event.keyCode;
				} else { // mozilla
					keycode = e.which;
				}
				if(keycode == 27){ // close
					tb_remove();
				}	
			};
		}
		
	} catch(e) {
		//nothing here
	}
}

//helper functions below
function tb_showIframe(){
	//$("#TB_load").remove();
	$("#TB_window").css({display:"block"});
}

function tb_remove() {
	if (navigator.userAgent.toLowerCase().indexOf('safari') > -1) {
        location.hash="list";
    } else {
        location.hash="#list";
    }
	var swf = document.getElementById('swfcontent');
    if (swf) {
        swf.innerHTML = '<DIV ID="flvplayer"></DIV>';
    }
	
 	$("#TB_imageOff").unbind("click");
	$("#TB_closeWindowButton").unbind("click");
	$("#TB_window").fadeOut("fast",function(){$('#TB_window,#TB_overlay,#TB_HideSelect').trigger("unload").unbind().remove();});
	//$("#TB_load").remove();
	if (typeof document.body.style.maxHeight == "undefined") {//if IE 6
		$("body","html").css({height: "auto", width: "auto"});
		$("html").css("overflow","");
	}
	document.onkeydown = "";
	document.onkeyup = "";
	return false;
}

/*function tb_position() {
	var isIE6 = typeof document.body.style.maxHeight === "undefined";
	jQuery("#TB_window").css({marginLeft: '-' + parseInt((TB_WIDTH / 2),10) + 'px', width: TB_WIDTH + 'px'});
	if ( ! isIE6 ) { // take away IE6
		jQuery("#TB_window").css({marginTop: '-' + parseInt((TB_HEIGHT / 2),10) + 'px'});
	}

	if (typeof document.body.style.maxHeight === "undefined") {
		var TB_height = parseInt(jQuery("#TB_window").height());
		var WD_height = jQuery(window).height();
		var scrTop = jQuery(window).scrollTop();
		var IE6scrTop = 0;

		var TB_width = parseInt(jQuery("#TB_window").width());
		var WD_width = jQuery(window).width();
		var scrLeft = jQuery(window).scrollLeft();
		var IE6scrLeft = 0;

		if(TB_height > WD_height) {
			jQuery('#TB_window').css({top:(scrTop),marginTop:'0'});
		} else {
			jQuery('#TB_window').css({top:'',marginTop: ((IE6scrTop) - parseInt(((TB_height / 2) - scrTop),10)) + 'px'});
		};

		if(TB_width > WD_width) {
			jQuery('#TB_window').css({left:(scrLeft),marginLeft:'0'});
		} else {
			jQuery('#TB_window').css({left:'',marginLeft: ((IE6scrLeft) - parseInt(((TB_width / 2) - scrLeft),10)) + 'px'});
		};
	} else {//all others
		var TB_height = parseInt(jQuery("#TB_window").height());
		var WD_height = jQuery(window).height();
		var scrTop = jQuery(window).scrollTop();

		var TB_width = parseInt(jQuery("#TB_window").width());
		var WD_width = jQuery(window).width();
		var scrLeft = jQuery(window).scrollLeft();

		if(TB_height > WD_height) {
			jQuery('#TB_window').css({top:(scrTop),marginTop:'0',position:'absolute'});
		} else {
			jQuery('#TB_window').css({top:'',marginTop: '-' + parseInt((TB_height / 2),10) + 'px',position:'fixed'});
		};

		if(TB_width > WD_width) {
			jQuery('#TB_window').css({left:(scrLeft),marginLeft:'0',position:'absolute'});
		} else {
			jQuery('#TB_window').css({left:'',marginLeft: '-' + parseInt((TB_width / 2),10) + 'px',position:'fixed'});
		};
	}
}*/

function tb_position() {

	//TB_WIDTH = TB_WIDTH - 30;
	TB_HEIGHT = TB_HEIGHT + 20;
	
	setTimeout(function() {
    	if (TB_WIDTH>=620) {
        	$("#TB_header").css({width:TB_WIDTH+"px", background: "transparent url(../template/imgcmn/tb_header_bg_620.gif) no-repeat scroll left top"});
		} else if (TB_WIDTH>=512) {
        	$("#TB_header").css({width:TB_WIDTH+"px", background: "transparent url(../template/imgcmn/tb_header_bg_512.gif) no-repeat scroll left top"});
		} else if (TB_WIDTH>=500) {
        	$("#TB_header").css({width:TB_WIDTH+"px", background: "transparent url(../template/imgcmn/tb_header_bg_500.gif) no-repeat scroll left top"});
		} else if (TB_WIDTH>=450) {
        	$("#TB_header").css({width:TB_WIDTH+"px", background: "transparent url(../template/imgcmn/tb_header_bg_450.gif) no-repeat scroll left top"});
		} else if (TB_WIDTH>=400) {
        	$("#TB_header").css({width:TB_WIDTH+"px", background: "transparent url(../template/imgcmn/tb_header_bg_400.gif) no-repeat scroll left top"});
    	} else if (TB_WIDTH>=384) {
        	$("#TB_header").css({width:TB_WIDTH+"px", background: "transparent url(../template/imgcmn/tb_header_bg_384.gif) no-repeat scroll left top"});
    	} else if (TB_WIDTH>=325) {
        	$("#TB_header").css({width:TB_WIDTH+"px", background: "transparent url(../template/imgcmn/tb_header_bg_325.gif) no-repeat scroll left top"});
    	} else if (TB_WIDTH>=320) {
        	$("#TB_header").css({width:TB_WIDTH+"px", background: "transparent url(../template/imgcmn/tb_header_bg.gif) no-repeat scroll left top"});
    	} else if (TB_WIDTH>=300) {
        	$("#TB_header").css({width:TB_WIDTH+"px", background: "transparent url(../template/imgcmn/tb_header_bg_300.gif) no-repeat scroll left top"});
    	} else if (TB_WIDTH>=280) {
        	$("#TB_header").css({width:TB_WIDTH+"px", background: "transparent url(../template/imgcmn/tb_header_bg_280.gif) no-repeat scroll left top"});
    	} else if (TB_WIDTH>=260) {
        	$("#TB_header").css({width:TB_WIDTH+"px", background: "transparent url(../template/imgcmn/tb_header_bg_260.gif) no-repeat scroll left top"});
    	} else if (TB_WIDTH>=240) {
        	$("#TB_header").css({width:TB_WIDTH+"px", background: "transparent url(../template/imgcmn/tb_header_bg_240.gif) no-repeat scroll left top"});
    	} else if (TB_WIDTH>=220) {
        	$("#TB_header").css({width:TB_WIDTH+"px", background: "transparent url(../template/imgcmn/tb_header_bg_220.gif) no-repeat scroll left top"});
    	} else if (TB_WIDTH>=210) {
        	$("#TB_header").css({width:TB_WIDTH+"px", background: "transparent url(../template/imgcmn/tb_header_bg_210.gif) no-repeat scroll left top"});
    	} else {
        	$("#TB_header").css({width:TB_WIDTH+"px", background: "transparent url(../template/imgcmn/tb_header_bg.gif) no-repeat scroll left top", margin: "0px 0px 1px 0px", height:"20px"});
            
    	}
    }, 1000);
	
	$("#TB_window").css({marginLeft: '-' + parseInt((TB_WIDTH / 2),10) + 'px', width: TB_WIDTH + 'px'});
	/*if ( !(jQuery.browser.msie && jQuery.browser.version <= 7)) { // take away IE6 & IE7 110216
		$("#TB_window").css({marginTop: '-' + parseInt((TB_HEIGHT / 2),10) + 'px'});
	}*/
	
	// add 110603
	if ( !(jQuery.browser.msie && jQuery.browser.version < 9)) {
		$("#TB_window").css({marginTop: '-' + parseInt((TB_HEIGHT / 2),10) + 'px'});
	}
	
	var TB_height = parseInt($("#TB_window").height());
	var WD_height = $(window).height();
	var scrTop = $(window).scrollTop();
		
	if(TB_height > WD_height) {
		if(scrTop == 0 && jQuery.browser.version == 6){
			$('#TB_window').css({top:(scrTop),marginTop:'1',position:'absolute'});
		}
		else{
			$('#TB_window').css({top:(scrTop),marginTop:'0',position:'absolute'});
		}
	} else {
		if ( !(jQuery.browser.msie && jQuery.browser.version < 9)) {
			$('#TB_window').css({top:'',marginTop: '-' + parseInt((TB_height / 2),10) + 'px',position:'fixed'});
		}else{
			var scrTop = $(window).scrollTop();
			$('#TB_window').css({top:(scrTop),marginTop: parseInt((WD_height / 2) - (TB_height / 2),10) + 'px',position:'absolute'});
			$(window).scroll(function() {
    		$("#TB_window").css("top", $(window).scrollTop() + "px");
			});
		}
	};
	
}

function tb_parseQuery ( query ) {
   var Params = {};
   if ( ! query ) {return Params;}// return empty object
   var Pairs = query.split(/[;&]/);
   for ( var i = 0; i < Pairs.length; i++ ) {
      var KeyVal = Pairs[i].split('=');
      if ( ! KeyVal || KeyVal.length != 2 ) {continue;}
      var key = unescape( KeyVal[0] );
      var val = unescape( KeyVal[1] );
      val = val.replace(/\+/g, ' ');
      Params[key] = val;
   }
   return Params;
}

function tb_getPageSize(){
	var de = document.documentElement;
	var w = window.innerWidth || self.innerWidth || (de&&de.clientWidth) || document.body.clientWidth;
	var h = window.innerHeight || self.innerHeight || (de&&de.clientHeight) || document.body.clientHeight;
	arrayPageSize = [w,h];
	return arrayPageSize;
}

function tb_detectMacXFF() {
  var userAgent = navigator.userAgent.toLowerCase();
  if (userAgent.indexOf('mac') != -1 && userAgent.indexOf('firefox')!=-1) {
    return true;
  }
}


