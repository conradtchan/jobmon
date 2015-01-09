#!/usr/bin/env python

# slurp up a bobData file, and pretty-print job stats
# usually run from epilogue

# eg. ave stats for all running >= 1 node jobs:
#    readJobStats.py /var/www/html/bobMon/data/bobData
# detailed stats for one job:
#    readJobStats.py /var/www/html/bobMon/data/bobData 67558.bob

# also one day should be able to work over the network. eg.
#    readJobStats.py [ --net [ http://www.vu.nci.org.au/cgi-bin/catBobData ] | --file /var/spool/bobMon/bobData ] [jobId]

import sys

if 0:
   import urllib2, StringIO, gzip
   opener = urllib2.build_opener()
   opener.addheaders = [('Accept-encoding', 'gzip')]
   req = opener.open('http://www.vu.nci.org.au/cgi-bin/catBobData')
   f = req.read()
   encoded = req.headers.get('Content-Encoding')
   if encoded == 'gzip':
      #print "Data is compressed using gzip. Length is: ", str(len(f))
      stream = StringIO.StringIO(f)
      gzipper = gzip.GzipFile(fileobj=stream)
      f = gzipper.read()
      #print "After uncompressing, length is: ", str(len(f))
   print f
   sys.exit(1)

prevRead = {}
prevParse = {}

def read( file, key ):
   if key not in prevRead.keys():  # first time
      f = open( file, 'r' )
      l = f.readlines()
      f.close()
      for i in l:
         if i[:len(key)+2] == '<' + key + '>':
            prevRead[key] = i
            return i
      prevRead[key] = ''
   return prevRead[key]

def parse( key, data, job=None ):
   # format is
   #   <averages>[ "jobId", [nodeinfo1,nodeInfo2, ..., aveNodeInfo] ]</averages>
   # nodeInfo format is
   #   ["node",[u,s,w,i,g,mem,bytes/s,"m",pkts/s,"k",swapping],[maxU,maxG,maxMem,maxBytes/s,"m",maxPkts/s,"g"],totMemOnNode,dodgNetworkStats]

   if key not in prevParse.keys():
      # pull off the XML crap
      data = data[len(key)+2:-(len(key)+4)]

      # eval that bad boy
      data = eval( data )

      # cache it
      prevParse[key] = data
   else:
      # return from cache
      data = prevParse[key]

   if job == None:   # return a list of jobs
      jobs = []
      for i in range(len(data)):
         jobs.append( data[i][0] )
      return jobs

   # return stats for the job
   for i in range(len(data)):
      #print i, data[i][0], 'num nodes', len(data[i][1])-1, 'data', data[i][1][-1]
      if job == data[i][0]:
         return data[i][1:]

   return []   # job not found


def intToTime( time ):
    """seconds to h:m:s string"""
    h = int(time/3600)
    m = int((time - 3600*h)/60)
    s = int(time - 3600*h - 60*m)
    timeStr = '%.2d:%.2d:%.2d' % ( h, m, s )
    return timeStr

def doNet( bw, bwUnit, pkts, pktsUnit ):
   if bwUnit == 'b':
      print '%5d b/s' % bw,
   else:
      print '%5.1f%sb/s' % ( bw, bwUnit ),

   if pktsUnit == 'b':
      print '%5d ' % pkts,
   else:
      print '%5.1f%s' % ( pkts, pktsUnit ),


def prettyPrint( n, showNode=1 ):
   node = n[0]
   stats = n[1]
   maxStats = n[2]
   totMem = n[3]
   dodgyNet = n[4]

   if dodgyNet:
      dodgy = '*'
   else:
      dodgy = ' '

   if showNode:
      print '%8s' % n[0],
   print '  %3d %3d %3d %3d     %3d    %4dmb' % ( stats[0], stats[1], stats[2], stats[3], stats[4], stats[5] ),
   doNet( stats[6], stats[7], stats[8], stats[9] )
   print '    %3d  %3d   %4dmb ' % ( maxStats[0], maxStats[1], maxStats[2] ),
   doNet( maxStats[3], maxStats[4], maxStats[5], maxStats[6] )
   if stats[10] > 0.01:
      print ' %5.1f%%' % (100.0*stats[10]),
   else:
      print '   -   ',
   if showNode:
      print dodgy,
   print

   return dodgyNet


def printHeader( firstColumn, padding='' ):
   print padding + '                                  ave   ave      ave      ave      max   max   max      max      max    time'
   print    firstColumn + '        ave % cpu        % gpu  memory bandwidth packets   %user %gpu  memory bandwidth packets  spent'
   print padding + '          user,sys,wait_io,idle                          /sec     cpu                           /sec   swapping'
   print padding + '--------  -----------------------------------------------------   ----------------------------------------------'


def doJob():
   if len(sys.argv) != 3:  # only look for a specific job
      return

   jobs = read( sys.argv[1], 'jobs' )
   if len(jobs) == 0:
      return

   j = sys.argv[2]
   a = parse( 'jobs', jobs, j )

   if len(a) == 0:
      return

   # a 'jobs' entry looks like:
   #   username, group, [nodelist, ...], [line, ...], [max mem, max vm, cpus, nodes, cpuTime, wallTime, wallLimit, eff, state, nodes line]
   #print 'a', a, 'len(a)', len(a)

   pbsData = a[4]
   cpus = pbsData[2]
   nodes = pbsData[3]
   #print 'pbsData', pbsData, 'len(pbsData)', len(pbsData)

   print
   print 'PBS Resources Requested:'
   print
   print '%28s = %s' % ( 'Nodes Line', pbsData[9] )
   print '%28s = %d' % ( 'Nodes', nodes )
   print '%28s = %d' % ( 'Cpus', cpus )
   print '%28s = %s (h:m:s)' % ( 'Wall Time', intToTime(pbsData[6]) )

   print
   print 'PBS Resources Used:'
   print
   print '%28s = %s (h:m:s)' % ( 'Wall Time', intToTime(pbsData[5]) )
   print '%28s = %s (h:m:s)' % ( 'Total Cpu Time', intToTime(pbsData[4]) )
   print '%28s = %s (h:m:s)' % ( 'Cpu Time per Process', intToTime(int(float(pbsData[4])/float(cpus) + 0.5)) )
   print
   print '%28s = %.1f%% (cpu time used/wall time used)' % ( 'Job Efficiency', pbsData[7] )
   print
   print '%28s = %.1fmb' % ( 'Memory per Process', pbsData[0]/cpus )
   print '%28s = %.1fmb' % ( 'Virtual Memory per Process', pbsData[1]/cpus )
   if cpus > 1 and cpus == 2*nodes:
      print '%28s = %.1fmb' % ( 'Memory per Node', pbsData[0]/nodes )
      print '%28s = %.1fmb' % ( 'Virtual Memory per Node', pbsData[1]/nodes )


def doAve():
   ave = read( sys.argv[1], 'averages' )
   if len(ave) == 0:
      return

   dodgyNet = 0

   if len(sys.argv) == 3:
      j = sys.argv[2]
      a = parse( 'averages', ave, j )
      if len(a) == 0:
         return
      a = a[0]  # only one field

      print
      print 'Node Resources Used:'

      printHeader( '  node ' )
      for i in a:
         if i[0] == 'ave':
            if len(a) > 2:  # don't print all-node averages for 1 node jobs
               i[0] = 'ave over'
               print '--------  ----------------------------------------------   -----------------------------------------'
               dodgyNet |= prettyPrint( i )
               print 'all nodes'
         else:
            dodgyNet |= prettyPrint( i )

      if dodgyNet:
         if len(a) <= 2:
            print
         print '                       * indicates that network statistics may be skewed by routed traffic'
   else:
      jobList = parse( 'averages', ave )

      printHeader( '    job  ', '  ' )
      for j in jobList:
         a = parse( 'averages', ave, j )
         a = a[0]  # only one field
         #print j, a[-1]
         print j[:11],
         prettyPrint( a[-1], showNode=0 )


if __name__ == '__main__':
   if len(sys.argv) < 2:
      sys.exit(0)

   doJob()
   print
   doAve()
   sys.exit(0)
