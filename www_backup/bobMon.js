<!-- Hide script from non-JavaScript browsers

// (c) Robin Humble - 2003-2012
// Licensed under the GPL v3

config = new bobMonitorConf();

// key press
document.onkeypress = doKeyPress;

// server to client API version
api = 10;

// about this code
aboutURL = 'https://github.com/plaguedbypenguins/bobMonitor'

// map for refresh slider between 0->10 and a pseudo logarithmic scale in seconds
var steps = [ 5, 10, 20, 60, 120, 300, 600, 1200, 1800, 3600 ];

// colours
var loadBWbg = [ '#f0f0f0', '#d7d7d7', '#bebebe', '#a5a5a5', '#8c8c8c', '#737373', '#5a5a5a', '#414141', '#282828', '#000000', '#ff0000' ];
var loadColours = ['#b8f977', '#d5f977', '#e4f977', '#f5f977', '#f9ef77', '#f9db77', '#f9ca77', '#f9b677', '#f99877', '#f97c77' ];
var jobColoursBg = [ 'cyan', 'indigo', 'orange', 'blue', 'fuchsia', '#f9db77', 'green', 'lime', 'maroon', 'navy', 'olive', 'purple', 'red', '#b8f977', 'teal', 'yellow' ];
var jobColoursFg = [ 'black', 'white', 'black', 'white', 'black', 'black', 'white', 'black', 'white', 'white', 'black', 'white', 'white', 'black', 'black', 'black' ];
var jobColoursBWbg = [ '#f0f0f0', '#d7d7d7', '#bebebe', '#a5a5a5', '#8c8c8c', '#737373', '#5a5a5a', '#414141', '#282828' ];
var jobColoursBWfg = [ 'black', 'black', 'black', 'black', 'black', 'black', 'white', 'white', 'white' ];
var tempColoursBg = []; // set in makeColourMap
var reservationColours = [ 'red', 'blue', 'orange', 'black', 'purple', 'indigo' ];
var reservationColoursBg = [ '#ffaaaa', '#aaaaff', '#aaddff', '#666666', '#ddaaff', '#ddaaff' ];
var downColour = '#f97c77';
var headerBgColour = '#888888';
var headerFgColour = 'white';
var noTempColour = '#000000';
var networkColour = 'white';
var networkSharedColour = '#999999';
var colourMaps = [];  // an array of colour maps to choose from
var colourMap; // the current colour map
var colourMapName; // the name of the current colour map
var shelfColourMap; // the current colour map for the blade chassis power, fans
var rackSummaryColour = '#666666';

var connectionTimeoutMultiple = 1; // multiple of the refresh rate...
var connectionTimeout = 30000; // ... plus this, to wait before declaring the link dead

var reconnectTime = 30000; // retry every 30s if the link is down
var reconnectUpdateTime = 1000; // time in ms
var refreshCountDownInterval = 1000;  // time in ms

var items = []; // list of all the node table td objects


/////////////////////////////////////////////
//
// Leave everything below alone unless you really know what you are doing
//
/////////////////////////////////////////////


// names of the text fields sent to us by the server
var txtNames = [ 'stats' ];

var req;
var win;

var fns = [];
var allFns = [];
var progressIncr;
var start = 0;
var delay = 200;
var doIncrs = 1;

var allNodes = [];


// init prev variables
var prevJobs, prevLoads, prevShow, prevCpu, prevGpu, prevMem;
var prevUp, prevDiskWarnMap, prevDiskWarn, prevTempWarnMap, prevTempWarn;
var prevPbsNodesMap, prevPbsNodes, prevReservations, pieColours;
var prevNodes, prevRunning, prevSuspended, prevQueued, prevBlocked;
var prevNetwork, prevAverages; // , prevAveragesMap;
var prevPower, prevFans;
// for heavy mode
var prevDisk, prevTemp, prevTempMap, tempChanged;
var numCores, numGpus, gmondGroupMap;

var jobsMap = [];

var statusText = '';
var errStr = '';
var numCpuChanged = 0;
var percCpuChanged = 0;
var numGpuChanged = 0;
var percGpuChanged = 0;
var percTempChanged = 0;
var percToolTipChange = '';
var pieChanged = 0;
var refreshSlider;
var tempSlider;
var aspectSlider;
var aspectSliderVal;
var orientSlider;
var headLabelCnt = 0;

var first = 1;

var nodeOrientation = 1;    // don't call this 'orientation' as that name is used by android's browser
var currentMode = 'normal-usr';
var nextMode = currentMode;

var refresh = 0;
var prevRefresh = 0;
var nextRefresh = 0;
var refreshTimeToGo = 0;
var tsPrev = 0;
var tsUtcPrev = '';

// these are set from the aspectSlider
numCols = 0;
numRows = 0;


// TODO:
//   rearrange server:
//       lower bandwidth mode
//         ... just send differences (relative to some timestamped copy) to the client
//
//   enhanced client modes:
//       separate window (iframe? frame? popup?) for ganglia host mode clicks on nodes
//       clickable job names to allow just a view of some persons jobs... ??
//
//   general:
//       add server down timeout or at least an alert - prob not - don't want to hammer things
//         ... could be implented as a warning that says maybe the network went
//             down, and a button to attempt a reget of the data
//       lite modes: don't need to request all data: pass args to catBobData to request less data?
//       request cpu bar info more frequently than the rest?
//       landscape html version - all info tables still layed out badly, node tables need rearranging too?
//       allow users to build own selection of elements for a custom view
//       look at svg for pies
//       per-user showbf in the bobMon prefs?

// do getElementById caching for popups to make the refreshes quicker.
//    create doc in diff way - need to use
//    div graphics for this? nah, but might be easier
// click on user -> new page of html for user (via cgi-bin so uniq url?)
//    use same bobMon.js code for it all
//    layout prob just node bars underneath table header?
// gather stats and put into db. compute running per job average and write at
//    end to db

// BUGS:
//       layout of tables seems have historesis.
//         eg. normal -> sub-lite -> landscape   !=    normal -> landscape -> sub-lite
//         - if make width=0 as well as height=0 then this should go away
//       in heavy mode if a user's pie colour changes then need to redraw _all_ that persons job tables to match
//         - ie. if the colours vector changes then need to re-colour all jobs
//       tooltip falls off bottom of page - incorrect size guess?
//         - do position calcn's after know size of popup?


function minFn(x,y) { return ( (x) < (y) ? (x) : (y) ); }
function maxFn(x,y) { return ( (x) > (y) ? (x) : (y) ); }


// http://stackoverflow.com/questions/2998784/how-to-output-integers-with-leading-zeros-in-javascript
function pad(num, size) {
    var s = num+'';
    while (s.length < size) s = '0' + s;
    return s;
}

function expandNodeExpr(ne) {
    // eg.
    //    pbs -> [ pbs ]
    //    v[1-1492] -> [ v1, v2, ... ]
    //    x[003-007,100-200]-ib -> [ x003-ib, ... ]

    // prefix
    var s = ne.split('[');
    if ( s.length > 2 )
        return [];
    var pre = s[0];
    if (pre.length == 0)
	return [];
    if (s.length == 1) // there is no node range
        return [ pre ];
    // suffix
    var s = ne.split(']');
    if (s.length != 2)
	return [];
    var suf = s[1];

    var n = [];

    // node range
    var idx = s[0].split('[')[1];    // eg. 003-007,100-200  or 1-2,7-9
    for ( var ii=0; ii < idx.split(',').length; ii++) {   // eg. 003-007
	var i = idx.split(',')[ii];
	var s = i.split('-');
        //assert(s.length == 2);
	var i0 = s[0];
        var i1 = s[1];
        // see if there is formatting involved
        var formatLen = 0;
	var i00 = '' + parseInt(i0, 10);
        if ( i00.length != i0.length ) {
            formatLen = i0.length;
            // assert(len(i0) == len(i1))
	}
        for ( var j=parseInt(i0, 10); j < parseInt(i1, 10)+1; j++ ) {
            if ( formatLen ) {
                var k = pad(j, formatLen);
                n.push( pre + k + suf );
	    }
            else {
                n.push( pre + j + suf );
	    }
	}
    }
    return n;
}

function expandAllNodeRanges() {
    // allNodes = computeNodes + non-backend nodes
    allNodes = [].concat(config.cn);
    Array.prototype.push.apply(allNodes, config.nben);

    // expand specialRows
    var sr = [];
    for (var i=0; i < config.specialRows.length; i++) {
	sr[i] = [];
	var jj = 0;
	for (var j=0; j < config.specialRows[i].length; j++ ) {
	    // row[i] is eg. [ ['login','head'],['g2','node'],[''],['infra- structure','head'],['pbs','node'],['ldap[1-2]','node'] ]
	    if (config.specialRows[i][j].length == 1 || config.specialRows[i][j][1] == 'head') { // just copy
		sr[i][jj++] = config.specialRows[i][j];  // eg. ['login','head'] or ['']
	    }
	    else { // expand node list
		if (config.specialRows[i][j][1] != "node")
		    addErr('specialRows pair is not X,node' + config.specialRows[i][j]);
		// eg. ['g2','node']  -> ['g2','node']
		// or  ['ldap[1-2]','node']  -> ['ldap1','node'],['ldap2','node']
		var expanded = expandNodeExpr(config.specialRows[i][j][0]);
		for (var k=0; k < expanded.length; k++)
		    sr[i][jj++] = [ expanded[k], 'node' ];
	    }
	}
    }
    config.sr = sr;
}

function initVars() {
    // init prev variables
    prevJobs = [];
    prevLoads = [];
    prevShow = [];
    prevCpu = [];
    prevGpu = [];
    prevMem = [];
    prevUp = [];
    prevDiskWarnMap = [];
    prevDiskWarn = [];
    prevTempWarnMap = [];
    prevTempWarn = [];
    prevPbsNodesMap = [];
    prevPbsNodes = [];
    prevReservations = [];
    pieColours = [];
    prevRunning = [];
    prevSuspended = [];
    prevQueued = [];
    prevBlocked = [];
    prevNetwork = [];
    prevAverages = [];
    //prevAveragesMap = [];
    prevPower = [];
    prevFans = [];

    // for heavy mode
    prevDisk = [];
    prevTemp = [];
    prevTempMap = [];
    tempChanged = [];

    numCores = [];
    numGpus = [];
    gmondGroupMap = [];

    prevNodes = [];
    for(var i=0;i<allNodes.length;i++)
        prevNodes[allNodes[i]] = [];
}


function nodeTitle( n ) {
    // return n if it's not a compute node
    i = config.nben.indexOf(n);
    if ( i != -1 )
	return n;
    // double check
    i = config.cn.indexOf(n);
    if ( i == -1 )
	return n;

    // figure out rack and shelf of compute nodes
    num = i;  // node index

    // eg. racks = [ [42,'pizza'], [96,['blade',24,1]], [96,['blade',12,2]], ['fe','pizza'] ]
    running = 0;
    ret = n;
    //ret += ', num ' + num;
    found = 0;
    for (var rack=0; rack<config.racks.length; rack++ ) {
	r = config.racks[rack];
	if ( r[0] == 'fe' ) continue;

        running += r[0];
        if ( num <= running ) {
	    ret += ', rack ' + (rack+1);
	    found = 1;
        }

        if ( !found ) continue;

	// if it's a blade then figure out the shelf
	if ( r[1].length == 3 && r[1][0] == 'blade' ) {   // eg. [96,['blade',12,2]]
	    blades = r[1][1];                             // eg. 12 blades per shelf
	    nodesPerBlade = r[1][2];                      // eg. 2
	    //shelves = r[0]/(blades*nodesPerBlade);        //  => 4 shelves per rack

	    shelfIndex = parseInt(num/(blades*nodesPerBlade));
	    if (shelfIndex < 0 || shelfIndex > config.shn.length-1)
		addErr( 'shelf index ' + shelfIndex + ' out of range' );
	    else
		ret += ', ' + config.shn[shelfIndex];
	}
	return ret;
    }
    return n;
}

function writeNodeTable( n ) {
    title = '';

    // this might not always work, depending how ganglia sees node names
    if ( ! isComputeNode(n) )
	title = n;

    txt  = '<table cellpadding=0 cellspacing=0 border=0>';
    txt +=   '<tr><td><div id="' + n + '_warn">' + title + '</div></td></tr>';
    txt +=   '<tr><td><table cellpadding=0 cellspacing=0 border=0><tr>';
    txt +=     '<td><div id="' + n + '_temps"></div></td>';
    txt +=     '<td id="' + n + '_l_bg"><a title="' + nodeTitle( n ) + '" id="' + n + '_l" target="_new"></a></td>';
    txt +=     '<td><div id="' + n + '_job"></div></td>';
    txt +=   '</tr></table></td></tr>';
    txt +=   '<tr><td NOWRAP><img id="' + n + '_u" src="' + config.gifDir + 'blue.gif" width=0 height=0><img id="' + n + '_w" src="' + config.gifDir + 'yellow.gif" width=0 height=0><img id="' + n + '_s" src="' + config.gifDir + 'red.gif" width=0 height=0><img id="' + n + '_i" src="' + config.gifDir + 'green.gif" width=0 height=0></td></tr>';
    txt +=   '<tr><td NOWRAP><img id="' + n + '_g" src="' + config.gifDir + 'orange.gif" width=0 height=0></td></tr>';
    txt +=   '<tr><td NOWRAP><img id="' + n + '_m" src="' + config.gifDir + 'green.gif" width=0 height=0></td></tr>';
    txt +=   '<tr><td NOWRAP><img id="' + n + '_d" src="' + config.gifDir + 'black.gif" width=0 height=0></td></tr>';
    // networking stuff for each node that we're not using yet
    //txt +=   '<tr><td NOWRAP><div style="position:relative;">';  // byte rate
    //txt +=       drawNet( n + '_n', 0, netBytePixelThresh, 'black', -1, 0, '', 0 );
    //txt +=   '</div></td></tr>';
    //txt +=   '<tr><td NOWRAP><div style="position:relative;">';  // packet rate
    //txt +=       drawNet( n + '_np', 0, netPktsPixelThresh, 'red', -1, 0, '', 0 );
    //txt +=   '</div></td></tr>';
    txt += '</table>';

    return txt;
}

function writeHeaderTable( title, n, span ) {
    width = 50*span;
    txt  = '<td colspan=' + span + '>';
    txt +=   '<table cellpadding=2 cellspacing=0 border=0>';
    txt +=     '<tr><td bgcolor="' + headerBgColour + '" width=' + width + '><font color="' + headerFgColour + '">' + title + '</font>';
    if ( span <= 1 )
	txt += '<br>';
    txt +=       '<table><tr><td id="load_' + n + '"></td></tr></table>';
    txt +=     '</td></tr>';
    txt += '  </table>';
    txt += '</td>';
    txt += '\n';

    return txt;
}

function doSpecialElements( row, i ) {
    if ( i >= row.length )
	return '';

    widgy = row[i];

    if ( widgy.length == 1 ) // blank
	return '';

    name = widgy[0];
    type = widgy[1];

    if ( type == 'node' )
	return '<td>' + writeNodeTable( name ) + '</td>';
    else if ( type == 'head' ) {
	title = name;
	if ( name == 'head' && config.showRackLoads )
             return writeHeaderTable( title, name, 1 );
        if ( name == 'key' )
	    return writeHeaderTable( title, name, 1 );
	if ( name == 'i/o' )
	    name = 'io';
	else {
	    name = 'blah' + headLabelCnt;
	    headLabelCnt++;
	}
	return writeHeaderTable( title, name, 1 );
    }
    else if ( type == 'txt' )
	// return '<td><div id="text_' + name + '"></div></td>';
	return '<td></td>';
    else
	alert( 'unknown special column type: "' + type + '", with name "' + name + '"' );

    return '';
}


var connectTimeout = 0;
var reConnectTimeout = 0;
var reconnectCountDown = 0;

function setConnectTimeout() {
    if ( connectTimeout ) clearTimeout( connectTimeout );
    var dt = connectionTimeoutMultiple*refresh;
    dt += connectionTimeout;
    connectTimeout = setTimeout( 'connectAlert();', dt );
}

function clearConnectAlert() {
    var d = document.getElementById( "notify" );
    d.style.visibility = 'hidden';
}

function reConnectTimer(first) {
    if (first)
	reconnectCountDown = reconnectTime;
    else
	reconnectCountDown -= reconnectUpdateTime;

    updateReconnectTimer(reconnectCountDown/1000);

    if (reconnectCountDown <= 0 ) {
        setReconnectLabel( 'Reconnecting...' );
	GetAsyncData();
    }
    else
	reConnectTimeout = setTimeout( 'reConnectTimer(0);', reconnectUpdateTime );
}

function setReconnectLabel(s) {
    var d = document.getElementById( "reconnectTimer" );
    if (d)
	d.innerHTML = s;
}

function updateReconnectTimer(t) {
    setReconnectLabel( 'Will retry in ' + floatAsStr(t,0) + 's' );
}

function stopReconnecting() {
    setReconnectLabel( 'Reconnections disabled' );
    if ( reConnectTimeout ) clearTimeout( reConnectTimeout );
}

function connectAlert() {
    var d = document.getElementById( "notify" );
    d.style.top = window.innerHeight/2 - 200 + window.pageYOffset;
    d.style.left = window.innerWidth/2 - 250 + window.pageXOffset;
    updateReconnectTimer(reconnectTime/1000);
    d.style.visibility = 'visible';
    reConnectTimeout = setTimeout( 'reConnectTimer(1);', reconnectUpdateTime );
}

function resetRefreshCountDownTimer( r ) {
    var d = document.getElementById( "countdown-1" );
    if ( r == 0 )
       d.style.width = '0%';
    else
       d.style.width = '100%';
    refreshTimeToGo = r;
}

function refreshCountDownTimer() {
    refreshTimeToGo -= refreshCountDownInterval;
    var d = document.getElementById( "countdown-1" );
    var p = 100*refreshTimeToGo/refresh;
    p = parseInt(p); // now an int
    if ( p < 0 ) p = 0;
    if ( p > 100 ) p = 100;
    d.style.width = p.toString() + '%';
}

var timeoutCookie;
var timeoutCookieTime = 1000;  // wait a short time after the slider's stopped moving, and then set a cookie
cookieName = 'bobMon-' + config.cookieSuffix;

// set a cookie if the prefs have changed
function setRefreshCookie() {
    if ( timeoutCookie ) clearTimeout( timeoutCookie );

    if ( !first ) {
	setPrefs();

	if ( refresh != prevRefresh ) {
	    // refresh has changed. so cancel the next update and reschedule it for the correct time
	    if ( nextRefresh ) clearTimeout( nextRefresh );
	    nextRefresh = setTimeout( 'GetAsyncData()', refresh );  // time in ms
	    resetRefreshCountDownTimer( refresh );

	    prevRefresh = refresh;
	}
    }
}

function sliderToSeconds( val ) {
   if ( val < 0 ) val = 0;
   if ( val > steps.length-1 ) val = steps.length-1;

   refresh = 1000*steps[val];
   return steps[val];
}

function inputToSlider( val ) {
   if ( val < steps[0] ) val = steps[0];
   if ( val > steps[steps.length-1] ) val = steps[steps.length-1];

   // find nearest
   var prevDiff = 99999;
   var best = 0;
   for ( var i = 0; i < steps.length; i++ ) {
      diff = Math.abs(val - steps[i]);
      if ( diff < prevDiff ) {
	 best = i;
	 prevDiff = diff;
      }
   }
   refresh = 1000*steps[best];
   return best;
}

function buildRefreshSlider( initialValue ) {
    refreshSlider = new Slider(document.getElementById("slider-1"), document.getElementById("slider-input-1"));

    refreshSlider.onchange = function () {
	if ( timeoutCookie ) clearTimeout( timeoutCookie );

	var txt = '';
	var scale = 0;
	var unit = '';
	var h = document.getElementById("h-value-1");
	var s = sliderToSeconds(refreshSlider.getValue());
	if ( s >= 3600 ) {
	   scale = 3600;
	   unit = 'hour';
	}
	else if ( s >= 60 ) {
	   scale = 60;
	   unit = 'min';
	}
	else {
	   scale = 1;
	   unit = 'sec';
	}
	var t = parseInt(s/scale);
	txt = '' + t + unit;
	if ( t > 1 ) txt += 's';
	h.innerHTML = txt;

	timeoutCookie = setTimeout( "setRefreshCookie();", timeoutCookieTime );
    };

    refreshSlider.setMaximum(9); // 0 to 9
    refreshSlider.setValue( initialValue );
    refreshSlider.onchange();
}

function findColourMap( name ) {
    for (var i=0; i < colourMaps.length; i++ )
	if ( name == colourMaps[i][0] ) // we have a winner
	    return i;
    return -1;
}

function buildTempSlider( initialValue ) {
    tempSlider = new Slider(document.getElementById("slider-2"), document.getElementById("slider-input-2"));

    tempSlider.onchange = function () {
        if ( timeoutCookie ) clearTimeout( timeoutCookie );

	var v = tempSlider.getValue();
	var m = colourMaps[v];

	colourMapName = m[0];
	colourMap = m[1];

	updateAllTempPowerDivs();

        var d = document.getElementById( "rackTempsColorBar" );
	d.innerHTML = drawRackTempScale();

	timeoutCookie = setTimeout( "setRefreshCookie();", timeoutCookieTime );
    };

    tempSlider.setMaximum(colourMaps.length - 1);
    tempSlider.setValue( findColourMap( initialValue ) );
    tempSlider.onchange();
}

function buildOrientSlider(initOrient) {
    orientSlider = new Slider(document.getElementById("slider-4"), document.getElementById("slider-input-4"));

    orientSlider.onchange = function () {
        if ( timeoutCookie ) clearTimeout( timeoutCookie );

	nodeOrientation = orientSlider.getValue();   // 1 to 8
	displayOrient(document.getElementById("h-value-4"));

	timeoutCookie = setTimeout( "setRefreshCookie();", timeoutCookieTime );
    };

    orientSlider.setMinimum(1);
    orientSlider.setMaximum(8);
    orientSlider.setBlockIncrement(1);
    orientSlider.setValue(initOrient);
}

function buildAspectSlider( initAspectSliderVal ) {
    aspectSlider = new Slider(document.getElementById("slider-3"), document.getElementById("slider-input-3"));

    aspectSlider.onchange = function () {
        if ( timeoutCookie ) clearTimeout( timeoutCookie );

	var v = aspectSlider.getValue();   // 0 to 99
        aspectSliderVal = v;
        var v = (v + 0.1)/100.0;               // 0 < v < 1
        var radians = 0.5*3.1415926536*v;  // 0 < radians < pi/2
        // we want linear steps in the slider to be ~equal angles to the far corner of the grid.
        // call the slider values theta, then equal area of grid means x*y = nodes,
        // and x = y/tan(theta), so  x = sqrt(nodes/tan(theta))
        var N = config.cn.length;
//        var N = config.cn.length/2; // multi-layer hack
	numCols = parseInt(Math.sqrt(N/Math.tan(radians)));
        if ( numCols < 1 ) numCols = 1;
        if ( numCols > N ) numCols = N;
 	numRows = parseInt(N/numCols);
	if (numCols*numRows < N) numRows++;
	// trim cols back to the minimum:
        while (numCols*numRows >= N + numRows ) {
	    numCols--;
        }
	// shouldn't happen:
	if (numCols*numRows < N) numCols++;

	var h = document.getElementById("h-value-3");
        h.innerHTML = numCols + 'x' + numRows;

	// if table re-builds were super fast, then could do it directly here:
        //redrawNodesTable(0); // not first

	timeoutCookie = setTimeout( "setRefreshCookie();", timeoutCookieTime );
    };

    aspectSlider.setMinimum(0);
    aspectSlider.setMaximum(99);
    aspectSlider.setValue(initAspectSliderVal);
}


rackWidth = 60;
nodeHeight = 5;
shelfHeight = 80; // a blade shelf
shelfSpacing = 2;
nodeSpacing = 0;
rackSpacing = 2;
rackStyle = 'quad'; // or 'cpu', 'both' == 2, 'quad' == 4
rackShrink = 0.75; // in 'both' mode, the proportion cpu div is of the node
rackLeft = 120;
rackTempsShift = 80;

function makeColourMaps() {
    len = 64;
    var gbrMap = [];
    var bgrMap = [];
    var pwMap = [];
    var brMap = [];
    var bwMap = [];
    var bwAlightMap = [];
    var heatMap = [];
    var aliasMap = [];

    for ( var i=0; i < len; i++ ) {
	x = i/(len - 1.0);

	// green blue red
	gbrMap[i] = floatsToHex( hsvToRgb( (1.0 + 2.0*x)/3.0, 1.0, 1.0 ) );

	// blue green red
	bgrMap[i] = floatsToHex( hsvToRgb( (2.0 - 2.0*x)/3.0, 1.0, 1.0 ) );

        // rjh - this is just weird: merz: eg. pink to white
	pwMap[i] = floatsToHex( hsvToRgb( 1.0, (2.0 - 2.0*x)/3.0,  1.0 ) );
	
	// blue to red
	brMap[i] = floatsToHex( [ x, 0, (1.0 - x) ] );

	// black -> white
	bwMap[i] = floatsToHex( [ x, x, x ] );

	// black -> white, yellow -> red at top
	thresh = 0.8;
	if ( x < thresh )
	    bwAlightMap[i] = floatsToHex( [ x, x, x ] );
	else
	    bwAlightMap[i] = floatsToHex( [ 1.0, (1.0 - x)/(1.0 - thresh), 0.0 ] );

	// heat
	heatMap[i] = floatsToHex( [ minFn(2*x,1.0), maxFn(minFn(2*(x-0.3333),1.0),0.0), maxFn(minFn(2*(x-0.66666),1.0),0.0) ] );

	// alias
	aliasMap[i] = floatsToHex( hsvToRgb( (5.0*x) % 1.0, 1, 1 ) );
    }
    colourMaps = [ ['gbr', gbrMap], ['bgr', bgrMap], ['pw', pwMap], ['br', brMap], ['bw', bwMap], ['bwAlight', bwAlightMap], ['heat', heatMap], ['alias', aliasMap] ];
    colourMap = bgrMap; // default
    tempColoursBg = brMap;
}

function hsvToRgb( h, s, v ) {
    // takes h,s,v in the range 0->1, returns r,g,b in the range 0->1

    if ( s == 0.0 )
	return [ v, v, v ];

    if ( h == 1.0 )
	h = 0.0;

    h *= 6.0;
    ih = 0 + parseInt(Math.floor(h));
    f = h - ih;
    m = v*(1.0 - s);
    n = v*(1.0 - s*f);
    k = v*(1.0 - s*(1.0 - f));

    if ( ih == 0 )
	return [ v, k, m ];
    else if ( ih == 1 )
	return [ n, v, m ];
    else if ( ih == 2 )
	return [ m, v, k ];
    else if ( ih == 3 )
	return [ m, n, v ];
    else if ( ih == 4 )
	return [ k, m, v ];
    else if ( ih == 5 )
	return [ v, m, n ];

    return [0,0,0]
}

// convert [r,g,b] in 0->1 into #00->ff,00->ff,00->ff
function floatsToHex( a ) {
    var c = '#';
    for ( var i=0; i < a.length; i++ ) {
	var d = d2h(parseInt(255.0*a[i]));
	while ( d.length < 2 )
	    d = '0' + d;
	c += d;
    }
    return c;
}

// the below two fns are from  http://javascript.about.com/library/blh2d.htm

function d2h(d) {
    var hD = '0123456789abcdef';
    var h = hD.substr(d&15,1);
    while(d > 15) {
	d >>= 4;
	h = hD.substr(d&15,1)+h;
    }
    return h;
}

function h2d(h) {
    return parseInt(h,16);
}

function drawTempScale( minT, maxT, topLabel, midLabel, botLabel ) {
    var steps = 100;
    var width = 5;
    var size = 100;

    var height = size/steps;

    txt = '';
    txt += '<div style="position:absolute; font-size: 70%; left:' + (5-topLabel.length/3) + 'em;">' + topLabel + '</div>';
    var offset = 10;
    for (var i = 0; i < steps; i++ ) {
	var top = (steps + 1.5 - i)*height + offset;
	var t = minT + (maxT - minT)*i/(steps-1);
	txt += '<div style="position:absolute; background-color:' + tempToColour(t, colourMap, minT, maxT) + '; height:' + height + 'px; width:' + width + 'px; top:' + top + 'px;"></div>';
    }
    txt += '<div style="position:absolute; font-size: 70%; left:-2.5em; top:' + ((offset + (steps + 2.5)*height)+offset)/2 + 'px;">' + midLabel + '</div>';
    txt += '<div style="position:absolute; font-size: 70%; left:' + (5-botLabel.length/3) + 'em; top:' + (offset + (steps + 2.5)*height) + 'px;">' + botLabel + '</div>';

    return txt;
}

function drawPizzaTempDiv( n, height, width, y ) {
    var txt = '';

    txt += '<a target="_new" id="temp_' + n + '">';

    if ( rackStyle == 'cpu' )
	txt += '<div id="rack_cpu_' + n + '" title="' + n + '" style="position:absolute; height:' + height + 'px; width:' + width + 'px; top:' + y + 'px;"></div>';
    else if ( rackStyle == 'both' ) {
        txt += '<div id="rack_mb_' + n + '" title="' + n + '" style="position:absolute; height:' + height + 'px; width:' + width + 'px; top:' + y + 'px;"></div>';
	txt += '<div id="rack_cpu_' + n + '" title="' + n + '" style="position:absolute; height:' + (height*rackShrink) + 'px; width:' + (width*rackShrink) + 'px; top:' + (y + (0.5*height*(1.0 - rackShrink))) + 'px; left:' + (0.5*width*(1.0 - rackShrink)) + 'px;"></div>';
    }
    else { // quad
        dh = parseInt(0.5*(height - rackShrink*height));
        if ( dh == 0 ) { dh = 1 };
        h = height - 2*dh;
        t = y + dh;
        txt += '<div id="rack_mb0_' + n + '" title="' + n + '" style="position:absolute; height:' + height + 'px; width:' + 0.5*width + 'px; top:' + y + 'px;"></div>';
        txt += '<div id="rack_mb1_' + n + '" title="' + n + '" style="position:absolute; height:' + height + 'px; left:' + 0.5*width + 'px; width:' + 0.5*width + 'px; top:' + y + 'px;"></div>';
	txt += '<div id="rack_cpu0_' + n + '" title="' + n + '" style="position:absolute; height:' + h + 'px; width:' + (0.5*width*rackShrink) + 'px; top:' + t + 'px; left:' + (0.5*width*(1.0 - rackShrink)) + 'px;"></div>';
	txt += '<div id="rack_cpu1_' + n + '" title="' + n + '" style="position:absolute; height:' + h + 'px; width:' + (0.5*width*rackShrink) + 'px; top:' + t + 'px; left:' + 0.5*width + 'px;"></div>';
    }

    txt += '</a>';

    return txt;
}

function drawBladeTempDiv( n, height, width, x ) {
    var txt = '';

    txt += '<a target="_new" id="temp_' + n + '">';

    if ( rackStyle == 'cpu' )
   /// @@@ not done... ->
	txt += '<div id="rack_cpu_' + n + '" title="' + n + '" style="position:absolute; height:' + height + 'px; width:' + width + 'px; left:' + x + 'px;"></div>';
    else if ( rackStyle == 'both' ) {
   /// @@@ not done... ->
        txt += '<div id="rack_mb_' + n + '" title="' + n + '" style="position:absolute; height:' + height + 'px; width:' + width + 'px; left:' + x + 'px;"></div>';
	txt += '<div id="rack_cpu_' + n + '" title="' + n + '" style="position:absolute; height:' + (height*rackShrink) + 'px; width:' + (width*rackShrink) + 'px; left:' + (x + (0.5*height*(1.0 - rackShrink))) + 'px; left:' + (0.5*width*(1.0 - rackShrink)) + 'px;"></div>';
    }
    else { // quad
        dw = parseInt(0.5*(width - rackShrink*width));
        if ( dw == 0 ) { dw = 1 };
        w = width - 2*dw;
        l = x + dw;
        txt += '<div id="rack_mb0_' + n + '" title="' + n + '" style="position:absolute; height:' + 0.5*height + 'px; top:' + 0.5*height + 'px; width:' + width + 'px; left:' + x + 'px;"></div>';
        txt += '<div id="rack_mb1_' + n + '" title="' + n + '" style="position:absolute; height:' + 0.5*height + 'px; width:' + width + 'px; left:' + x + 'px;"></div>';
	txt += '<div id="rack_cpu0_' + n + '" title="' + n + '" style="position:absolute; height:' + 0.5*height*rackShrink + 'px; width:' + w + 'px; left:' + l + 'px; top:' + 0.5*height + 'px;"></div>';
	txt += '<div id="rack_cpu1_' + n + '" title="' + n + '" style="position:absolute; height:' + 0.5*height*rackShrink + 'px; width:' + w + 'px; left:' + l + 'px; top:' + (0.5*height*(1.0 - rackShrink)) + 'px;"></div>';
    }

    txt += '</a>';

    return txt;
}

function drawBladeChassisDiv( n, height, width, x ) {
    var txt = '';

    txt += '<a target="_new" id="temp_' + n + '">';
    txt += '<div id="power_' + n + '" title="' + n + '" style="position:absolute; height:' + 0.3*height + 'px; top:' + 0.2*height + 'px; width:' + width + 'px; left:' + x + 'px; background-color: #9e9e9e;"></div>';
    txt += '<div id="fan_' + n + '" title="' + n + '" style="position:absolute; height:' + 0.3*height + 'px; top:' + 0.5*height + 'px; width:' + width + 'px; left:' + x + 'px; background-color: #e9e9e9;"></div>';
    txt += '</a>';

    return txt;
}

// for heavy mode
function drawRacks() {
    var txt = '';

    // read prevTempMap, put into rack order and write as divs
    txt += '<div style="position:relative; left:' + rackLeft + 'px;">';

    // figure out the max vertical height
    // eg. racks = [ [42,'pizza'], [96,['blade',24,1]], [96,['blade',12,2]], ['fe','pizza'] ]
    var ht = 0;
    for (var rack=0; rack<config.racks.length; rack++ ) {
	r = config.racks[rack];
	var num;
	if ( r[0] == 'fe' )
	    num = config.nben.length;
	else
	    num = r[0];

	if (r[1].length == 3 && r[1][0] == 'blade') {   // eg. [96,['blade',24,1]] or [96,['blade',12,2]]
	    blades = r[1][1];      // eg. 24 nodes per shelf
	    nodesPerBlade = r[1][2]; // eg. 2
	    shelves = num/(blades*nodesPerBlade); //  => 4 shelves per rack
	    var h = shelves*(shelfHeight + shelfSpacing);
            if ( h > ht )
		ht = h;
	}
	else if ( r[1] == 'pizza' ) {   // eg. [42, 'pizza']
	    var h = num * (nodeHeight + nodeSpacing);
	    if ( h > ht )
	        ht = h;
	}
    }
    var bottom = ht*1.02;

    cnt = 0;
    shelfCnt = 0;
    for (var rack=0; rack<config.racks.length; rack++ ) {
	r = config.racks[rack];
	txt += '<div style="position:absolute; left:' + (rack*(rackWidth + rackSpacing)) + 'px;">';
	if ( r[0] == 'fe' ) {
	    if ( r[1] == 'pizza' ) {   // eg. ['fe', 'pizza']
		for (var i=0; i<config.nben.length; i++ ) {
		    txt += drawPizzaTempDiv( config.nben[i], nodeHeight, rackWidth, (i+1)*(nodeHeight + nodeSpacing) );
		}
	    }
	    else if (r[1].length == 3 && r[1][0] == 'blade') {   // eg. ['fe',['blade',24,1]]
		addErr( 'frontend blade rack not yet done...' );
	    }
	    else {
		// unknown...
		addErr( 'unknown rack type:' + r );
	    }
	}
	else {
	    if ( r[1] == 'pizza' ) {   // eg. [42, 'pizza']
                maxR = ht/(nodeHeight + nodeSpacing);
		for (var i=0; i<r[0]; i++ ) {
		    if ( cnt < 0 || cnt > config.cn.length-1 ) {
			addErr( 'node number ' + cnt + ' out of range in pizza node rendering' );
			continue;
		    }
		    n = config.cn[cnt];
		    cnt++;
		    j=i;
		    if ( config.rackTempOrder == 'up' )
			j=maxR-j;
		    txt += drawPizzaTempDiv( n, nodeHeight, rackWidth, j*(nodeHeight + nodeSpacing) );
		}
	    }
	    else if (r[1].length == 3 && r[1][0] == 'blade') {   // eg. [96,['blade',12,2]]
		blades = r[1][1];             // eg. 12 blades per shelf
		nodesPerBlade = r[1][2];      // eg. 2
		shelves = r[0]/(blades*nodesPerBlade);        //  => 4 shelves per rack
		if (shelves*blades*nodesPerBlade < r[0])
		    addErr( 'blades does not add up...' );
		bladeWidth = parseInt(0.9*rackWidth/blades);
                rw = bladeWidth*blades;  // an integer version of 0.9*rackWidth
		var c = 0;
		for (var j=0; j<shelves; j++ ) {
		    if (shelfCnt < 0 || shelfCnt > config.shn.length-1 ) {
			addErr( 'shelf number ' + shelfCnt + ' out of range in rack rendering' );
			continue;
		    }
	            txt += '<div id="shelf_' + shelfCnt + '" style="position:absolute; top:' + (bottom - (shelfHeight + shelfSpacing)*(j+1)) + 'px;">';
		    s = config.shn[shelfCnt];
		    txt += '<div id="' + s + '">';
		    txt += drawBladeChassisDiv( s, 1.8*shelfHeight/nodesPerBlade, 2*bladeWidth, -2*bladeWidth );
		    txt += '</div>';
                    shelfCnt += 1;
		    for (var i=0; i<blades; i++ ) {  // blades
			x = i*bladeWidth;
			for (var k=0; k<nodesPerBlade; k++ ) {
			    c += 1;
			    if (c > r[0]) // off the top of the nodes in this rack
				continue;
			    if (cnt < 0 || cnt > config.cn.length-1) {
				addErr( 'compute node cnt ' + cnt + ' out of range in blade node rendering' );
				continue;
			    }
			    n = config.cn[cnt];
			    cnt += 1;
			    txt += '<div style="position:absolute; top:' + (k*shelfHeight/nodesPerBlade) + 'px;">';
			    txt += drawBladeTempDiv( n, 0.95*shelfHeight/nodesPerBlade, bladeWidth, x );
			    txt += '</div>';
			}
		    }
	            txt += '</div>';
		}
	    }
	    else {
		// unknown...
		addErr( 'unknown rack type:' + r );
	    }

	    // average temp at bottom of each rack
	    txt += '<div id="rack_' + rack + '" style="position:absolute; left:' + (0.3*rackWidth) + 'px; top:' + bottom + 'px; font-size: 70%;"></div>';
	}
	txt += '</div>';
    }
    txt += '</div>';

    // and the cpu0/cpu1 or cpu/mb key
    if ( rackStyle == 'cpu' )
       txt += '<div style="position:relative; left:' + (rackLeft -  80) + 'px; font-size: 70%; top:' + bottom + 'px;">Ave Cpu0 Temp<br>Ave Cpu1 Temp</div>';
    else if ( rackStyle == "both" ) {
       txt += '<div style="position:relative; left:' + (rackLeft - 100) + 'px; font-size: 70%; top:' + bottom + 'px;">Ave Cpu Temp<br>Ave Blade Temp</div>';
       //txt += '<div style="position:relative; left:' + (rackLeft - 80) + 'px; font-size: 70%; top:' + bottom + 'px;">Ave Cpu Temp<br>Ave m/b Temp</div>';
    }
    else {
       //txt += '<div style="position:relative; left:' + (rackLeft - 100) + 'px; font-size: 70%; top:' + bottom + 'px;">Ave Cpu Temp<br>Blade Rear<br>Blade Front</div>';
       txt += '<div style="position:relative; left:' + (rackLeft - 100) + 'px; font-size: 70%; top:' + bottom + 'px;">Rack<br>Ave Cpu T<br><font color="' + rackSummaryColour + '">Blade Rear T</font><br>Blade Front T<br><font color="' + rackSummaryColour + '">kW by Node</font><br>kW by Shelf</div>';
    }

    return txt;
}

function drawRackTempScale() {
    // and the temp scale
    var txt = '';
    txt += '<div style="position:relative; left:' + (rackLeft - rackTempsShift) + 'px;">';
    if ( rackStyle == 'cpu' ) {
        topLabel = config.cpuMaxTemp  + '&deg;C';
        botLabel = config.cpuMinTemp  + '&deg;C';
        midLabel = 'cpu';
    }
    else if ( rackStyle == 'both' ) {
        topLabel = config.cpuMaxTemp  + '&deg;C, ' + config.mb0MaxTemp + '&deg;C';
        botLabel = config.cpuMinTemp  + '&deg;C, ' + config.mb0MinTemp + '&deg;C';
        midLabel = 'cpu&nbsp;&nbsp;&nbsp;&nbsp;m/b';
    }
    else { // quad
        topLabel = config.cpuMaxTemp  + '&deg;C<br>' + config.mb0MaxTemp + ',' + config.mb1MaxTemp + '&deg;C';
        botLabel = config.cpuMinTemp  + '&deg;C<br>' + config.mb0MinTemp + ',' + config.mb1MinTemp + '&deg;C';
        midLabel = 'cpu<br>rear,frt';
    }
    txt += drawTempScale( config.cpuMinTemp, config.cpuMaxTemp, topLabel, midLabel, botLabel );
    txt += '</div>';

    return txt;
}

function doSpecialRow(row) {
    var txt = '<table><tr>';
    for (var i=0; i < row.length; i++ )
	txt += doSpecialElements( row, i );
    txt += '</tr></table>\n';

    return txt;
}

function doSpecialRows() {
    var txt = '';

    for (var i=0; i < config.sr.length; i++ )
	txt += doSpecialRow(config.sr[i]);

    return txt;
}

function refreshButton() {
    var txt = '';

    txt += '<td NOWRAP><div style="border: 1px outset;">';
    txt += '  <table cellspacing="2" cellpadding="0" border="0"><tr>';
    txt += '    <td><span style="cursor:pointer; color:blue" onclick="GetAsyncData();">Refresh Now</span></td>';
    txt += '  </tr></table>';
    txt += '</div></td>';

    return txt;
}

function doSpecialRowTop() {
    var spacing = 20;
    var txt = '<table><tr>';

    txt += refreshButton();

    txt += '<td width=' + spacing + 'px></td>';

    //txt += '<td NOWRAP align=middle>';
    //txt += '    Refresh Interval';
    //txt += '    <div class="slider" id="slider-1" style="width: 100; margin: 1px;"><input class="slider-input" id="slider-input-1"/></div>';
    //txt += '    <div style="border: 1px dashed black" id="h-value-1"></div>';
    //txt += '</td>';
    txt += '<td NOWRAP>';
    txt += '  <table class="refresh" cellpadding="0" cellspacing="0" border="0">';
    txt += '    <tr>';
    txt += '    <td>Refresh Interval:</td>';
    txt += '    <td><div class="slider" id="slider-1" style="width: 100; margin: 1px;"><input class="slider-input" id="slider-input-1"/></div></td>';
    txt += '    <td><div style="padding: 2px; border: 1px dashed black;" id="h-value-1"></div></td>';
    txt += '    </tr>';
    txt += '    <tr><td></td><td></td><td><div style="height:3px; width:0; background-color:black;" id="countdown-1"></div></td></tr>';
    txt += '  </table>';
    txt += '</td>';

    txt += '<td width=' + spacing + 'px></td>';

    txt += '<td NOWRAP>';
    txt += '  <div onmouseup="redrawNodesTable(0)"><table class="refresh" cellpadding="0" cellspacing="0" border="0"><tr>';
    txt += '     <td>Node Layout:</td>';
    txt += '     <td><div class="slider" id="slider-3" style="width: 100; margin: 1px;"><input class="slider-input" id="slider-input-3"/></div></td>';
    txt += '     <td><div style="padding: 2px; border: 1px dashed black;" id="h-value-3"></div></td>';
    txt += '  </tr></table></div>';
    txt += '</td>';

    txt += '<td width=' + spacing + 'px></td>';

    txt += '<td NOWRAP>';
    txt += '  <div onmouseup="redrawNodesTable(0)"><table class="refresh" cellpadding="0" cellspacing="0" border="0"><tr>';
    txt += '    <td>Node Order:</td>';
    txt += '    <td><div class="slider" id="slider-4" style="width: 100; margin: 1px;"><input class="slider-input" id="slider-input-4"/></div></td>';
    txt += '    <td><div style="padding: 1px; border: 1px dashed black;" id="h-value-4"></div></td>';
    txt += '  </tr></table></div>';
    txt += '</td>';

    txt += '<td width=' + spacing + 'px></td>';

    txt += '</tr></table>';

    return txt;
}

function doSpecialRowBot() {
    var spacing = 15;
    var txt = '<table><tr>';

    txt += refreshButton();

    txt += '<td width=' + spacing + 'px></td>';

    txt += '<td NOWRAP>';
    // IE might want cursor:hand, but we don't care about them...
    txt += '<span id="modeTxt_sub-lite" style="cursor:pointer; color:' + (nextMode == 'sub-lite' ? 'black' : 'blue' ) + '" onclick="changeDisplayModes(\'sub-lite\');">SubLite</span>&nbsp;/&nbsp;';
    txt += '<span id="modeTxt_pocket-lite" style="cursor:pointer; color:' + (nextMode == 'pocket-lite' ? 'black' : 'blue' ) + '" onclick="changeDisplayModes(\'pocket-lite\');">PocketLite</span>&nbsp;/&nbsp;';
    txt += '<span id="modeTxt_lite"     style="cursor:pointer; color:' + (nextMode == 'lite'     ? 'black' : 'blue' ) + '" onclick="changeDisplayModes(\'lite\');">Lite</span>&nbsp;/&nbsp;';
    txt += '<span id="modeTxt_normal"   style="cursor:pointer; color:' + (nextMode == 'normal'   ? 'black' : 'blue' ) + '" onclick="changeDisplayModes(\'normal\');">Normal Job</span>&nbsp;/&nbsp;';
    txt += '<span id="modeTxt_normal-usr"  style="cursor:pointer; color:' + (nextMode == 'normal-usr'  ? 'black' : 'blue' ) + '" onclick="changeDisplayModes(\'normal-usr\');">Normal User</span>&nbsp;/&nbsp;';
    txt += '<span id="modeTxt_heavy"    style="cursor:pointer; color:' + (nextMode == 'heavy'    ? 'black' : 'blue' ) + '" onclick="changeDisplayModes(\'heavy\');">Heavy</span>';
    //txt += '&nbsp;&nbsp;<span style="cursor:pointer; color:#dddddd" onclick="changeDisplayModes(\'network\');">Net Test</span>';
    txt += '</td>';

    txt += '</tr></table>';
    txt += '<table><tr>';

    txt += '<td><table cellpadding=0 cellspacing=0 border=0>';
    txt +=   '<tr><td NOWRAP><img src="' + config.gifDir + 'blue.gif" width=12 height=3><img src="' + config.gifDir + 'yellow.gif" width=13 height=3><img src="' + config.gifDir + 'red.gif" width=12 height=3><img src="' + config.gifDir + 'green.gif" width=13 height=3> user/wait_io/sys/idle cpu</td></tr>';
    txt +=   '<tr><td NOWRAP><img src="' + config.gifDir + 'orange.gif" width=50 height=3> gpu used</td></tr>';
    txt +=   '<tr><td NOWRAP><img src="' + config.gifDir + 'green.gif" width=50 height=3> mem used</td></tr>';
    txt +=   '<tr><td NOWRAP><img src="' + config.gifDir + 'black.gif" width=50 height=3> disk used</td></tr>';
    txt += '</table></td>';

    txt += '<td width=' + (spacing/3) + 'px></td>';

    txt += '<td><table cellspacing=0 border=0 cellpadding=1>';
    txt +=   '<tr><td bgcolor=' + tempToColour(100, tempColoursBg, 0, 100) + '><font color="white">cpu &#176;C</font></td></tr>';
    txt +=   '<tr><td bgcolor=' + tempToColour(  0, tempColoursBg, 0, 100) + '><font color="white">ambient &#176;C</font></td></tr>';
    txt += '</table></td>';

    txt += '<td width=' + (spacing/3) + 'px></td>';

    txt += '<td><table cellpadding=0 cellspacing=0 border=0>';
    txt +=   '<tr><td NOWRAP><img src="' + config.gifDir + 'redyellow4.gif" width=50 height=3> swapping</td></tr>';
    txt +=   '<tr><td NOWRAP><img src="' + config.gifDir + 'blackyellow4.gif" width=50 height=3> disk full</td></tr>';
    txt += '</table></td>';

    txt += '<td width=' + spacing + 'px></td>';

    txt += '<td NOWRAP>';
    txt += 'bobMonitor<br>';
    txt += '<a class="blue" target="_new" href="' + aboutURL + '">About</a>';
    txt += '</td>';

    txt += '<td width=' + spacing + 'px></td>';

    txt += '<td NOWRAP>';
    var t = '';
    for (var i=0; i < config.gmonds.length; i++) {
	var urlTemplate = config.gmonds[i][2];
	t += '<a class="blue" target="_new" href="' + urlTemplate.replace( '%h', '' ) + '&sh=0' + '">Ganglia</a>';
	if (i == config.gmonds.length-1 )
	    t += '<br>';
	else
	    t += ' / ';
    }
    txt += t;
    txt += '<a target="_new" href="' + config.siteURL + '"><font color="red">' + config.siteName + '</font></a>';
    txt += '</td>';

    txt += '</tr></table>';

    return txt;
}

function computeOrient(rows, cols, N) {
    // if orient is even then flip rows and cols
    var c;
    if ( !(nodeOrientation % 2) )
       c = cols;
    else
       c = rows;

    var geom;
    switch (nodeOrientation) {
    case 1:
         geom = [0,    c,  1];
         break;
    case 2:
         geom = [c-1, -1,  c];
         break;
    case 3:
         geom = [N-1, -c, -1];
         break;
    case 4:
         geom = [N-c,  1, -c];
         break;
    case 5:
         geom = [c-1,  c, -1];
         break;
    case 6:
         geom = [0,    1,  c];
         break;
    case 7:
         geom = [N-c, -c,  1];
         break;
    case 8:
         geom = [N-1, -1, -c];
         break;
    default:
         // should never happen
         addErr( 'computeOrient, nodeOrientation is ' + nodeOrientation + '. setting to 4' );
         nodeOrientation = 4;
         // return computeOrient(rows, cols, N); // android barfs on this
         geom = [N-c,  1, -c];
         break;
    }

    // fudge the 'start' value to make the low numbered nodes always be in a corner
    switch (nodeOrientation) {
    case 3:
    case 4:
    case 7:
    case 8:
       if ( N < rows*cols )
          geom[0] += (rows*cols - N);
       break;
    }

    return geom;
}

function displayOrient(o) {
   o.style.position = 'relative';
   o.style.backgroundColor = '#ffffff';
   o.style.height = 20;
   o.style.width = 20;
   var a = document.getElementById( 'arrow' );
   var a1 = document.getElementById( 'arrow1' );
   var a2 = document.getElementById( 'arrow2' );
   var a3 = document.getElementById( 'arrow3' );
   var a4 = document.getElementById( 'arrow4' );
   if ( a == null ) {
      // make an arrow
      a = document.createElement('div');
      a.id = 'arrow';
      a.style.position = 'absolute';
      a.style.backgroundColor = '#000000';

      a1 = document.createElement('div');
      a1.style.position = 'absolute';
      a1.id = 'arrow1';
      a1.style.backgroundColor = '#000000';
      a2 = document.createElement('div');
      a2.style.position = 'absolute';
      a2.id = 'arrow2';
      a2.style.backgroundColor = '#000000';
      a3 = document.createElement('div');
      a3.style.position = 'absolute';
      a3.id = 'arrow3';
      a3.style.backgroundColor = '#000000';
      a4 = document.createElement('div');
      a4.style.position = 'absolute';
      a4.id = 'arrow4';
      a4.style.backgroundColor = '#000000';

      a.appendChild(a1);
      a.appendChild(a2);
      a.appendChild(a3);
      a.appendChild(a4);

      o.appendChild(a);
   }
    // arrow shaft
    switch (nodeOrientation) {
    case 1:
    case 5:
         a.style.left = 5;
         a.style.width = 2;
         a.style.top = 2;
         a.style.height = 16;
         break;
    case 2:
    case 6:
         a.style.left = 2;
         a.style.width = 16;
         a.style.top = 5;
         a.style.height = 2;
         break;
    case 3:
    case 7:
         a.style.left = 13;
         a.style.width = 2;
         a.style.top = 2;
         a.style.height = 16;
         break;
    case 4:
    case 8:
         a.style.left = 2;
         a.style.width = 16;
         a.style.top = 13;
         a.style.height = 2;
         break;
    }
    // arrow head
    a1.style.width = 2;
    a1.style.height = 2;
    a2.style.width = 2;
    a2.style.height = 2;
    switch (nodeOrientation) {
    case 1: // down arrow
    case 7:
         a1.style.left = -2;
         a1.style.top = 12;
         a2.style.left = 2;
         a2.style.top = 12;

         a3.style.left = -1;
         a3.style.top = 14;
         a3.style.width = 4;
         a3.style.height = 1;

         a4.style.left = -3;
         a4.style.top = 12;
         a4.style.width = 8;
         a4.style.height = 1;
         break;
    case 2: // left arrow
    case 8:
         a1.style.left = 2;
         a1.style.top = -2;
         a2.style.left = 2;
         a2.style.top = 2;

         a3.style.left = 1;
         a3.style.top = -1;
         a3.style.width = 1;
         a3.style.height = 4;

         a4.style.left = 3;
         a4.style.top = -3;
         a4.style.width = 1;
         a4.style.height = 8;
         break;
    case 3: // up arrow
    case 5:
         a1.style.left = -2;
         a1.style.top = 2;
         a2.style.left = 2;
         a2.style.top = 2;

         a3.style.left = -1;
         a3.style.top = 1;
         a3.style.width = 4;
         a3.style.height = 1;

         a4.style.left = -3;
         a4.style.top = 3;
         a4.style.width = 8;
         a4.style.height = 1;
         break;
    case 4: // right arrow
    case 6:
         a1.style.left = 12;
         a1.style.top = -2;
         a2.style.left = 12;
         a2.style.top = 2;

         a3.style.left = 14;
         a3.style.top = -1;
         a3.style.width = 1;
         a3.style.height = 4;

         a4.style.left = 12;
         a4.style.top = -3;
         a4.style.width = 1;
         a4.style.height = 8;
         break;
    }
}

// multi-layer hack version:
//function writeTable(tableName, rows, cols, first, offset, hackPrefix) {

function writeTable(tableName, rows, cols, first) {
    var t = document.createElement('table');
    t.id = tableName;
    t.setAttribute('cellspacing', 1);
    t.setAttribute('cellpadding', 0);
    t.setAttribute('border', 0);

    var geom = computeOrient(rows, cols, config.cn.length);
    var start = geom[0];
    var dx = geom[1];
    var dy = geom[2];

//   var debug = document.getElementById( 'tableDebug' );
//   debug.innerHTML = 'orient = ' + nodeOrientation;
//   debug.innerHTML += '<br>[start=' + start + ', dx=' + dx + ', dy=' + dy + ']';
//   debug.innerHTML += '<br>[rows=' + rows + ', cols=' + cols + ', cells=' + config.cn.length + ']<p>';

    var c, r, name;
    var cnt = start; // multi-layer hack: + offset;
    for (var i=0; i < rows; i++ ) {
	r = document.createElement('tr');
	for (var j=0; j < cols; j++ ) {
	    //debug.innerHTML += '[cnt=' + cnt + ', i=' + i + ', j=' + j + ']';
	    if ( cnt >= 0 && cnt < config.cn.length ) {
		name = config.cn[cnt];
		if ( first ) {
		    c = document.createElement('td');
		    c.innerHTML = writeNodeTable(name);
		    c.id = name;
//               // multi-layer hack
//               c.innerHTML = writeNodeTable(hackPrefix + name);
//               c.id = hackPrefix + name;
		}
		else {
		    c = items[name];
		}
	    }
	    else {  // grid is bigger than number of nodes
		c = document.createElement('td');
	    }
	    r.appendChild(c);
	    cnt += dx;
	}
	t.appendChild(r);

	cnt -= cols*dx;
	cnt += dy;
    }
    return t;
}

function redrawNodesTable( first ) {
    var tableName = 'wholeTable';
    var t = document.getElementById( tableName );
    var p = t.parentNode;
    var newT = writeTable(tableName, numRows, numCols, first );
//    // multi-layer hack
//    var offset = 0;
//    var newT = writeTable(tableName, numRows, numCols, first, offset, '');
//    offset += numRows*numCols;
    p.replaceChild(newT, t);

    if ( first ) {
	// populate items[] with the td's
	for (var i=0; i < config.cn.length; i++ ) {
	    name = config.cn[i];
	    items[name] = document.getElementById(name);
	}
    }

//    // multi-layer hack
//    var z0 = document.getElementById( 'zDiv0' );
//    //z0.style.opacity = 0.8;
//
//    // multi-layer hack
//    var z1 = document.getElementById( 'zDiv1' );
//    z1.style.opacity = 0.5;
//    z1.style.left = z0.offsetLeft + 10;
//    z1.style.top = z0.offsetTop + 10;
//
//    tableName = 'wholeTableZ';
//    var tz = document.getElementById( tableName );
//    p = tz.parentNode;
//    newT = writeTable(tableName, numRows, numCols, first, offset, 'z');
//    p.replaceChild(newT, tz);
}

function generateBasicPage() {
    all = document.getElementById( 'all' );

    // very basic CSS for beginners
    var txt = '<style type="text/css">';
    txt += 'body {font-family: sans-serif;}';
    txt += 'a {text-decoration: none}';
    txt += 'a.white {color: white}';
    txt += 'a.blue {color: blue}';
    txt += 'td {font-size: 80%}';  // make all fonts in the table smaller

    // customise the standard slider
    txt += '.dynamic-slider-control {background-color: white;}';
    txt += '.refresh input {text-align: right; width: 3em;}';

    // look'n'feel of the top box
    txt += '.box table tr td { border: 0; font-size: 100%; }'; // border-right: 1px solid black; background-color: #620262; }';
    txt += 'td.text { text-align: center; padding: 10px; background-color: #e9e9e9; }'; // doesn't work: borderWidth: 1; borderStyle: solid; borderColor: black;   // margin: 10px 0 10px 0;
    txt += '</style>';

    // put pies and info text at the top
    txt += '<div class="box">';
    txt += '  <table cellpadding="0" cellspacing="0" border="0">';
    txt += '     <tr><td class="text">';
    for (var i=0; i < txtNames.length; i++ )
	txt += '<div id="text_' + txtNames[i] + '"></div>';
    txt += '     </td></tr>';
    txt += '     <tr><td><div id="stale"></div></td></tr>';
    txt += '  </table>';
    txt += '  <table cellpadding="0" cellspacing="0" border="0"><tr height=420><td><div class="pies" id="pies"></div></td></tr></table>';
    txt += '</div>';

    // popup notify window
    txt += '<div id="notify" style="position: absolute; opacity: 0.9; height: 175; z-index: 200; width: 400; text-align: center; background-color: #555555; visibility:hidden;">';
    txt += '  <font color=white size=+2><p>Looks like net connection was lost...<br><span id="reconnectTimer"></span><p><span style="cursor:pointer; color:blue" onclick="GetAsyncData();"><font color=#8888ff>Refresh Now</font></span>&nbsp;&nbsp;<span style="cursor:pointer; color:blue" onclick="stopReconnecting();"><font color=#ff8888>Stop Retrying</font></span></font>';
    txt += '</div>';

    txt += doSpecialRowTop();

    // main table
    txt += '<table id="wholeTable"></table>';
    // multi-layer hack:
    //txt += '<div id="zDiv0" style="position:relative; z-index:20"><table id="wholeTable"></table></div>';
    //txt += '<div id="zDiv1" style="position:absolute; z-index:10"><table id="wholeTableZ"></table></div>';
    //txt += '<br><div id="tableDebug"></div><br>';

    txt += '<p>';
    txt += doSpecialRows();

    txt += doSpecialRowBot();

    txt += '<p></p>';
    txt += '<div id="rackTemps"' + ( ( currentMode == 'heavy' || currentMode == 'normal' || currentMode == 'normal-usr' ) ? '' : ' style="visibility:hidden;"') + '>' + drawRacks();
    txt += '  <div id="rackTempsColorBar">' + drawRackTempScale() + '</div>';
    txt += '  <div class="slider" id="slider-2" style="width: 100; margin: 1px; position:relative; left:' + (rackLeft - rackTempsShift - 50) + 'px; top:' + 140 + 'px;"><input class="slider-input" id="slider-input-2"/></div>';
    txt += '</div>';

    txt += '<p></p>';
    txt += '<div style="font-size: 70%;position:relative;top:' + 300 + 'px;" id="debug_text"></div>';
    txt += '<div id="tipDiv" style="position:absolute; visibility:hidden; z-index:100"></div>';

    all.innerHTML = txt;

    buildRefreshSlider( inputToSlider(refresh/1000) );
    buildTempSlider( colourMapName );
    buildAspectSlider( aspectSliderVal );
    buildOrientSlider( nodeOrientation );

    countDownTimer = setInterval( "refreshCountDownTimer()", refreshCountDownInterval );
    resetRefreshCountDownTimer(0);

    redrawNodesTable(1); // first
}

function addErr( str ) {
    t = new Date();
    errStr += str + ', time ' + t + '\n';
}

function loadToLevel( load, vec, cores ) {
    maxL = vec.length;
    level = ( load*0.5*maxL/cores );
    level = parseInt(level);
    if ( level >= maxL ) {
	level = maxL - 1;
    }
    return level;
}

function mbTempToColour( t, map ) {
    return mb0TempToColour( t, map );
}

function mb0TempToColour( t, map ) {
    return tempToColour( t, map, config.mb0MinTemp, config.mb0MaxTemp );
}

function mb1TempToColour( t, map ) {
    return tempToColour( t, map, config.mb1MinTemp, config.mb1MaxTemp );
}

function cpuTempToColour( t, map ) {
    return tempToColour( t, map, config.cpuMinTemp, config.cpuMaxTemp );
}

function shelfFanSpeedToColour( t, map ) {
    return tempToColour( t, map, config.shelfFanMinSpeed, config.shelfFanMaxSpeed );
}

function shelfPowerToColour( t, map ) {
    return tempToColour( t, map, config.shelfMinPower, config.shelfMaxPower );
}

function tempToColour( t, map, tMin, tMax ) {
    len = map.length;
    x = parseInt(len*(t - tMin)/(tMax - tMin));
    if ( x >= len )
	x = len-1;
    if ( x < 0 )
	return noTempColour;
    return map[x];
}

function translateBr( s ) {
    // take a string and translate _br_'s into <br>
    end = 0;
    while ( !end ) {
	i = s.indexOf('_br_');
	if ( i == -1 )
	    end = 1;
	else {
	    newStr = s.substring(0,i) + '<br>' + s.substring(i+4,s.length);
	    s = newStr;
	}
    }
    return s;
}

modes = [ 'sub-lite', 'pocket-lite', 'lite', 'normal', 'normal-usr', 'heavy' ];

function setDefaults() {
    nodeOrientation = 4;
    currentMode = 'normal-usr';
    nextMode = currentMode;
    aspectSliderVal = 50;
    fns = allFns[currentMode];
    refresh = 60000;  // 60 seconds
    colourMapName = colourMaps[1][0]; // bgr
    colourMap = colourMaps[1][1];
    shelfColourMap = colourMap;
    prevRefresh = refresh;
}

function setPrefs() {
    createCookie( cookieName, nodeOrientation + '|' + nextMode + '|' + refresh + '|' + colourMapName + '|' + aspectSliderVal, 90 );
}

function readPrefs() {
    cookie = readCookie( cookieName );

    if ( !cookie ) // no cookie set
	return 0; // fail

    // cookie format is 'nodeOrientation|mode|refresh'
    cookie = cookie.split('|');

    found = 0;
    if ( cookie.length != 5 )
	return 0; // fail

    orient = cookie[0];
    mode = cookie[1];
    refresh = cookie[2];
    mapName = cookie[3];
    asVal = cookie[4];

    if ( orient >= 1 && orient <= 8 )
	nodeOrientation = orient;
    else
	return 0; // fail

    found = 0;
    for (var i=0; i < modes.length; i++ ) {
	if ( mode == modes[i] ) // we have a winner
	{
	    currentMode = mode;
	    nextMode = mode;
	    fns = allFns[mode];
	    found = 1;
	    break;
	}
    }
    if ( !found )
	return 0; // fail

    reresh = parseInt(refresh);
    if ( refresh < 1000*steps[0] )
	refresh = 1000*steps[0];
    if ( refresh > 1000*steps[steps.length-1] )
	refresh = 1000*steps[steps.length-1];

    i = findColourMap( mapName );
    if ( i < 0 )
	return 0; // fail
    colourMapName = colourMaps[i][0];
    colourMap = colourMaps[i][1];
    shelfColourMap = colourMap;

    if ( asVal < 0 || asVal > 99 )
	return 0; // fail
    aspectSliderVal = asVal;

    return 1; // ok
}

// GetAsyncData sends a request to read the fifo
function GetAsyncData() {
    base = config.bobDataCmdURL;

    // there are a bunch of shortcut ways to get here, so clear the timer to avoid double-loading
    if ( nextRefresh ) clearTimeout( nextRefresh );

    setReconnectLabel( 'Reconnecting...' );

    if ( first ) {
	// read the config class and expand node lists
	expandAllNodeRanges();

	initVars();

	// build colourMap(s)
	makeColourMaps();

	// read cookie to see if we have a preferred view
	if ( ! readPrefs() ) {
	    eraseCookie( cookieName );
	    setDefaults();  // no or failed cookie, so use defaults
	}

	generateBasicPage();
	progressBarInit( first );
	setCount(1);
    }

//    use this to send arguments to the cgi-bin program
//    if ( query != '' )
//	url = base + '?' + query;
//    else
//	url = base;
    url = base;

    // doesn't seem to help a potential memory leak. seen in chromium.
    //if (req && req['onreadystatechange'] ) delete req['onreadystatechange'];
    //if (req && req.onreadystatechange ) delete req.onreadystatechange;
    //if (req && req.responseXML ) delete req.responseXML;
    if (req) delete req;

    // branch for native XMLHttpRequest object
    if (window.XMLHttpRequest) {
	req = new XMLHttpRequest();
	req.abort();
	req.onreadystatechange = GotAsyncData;
	req.open( 'POST', url, true);
	req.send(null);
    // branch for IE/Windows ActiveX version
    } else if (window.ActiveXObject) {
	req = new ActiveXObject( 'Microsoft.XMLHTTP' );
	if (req) {
	    req.abort();
	    req.onreadystatechange = GotAsyncData;
	    req.open( 'POST', url, true);
	    req.send();
	}
    }
    setConnectTimeout();
}

function doKeyPress(e) {
    // if ( e.keyCode == 114 ) // r
    if ( ( e.which == 114 || e.which == 103 ) && e.ctrlKey == false ) { // r || g
	GetAsyncData();
	return false;
    }
}

function get( name, doCatch )
{
    if ( !req.responseXML ) {
	addErr( 'req.responseXML is null. failed loading element "' + name + '"' );
	return [];  // the right return for a lot of cases...???
    }

    var data = req.responseXML.getElementsByTagName( name );
    // for some odd reason the data is broken up into 4096 byte chunks, so recombine it
    //     alert( data[0].childNodes.length );
    //     document.write( data[0].childNodes.length );
    if ( doCatch ) {
	try {
	    var str = '';
	    for(var i=0; i < data[0].childNodes.length; i++ )
		str += data[0].childNodes[i].nodeValue;
	}
	catch(failure) {
	    addErr( 'problem loading element "' + name + '", with data "' + data[0] + '". err ' + failure );
	    return [];  // the right return for a lot of cases...???
	}
    }
    else {
	var str = '';
	for(var i=0; i < data[0].childNodes.length; i++ )
	    str += data[0].childNodes[i].nodeValue;
    }

    try {
	// eval that puppy
	var arr = eval(str);
    }
    catch(failure) {
	addErr( 'problem eval\'ing element "' + name + '". err ' + failure );
	return [];
    }

    return arr;
}

function changeInner( element, text, debugString ) {
    if ( !element ) {
        addErr( 'changeInner - element is NULL - **' + debugString + '**');
	return;
    }
    if ( element.innerHTML != text )
	element.innerHTML = text;
}


var timeStr = '';
var timeStuff = [];
var zeroAt = 3;

function addToTimeStr( name, start ) {
    end = new Date();
    t = end - start;
    if ( name == 'totalTime' ) {
	t -= totalDelays;
	timeStr += '\n';
    }
    else {
	t -= timeFudge;
	timeFudge = 0;
    }

    timeStr += name + ': ' + t;

    if ( timeStuff[name] ) {
	if ( timeStuff[name]['cnt'] == zeroAt ) { // ignore first few
	    timeStuff[name]['sum'] = 0;
	    timeStuff[name]['max'] = t;
	}

	timeStuff[name]['sum'] += t;
	timeStuff[name]['cnt'] += 1;
	if ( t > timeStuff[name]['max'] )
	    timeStuff[name]['max'] = t;
    }
    else {
	timeStuff[name] = [];
	timeStuff[name]['sum'] = t;
	timeStuff[name]['cnt'] = 1;
	timeStuff[name]['max'] = t;
    }

    if ( timeStuff[name]['cnt'] > zeroAt )
	timeStr += ' (ave ' + parseInt(timeStuff[name]['sum']/(timeStuff[name]['cnt']-zeroAt)) + ', max ' + parseInt(timeStuff[name]['max']) + ')';
    timeStr += '\n';

    return end;
}

var toolTip;
var tipWidth = 490;
var offX= 10;	// how far from mouse to show tip
var offY= 5;
var toolTimeoutShow = 200;   // delay appearance of tip by 0.2s
var toolTimeoutHide = 120000;  // tip goes away on its own after 120s
var timeoutShow, timeoutHide;
var toolBgColour = 'white';
var barBGColour = '#303030';

var ttNumCpuChanged = 0;
var ttNumMemChanged = 0;
var ttNumNetChanged = 0;

var useDivs = 1;
// yet to implement:
var useDivCache = 1;

function findAveragesForJob( job ) {
    // return prevAveragesMap( job );

    // shitty linear search 'cos @#%@#%@#%@ maps aren't working...
    for (var i=0; i < prevAverages.length; i++ ) {
	if ( prevAverages[i][0] == job )
	    return prevAverages[i][1];
    }
    return [];
}

function findNodeAve( l, n ) {
    // look in a list of ["node",[aves]], ... for the node we want
    // would be far better to have stored this as a map, but it's not working for now...
    for ( var i=0; i < l.length; i++ ) {
	if ( l[i][0] == n )
	    return l[i];
    }
    return [];
}

function drawCpuMem( offset, id, doGpu, u, s, w, i, g, m, totMem, swap, maxU, maxG, maxM, labelOff, labelU, labelG, labelM ) {
    var txt = '';

    if ( useDivs ) {
	// cpu
	left = offset;
	// draw once then forget (almost, except for hiding)
	txt += '<div id="tt_' + id + '_i" style="position:absolute; background-color:#00ff00; font-size:1px; height:3px; width:50px; left:' + left + 'px;"></div>';
	// the moving ones:
	txt += '<div id="tt_' + id + '_u" style="position:absolute; background-color:#0000ff; font-size:1px; height:3px; width:' + u + 'px; left:' + left + 'px;"></div>';
	txt += '<div id="tt_' + id + '_w" style="position:absolute; background-color:#ffff00; font-size:1px; height:3px; width:' + w + 'px; left:' + (left + u) + 'px;"></div>';
	txt += '<div id="tt_' + id + '_s" style="position:absolute; background-color:#ff0000; font-size:1px; height:3px; width:' + s + 'px; left:' + (left + u + w) + 'px;"></div>';
	// max user
	if ( maxU >= 0 )
	    txt += '<div id="tt_' + id + '_maxu" style="position:absolute; background-color:#0000ff; font-size:1px; height:3px; width:1px; left:' + (left + maxU) + 'px;"></div>';
	if ( labelU != '' )
	    txt += '<div id="tt_' + id + '_u_txt" style="position:absolute; font-size:80%; color:white; top:2px; left:' + (left + labelOff) + 'px;">' + labelU + '</div>';

	// gpu
	if ( doGpu ) {
	    left = offset + 60;
	    txt += '<div id="tt_' + id + '_g" style="position:absolute; background-color:#ff8000; font-size:1px; height:3px; width:' + g + 'px; left:' + left + 'px;"></div>';
	    // max gpu
	    if ( maxG >= 0 )
		txt += '<div id="tt_' + id + '_maxg" style="position:absolute; background-color:#ff8000; font-size:1px; height:3px; width:1px; left:' + (left + maxG) + 'px;"></div>';
	    if ( labelG != '' )
		txt += '<div id="tt_' + id + '_g_txt" style="position:absolute; font-size:80%; color:white; top:2px; left:' + (left + labelOff) + 'px;">' + labelG + '</div>';
	}

	// mem
	left = offset + 60 + 60*doGpu;
	// background box
	if ( totMem >= 0 )
	    txt += '<div style="position:absolute; background-color:' + barBGColour + '; font-size:1px; height:3px; width:' + totMem + 'px; left:' + left + 'px;"></div>';
	memId = 'tt_' + id + '_m';
	txt += '<div id="' + memId + '">';
	txt += setMemDivContents( memId, left, m, swap );
	txt += '</div>';

	if ( maxM >= 0 )
	    txt += '<div id="tt_' + id + '_maxm" style="position:absolute; background-color:#00ff00; font-size:1px; height:3px; width:1px; left:' + (left + maxM) + 'px;"></div>';
	if ( labelM != '' )
	    txt += '<div id="tt_' + id + '_m_txt" style="position:absolute; font-size:80%; color:white; top:2px; left:' + (left + labelOff) + 'px;">' + labelM + '</div>';
    }
    else {
	// cpu
	left = offset;
	txt += '<div style="position:absolute; left:' + left + 'px;">';
	txt +=   '<img id="tt_' + id + '_u" src="' + config.gifDir + 'blue.gif"   width=' + u + ' height=3>';
	txt +=   '<img id="tt_' + id + '_w" src="' + config.gifDir + 'yellow.gif" width=' + w + ' height=3>';
	txt +=   '<img id="tt_' + id + '_s" src="' + config.gifDir + 'red.gif"    width=' + s + ' height=3>';
	txt +=   '<img id="tt_' + id + '_i" src="' + config.gifDir + 'green.gif"  width=' + i + ' height=3>';
	txt += '</div>';
	// max user
	if ( maxU > 0 ) {
	    txt += '<div id="tt_' + id + '_maxu" style="position:absolute; left:' + (left + maxU) + 'px;">';
	    txt +=   '<img src="' + config.gifDir + 'blue.gif"  width=1 height=3>';
	    txt += '</div>';
	}
	if ( labelU != '' )
	    txt += '<div id="tt_' + id + '_u_txt" style="position:absolute; font-size:80%; color:white; top:2px; left:' + (left + labelOff) + 'px;">' + labelU + '</div>';

	// mem
	left = offset + 60;
	txt += '<div style="position:absolute; left:' + left + 'px; width:' + totMem + 'px; background-color:' + barBGColour + ';">';
	txt +=   '<img id="tt_' + id + '_m" src="' + config.gifDir + ( swap ? 'redyellow4.gif' : 'green.gif' ) + '"  width=' + m + ' height=3>';
	txt += '</div>';
	// max mem
	if ( maxM > 0 ) {
	    txt += '<div id="tt_' + id + '_maxm" style="position:absolute; left:' + (left + maxM) + 'px;">';
	    txt +=   '<img src="' + config.gifDir + 'green.gif" width=1 height=3>';
	    txt += '</div>';
	}
	if ( labelM != '' )
	    txt += '<div id="tt_' + id + '_m_txt" style="position:absolute; font-size:80%; color:white; top:2px; left:' + (left + labelOff) + 'px;">' + labelM + '</div>';
    }

    return txt;
}


gig = 1024.0*1024.0*1024.0;
meg = 1024.0*1024.0;
kay = 1024.0;

// maxNet = 200.0*meg;  // actually 400M is possible, but hey...
// start with 0 pixels as 8k bytes/s and each few pixels is a power of 2 more bandwidth.
//
// 2^13 is 8k. 2^20 is 1m. 400m is ~29. so 8k->400m is ~16 powers of 2.
// so 3.125 pixels per power gets ~50 pixels.
// the value for 1m is (20-13)*3.125 = 21.875 pixels
// the value for 100m is (26.6-13)*3.125 = 42.5 pixels

//netBytePixelThresh = [ 21.875, 42.5 ]; // exact
netBytePixelThresh = [ 22, 43 ];  // the integer version that renders without gaps

// redo for IB network...
// 16Gbyte/s max = 2^34. so 21 powers of 2 from 8k/s to 16GB/s. so a multiplier of 2.38

//netBytePixelThresh = [ 16.66, 32.47]; // exact
netBytePixelThresh = [ 17, 32 ];  // the integer version that renders without gaps

function bytesTrafficToPixels( traffic ) {
    if ( traffic <= 0 )
	return 0;
    // map from bytes into pixels
    pixels = ((Math.log(traffic)/Math.log(2.0)) - 13.0) * 2.38;
    if ( pixels < 0 )
	pixels = 0;
    return pixels;
}

// no idea of max pkts... max of 1m?
// start with 0 pixels as 128 pkts/s and each few pixels is a power of 2 more pkts.
// 2^7 = 128, 2^20 is 1m, so 128->1m is 13 powers of 2, so 3.846 pixels/power
// threshs at 1k, 32k = 2^10 and 2^15 = (10-7)*3.846 = 11.5 pixels and (15-7)*3.846 = 30.768 pixels

netPktsPixelThresh = [ 11.5, 30.768 ];

function pktsTrafficToPixels( traffic ) {
    if ( traffic <= 0 )
	return 0;
    // map from packets into pixels
    pixels = ((Math.log(traffic)/Math.log(2.0)) - 7.0) * 3.846;
    if ( pixels < 0 )
	pixels = 0;
    return pixels;
}

function descaleTraffic( val, mode ) {
    if ( mode == 'b' || mode == '1' )
	return val;
    else if ( mode == 'k' )
	return kay*val;
    else if ( mode == 'm' )
	return meg*val;
    else // g
	return gig*val;
}

function trafficToString( t ) {
    var n, scale;
    if ( t > gig ) {
	n = t/gig;
	scale = 'g';
    }
    else if ( t > meg ) {
	n = t/meg;
	scale = 'm';
    }
    else if ( t > kay ) {
	n = t/kay;
	scale = 'k';
    }
    else { // bytes
	n = t;
	scale = '';
    }

    if ( n < 99 ) // only show after decimal for large number
	n = floatAsStr( n, 1 );
    else
	n = floatAsStr( n, 0 );

    return n + scale;
}

function drawNet( id, pixels, threshs, colour, maxPixels, labelOff, labelTxt, drawBg ) {
    var txt = '';
    // backgrounds
    if ( drawBg ) {
	txt += '<div style="position:absolute; top:2px; left:0px;  width:' + threshs[0] + 'px; height:1px; background-color:' + barBGColour + ';"></div>';
	txt += '<div style="position:absolute; top:1px; left:' + threshs[0] + 'px; width:' + ( threshs[1] - threshs[0] ) + 'px; height:2px; background-color:' + barBGColour + ';"></div>';
	txt += '<div style="position:absolute;          left:' + threshs[1] + 'px; width:' + ( 50 - threshs[1] ) + 'px; height:3px; background-color:' + barBGColour + ';"></div>';
    }

    // active stuff
    txt += '<div id="' + id + '1" style="position:absolute; top:2px; left:0px;  width:' + ( pixels > threshs[0] ? threshs[0] : pixels ) + 'px; height:1px; background-color:' + colour + ';"></div>'; // height:1px;
    wid = 0;
    if ( pixels > threshs[0] )
	wid = pixels > threshs[1] ? threshs[1] - threshs[0] : pixels - threshs[0];
    txt += '<div id="' + id + '2" style="position:absolute; top:1px; left:' + threshs[0] + 'px; width:' + wid + 'px; height:2px; background-color:' + colour + ';"></div>'; // height:2px;
    wid = 0;
    if ( pixels > threshs[1] )
	wid = pixels - threshs[1];
    txt += '<div id="' + id + '3" style="position:absolute;          left:' + threshs[1] + 'px; width:' + wid + 'px; height:3px; background-color:' + colour + ';"></div>'; // height:3px;
    if ( maxPixels >= 0 )
	txt += '<div id="' + id + '_max" style="position:absolute; left:' + maxPixels + 'px; width:1px; height:3px; background-color:' + colour + ';"></div>';
    if ( labelTxt != '' )
	txt += '<div id="' + id + '_txt" style="position:absolute; font-size:80%; color:white; top:2px; left:' + labelOff + 'px;">' + labelTxt + '</div>';

    return txt;
}


function jobRequestsGpus( line ) {
    if ( line[5].split(' ')[0] == 'Gpus' )
	return 1;
    return 0;
}

function toolTipJobTextAdd( username, line, group ) {
    var txt = '';
    txt += '<b>' + username + '</b>, ';
    if ( group != 'none' ) txt += group + ', ';

    // line is approx: [ jobId, job name, nodes, cpus, loadbal, switches, mem, walltime, remaining ]
    txt += '<font color="red">' + line[0] + '</font>, ';
    txt += '<b>' + line[1] + '</b>, ';
    txt += '<font color="red">State ' + line[2] + '</font>, ';  // state
    txt += '<font color="blue">' + line[3] + '</font>, ';
    txt += '<font color="blue">' + line[4] + '</font>, ';
    var gpu = jobRequestsGpus( line );
    if ( gpu == 1 ) {
	txt += '<font color="blue">' + line[5] + '</font>, ';
    }
    //txt += 'line length ' + line.length + ',';
    for (var i=5+gpu; i<line.length; i++) {
	txt += line[i];
	if ( i != line.length-1 ) txt += ', ';
    }

    return txt;
}

function jobInfoWindow( evt, jobId, thisNode ) {
    if ( timeoutShow ) clearTimeout( timeoutShow );
    if ( timeoutHide ) clearTimeout( timeoutHide );

    // see if the job's gone away
    if ( !jobsMap[jobId] ) {
	hideJobInfoWindow();
	return;
    }

    toolTip = document.getElementById( 'tipDiv' );

    // basic how to do a popup stuff was ripped and modified from:
    //   http://www.dynamicdrive.com/dynamicindex4/imagetooltip.htm

    // Calculations use mouseover event position,
    // offset amounts and tooltip width to position
    // tooltip within window.
    var mouseX = evt.pageX;
    var mouseY = evt.pageY;
    // document area in view (subtract scrollbar width for ns)
    var winWd = window.innerWidth-20+window.pageXOffset;
    var winHt = window.innerHeight-20+window.pageYOffset;
    // check mouse position against tip and window dimensions
    // and position the tooltip

    // tip width is wider for a gpu job
    var tw = tipWidth;
    toolTip.jobHasGpus = jobRequestsGpus( jobsMap[jobId][3] ); // parse line for gpus=
    if ( toolTip.jobHasGpus )
	tw += 140; // 2 columns of ~70 each

    // set tooltip x location - preferably just below and to the right of the hover/click,
    // but screen zooms complicate this a lot...
    if ((mouseX+offX+tw)>winWd) { // right side of the tooltip is off the viewport
        var l = winWd - tw;  // shift it left only as much as required to fit in the viewport
        if (l < window.pageXOffset+offX) { // tooltip is wider than the viewport - can happen on zoomed mobile
           l = window.pageXOffset+offX;    // we prefer to see the left hand of the tooltip
           var w = document.getElementById('wholeTable').clientWidth;
           if (l + tw > w) {  // stop it falling off the right of the nodes table
              l = w-tw-offX;
           }
        }
        if (l < 0) l = 0; // stop it ever falling off the left edge
        //console.log('tw ' + tw + ' winWd ' + winWd + ' mouseX ' + mouseX + ' innerWidth ' + window.innerWidth + ' pageXOffset ' + window.pageXOffset + ' l ' + l);
	toolTip.style.left = l+"px";
    }
    else
	toolTip.style.left = mouseX+offX+"px";

    var txt = '<table bgcolor="' + toolBgColour + '" width="' + tw + '">';  // #ffffaa or cc is the typical post-it note yellow
    txt += '<tr><td>';
    txt += '<div id="toolTipJobText"></div>';

    // display separate and total user/sys/idle and mem for job's nodes

    // white style
    //nodesBgColour = 'white';
    //nodesFgColour = 'black';
    // black style
    nodesBgColour = 'black';
    nodesFgColour = 'white';

    nodes = jobsMap[jobId][2];

    var doAverages = 0;
    // make a uniq list of nodes with an extra 'ave' at the end
    var nodeList = [];
    var cnt = 0;
    prevN = '';
    for (var j=0; j < nodes.length; j++ ) {
	n = nodes[j];
	if ( n == prevN )
	    continue;
	nodeList[cnt] = n;
	prevN = n;
	cnt++;
    }
    if ( cnt > 1 ) // >1 node
	doAverages = 1;
    if ( doAverages )
	nodeList[cnt] = 'ave';
    toolTip.nodeList = nodeList;

    toolTip.prevState = [];
    toolTip.prevAveState = [];
    toolTip.prevNetworkState = [];

    var maxRows = 128;
    var visibleMaxRows = 100; // an even number. # of rows to show if rows > maxRows (== # nodes)
    var halfvisibleMaxRows = visibleMaxRows/2;

    if ( cnt > 1 ) {
	rowsToDraw = cnt;
	if ( rowsToDraw > maxRows )
	    rowsToDraw = visibleMaxRows + 1;
    }
    else
	rowsToDraw = 1.5;

    y = 5;
    txt += '<div style="position:relative; top:0px; left:5px; height:' + (4*(rowsToDraw + 1 + 5*doAverages) + 20) + 'px; width:' + (tw - 15)+ 'px; background-color:' + nodesBgColour + ';">';

    // column titles
    txt +=   '<div style="position:absolute; top:' + y + 'px;">';
    txt +=     '<div style="position:absolute; font-size:80%; color:' + nodesFgColour + '; top:-6px; left:' + (140 + 70*toolTip.jobHasGpus/2) + 'px;">' + 'instantaneous' + '</div>';
    txt +=     '<div style="position:absolute; font-size:80%; color:' + nodesFgColour + '; top:-6px; left:' + (330 + 3*70*toolTip.jobHasGpus/2) + 'px;">' + 'job&nbsp;average&nbsp;/&nbsp;max' + '</div>';
    txt +=   '</div>';
    y += 7;

    // more column titles
    txt +=   '<div style="position:absolute; top:' + y + 'px;">';
    cols = [ '  cpu', 'gpu', 'memory', 'network' ];
    for ( var j = 0; j < 2; j++ ) {
	var l =  j*(200 + 70*toolTip.jobHasGpus) + 90;
	for ( var i = 0; i < 4; i++ ) {
	    if ( i == 1 && toolTip.jobHasGpus == 0 )
		continue;
	    txt +=    '<div style="position:absolute; font-size:80%; color:' + nodesFgColour + '; top:-6px; left:' + l + 'px;">' + cols[i] + '</div>';
	    l += 60;
	}
    }
    txt +=   '</div>';
    y += 10;

    // find max memory of the nodes in this job - allows for some nodes having more ram than others
    maxMemOnNode = 0.0;
    for (var j=0; j < nodeList.length; j++ ) {
    	n = nodeList[j];
	if ( n == 'ave' )
	    continue;

	try {
	    totMem = prevMem[n + '_m'][1];
	    if ( totMem > maxMemOnNode )
		maxMemOnNode = totMem;
	}
	catch(failure) {
	    continue;
	}
    }

    cnt = 0;
    hiddenNode = [];
    for (var j=0; j < nodeList.length; j++ ) {
    	n = nodeList[j];

	labelU = '';
	labelG = '';
	labelM = '';
	if ( n == 'ave' ) { // compute averages
	    if ( doAverages && cnt > 1 ) {
		labelU = 'placeholder';
		labelG = 'placeholder';
		labelM = 'placeholder';
		y += 4;
	    }
	    else {  // skip averages
		continue;
	    }
	}

	// one row per node
        compactMode = 0;
	if ( nodeList.length - 1 > maxRows ) { // hide rows for big jobs, -1 for 'ave'
	    if ( j == halfvisibleMaxRows ) { // a row with '...' in it
		y += 4;
		compactMode = 2;
	    }
	    else if ( j > halfvisibleMaxRows && j < (nodeList.length - halfvisibleMaxRows) ) {
		compactMode = 1;
	    }
	}

	if ( compactMode != 1 ) {
	    txt += '<div style="position:absolute; top:' + y + 'px;">';
	    hiddenNode[cnt] = 0;
	}
	else {
	    txt += '<div style="position:absolute; visibility:hidden; top:' + y + 'px;">';
	    hiddenNode[cnt] = 1;
	}

	// node name text
	if ( n == 'ave' )
	    txt +=   '<div style="position:absolute; font-size:80%; color:' + nodesFgColour + '; top:-6px; left:' + 20 + 'px;">' + 'average' + '</div>';
	else {
	    if ( !hiddenNode[cnt] ) {
		if ( n == thisNode && nodeList.length > 2 ) // 2. because one node and one ave
		    colour = 'green';
		else
		    colour = nodesFgColour;
		txt +=   '<div style="position:absolute; font-size:80%; color:' + colour + '; top:-6px; left:' + (cnt % 2 ? 35 : 5) + 'px;">' + n + '</div>';
	    }
	}

	if ( compactMode == 2 )
	    txt += '<div style="position:absolute; border:dashed 1px grey; top:-3px; height:0px; width:' + (tw/2)+ 'px; left:150px;"></div>';

	u = 0;
	s = 0;
	w = 0;
	i = 50 - s - u - w;
	g = 0;
	m = 0;
	swap = 0;
	load = 0;

	toolTip.prevState[cnt] = [ u, s, w, i, g, m, swap, load ];

	if ( !hiddenNode[cnt] )
	    txt += drawCpuMem( 80, n, toolTip.jobHasGpus, u, s, w, i, g, m, 50*totMem/maxMemOnNode, swap, -1, -1, -1, 10, labelU, labelG, labelM );

	try {
	    // bytes
	    id = n + '_n';

	    labelTxt = '';
	    if ( n == 'ave' )
		labelTxt = '-'; // placeholder

	    pixels = -1;
	    dodgy = 0;

	    if ( !hiddenNode[cnt] ) {
		txt += '<div style="position:absolute; left:' + (200 + 70*toolTip.jobHasGpus) + 'px;">';  // byte rate
		txt += drawNet( 'tt_' + id, pixels, netBytePixelThresh, dodgy?networkSharedColour:networkColour, -1, 15, labelTxt, 1 );
		txt += '</div>';
	    }

	    toolTip.prevNetworkState[cnt] = [ pixels, dodgy ];
	}
	catch (failure) {
	    addErr( 'toolTip - net drawChart: (possibly ' + n + '). err ' + failure );
	}

	try { // job so far totals

	    u = 0;
	    s = 0;
	    w = 0;
	    i = 50 - s - u - w;
	    g = 0;
	    b = 0;
	    swap = 0;
	    maxU = 0;
	    maxG = 0;
	    maxM = 0;
	    maxB = 0;
	    mScaled = 0;
	    maxMScaled = 0;
	    dodgyNet = 0;

	    toolTip.prevAveState[cnt] = [ u, s, w, i, g, mScaled, swap, b, maxU, maxG, maxMScaled, maxB, dodgyNet ];

	    labelTxt = '';
	    labelU = '';
	    labelG = '';
	    labelM = '';
	    if ( n == 'ave' ) {
		labelTxt = '-'; // placeholder
		labelU = '-';   // placeholder
		labelG = '-';   // placeholder
		labelM = '-';   // placeholder
	    }

	    if ( !hiddenNode[cnt] ) {
		txt += drawCpuMem( 280 + 70*toolTip.jobHasGpus, n + '_ave', toolTip.jobHasGpus, u, s, w, i, g, mScaled, parseInt(50*totMem/maxMemOnNode), swap, maxU, maxG, maxMScaled, 0, labelU, labelG, labelM );

		txt += '<div style="position:absolute; left:' + (400 + 2*70*toolTip.jobHasGpus) + 'px;">';  // byte rate
		txt += drawNet( 'tt_' + n + '_n_ave', b, netBytePixelThresh,  dodgyNet?networkSharedColour:networkColour, maxB, 1, labelTxt, 1 );
		txt += '</div>';
	    }
	}
	catch (failure) {
	    // do nothing
	    addErr( 'toolTip - job averages: (possibly ' + n + '). err ' + failure );
	}

	txt += '</div>';

	if ( compactMode == 0 )
	    y += 4;
	cnt++;
    }

    // store bits and bobs so we can update the bars later
    toolTip.doAverages = doAverages;
    toolTip.jobId = jobId;
    toolTip.maxMemOnNode = maxMemOnNode;
    toolTip.hiddenNode = hiddenNode;

    percToolTipChange = '';

    txt += '</div>';

    txt += '</td></tr></table>';
    changeInner( toolTip, txt, 'toolTip' );

    refreshToolTipBars(1); // first

    //toolTip.style.opacity = 0.9;
    toolTip.style.borderColor = '#000000';
    toolTip.style.borderWidth = '1px';
    toolTip.style.borderStyle = 'solid';

    // tooltip width and height
    //addErr( 'toolTip.offsetWidth ' + toolTip.offsetWidth + ', toolTip.offsetHeight ' + toolTip.offsetHeight ); // debug
    var tpHt = toolTip.offsetHeight;
    if ((mouseY+offY+tpHt)>winHt)
	toolTip.style.top = winHt-(tpHt+offY)+"px";
    else
	toolTip.style.top = mouseY+offY+"px";

    timeoutShow = setTimeout( "showJobInfoWindow();", toolTimeoutShow );
    timeoutHide = setTimeout( "hideJobInfoWindow();", toolTimeoutHide );
}

function hideJobInfoWindow() {
    toolTip.style.visibility = 'hidden';
    percToolTipChange = '';
}

function showJobInfoWindow() {
    toolTip.style.visibility = 'visible';
    percToolTipChange = '';
}

function closeJobInfoWindow() {
    if ( timeoutShow ) clearTimeout( timeoutShow );
    toolTip.style.visibility = 'hidden';
    //win.close();
    percToolTipChange = '';
}

function setMemDivContents( id, left, m, swap ) {
    var txt = '';

    if ( swap ) {
	// yellow box with red over it
	txt += '<div id="' + id + 'm" style="position:absolute; font-size:1px; height:3px; width:' + m + 'px; left:' + left + 'px;"><img src="' + config.gifDir + 'redyellow4.gif' + '" width=100% height=3></div>';

        //txt += '<div id="' + id + 'm" style="position:absolute; background-color:#ffff00; font-size:1px; height:3px; width:' + m + 'px; left:' + left + 'px;">';
        //for ( var k=0; k < 4; k++ )
        //    txt += '<div style="position:absolute; background-color:#ff0000; font-size:1px; height:3px; width:' + (100*m/8) + '%; left=' + (100*k*m/4) + '%"></div>';
	//txt += '</div>';

        //txt += '<div style="position:absolute; background-color:#ffff00; font-size:1px; height:3px; width:' + m + 'px; left:' + left + 'px;"></div>';
        //for ( var k=0; k < 4; k++ )
        //    txt += '<div style="position:absolute; background-color:#ff0000; font-size:1px; height:3px; width:' + m/8 + 'px; left:' + ( left + k*m/4 ) + 'px;"></div>';
    }
    else  // green bar
	txt += '<div id="' + id + 'm" style="position:absolute; background-color:#00ff00; font-size:1px; height:3px; width:' + m + 'px; left:' + left + 'px;"></div>';

    return txt;
}

function doLoadDiv( left, load ) {
    level = loadToLevel( load, loadBWbg ); // map load to colour
    str =  load.toString();
    if ( str.indexOf('.') == -1 )
	str += '.0';
    var txt = '<div id="tt_' + n + '_l" style="position:absolute; font-size:80%; background-color:' + loadBWbg[level] + '; color:' + (level > 1 ? '#ffffff' : '#000000') + '; top:-6px; left:' + left + 'px;">' + str + '</div>';
    return txt;
}

function memText( m ) {
   var suffix = 'm';
   if ( m > 999999 ) {
      suffix = 't';
      return floatAsStr( m/1000000.0, 1 ) + suffix;
   }
   if ( m > 999 ) {
      suffix = 'g';
      return floatAsStr( m/1000.0, 1 ) + suffix;
   }
   return floatAsStr( m, 0 ) + suffix;
}

function updateCpuMem( offset, id, doGpu, u, s, w, i, g, m, swap, maxU, maxG, maxM, prevU, prevS, prevW, prevI, prevG, prevM, prevSwap, prevMaxU, prevMaxG, prevMaxM, doLabels, realM, realMaxM ) {
    // cpu
    left = offset;
    if ( u != prevU || s != prevS || w != prevW) {
	if ( useDivs ) {
	    d = document.getElementById( 'tt_' + id + '_u' );
	    d.style.width = '' + u + 'px';

	    d = document.getElementById( 'tt_' + id + '_w' );
	    d.style.left = '' + (left + u) + 'px';
	    d.style.width = '' + w + 'px';

	    d = document.getElementById( 'tt_' + id + '_s' );
	    d.style.left = '' + (left + u + w) + 'px';
	    d.style.width = '' + s + 'px';
	}
	else {
	    d = document.getElementById( 'tt_' + id + '_u' );
	    d.width = u;
	    d = document.getElementById( 'tt_' + id + '_w' );
	    d.width = w;
	    d = document.getElementById( 'tt_' + id + '_s' );
	    d.width = s;
	    d = document.getElementById( 'tt_' + id + '_i' );
	    d.width = i;
	}

	ttNumCpuChanged++;
    }

    if ( maxU >= 0 && maxU != prevMaxU ) {
	d = document.getElementById( 'tt_' + id + '_maxu' );
	d.style.left = '' + (left + maxU) + 'px';
    }
    if ( doLabels && ( u != prevU || ( maxU >= 0 && maxU != prevMaxU ) ) ) {
	d = document.getElementById( 'tt_' + id + '_u_txt' );
	var txt = floatAsStr( 2.0*u, 0 ) + '%';
	if ( maxU >= 0 )
	    txt += '&nbsp;/&nbsp;' + floatAsStr( 2.0*maxU, 0 ) + '%';
	d.innerHTML = txt;
    }

    // gpu
    if ( doGpu ) {
	left = offset + 60;
	if ( g != prevG ) {
	    if ( useDivs ) {
		d = document.getElementById( 'tt_' + id + '_g' );
		d.style.width = '' + g + 'px';
	    }
	}
	if ( maxG >= 0 && maxG != prevMaxG ) {
	    d = document.getElementById( 'tt_' + id + '_maxg' );
	    d.style.left = '' + (left + maxG) + 'px';
	}
	if ( doLabels && ( g != prevG || ( maxG >= 0 && maxG != prevMaxG ) ) ) {
	    d = document.getElementById( 'tt_' + id + '_g_txt' );
	    var txt = floatAsStr( 2.0*g, 0 ) + '%';
	    if ( maxG >= 0 )
		txt += '&nbsp;/&nbsp;' + floatAsStr( 2.0*maxG, 0 ) + '%';
	    d.innerHTML = txt;
	}
    }

    // mem
    left = offset + 60 + 60*doGpu;
    if ( m != prevM || swap != prevSwap ) {
	memId = 'tt_' + id + '_m';
	if ( useDivs ) {
	    if ( swap != prevSwap ) {
		// rebuild the div into swapping or not mode
		d = document.getElementById( memId );
		d.innerHTML = setMemDivContents( memId, left, m, swap );
	    }
	    else {
		// change the size of the mem div
		d = document.getElementById( memId + 'm' );
		d.style.width = '' + m + 'px';
	    }
	}
	else {
	    d = document.getElementById( memId );
	    if ( swap != prevSwap )
		d.src = config.gifDir + ( swap ? 'redyellow4.gif' : 'green.gif' );
	    d.width = m;
	}

	ttNumMemChanged++;
    }

    if ( maxM >= 0 && maxM != prevMaxM ) {
	d = document.getElementById( 'tt_' + id + '_maxm' );
	d.style.left = '' + (left + maxM) + 'px';
    }
    if ( doLabels && ( m != prevM || ( maxM >= 0 && maxM != prevMaxM ) ) ) {
	d = document.getElementById( 'tt_' + id + '_m_txt' );
	var txt = memText( realM );
	if ( maxM >= 0 )
	    txt += '&nbsp;/&nbsp;' + memText( realMaxM );
	d.innerHTML = txt;
    }
}


function refreshToolTipBars(first) {
    if ( !toolTip )
	return;

    if (!first) {
	if ( toolTip.style.visibility == 'hidden' )
	    return;
    }

    ttNumCpuChanged = 0;
    ttNumMemChanged = 0;
    ttNumNetChanged = 0;

    n = '';
    // kinda need this all in a try/catch as the tooltip may disappear
    // at any time during this update ...

    // I don't understand why, but this update is _REALLY_ slow ...
    // it's not strongly related to a) div vs. gif b) opacity
    // ... just seems to be that getElementById's are way slow in a tooltip

    newState = [];
    newAveState = [];
    newNetworkState = [];

    jobId = toolTip.jobId;
    maxMemOnNode = toolTip.maxMemOnNode;

    // jobsMap[jobId] = username, group, [nodelist, ...], [line, ...], state, colour
    username = jobsMap[jobId][0];
    group = jobsMap[jobId][1];
    line = jobsMap[jobId][3];
    d = document.getElementById( 'toolTipJobText' );
    d.innerHTML = toolTipJobTextAdd( username, line, group );

    try {
	cnt = 0;
	aveU = 0.0;
	aveS = 0.0;
	aveW = 0.0;
	aveG = 0.0;
	aveM = 0.0;
	aveSwap = 0.0;
	aveNet = 0.0;
	dodgyAve = 0;

	nodes = toolTip.nodeList;
	for (var j=0; j < nodes.length; j++ ) {
	    n = nodes[j];

	    prev = toolTip.prevState[cnt];

	    prevU = prev[0];
	    prevS = prev[1];
	    prevW = prev[2];
	    prevI = prev[3];
	    prevG = prev[4];
	    prevM = prev[5];
	    prevSwap = prev[6];

	    if ( n == 'ave' ) {
		doLabels = 1;
		realM = 0;

		if ( toolTip.doAverages && nodes.length > 2 && cnt > 1 ) {
		    u = parseInt( aveU/cnt );
		    s = parseInt( aveS/cnt );
		    w = parseInt( aveW/cnt );
		    i = 50 - s - u - w;
		    g = parseInt( aveG/cnt );
		    realM = aveM/cnt;
		    m = parseInt( 50*realM/maxMemOnNode );
		    swap = 0;
		    if ( aveSwap/cnt > 0.5 )
			swap = 1;
		}
		else {
		    continue;
		}
	    }
	    else {
		doLabels = 0;
		realM = 0;

		u = prevCpu[ n + '_u' ];
		s = prevCpu[ n + '_s' ];
		w = prevCpu[ n + '_w' ];
		i = prevCpu[ n + '_i' ];
		g = prevGpu[ n + '_g' ];
		m = prevMem[ n + '_m' ][0];
		totMem = prevMem[n + '_m'][1];
		m *= 0.01*totMem; // convert from a percentage to real memory
		swap = prevMem[ n + '_m' ][2];

		aveU += u;
		aveS += s;
		aveW += w;
		aveG += g;
		aveM += m;
		aveSwap += swap;

		m = parseInt( 50*m/maxMemOnNode );  // turn back into a 0->50 number, but now scaled by the node's mem size
	    }

	    load = 0;
	    newState[cnt] = [ u, s, w, i, g, m, swap, load ];

	    if ( !toolTip.hiddenNode[cnt] )
		updateCpuMem( 80, n, toolTip.jobHasGpus, u, s, w, i, g, m, swap, -1, -1, -1, prevU, prevS, prevW, prevI, prevG, prevM, prevSwap, -1, -1, -1, doLabels, realM, 0 );

	    try {
		// bytes
		id = n + '_n';

		prevPixels = toolTip.prevNetworkState[cnt][0];
		prevDodgy = toolTip.prevNetworkState[cnt][1];

		if ( n == 'ave' ) {
		    t = aveNet/cnt;
		    pixels = bytesTrafficToPixels( t );
		    dodgy = dodgyAve;

		    if ( pixels != prevPixels ) {
			labelTxt = trafficToString( t );
			d = document.getElementById( 'tt_' + id + '_txt' );
			d.innerHTML = labelTxt;
		    }
		}
		else {
		    t = prevNetwork[id][0];
		    pixels = prevNetwork[id][1];
		    dodgy = prevNetwork[id][4];
		    aveNet += t;
		    if ( dodgy )
			dodgyAve = 1;
		}

		if ( !toolTip.hiddenNode[cnt] )
		    updateNetChart( pixels, prevPixels, 'tt_' + id, netBytePixelThresh, -1, -1, dodgy, prevDodgy );

		newNetworkState[cnt] = [ pixels, dodgy ];
	    }
	    catch (failure) {
		addErr( 'toolTipAddition net drawChart: ' + failure );
	    }

	    try { // update the job so far averages

		// ok, averagesMap isn't @!$@#%@! working, so do it the slow way...
		listOfNodes = findAveragesForJob( jobId );
		nodeInfo = findNodeAve( listOfNodes, n );
		if ( nodeInfo.length ) { // 1 cpu jobs may not have any averages
		    aveSoFar = nodeInfo[1];
		    maxSoFar = nodeInfo[2];
		    totMem = nodeInfo[3];
		    dodgyNet = nodeInfo[4];

		    u = aveSoFar[0]/2; // scale percentage into 0->50
		    s = aveSoFar[1]/2;
		    w = aveSoFar[2]/2;
		    i = aveSoFar[3]/2;
		    g = aveSoFar[4]/2;
		    m = aveSoFar[5];

		    t = descaleTraffic( aveSoFar[6], aveSoFar[7] );
		    b = bytesTrafficToPixels( t );
		    //p = pktsTrafficToPixels( descaleTraffic( aveSoFar[8], aveSoFar[9] ) );

		    swap = 0;
		    if ( aveSoFar[10] > 0.5 )
			swap = 1;

		    maxU = maxSoFar[0]/2; // scale percentage into 0->50
		    maxG = maxSoFar[1];
		    maxM = maxSoFar[2];

		    maxT = descaleTraffic( maxSoFar[3], maxSoFar[4] );
		    maxB = bytesTrafficToPixels( maxT );
		    //maxP = pktsTrafficToPixels( descalTraffic( maxSoFar[5], maxSoFar[6] ) );

		    prev = toolTip.prevAveState[cnt];

		    prevU = prev[0];
		    prevS = prev[1];
		    prevW = prev[2];
		    prevI = prev[3];
		    prevG = prev[4];
		    prevM = prev[5];
		    prevSwap = prev[6];
		    prevB = prev[7];
		    prevMaxU = prev[8];
		    prevMaxG = prev[9];
		    prevMaxM = prev[10];
		    prevMaxB = prev[11];
		    prevDodgy = prev[12];

		    mScaled = parseInt( 50*m/maxMemOnNode );
		    maxMScaled = parseInt( 50*maxM/maxMemOnNode );

		    newAveState[cnt] = [ u, s, w, i, g, mScaled, swap, b, maxU, maxG, maxMScaled, maxB, dodgyNet ];

		    if ( !toolTip.hiddenNode[cnt] ) {
			updateCpuMem( 280 + 70*toolTip.jobHasGpus, n + '_ave', toolTip.jobHasGpus, u, s, w, i, g, mScaled, swap, maxU, maxG, maxMScaled, prevU, prevS, prevW, prevI, prevG, prevM, prevSwap, prevMaxU, prevMaxG, prevMaxM, doLabels, m, maxM );

			updateNetChart( b, prevB, 'tt_' + n + '_n_ave', netBytePixelThresh, maxB, prevMaxB, dodgyNet, prevDodgy );
		    }

		    if ( n == 'ave' ) {
			fs = nodeInfo[5];
		    }

		    if ( n == 'ave' && ( b != prevB || maxB != prevMaxB ) ) {
			d = document.getElementById( 'tt_' + n + '_n_ave_txt' );
			d.innerHTML = trafficToString( t ) + '&nbsp;/&nbsp;' + trafficToString( maxT );
		    }
		}
	    }
	    catch (failure) {
		addErr( 'toolTipAddition - job averages: (possibly ' + n + '). err ' + failure );
	    }

	    cnt++;
	}
    }
    catch (failure) {
	addErr( 'toolTipAddition: (possibly ' + n + '). err ' + failure );
    }

    if ( newState.length > 0 )
	toolTip.prevState = newState;
    if ( newAveState.length > 0 )
	toolTip.prevAveState = newAveState;
    if ( newAveState.length > 0 )
	toolTip.prevNetworkState = newNetworkState;

    percToolTipChange = 'toolTipChanged cpu ' + ttNumCpuChanged + ' (' + parseInt(100.0*ttNumCpuChanged/cnt) + '%) mem ' + ttNumMemChanged + ' (' + parseInt(100.0*ttNumMemChanged/cnt) + '%) net ' + ttNumNetChanged + ' (' + parseInt(100.0*ttNumNetChanged/cnt) + '%)';
}



// cookie fns from
//    http://www.quirksmode.org/js/cookies.html

function createCookie(name,value,days)
{
    if (days)
    {
	var date = new Date();
	date.setTime(date.getTime()+(days*24*60*60*1000));
	var expires = "; expires="+date.toGMTString();
    }
    else var expires = "";
    document.cookie = name+"="+value+expires+"; path=/";
}

function readCookie(name)
{
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for(var i=0;i < ca.length;i++)
    {
	var c = ca[i];
	while (c.charAt(0)==' ') c = c.substring(1,c.length);
	if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
    }
    return null;
}

function eraseCookie(name)
{
    createCookie(name,"",-1);
}


extraDelay = 0;
typicalExtraDelay = 500;
totalDelays = 0;
timeFudge = 0;

function doNextFn( i ) {
    j = i+1;

    d = delay + extraDelay;  // shuffle to avoid races
    totalDelays += d;
    timeFudge = d;
    extraDelay = 0;

    //// debug
    //dd = document.getElementById( 'debug_text' );
    //dd.innerHTML = fns[j];

    setTimeout( fns[j] + '(' + j + ')', d ); // schedule the next fn
    if ( doIncrs ) incrCount( progressIncr );
}


function processToolTip( nextFn ) {
    refreshToolTipBars(0);
    start = addToTimeStr( 'toolTipTime', start );

    extraDelay = typicalExtraDelay;
    doNextFn( nextFn );
}

function processPbsNodes( nextFn ) {
    // compare new nodes to prev pbsnodes
    try {
	pbsnodes = get( 'pbsnodes', 0 );
    } catch(failure) {
	addErr( 'pbsnodes get failure. err ' + failure );
	doNextFn( nextFn );
	return;
    }
    var pm = new Array();
    if ( pbsnodes ) {
	for (var i = 0; i < pbsnodes.length; i++ ) {
	    n = pbsnodes[i][0];
	    o = pbsnodes[i][1];
	    pm[n] = o;

	    // a changed state of a node
	    if ( ! prevPbsNodesMap[n] || o != prevPbsNodesMap[n] ) {  // not defined or changed state
		html = '<font color="red">' + o + '</font>';
		d = document.getElementById( n + '_warn' );
		if ( !d ) {
		    addErr( 'pbsnodes warn element not found ' + n );
		    continue;
		}

                if (isComputeNode(n))
                    changeInner( d, html, 'pbsnodes compute' );
                else // non-compute nodes have the name first
                    d.innerHTML = n + ' ' + html;
	    }
	}
    }
    // loop over prevPbsNodes's and set to blank if they're not special any more
    if ( prevPbsNodes ) {
	for (var i = 0; i < prevPbsNodes.length; i++ ) {
	    n = prevPbsNodes[i][0];


	    if ( ! pm[n] ) { // was set now not set, so reset to blank
		d = document.getElementById( n + '_warn' );

                if (isComputeNode(n))
    		    d.innerHTML = '';
		else
    		    d.innerHTML = n;
	    }
	}
    }
    prevPbsNodesMap = pm;
    prevPbsNodes = pbsnodes;
    start = addToTimeStr( 'pbsnodesTime', start );
    doNextFn( nextFn );
}


function processNetLoads( nextFn ) {
    if ( config.showRackLoads ) {
        start = addToTimeStr( 'netLoadsTime', start );
        doNextFn( nextFn );
    }

    netloads = get( 'netloads', 1 );
    for (var i = 0; i < netloads.length; i++ ) {
	net = netloads[i][0];
	load = netloads[i][1];

	d = document.getElementById( 'load_' + net );
        if (!d) continue; // sometimes nets aren't there...

	changeInner( d, load, 'netload ' + net );

	load = parseFloat( load );
	colour = loadToLevel( load, loadColours );
	d.bgColor = loadColours[colour];
    }
    start = addToTimeStr( 'netLoadsTime', start );
    doNextFn( nextFn );
}


function processCpuBar( nextFn ) {
    var cpuBar = get( 'cpuBar', 1 );

    var c = new Array();
    var cnt = 0;
    var changed = 0;

    if ( first )  // hide em all
	for(var i=0;i<cpuBar.length;i++) {
	    id = cpuBar[i][0];
	    d = document.getElementById(id);
	    if (d) d.height = 0;
	}

    for(var i=0;i<cpuBar.length;i++) {
	id = cpuBar[i][0];
	val = cpuBar[i][1]/2;  // scale percentage into 0->50
	c[id] = val; // map it to compare later...

	// skip drawing all bars except head nodes in the lighter modes
	if ( ( nextMode == 'sub-lite' || nextMode == 'lite' ) && !isComputeNode(id) )
	    continue;

	cnt += 1;
	if ( prevCpu[id] != val ) {
	    changed += 1;
	    d = document.getElementById(id);
	    if (d) d.width = val;
	    // querying the document is really slow so don't do this:
	    //if ( d.width != cpuBar[i][1] ) d.width = cpuBar[i][1];
	}
    }
    percCpuChanged = parseInt((100.0*changed)/cnt);
    numCpuChanged = changed;
    prevCpu = c;
    start = addToTimeStr( 'cpuBarTime', start );

    if ( !(doIncrs || first) )
	extraDelay = typicalExtraDelay;

    doNextFn( nextFn );
}

function setUrl(n, id, url) {
    try {
	// there may be more nodes in ganglia that we are displaying?
	var d = document.getElementById(id);
	if (typeof d === 'undefined' )
	    addErr('setUrl load element is undefined for ' + n + ' using id ' + id);
    }
    catch (failure) {
	addErr('failed to setUrl for ' + n + ' using id ' + id);
	return;
    }

    d.href = url;
}

function setSingleNodeUrl(n) {
    var gm = gmondGroupMap[n];

    if ( typeof gm === 'undefined' )
	addErr('failed to setSingleNodeUrl for ' + n + '. could not find its gmondGroup');
    else
	setUrl(n, n+'_l', gm);
}

function processGmondGroup( nextFn ) {
    // this won't change so just do it once
    if ( ! first ) {
	doNextFn( nextFn );
	return;
    }

    var g = get( 'gmondGroup', 1 );

    for (var i=0; i < g.length; i++) {
	var n = g[i][0];
	var gm = g[i][1];

	// make a map to use below and later for down nodes
        gmondGroupMap[n] = gm;

	var urlTemplate = config.gmonds[gm][2];
	var url = urlTemplate.replace( '%h', n );

	// set ganglia url for this node
	setUrl(n, n+'_l',  url);

	// same for the temperature divs
	setUrl(n, 'temp_'+n, url);
    }

    // there may be nodes that aren't in ganglia that we are displaying.
    // make a best-guess as to which gmondGroup they belong to
    var gm = 0;
    for (var i=0; i < allNodes.length; i++) {
	var n = allNodes[i];
	var m = gmondGroupMap[n];
	if ( typeof m === 'undefined' ) {
	    // node isn't in gmMap, so use previous node's value of gm to set its url
	    setUrl(n, n+'_l', gm);

	    // store gmMap setting
	    gmondGroupMap[n] = gm;
	}
	else {
	    gm = m;
	}
    }

    doNextFn( nextFn );
}


function processGpuBar( nextFn ) {
    var gpuBar = get( 'gpuloads', 1 );

    var c = new Array();
    var gg = new Array();
    var cnt = 0;
    var changed = 0;

    if ( first )  // hide em all
	for(var i=0;i<gpuBar.length;i++) {
	    var id = gpuBar[i][0];
	    var d = document.getElementById(id);
	    if (d) d.height = 0;
	}

    for(var i=0;i<gpuBar.length;i++) {
	var id = gpuBar[i][0];
	var val = gpuBar[i][1]/2;  // scale percentage into 0->50
	var g = gpuBar[i][2];

	c[id] = val; // map it to compare later...
	gg[id] = g;

	// skip drawing all bars except head nodes in the lighter modes
	if ( ( nextMode == 'sub-lite' || nextMode == 'lite' ) && !isComputeNode(id) )
	    continue;

	cnt += 1;
	if ( prevGpu[id] != val ) {
	    changed += 1;
	    d = document.getElementById(id);
	    if (d) d.width = val;
	}
    }
    percGpuChanged = parseInt((100.0*changed)/cnt);
    numGpuChanged = changed;
    prevGpu = c;
    numGpus = gg;
    start = addToTimeStr( 'gpuBarTime', start );

    if ( !(doIncrs || first) )
	extraDelay = typicalExtraDelay;

    doNextFn( nextFn );
}

function processMem( nextFn ) {
    mem = get( 'mem', 1 );
    var pm = new Array();

    if ( first )
	for(var i=0;i<mem.length;i++) {
	    id = mem[i][0];
	    d = document.getElementById(id);
	    if (d) d.height = 3;
	}

    for(var i=0;i<mem.length;i++) {
	id = mem[i][0];
	m = mem[i][1];
	totMem = mem[i][2];
	swapping = mem[i][3];

	// make it a map so we can reuse it
	pm[id] = [ m, totMem, swapping ];

	// skip drawing all bars except head nodes in the lighter modes
	if ( ( nextMode == 'sub-lite' || nextMode == 'lite' ) && !isComputeNode(id) && !swapping )
	    continue;

	// img width
	if ( !prevMem[id] || prevMem[id][0] != m ) {
	    d = document.getElementById(id);
	    if (d) d.width = m/2;  // mem is given as a % of total, so scale it into our 50 pixel wide bars
	}

	// to swapping or back to normal
	if ( prevMem[id] ) {
	    if ( prevMem[id][2] != swapping ) {
		if ( prevMem[id][0] == m ) // see if we've already got d
		    d = document.getElementById(id);

		if ( swapping )
		    d.src = config.gifDir + 'redyellow4.gif';
		else
		    d.src = config.gifDir + 'green.gif';
	    }
	}
	else {  // no prev to compare it to, so just do the right thing
	    d = document.getElementById(id);
	    if (d) {
		if ( swapping )
		    d.src = config.gifDir + 'redyellow4.gif';
		else
		    d.src = config.gifDir + 'green.gif';
	    }
	}
    }
    prevMem = pm;
    start = addToTimeStr( 'memBarTime', start );

    if ( !(doIncrs || first) )
	extraDelay = typicalExtraDelay;
    doNextFn( nextFn );
}


// for heavy mode
// almost identical code to processMem...
function processDisk( nextFn ) {
    disk = get( 'disk', 1 );
    var dm = new Array();
    for(var i=0;i<disk.length;i++) {
	id = disk[i][0];
	val = disk[i][1];
	full = disk[i][2];
	// make it a map so we can reuse it
	dm[id] = [ val, full ];

	// img width
	if ( !prevDisk[id] || prevDisk[id][0] != val ) {
	    d = document.getElementById(id);
	    if (d)
                d.width = val;
	    else {
		addErr( 'no d in processDisk - node - ' + id );
		continue;
	    }
	}

	// to full or back to normal
	if ( prevDisk[id] ) {
	    if ( prevDisk[id][1] != full ) {
		if ( prevDisk[id][0] == val ) // see if we've already got d
		    d = document.getElementById(id);

		if ( full )
		    d.src = config.gifDir + 'blackyellow4.gif';
		else
		    d.src = config.gifDir + 'black.gif';
	    }
	}
	else {  // no prev to compare it to, so just do the right thing
	    d = document.getElementById(id);

	    if ( full )
		d.src = config.gifDir + 'blackyellow4.gif';
	    else
		d.src = config.gifDir + 'black.gif';
	}
    }
    prevDisk = dm;
    start = addToTimeStr( 'diskBarTime', start );
    doNextFn( nextFn );
}


function processDiskWarn( nextFn ) {
    diskWarn = get( 'diskWarn', 1 );
    var dm = new Array();
    if ( diskWarn ) {
	for(var i=0;i<diskWarn.length;i++) {
	    n = diskWarn[i];
	    // make it a map so we can easily reuse it
	    dm[n] = 1;

	    // to full warning or back to normal
	    if ( ! prevDiskWarnMap[n] ) {  // either not defined or not = 1
		d = document.getElementById( n + '_d' );
		if ( d ) {
		    d.src = config.gifDir + 'blackyellow4.gif';
		    d.width = 50;
		    // make it visible
		    d.height = 3;
		}
	    }
	}
    }
    // loop over prevDiskWarn's and reset back to normal mode if not swapping any more
    if ( prevDiskWarn ) {
	for(var i=0;i<prevDiskWarn.length;i++) {
	    n = prevDiskWarn[i];
	    if ( ! dm[n] ) { // was full, now normal as not listed in warnings any more
		d = document.getElementById( n + '_d' );
		d.src = config.gifDir + 'black.gif';
		// hide it
		d.height = 0;
	    }
	}
    }
    prevDiskWarnMap = dm;
    prevDiskWarn = diskWarn;
    start = addToTimeStr( 'diskWarnTime', start );
    doNextFn( nextFn );
}

function hideRackTemps( nextFn ) {
    d = document.getElementById( 'rackTemps' );
    d.style.visibility = 'hidden';

    doNextFn( nextFn );
}

function showRackTemps( nextFn ) {
    d = document.getElementById( 'rackTemps' );
    d.style.visibility = 'visible';

    doNextFn( nextFn );
}

function hideTempDiv( n ) {
    if ( rackStyle == 'cpu' || rackStyle == 'both' ) {
        d = document.getElementById( 'rack_cpu_' + n );
        d.style.backgroundColor = 'transparent';
        d.title = n + ': down';
    }
    if ( rackStyle == 'both' ) {
	d = document.getElementById( 'rack_mb_' + n );
	d.style.backgroundColor = 'transparent';
	d.title = n + ': down';
    }
    else if ( rackStyle == 'quad' ) {
	d = document.getElementById( 'rack_mb0_' + n );
	d.style.backgroundColor = 'transparent';
	d.title = n + ': down';
	d = document.getElementById( 'rack_mb1_' + n );
	d.style.backgroundColor = 'transparent';
	d.title = n + ': down';
	d = document.getElementById( 'rack_cpu0_' + n );
	d.style.backgroundColor = 'transparent';
	d.title = n + ': down';
	d = document.getElementById( 'rack_cpu1_' + n );
	d.style.backgroundColor = 'transparent';
	d.title = n + ': down';
    }
}

function updateTempPowerDiv( n, force, p ) {
    t = prevTempMap[n];
    hack3 = 0;
    if ( t ) {
	// cpus
	if ( t.length == 4 ) {
            cpu = 0.5*(t[0] + t[1]);
            if (t[2] == t[3]) {
		title = n + ': cpu ' + t[0] + '/' + t[1] + ' mb ' + t[2];
		hack3 = 1;
                mb = t[0];
	    }
	    else {
		title = n + ': cpu ' + t[0] + '/' + t[1] + ' front ' + t[3] + ' rear ' + t[2];
                mb = 0.5*(t[2] + t[3]);;
	    }
	    ret = t;
	}
	else { // must be 2
	    if ( rackStyle == 'quad' ) {
		mb0 = t[0];
		mb1 = t[1];
		title = n + ': rear ' + mb1 + ' front ' + mb0;
		ret = [mb0, mb1];
	    }
	    else {
		cpu = t[0];
		mb = t[1];
		title = n + ': cpu ' + cpu + ' mb ' + mb;
		ret = [cpu, mb];
	    }
	}

	// power in watts
        if ( p != null ) {
	    title += ', ' + p + 'w';
        }

        if (!prevUp[n]) {
            cpu=0;
            mb=0;
	    ret = [cpu, mb];
        }
    }
    else
	ret = 0;

    // intel from processTemp() says that this temp changed?
    if ( !(force || doIncrs || first) && !tempChanged[n] ) // always do it the first time...
	return ret;

    if ( t ) {
    	if (prevUp[n]) {
	    if ( rackStyle == 'cpu' || rackStyle == 'both' ) {
		if ( t.length == 4 ) {
		    d = document.getElementById( 'rack_cpu_' + n );
		    d.style.backgroundColor = cpuTempToColour(cpu, colourMap);
		    d.title = title;
		}
	    }
	    if ( rackStyle == 'both' ) {
		if ( t.length == 4 ) {
	        d = document.getElementById( 'rack_mb_' + n );
		d.style.backgroundColor = mbTempToColour(mb, colourMap);
		d.title = title;
		}
	    }
	    else {
		if ( t.length == 2 ) { // we have an old node with just 2 temps, so assume it's mb0, mb1
		    d = document.getElementById( 'rack_mb0_' + n );
		    d.style.backgroundColor = mb0TempToColour(t[0], colourMap);
		    d.title = title;
		    d = document.getElementById( 'rack_mb1_' + n );
		    d.style.backgroundColor = mb1TempToColour(t[1], colourMap);
		    d.title = title;
		    // and set the cpus to be the same
		    d = document.getElementById( 'rack_cpu0_' + n );
		    d.style.backgroundColor = mb1TempToColour(t[0], colourMap);
		    d.title = title;
		    d = document.getElementById( 'rack_cpu1_' + n );
		    d.style.backgroundColor = mb0TempToColour(t[1], colourMap);
		    d.title = title;
		}
		else {
		    d = document.getElementById( 'rack_mb0_' + n );
		    if ( hack3 ) // have really only 3 temps for this node
			d.style.backgroundColor = mb1TempToColour(t[3], colourMap);
		    else
			d.style.backgroundColor = mb0TempToColour(t[2], colourMap);
		    d.title = title;
		    d = document.getElementById( 'rack_mb1_' + n );
		    d.style.backgroundColor = mb1TempToColour(t[3], colourMap);
		    d.title = title;
		    d = document.getElementById( 'rack_cpu0_' + n );
		    d.style.backgroundColor = cpuTempToColour(t[0], colourMap);
		    d.title = title;
		    d = document.getElementById( 'rack_cpu1_' + n );
		    d.style.backgroundColor = cpuTempToColour(t[1], colourMap);
		    d.title = title;
		}
	    }
	}
    }

    return ret;
}

function updateAllTempPowerDivs() {
    for(var i=0;i<prevTemp.length; i++ ) {
	n = prevTemp[i][0];
	p = prevPower[n];
	updateTempPowerDiv( n, 1, p );
    }
}

function floatAsStr( f, dig ) {
    // take a +ve float and make a string from it, with 'dig' digits after the decimal point
    f *= Math.pow( 10, dig );
    f += 0.5; // make it round off to nearest instead of truncate
    f = parseInt(f); // now an int?
    f = f.toString(); // now a string
    // put the decimal point in the right place
    len = f.length;
    if ( dig > 0 )
	f = f.substring(0,len-dig) + '.' + f.substring(len-dig,len);

    return f;
}

// for normal/heavy mode
function processRackTempsPower( nextFn ) {
    cnt = 0;
    shelfCnt = 0;
    for (var rack=0; rack<config.racks.length; rack++ ) {
	r = config.racks[rack];
	if ( r[0] == 'fe' ) {
	    for (var i=0; i<config.nben.length; i++ ) {
		n = config.nben[i];
		p = prevPower[n];
		updateTempPowerDiv( n, 0, p );
	    }
	}
	else {
            cnt4 = 0;
            cnt2 = 0;
	    rackAveCpu = 0;
	    rackAveMb = 0;
	    rackAveMb0 = 0;
	    rackAveMb1 = 0;
	    rackCnt = 0;
	    rackCntPower = 0;
	    rackPower = 0.0;
	    rackCntShelf = 0;
	    rackShelfPower = 0.0;
	    for (var i=0; i<r[0]; i++ ) {
		n = config.cn[cnt];
		cnt++;
		p = prevPower[n];
		t = updateTempPowerDiv( n, 0, p );

		if ( p != null ) {
		    rackCntPower++;
		    rackPower += 0.001*p;
		}

		if ( t && prevUp[n] ) {
		    if (t.length == 4) {
			rackAveCpu += 0.5*(t[0] + t[1]);
			rackAveMb0 += t[2];
			rackAveMb1 += t[3];
			cnt4 += 1;
		    }
		    else {
			rackAveCpu += t[0];
			rackAveMb += t[1];
			cnt2 += 1;
		    }
		    rackCnt++;
		}
	    }

	    txt = '&nbsp;' + (rack+1) + '<br>';
	    // average rack temperature
	    if ( rackCnt > 0 ) {
		rackAveCpu /= rackCnt;
		if ( cnt4 ) {
		    if ( cnt2 && (cnt4 > 2*cnt2)) {
			// ignore the cnt2's
			rackCnt -= cnt2;
		    }
		    rackAveMb0 /= rackCnt;
		    rackAveMb1 /= rackCnt;
		    txt += floatAsStr( rackAveCpu, 1 ) + '<br><font color="' + rackSummaryColour + '">' + floatAsStr( rackAveMb0, 1 ) + '</font><br>' + floatAsStr( rackAveMb1, 1 );
		}
		else {
		    rackAveMb += 0.5*(rackAveMb0 + rackAveMb1);
		    rackAveMb /= rackCnt;
		    txt += floatAsStr( rackAveCpu, 1 ) + '<br>' + floatAsStr( rackAveMb, 1 );
		}
	    }
	    else {
		txt += '<br><br>';
	    }
	    // tot rack node power
	    if ( rackCntPower > 0 )
		txt += '<br>' + '<font color="' + rackSummaryColour + '">' + floatAsStr( rackPower, 1 ) + '</font>';
	    else
		txt += '<br>0';

            // tot shelf power
	    if (r[1].length == 3 && r[1][0] == 'blade') {   // eg. [96,['blade',12,2]]
		blades = r[1][1];             // eg. 12 blades per shelf
		nodesPerBlade = r[1][2];      // eg. 2
		shelves = r[0]/(blades*nodesPerBlade);        //  => 4 shelves per rack
		for (var j=0; j<shelves; j++ ) {
		    p = prevPower[config.shn[shelfCnt]];
		    if ( p != null ) {
		        rackCntShelf += 1;
			rackShelfPower += 0.001*p;
		    }
		    shelfCnt += 1;
		}
	    }
	    // tot rack shelf power
	    if ( rackCntShelf > 0 ) {
		if ( rackCntShelf >= shelves )
		    txt += '<br>' + floatAsStr( rackShelfPower, 1 );
		else {
		    // didn't find all shelves, so estimate...
		    pwr = rackShelfPower*shelves/rackCntShelf;
		    txt += '<br>' + floatAsStr( pwr, 1 ) + '(est)';
		}
	    }
	    else
		txt += '<br>0';

	    d = document.getElementById( 'rack_' + rack );
	    d.innerHTML = txt;
	}
    }

    start = addToTimeStr( 'rackTempsTime', start );
    doNextFn( nextFn );
}

// for heavy mode
// and also used to find tempChanged for rack temps in normal mode
function processTemp( nextFn ) {
    temp = get( 'temp', 1 );
    var tm = new Array();
    var tc = new Array();
    cnt = 0;
    changed = 0;
    for(var i=0;i<temp.length;i++) {
	id = temp[i][0];
	t = temp[i][1];  // has 4 elements (hot node) or 2 for a normal node
	// make it a map so we can reuse it
	tm[id] = t;

	cnt += 1;
	same = 1;
	if ( ! prevTempMap[id] ) // compare to prev
	    same = 0;
	else {
	    prev = prevTempMap[id];
	    if ( prev.length != t.length )
		same = 0;
	    else {
		same = 1;
		for (var j=0; j < t.length; j++ ) {
		    if ( t[j] != prev[j] ) {
			same = 0;
			break;
		    }
		}
	    }
	}

	if ( !same )
	{
	    // tag this element as being changed. for use by processRackTemps()
	    tc[id] = 1;
	    var txt = '';
	    changed += 1;
            if ( nextMode == 'heavy' ) {
	        d = document.getElementById(id + '_temps');
	        if ( t.length == 4 ) {
		    // cpus
		    txt = '<table cellspacing=0 border=0 cellpadding=1><tr><td bgcolor=' + cpuTempToColour(t[0], tempColoursBg) + '><font size=' + config.tempFontSize + ' color="white">' + t[0] + '</font></td><td bgcolor=' + cpuTempToColour(t[1], tempColoursBg) + '><font size=' + config.tempFontSize + ' color="white">' + t[1] + '</font></td></tr>';
		    // hack for if there's really just one ambient temp
		    if ( t[2] == t[3] )
			txt += '<tr><td></td><td bgcolor=' + mbTempToColour(t[2], tempColoursBg) + '><font size=' + config.tempFontSize + ' color="white">' + t[2] + '</font></td></tr></table>';
		    else
		        txt += '<tr><td bgcolor=' + mb0TempToColour(t[2], tempColoursBg) + '><font size=' + config.tempFontSize + ' color="white">' + t[2] + '</font></td><td bgcolor=' + mb1TempToColour(t[3], tempColoursBg) + '><font size=' + config.tempFontSize + ' color="white">' + t[3] + '</font></td></tr></table>';
	        }
	        else if ( t.length == 2 ) {
		    txt = '<table cellspacing=0 border=0 cellpadding=1><tr><td bgcolor=' + cpuTempToColour(t[0], tempColoursBg) + '><font size=' + config.tempFontSize + ' color="white">' + t[0] + '</font></td></tr>';
		    txt += '<tr><td bgcolor=' + cpuTempToColour(t[1], tempColoursBg) + '><font size=' + config.tempFontSize + ' color="white">' + t[1] + '</font></td></tr></table>';
	        }
	        else {
		    addErr( 'insane temperature - not len 2 or 4 - ' + t );
	        }
	        if (d)
		    d.innerHTML = txt;
		else
		   addErr( 'temperature - d not found - node - ' + id );
	    }
	}
    }
    percTempChanged = parseInt((100.0*changed)/cnt);
    prevTempMap = tm;
    tempChanged = tc; // for use by processRackTemps()
    prevTemp = temp; // needed for changing colour maps
    start = addToTimeStr( 'tempTime', start );
    doNextFn( nextFn );
}


function processTempWarn( nextFn ) {
    tempWarn = get( 'tempWarn', 1 );
    var tm = new Array();
    if ( tempWarn ) {
	for(var i=0;i<tempWarn.length;i++) {
	    n = tempWarn[i][0];
	    t = tempWarn[i][1];
	    // make it a map so we can easily reuse it
	    tm[n] = t;

	    // to temperature warning or back to normal
	    if ( ! prevTempWarnMap[n] ) {  // first time in, or this node hasn't been warned about before
		d = document.getElementById( n + '_temps' );
		// cpus
		var txt = '<table cellspacing=0 border=0 cellpadding=1><tr><td bgcolor=' + cpuTempToColour(t[0], tempColoursBg) + '><font size=' + config.tempFontSize + ' color="white">' + t[0] + '</font></td><td bgcolor=' + cpuTempToColour(t[1], tempColoursBg) + '><font size=' + config.tempFontSize + ' color="white">' + t[1] + '</font></td></tr>';
		if ( t.length == 4 ) {
		    // mbs or ambient
		    // hack for if there's really just one ambient temp
		    if ( t[2] == t[3] )
			txt += '<tr><td></td><td bgcolor=' + mbTempToColour(t[2], tempColoursBg) + '><font size=' + config.tempFontSize + ' color="white">' + t[2] + '</font></td></tr></table>';
		    else
			txt += '<tr><td bgcolor=' + mb0TempToColour(t[2], tempColoursBg) + '><font size=' + config.tempFontSize + ' color="white">' + t[2] + '</font></td><td bgcolor=' + mb1TempToColour(t[3], tempColoursBg) + '><font size=' + config.tempFontSize + ' color="white">' + t[3] + '</font></td></tr></table>';
		}
		if (d) d.innerHTML = txt;
	    }
	}
    }
    // loop over prevTempWarn's and reset back to normal mode if not hot any more
    if ( prevTempWarn ) {
	for(var i=0;i<prevTempWarn.length;i++) {
	    n = prevTempWarn[i][0];
	    if ( ! tm[n] ) { // was full, now normal as not listed in warnings any more
		d = document.getElementById( n + '_temps' );
		d.innerHTML = '';
	    }
	}
    }
    prevTempWarnMap = tm;
    prevTempWarn = tempWarn;
    start = addToTimeStr( 'tempWarnTime', start );
    doNextFn( nextFn );
}

function processLoads( nextFn ) {
    loads = get( 'loads', 1 );
    var ld = new Array();
    var co = new Array();
    for(var i=0;i<loads.length;i++) {
	id = loads[i][0];
	load = loads[i][1];
	cores = loads[i][2];

	// make it a map that we can compare to next time
	ld[id] = load;
	co[id] = cores;

	if ( prevLoads[id] != load )
	{
	    // need to map load to colour and set display fg ...
	    level = loadToLevel( load, loadBWbg, cores );

	    var str =  load.toString();
	    if ( str.indexOf('.') == -1 )
		str += '.0';

	    d = document.getElementById(id);
	    if ( d ) {
		if ( level > 1 )
		    d.innerHTML = '<font color="white">' + str + '</font>';
		else
		    d.innerHTML = str;

		d = document.getElementById(id + '_bg');
		d.bgColor = loadBWbg[level];
	    }
	}
    }
    prevLoads = ld;
    numCores = co;
    start = addToTimeStr( 'nodeLoadsTime', start );
    doNextFn( nextFn );
}

function processPower( nextFn ) {
    power = get( 'power', 1 );
    var pw = new Array();
    for(var i=0;i<power.length;i++) {
	id = power[i][0];
	watts = power[i][1];

	// make it a map that we can compare to next time
	pw[id] = watts;

	if ( prevPower[id] != watts )
	{
	    // should really update temp divs with new power numbers too...

	    d = document.getElementById( 'power_' + id );
	    if ( d ) {
		d.style.backgroundColor = shelfPowerToColour( watts, shelfColourMap );
		title = id + ': power ' + watts + 'W';
		rpm = prevFans[id];
		if (rpm) {
		    title += ', fan RMS ' + rpm + 'rpm';
		}
		d.title = title;
	    }
	}
    }
    prevPower = pw;
    start = addToTimeStr( 'nodePowerTime', start );
    doNextFn( nextFn );
}

function processFans( nextFn ) {
    fans = get( 'fans', 1 );
    var fa = new Array();
    for(var i=0;i<fans.length;i++) {
	id = fans[i][0];
        rpm = fans[i][1];

	// make it a map that we can compare to next time
	fa[id] = rpm;

	if ( prevFans[id] != rpm )
	{
	    d = document.getElementById( 'fan_' + id );
	    if ( d ) {
		//d.innerHTML = rpm.toString();
		d.style.backgroundColor = shelfFanSpeedToColour( rpm, shelfColourMap );
		title = id + ': ';
		watts = prevPower[id];
		if (watts) {
		    title += 'power ' + watts + 'W, ';
		}
		title += 'fan RMS ' + rpm + 'rpm';
		d.title = title;
	    }
	}
    }
    prevFans = fa;
    start = addToTimeStr( 'nodeFansTime', start );
    doNextFn( nextFn );
}

function processJobColours( nextFn ) {
    var colours = get( 'colours', 1);
    if ( colours ) { // if no jobs are running then there are no colours
        pieColours = new Array();
        // a username, colour map that may change as pies change colours...
        // if a user's pie colour changes then need to redraw _all_ that persons job tables to match...!! @@@
        //  ... although pretty sure we don't do that at the moment... :-/
        for (var i=0; i < colours.length; i++ )
	    pieColours[colours[i][0]] = colours[i][1];
    }
    start = addToTimeStr( 'pieColoursTime', start );
    doNextFn( nextFn );
}


// from http://www.crockford.com/javascript/remedial.html
function typeOf(value) {
    var s = typeof value;
    if (s === 'object') {
        if (value) {
            if (value instanceof Array) {
                s = 'array';
            }
        } else {
            s = 'null';
        }
    }
    return s;
}

function processJobs( nextFn ) {
    statusText = '';

    jobs = get( 'jobs', 1);
    same = 1;
    if ( prevJobs.length != jobs.length ) {
	same = 0;
	statusText = 'not prev running jobs. lens changed';
    }
    else {
	for (var i=0;i<jobs.length;i++) {
	    // see if same jobs are running
	    if ( jobs[i][0] != prevJobs[i][0] ) {
		same = 0;
		statusText = 'not prev running jobs. but same len';
		break;
	    }

	    // or if those in the jobs list changed from eg. R to S or S to R.
	    prevRunState = prevJobs[i][5][8];
	    newRunState = jobs[i][5][8];
	    if ( newRunState != prevRunState ) {
		same = 0;
		statusText = 'jobs changed state.';
		break;
	    }
	}
    }
    start = addToTimeStr( 'sameJobsTime', start );

    if ( same ) {
	statusText = 'same running jobs';

	// but still need to update the stats on the currently running jobs
	//   jobs[i] = jobId, username, group, [nodelist, ...],[line, ...],[max mem, max vm, cpus, nodes, cpuTime, wallTime, wallLimit, eff, state, nodes line]
	//   jobsMap[jobId] = username, group, [nodelist, ...], [line, ...], state, colour

        // was:
	//   jobs[i] = jobId, username, [nodelist, ...],[line, ...],[max mem, max vm, cpus, nodes, cpuTime, wallTime, wallLimit, eff, state, nodes line]
	//   jobsMap[jobId] = username, [nodelist, ...], [line, ...], state, colour
	// was:  jobsMap[jobId] = username, [nodelist, ...], [line, ...], colour

        // line
	for (var i=0;i<jobs.length;i++)
	    jobsMap[jobs[i][0]][3] = jobs[i][4];
    }
    else {
	prevJobs = jobs;
	prevJobsMap = jobsMap;

	// generate list of jobs on nodes
	var nodes = [];
        for(var i=0;i<allNodes.length;i++)
            nodes[allNodes[i]] = [];

	// turn jobs into a map so we can look up job 'line' info later
	jobsMap = []; // zero old job
	for (var i=0;i<jobs.length;i++)
	    jobsMap[jobs[i][0]] = [ jobs[i][1],jobs[i][2],jobs[i][3],jobs[i][4],jobs[i][5][8] ];

	for(var i=0;i<jobs.length;i++) {
	    // jobId, username, group, [nodelist, ...],[line, ...],[stats...]
	    jobId = jobs[i][0];

	    jobInt = parseInt( jobId.split('.')[0] );
	    if ( jobs[i][5][8] == 'S' )
		colour = jobInt % jobColoursBWfg.length;
	    else
		colour = jobInt % jobColoursFg.length;

	    // [jobId] = username, group, [nodelist, ...], [line, ...], state, colour
	    jobsMap[jobId][5] = colour;

	    // loop over nodes
	    nodeList = jobs[i][3];
	    for (var j=0; j<nodeList.length; j++) {
		n = nodeList[j];
		// append job to existing jobs on node
		numJobs = nodes[n].length;
		nodes[n][numJobs] = [jobId];
	    }
	}

	// compare to previous jobs on nodes and only alter if they've changed
        for(var i=0;i<allNodes.length;i++) {
	    n = allNodes[i];
	    same = 1;
	    jl = nodes[n];

	    if ( jl.length != prevNodes[n].length )
		same = 0;
	    else {
		for (var j=0; j<jl.length;j++) {
		    if ( jl[j] != prevNodes[n][j] ) {
			same = 0;
			break;
		    }
		}

		// see if a job has changed state on this node
		for (var j=0; j<jl.length;j++) {
		    if (  prevJobsMap[4] != jobsMap[4] ) {
			same = 0;
			break;
		    }
		}
	    }

	    // skip. nothing has changed on this node
	    if ( same )
		continue;

	    d = document.getElementById( n + '_job' );

	    // no jobs on this node any more
	    if ( jl.length == 0 ) {
		html = '';
		changeInner( d, html, 'job ' + n );
		continue;
	    }

	    // write html
	    html = '<table border=0 cellpadding=1 cellspacing=0><tbody>';

	    // for more compact displaying, aggregate cpus on this node together
	    //  - in 'normal' mode, this means aggregate all the cpus of the same job together
	    //               ids = [ job, job, ... ];
	    //             idCnt = [ count, count, ... ];
	    //  - in 'normal-usr/heavy' mode, this means aggregate all the
	    //    cpus of the same user together, but maintain the jobid info as the
	    //    mouseover still needs to be per-job
	    //         ids[user] = [ job, job, ... ];
	    //      idsCnt[user] = [ count, count, ... ];
	    //          userList = [ user, user, ... ];

	    // first, agregate cpus of jobs together
	    prevId = '';
	    ids = [];
	    idCnt = [];
	    count = -1;
	    for(var j=0; j<jl.length;j++ ) {
		id = jl[j][0]; // string eg. '72727.julian'
		if ( id != prevId ) {
		    count++;
		    ids[count] = id;
		    idCnt[count] = 1;
		    prevId = id;
		}
		else
		    idCnt[count]++;
	    }

	    // then aggregate jobs of the same user together
	    userList = [];
	    newIds = [];
	    newIdsCnt = [];
            allSuspended = [];
	    if ( nextMode == 'heavy' || nextMode == 'normal-usr' ) {
		// find a list of users on this node
		var users = [];
		var cnt = 0;
		for(var j=0; j<ids.length;j++ ) {
		    jobId = ids[j];
		    user = jobsMap[jobId][0];
		    users[cnt] = user;
		    cnt++;
		}

		// uniq the list of users
		users.sort();
		userList = [];
		cnt = 0;
		var prevU = '';
		for( var j=0; j<users.length; j++ ) {
		    user = users[j];
		    if ( prevU != user ) {
			userList[cnt] = user;
			cnt++;
			prevU = user;
		    }
		}

		// make newIds* blank lists
		for (var j=0; j<userList.length; j++) {
		    user = userList[j];
		    newIds[user] = [];
		    newIdsCnt[user] = [];
		    allSuspended[user] = [];
		}

		// populate with the jobs
		var k;
		for(var j=0; j<ids.length; j++) {
		    jobId = ids[j];
		    user = jobsMap[jobId][0];
		    k = newIds[user].length;
		    newIds[user][k] = jobId;
		    newIdsCnt[user][k] = idCnt[j];
		}

		// loop over and see if all jobs for a user are suspended
		for(var j=0; j<userList.length;j++ ) {
		    user = userList[j];
		    run = 0;
		    for (var k=0; k<newIds[user].length; k++ ) {
			jobId = newIds[user][k];
			state = jobsMap[jobId][4];
			if ( state != 'S' ) {
			    run = 1;
			    break;
			}
		    }
		    allSuspended[user] = !run;
		}
	    }

	    // loop jobs on this node and write html
	    if ( nextMode == 'lite' || nextMode == 'normal' ) {
		for(var j=0; j<ids.length;j++ ) {
		    html += '<tr><td ';

		    jobId = ids[j];
		    multiJobCnt = idCnt[j];
		    colour = jobsMap[jobId][5];
		    user = jobsMap[jobId][0];
		    state = jobsMap[jobId][4];

		    // make supended jobs shades of grey
		    if ( state == 'S' ) {
			html += 'bgcolor="' + jobColoursBWbg[colour] + '">';
			fgColour = jobColoursBWfg[colour];
		    }
		    else {
			html += 'bgcolor="' + jobColoursBg[colour] + '">';
			fgColour = jobColoursFg[colour];
		    }

		    // write the username
		    html += '<span style="color: ' + fgColour + ';" onmouseover="jobInfoWindow( event, \'' + jobId + '\', \'' + n + '\' );" onmouseout="closeJobInfoWindow();" onclick="jobInfoWindow( event, \'' + jobId + '\', \'' + n + '\' );">' + user;
		    if ( multiJobCnt != 1 )
			html += '&nbsp;x' + multiJobCnt;

		    html += '</span></td>';
		    html += '</tr>';
		}
	    }
	    else { // heavy and normal-usr mode
		for(var j=0; j<userList.length;j++ ) {
		    user = userList[j];
		    html += '<tr>';
		    html += '<td ';

		    // if all the users jobs on this node are suspended, fade the pie colour username
		    if ( allSuspended[user] )
			html += 'style="opacity: 0.4" ';

		    // username in the pieColour and a job colour swatch to differentiate between jobs
		    html += 'bgcolor="' + pieColours[user] + '">';
				
		    fgColour = 'white'; // just a guess... this should be improved...
		    if ( pieColours[user] == 'yellow' || pieColours[user] == '#b2b2b2' || pieColours[user] == '#7effd4' )
			fgColour = 'black';

		    // write the username and link it to the 1st job by this user
		    jobId = newIds[user][0];
		    html += '<span style="color: ' + fgColour + ';" onmouseover="jobInfoWindow( event, \'' + jobId + '\', \'' + n + '\' );" onmouseout="closeJobInfoWindow();" onclick="jobInfoWindow( event, \'' + jobId + '\', \'' + n + '\' );">' + user + '</span>';
		    html += '</td>';

		    html += '<td><table border=0 cellpadding=0 cellspacing=0><tr>'
			html += '<td>';
		    cpusSoFar = 0;
		    for (var k=0; k<newIds[user].length; k++ ) {
			jobId = newIds[user][k];
			multiJobCnt = newIdsCnt[user][k];
			colour = jobsMap[jobId][5];
			state = jobsMap[jobId][4];

			// use a jobcolour swatch to differentiate between jobs
			if ( 0 && state == 'S' ) {
			    //html += '<td bgcolor="' + jobColoursBWbg[colour] + '">';
			    bgColour = jobColoursBWbg[colour];
			    fgColour = jobColoursBWfg[colour];
			}
			else {
			    //html += '<td style="opacity: 0.5" bgcolor="' + jobColoursBg[colour] + '">';
			    //html += '<td bgcolor="' + jobColoursBg[colour] + '">';
			    bgColour = jobColoursBg[colour];
			    fgColour = jobColoursFg[colour];
			}

			//if ( 0 ) { // multiJobCnt == config.coresPerNode ) {
			 //   html += '<span style="color: ' + fgColour + ';" onmouseover="jobInfoWindow( event, \'' + jobId + '\', \'' + n + '\' );" onmouseout="closeJobInfoWindow();">';
			  //  html += '&nbsp;';
			   // html += '</span>';
			//}
			//else {

			// approximate a square for whole node jobs - should do this using an integer sqrt instead?
			h = 1;
			if ( multiJobCnt > 4 ) {
			    h = 4;
			}
			else if ( multiJobCnt > 2 ) {
			    h = 3;
			}
			else if ( multiJobCnt > 1 ) {
			    h = 2;
			}
			w = multiJobCnt/h;
			    // multiJobCnt is # cpus for this job
			    //html += '<div style="position:relative; float:left;clear:left; font-size: 0px; line-height: 0%; width:' + (5*multiJobCnt) + 'px; height:5px; background-color:' + bgColour + '; color:' + fgColour + ';" onmouseover="jobInfoWindow( event, \'' + jobId + '\', \'' + n + '\' );" onmouseout="closeJobInfoWindow();">' + cpusSoFar + '</div>'
			if ( state == 'S' ) // triangle
			    html += '<div style="position:relative; font-size: 0px; line-height: 0%; width: 0px; border-top: ' + (4*w) + 'px solid ' + bgColour + '; border-right: ' + (4*w) + 'px solid white;" onmouseover="jobInfoWindow( event, \'' + jobId + '\', \'' + n + '\' );" onmouseout="closeJobInfoWindow();" onclick="jobInfoWindow( event, \'' + jobId + '\', \'' + n + '\' );"></div>'; // ' + cpusSoFar + '</div>'
			else
			    html += '<div style="position:relative; width:' + (4*w) + 'px; height:' + (4*h) + 'px; background-color:' + bgColour + '; color:' + fgColour + ';" onmouseover="jobInfoWindow( event, \'' + jobId + '\', \'' + n + '\' );" onmouseout="closeJobInfoWindow();" onclick="jobInfoWindow( event, \'' + jobId + '\', \'' + n + '\' );"></div>'; // ' + cpusSoFar + '</div>'

			    cpusSoFar += multiJobCnt;
			    if ( cpusSoFar > 3 ) {  // when to go to the next column ~= how many rows of jobs to display.
                                                    // eg. a user with 16 1-core jobs with >3 will display as a 4x4 grid. if >1 then it'll be a 8x2 grid
				cpusSoFar = 0;
				html += '</td><td>';
			 //   }
			    //for ( l=0; l<multiJobCnt; l++ ) {
			//	//html += '<span style="color: ' + fgColour + ';" onmouseover="jobInfoWindow( event, \'' + jobId + '\', \'' + n + '\' );" onmouseout="closeJobInfoWindow();">';
			//	html += '<div style="position:relative; width:' + (5*multiJobCnt) + 'px; height:5px; color:' + fgColour + ';" onmouseover="jobInfoWindow( event, \'' + jobId + '\', \'' + n + '\' );" onmouseout="closeJobInfoWindow();"></div>'
			//	//html += '</span>';
			 //   }
			}
		    }
			html += '</td>';
		    html += '</tr></table></td>'
		    html += '</tr>';
		}
	    }
	    html += '</tbody></table>';
	    changeInner( d, html, 'job ' + n );
	}
	prevNodes = nodes;
    }

    start = addToTimeStr( 'jobModTime', start );
    doNextFn( nextFn );
}


function hideJobs( nextFn ) {
    for(var i=0; i<config.cn.length; i++) {
	var id = config.cn[i] + '_job';
	var d = document.getElementById( id );
	d.innerHTML = '';
    }
    jobsMap = [];
    prevJobs = [];

    doNextFn( nextFn );
}

function hideCpuMemBars( nextFn ) {
//    for(var i=0;i<allNodes.length;i++) {
//	n = allNodes[i];
    for(var i=0; i<config.cn.length; i++) {
	var n = config.cn[i];
	turnOffBars( n );
    }
    doNextFn( nextFn );
}

function hideDiskBars( nextFn ) {
    for(var i=0;i<allNodes.length;i++) {
	var d = document.getElementById( allNodes[i] + '_d');
	d.height = 0;
    }
    doNextFn( nextFn );
}

function showDiskBars( nextFn ) {
    for(var i=0;i<allNodes.length;i++) {
	var d = document.getElementById( allNodes[i] + '_d');
	d.height = 3;
    }
    doNextFn( nextFn );
}

function zeroTemps( nextFn ) {
    // nuke all temp displays
    for(var i=0;i<allNodes.length;i++) {
	var d = document.getElementById(allNodes[i] + '_temps');
	d.innerHTML = '';
    }
    // but also we need to wipe this temp warn map so that warnings are recreated
    prevTempWarnMap = [];

    doNextFn( nextFn );
}

function hasGpu(n) {
    var g;
    try {
	g = numGpus[n];
    }
    catch (failure) {
	numGpus[n] = 0;
	g = 0;
    }
    return g;
}

function turnOffBars( n ) {
    setBarHeight( n, 0 );
}
function turnOnBars( n ) {
    // could also do this with d.style.visibility = 'hidden' / 'visible';
    setBarHeight( n, 3 );
}

function setBarHeight( n, ht ) {
    var d = document.getElementById(n + '_u');
    if ( d ) {
	d.height = ht;
	d = document.getElementById(n + '_s');
	d.height = ht;
	d = document.getElementById(n + '_w');
	d.height = ht;
	d = document.getElementById(n + '_i');
	d.height = ht;
	d = document.getElementById(n + '_m');
	d.height = ht;
	if ( hasGpu(n + '_g') ) {
	    d = document.getElementById(n + '_g');
	    d.height = ht;
	}
	if ( nextMode == 'heavy' ) {
	    d = document.getElementById(n + '_d');
	    d.height = ht;
	}
    }
}

function isComputeNode( node ) {
    if (config.cn.length > config.nben.length) // search the shortest list
	return (config.nben.indexOf(node) == -1);
    else
	return (config.cn.indexOf(node) != -1);
}

function processBlockBars( nextFn ) {
    if ( first || doIncrs )  // always show cpu/mem bars for special machines
	for(var i=0;i<config.nben.length;i++) {
	    var node = config.nben[i];
	    turnOnBars( node );
	}

    // or do this on the server side?
    var show = new Array();
    for(var i=0;i<loads.length;i++) {
	arr = loads[i][0].split('_');
	node = arr[0];

	// decide whether to show idle-ish cpu/mem bars depending upon load
	if ( isComputeNode(node) )
	{
	    if ( prevNodes[node].length || loads[i][1] > 0.1 )
	    {
		show[node] = 1;
		if ( prevShow[node] != 1 ) {
		    // show them...
		    turnOnBars( node );
		}
	    }
	    else {
		show[node] = 0;
		if ( prevShow[node] != 0 ) {
		    // make 0 height to hide them instead of blocking/none-ing them
		    turnOffBars( node );
		}
	    }
	}
    }
    prevShow = show;
    start = addToTimeStr( 'blockBarsTime', start );
    doNextFn( nextFn );
}

function processUpDown( nextFn ) {
    var up = new Array();
    for(var i=0;i<allNodes.length;i++)
	up[allNodes[i]] = 0;

    // anything with a load listed is in state 'up' - guaranteed by server
    for(var i=0;i<loads.length;i++) {
	node = loads[i][0].split('_')[0];
	up[node] = 1;

	// check for newly up head node...
	//   the rest of the nodes take care of themselves depending upon load
	if ( !prevUp[node] && !isComputeNode(node) )
	    turnOnBars( node );
    }

    // mark down nodes
    for (var i=0; i<allNodes.length; i++ ) {
	n = allNodes[i];
	if ( up[n] == 0 && prevUp[n] != up[n] ) { // newly down
	    d = document.getElementById( n + '_l' );
	    d.innerHTML = n;
	    setSingleNodeUrl(n); // odd. shouldn't have to re-set the href=

	    d = document.getElementById( n + '_l_bg');
	    d.bgColor = downColour;

	    // take away cpu/mem/disk bars too
	    turnOffBars( n );

	    // and hide rack temps
	    hideTempDiv( n );
	}
    }
    prevUp = up;
    start = addToTimeStr( 'upDownTime', start );
    doNextFn( nextFn );
}

function listsAreSame( a, b ) {
    if ( !a || !b ) // lists not defined
	return 0;
    if ( a.length != b.length ) // lengths differ
	return 0;
    for (var i=0; i<a.length; i++)
	if (a[i] != b[i]) // contents differ
	    return 0;
    return 1; // same
}


function processPies( nextFn ) {
    // pies
    fail = 0;
    try { running = get( 'running', 0); } catch (failure) { addErr( 'pie failure. check oven temperature. ' + failure ); fail = 1; running = []; }
    try { suspended  = get( 'suspended', 0); }  catch (failure) { suspended = []; }
    try { queued  = get( 'queued', 0); }  catch (failure) { queued = []; }
    try { blocked = get( 'blocked', 0); } catch (failure) { blocked = []; }

    pieChanged = 0;
    if ( !fail ) {
	// update images if they've changed...
	if ( !listsAreSame( running, prevRunning ) || !listsAreSame( suspended, prevSuspended ) || !listsAreSame( queued, prevQueued ) || !listsAreSame( blocked, prevBlocked ) ) {
	    var txt = '<table cellpadding="20"><tbody><tr>';
	    for (var i=0; i<running.length; i++)
		txt += '<td><img src="' + config.pieURL + running[i] + '"></td>';
	    for (var i=0; i<suspended.length; i++)
		txt += '<td><img src="' + config.pieURL + suspended[i] + '"></td>';
	    for (var i=0; i<queued.length; i++)
		txt += '<td><img src="' + config.pieURL + queued[i] + '"></td>';
	    for (var i=0; i<blocked.length; i++)
		txt += '<td><img src="' + config.pieURL + blocked[i] + '"></td>';
	    txt += '</tr><tr>';
	    for (var i=0; i<running.length; i++)
		txt += '<td align="center">Running</td>';
	    for (var i=0; i<suspended.length; i++)
		txt += '<td align="center">Suspended</td>';
	    for (var i=0; i<queued.length; i++)
		txt += '<td align="center">Queued</td>';
	    for (var i=0; i<blocked.length; i++)
		txt += '<td align="center">Blocked/Held</td>';
	    txt += '</tr></tbody></table>';

	    pieChanged = 1;

            d = document.getElementById( 'pies' );
	    d.innerHTML = txt;
	}

	prevRunning = running;
	prevSuspended = suspended;
	prevQueued = queued;
	prevBlocked = blocked;
    }
    else {  // failed ... look for err string
	try { err = get( 'queueError', 0); } catch (failure) { err = []; }
	if ( err.length )
	    addErr( 'pie queueError: ' + err[0] );
    }

    start = addToTimeStr( 'pieTime', start );
    doNextFn( nextFn );
}


function makeRes( nodes, colour ) {
    for (var j=0; j<nodes.length; j++ ) {
	d = document.getElementById( nodes[j] );
	d.style.borderWidth = 1;
	d.style.borderStyle = 'solid';
	d.style.borderColor = reservationColours[colour];
    }
    //addErr( 'makeRes ' + nodes ); // debug
}

function deleteRes( nodes ) {
    for (var j=0; j<nodes.length; j++ ) {
	d = document.getElementById( nodes[j] );
	d.style.borderWidth = 0;
	d.style.borderStyle = 'none';
    }
    //addErr( 'deleteRes ' + nodes );  // debug
}

function reservationChanged( a, b ) {
    if ( !a || !b )
	return 1;
    if ( a.length != b.length )
	return 1;

    for (var i=0;i<a.length;i++) {
	Aname = a[i][0];
	Bname = b[i][0];
	if ( Aname != Bname )
	    return 1;

	Anodes = a[i][1];
	Bnodes = b[i][1];
	if ( ! listsAreSame( Anodes, Bnodes ) )
	     return 1;
    }
    return 0; // same
}

function processReservations( nextFn ) {
    reservations = get( 'reservations', 1 );

    // if any reservation has changed then (because they can overlap arbitrarily)
    // we need to un-draw all old reservations and then draw all the new ones...

    if ( reservationChanged( prevReservations, reservations ) ) {

	// del
	for(var i=0;i<prevReservations.length;i++) {
	    nodes = prevReservations[i][1];
	    deleteRes( nodes );
	}

	// make
	cnt = 0;
	for(var i=0;i<reservations.length;i++) {
	    nodes = reservations[i][1];

	    makeRes( nodes, cnt );

	    cnt += 1;
	    cnt %= reservationColours.length;
	}
    }

    prevReservations = reservations;
    start = addToTimeStr( 'reservationTime', start );

    if ( !(doIncrs || first) )
	extraDelay = typicalExtraDelay;
    doNextFn( nextFn );
}


debugAve = '';

function processJobAverages( nextFn ) {
    // data is formated like:
    //   [ ["job", [["node",[u,s,i,m]], .... , ["ave",[u,s,i,m]]]], ["job",[[ ...
    // or
    //  [  ["job",[]], ["job",[ ...
    // if it's a 1 cpu job, or if no stats are collected yet

    // just store them here and do nothing else - the popup will draw them
//    var pj = new Array();

    averages = get( 'averages', 1 );

//    if ( averages ) {
//	for(var i=0;i<averages.length;i++) {
//	    n = averages[i][0];
//	    // make it a map so we can easily reuse it
//	    pj[n] = averages[i][1];
//	}
//    }

    prevAverages = averages;
//    prevAveragesMap = pj;

    start = addToTimeStr( 'averagesTime', start );
    doNextFn( nextFn );
}


function updateNetChart( pixels, prevPixels, key, threshs, maxPixels, prevMaxPixels, dodgy, prevDodgy ) {
    if ( prevPixels == pixels && ( maxPixels == 0 || maxPixels == prevMaxPixels ) && dodgy == prevDodgy )
	return;

    if ( pixels != prevPixels ) {
	if ( pixels < threshs[0] ) {
	    d = document.getElementById(key + '1');  // in this range
	    d.style.height = 1;
	    d.style.width = pixels;

	    if ( prevPixels > threshs[0] ) {
		d = document.getElementById(key + '2');
		d.style.height = 0;
	    }

	    if ( prevPixels > threshs[1] ) {
		d = document.getElementById(key + '3');
		d.style.height = 0;
	    }
	}
	else if ( pixels >= threshs[0] && pixels < threshs[1] ) {
	    if ( prevPixels < threshs[0] ) {
		d = document.getElementById(key + '1');
		d.style.height = 1;
		d.style.width = threshs[0];
	    }

	    d = document.getElementById(key + '2');  // in this range
	    d.style.height = 2;
	    d.style.width = pixels - threshs[0];

	    if ( prevPixels > threshs[1] ) {
		d = document.getElementById(key + '3');
		d.style.height = 0;
	    }
	}
	else { //  pixels >= threshs[1] )
	    if ( prevPixels < threshs[0] ) {
		d = document.getElementById(key + '1');
		d.style.height = 1;
		d.style.width = threshs[0];
	    }

	    if ( prevPixels < threshs[1] ) {
		d = document.getElementById(key + '2');
		d.style.height = 2;
		d.style.width = threshs[1] - threshs[0];
	    }

	    d = document.getElementById(key + '3');  // in this range
	    d.style.height = 3;
	    d.style.width = pixels - threshs[1];
	}

	ttNumNetChanged++;
    }

    if ( dodgy != prevDodgy ) {
	if ( dodgy ) {
	    d = document.getElementById(key + '1');
	    d.style.backgroundColor = networkSharedColour;
	    d = document.getElementById(key + '2');
	    d.style.backgroundColor = networkSharedColour;
	    d = document.getElementById(key + '3');
	    d.style.backgroundColor = networkSharedColour;
	}
	else {
	    d = document.getElementById(key + '1');
	    d.style.backgroundColor = networkColour;
	    d = document.getElementById(key + '2');
	    d.style.backgroundColor = networkColour;
	    d = document.getElementById(key + '3');
	    d.style.backgroundColor = networkColour;
	}
    }

    if ( maxPixels >= 0 && maxPixels != prevMaxPixels ) {
	d = document.getElementById(key + '_max');
	d.style.left = maxPixels;
    }
}


function processNetworkPartial( nextFn ) {
    network = get( 'network', 1 );

    //   [ "node_n", byte_rate, b|k|m|g, pkts_rate, b|k|m|g, dodgyFlag ], ...

    var n = new Array();

    // bytes and packets
    for(var i=0;i<network.length;i++) {
	id = network[i][0];
	valB = network[i][1];
	modeB = network[i][2];
	valP = network[i][3];
	modeP = network[i][4];
	dodgy = network[i][5];

	// bytes
	tB = descaleTraffic( valB, modeB );
	pixelsB = bytesTrafficToPixels( tB );

	// packets
	tP = descaleTraffic( valP, modeP );
	pixelsP = pktsTrafficToPixels( tP );

	n[id] = [ tB, pixelsB, tP, pixelsP, dodgy ];
    }

    prevNetwork = n;
    start = addToTimeStr( 'networkProcessTime', start );
    doNextFn( nextFn );
}


function processNetwork( nextFn ) {
    network = get( 'network', 1 );

    //   [ "node_n", byte_rate, b|k|m|g, pkts_rate, b|k|m|g, dodgyFlag ], ...

    var n = new Array();

    // bytes and packets
    for(var i=0;i<network.length;i++) {
	id = network[i][0];
	valB = network[i][1];
	modeB = network[i][2];
	valP = network[i][3];
	modeP = network[i][4];
	dodgy = network[i][5];

	if ( prevNetwork[id] ) {
	    prevPixelsB = prevNetwork[id][1];
	    prevPixelsP = prevNetwork[id][3];
	    prevDodgy = prevNetwork[id][5];
	}
	else {
	    prevPixelsB = 0;
	    prevPixelsP = 0;
	    prevDodgy = 0;
	}

	// bytes
	tB = descaleTraffic( valB, modeB );
	pixelsB = bytesTrafficToPixels( tB );
	updateNetChart( pixelsB, prevPixelsB, id, netBytePixelThresh, -1, -1, dodgy, prevDodgy );

	// packets
	tP = descaleTraffic( valP, modeP );
	pixelsP = pktsTrafficToPixels( tP );
	updateNetChart( pixelsP, prevPixelsP, id + 'p', netPktsPixelThresh, -1, -1, dodgy, prevDodgy );

	n[id] = [ tB, pixelsB, tP, pixelsP, dodgy ]; // map it to compare later...
    }

    prevNetwork = n;
    start = addToTimeStr( 'networkTime', start );
    doNextFn( nextFn );
}


function processText( nextFn ) {
    // text info
    for (var i=0; i<txtNames.length; i++) {
	var txt;
	t = get( txtNames[i], 1 );
	d = document.getElementById( 'text_' + txtNames[i] );
	try {
	    txt = translateBr(t);
	}
	catch(failure) {
	    addErr( 'translateBr of text "' + txtNames[i] + '" failed. string was "' + t + '". err ' + failure );
	    continue;
	}
	changeInner( d, txt, 'processText ' + txtNames[i] );
    }
    start = addToTimeStr( 'textTime', start );
    doNextFn( nextFn );
}

showDebug = 0;

function showDebugText( mode ) {
    if ( mode == 'show' )
	showDebug = 1;
    else
	showDebug = 0;
}

function debugText( nextFn ) {
    start = addToTimeStr( 'totalTime', totalTime );
    start = addToTimeStr( 'totalTimeInclDelays', totalTime );
    d = document.getElementById( 'debug_text' );
    var txt;

    if ( showDebug ) {
	//query = 'yo&bro&hamsters';
	//querystr = get( 'query', 1 );
	//statusText += '\n\nquery ' + querystr + '\n\n';

	txt = '<pre>' + statusText + '\n';
	if ( pieChanged )
	    txt += 'pie images changed\n';
	txt += '\ntime in ms\n' + timeStr + '\ncpu bars changed: ' + numCpuChanged + ' (' + percCpuChanged + '%)\n';
	txt += 'gpu bars changed: ' + numGpuChanged + ' (' + percGpuChanged + '%)\n';
	if ( percToolTipChange != '' )
	    txt += percToolTipChange + '\n';
	if ( nextMode == 'heavy' )
	    txt += 'temperatures changed: ' + percTempChanged + '%\n';

	txt += '\n' + debugAve + '\n';

	txt += '\n' + ( errStr != '' ? 'Errors:\n' + errStr :'' ) + '</pre>';

	txt += '<span style="cursor:pointer; color:blue;" onclick="showDebugText(\'hide\');">Hide Debug Text</span>';
    }
    else {
	txt = '<span style="cursor:pointer; color:blue;" onclick="showDebugText(\'show\');">Show Debug Text</span>';
    }
    d.innerHTML = txt;

    doNextFn( nextFn );
}

startLoopTime = 0;

function finishedLoop( nextFn ) {
    if ( nextRefresh ) clearTimeout( nextRefresh );

    // Schedule next call to wait for data
    nextRefresh = setTimeout( 'GetAsyncData()', refresh );  // time in ms
    resetRefreshCountDownTimer( refresh );

    if ( currentMode != nextMode ) {
	fns = allFns[nextMode];
	currentMode = nextMode;
    }

    reloadCnt = 0;
    first = 0;
    doIncrs = 0;
    hidebar();
    delay = 0;  // stop putting a delay between the parts of processing:
}


function startLoop( nextFn ) {
    timeStr = '';
    start = new Date();
    totalTime = start;
    totalDelays = 0;
    startLoopTime = start;

    progressIncr = 100.0/fns.length;

    try {
	serverApi = get( 'api', 0 );

	if ( serverApi && api != serverApi[0] ) {
	    hidebar();
	    txt  = '<div style="position:absolute; left:100px; top:100px; font-size:30px;">';
	    txt +=    'bobMonitor server data format has changed. please reload the page';
	    txt += '</div>';
	    all = document.getElementById( 'all' );
	    all.innerHTML = txt;

	    // automatic reload - too dangerous as it might loop indefinitely?
	    //window.location.reload();

	    return;  // break out of the nextFn loops
	}
    }
    catch(failure) {
	addErr( 'api check. err ' + failure );
    }

    try {
	configHash = get( 'configHash', 0 );

	if ( configHash && config.hashkey != configHash[0] ) {
	    hidebar();
	    txt  = '<div style="position:absolute; left:100px; top:100px; font-size:30px;">';
	    txt +=    'bobMonitor config file "hash" for server and client do not match. please reload this page, regenerate the javascript config, or restart the bobMonitor server';
	    txt += '</div>';
	    all = document.getElementById( 'all' );
	    all.innerHTML = txt;

	    return;  // break out of the nextFn loops
	}
    }
    catch(failure) {
	addErr( 'configHash check. err ' + failure );
    }

    try {
	timeStamp = get( 'timeStamp', 0 );

	if ( timeStamp ) {
	    tsUtc = timeStamp[0];
	    serverRefresh = timeStamp[1];  // == config.sleepTime, could just use that instead
	    tNow = start;

	    // if tsUtc changed, then all good and update Prev's and move alone
	    if ( tsUtc != tsUtcPrev ) {
		tsPrev = tNow;
		tsUtcPrev = tsUtc;
		d = document.getElementById( 'stale' );
		changeInner( d, '', 'change stale' );
	    }
	    else { // server hasn't updated data
		// if server should have updated data by now then warn
		if ( tNow - tsPrev > 2*serverRefresh ) {
		    // post or continue to post warning about stale server data
		    hidebar();

		    d = document.getElementById( 'stale' );
		    txt = "<font color=red>Warning: stale data from server - last update " + tsUtc + " UTC</font>";
		    changeInner( d, txt, 'change stale' );
		}
	    }
	}
    }
    catch(failure) {
	addErr( 'timeStamp check. err ' + failure );
    }

    doNextFn( nextFn );
}

// sub-lite version
allFns['sub-lite'] = [ 'startLoop', 'processPbsNodes', 'processNetLoads', 'processGmondGroup',   // 'processCpuBar', 'processGpuBar', 'processMem'
		       'processDiskWarn', 'processTempWarn', 'processLoads',
		       'processUpDown', 'processPies', 'processText', 'processReservations',
		       'debugText', 'finishedLoop' ];

// pocket-lite version
allFns['pocket-lite'] = [ 'startLoop', 'processPbsNodes', 'processNetLoads', 'processGmondGroup',
		          'processDiskWarn', 'processCpuBar', 'processGpuBar', 'processMem', 'processTempWarn', 'processLoads',
		          'processBlockBars', 'processUpDown', 'processPies', 'processText', 'processReservations',
		          'debugText', 'finishedLoop' ];

// lite version
allFns['lite'] = [ 'startLoop', 'processPbsNodes', 'processNetLoads', 'processGmondGroup',
		   'processDiskWarn', 'processCpuBar', 'processGpuBar', 'processMem', 'processTempWarn', 'processLoads', 'processJobs',
		   'processUpDown', 'processPies', 'processText', 'processReservations',
		   'processNetworkPartial', 'processJobAverages', 'processToolTip',
		   'debugText', 'finishedLoop' ];

// regular version
allFns['normal'] = [ 'startLoop', 'processPbsNodes', 'processNetLoads', 'processGmondGroup', 'processCpuBar', 'processGpuBar', 'processMem',
		     'processDiskWarn', 'processTempWarn', 'processLoads', 'processJobs',
		     'processBlockBars', 'processUpDown', 'processPies', 'processText', 'processReservations',
		     'processNetworkPartial', 'processJobAverages', 'processToolTip', 'processTemp', 'processRackTempsPower',
		     'debugText', 'finishedLoop' ];

// regular version except with 'heavy'-like job display colours and swatches
allFns['normal-usr'] = [ 'startLoop', 'processPbsNodes', 'processNetLoads', 'processGmondGroup', 'processCpuBar', 'processGpuBar', 'processMem', 'processPower', 'processFans',
		         'processDiskWarn', 'processTempWarn', 'processLoads', 'processJobColours', 'processJobs',
		         'processBlockBars', 'processUpDown', 'processPies', 'processText', 'processReservations',
		         'processNetworkPartial', 'processJobAverages', 'processToolTip', 'processTemp', 'processRackTempsPower',
		         'debugText', 'finishedLoop' ];

// regular + networking and general test mode...
allFns['network'] = [ 'startLoop', 'processPbsNodes', 'processNetLoads', 'processGmondGroup', 'processCpuBar', 'processGpuBar', 'processMem',
		      'processDiskWarn', 'processTempWarn', 'processLoads', 'processJobs',
		      'processBlockBars', 'processUpDown', 'processPies', 'processText', 'processReservations',
		      'processNetwork', 'processJobAverages', 'processToolTip',
		      'debugText', 'finishedLoop' ];

// heavy version
allFns['heavy'] = [ 'startLoop', 'processPbsNodes', 'processNetLoads', 'processGmondGroup', 'processCpuBar', 'processGpuBar', 'processMem',
		    'processDisk', 'processTemp', 'processLoads', 'processJobColours', 'processJobs',
		    'processBlockBars', 'processUpDown', 'processPies', 'processText', 'processReservations',
		    'processNetworkPartial', 'processJobAverages', 'processToolTip', 'processRackTempsPower',
		    'debugText', 'finishedLoop' ];

function changeDisplayModes( m ) {
    if ( m == nextMode ) return;  // already doing this
    if ( m == currentMode ) return;  // errr, what's going on...

    // these 'fast' transitions between modes are tricky...
    if ( currentMode == 'sub-lite' ) {
	if ( m == 'lite' ) {
	    prevJobs = [];
	    fns = [ 'startLoop', 'processNetworkPartial', 'processJobs', 'finishedLoop' ];
	}
	else if ( m == 'pocket-lite' ) {
	    prevCpu = [];
	    prevGpu = [];
	    prevMem = [];
	    prevShow = [];
	    fns = [ 'startLoop', 'processCpuBar', 'processGpuBar', 'processMem',
		    'processBlockBars', 'finishedLoop' ];
	}
	else if ( m == 'normal' ) {
	    prevJobs = [];
	    prevCpu = [];
	    prevGpu = [];
	    prevMem = [];
	    prevShow = [];
	    fns = [ 'startLoop', 'processCpuBar', 'processGpuBar', 'processMem', 'processNetworkPartial', 'processJobs',
		    'processBlockBars', 'processTemp', 'processRackTempsPower', 'showRackTemps', 'finishedLoop' ];
	}
	else if ( m == 'normal-usr' ) {
	    prevJobs = [];
	    prevCpu = [];
	    prevGpu = [];
	    prevMem = [];
	    prevShow = [];
	    fns = [ 'startLoop', 'processCpuBar', 'processGpuBar', 'processMem', 'processNetworkPartial', 'processJobColours', 'processJobs',
		    'processBlockBars', 'processTemp', 'processRackTempsPower', 'showRackTemps', 'finishedLoop' ];
	}
	else if ( m == 'heavy' ) {
	    prevJobs = [];
	    prevCpu = [];
	    prevGpu = [];
	    prevMem = [];
	    prevShow = [];
	    prevTempMap = [];
	    prevDisk = [];
	    fns = [ 'startLoop', 'processCpuBar', 'processGpuBar', 'processMem',
		    'processDisk', 'showDiskBars', 'processTemp',
		    'processJobColours', 'processJobs', 'processRackTempsPower', 'showRackTemps',
		    'processNetworkPartial', 'processBlockBars', 'finishedLoop' ];
	}
    }
    else if ( currentMode == 'pocket-lite' ) {
	if ( m == 'sub-lite' )
	    fns = [ 'startLoop', 'hideCpuMemBars', 'finishedLoop' ];
	else if ( m == 'lite' ) {
	    prevJobs = [];
	    fns = [ 'startLoop', 'hideCpuMemBars', 'processNetworkPartial', 'processJobs', 'finishedLoop' ];
	}
	else if ( m == 'normal' ) {
	    prevJobs = [];
	    prevCpu = [];
	    prevGpu = [];
	    prevMem = [];
	    prevShow = [];
	    fns = [ 'startLoop', 'processCpuBar', 'processGpuBar', 'processMem', 'processNetworkPartial', 'processJobs',
		    'processBlockBars', 'processTemp', 'processRackTempsPower', 'showRackTemps', 'finishedLoop' ];
	}
	else if ( m == 'normal-usr' ) {
	    prevJobs = [];
	    prevCpu = [];
	    prevGpu = [];
	    prevMem = [];
	    prevShow = [];
	    fns = [ 'startLoop', 'processCpuBar', 'processGpuBar', 'processMem', 'processNetworkPartial', 'processJobColours', 'processJobs',
		    'processBlockBars', 'processTemp', 'processRackTempsPower', 'showRackTemps', 'finishedLoop' ];
	}
	else if ( m == 'heavy' ) {
	    prevJobs = [];
	    prevCpu = [];
	    prevGpu = [];
	    prevMem = [];
	    prevShow = [];
	    prevTempMap = [];
	    prevDisk = [];
	    fns = [ 'startLoop', 'processCpuBar', 'processGpuBar', 'processMem',
		    'processDisk', 'showDiskBars', 'processTemp',
		    'processJobColours', 'processJobs', 'processRackTempsPower', 'showRackTemps',
		    'processNetworkPartial', 'processBlockBars', 'finishedLoop' ];
	}
    }
    else if ( currentMode == 'lite' ) {
	if ( m == 'sub-lite' )
	    fns = [ 'startLoop', 'hideJobs', 'finishedLoop' ];
	else if ( m == 'pocket-lite' ) {
	    prevCpu = [];
	    prevGpu = [];
	    prevMem = [];
	    prevShow = [];
	    fns = [ 'startLoop', 'hideJobs', 'processCpuBar', 'processGpuBar', 'processMem', 'processBlockBars', 'finishedLoop' ];
	}
	else if ( m == 'normal' ) {
	    prevCpu = [];
	    prevGpu = [];
	    prevMem = [];
	    prevTempMap = [];
	    prevShow = [];
	    fns = [ 'startLoop', 'processCpuBar', 'processGpuBar', 'processMem', 'processBlockBars',
		    'processTemp', 'processRackTempsPower', 'showRackTemps', 'finishedLoop' ];
	}
	else if ( m == 'normal-usr' ) {
	    prevCpu = [];
	    prevGpu = [];
	    prevMem = [];
	    prevTempMap = [];
	    prevShow = [];
	    prevJobs = [];
	    fns = [ 'startLoop', 'processCpuBar', 'processGpuBar', 'processMem', 'processBlockBars',
		    'processJobColours', 'processJobs', 'processTemp', 'processRackTempsPower', 'showRackTemps', 'finishedLoop' ];
	}
	else if ( m == 'heavy' ) {
	    prevCpu = [];
	    prevGpu = [];
	    prevMem = [];
	    prevShow = [];
	    prevTempMap = [];
	    prevDisk = [];
	    prevJobs = [];
	    fns = [ 'startLoop', 'processCpuBar', 'processGpuBar', 'processMem',
		    'processDisk', 'showDiskBars', 'processTemp',
		    'processJobColours', 'processJobs', 'processRackTempsPower', 'showRackTemps', 'processBlockBars', 'finishedLoop' ];
	}
    }
    else if ( currentMode == 'normal' ) {
	if ( m == 'sub-lite' )
	    fns = [ 'startLoop', 'hideJobs', 'hideCpuMemBars', 'zeroTemps', 'processTempWarn', 'hideRackTemps', 'finishedLoop' ];
	else if ( m == 'pocket-lite' )
	    fns = [ 'startLoop', 'hideJobs', 'zeroTemps', 'processTempWarn', 'hideRackTemps', 'finishedLoop' ];
	else if ( m == 'lite' )
	    fns = [ 'startLoop', 'hideCpuMemBars', 'zeroTemps', 'processTempWarn', 'hideRackTemps', 'finishedLoop' ];
	else if ( m == 'normal-usr' ) {
	    prevJobs = [];
	    fns = [ 'startLoop', 'processJobColours', 'processJobs', 'finishedLoop' ];
        }
	else if ( m == 'heavy' ) {
	    prevTempMap = [];
	    prevDisk = [];
	    prevShow = [];
	    prevJobs = [];
	    fns = [ 'startLoop', 'processDisk', 'showDiskBars', 'processBlockBars',
		    'processJobColours', 'processTemp', 'processJobs', 'finishedLoop' ];
	}
    }
    else if ( currentMode == 'normal-usr' ) {
	if ( m == 'sub-lite' ) {
	    prevJobs = [];
	    fns = [ 'startLoop', 'hideJobs', 'hideCpuMemBars', 'zeroTemps', 'processTempWarn', 'hideRackTemps', 'finishedLoop' ];
        }
	else if ( m == 'pocket-lite' ) {
	    prevJobs = [];
	    fns = [ 'startLoop', 'hideJobs', 'zeroTemps', 'processTempWarn', 'hideRackTemps', 'finishedLoop' ];
        }
	else if ( m == 'lite' ) {
	    prevJobs = [];
	    fns = [ 'startLoop', 'hideCpuMemBars', 'zeroTemps', 'processJobs', 'processTempWarn', 'hideRackTemps', 'finishedLoop' ];
        }
	else if ( m == 'normal' ) {
	    prevJobs = [];
	    fns = [ 'startLoop', 'processJobs', 'finishedLoop' ];
        }
	else if ( m == 'heavy' ) {
	    prevTempMap = [];
	    prevDisk = [];
	    prevShow = [];
	    fns = [ 'startLoop', 'processDisk', 'showDiskBars', 'processBlockBars',
		    'processJobs', 'processTemp', 'processJobs', 'finishedLoop' ];
	}
    }
    else if ( currentMode == 'heavy' ) {
	prevTempWarnMap = [];
	prevTempWarn = [];
	prevDiskWarnMap = [];
	prevDiskWarn = [];
	prevShow = [];
	prevJobs = [];
	if ( m == 'sub-lite' )
	    fns = [ 'startLoop', 'hideJobs', 'hideCpuMemBars', 'hideDiskBars', 'zeroTemps',
		    'processDiskWarn', 'processTempWarn', 'hideRackTemps', 'finishedLoop' ];
	else if ( m == 'pocket-lite' )
	    fns = [ 'startLoop', 'hideJobs', 'hideDiskBars', 'zeroTemps',
		    'processDiskWarn', 'processTempWarn', 'hideRackTemps', 'finishedLoop' ];
	else if ( m == 'lite' )
	    fns = [ 'startLoop', 'hideCpuMemBars', 'hideDiskBars', 'zeroTemps', 'processDiskWarn',
		    'processTempWarn', 'processJobs', 'hideRackTemps', 'finishedLoop' ];
	else if ( m == 'normal' ) {
	    fns = [ 'startLoop', 'hideDiskBars', 'zeroTemps', 'processDiskWarn',
		    'processTempWarn', 'processJobs', 'finishedLoop' ];
	}
	else if ( m == 'normal-usr' ) {
	    fns = [ 'startLoop', 'hideDiskBars', 'zeroTemps', 'processDiskWarn',
		    'processTempWarn', 'finishedLoop' ];
	}
    }

    nextMode = m;

    // change colours of clicked/unclicked links
    d = document.getElementById( 'modeTxt_' + currentMode );
    d.style.color = 'blue';
    d.style.cursor = 'pointer';  // IE might like this to be 'hand' but like we care...
    d = document.getElementById( 'modeTxt_' + nextMode );
    d.style.color = 'black';
    d.style.cursor = 'default';

    setPrefs();
    doTransition();
}

function doTransition() {
    // may as well do the progress bar thing on all transitions... gives some feedback
    delay = 200;
    doIncrs = 1;
    progressBarInit( first );
    setCount(1);

    if (req) req.abort();
    GetAsyncData();  // schedule the next update ASAP
}


// GotAsyncData is the read callback for the above XMLHttpRequest() call.
// This routine is not executed until data arrives from the request.
// We update the "fifo_data" area on the page when data does arrive.
function GotAsyncData() {
    // only if req shows "loaded"
    if (req.readyState != 4 || req.status != 200) {
	return;
    }

    // we got a reply, so the server is still alive
    clearConnectAlert();
    if ( connectTimeout ) clearTimeout( connectTimeout );
    if ( reConnectTimeout ) clearTimeout( reConnectTimeout );

    // call the first fn in the list, and it'll queue up the rest
    eval( fns[0] + '(0)' );

    return;
}
-->
