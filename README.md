# INSTALLATION

## Backend

Make the data directory where JSON output is written to
```
mkdir /var/spool/bobMon2
```

Install the cgi-bin Python scripts
```
cp cgi-bin/* /var/www/cgi-bin/
```

Configure the backend using `backend/bobmon_config.py`

Install the backend
```
cp backend/* /usr/lib/bobMon2
```

## Frontend

Build the optimised production frontend
```
cd frontend
yarn build
```

Install the frontend
```
cp build/* /var/www/html/bobMon2
```

# RUNNING

Run `/usr/lib/bobMon2/bobmon.py`, which generates gzip'd JSON at `/var/spool/bobMon2`, which is read by the web app.