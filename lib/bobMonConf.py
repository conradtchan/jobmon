#!/usr/bin/env python


class config:
   def __init__(self):
      import bobMonitorConf

      # import all items from bobMonitorConf into this class
      for f in bobMonitorConf.__dict__.keys():
         if f[:2] != '__':
            #print f
            self.__dict__[f] = bobMonitorConf.__dict__[f]

      # parse and expand bobMonitorConf items
      self._parseAllNodes()

   def _expandNodeExpr(self, ne):
      # eg.
      #    pbs -> [ pbs ]
      #    v[1-1492] -> [ v1, v2, ... ]
      #    x[003-007,100-200]-ib -> [ x003-ib, ... ]

      # prefix
      s = ne.split('[')
      if len(s) > 2:
         print 'format error in', ne
         sys.exit(1)
      pre = s[0]
      if len(pre) == 0:
         print 'there is no node prefix. this is illegal', ne
         sys.exit(1)
      if len(s) == 1:  # there is no node range
         return [ pre ]

      # suffix
      s = ne.split(']')
      if len(s) != 2:
         print 'too many ] in', ne
         sys.exit(1)
      suf = s[1]

      n = []

      # node range
      idx = s[0].split('[')[1]    # eg. 003-007,100-200  or 1-2,7-9
      for i in idx.split(','):   # eg. 003-007
         s = i.split('-')
         assert(len(s) == 2)
         i0 = s[0]
         i1 = s[1]
         # see if there is formatting involved
         formatLen = 0
         if len('%d' % int(i0)) != len(i0):
            formatLen = len(i0)
            assert(len(i0) == len(i1))
         for j in range(int(i0),int(i1)+1):
            if formatLen:
               f = '%%.%dd' % formatLen
               k = f % j
               n.append( pre + k + suf )
            else:
               n.append( pre + '%d' % j + suf )
      return n

   def _parseAllNodes(self):
      cn = []
      for f in self.computeNodes:
         cn.extend(self._expandNodeExpr(f))
      self.cn = cn

      hn = []
      for f in self.headNodes:
         hn.extend(self._expandNodeExpr(f))
      self.hn = hn

      ion = []
      for f in self.ioNodes:
         ion.extend(self._expandNodeExpr(f))
      self.ion = ion

      # non-backend nodes = headNodes + ioNodes
      self.nben = hn[:]
      self.nben.extend(ion)

      shn = []
      for f in self.shelves:
         shn.extend(self._expandNodeExpr(f))
      self.shn = shn

      #print 'cn', self.cn
      #print 'hn', self.hn
      #print 'ion', self.ion
      #print 'nben', self.nben
      #print 'shn', self.shn

      # make a map from the array
      self.mm = {}
      key = None
      for i in range(0,len(self.metricMap),2):
         key = self.metricMap[i]  # eg. 'network'
         j = self.metricMap[i+1]  # eg. [ 'bytes_in', [ 'iconnect.kbin',  1024 ],  'bytes_out', [ 'iconnect.kbout', 1024 ] ]
         self.mm[key] = dict(zip(j[0::2], j[1::2]))

      #print 'mm', self.mm

if __name__ == "__main__":
   c = config()
   print 'c.mm', c.mm
