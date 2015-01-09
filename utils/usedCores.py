#!/usr/bin/env python

import os, sys, time, socket
import gmetric

gatherTime = 60

# gmond to send data to
gmondHost = '192.168.55.13'  # g2 IPoIB
gmondPort = 8650
gmondProtocol = 'udp'   # udp or multicast

# spoof host
host = 'pbs'

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
      gm = gmetric.Gmetric( gmondHost, gmondPort, gmondProtocol )
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
         # expect
         #  ["pbs_running_cores",%d,"pbs_avail_cores",%d,"pbs_running_gpus",%d,"pbs_avail_gpus",%d]

         #print 'l0',l0
         l = l[1].split('[')[1]
         l = l.split(']')[0]
         l = l.split(',')
         #print 'l',l
         pbsRunningCores= int(l[1])
         pbsAvailCores = int(l[3])
         pbsRunningGpus = int(l[5])
         pbsAvailGpus = int(l[7])
      f.close()
   except:
      s = 'logger "' + sys.argv[0] + ': harvest: Unexpected error'
      continue

   #print 'pbs running, avail cores', pbsRunningCores, pbsAvailCores, 'gpus', pbsRunningGpus, pbsAvailGpus
   #sys.exit(1)
   #continue

   try:
      # spoofing
      gm.send( 'pbs_alloc_cores', '%d' % pbsRunningCores, 'uint32', 'CPUs', 'both', 60, 0, '', spoofStr )
      gm.send( 'pbs_avail_cores', '%d' % pbsAvailCores,   'uint32', 'CPUs', 'both', 60, 0, '', spoofStr )
      gm.send( 'pbs_alloc_gpus',  '%d' % pbsRunningGpus,  'uint32', 'GPUs', 'both', 60, 0, '', spoofStr )
      gm.send( 'pbs_avail_gpus',  '%d' % pbsAvailGpus,    'uint32', 'GPUs', 'both', 60, 0, '', spoofStr )
   except:
      s = 'logger "' + sys.argv[0] + ': feeding to gmetric: Unexpected error: ' + str(sys.exc_info()[0]) + '"'
      os.system(s)
      continue
