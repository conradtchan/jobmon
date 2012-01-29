#!/usr/bin/env python

import os, sys, time, socket

gmetric = '/usr/bin/gmetric'
gatherTime = 60
host='vu-pbs'

first=1

ipCache = {}

def getIp(host):
   try:
      ip = ipCache[host]
   except:
      #print 'host', host, 'not in ipCache'
      try:
         ip = socket.gethostbyname(host)
         ipCache[host] = ip
      except:
         ip = None
   return ip

ip = getIp(host)
if ip == None:
   print 'cannot lookup', host
   sys.exit(1)
spoofStr = ip + ':' + host
#print 'spoofStr', spoofStr

# loop indefinitely reading pbs
while 1:
   if first:
      first = 0
   else:
      time.sleep(gatherTime)

   try:
      f = open( '/var/spool/bobMon/bobData', 'r' )
      for l in f.readlines():
         l = l.split('>')
         if not len(l):
            continue
         l0 = l[0]
         #print l0
         if len(l0) != 6 or l0[:6] != '<usage' or len(l) < 3:
            continue
         #print 'l0',l0
         l = l[1].split('[')[1]
         l = l.split(']')[0]
         l = l.split(',')
         #print 'l',l
         pbsRunning = int(l[1])
         pbsAvail = int(l[3])
      f.close()
   except:
      s = 'logger "' + sys.argv[0] + ': harvest: Unexpected error'
      continue

   #print 'pbs running, avail', pbsRunning, pbsAvail
   #sys.exit(1)
   #continue
