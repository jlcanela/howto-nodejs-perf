# Performance study of a simple NODEJS application

## Test ’hello world’ endpoint 

Single connection test with [httpstat](https://github.com/reorx/httpstat):
```
(howto-nodejs-perf) dev@localhost:~/dev/github.com/jlcanela/howto-nodejs-perf$ httpstat http://localhost:3000
Connected to 127.0.0.1:3000 from 127.0.0.1:35978

HTTP/1.1 200 OK
X-Powered-By: Express
Content-Type: text/html; charset=utf-8
Content-Length: 12
ETag: W/"c-Lve95gjOVATpfV8EL5X4nxwjKHE"
Date: Sat, 16 Jan 2021 17:10:01 GMT
Connection: keep-alive

Body stored in: /tmp/tmpn9a2mtuh

  DNS Lookup   TCP Connection   Server Processing   Content Transfer
[     4ms    |       0ms      |        1ms        |        0ms       ]
             |                |                   |                  |
    namelookup:4ms            |                   |                  |
                        connect:4ms               |                  |
                                      starttransfer:5ms              |
                                                                 total:5ms  
```

Parallel connection test with ab:
* 5303 req/s
* 3.017 [ms] (mean) for a single request

```
(howto-nodejs-perf) dev@localhost:~/dev/github.com/jlcanela/howto-nodejs-perf$ ab -n 16000 -c 16  http://localhost:3000/
[...]
Server Software:        
Server Hostname:        localhost
Server Port:            3000

Document Path:          /
Document Length:        12 bytes

Concurrency Level:      16
Time taken for tests:   3.017 seconds
Complete requests:      16000
Failed requests:        0
Total transferred:      3376000 bytes
HTML transferred:       192000 bytes
Requests per second:    5303.42 [#/sec] (mean)
Time per request:       3.017 [ms] (mean)
Time per request:       0.189 [ms] (mean, across all concurrent requests)
Transfer rate:          1092.80 [Kbytes/sec] received

Connection Times (ms)
              min  mean[+/-sd] median   max
Connect:        0    0   0.1      0       1
Processing:     0    3   0.6      3       8
Waiting:        0    2   0.6      2       7
Total:          1    3   0.5      3       8

Percentage of the requests served within a certain time (ms)
  50%      3
  66%      3
  75%      3
  80%      3
  90%      3
  95%      4
  98%      5
  99%      6
 100%      8 (longest request)
 ```

Parallel connection test with ab and keepalive option:
* 7048.39 [#/sec] (mean)
* 2.270 [ms] (mean) [ms] (mean) for a single request

```
(howto-nodejs-perf) dev@localhost:~/dev/github.com/jlcanela/howto-nodejs-perf$ ab -k -n 16000 -c 16  http://localhost:3000/
[...]
Server Software:        
Server Hostname:        localhost
Server Port:            3000

Document Path:          /
Document Length:        12 bytes

Concurrency Level:      16
Time taken for tests:   2.270 seconds
Complete requests:      16000
Failed requests:        0
Keep-Alive requests:    16000
Total transferred:      3456000 bytes
HTML transferred:       192000 bytes
Requests per second:    7048.39 [#/sec] (mean)
Time per request:       2.270 [ms] (mean)
Time per request:       0.142 [ms] (mean, across all concurrent requests)
Transfer rate:          1486.77 [Kbytes/sec] received

Connection Times (ms)
              min  mean[+/-sd] median   max
Connect:        0    0   0.0      0       0
Processing:     1    2   0.5      2       7
Waiting:        1    2   0.5      2       7
Total:          1    2   0.5      2       7

Percentage of the requests served within a certain time (ms)
  50%      2
  66%      2
  75%      2
  80%      2
  90%      2
  95%      3
  98%      5
  99%      5
 100%      7 (longest request)
```

## Test pg endpoint

When creating pg connection, mean request time is 14.672 [ms].

```
(howto-nodejs-perf) dev@localhost:~/dev/github.com/jlcanela/howto-nodejs-perf$ ab -n 1600 -c 16  http://localhost:3000/pg1
[...]
Server Software:        
Server Hostname:        localhost
Server Port:            3000

Document Path:          /pg1
Document Length:        12 bytes

Concurrency Level:      16
Time taken for tests:   1.467 seconds
Complete requests:      1600
Failed requests:        0
Total transferred:      337600 bytes
HTML transferred:       19200 bytes
Requests per second:    1090.48 [#/sec] (mean)
Time per request:       14.672 [ms] (mean)
Time per request:       0.917 [ms] (mean, across all concurrent requests)
Transfer rate:          224.70 [Kbytes/sec] received

Connection Times (ms)
              min  mean[+/-sd] median   max
Connect:        0    0   0.0      0       0
Processing:     8   15   2.0     14      28
Waiting:        7   13   1.9     12      26
Total:          8   15   2.0     14      28

Percentage of the requests served within a certain time (ms)
  50%     14
  66%     15
  75%     15
  80%     16
  90%     17
  95%     18
  98%     21
  99%     22
 100%     28 (longest request)
```

When using connection pool, 

```
(howto-nodejs-perf) dev@localhost:~/dev/github.com/jlcanela/howto-nodejs-perf$ ab -n 16000 -c 16  http://localhost:3000/pg2
[...]
Server Software:        
Server Hostname:        localhost
Server Port:            3000

Document Path:          /pg2
Document Length:        26 bytes

Concurrency Level:      16
Time taken for tests:   5.051 seconds
Complete requests:      16000
Failed requests:        0
Total transferred:      3728000 bytes
HTML transferred:       416000 bytes
Requests per second:    3167.72 [#/sec] (mean)
Time per request:       5.051 [ms] (mean)
Time per request:       0.316 [ms] (mean, across all concurrent requests)
Transfer rate:          720.78 [Kbytes/sec] received

Connection Times (ms)
              min  mean[+/-sd] median   max
Connect:        0    0   0.1      0       1
Processing:     3    5   1.0      5      15
Waiting:        1    3   0.9      3      12
Total:          3    5   1.0      5      15

Percentage of the requests served within a certain time (ms)
  50%      5
  66%      5
  75%      5
  80%      5
  90%      6
  95%      7
  98%      8
  99%      9
 100%     15 (longest request)
 ```

## Postgres

Start the postgres database:
```
docker-compose up
```

Connect to postgres database with command line:
(use password from database.env file)
```
docker-compose run database bash
```

For more details about how to setup postgres database: https://medium.com/analytics-vidhya/getting-started-with-postgresql-using-docker-compose-34d6b808c47c

