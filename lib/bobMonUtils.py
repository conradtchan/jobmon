#!/usr/bin/env python

# (c) Robin Humble 2003,2004,2005,2006
# licensed under the GPL

import os
import sys
import string
import time
from pbsMauiGanglia import pbsNodes, pbsJobs, maui, loadedNetsGmond, gangliaStats, timeToInt

import bobMonitorConf as config

doPie = 1
try:
    from pychart import pie_plot
    from pychart import area, canvas, theme, legend, fill_style, arrow
    import tempfile
except:
    doPie = 0

# look at the list of machine loads and what switch/network they are on
#   ... can also use gstat instead of gmond to get stats...
class loadedNets(loadedNetsGmond):
    def getLoads( self ):
        # combine the loaded/unloads nets dicts into one...
        netLoad = {}
        for d in ( self.loadedNet, self.unloadedNet ):
            for k, v in d.iteritems():
                netLoad[k] = v

        return ( netLoad, self.loads, self.cpuUsage, self.up )

    def nameToNum( self, name ):
        if name in config.nonBackendNodes:
            return name

        # nuke all after the first '.'
        name = string.split( name, '.' )[0]

        if name in config.nonBackendNodes:
            return name

        try:
            rest = string.replace( name, config.baseNodeName, '' )
            num = int(rest)
        except:
            # something we can't handle
            return None

        return num


def intToTime( time ):
    h = int(time/3600)
    m = int((time - 3600*h)/60)
    s = int(time - 3600*h - 60*m)
    timeStr = '%.2d:%.2d:%.2d' % ( h, m, s )
    return timeStr


def Hex(x):
    stri = hex(x)[2:] # get rid of the 0x bits with [2:]
    if len(stri) == 1:
        stri = '0' + stri
    return stri


def rgbToHex( a, scaleBy=1 ):
    ( r, g, b ) = a
    if scaleBy != 1:
        r *= scaleBy
        g *= scaleBy
        b *= scaleBy
        r = int(r)
        g = int(g)
        b = int(b)
    #print 'r,g,b', r, g, b, 'in hex', hex(r), hex(g), hex(b), 'in Hex', Hex(r), Hex(g), Hex(b)
    return '#' + Hex(r) + Hex(g) + Hex(b)


def availNodes():   # work out how many online/up nodes we have
    i = 0
    for k in range(1,config.numNodes+1):
        ( n, name, upDown, load, extras, jobList, status ) = yoMomma[k]
        if status == []:  # not offline/down and no jobs running
            i += 1
    return i


def uniq( list ):
    l = []
    prev = None
    for i in list:
        if i != prev:
            l.append( i )
        prev = i
    return l


def queuedJobState( job ):
    nodes, cpus, state, username, jobId, jobName, walltime, comment = job
    if state in ( 'H', 'B', 'W', 'T' ):
        return 'b'
    elif state in ( 'Q' ):
        return 'q'
    return None


def whosQueued( queued, textMode=0 ):
    # split up queued into queued and blocked
    q = []
    b = []
    for job in queued:
        bq = queuedJobState( job )
        if bq == 'b':
            b.append( job )
        elif bq == 'q':
            q.append( job )
        else:
            print 'job has unknown queue state:', job
            sys.exit(1)

    qRet = ( [], 0 )
    bRet = ( [], 0 )
    if len(q):
        qRet = whosNadgered( q, 'queued', textMode )
    if len(b):
        bRet = whosNadgered( b, 'blocked', textMode )

    return ( qRet, bRet )

def whosNadgered( queued, title, textMode=0 ):
    users = {}
    totalCpus = 0
    totalCpuHours = 0.0
    for job in queued:
        nodes, cpus, state, username, jobId, jobName, walltime, comment = job
        if username not in users.keys():
            users[username] = []
        users[username].append(cpus)
        totalCpuHours += walltime*cpus/3600.0
        totalCpus += cpus

    # sort by fatness
    list = []
    for k in users.keys():
        cpus = users[k]
        list.append( ( sum(cpus), cpus, k ) )  # ( sumCpus, [ job1cpus, job2cpus, ... ], username )
    list.sort()
    list.reverse()

    if textMode:
        if len(list):
            print
            print title, 'for %.1f%% of sunnyvale,' % ( 100.0*float(totalCpus)/float(config.coresPerNode*availNodes()) ),
            print 'or %.1f machine hours' % ( totalCpuHours/float(config.coresPerNode*availNodes()) )
            for cpus, cpusList, username in list:
                print ' ', username, cpus,   # , '%.1f%%' % ( 100.0*float(cpus)/float(totalCpus) )  #, '(', users[username], ')'
                if len(cpusList) == 1:
                    print '(1 job)'
                else:
                    print '(%d jobs)' % len(cpusList)

    return ( list, totalCpus )


def bigSmallOrder( L ):
    newL = []
    l = 0
    r = len(L)-1
    for i in range(len(L)):
        if i % 2 == 0:
            newL.append( L[l] )
            l += 1
        else:
            newL.append( L[r] )
            r -= 1
    return newL


def delayLoop( names ):
    if not doPie:
        return

    # loop until all pychart files in /tmp/ have >0 size, or for 10s max
    files = []
    for n in names:
        files.append( '/tmp/' + n + '.png' )

    startTime = time.time()
    ok = 0
    while not ok and ( time.time() - startTime < 10.0 ):
        ok = 1
        for f in files:
            try:
                ug = os.stat( f )
                if ug.st_size <= 0:
                    ok = 0
            except:
                ok = 0
        if not ok:  # wait a while and they might arrive...
            time.sleep( 0.1 )

    if not ok:
        print '<p><b>Timeout waiting for pie charts to plot...<b>'


if doPie:
    # sub-class the pie chart class to stop it auto-scaling to a full circle
    class myPie(pie_plot.T):
        def _total(self):
            return 100  # assume we'll be fed percentages


def plotPie( r, s, q, b, availCpus ):
    if not doPie:
        return []

    if availCpus <= 0:
        availCpus = 1
    #    return [], [], {}

    # availCpus is the total number of online/up cpus.
    # NOTE: offlined nodes that are still running jobs can push the total to >100% !

    running, totalCpus = r
    suspended, totalSuspendedCpus = s
    queued, totalQueuedCpus = q
    blocked, totalBlockedCpus = b

    #print 'running', r
    #print 'suspended', s
    #print 'queued', q
    #print 'blocked', b
    #sys.exit(1)

    theme.use_color = 1
    theme.scale_factor = 1
    theme.default_font_size = 12
    theme.reinitialize()

    # filenames in /tmp/ where the png's are written
    names = []
    # titles of the plots ie. Running, Queued, or Blocked
    titles = []

    tmpFilename = tempfile.mktemp()
    n = string.split( tmpFilename, '/' ) # pull off the initial /tmp/
    names.append( n[-1] )
    titles.append( 'Running' )
    can = canvas.init( tmpFilename + '.png' )

    size=( 600, 450 )

    ar = area.T(size=size, legend=None, x_grid_style = None, y_grid_style = None)

    colours = [ fill_style.red, fill_style.darkseagreen, fill_style.blue,
                fill_style.aquamarine1, fill_style.gray70,
                fill_style.darkorchid, fill_style.yellow, fill_style.green,
                fill_style.gray50, fill_style.goldenrod,
                fill_style.brown, fill_style.gray20 ]

    pieColours = [ 'red', 'darkseagreen', 'blue', rgbToHex( ( 0.498039, 1.0, 0.831373 ), scaleBy=255 ),  # aquamarine1
                   rgbToHex( ( 0.7, 0.7, 0.7 ), scaleBy=255 ),  # gray70
                   'darkorchid', 'yellow', 'green', rgbToHex( ( 0.5, 0.5, 0.5 ), scaleBy=255 ),  # gray50
                   'goldenrod', 'brown', rgbToHex( ( 0.2, 0.2, 0.2 ), scaleBy=255 ) ]  # gray20

    # re-order the sorted 'running' so that the labels fit on the pie better
    if len(running) > 1:
        lastC, lastClist, lastU = running[-1]
        if lastU == 'idle':  # but keep 'idle' last
            running = bigSmallOrder( running[:-1] )
            running.append( ( lastC, lastClist, lastU ) )
        else:
            running = bigSmallOrder( running )

    # need to generate colours for both running and suspended pies because we
    # can draw those jobs on the node grid. prob wouldn't hurt to extend this to
    # all jobs?
    all = []
    all.extend(running)
    all.extend(suspended)
    #all.extend(queued)
    #all.extend(blocked)

    userColour = {}  # dict of colours that have been used for specific users
    cnt = 0
    for cpus, cpusList, username in all:
        if username != 'idle':
            # username could be both in running and suspended, so only take the first (running)
            if username not in userColour.keys():
                userColour[username] = cnt
                cnt += 1
                cnt %= len(colours)

    data = []
    arcOffsets = []
    colour = []
    for cpus, cpusList, username in running:
        percent = 100.0*float(cpus)/float(availCpus)
        stri = username + ' %d%%' % ( percent + 0.5 )
        if username != 'idle':
            if len(cpusList) == 1:
                stri += ' (1 job)'
            else:
                stri += ' (%d jobs)' % len(cpusList)
        data.append( ( stri, percent ) )

        if username != 'idle':
            arcOffsets.append( 0 )
            colour.append( colours[userColour[username]] )
        else:
            arcOffsets.append( 20 )
            colour.append( fill_style.white )

    # offline nodes that are running jobs can make the total of the pie sum to more
    # than 100, so use the standard auto-scaling pie chart here.

    runPlot = pie_plot.T( data=data, arc_offsets=arcOffsets, fill_styles=colour,
                     #shadow = (2, -2, fill_style.gray50),
                     label_fill_style = None, label_offset = 25,
                     arrow_style = arrow.a0 )

    ar.add_plot(runPlot)
    ar.draw(can)
    can.close()  # flush to file ASAP

    # sort out which colour indices are used/free
    usedColour = []
    for k, v in userColour.iteritems():
        usedColour.append( v )

    freeColours = []
    for i in range(len(colours)):
        if i not in usedColour:
            freeColours.append( i )
    if len(freeColours) == 0:  # hmmm - no colours at all to use. buggerit, just use them all...
        freeColours = range(len(colours))

    queuedPies( suspended,  'Suspended', 75, names, titles, size, availCpus, colours, userColour, freeColours )
    queuedPies( queued,        'Queued', 60, names, titles, size, availCpus, colours, userColour, freeColours )
    queuedPies( blocked, 'Blocked/Held', 40, names, titles, size, availCpus, colours, userColour, freeColours )

    # map userColour numbers to colour names
    c = {}
    for k, v in userColour.iteritems():
        c[k] = pieColours[v]

    return names, titles, c


def queuedPies( queued, title, radius, names, titles, size, availCpus, colours, userColour, freeColours ):
    # re-order the sorted 'queued' so that the labels fit on the pie better
    queued = bigSmallOrder( queued )

    cpusUsed = 0
    doPlot = 0
    data = []
    colour = []

    cnt = 0
    plotNum = 0

    # limit plots to a maximum, otherwise we could be plotting 10000 cores
    # worth of jobs on a 1 core machine ie. too many plots to render and draw
    maxPlots = 100

    # loop, adding a new 'queued' plot for each bob worth of nodes
    for j in range(len(queued)):
        cpus, cpusList, username = queued[j]
        #print 'cpus, username', cpus, username

        cpusUsed += cpus
        remainder = 0
        if cpusUsed >= availCpus:
            # print 'cpusUsed >= totalCpus', cpusUsed, '>=', totalCpus, ', cpusAvailable', availCpus
            doPlot = 1
            remainder = cpusUsed - availCpus
            # print 'remainder', remainder

        if j == len(queued)-1:
            doPlot = 1

        percent = 100.0*float(cpus - remainder)/float(availCpus)
        stri = username + ' %d%%' % ( percent + 0.5 )
        if len(cpusList) == 1:
            stri += ' (1 job)'
        else:
            stri += ' (%d jobs)' % len(cpusList)
        data.append( ( stri, percent ) )

        if username in userColour.keys():
            c = userColour[username]
        else:
            c = freeColours[cnt]
            cnt += 1
            cnt %= len(freeColours)

        #print c, len(colour), len(colours), len(freeColours)
        colour.append( colours[c] )

        while doPlot and plotNum < maxPlots:
            plotNum += 1

            #print 'doing plot, data', data

            arcOffsets = []
            for i in range(len(data)):
                arcOffsets.append( 0 )

            tmpFilename = tempfile.mktemp()
            n = string.split( tmpFilename, '/' ) # pull off the initial /tmp/
            names.append( n[-1] )
            titles.append( title )
            can = canvas.init( tmpFilename + '.png' )

            ar = area.T(size=size, legend=None, x_grid_style = None, y_grid_style = None)

            # percentages are always out of a total of 100 for these pies

            queuePlot = myPie( data=data, arc_offsets=arcOffsets, fill_styles=colour,
                               #shadow = (2, -2, fill_style.gray50),
                               #center=( 800, 500 - plotNum*200 ), # radius=100*(totalQueuedCpus/totalCpus),
                               label_fill_style = None, label_offset = 25,
                               radius = radius, # start_angle = 180,
                               arrow_style = arrow.a0 )

            ar.add_plot(queuePlot)
            ar.draw(can)
            can.close()  # flush to file ASAP

            cpusUsed = 0
            doPlot = 0
            data = []
            colour = []

            doPlot = 0

            # handle spillover from one queued pie to another
            # allow one persons queued jobs to be >> machine size...
            if remainder:
                cpus = remainder

                cpusUsed += cpus
                remainder = 0
                if cpusUsed >= availCpus:
                    doPlot = 1
                    remainder = cpusUsed - availCpus

                percent = 100.0*float(cpus - remainder)/float(availCpus)
                stri = username + ' %d%%' % ( percent + 0.5 )
                # no job numbers in remainder mode...
                #if len(cpusList) == 1:
                #    stri += ' (1 job)'
                #else:
                #    stri += ' (%d jobs)' % len(cpusList)
                data.append( ( stri, percent ) )
                colour.append( colours[c] )

                if j == len(queued)-1:  # last data
                    doPlot = 1


def endPlotPie( names ):
    delayLoop( names )


def nextJobRuns( jobs, freeNow, n, bf, j, textMode=0 ):
    sortedJobs = []  # sort jobs by time remaining
    for job in jobs:
        username, nodeList, line, tagId, timeToGo, jobId, jobName, pbsInfo = job
        sortedJobs.append( ( timeToGo, len(uniq(nodeList)), job ) )
    sortedJobs.sort()

    txt = ''

    if textMode == 1:
        td = ''
        lt = '<'
        endTd = ''
        br = '\n'
    elif textMode == 2:  # weird hybrid text mode for use over cgi
        td = ''
        lt = '&lt;'
        endTd = ''
        br = '_br_'
        textMode = 0
    else:  # html
        td = '<td>'
        lt = '&lt;'
        endTd = '</td>'
        br = '<br>'

    # loop down the running jobs list 'til we accumulate 'n' free nodes
    free = freeNow
    for timeToGo, numNodes, job in sortedJobs:
        if timeToGo == -1:  # dud timeToGo field for some reason
            continue
        free += numNodes
        if free >= n:
            if textMode or j == 'eta1':
                if n == 1:
                    txt += td + 'next eligible job (1 node)'
                else:
                    txt += td + 'next eligible job (%d nodes)' % n
                txt += ' starts in approx ' + intToTime( timeToGo ) + ' (h:m:s)' + br + endTd 
            break

    if textMode or j == 'eta2':
        if not len(bf):
            txt += td + 'no nodes free' + endTd
            return txt

        txt += td + 'submit a'

        # sometimes the first one/few is just for <5 mins or so - in which case don't bother showing it
        bfCopy = []
        bfCopy[:] = bf
        #print 'bfCopy', bfCopy
        for i in range(len(bfCopy)):
            try:
                t = bfCopy[i]['time']
            except:   # no time field?!
                break
            if t == None:  # not h:m:s or d:h:m:s
                break   # end
            time = timeToInt( t )
            if time == None:  # not h:m:s or d:h:m:s
                break   # end
            if time < 300:
                del bfCopy[i]

        # stop the list being too long... if > 3 then pick top, mid, bottom, but avoid 
        if len(bfCopy) > 3:
            summaryBF = []
            summaryBF.append( bfCopy[0] )         # first
            summaryBF.append( bfCopy[len(bfCopy)/2] ) # mid
            summaryBF.append( bfCopy[len(bfCopy)-1] ) # end
            bfCopy = summaryBF

        for b in bfCopy:
            c = b['cpus']
            t = b['time']
            if c == 1:
                txt += ' 1 cpu job for'
            else:
                txt += ' job with ' + lt + '= %d cpus and' % c
            if t == None:
                txt += ' any'
            else:
                txt += ' ' + lt + ' ' +  t

            if b != bfCopy[len(bfCopy)-1]:
                txt += ' walltime, or a'
            else:
                txt += ' walltime for it to run now'

        if not textMode:
            txt += endTd

    return txt

def infoFromQueued( queued, availableNodes, availCpus ):
    node = 0
    cpus = 0
    cpuHours = 0.0

    for n, c, s, u, jobId, jobName, walltime, comment in queued:
        node += n
        cpus += c
        cpuHours += c*walltime/3600.0

    if availableNodes > 0:
        machineHours = cpuHours/float(availCpus)
    else:
        machineHours = 0

    return ( node, cpus, machineHours )


def tagAsBlocked( m, queued ):
    if m != None:
        # figure out if any of the queued jobs are really blocked
        id = []
        for i in m.getBlockedList():   # blocked, held, and otherwise Idle according to maui
            id.append( i['jobId'] )

    # loop over queued jobs and tag the 'blocked' ones
    for i in range(len(queued)):
        j = queued[i]
        n, c, state, user, jobId, jobName, walltime, comment = j

        if state == 'H':  # already held, so no point tagging it as blocked as well
            continue

        if m != None:
            jobInt = int( string.split( jobId, '.' )[0] )
            if jobInt in id:
                queued[i] = ( n, c, 'B', user, jobId, jobName, walltime, comment )
        else:
            # no maui information, so look at PBS comments instead
            if comment in ( 'Software licenses unavailable', 'Disk quota exceeded', 'Bonus job not starting - over usage threshold', 'Bonus jobs not starting' ):
                queued[i] = ( n, c, 'B', user, jobId, jobName, walltime, comment )

    return queued


def doStatus( freeNow, availableNodes, queued, maui, textMode=0, freeCpus=0, usedCpus=0, usedNodes=0, availCpus=0, realUsedCpus=0 ):
    # how loaded is this puppy?
    # and how many queued jobs
    node, cpus, machineHours = infoFromQueued( queued, availableNodes, availCpus )

    txt = ''

    if textMode == 1:
        td = ''
        endTd = ''
        br = '\n'
    elif textMode == 2:  # weird hybrid text mode for use over cgi
        td = ''
        lt = '&lt;'
        endTd = ''
        br = '_br_'
        textMode = 0
    else:  # html
        td = '<td>'
        endTd = '</td>'
        br = '<br>'

    #print 'usedCpus, usedNodes, availCpus', usedCpus, usedNodes, availCpus
    if availCpus != 0:
        txt += td
        if usedNodes == 1:
            txt += '%d node used' % usedNodes
        else:
            txt += '%d nodes used' % usedNodes
        if usedCpus == 1:
            #txt += ', %d core used' % usedCpus
            txt += ', %d core used' % realUsedCpus
        else:
            #txt += ', %d cores used' % usedCpus
            txt += ', %d cores used' % realUsedCpus
        #txt += ' = %.1f%% of available' % (100.0*float(usedCpus)/float(availCpus))
        txt += ' = %.1f%% of available' % (100.0*float(realUsedCpus)/float(realUsedCpus + freeCpus))
        txt += br
    else:
        txt += td

    if freeNow == 1:
        txt += '1 node idle'
    else:
        txt += '%d nodes idle' % freeNow

    if freeCpus == 1:
        txt += ', 1 cpu idle'
    else:
        txt += ', %d cpus idle' % freeCpus

    txt += br

    blockedCpus = 0
    blockedJobs = 0
    if maui != None:
        # look at queued jobs, if any...
        bl = maui.getBlockedList()
        blockedJobs = len(bl)
        for b in bl:
            blockedCpus += b['cpus']
        #if blockedCpus > 0:
        #    txt += blockedJobs, 'queued jobs (%d cpus)' % blockedCpus, 'are blocked from running, so really jobs are queued for', cpus-blockedCpus, 'cpus.'

    if len(queued) == 0:
        txt += 'no jobs queued' + br
    else:
        jobsQueued = len(queued) - blockedJobs
        cpusQueued = cpus - blockedCpus

        if jobsQueued == 0:
            txt += 'no jobs queued'
        elif jobsQueued == 1:
            txt += '1 job queued'
        else:
            txt += '%d jobs queued' % jobsQueued

        if cpusQueued == 0:
            pass
        elif cpusQueued == 1:
            txt += ' for 1 cpu'
        else:
            txt += ' for %d cpus, or %.1f machine hours' % ( cpusQueued, machineHours )

        if blockedCpus > 0:
            if blockedJobs == 1:
                txt += ' (and 1 job'
            else:
                txt += ' (and %d jobs' % blockedJobs
            if blockedCpus == 1:
                txt += ' (1 cpu)'
            else:
                txt += ' (%d cpus)' % blockedCpus
            txt += ' blocked from running)'

    txt += endTd

    return txt
