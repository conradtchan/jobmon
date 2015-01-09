#!/usr/bin/env python

# pump out xml for JavaScript in the browser to parse...

## [["key1","value1"],["key2","value2"],["key3","value3"],["key4","value4"]]
## -  send this string as response and then in your javascript simply eval it.
## It will become a 2 dimensional array. If you want, you can unroll the array into a hashmap:
##
##    var arr = eval(strin);
##    var map=new Array(arr.length);
##    for(var i=0;i<arr.length;i++) {
##      map[arr[i][0]]=arr[i][1];
##    }
##
## now you can access values in the map by the associated keys:
##    map["key4"] == "value4"


import string
from pbsMauiGanglia import gangliaStats, pbsNodes, loadedNetsGmond
from bobMonUtils import pbsJobs
# for pie
from bobMonUtils import queuedJobState, whosQueued, plotPie, endPlotPie, tagAsBlocked
from pbsMauiGanglia import maui
import hashlib, os, time, tempfile, cPickle
# for text
from bobMonUtils import nextJobRuns, doStatus
# for tempfiles
import stat
# for flush
import sys
# for compressed xml
import gzip

import bobMonConf
config = bobMonConf.config()

mode644 = (stat.S_IRUSR|stat.S_IWUSR|stat.S_IRGRP|stat.S_IROTH)

haveMaui = 1
configHashVal = None

# store stats for all the currently running jobs
stats = {}

debug = 0

#if debug:
#    # no pies will be written either...
#    dataPath = '/var/www/html/bobMon/data.rjh/'

def cpuBar( all ):
    state = '['

    cnt = 0
    data = {}
    length = len(all)
    for k, i in all.iteritems():
        j = string.split( k, '.' )[0]

        try:
            u = float(i['cpu_user'])
            n = float(i['cpu_nice'])
            s = float(i['cpu_system'])
            w = float(i['cpu_wio'])
            i = float(i['cpu_idle'])
        except:
            u = 0.0
            n = 0.0
            s = 0.0
            w = 0.0
            i = 100.0

        cpu = u + n
        system = s
        wio = w
        idle = i

        data[j] = ( cpu, system, wio, idle )

        # make them integers and add up to 100
        scale = 1.0
        tot = cpu + system + wio + idle
        if tot > 0.0:
            scale = 100.0/tot

        cpu =    int(scale*cpu)
        system = int(scale*system)
        wio =    int(scale*wio)
        idle = 100 - system - cpu - wio

        # set name_u, name_s, name_w, name_i = ( user+nice, system, wait io, idle )
        state += '["' + j + '_u",%d],' % cpu
        state += '["' + j + '_s",%d],' % system
        state += '["' + j + '_w",%d],' % wio
        state += '["' + j + '_i",%d]'  % idle

        if cnt != length-1:
            state += ','
        cnt += 1

    state += ']'
    return state, data

def doLoads( all, up ):
    state = '['

    cnt = 0
    length = len(all)
    for k, i in all.iteritems():
        n = string.split( k, '.' )[0]
        if n in config.shn:  # shelves don't have a load
            continue
        if n not in config.cn and n not in config.nben:
            continue

            try:
                n = int(j[len(config.baseNodeName):])
            except:
                # might be a node that we don't recognise... skip it
                continue

        if n in up:  # only write a load if it's really 'up'
            try:
               s = '["' + j + '_l",%.1f]' % float(i['load_one'])
            except:
               print n, 'load_one not set'
               s = '["' + j + '_l",%.1f]' % 0.0
            state += s

            if cnt != length-1:
                state += ','
            cnt += 1

    state += ']'
    return state

def doMem( mem, swap, cpuData ):
    state = '['

    data = {}
    swapKeys = swap.keys()
    for k, i in mem.iteritems():
        j = string.split( k, '.' )[0]

        data[j] = {}
        data[j]['mem'] = i

        try:
            if k in swapKeys:
                ( free, tot ) = swap[k]
                swapUsed = 100.0*(tot - free)/tot
            else:
                swapUsed = 0
        except:
            swapUsed = 0

        try:
            ( free, cached, shared, buf, tot ) = i

            # used and total memory in MB
            usedRam = (tot - buf - cached - free)/1024
            totRam = tot/1024
        except:
            usedRam = 0
            totRam = 1024

        # percent of ram used
        used = int(100.0*usedRam/totRam)

        swapping = 0
        if used > 80 and swapUsed > 10: # ~80% mem and 10% swap
            try:
                # if there's wio as well then it's a dead giveaway
                ( cpu, system, wio, idle ) = cpuData[j]
                if wio > 5:  # say, 5% wait_io
                    swapping = 1
            except:
                # slightly more stringent
                if used > 90 and swapUsed > 40: # ~90% mem and 40% swap
                    swapping = 1

        if k in swapKeys:
            data[j]['swap'] = ( swap[k][0], swap[k][1], swapping )  # free, tot, swapping

        state += '["' + j + '_m",%d,%d,%d],' % ( used, totRam, swapping )

    state = state[:-1]
    state += ']'
    return state, data

def doDisk( disk ):
    state = '['
    for k, i in disk.iteritems():
        j = string.split( k, '.' )[0]

        ( free, tot ) = i
        if tot > 0:
           used = 100.0*(tot - free)/tot
        else:
           used = 0.0
        full = 0
        if used > 95:
            full = 1
        used = int(used)  # 0-100
        state += '["' + j + '_d",%d,%d],' % ( used, full )

    if len(state) == 1:
        return '[]'

    state = state[:-1]
    state += ']'
    return state

def doDiskWarn( disk ):
    state = '['
    for k, i in disk.iteritems():
        j = string.split( k, '.' )[0]

        ( free, tot ) = i
        if tot > 0:
           used = 100.0*(tot - free)/tot
        else:
           used = 0.0
        if used > 95:
            state += '"' + j + '",'

    if len(state) == 1: # no disk warnings
        # fake a disk warning
        #return '["tpb3"]'
        return ''

    state = state[:-1]
    state += ']'
    return state

def doTemp( temps ):
    state = '['
    for k, t in temps.iteritems():
        j = string.split( k, '.' )[0]

        if len(t) == 2:
            state += '["' + j + '",[%d,%d]],' % t
        elif len(t) == 4:
            state += '["' + j + '",[%d,%d,%d,%d]],' % t

    if len(state) == 1:
        return '[]'

    state = state[:-1]
    state += ']'
    return state

def doTempWarn( temps ):
    state = '['
    for k, t in temps.iteritems():
        j = string.split( k, '.' )[0]

        cpu0 = -99
        cpu1 = -99
        ambient = -99

        if len(t) == 2:
            ( cpu0, cpu1 ) = t
        elif len(t) == 4:
            ( cpu0, cpu1, ambient, ambient ) = t
        else:
            # something really weird
            #print 'doTempWarn: broken temperature', t, 'from', k
            continue

        if cpu0 > config.cpuMaxTemp-10 or cpu1 > config.cpuMaxTemp-10 or ambient > config.ambientWarn:
            if len(t) == 2:
                state += '["' + j + '",[%d,%d]],' % ( cpu0, cpu1 )
            elif len(t) == 4:
                state += '["' + j + '",[%d,%d,%d,%d]],' % ( cpu0, cpu1, ambient, ambient )

    if len(state) == 1: # no temp warnings
        return ''

    state = state[:-1]
    state += ']'
    return state

def doPowerFans( data ):
    state = '['
    for k, t in data.iteritems():
        j = string.split( k, '.' )[0]
        if t != None:
            state += '["' + j + '",[%d]],' % t

    if len(state) == 1:
        return '[]'

    state = state[:-1]
    state += ']'
    return state

def obscufucateUserName( user, fallbackNum=0 ):
    # alter the usernames in such a way that they don't leak account name information
    # simplest is just to shorten it...

    # NOTE: the username field still needs to be unique, so we need a fallback
    # mode that exposes more of the username

    num = 3+fallbackNum
    if num > len(user):
        return None
    return user[:num]

def minimalOscufucatedUserList( u ):
    u.sort()
    u = uniq(u)

    shortU = {}
    last = ''
    for i in u:
        # check that the obscufucated version is unique amongst running jobs
        j = 0
        user = obscufucateUserName(i, j)
        while user != None:
            if user != last:
                shortU[i] = user
                last = user
                break
            else:
                j += 1
                user = obscufucateUserName(i, j)

        if user == None:
            # buggerit, attempts to obscuficate failed - just use the full username
            shortU[i] = i

    return shortU

def obscufucateJobsList( jobs, queued ):
    # generate a minimal list of usernames for running and queued jobs
    u = []
    for username, nodeList, line, tagId, timeToGo, jobId, jobName, pbsInfo in jobs:
        u.append(username)

    for n, c, state, username, jobId, jobName, walltime, comment in queued:
        u.append(username)

    # create a mapping between each username and the minimal obscufucated version
    u = minimalOscufucatedUserList( u )

    j = []
    for username, nodeList, line, tagId, timeToGo, jobId, jobName, pbsInfo in jobs:
        user = u[username]
        j.append( ( user, nodeList, line, tagId, timeToGo, jobId, jobName, pbsInfo ) )

    q = []
    for n, c, state, username, jobId, jobName, walltime, comment in queued:
        user = u[username]
        q.append( ( n, c, state, user, jobId, jobName, walltime, comment ) )

    return j, q

def doJobs( jobs ):
    state = '['
    for username, nodeList, line, tagId, timeToGo, jobId, jobName, pbsInfo in jobs:  # append to joblist field
        group = 'none'
        if 'group' in pbsInfo.keys():  # accounting group name, usually == unix group
            group = pbsInfo['group']
        state += '["' + jobId + '","' + username + '","' + group + '",['
        for n in nodeList:
            state += '"' + n + '",'
        state = state[:-1]  # pull off the last comma
        state += '],['
        for l in line:
            state += '"' + l + '",'
        state = state[:-1]  # pull off the last comma
        state += '],['

        # most of the info in 'line' repeated as numbers:

        # read the maximum mem/vm from the accumulated job stats.
        # fallback to the single snapshot value in pbsInfo if the job isn't in accumulated stats yet
        if jobId in stats.keys():
            m = stats[jobId]['pbsMaxMem']
        else:
            m = getMemVm( pbsInfo )
        state += '%.1f,%.1f,' % ( m[0], m[1] )

        # figure out nodes, cpus ... should match that from pbsInfo, but take the nodeList as definitive
        cpus = len(nodeList)
        nodes = len(uniq(nodeList))
        state += '%d,%d,' % ( cpus, nodes )

        for f in ( 'cpuTime', 'wallTime', 'wallLimit' ):  # times in seconds
            c = 0
            if f in pbsInfo.keys():
                c = pbsInfo[f]
            state += '%d,' % c

        c = 0.0
        if 'eff' in pbsInfo.keys():  # parallel efficiency
            c = pbsInfo['eff']
        state += '%.1f,' % c

        if 'state' in pbsInfo.keys():  # job state
            state += '"%s",' % pbsInfo['state']
        else:
            state += '"?",'

        if 'nodes' in pbsInfo.keys():  # node request line. eg. 1:ppn=2
            state += '"%s"' % pbsInfo['nodes']
        else:
            state += '""'

        state += ']],'
    if len(state) > 1:
        state = state[:-1]  # pull off the last comma
    state += ']'
    return state

def drainingHrs( s ):
    # expects a string of format draining-2009/01/15-17:00:00
    # returns None is this is not found, or a time difference from now if it is found
    try:
        # actually PBS is happy with any XXXX.XX.XX.XX.XX.XX where X is 0-9.
        #   so change all non 0-9 chars to '-'
        ss = ''
        for i in range(len(s[9:])):
            if s[9+i] not in string.digits:
                ss += '-'
            else:
                ss += s[9+i]
        drain = time.mktime( time.strptime(ss, '%Y-%m-%d-%H-%M-%S') )
        now = time.time()
        hrs = (drain - now)/3600.0
        return hrs
    except:
        return None

def doPbsInfo( pbsnodes ):
    infoHw = []
    for n, info, cores in pbsnodes:
        n = string.split( n, '.' )[0]

        hw = []
        for s in info:
           if s[:3] == 'HW_' or s[:3] == 'SW_':
              hw.append( s )
        for h in hw:
           info.remove( h )
        # trim off HW_ and SW_
        hw2 = []
        for h in hw:
           hw2.append( h[3:] )
        hw = hw2
        #print 'n', n, 'info', info, 'hw', hw

        # process node state 'info' to provide only most relevant field.
        i = ''
        # down and offline trump everything...
        if 'down' in info:
            i = 'down'
        elif 'offline' in info:
            i = 'offline'
        else:
            # need to process the drainng*'s in the order they appear 'cos PBS treats them that way:
            for s in info:
                if s == 'draining':
                    i = 'draining'
                    break
                elif s == 'draining-fill':
                    i = 'fill'
                    break
                elif s[:9] == 'draining-':
                    # translate the time into hrs relative to now
                    hrs = drainingHrs(s)
                    if hrs != None:  # could be draining-fill or something else that we don't handle here
                        if hrs < 0:
                            i = 'draining'
                        else:
                            if hrs > 10:
                                i = '%dh' % int(hrs)
                            else:
                                i = '%.1fh' % hrs
                    else:
                        i = s[9:]
                    break

        #print 'n', n, 'info', info, 'hw', hw, 'i', i
        infoHw.append( (n, i, hw) )

    return infoHw


def doPbsNodes( pbsnodes ):
    infoHw = doPbsInfo( pbsnodes )
    state = '['
    # info is the most important property string, hw is a list
    for n, info, hw in infoHw:
        #print  n, info, hw 
        state += '["' + n + '","'

        if info != '':
            state += info + ', '
        for s in hw:
            state += s + ', '
        state = state[:-2]
        state += '"], '

    if len(state) > 1 and state[-2] == ', ':
        state = state[:-2]
    state += ']'
    return state

def doNetLoads( n ):
    state = '['
    for i, v in n.iteritems():
        state += '["' + str(i) + '","%3.2f"],' % v
    if state[-1] == ',':
        state = state[:-1]
    state += ']'
    return state

def sortByUser( jobs ):
    users = {}
    totalCpus = 0
    jobList = {}
    for job in jobs:
        username, nodeList, line, tagId, timeToGo, jobId, jobName, pbsInfo = job
        cpus = len(nodeList)
        if username not in users.keys():
            users[username] = []
        users[username].append(cpus)
        totalCpus += cpus

        # calc joblist
        for n in nodeList:
            if n not in jobList.keys():
                jobList[n] = []
            jobList[n].append( username )

    # sort by fatness
    list = []
    for k, cpus in users.iteritems():
        list.append( ( sum(cpus), cpus, k ) )  # ( sumCpus, [ job1cpus, job2cpus, ... ], username )
    list.sort()
    list.reverse()

    return list, jobList, totalCpus

def whosUsingItAll( jobs, pbsnodes, pbsAllNodes=None ):
    # split into running ('R' 'E') and suspended 'S'
    r = []
    s = []
    for job in jobs:
        username, nodeList, line, tagId, timeToGo, jobId, jobName, pbsInfo = job
        if pbsInfo['state'] == 'S':
            s.append( job )
        else:
            r.append( job )

    # process the list of running jobs
    runList, jobList, totalRunCpus = sortByUser( r )

    free = freeAvailCpusNodes( pbsnodes, jobList, pbsAllNodes )
    idleCpus, freeNodes, availCpus, availNodes = free
    #print 'idleCpus, freeNodes, availCpus, availNodes', free
    totalRunCpus += idleCpus

    if idleCpus != 0:
        runList.append( ( idleCpus, [ idleCpus ], 'idle' ) )

    # process suspended jobs
    suspList, blah, totalSuspCpus = sortByUser( s )

    #print 'runList', runList, 'totalRunCpus', totalRunCpus, 'availNodes', availNodes
    #print 'suspList', suspList, 'totalSuspCpus', totalSuspCpus

    return (runList, totalRunCpus), (suspList, totalSuspCpus), free

def freeAvailCpusNodes( pbsnodes, jobList, pbsAllNodes=None ):   # work out how many free cpus we have
    # can choose whether to base the list of nodes off all nodes known to PBS (pbsAllNodes)
    # or off the config of nodes names.
    pbs = {}
    lb = len(config.baseNodeName)
    if pbsAllNodes != None:
        p = pbsAllNodes
        for n, status, cores in pbsAllNodes:
            # check it's a compute node
            try:
                num = int(n[lb:])
            except:
                num = config.numNodes+999
            if n[:lb] == config.baseNodeName and num > 1 and num < config.numNodes+1:
                pbs[n] = []
    else:
        p = pbsnodes
        for i in range(1,config.numNodes+1):
            n = config.baseNodeName + '%d' % i
            pbs[n] = []

    # add all nodes and their status's into a pbs dict
    for node, status, cores in p:  # make into a dict
        n = string.split( node, '.' )[0]
        if n[:lb] != config.baseNodeName:
            continue
        pbs[n] = ( status, cores )
        #print n, status

    freeCpus = 0
    freeNodes = 0
    availCpus = 0
    availNodes = 0
    #nonAvailNodes = 0

    # loop over all nodes
    # find those that are available - ie. not offline, down, draining, ...
    #    => availNodes, availCpus
    # on available nodes, count the cores that are free
    #    => freeNodes, freeCpus
    #
    # at the moment we ignore all non-avail nodes, as this routine is mainly
    # for the queued-up jobs which only care about the parts of the machine
    # that they could use.
    # but we could also easily count all nodes, or all non-avail nodes
    # that have jobs on them, etc.
    for node, sc in pbs.iteritems():
        status, cores = sc
        if node in config.hn:
            #print 'el-heado', node, sc
            continue

        # find non-avail nodes
        na = 0
        if len(status):
            if 'draining-fill' in status or 'draining' in status or 'offline' in status or 'down' in status:
                #print 'el-busted', node, sc
                na = 1
            else:
                # there might also be a draining-<time> in status... if there is then see if the time has passed.
                for s in status:
                    if s[:9] == 'draining-':
                        # translate the time into hrs relative to now
                        hrs = drainingHrs(s)
                        if hrs == None or hrs > 0:  # unknown or we have time remaining
                            continue
                        # hrs < 0, so no time remaining
                        na = 1
        if na:
            #if node in jobList.keys():
            #    # there is a job running on a draining/down node
            #    nonAvailNodes += 1
            continue

        availNodes += 1
        #print 'avail', node
        if cores != None:
            freeCpus += cores
            availCpus += cores
        else:
            freeCpus += config.coresPerNode
            availCpus += config.coresPerNode

        if node in jobList.keys():
            freeCpus -= len(jobList[node])
        else:
            freeNodes += 1

    #print 'freeCpus, freeNodes, availCpus, availNodes', freeCpus, freeNodes, availCpus, availNodes
    return ( freeCpus, freeNodes, availCpus, availNodes )

def doPies( withFries ):
    state = ''

    colours = {}
    try:
        colours = readUserColours( config.piePath + withFries['colours'] )
        del withFries['colours']
    except KeyError, theError:
        print 'failed to read in colours', theError
        pass
    state += '<colours>['
    for u, c in colours.iteritems():
        state += '["' + u + '","' + c + '"],'
    state = state[:-1]
    if len(colours):
        state += ']'
    state += '</colours>'

    for k in withFries.keys():
        state += '<' + k + '>['
        images = withFries[k]
        #print 'images', k, images
        if len(images):
            images.sort()
            for g in images:
                state += '"' + g + '",'
            state = state[:-1]
        state += ']</' + k + '>'

    return state

def doHash( jobs, queued, availCpus ):
    # running jobs looks like: ( username, nodeList, line, tagId, timeToGo, jobId, jobName, pbsInfo )
    # queued looks like: ( n, c, state, username, jobId, jobName, walltime, comment )
    hashes = {}

    # split up running into running and suspended
    r = []
    s = []
    for j in jobs:
        username, nodeList, line, tagId, timeToGo, jobId, jobName, pbsInfo = j
        if pbsInfo['state'] == 'S':
            s.append(j)
        else:
            r.append(j)

    for name, q in ( ('running', r), ('suspended', s)):
        if len( q ):
            txt = name + ' '
            for username, nodeList, line, tagId, timeToGo, jobId, jobName, pbsInfo in q:
                txt += jobId + ' '
            txt += '%d' % availCpus
            hashes[name] = hashlib.md5(txt).hexdigest()
        else:
            if name == 'running':
                hashes[name] = hashlib.md5('100% idle').hexdigest()

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
            # some sort of screwup...
            hashes['queueError'] = [ str(job) ]
            return hashes

    # although jobs in queued and blocked may change independantly of running
    # and suspended, the colours of the queued and blocked pies may well depend
    # on the colours of the running jobs, so these images may change.
    # prepend the hash of the running and suspended (if any)
    preHash = ''
    for name in ( 'running', 'suspended' ):
        if name in hashes.keys():
            preHash += hashes[name]

    for name, blah in ( ( 'queued', q ), ( 'blocked', b ) ):
        if len(blah):
            txt = preHash + ' ' + name + ' '
            for n, c, state, username, jobId, jobName, walltime, comment in blah:
                txt += jobId + state + ' '
            txt += '%d' % availCpus
            hashes[name]  = hashlib.md5(txt).hexdigest()

    return hashes


def findOldPies( hashes ):
    # look for files of that hash basename in piePath
    try:
        files = os.listdir( config.piePath )
    except OSError, theError:
        print theError, "... continuing anyway"
        return {}

    fresh = {}

    # check the colours .txt file is there
    txt = hashes['running'] + '.txt'
    if txt in files:
        fresh['colours'] = txt
        prebaked = 1
        #print 'pies might be there. looking'
    else:
        prebaked = 0

    # search for valid pies and remove stale pies
    #  - need to go through this loop regularly as stale pies could accumulate indefinitely
    for f in files:
        # skip all non txt,png files
        suffix = string.split( f, '.' )[-1]
        if suffix != 'png' and suffix != 'txt':
            continue

        tasty = 0
        if prebaked:
            base = string.split( f, '.' )[0]
            for k, h in hashes.iteritems():
                if base == h:
                    #print 'found a current ok "' + k + '" image', f
                    tasty = 1
                    if suffix == 'png':
                        if k not in fresh.keys():
                            fresh[k] = []
                        fresh[k].append( f )

        if not tasty:
            # no longer used, so delete if it's old.
            # allow a bit of slack as browser queries could still be in flight
            s = os.stat( config.piePath + f )
            if time.time() - s.st_mtime > 300:  # 5 mins old
                #print 'removing "' + f + '" as it\'s', str(time.time() - s.st_mtime), 'seconds old'
                try:
                    os.remove( config.piePath + f )
                except:
                    pass # don't worry about it too much - hope it's transient

    if txt not in files:
        # oops - didn't find, so force a re-pie.
        #print 'no txt - re-pie'
        return {}

    # check that we found all the images
    hk = hashes.keys()
    hk.append( 'colours' )
    hk.sort()
    fk = fresh.keys()
    fk.sort()
    if hk != fk:
        # oops - didn't find all images so force a re-pie
        # this can happen if queued jobs change but nothing else
        #print 'not all pies found - re-pie. expected', hk, 'found', fk
        return {}

    #print 'cached'
    fresh['cached'] = [ 'yup' ]
    return fresh


def movePies( names, titles, hashes, colourFile ):
    if len(names) != len(titles):
        return []

    pies = {}
    for i in range(len(titles)):
        t = string.lower( titles[i] )
        if t == 'blocked/held':
            t = 'blocked'
        if t not in pies.keys():
            pies[t] = []
        pies[t].append( names[i] )

    withSauce = {}
    for q in ( 'running', 'suspended', 'queued', 'blocked' ):
        #print 'q, pies.keys(), hashes.keys():', q, pies.keys(), hashes.keys()
        if q in pies.keys() and q in hashes.keys():
            names = pies[q]
            if q == 'running':
                # handle the colours text (pickle) file
                to = hashes[q] + '.txt'
                try:
                    os.rename( colourFile, config.piePath + to )
                    withSauce['colours'] = to
                except:
                    print 'failed to rename pie colours file - no colours?'
                    pass  # don't worry about it too much - hope it's transient

                if len(names) != 1:  # running should have just one pie
                    print 'error - need 1 pie for running, not', len(names)
                    # silently skip if error
                    continue

            withSauce[q] = []
            cnt = 0
            for p in names:
                to = hashes[q] + '.%.4d' % cnt + '.png'
                withSauce[q].append( to )
                try:
                    # trim down the size of the png image here as we're not using a cgi-bin
                    # script to do it later any more. this script also removes the p file
                    os.system( config.trimImage + ' /tmp/' + p + '.png ' + config.piePath + to )                    
                    #os.rename( '/tmp/' + p + '.png', config.piePath + to )
                except:
                    print 'failed to trimImage for pie', p, 'type', q
                    pass  # don't worry about it too much - hope it's transient
                cnt += 1

    return withSauce


def writeUserColours( u ):
    # takes a dict of user, colour pairs and writes to a tmp file
    tmpFilename = config.piePath + '.tmp'

    try:
        f = open( tmpFilename, 'w+b' )
    except IOError, theError:
        errNum, errStr = theError
        print 'writeUserColours - open failed. IOError', theError
        if errNum == 13:  # Permission denied
            print 'no biggy - prob just running as a user'
        return tmpFilename 

    cPickle.dump( u, f )
    f.close()
    os.chmod( tmpFilename, mode644 )
    return tmpFilename

def readUserColours( f ):
    return cPickle.load( open( f, 'r' ) )

def doUsage( free, running ):
    freeCpus, freeNodes, availCpus, availNodes = free
    runList, totalRunCpus = running
    realUsedCpus = totalRunCpus - freeCpus
    return '["pbs_running",%d,"pbs_avail",%d]' % ( realUsedCpus, totalRunCpus )

def doTimeStamp():
    txt = '['
    txt += '"' + time.strftime("%a, %d %b %Y %H:%M:%S +0000", time.gmtime()) + '"'
    txt += ',%d' % config.sleepTime
    txt += ']'
    return txt

def doText( jobs, queued, running, m, free ):
    freeCpus, freeNodes, availCpus, availNodes = free
    usedCpus = availCpus - freeCpus
    usedNodes = availNodes - freeNodes
    #print 'freeCpus, freeNodes, availCpus, availNodes', free
    #print 'usedNodes, usedCpus', usedNodes, usedCpus

    # totalRunCpus (includes freeCpus) is the effective size of the machine at
    # the moment which includes jobs on nodes that are draining/offline
    # (unfortunately also on down nodes).
    runList, totalRunCpus = running
    realUsedCpus = totalRunCpus - freeCpus

    txt = ''

    # work out the starting time for the next queued job
    if haveMaui:
        n = m.nextToRunNodes()
        bf = m.getBackFillList()

        # work out and print the next job to run
        for f in ( 'eta1', 'eta2' ):
            # eta1 can be total crap as it doesn't consider reservations, so just don't print it
            # should run 'showstart' instead as it gives an accurate 'next job runs ...'
            if f == 'eta1': #   and ( len(queued) == 0 or n == None ):
                t = ''
            else:
                t = nextJobRuns( jobs, freeNodes, n, bf, f, textMode=2 )
            txt += '<' + f + '>"' + t + '"</' + f + '>'
    else:   # rjh - fix later if it's possible at all?
        for f in ( 'eta1', 'eta2' ):
            t = ''
            txt += '<' + f + '>"' + t + '"</' + f + '>'

    # stats
    txt += '<stats>"' + doStatus( freeNodes, availNodes, queued, m, textMode=2, freeCpus=freeCpus, usedCpus=usedCpus, usedNodes=usedNodes, availCpus=availCpus, realUsedCpus=realUsedCpus ) + '"</stats>'

    return txt


def doReservations( m ):
    res = m.getRes()

    txt = '['
    for k, l in res.iteritems():
        l.sort()
        txt += '["' + k + '",['  # reservation name
        for i in l:
            # get rid of machine name suffixes
            txt += '"' + string.split( i, '.' )[0] + '",'  # list of machines
        txt = txt[:-1]
        txt += ']],'

    if len(res):
        txt = txt[:-1]
    txt += ']'

    return txt

gig = 1024.0*1024.0*1024.0
meg = 1024.0*1024.0
kay = 1024.0

def scalarToScaled( d ):
    if d > 1000000000:
        return ( d/gig, 'g' )
    elif d > 1000000:
        return ( d/meg, 'm' )
    elif d > 1000:
        return ( d/kay, 'k' )
    return ( d, 'b' )


def filterPacketValues( p ):
    packetMax = gig  # 1 G/s
    if p < 0 or p > packetMax:
        return 0.0
    return p

def filterByteValues( b ):
    byteMax = 4000*meg  # 4000 MB/s
    if b < 0 or b > byteMax:
        return 0.0
    return b


def doNetwork( all, sharedNetNodes ):
    state = '['
    data = {}

    for k, i in all.iteritems():
        j = string.split( k, '.' )[0]

        # ib bytes
        try:
            # filter for ridiculous values
            inB  = filterByteValues( float(i['ib_bytes_in']) )
            outB = filterByteValues( float(i['ib_bytes_out']) )
            bytesPerSec = inB + outB
        except:
            bytesPerSec = 0.0
        bw, scaleB = scalarToScaled( bytesPerSec )

        # ib packets
        try:
            inP  = filterPacketValues( float(i['ib_pkts_in']) )
            outP = filterPacketValues( float(i['ib_pkts_out']) )
            packetsPerSec = inP + outP
        except:
            packetsPerSec = 0.0
        pkt, scaleP = scalarToScaled( packetsPerSec )

        dodgy = 0
        if j in sharedNetNodes:
            dodgy = 1

        state += '["' + j + '_n",%.1f,"' % bw + scaleB + '",%.1f,"' % pkt + scaleP + '",%d],' % dodgy

        data[j] = ( bytesPerSec, packetsPerSec )

    state = state[:-1]
    state += ']'
    return state, data


def doFilesystems( all ):
    state = '['
    data = {}

    for k, i in all.iteritems():
        j = string.split( k, '.' )[0]

        # 'vu_short_read_bytes', 'vu_short_write_bytes',  # bytes to the main lustre fs
        # 'vu_apps_mds_ops', 'vu_home_mds_ops', 'vu_images_mds_ops', 'vu_short_mds_ops', # iops to a range of lustre fs's

        skip = 0

        # fs bytes
        bytes = []
        r = 0.0
        w = 0.0
        for n, rv, wv in [ ('short', 'vu_short_read_bytes', 'vu_short_write_bytes') ]:  # bobMon fs name and gmetric r,w name tuples
            try:
                # filter for ridiculous values
                readB  = filterByteValues( float(i[rv]) )
                writeB = filterByteValues( float(i[wv]) )
            except:
                #print j, 'doing except for fs data n,rv,wv', n,rv,wv
                skip = 1
                continue
            bytes.append( (n, (readB, writeB)) )
            r += readB
            w += writeB
        rbw, rscaleB = scalarToScaled( r )
        wbw, wscaleB = scalarToScaled( w )

        # fs metadata
        mdOps = []
        ops = 0.0
        for n, v in [ ('apps','vu_apps_mds_ops'), ('home','vu_home_mds_ops'), ('images','vu_images_mds_ops'), ('short','vu_short_mds_ops') ]:
            try:
                o = float(i[v])
            except:
                #print j, 'doing except for fs metadata n,v', n,v
                skip = 1
                continue
            mdOps.append( (n,o) )
            ops += o
        #obw, oscale = scalarToScaled( ops )

        if not skip:
            data[j] = ( bytes, mdOps )

            # sum of r,w,ops across all fs's
            state += '["' + j + '_fs",%.1f,"' % rbw + rscaleB + '",%.1f,"' % wbw + wscaleB + '",%.1f' % ops + '],'

    if state[-1] == ',':
        state = state[:-1]
    state += ']'
    return state, data


def uniq( list ):
    l = []
    prev = None
    for i in list:
        if i != prev:
            l.append( i )
        prev = i
    return l


def getMemVm( pbsInfo ):
    mem = 0.0
    vmem = 0.0
    if 'mem' in pbsInfo.keys():
        mem = pbsInfo['mem']/1048576.0  # in MB
    if 'vmem' in pbsInfo.keys():
        vmem = pbsInfo['vmem']/1048576.0 # in MB
    return ( mem, vmem )

def storeJobStats( jobs, cpuData, memData, netData, sharedNetNodes, power, fsData ):
    for username, nodeList, line, tagId, timeToGo, jobId, jobName, pbsInfo in jobs:
        #print 'jobId', jobId, 'nodeList', nodeList, 'state', pbsInfo['state']
        first = 0
        if jobId not in stats.keys():
            stats[jobId] = { 'nodes':None, 'stats':None, 'pbsMaxMem':[0.0, 0.0], 'jobState':None, 'warmupLoopCnt':0 }
            first = 1

        if len(nodeList) == 1:
            # can't really do single cpu jobs...
            continue

        nl = uniq( nodeList )

        if first:
            stats[jobId]['nodes'] = nl  # save the node list
            stats[jobId]['stats'] = {}  # dict of stats for each node
            stats[jobId]['fsMax'] = {}  # max over job lifetime of fs activities.
               # doing it here means we get the real max(job) instead of sum(max of each node in job).
               # the latter will be too high if eg. node 1 does i/o, then 2 does i/o, etc.

        jobState = pbsInfo['state']

        # if the job state has changed - eg. from None to R, or S to R
        # then we have a warmup period before stats are collected
        if jobState != stats[jobId]['jobState']:
            stats[jobId]['warmupLoopCnt'] = 0
            stats[jobId]['jobState'] = jobState

        # only collect stats for running jobs
        if jobState != 'R':
            continue

        if stats[jobId]['warmupLoopCnt'] < config.ignoreStatsLoops:
            stats[jobId]['warmupLoopCnt'] += 1
            continue

        m = stats[jobId]['pbsMaxMem']
        memVm = getMemVm( pbsInfo )
        m[0] = max( m[0], memVm[0] )
        m[1] = max( m[1], memVm[1] )

        fssum = {}  # sum of current fs over the nodes in this job
        fsmax = stats[jobId]['fsMax']

        for n in nl:
            try:
                ( free, cached, shared, buf, tot ) = memData[n]['mem']
            except:
                #print 'skipping node', n, 'mem'
                continue

            try:
                ( freeSwap, totSwap, swapping ) = memData[n]['swap']
            except:
                ( freeSwap, totSwap, swapping ) = ( 0, 0, 0 )

            try:
                ( cpu, system, wio, idle ) = cpuData[n]
            except:
                #print 'skipping node', n, 'cpu'
                continue

            try:
                ( bytes, pkts ) = netData[n]
            except:
                ( bytes, pkts ) = ( 0, 0 )

            try:
                watts = config.nodeWattsMultiplier * power[n]
            except:
                watts = 0.0

            try:
                ( fsBytes, fsOps ) = fsData[n]
            except:
                ( fsBytes, fsOps ) = ( [], [] )

            used = (tot - buf - cached - free)/1024.0  # in Mbytes
            tot /= 1024.0  # in Mbytes

            if n not in stats[jobId]['stats'].keys():  # first time we've seen this node
                stats[jobId]['stats'][n] = {}
                stats[jobId]['stats'][n]['cnt'] = 0
                stats[jobId]['stats'][n]['data'] = [ 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0 ]  # u,s,w,i,m,b,p,watts,swapCnt
                stats[jobId]['stats'][n]['max'] = [ 0.0, 0.0, 0.0, 0.0, 0.0 ]        # u,m,b,p,watts
                stats[jobId]['stats'][n]['totMem'] = tot   # ram on the node
                stats[jobId]['stats'][n]['taintedNet'] = 0   # network stats reliable/unreliable
                # fs's are a bit too many and varied to treat as vectors, so use dicts
                stats[jobId]['stats'][n]['fs'] = {}        # global filesystems sum
                stats[jobId]['stats'][n]['fscurrent'] = {} # global filesystems current value
                                                           #   'fs current' is different to the other stats[] metrics. detailed r,w,ops data
                                                           #   for each fs only really makes sense per job, and so we store it here so we can
                                                           #   send it out conveniently with the rest of the job stats.

            stats[jobId]['stats'][n]['cnt'] += 1
            stats[jobId]['stats'][n]['data'][0] += cpu      # percent
            stats[jobId]['stats'][n]['data'][1] += system   #   ""
            stats[jobId]['stats'][n]['data'][2] += wio      #   ""
            stats[jobId]['stats'][n]['data'][3] += idle     #   ""
            stats[jobId]['stats'][n]['data'][4] += used
            stats[jobId]['stats'][n]['data'][5] += bytes
            stats[jobId]['stats'][n]['data'][6] += pkts
            stats[jobId]['stats'][n]['data'][7] += watts
            if swapping:
                stats[jobId]['stats'][n]['data'][8] += 1

            if n in sharedNetNodes:
                stats[jobId]['stats'][n]['taintedNet'] = 1

            big = stats[jobId]['stats'][n]['max']
            big[0] = max(big[0], cpu)      # percent
            big[1] = max(big[1], used)
            big[2] = max(big[2], bytes)
            big[3] = max(big[3], pkts)
            big[4] = max(big[4], watts)

            s = stats[jobId]['stats'][n]['fs']
	    sc = stats[jobId]['stats'][n]['fscurrent']

            # bytes
            for f, v in fsBytes:   # name of fs, and (read,write) bytes/s
               if f not in s.keys():
                  s[f] = {}
                  s[f]['read']  = 0.0
                  s[f]['write'] = 0.0
                  sc[f] = {}
                  sc[f]['read']  = 0.0
                  sc[f]['write'] = 0.0
               r,w = v
               s[f]['read']  += r
               s[f]['write'] += w
               sc[f]['read']  = r
               sc[f]['write'] = w

               if f not in fsmax.keys():
                  fsmax[f] = {}
                  fsmax[f]['read']  = 0.0
                  fsmax[f]['write'] = 0.0

               if f not in fssum.keys():
                  fssum[f] = {}
                  fssum[f]['read']  = 0.0
                  fssum[f]['write'] = 0.0
               fssum[f]['read']  += r
               fssum[f]['write'] += w

            # ops
            for f, v in fsOps:   # name of fs, operations/s
               if f not in s.keys():
                  s[f] = {}
                  sc[f] = {}
               if 'ops' not in s[f].keys():
                  s[f]['ops'] = 0.0
                  sc[f]['ops'] = 0.0
               s[f]['ops'] += v
               sc[f]['ops'] = v

               if f not in fsmax.keys():
                  fsmax[f] = {}
               if 'ops' not in fsmax[f].keys():
                  fsmax[f]['ops'] = 0.0

               if f not in fssum.keys():
                  fssum[f] = {}
               if 'ops' not in fssum[f].keys():
                  fssum[f]['ops'] = 0.0
               fssum[f]['ops'] += v

            #print 'n', n, 'data', stats[jobId]['stats'][n], 'cpuData', cpuData[n]
            #print 'n', n, 'fs', s, 'current', sc

        # now have fssum across the nodes, so compare to max over job life
        for f in fssum.keys():
            for v in fssum[f].keys():
               if fssum[f][v] > fsmax[f][v]:
                  fsmax[f][v] = fssum[f][v]


def statsForJob( j, doPrint=0 ):
    if doPrint:
        print 'job', j,

    st = stats[j]
    data = st['stats']
    pbsMaxMem = st['pbsMaxMem']

    # data is formated like:
    #   [ ["node",[u,s,w,i,m]], .... , ["ave",[u,s,w,i,m]] ]
    # or
    #   []
    # if it's a 1 cpu job, or if no stats are collected yet

    ave = [ 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0 ]  # ave over nodes of ave over job life of:  u,s,w,i,m,b,p,watts,swapCnt
    bigAve = [ 0.0, 0.0, 0.0, 0.0, 0.0 ]                   # ave over nodes of max over job life of:  u,m,b,p,watts

    nodes = st['nodes']
    if nodes == None:
        if doPrint:
            print '1 cpu job'
        return ''

    numNodesInJob = len(nodes)
    if numNodesInJob < 1:
        print ''
        print 'invalid numNodesInJob', numNodesInJob, 'job', j
        return ''

    txt = '['

    nodesCnt = 0
    maxMemOnNodes = 0
    tMax = 0
    fs = {}
    invCnt = -1
    for n in st['nodes']:
        try:
            cnt = data[n]['cnt']
        except:
            #print 'cnt not fnd'
            continue

        if cnt <= 0:
            #print 'cnt < 0'
            # skip it
            continue

        invCnt = 1.0/cnt

        # compute whole job average
        nodesCnt += 1
        for i in range(len(ave)):
            ave[i] += ( data[n]['data'][i] * invCnt )

        for i in range(len(bigAve)):
            bigAve[i] += data[n]['max'][i]

        try:
            u = int(invCnt * data[n]['data'][0])
            s = int(invCnt * data[n]['data'][1])
            w = int(invCnt * data[n]['data'][2])
            #print 'normal user/sys/wait', n, data[n]['data'], 'job', j
        except:
            # occasionally get eg.
            #  weird user/sys/wait v905 [165.19999999999999, inf, 94.100000000000009, 9.400000000 0000004, 9840.515625, 38530738.980000004, 30208.290000000001, 311.88, 0]          
            print ''
            print 'weird user/sys/wait', n, data[n]['data'], 'job', j
            u = 0
            s = 0
            w = 0

        i = 100 - u - s - w
        m = int(invCnt * data[n]['data'][4])
        b = scalarToScaled( invCnt*data[n]['data'][5] )
        p = scalarToScaled( invCnt*data[n]['data'][6] )
        #watts = scalarToScaled( invCnt*data[n]['data'][7] )
        swapping = invCnt * data[n]['data'][8]  # % of time this node's been swapping

        # max of user, mem
        maxU = int(data[n]['max'][0])
        maxM = int(data[n]['max'][1])
        maxB = scalarToScaled( data[n]['max'][2] )
        maxP = scalarToScaled( data[n]['max'][3] )
        maxWatts = scalarToScaled( data[n]['max'][4] )

        totMem = int( data[n]['totMem'] )
        if totMem > maxMemOnNodes:
            maxMemOnNodes = totMem

        # if network stats might be dodgy
        t = data[n]['taintedNet']
        if t > tMax:
            tMax = t

        # send watts
        #txt += '["' + n + '",[%d,%d,%d,%d,%d,%.1f,"%s",%.1f,"%s",%.1f,"%s",%.3f],[%d,%d,%.1f,"%s",%.1f,"%s",%.1f,"%s"],%d,%d],' % ( u, s, w, i, m, b[0], b[1], p[0], p[1], watts[0], watts[1], swapping, maxU, maxM, maxB[0], maxB[1], maxP[0], maxP[1], maxWatts[0], maxWatts[1], totMem, t )
        txt += '["' + n + '",[%d,%d,%d,%d,%d,%.1f,"%s",%.1f,"%s",%.3f],[%d,%d,%.1f,"%s",%.1f,"%s"],%d,%d],' % ( u, s, w, i, m, b[0], b[1], p[0], p[1], swapping, maxU, maxM, maxB[0], maxB[1], maxP[0], maxP[1], totMem, t )

        # we don't send any per node fs info in the above txt,
        # but we need to sum across nodes to generate totals and aves
        for d in ( 'fs', 'fscurrent' ):
            if d not in fs.keys():
                fs[d] = {}
            s = data[n][d]
            for f in s.keys():  # fs names
                if f not in fs[d].keys():
                    fs[d][f] = {}
                for t in s[f].keys():  # r,w,ops
                    if t not in fs[d][f].keys():
                        fs[d][f][t] = 0.0
                    fs[d][f][t] += s[f][t]

    # for fs, would be good to display
    #  - now read/write/iops   = sum(simplified fsData[nodes]) == sum(stats['fscurrent']))
    #  - ave read/write/iops over job lifetime   = sum(stats['fs'])/jobtime  for all fs fields/fs's
    #  - max read/write/iops over job lifetime   = sum(stats['fsmax'])               ""      on the same plot
    # where all these are first summed over all nodes in the job

    if invCnt > 0 and 'fs' in fs.keys():
        for f in fs['fs'].keys():  # fs names
            for t in fs['fs'][f].keys():  # r,w,ops
                fs['fs'][f][t] = fs['fs'][f][t] * invCnt
    #print j, 'fs', fs

    # find job's fs current, ave, max
    fsSum = {}
    fsStr = '['
    if 'fs' in fs.keys():
        for f in fs['fs'].keys():  # fs names
            fsSum[f] = {}
            fsStr += '["' + f + '",'
            for t in fs['fs'][f].keys():  # r,w,ops
                # above we create fs, fscurrent and fsmax with the same keys, so the below is safe
                fsSum[f][t] = ( int(fs['fscurrent'][f][t]), int(fs['fs'][f][t]), int(st['fsMax'][f][t]) )
                fsStr += '["' + t + '",[%d,%d,%d]' % fsSum[f][t] + '],'
            fsStr += '],'
    fsStr += ']'
    fsStr = string.replace(fsStr,'],]',']]')
    fsStr = string.replace(fsStr,'],]',']]')
    #print j, 'fsSum', fsSum
    #print j, 'fsStr', fsStr
    #print j, 'fsMax', st['fsMax']

    if nodesCnt > 0:
        u = ave[0]/numNodesInJob
        s = ave[1]/numNodesInJob
        w = ave[2]/numNodesInJob
        i = ave[3]/numNodesInJob
        tot = int((ave[0] + ave[1] + ave[2] + ave[3])/numNodesInJob)
        m = ave[4]/numNodesInJob
        b = scalarToScaled( ave[5]/numNodesInJob )
        p = scalarToScaled( ave[6]/numNodesInJob )
        watts = ave[7]/numNodesInJob
        swapping = ave[8]/numNodesInJob

        bAve = scalarToScaled( bigAve[2]/numNodesInJob )
        pAve = scalarToScaled( bigAve[3]/numNodesInJob )
        wattsAve = bigAve[4]/numNodesInJob

        if doPrint:
            print 'samples', cnt, 'nodes', numNodesInJob, 'averages: cpu % u/s/w/i/tot', int(u), int(s), int(w), int(i), tot, 'mem', int(m), 'Mbytes', b, 'pkts', p, 'per node watts ave/max', int(watts), int(wattsAve), 'fs ave',
            if 'fs' in fs.keys():
               print fs['fs'],
            print
            sys.stdout.flush()

        txt += '["ave",'
        # could also send watts here
        txt +=   '[%d,%d,%d,%d,%d,%.1f,"%s",%.1f,"%s",%.3f],' % ( int(u), int(s), int(w), 100 - int(u+s+w), int(m), b[0], b[1], p[0], p[1], swapping )
        txt +=   '[%d,%d,%.1f,"%s",%.1f,"%s"],%d,%d,' % ( int(bigAve[0]/numNodesInJob), int(bigAve[1]/numNodesInJob), bAve[0], bAve[1], pAve[0], pAve[1], maxMemOnNodes, tMax )
        txt +=   fsStr
        txt += ']'
    else:
        return ''

    txt += ']'

    return txt


def doJobStats( jobs, err ):
    running = []
    for username, nodeList, line, tagId, timeToGo, jobId, jobName, pbsInfo in jobs:
        running.append( jobId )

    txt = '['
    found = 0
    for r in running:
        t = statsForJob( r )
        if t != '':
            found = 1
            txt += '["' + r + '",' + t + '],'

    if found:
        txt = txt[:-1]
    txt += ']'

    # find jobs that have finished
    if err == None:  # only delete if the qstat was ok
                     # otherwise we can lose a whole job history just 'cos of
                     # one missed poll of pbs
        for j in stats.keys():
            if j not in running:
                print 'finished',
                t = statsForJob( j, doPrint=1 )
                # save all about job and it's stats to file here...
                # ie. dump all of stats[j] and jobs[j] and statsForJob(j) to a file

                del stats[j]

    return txt

def doHeader():
    txt = '<?xml version="1.0"?>\n'
    txt += '<bobMonData>\n'
    return txt

def doFooter():
    return '</bobMonData>\n'

# example of how to override a gangliaStats function
class gangliaStatsSunnyvale(gangliaStats):
    # override a function in order to drop bubbles/ricky data on the floor
    #  - sometimes they get this name when they reboot, we only look at tpb4,5
    def gangliaNameToKey( self, name ):
        if name in ( 'bubbles', 'ricky', 'bubbles.cita.utoronto.ca', 'ricky.cita.utoronto.ca' ):
            return None
        return name

def configHash( doPrint = 0):
    import types
    m = hashlib.sha1()

    keys = dir(config)
    d = {}

    if doPrint:
        prefix = '    this.'
        print '<!-- Hide script from non-JavaScript browsers'
        print '//'
        print '// do not edit this file - it is autogenerated from bobMonitorConf.py'
        print '//'
        print 'function bobMonitorConf() {'

    for f in keys:
        if f[0:2] == '__':   # skip python internal objects
            continue
        if f[0:1] == '_':   # skip python methods
            continue
        item = getattr(config, f)
        d[f] = item

       if doPrint:
           if type(item) == types.StringType:
               print prefix + f + ' = \'' + str(item) + '\';'
           else:
               print prefix + f + ' = ' + str(getattr(config, f)) + ';'

    m.update(str(d))
    hexhash = m.hexdigest()

    if doPrint:
        print prefix + 'hashkey = \'' + str(hexhash) + '\';'
        print '}'
        print '-->'

    return hexhash

def prune(all):
    todel = []
    for k, i in all.iteritems():
        n = string.split( k, '.' )[0]
        if not ( n in config.nben or n in config.shn or n in config.cn ):
            todel.append(k)
    for k in todel:
        del all[k]

def pruneMany(l):
   for i in l:
      prune(i)

def doAll():
    txt = ''

    # increment this (and the client to match) if server changes are going to break the client
    api = '9'
    txt += '<api>["' + api + '"]</api>\n'

    txt += '<configHash>["' + configHashVal + '"]</configHash>\n'
    txt += '<timeStamp>' + doTimeStamp() + '</timeStamp>\n'

    g = gangliaStats( doCpus=1 )
    all = g.getAll()

    # remove unrecognised nodes
    prune(all)

    # loads on nodes:
    q = loadedNetsGmond()
    q.feedInData( all, deadTimeout=60 )  # re-use the data from querying gmond
    ( netLoad, loads, cpuUsage, up ) = q.getLoads()
    txt += '<netloads>' + doNetLoads( netLoad ) + '</netloads>\n'
    txt += '<loads>' + doLoads( all, up ) + '</loads>\n'
    cpuTxt, cpuData = cpuBar( all )
    txt += '<cpuBar>' + cpuTxt + '</cpuBar>\n'

    ( mem, disk, swap, temps, power, fans ) = g.getStats()
    pruneMany( ( mem, disk, swap, temps, power, fans ) )
    memTxt, memData = doMem( mem, swap, cpuData )
    txt += '<mem>' + memTxt + '</mem>\n'

    txt += '<disk>' + doDisk( disk ) + '</disk>\n'
    txt += '<temp>' + doTemp( temps ) + '</temp>\n'
    txt += '<diskWarn>' + doDiskWarn( disk ) + '</diskWarn>\n'
    txt += '<tempWarn>' + doTempWarn( temps ) + '</tempWarn>\n'
    txt += '<power>' + doPowerFans( power ) + '</power>\n'
    txt += '<fans>' + doPowerFans( fans ) + '</fans>\n'

    # pbs jobs:
    p = pbsJobs()
    jobs = p.getJobList()
    queued = p.getQueuedList()

    jobs, queued = obscufucateJobsList( jobs, queued )

    n = pbsNodes()
    pbsnodes = n.getNodesList()
    pbsAllNodes = n.getFullNodesList()
    #print 'pbsAllNodes', pbsAllNodes, 'len', len(pbsAllNodes)
    txt += '<pbsnodes>' + doPbsNodes( pbsnodes ) + '</pbsnodes>\n'

    running, suspended, free = whosUsingItAll( jobs, pbsnodes, pbsAllNodes )
    #print 'running', running,'suspended', suspended
    freeCpus, freeNodes, availCpus, availNodes = free
    #print 'free', free

    global haveMaui
    if haveMaui:
        m = maui()
        if not m.mauiOk():
            haveMaui = 0
    else:
        m = None

    queued = tagAsBlocked( m, queued )
    hashes = doHash( jobs, queued, availCpus )  # gen hashes of job state
    pastie = findOldPies( hashes )  # see if we've done it all before...
    if not debug:
        if not len(pastie):
            queuedup, blocked = whosQueued( queued )
            #print 'running', running,'suspended',suspended,'queuedup',queuedup,'blocked', blocked,'availCpus',availCpus
            pieNames, pieTitles, userColour = plotPie( running, suspended, queuedup, blocked, availCpus )
            #print 'userColour', userColour
            colourFile = writeUserColours( userColour )
        #else:
        #    print 'old pies found'

    # can do things in there whilst waiting for pies to cook ...

    txt += '<text>' + doText( jobs, queued, running, m, free ) + '</text>\n'
    if haveMaui:
        txt += '<reservations>' + doReservations( m ) + '</reservations>\n'
    else:
        txt += '<reservations>[]</reservations>\n'

    # this gives cluster usage information that isn't used by the web client
    # it can be fed back into ganglia by an external script (eg. usedCores.py)
    txt += '<usage>' + doUsage( free, running ) + '</usage>\n'

    sharedNetNodes = [] # flagNodesWithSharedNetworking( jobs )
    netTxt, netData = doNetwork( all, sharedNetNodes )
    txt += '<network>' + netTxt + '</network>\n'

    # get filesystem data and metadata
    fsTxt, fsData = doFilesystems(all)
    # r,w,ops triples are the sum of all monitored (usually global) fs's on each node
    txt += '<fs>' + fsTxt + '</fs>\n'

    # store cpu loads with the running jobs
    if p.error == None:
        # only process if we got an ok qstat otherwise we will wipe job histories
        storeJobStats( jobs, cpuData, memData, netData, sharedNetNodes, power, fsData )
    else:
        print 'error from pbs'
    txt += '<averages>' + doJobStats( jobs, p.error ) + '</averages>\n'

    # running jobs:
    txt += '<jobs>' + doJobs( jobs ) + '</jobs>\n'

    if not debug and not len(pastie):
        endPlotPie( pieNames )
        # now move the pies into the right dir... a hack, but hey
        pastie = movePies( pieNames, pieTitles, hashes, colourFile )

    txt += '<pies>' + doPies( pastie ) + '</pies>\n'

    return txt


def doWrite( txt, fileName, doGzip='no' ):
    # write to a tmp file as takes time...
    tmpFilename = fileName + '.new'
    if doGzip == 'yes':
        tmpFilename += '.gz'
        f = gzip.open( tmpFilename, 'wb' )
    else:
        f = open( tmpFilename, 'w+b' )
    f.write( doHeader() + txt + doFooter() )
    f.close()
    os.chmod( tmpFilename, mode644 )

    # then mv it to the final location
    try:
        os.rename( tmpFilename, fileName )
    except OSError, theError:
        errNum, errStr = theError
        print 'doWrite - rename failed. OSError', theError
        if errNum == 13:  # Permission denied
            print 'no biggy - prob just running as a user'
        os.unlink( tmpFilename )

if __name__ == '__main__':
    if len(sys.argv) > 1 and sys.argv[1] == '--config':
        configHash( doPrint=1 )
        sys.exit(0)

    configHashVal = configHash()

    # loop here infinitely and every so often run a doAll
    while ( 1 ):

        txt = doAll()

        # normal
        if len(sys.argv) > 1:
            print txt   # stdout
            sys.exit(0)
        else:
            doWrite( txt, config.dataPath + 'bobData' )
            doWrite( txt, config.dataPath + 'bobData.gz', doGzip='yes' )
        time.sleep(config.sleepTime)
