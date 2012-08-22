#!/usr/bin/env python

# (c) Robin Humble 2003,2004,2005,2006,2007,2008
# licensed under the GPL v3

import os
import sys
import string
import time

import bobMonitorConf as config

dummyRun = 0

def uniq( list ):
    l = []
    prev = None
    for i in list:
        if i != prev:
            l.append( i )
        prev = i
    return l

def timeToInt( timeStr ):
    """h:m:s or d:h:m:s string to seconds"""
    time = None
    l = string.split( timeStr, ':' )
    if len(l) == 3:
        ( h, m, s ) = ( int(l[0]), int(l[1]), int(l[2]) )
        time = s + m*60 + h*3600
    elif len(l) == 4:
        ( d, h, m, s ) = ( int(l[0]), int(l[1]), int(l[2]), int(l[3]) )
        time = s + m*60 + h*3600 + d*(24*3600)
    return time

def intToTime( time ):
    """seconds to h:m:s string"""
    h = int(time/3600)
    m = int((time - 3600*h)/60)
    s = int(time - 3600*h - 60*m)
    timeStr = '%.2d:%.2d:%.2d' % ( h, m, s )
    return timeStr

# parse eg. "1,3,4-8,10-20,25"
def parseCpuList( cpus ):
    c = []
    s = string.split( cpus, ',' )
    for i in s:
        ss = string.split( i, '-' )
        if len(ss) > 1:  # found a range
            for j in range(int(ss[0]), int(ss[1])+1):
                c.append(j)
        else:            # found a single
            c.append(int(i))
    return c

class loadedNetsBase:
    def __init__( self ):
        self.up = []    # list of up nodes
        self.loads = {} # dictionary of loads
        self.cpuUsage = {}    # dict of user/nice/sys/idle cpu usage
        self.loadedNet = {}   # dict of active net loads
        self.unloadedNet = {} #   ""     idle  ""

class loadedNetsGstat(loadedNetsBase):
    def process( self ):
        self.read()  # load em up
        self.calcLoadsOnNets()  # build per-net statistics

    def read( self ):
        if dummyRun:
            f = open( 'yo-gstat', 'r' )
        else:
            f = os.popen( 'gstat -a1l', 'r' )

        # format is:
        #                                       LOAD                       CPU              Gexec
        # hostname  CPUs (Procs/Total) [     1,     5, 15min] [  User,  Nice, System, Idle]

        readingOk = 1
        while readingOk:
            try:
                l = f.readline()
            except:
                readingOk = 0

            if len(l) == 0:
                readingOk = 0
            else:
	        # print 'init', l
                l = string.split( l, ')' )
                name = string.split( l[0] )[0]
	        # print 'name', name
                if len(l) > 1:  # if they're up, then check on their status
                    l = string.split( l[1], '[' )
                    loads = l[1]
                    cpus = string.split( l[2], ',' )
                    # print 'loads',loads, 'cpus', cpus
                    load = float( string.split( loads, ',' )[0] )  # 1 min load
                    cpu = ( float(cpus[0]), float(cpus[1]), float(cpus[2]), float(string.split( cpus[3], ']' )[0]) )
                    # print name, load, cpu

                    num = self.nameToNum( name )
                    if num == None:
                        continue
    
                    self.up.append( num )
                    self.loads[num] = load
                    self.cpuUsage[num] = cpu

        #print 'self.loads', self.loads
        f.close()

        self.up.sort()


class loadedNetsGmond(loadedNetsBase):
    def process( self ):
        self.calcLoadsOnNets()  # build per-net statistics

    def feedInData( self, all, deadTimeout=120 ):
        # take the dicts from gmond stats and pull out the fields we want...
        now = time.time()  # seconds since 1970

        for host in all.keys():
            num = self.nameToNum( host )
            if num == None:
                continue

            if dummyRun:
                self.up.append( num ) # all are up
            else:
                if now - all[host]['reported'] < deadTimeout:   # 2 min
                    self.up.append( num )  # list of up nodes

            # check for broken ganglia
            if 'load_one' not in all[host].keys():
                continue

            try:
                self.loads[num] = float(all[host]['load_one'])
            except KeyError, theError:
                print host, 'load_one not in ganglia'
                #pass  # silent failure
            try:
                self.cpuUsage[num] = ( float(all[host]['cpu_user']), float(all[host]['cpu_nice']), float(all[host]['cpu_system']), float(all[host]['cpu_wio']), float(all[host]['cpu_idle']) )
            except KeyError, theError:
                print host, 'cpu user/nice/system/wio/idle not in ganglia'
                #pass  # silent failure

        #print 'self.loads', self.loads

class gangliaStats:
    def __init__( self, doCpus=0, gmondHost='localhost', reportTimeOnly=0, quiet=0, deadTimeout=120 ):
        self.mem = {}  # dict of mem usage
        self.disk = {} # dict of disk usage
        self.swap = {} # dict of swap usage
        self.temps = {} # dict of temperatures
        self.power = {} # dict of watts used
        self.fans = {} # dict of fan speeds
        self.all = None
        self.quiet = quiet
        self.deadTimeout = deadTimeout

        self.read( doCpus, gmondHost, reportTimeOnly )  # load em up

    def getStats( self ):
        return ( self.mem, self.disk, self.swap, self.temps, self.power, self.fans )

    def getAll( self ):
        return self.all

    def gangliaNameToKey( self, name ):
        """override this if you want to map or delete names specially"""
        return name

    def read( self, doCpus, gmondHost, reportTimeOnly ):
        if dummyRun:
            f = open( 'yo-ganglia-xml', 'r' )
            lines = f.readlines()
            f.close()
            xmlData = []
            for l in lines:
                xmlData.extend( string.split( l ) )

        else:
            # very very very slow
            # f = os.popen( '/usr/sbin/ganglia mem_free mem_cached mem_shared mem_buffers mem_total disk_free disk_total swap_free swap_total cpu0_temp cpu1_temp mb0_temp mb1_temp', 'r' )

            # instead, use sockets and process the xml data ourselves
            import socket
            sock = socket.socket( socket.AF_INET, socket.SOCK_STREAM )
            try:
                sock.connect( (gmondHost, 8649) )
            except:
                return

            xmlData = ''
            data = 1
            while 1:
                data = sock.recv(102400)
                if not data:
                    break
                xmlData += data
            sock.shutdown(2)
            xmlData = string.split( xmlData )

        # standard ganglia metrics
        metrics = [ 'mem_free', 'mem_cached', 'mem_shared', 'mem_buffers', 'mem_total', 'disk_free', 'disk_total', 'swap_free', 'swap_total', 'boottime' ]
        if doCpus:
            metrics.extend( [ 'load_one', 'cpu_user', 'cpu_nice', 'cpu_system', 'cpu_idle', 'cpu_wio' ] )

        # the rest are non-standard and are in the config file
        metrics.extend( config.extraGangliaMetrics )

        # ultra-lame (but fast) parse of all xml data into a dict of dicts
        i = 0
        max = len(xmlData)
        all = {}
        version = None
        host = None
        if reportTimeOnly:
            while i < max:
                if xmlData[i] == '<HOST':
                    i += 1   # assume the NAME= field is the next one
                    host = string.split( xmlData[i], '"' )[1]

                    i += 2
                    if xmlData[i][:4] == 'TAGS':   # must be ganglia 3.2.0
                        i += 1
                    all[host] = {}
                    reported = string.split( xmlData[i], '"' )[1]
                    i += 1
                    all[host]['reported'] = int(reported)

                i += 1
            self.all = all
            return

        while i < max:
            if xmlData[i] == '<METRIC':
                i += 1   # assume the NAME= field is the next one
                metric = string.split( xmlData[i], '"' )[1]
                i += 1

                if metric in metrics:
                    val = string.split( xmlData[i], '"' )[1]
                    i += 1   # assume the VAL= field is the next one
                    all[host][metric] = val

            elif xmlData[i] == '<HOST':
                i += 1   # assume the NAME= field is the next one
                host = string.split( xmlData[i], '"' )[1]

                #if version == '3.0.1':
                #    host = socket.gethostbyaddr(host)[0]

                i += 2
                if xmlData[i][:4] == 'TAGS':   # must be ganglia 3.2.0
                    i += 1
                all[host] = {}
                reported = string.split( xmlData[i], '"' )[1]
                i += 1
                all[host]['reported'] = int(reported)

            elif xmlData[i] == '<GANGLIA_XML':
                i += 1   # VERSION=
                version = string.split( xmlData[i], '"' )[1]
                i += 1

            i += 1

        # print 'all', all
        self.all = all
        gb = 1.0/(1024.0*1024.0)

        for name in all.keys():
            # print 'name', name
            num = self.gangliaNameToKey( name )
            if num == None:
                # delete from 'all' if it's not supposed to be there
                del all[name]
                continue

            ## check for broken/incomplete ganglia data
            #if 'mem_free' not in all[name].keys() or 'mem_total' not in all[name].keys() or 'disk_total' not in all[name].keys() or 'swap_total' not in all[name].keys():
            #    print 'ganglia info busted for', name
            #    continue

            try:
                self.mem[num]  = ( float(all[name]['mem_free']), float(all[name]['mem_cached']), float(all[name]['mem_shared']), float(all[name]['mem_buffers']), float(all[name]['mem_total']) )
            except:
                if not self.quiet and name[:3] != 'cmm':  # hack for vayu cmm's
                    now = time.time()
                    if now - all[name]['reported'] < self.deadTimeout:  # up but confused
                        print 'mem gmond data from', name, 'is incomplete in a confusing way - restart its gmond?'
                #print all[name]
                #sys.exit(1)

            try:
                #if 'uber_free' in all[name].keys():
                #    self.disk[num] = ( float(all[name]['disk_free']) - float(all[name]['uber_free'])*gb, float(all[name]['disk_total']) - float(all[name]['uber_total'])*gb )
                #    #print 'disk free', float(all[name]['disk_free']), 'uber_free', float(all[name]['uber_free'])*gb, 'disk_total', float(all[name]['disk_total']), 'uber_free', float(all[name]['uber_total'])*gb
                #else:
                #    self.disk[num] = ( float(all[name]['disk_free']), float(all[name]['disk_total']) )
                self.disk[num] = ( float(all[name]['disk_free']), float(all[name]['disk_total']) )
                self.swap[num] = ( float(all[name]['swap_free']), float(all[name]['swap_total']) )
            except:
                pass
                #print 'disk or uber gmond data from', name, 'is incomplete in a confusing way - restart it\'s gmond?'
                #if name[:3] != 'cmm':  # hack for vayu cmm's
                #    print 'disk or swap gmond data from', name, 'is incomplete in a confusing way - restart its gmond?'
                #print all[name]
                #sys.exit(1)

            self.temps[num] = ()
            haveC=0
            haveFR=0
            haveCh=0
            # some nodes don't have temps, some temps have control chars in them!
            if 'cpu1_temp' in all[name].keys():
                c = all[name]['cpu1_temp'] 
                c1 = int(c.split('.')[0])
                if 'cpu2_temp' in all[name].keys():
                    c = all[name]['cpu2_temp'] 
                    c2 = int(c.split('.')[0])
                else:
                    c2 = c1
                haveC=1

            if 'front_temp' in all[name].keys():
                haveFR=1
                if 'rear_temp' in all[name].keys():
                    a1 = all[name]['rear_temp'] 
                    a2 = all[name]['front_temp'] 
                    a1 = int(a1.split('.')[0])
                    a2 = int(a2.split('.')[0])
                else:
                    a2 = all[name]['front_temp'] 
                    a2 = int(a2.split('.')[0])
                    a1 = a2

            if 'chassis_temp' in all[name].keys():
                ch = int(all[name]['chassis_temp'])
                haveCh=1

            if haveFR and haveC:
                self.temps[num] = ( c1, c2, a1, a2 )
            elif haveFR:
                self.temps[num] = ( a1, a2 )
            elif haveC and haveCh:
                self.temps[num] = ( c1, c2, ch, ch )
            elif haveC:
                self.temps[num] = ( c1, c2 )
            elif haveCh:
                self.temps[num] = ( ch, ch )

            # power in watts
            self.power[num] = None
            if 'node_power' in all[name].keys():   # node
                self.power[num] = int(all[name]['node_power'].split('.')[0])
            if 'cmm_power_in' in all[name].keys(): # blade chassis
                self.power[num] = int(all[name]['cmm_power_in'].split('.')[0])

            # fan speed
            self.fans[num] = None
            if 'fan_rms' in all[name].keys():
                self.fans[num] = int(all[name]['fan_rms'].split('.')[0])

class pbsNodes:
    def __init__( self ):
        if dummyRun:
            f = open( 'yo-pbsnodes', 'r' )
        else:
            f = os.popen( config.pbsPath + '/pbsnodes ' + config.pbsNodesCommand, 'r' )

        # "interesting nodes"
        self.pbsNodesList = []
        # the full set of nodes that PBS knows about
        self.pbsFullNodesList = []

        readingOk = 1
        while readingOk:
            try:
                l = f.readline()
            except:
                readingOk = 0

            # print 'line **', l, '**'

            if len(l) == 0:
                readingOk = 0
            else:
                # parse the PBS pbsnodes output
                # eg.   v199  job-exclusive  np =  8  properties = onlydistjobs,draining-2010/03/22-09:00:00  jobfs_root = /jobfs/live  numa_nodes =  2
                l = string.split( l )
                node = l[0]
                status = string.split( l[1], ',' )
                #print 'l', l
                try:
                    cores = int(l[4])
                except:
                    cores = None
                try:
                    properties = string.split( l[7], ',' )
                except:
                    properties = []
                #print 'node', node, 'status', status, 'properties', properties, 'cores', cores

                j = []
                if len(status) != 1 or status[0] not in ( 'free', 'job-exclusive' ):
                    j.extend( status )

                k = []
                k.extend(status)

                # append any draining properties to the node status
                for p in properties:
                    if p[:8] == 'draining':
                        j.extend( [ p ] )
                        k.extend( [ p ] )

                # append any HW_ properties to the node status
                for p in properties:
                    if p[:3] == 'HW_' or p[:3] == 'SW_':
                        j.extend( [ p ] )
                        k.extend( [ p ] )
                #print 'node', node, 'j', j

                if len(j):
                    self.pbsNodesList.append( ( node, j, cores ) )

                if len(k):
                    self.pbsFullNodesList.append( ( node, k, cores ) )

        f.close()

    def getNodesList( self ):
        return self.pbsNodesList

    def getFullNodesList( self ):
        return self.pbsFullNodesList

class pbsJobs:
    def __init__( self, cmd=None, saveDict=0 ):
        """read and parse qstat -f, or (if given args) one job's worth of qstat -f output"""

        if dummyRun:
            f = open( 'yo-qstat-f', 'r' )
        else:
            bufsize = 1024*1024
            if cmd == None:
                f = os.popen( config.pbsPath + '/qstat -f', 'r', bufsize )
            else:
                f = os.popen( cmd, 'r', bufsize )

        ll = f.readlines()
        self.error = f.close()

        self.jobs = []  # a list of jobs, each job is a dict of the fields
        self.queued = []
        self.tagId = -1

        lines = []
        for i in range(len(ll)):
            l = ll[i]
            # print 'line **', l, '**'

            if len(l) == 0:
                continue

            if ( len(l) > 4 and l[0:3] == 'Job' ) or ( i == len(ll)-1 ):   # start of a new job, or end of input
                if i == len(ll)-1:
                    if len(l) > 1:  # filter out blank lines (a CR)
                        lines.append( l )
                # save the prev job, if any
                if len(lines) > 0:
                    dict = self.processFields( lines )
                    if saveDict:
                        self.jobDict = dict
                    usefulInfo, state = self.processDict( dict )
                    if usefulInfo != None:
                        if state == 'run':
                            self.jobs.append( usefulInfo )
                        else:
                            self.queued.append( usefulInfo )
                lines = []

            if len(l) > 1:  # filter out blank lines (a CR)
                lines.append( l )

    def processLine( self, l, delim ):
        l = string.split( l, delim, 1 )

        for i in range(len(l)):  # strip more whitespace
            l[i] = l[i].strip()                

        if len(l) != 2:
            print 'not 2 fields - weird', l
            sys.exit(1)

        return l

    def processFields( self, lines ):
        # all the lines for one PBS job
        # lots of lines of the format 'blah = blah'

        # we want this info:
        fields = [ 'Job', 'Job_Name', 'Job_Owner',
                   'resources_used.cput', 'resources_used.mem',
                   'resources_used.vmem', 'resources_used.walltime',
                   'job_state', 'exec_host', 'Resource_List.nodes',
                   'Resource_List.cput', 'Resource_List.walltime',
                   'Resource_List.other', 'comment', 'Account_Name' ]

        # loop over and merge multiple lines into one
        merged = []
        for l in lines:
            if len(l) == 0:
                continue

            # if the first char is a tab then this is a continuation line
            if l[0] == '\t':
                l = l.strip()
                merged[-1] += l
            else:
                l = l.strip()
                merged.append( l )

        lines = merged

        dict = {}
        delim = ':'  # first delim is ':' the rest are '='

        for l in lines:
            field = string.split( l )[0]
            if field in fields:  # we want to read this in...
                l = self.processLine( l, delim )
                dict[ l[0] ] = l[1] # ok, punch it into the dict

            delim = '='

        return dict

    def toBytes( self, mem ):
        """takes a string like '1234kb', strips off the kb (and permutations suffix) and return bytes"""

        i = 0
        while i < len(mem) and mem[i] in string.digits:
            i += 1

        num = mem[:i]
        suffix = mem[i:]
        # print 'mem', mem, 'num', num, 'suffix', suffix

        suffix = string.lower( suffix )
        mult = None
        if suffix == 'b':
            mult = 1
        elif suffix == 'kb':
            mult = 1024
        elif suffix == 'mb':
            mult = 1024*1024
        elif suffix == 'gb':
            mult = 1024*1024*1024

        if mult == None:
            return 0

        num = int( num )
        bytes = num*mult

        return bytes

    def printBytes( self, num ):
        """pretty-print bytes as kb/mb/whatever..."""
        
        thresh = 2
        if num > thresh*1024*1024*1024:
            return '%dG' % (num/(1024*1024*1024))
        elif num > thresh*1024*1024:
            return '%dM' % (num/(1024*1024))
        elif num > thresh*1024:
            return '%dK' % (num/1024)

        return '%d' % num

    def addLocalString( self, nodes ):
        """over-ride this if you want to add custom text to the mouse-over"""
        return None

    def processDict( self, dict ):
        # look at specific fields and reformat nicely

        line = []
        pbsInfo = {}

        # print 'dict is', dict

        nodes = []
        if dict[ 'job_state' ] not in ( 'Q', 'H', 'W', 'T' ):  # mostly ignore queued, held, waiting jobs

            # 'E' 'R' and 'S' jobs -->

            if 'exec_host' in dict.keys():
                l = dict[ 'exec_host' ]
                l = l.strip()
                nodes = string.split( l, '+' )
                trimNodes = []
                for n in nodes:   #     torque format ... tpb183.sunnyvale/1+tpb183.sunnyvale/0 ...
                                  #     anupbs format ... x1/cpus=0-3/mems=0+x2/cpus=0-3/mems=0 ...
                                  # new anupbs format ... v[1-2,9-12,17]/cpus=0-3/mems=0 ...
                    n = string.split( n, '/' )
                    nn = n[0]
                    nn = string.split( nn, '.' )[0]
                    if len(n) == 3 and len(n[1]) > 5 and n[1][0:5] == 'cpus=':  # anu pbs
                        if '[' in nn: # new anu format
                            nnn = nn.split('[')
                            pren = nnn[0]
                            nnn = nnn[1].split(']')[0]
                            #print 'nnn', nnn, parseCpuList( nnn )
                            nnn = parseCpuList( nnn )
                            for nn in nnn:
                                #print 'new', pren + str(nn)
                                c = string.split( n[1], '=' )[1]
                                # format 0-3,7-8,10,12
                                cpus = parseCpuList( c )
                                for i in cpus:
                                    trimNodes.append( pren + str(nn) )
                        else:
                            #print 'old', nn
                            c = string.split( n[1], '=' )[1]
                            # format 0-3,7-8,10,12
                            cpus = parseCpuList( c )
                            for i in cpus:
                                trimNodes.append( nn )
                    else:   # torque
                        trimNodes.append( nn )
                nodes = trimNodes

            line.append( 'Job ' + dict['Job Id'] )
            line.append( dict['Job_Name'] )
            line.append( dict[ 'job_state' ] )

        username = dict[ 'Job_Owner' ]
        username = string.split( username, '@' )[0]

        # nodes requests looks like 15:ppn=2  or  2:ppn=2:mem2g
        # or  1:ppn=1:mem2g+8:ppn=2  or  machine1:ppn=2+machine2:ppn=2
        reqNodes = 0
        cpus = 0
        req = string.split( dict[ 'Resource_List.nodes' ], '+' )  # split the parts of a multi-req
        for r in req:   # each part looks like eg. 1:ppn=1:mem2g
            rr = string.split( r, ':' )
            if rr[0][0] in string.digits:
                n = int(rr[0])    # first is num nodes
            else:
                n = 1             # or might be a machine name
            reqNodes += n

            # look for the ppn=
            found = 0
            for rrr in rr[1:]:
                f = string.split( rrr, '=' )
                if f[0] == 'ppn':
                    found = 1
                    cpus += n*int(f[1])
            if not found:  # they didn't put a ppn=, so the machine assumes ppn=1
                cpus += n

        ## sanity check:
        ### rjh - this fails when suspended jobs are present... disable for now
        #if 'exec_host' in dict.keys():
        #    if cpus != len(nodes):
        #        print 'bugger - cpus', cpus, '!= len(nodes)', len(nodes)
        #        print 'dict', dict
        #        sys.exit(1)


        state = dict[ 'job_state' ]

        # the above fails when 12:ppn=1 is actually stacked onto 3 nodes with 4 cores each by the sheduler
        # so if it's in run state, ignore what was requested and look at what they actually got given: 
        if state not in ( 'Q', 'H', 'W', 'T' ):
            cpus = len(nodes)
            # if qstat isn't giving us sorted nodes, then we'll need a compare
            # function that strips off prefixes and just compares by node number,
            # otherwise sort() of x7,x8,x10 will yield x10,x7,x8 :-/
            #nodes.sort()
            reqNodes = len(uniq(nodes))

        line.append( 'Nodes %d' % reqNodes )
        line.append( 'Cpus %d' % cpus )

        wallLimit = timeToInt( dict[ 'Resource_List.walltime' ] )

        pbsInfo['state'] = state
        pbsInfo['jobId'] = dict[ 'Job Id' ]
        pbsInfo['jobName'] = dict[ 'Job_Name' ]
        pbsInfo['username'] = username
        pbsInfo['numNodes'] = reqNodes
        pbsInfo['numCpus'] = cpus
        pbsInfo['wallLimit'] = wallLimit
        pbsInfo['nodes'] = dict[ 'Resource_List.nodes' ]
        if 'comment' in dict.keys():
            pbsInfo['comment'] = dict[ 'comment' ]
        else:
            pbsInfo['comment'] = ''

        if state in ( 'Q', 'H', 'W', 'T' ):  # bale here and return minimal info...
            return ( int(reqNodes), cpus, state, username, dict[ 'Job Id' ], dict[ 'Job_Name' ], wallLimit, pbsInfo['comment'] ), 'queued'

        if 'resources_used.cput' in dict.keys() and 'resources_used.walltime' in dict.keys():
            cpuTime = dict[ 'resources_used.cput' ]
            wallTime = dict[ 'resources_used.walltime' ]

            # calculate program's parallel efficiency
            cput  = timeToInt( cpuTime )
            wallt = timeToInt( wallTime )
            # print cput, cpus, wallt
            if wallt > 0:
                eff = 100.0*(float(cput)/float(cpus))/float(wallt)
                #line.append( '%.3g%% loadBalanced' % eff )    # ~meaningless with comms in userspace like IB
                pbsInfo['eff'] = eff

            pbsInfo['cpuTime'] = cput
            pbsInfo['wallTime'] = wallt

        additional = self.addLocalString( nodes )
        if additional != None:
            line.append( additional )

        if 'resources_used.mem' in dict.keys() and 'resources_used.vmem' in dict.keys():
            mem = self.toBytes( dict[ 'resources_used.mem' ] )
            vm = self.toBytes( dict[ 'resources_used.vmem' ] )
            txt = 'Mem/VM '
            if int(reqNodes) > 1:
                txt += 'per node '
            txt += self.printBytes( mem/int(reqNodes) ) + '/' + self.printBytes( vm/int(reqNodes) )
            line.append( txt )

            pbsInfo['mem'] = mem
            pbsInfo['vmem'] = vm

        timeToGo = -1
        if 'resources_used.cput' in dict.keys() and 'resources_used.walltime' in dict.keys():
            #cpuTime = dict[ 'resources_used.cput' ]
            #line.append( 'Cpu Time ' + cpuTime + ' of ' + dict[ 'Resource_List.cput' ] )
            wallTime = dict[ 'resources_used.walltime' ]
            line.append( 'Wall Time ' + wallTime )

            # calculate remaining time
            timeToGo = wallLimit - timeToInt( wallTime )
            line.append( 'Remaining ' + intToTime( timeToGo ) )

            pbsInfo['timeToGo'] = timeToGo

        if 'Account_Name' in dict.keys():   # or Account_Name
            pbsInfo['group'] = dict['Account_Name']

        self.tagId += 1

        return ( username, nodes, line, self.tagId, timeToGo, dict[ 'Job Id' ], dict[ 'Job_Name' ], pbsInfo ), 'run'

    def getJobList( self ):
        return self.jobs

    def getQueuedList( self ):
        return self.queued


class maui:
    def __init__( self ):
        self.data = None
        self.bf = None
        self.res = None

    def mauiOk( self ):
        f = os.popen( config.mauiPath + '/showq', 'r' )
        ret = f.close()
        if ret != None:
            return 0
        return 1

    def readShowq( self ):
        openOk = 1
        if dummyRun:
            try:
                f = open( 'yo-showq', 'r' )
            except IOError, theError:
                openOk = 0
                print theError, '... continuing anyway'
        else:
            f = os.popen( config.mauiPath + '/showq', 'r' )

        # format:
        #
        # ACTIVE JOBS----------------------
        # JOBNAME            USERNAME      STATE  PROC   REMAINING            STARTTIME
        # ...
        # IDLE JOBS----------------------
        # JOBNAME            USERNAME      STATE  PROC     WCLIMIT            QUEUETIME
        # ...
        # BLOCKED JOBS----------------
        # JOBNAME            USERNAME      STATE  PROC     WCLIMIT            QUEUETIME
        # ...

        self.modes = [ 'active', 'idle', 'blocked' ]

        all = {}
        for m in self.modes:
            all[m] = []

        readingOk = 1
        modeNum = -1
        mode = None
        reading = 0
        while 1:
            try:
                l = f.readline()
            except:
                break

            # print 'line **' + string.strip(l) + '**'

            if len(l) == 0:
                break

            if l[0:7] == 'JOBNAME':
                # print 'found jobname'
                modeNum += 1
                if modeNum > len(self.modes)-1:
                    print 'ran out of modes reading showq data'
                    sys.exit(1)
                mode = self.modes[modeNum]
                reading = 1                # read the next (blank) line
                l = f.readline()
                if len(l) != 1:
                    print 'next line wasn\'t blank'
                    sys.exit(1)
                continue

            l = string.split(l)
            if len(l) < 6:
                reading = 0

            if not reading:
                continue

            if len(l) != 9:
                print 'unknown data line format', l
                sys.exit(1)

            if modeNum < 0:
                print 'impossible'
                sys.exit(1)

            jobId = int(l[0])
            name = l[1]
            state = l[2]
            cpus = int(l[3])
            time = l[4]
            date = l[5:]

            all[mode].append( {'jobId':jobId, 'name':name, 'state':state, 'cpus':cpus, 'time':time, 'date':date } )

        if openOk:
            f.close()

        self.data = all

    def readShowbf( self ):
        if dummyRun:
            f = open( 'yo-showbf', 'r' )
        else:
            f = os.popen( config.mauiPath + '/showbf', 'r' )

        # format:
        #
        # backfill window (user: 'root' group: 'root' partition: ALL) Tue Mar  8 16:15:01
        #
        # 16 procs available for      19:09:53
        # <6 procs available indefinitely>
        #

        self.bf = []

        try:
            l = f.readline()
            l = f.readline()
        except:
            return

        while 1:
            l = f.readline()
            # print 'line **' + string.strip(l) + '**'

            if len(l) == 0:
                break

            l = string.split(l)

            # cute, but not needed:
            #l = map( string.strip, l )

            if len(l) == 6 and l[4] == 'no' and l[5] == 'timelimit':
                # unlimited number of nodes:
                self.bf.append( { 'cpus':int(l[0]), 'time':None } )
                break

            if len(l) != 5:  # will be 3 if "no procs available"
                break

            # nodes for a specific amount of time:
            self.bf.append( { 'cpus':int(l[0]), 'time':l[4] } )

        f.close()

    def readShowres( self ):
        if dummyRun:
            f = open( 'yo-showres-n', 'r' )
        else:
            f = os.popen( config.mauiPath + '/showres -n', 'r' )

        # format:
        #   eh21.mckenzie       User             tom.27        N/A    1 -1:23:24:43    INFINITE  Sat Mar 11 14:54:33

        try:
            lines = f.readlines()
            f.close()
        except:
            return {}

        self.res = {}

        # first 4 lines are headers, last one is footer
        for i in range(4,len(lines)-1):
            l = lines[i]
            
            if len(l) == 0:  # end
                continue

            l = string.split(l)
            if len(l) != 11:  # 11 fields
                continue

            # cute, but not needed:
            #l = map( string.strip, l )

            # only look at user reservations
            if l[1] != 'User':
                continue

            # if the time field doesn't start with a negative number then it's
            # a future reservation, so don't count it here...
            if l[5][0] != '-':
                continue

            res = l[2]
            if res not in self.res.keys():
                self.res[res] = []

            self.res[res].append( l[0] )

    def dump( self ):
        if self.data == None:
            self.readShowq()
        for m in self.modes:
            print m
            for l in self.data[m]:
                print l

    def nextToRunNodes( self ):
        queued = self.getQueuedList()

        n = None
        state = 'Running'
        cache = {}
        for q in queued:
            c = q['cpus']
            state = q['state']

            if state != 'Idle':  # make sure it isn't a Held/Running job
                continue

            if c == 1:
                n = 1
            else:
                n = c/2
            break

        return n

    def getRunningList( self ):
        if self.data == None:
            self.readShowq()
        return self.data['active']

    def getQueuedList( self ):
        if self.data == None:
            self.readShowq()
        return self.data['idle']

    def getBlockedList( self ):
        if self.data == None:
            self.readShowq()
        return self.data['blocked']

    def getBackFillList(self):
        if self.bf == None:
            self.readShowbf()
        return self.bf

    def getRes(self):
        if self.res == None:
            self.readShowres()
        return self.res
