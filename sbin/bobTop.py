#!/usr/bin/env python

# grab bobData from file or cgi-bin and display a 'top' like display of bad jobs
# (c) Robin Humble 2012
# licensed under the GPL v3 or later

import sys, time, urllib2, gzip
from StringIO import StringIO

url = 'file:///home/rjh/git/bobMonitor/bobData'  # debug
url = 'http://www.vu.nci.org.au/cgi-bin/catBobData'

sleep = 10   # seconds between refreshes

# ignore jobs that are short and those that are just starting up
skipLowWalltime = 120   # time in seconds

# filesystem limits that we want to flag as bad
meg = 1000000
high = { 'ops':[500,1000,20000],   # threshholds for [current, average, max]
        'read':[100*meg,100*meg,1000*meg],
       'write':[100*meg,100*meg,1000*meg] }

# ignore all fields from the XML except these
wantToRead = ( 'api', 'jobs', 'averages' )

gap = ' '

def uniq( list ):
   l = []
   prev = None
   for i in list:
      if i != prev:
         l.append( i )
      prev = i
   return l

def hmsToSeconds(hms):
   t = hms.split(':')
   return int(t[0])*3600 + int(t[1])*60 + int(t[2])

def hms( t ):
   h = int(t/3600)
   m = int((t - h*3600)/60)
   s = t - h*3600 - m*60
   return '%2d:%02d:%02d' % ( h, m, s )

def terminal_size():
   import fcntl, termios, struct
   h, w, hp, wp = struct.unpack('HHHH', fcntl.ioctl(0, termios.TIOCGWINSZ, struct.pack('HHHH', 0, 0, 0, 0)))
   return w, h

def display(flagged, jobs):
   if 0:
      for j in flagged.keys():
         jd = jobs[j]['data']
         print j, 'user', jd[1], 'project', jd[2], 'summary', jd[4][1:], 'cores', jobs[j]['cores'], 'flagged', flagged[j]

   # sort into lists of flagged jobs by user
   lenJobName = len('name')
   lenJobId = len('job id')
   lenKey = len('usr proj')
   lenWalltime = len('walltime')
   ul = {}
   for j in flagged.keys():
      u = jobs[j]['data'][1]     # user
      p = jobs[j]['data'][2]     # project
      n = jobs[j]['data'][4][1]  # job name

      if len(n) > lenJobName:
         lenJobName = len(n)
      if len(jobs[j]['jobid']) > lenJobId:
         lenJobIb = len(jobs[j]['jobid'])
      if jobs[j]['walltime'] != None:
         w = hms(jobs[j]['walltime'])
         if len(w) > lenWalltime:
            lenWalltime = len(w)

      k = ( u, p )
      if k not in ul.keys():
         ul[k] = []
         if len(u + gap + p) > lenKey:
            lenKey = len(u + gap + p)
      ul[k].append(j)
   #print 'ul', ul, 'lenKey', lenKey

   # find users with the most flagged cores
   cnt = []
   for k in ul.keys():
      c = 0
      for j in ul[k]:
         c += jobs[j]['cores']
      cnt.append( ( c, k ) )
   cnt.sort()
   cnt.reverse()
   #print 'cnt', cnt

   w, h = terminal_size()
   #print 'w,h', w,h

   # clear the screen - fully dodgy method...
   print chr(27) + '[2J'

   # print title bar
   print 'usr proj' + ' '*(lenKey - len('usr proj')) + gap, 'jobid' + ' '*(lenJobId - len('jobid')), gap,
   print 'name' + ' '*(lenJobName - len('name')), gap, 'cores ', gap, 'walltime' + ' '*(lenWalltime-len('walltime')), gap, 'flagged' # , w,h # debug

   lines = 0
   for num, k in cnt:
      first = 1
      for j in ul[k]:
         if lines > h-3:
            continue
         if first:
            up = k[0] + gap + k[1]
            print up + ' '*(lenKey - len(up)),
         else:
            print ' '*lenKey,
         n = jobs[j]['data'][4][1]
         if jobs[j]['walltime'] == None:
            w = '-'
         else:
            w = hms(jobs[j]['walltime'])
         print gap + jobs[j]['jobid'] + ' '*(lenJobId-len(jobs[j]['jobid'])), gap, n + ' '*(lenJobName - len(n)), gap, '%5d' % jobs[j]['cores'], gap + ' '*(lenWalltime - len(w)), w, gap, flagged[j]
         first = 0
         lines += 1
   if lines <= h-3:
      print '\n'*(h-3-lines)

def flagByAve(av, j):
   flag = 0
   reason = []

   u,s,w,i,m,b0,b1,p0,p1,swapping = av

   if j['nodes'] > 1 and u < 90 or j['cores'] > 1 and u < 60 or j['cores'] == 1 and u < 30:
      flag = 1
      reason.append(('user', u))
   if s > 30:
      flag = 1
      reason.append(('sys', s))
   if w > 30:
      flag = 1
      reason.append(('wait', w))
   if swapping > 0.5:
      flag = 1
      reason.append(('swapping', swapping))

   return (flag, reason)


while 1:
   #ll = urllib2.urlopen(url).readlines()
   request = urllib2.Request(url=url)
   request.add_header('Accept-encoding', 'gzip')
   response = urllib2.urlopen(request)
   if response.info().get('Content-Encoding') == 'gzip':
      buf = StringIO(response.read())
      f = gzip.GzipFile(fileobj=buf)
      ll = f.readlines()
   else:
      ll = response.readlines()

   o = {}

   for l in ll:
       l = l.strip('<').split('>')
       #print 'l', l
       if len(l) != 3:  # skip header
          continue
       f = l[0]
       d = l[1].split('<')[0]
       #print 'f', f, 'd', d

       if f not in wantToRead:
          #print 'skipping', f
          continue

       if len(d):
          o[f] = eval(d)
   #print o.keys()

   # turn jobs into a dict with job number as key
   jobs = {}
   for i in o['jobs']:
      j = i[0]
      jobs[j] = {}
      jobs[j]['data'] = i
      coreList = jobs[j]['data'][3]
      jobs[j]['cores'] = len(coreList)
      jobs[j]['nodes'] = len(uniq(coreList))
      summary = jobs[j]['data'][4]
      #print 'summary', summary, len(summary)
      if len(summary) > 5:  # starting jobs have no mem or time fields
         walltime = hmsToSeconds(summary[6].split()[2])
         remaining = hmsToSeconds(summary[7].split()[1])
      else:
         walltime = None
         remaining = None
      jobs[j]['walltime'] = walltime
      jobs[j]['remaining'] = remaining
      jobs[j]['jobid'] = j.split('.')[0]
      jobs[j]['state'] = summary[2]
      #print 'job', j, 'cores', jobs[j]['cores'], 'nodes', jobs[j]['nodes'], 'walltime', walltime, 'remaining', remaining #, 'summary', summary #, 'data', jobs[j]['data'],

   a = o['averages']
   #print a
   flagged = {}
   byjob = {}
   for i in a:
      assert(len(i) == 2)
      j = i[0]
      d = i[1]
      byjob[j] = d
      ave = d[-1]
      n = d[:-1]  # nodes ave data
      assert(len(ave) == 6)
      av = ave[1]  # ave over job life
      ma = ave[2]  # max over job life
      maxmemonnodes = ave[3]  # eg. all 24g nodes
      taintednet = ave[4]
      fs = ave[5]
      #print 'job', j, 'job ave', av, 'job max', ma, 'fs', fs, 'len(ave)', len(ave), 'ave', ave, 'len(nodes)', len(n), n

      # ignore jobs that have just started...
      if jobs[j]['walltime'] == None or jobs[j]['walltime'] < skipLowWalltime:
         #print 'skipping low walltime job', j, 'walltime', jobs[j]['walltime'], 'remaining', jobs[j]['remaining']
         continue

      # ignore non-running jobs
      if jobs[j]['state'] != 'R':
         continue

      # find jobs that aren't happy
      h, s = flagByAve(av, jobs[j])
      if h:
         if j not in flagged.keys():
            flagged[j] = []
         flagged[j].extend((s))

      for fsdata in fs:
         f = fsdata[0]
         s = fsdata[1]
         #print 'fs', f, 'stats', s, 'len(s)', len(s)
         h = 0
         # disk stats are in pairs
         for k in range(len(s)/2):
            l = 2*k
            m = s[l]    # ops | read | write
            cam = s[l+1]  # [ current, ave, max ]
            #print 'm', m, 'cam', cam
            assert(len(cam) == 3)
            for n in range(3):
               if cam[n] > high[m][n]:  # check for over threshold
                  h = 1
         if h:
            #print 'high', j, 'fs', f, 'stats', s
            if j not in flagged.keys():
               flagged[j] = []
            flagged[j].append((f,s))

   # print out...
   display(flagged, jobs)

   time.sleep(sleep)
