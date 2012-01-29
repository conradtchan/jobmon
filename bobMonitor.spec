Name: bobMonitor
Summary: bobMonitor AJAX cluster monitoring tool
Version: 0.91
Release: 1
Source: %{name}-%{version}.tar.gz
Vendor: Robin Humble
License: GPLv3+
Group: System Environment/Daemons
Provides: %{name}
URL: http://code.google.com/p/bob-monitor/
Requires: netpbm-progs, python, httpd, ganglia-gmond, pychart

%description
This package contains the bobMonitor AJAX cluster monitoring application
for PBS and ganglia based clusters.

%prep
%setup

%build
# nothing to do...

%install
ls

%clean

%files -f %{_builddir}/%{name}-%{version}/file.list
%defattr(-,root,root)
%{_mandir}/man7/bobMon.3.gz
%doc README
