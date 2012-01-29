// Percent Bar - Version 1.0
// Author: Brian Gosselin of http://scriptasylum.com
// Script featured on http://www.dynamicdrive.com
// Note: Modified by Dynamicdrive so incr/decrCount() accepts any percentage

// rjh: from:
// http://www.dynamicdrive.com/dynamicindex11/dhtmlprogress2.htm

var loadedcolor='navy' ;            // PROGRESS BAR COLOR
var unloadedcolor='lightgrey';      // BGCOLOR OF UNLOADED AREA
var barheight=15;                   // HEIGHT OF PROGRESS BAR IN PIXELS
var barwidth=350;                   // WIDTH OF THE BAR IN PIXELS
var bordercolor='black';            // COLOR OF THE BORDER

// THE FUNCTION BELOW CONTAINS THE ACTION(S) TAKEN ONCE BAR REACHES 100%.
// IF NO ACTION IS DESIRED, TAKE EVERYTHING OUT FROM BETWEEN THE CURLY BRACES ({})
// BUT LEAVE THE FUNCTION NAME AND CURLY BRACES IN PLACE.
// PRESENTLY, IT IS SET TO DO NOTHING, BUT CAN BE CHANGED EASILY.
// TO CAUSE A REDIRECT, INSERT THE FOLLOWING LINE IN BETWEEN THE CURLY BRACES:
// window.location="http://redirect_page.html";
// JUST CHANGE THE ACTUAL URL IT "POINTS" TO.

var action=function()
{
//window.location="http://www.dynamicdrive.com
}

//*****************************************************//
//**********  DO NOT EDIT BEYOND THIS POINT  **********//
//*****************************************************//

var w3c=(document.getElementById)?true:false;
var ns4=(document.layers)?true:false;
var ie4=(document.all && !w3c)?true:false;
var ie5=(document.all && w3c)?true:false;
var ns6=(w3c && navigator.appName.indexOf("Netscape")>=0)?true:false;
var blocksize=(barwidth-2)/100;
barheight=Math.max(4,barheight);
var loaded=0;
var perouter=0;
var perdone=0;
var pertxt=0;
var txt='';
if(ns4){
    txt+='<table cellpadding=0 cellspacing=0 border=0>';
    txt+='<tr><td>Please Wait. Loading bobMonitor...</td></tr><tr><td>';
    txt+='<ilayer name="perouter" width="'+barwidth+'" height="'+barheight+'">';
    txt+='<layer width="'+barwidth+'" height="'+barheight+'" bgcolor="'+bordercolor+'" top="0" left="0"></layer>';
    txt+='<layer width="'+(barwidth-2)+'" height="'+(barheight-2)+'" bgcolor="'+unloadedcolor+'" top="1" left="1"></layer>';
    txt+='<layer name="perdone" width="'+(barwidth-2)+'" height="'+(barheight-2)+'" bgcolor="'+loadedcolor+'" top="1" left="1"></layer>';
    txt+='</ilayer>';
    txt+='</td></tr></table>';
} else {
    txt += '<div id="perouter" onmouseup="hidebar()" style="position:absolute; top:200px; left:200px; visibility:hidden; background-color:'+bordercolor+'; width:'+barwidth+'px; height:'+barheight+'px;">';
    txt +=   '<div style="position:absolute; top:1px; left:1px; width:'+(barwidth-2)+'px; height:'+(barheight-2)+'px; background-color:'+unloadedcolor+'; z-index:100; font-size:1px;"></div>';
    txt +=   '<div id="perdone" style="position:absolute; top:1px; left:1px; width:0px; height:'+(barheight-2)+'px; background-color:'+loadedcolor+'; z-index:100; font-size:1px;"></div>';
    // table with background colour
    //txt +=   '<div id="pertxt" style="opacity:0.85; z-index:100; position:absolute; top:' + barheight*1.5 + 'px;"><table><tr><td bgcolor="#eeeeee" align="center"><font size=30px>Please Wait...<br> Doing Initial Load of <font color="orange">bobMonitor</font></font></td></tr></table></div>';
    // table (for centering) with no bg and shadow effect
    txt +=   '<div id="pertxt" style="position:absolute; top:' + barheight*1.5 + 'px; width:' + barwidth + 'px;">';
    txt +=     '<div style="z-index:100; position:absolute; top:0px; left:0px;"><table><tr><td align="center"><font size=30px color="black">Please Wait...<br> Doing Initial Load of <font color="orange">bobMonitor</font></font></td></tr></table></div>';
    txt +=     '<div style="z-index:50;  position:absolute; top:1px; left:2px; opacity:0.7;"><table><tr><td align="center"><font size=30px color="white">Please Wait...<br> Doing Initial Load of <font color="white">bobMonitor</font></font></td></tr></table></div>';
    txt +=   '</div>'
    txt += '</div>';
}

document.write(txt);

function incrCount(prcnt){
    loaded+=prcnt;
    setCount(loaded);
}

function decrCount(prcnt){
    loaded-=prcnt;
    setCount(loaded);
}

function setCount(prcnt){
    //alert( 'setCount(' + prcnt + ')' );
    moveToMiddle();
    loaded=prcnt;
    if(loaded<0)loaded=0;
    if(loaded>=100){
	loaded=100;
	setTimeout('hidebar()', 400);
    }
    clipid(perdone, 0, blocksize*loaded, barheight-2, 0);
}

//THIS FUNCTION BY MIKE HALL OF BRAINJAR.COM
function findlayer(name,doc){
    var i,layer;
    for(i=0;i<doc.layers.length;i++){
	layer=doc.layers[i];
	if(layer.name==name)return layer;
	if(layer.document.layers.length>0)
	    if((layer=findlayer(name,layer.document))!=null)
		return layer;
    }
    return null;
}

function moveToMiddle() {
    perouter.style.top = 0.4*window.innerHeight + window.pageYOffset; // middle of the browser page
    perouter.style.left = 0.5*window.innerWidth + window.pageXOffset - 0.5*barwidth;
}

function progressBarInit(doMsg){
    perouter=(ns4)?findlayer('perouter',document):(ie4)?document.all['perouter']:document.getElementById('perouter');
    moveToMiddle();
    perdone=(ns4)?perouter.document.layers['perdone']:(ie4)?document.all['perdone']:document.getElementById('perdone');
    pertxt=(ns4)?perouter.document.layers['pertxt']:(ie4)?document.all['pertxt']:document.getElementById('pertxt');
    clipid(perdone,0,0,barheight-2,0);
    if ( doMsg ) {
	(ns4)? pertxt.visibility="show" : pertxt.style.visibility="visible";
    } else {
	(ns4)? pertxt.visibility="hide" : pertxt.style.visibility="hidden";
    }
    (ns4)? perouter.visibility="show" : perouter.style.visibility="visible";
}

function hidebar(){
    //action();
    (ns4)? perouter.visibility="hide" : perouter.style.visibility="hidden";
    (ns4)? pertxt.visibility="hide" : pertxt.style.visibility="hidden";
}

function clipid(id,t,r,b,l){
    if(ns4){
	id.clip.left=l;
	id.clip.top=t;
	id.clip.right=r;
	id.clip.bottom=b;
    }else
	id.style.width=r;
}

//window.onload=progressBarInit;

//window.onresize=function(){
//if(ns4)setTimeout('history.go(0)' ,400);
//}
