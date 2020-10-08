Originally forked from https://github.com/plaguedbypenguins/bobMonitor, but now rewritten from the ground up, with an emphasis on providing information to users.

# Installation

## Backend

Make the data directory where JSON output is written to
```
mkdir /var/spool/jobmon
```

Install the cgi-bin Python scripts
```
cp cgi-bin/* /var/www/cgi-bin/
```

Configure the backend using `backend/jobmon_config.py`

Install the backend
```
cp backend/* /usr/lib/jobmon
```

## Frontend

Configure the backend using `frontend/config.js`

Build the optimised production frontend
```
cd frontend
yarn build
```

Install the frontend
```
cp build/* /var/www/html/jobmon
```

# Running

Run `/usr/lib/jobmon/jobmon.py`, which generates gzip'd JSON at `/var/spool/jobmon`, which is read by the web app.
