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

coresPerNode = 8

# filesystem limits that we want to flag as bad
meg = 1000000

high = {   # fs threshholds for [current, average, max]
   'single job' :
       { 'ops':[500,5000,20000],
        'read':[100*meg,100*meg,1000*meg],
       'write':[100*meg,100*meg,1000*meg] },
   'sum user' :
       { 'ops':[1000,5000,20000],
        'read':[1000*meg,1000*meg,1000*meg],
       'write':[1000*meg,1000*meg,1000*meg] },
  }

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
   # and max length of fields
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
         wt = hms(jobs[j]['walltime'])
         if len(wt) > lenWalltime:
            lenWalltime = len(wt)

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
   print 'usr proj' + ' '*(lenKey - len('usr proj')) + gap + 'jobid' + ' '*(lenJobId - len('jobid')) + gap + 'name' + ' '*(lenJobName - len('name')) + gap + 'cores ' + gap + 'walltime' + ' '*(lenWalltime-len('walltime')) + gap + 'flagged' # , w,h # debug

   lines = 0
   end = 0
   for num, k in cnt:
      first = 1
      for j in ul[k]:
         if end or lines > h-3:
            end = 1
            continue
         if first:
            up = k[0] + gap + k[1]
            printstr = str(up) + ' '*(lenKey - len(up))
         else:
            printstr = ' '*lenKey
         n = jobs[j]['data'][4][1]
         if jobs[j]['walltime'] == None:
            wt = '-'
         else:
            wt = hms(jobs[j]['walltime'])
         printstr += gap + jobs[j]['jobid'] + ' '*(lenJobId-len(jobs[j]['jobid']))
         printstr += gap + str(n) + ' '*(lenJobName - len(n))
         printstr += gap + '%5d' % jobs[j]['cores']
         printstr += gap + ' '*(lenWalltime - len(wt)) + str(wt)
         printstr += gap + str(flagged[j])
         l = (1 + (len(printstr)-1)/w) # handle wrapped lines
         if lines+l > h-3:
            end = 1
            continue
         print printstr
         first = 0
         lines += l
   if lines <= h-3:
      print '\n'*(h-3-lines)


def displayUser(flagged, grouped):
   # find users with the most flagged cores
   cnt = []
   lenUser = len('usr')
   lenCores = len('cores')
   for u in flagged.keys():
      n = grouped[u]['cores']
      if len(u) > lenUser:
         lenUser = len(u)
      if len(str(n)) > lenCores:
         lenCores = len(str(n))
      cnt.append((n, u))
   cnt.sort()
   cnt.reverse()
   #print 'cnt', cnt

   w, h = terminal_size()
   #print 'w,h', w,h

   # clear the screen - fully dodgy method...
   print chr(27) + '[2J'

   # print title bar
   print 'usr' + ' '*(lenUser - len('usr')) + gap + 'cores' + ' '*(lenCores - len('cores')) + gap + 'flagged'

   lines = 0
   end = 0
   for n, u in cnt:
      if end or lines > h-3:
         end = 1
         continue
      nn = str(n)
      printstr = str(u) + ' '*(lenUser - len(u)) + gap + ' '*(lenCores - len(nn)) + nn + gap + str(flagged[u])
      l = (1 + (len(printstr)-1)/w) # handle wrapped lines
      if lines+l > h-3:
         end = 1
         continue
      print printstr
      lines += l
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


def flagByFs(fs, mode):
   ret = []
   for f in fs.keys():
      for m, cam in fs[f].iteritems():
         #print 'f', f, 'm', m, 'cam', cam
         assert(len(cam) == 3)
         h = 0
         for n in range(3):
            if cam[n] > high[mode][m][n]:  # check for over threshold
               h = 1
         if h:
            ret.append((f,(m,cam)))
   return ret


def readAndParse():
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
   return o


def dictByJobs(o):
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
   return jobs


def addFsData(a,b):
   assert(a.keys() == b.keys())
   #print 'a', a
   #print 'b', b
   c = {}
   for fs in a.keys(): # fs
      c[fs] = {}
      assert(a[fs].keys() == b[fs].keys())
      for k in a[fs].keys():  # read, write or ops
         av = a[fs][k]
         bv = b[fs][k]
         cam = []
         for n in range(3):
            cam.append(av[n]+bv[n])
         c[fs][k] = cam
   #print 'c', c
   return c

def fsToDict(fs):
   """handing fs data as a dict of dicts like in server code is just so much easier..."""
   fsd = {}
   for fsdata in fs:
      f = fsdata[0]
      s = fsdata[1:]
      #print 'fs', f, 'stats', s, 'len(s)', len(s)
      if f not in fsd.keys():
         fsd[f] = {}
      # disk stats are in pairs
      for k in range(len(s)):
         m = s[k][0]    # ops | read | write
         cam = s[k][1]  # [ current, ave, max ]
         #print 'm', m, 'cam', cam
         assert(len(cam) == 3)
         if m not in fsd[f].keys():
            fsd[f][m] = cam
   return fsd

def flag(o, jobs, mode):
   flagged = {}
   grouped = {}
   a = o['averages']

   # loop over jobs
   for i in a:
      assert(len(i) == 2)
      j = i[0]
      d = i[1]
      ave = d[-1]
      n = d[:-1]  # nodes ave data
      assert(len(ave) == 6)
      av = ave[1]  # ave over job life
      ma = ave[2]  # max over job life
      maxmemonnodes = ave[3]  # eg. all 24g nodes
      taintednet = ave[4]
      fs = ave[5]
      fs = fsToDict(fs)
      #print 'job', j, 'job ave', av, 'job max', ma, 'fs', fs, 'len(ave)', len(ave), 'ave', ave, 'len(nodes)', len(n), n

      # ignore jobs that have just started...
      if jobs[j]['walltime'] == None or jobs[j]['walltime'] < skipLowWalltime:
         #print 'skipping low walltime job', j, 'walltime', jobs[j]['walltime'], 'remaining', jobs[j]['remaining']
         continue

      # ignore non-running jobs
      if jobs[j]['state'] != 'R':
         continue

      # as most of our diagnostics are per node, we should also skip jobs
      # that use less than one node?
      #if jobs[j]['nodes'] == 1 and jobs[j]['cores'] < coresPerNode:
      #   continue

      if mode == 'single job':
         # find jobs that aren't using cores well
         h, s = flagByAve(av, jobs[j])
         if h:
            if j not in flagged.keys():
               flagged[j] = []
            flagged[j].extend((s))

         # find high fs jobs
         h = flagByFs(fs, mode)
         if len(h):
            #print 'high', j, 'fs', f, 'stats', s
            if j not in flagged.keys():
               flagged[j] = []
            flagged[j].append(h)

      elif mode == 'sum user':
         # sum fs stats for each user
         u = jobs[j]['data'][1]     # user

         if u not in grouped.keys():
            grouped[u] = {}
            grouped[u]['cores'] = 0

         if 'fs' not in grouped[u].keys():
            grouped[u]['fs'] = fs
         else:
            grouped[u]['fs'] = addFsData(grouped[u]['fs'], fs)

         coreList = jobs[j]['data'][3]
         grouped[u]['cores'] += len(coreList)

   if mode == 'single job':
      return flagged, {}

   for u in grouped.keys():
      h = flagByFs(grouped[u]['fs'], 'single job')
      if len(h):
         flagged[u] = h

   return flagged, grouped


def args():
   if len(sys.argv) > 1:
      if sys.argv[1] == '--sum-user':
         return 'sum user'
      elif sys.argv[1] == '--sum-project':
         return 'sum project'
   # default mode
   return 'single job'


if __name__ == '__main__':
   mode = args()

   while 1:
      o = readAndParse()
      jobs = dictByJobs(o)
      if mode == 'single job' or mode == 'sum user':
         flagged, grouped = flag(o, jobs, mode)
      else:
         print 'unknown mode', mode
         sys.exit(1)

      if mode == 'single job':
         display(flagged, jobs)
      elif mode == 'sum user':
         displayUser(flagged, grouped)

      time.sleep(sleep)
