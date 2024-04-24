Name: 許彥彬
ID: 511558013

### Fuzz Monitor
```
                       american fuzzy lop 2.57b (bmpcomp)

┌─ process timing ─────────────────────────────────────┬─ overall results ─────┐
│        run time : 0 days, 0 hrs, 4 min, 14 sec       │  cycles done : 0      │
│   last new path : 0 days, 0 hrs, 0 min, 47 sec       │  total paths : 24     │
│ last uniq crash : 0 days, 0 hrs, 4 min, 9 sec        │ uniq crashes : 1      │
│  last uniq hang : 0 days, 0 hrs, 2 min, 56 sec       │   uniq hangs : 5      │
├─ cycle progress ────────────────────┬─ map coverage ─┴───────────────────────┤
│  now processing : 15 (62.50%)       │    map density : 0.04% / 0.05%         │
│ paths timed out : 0 (0.00%)         │ count coverage : 2.72 bits/tuple       │
├─ stage progress ────────────────────┼─ findings in depth ────────────────────┤
│  now trying : arith 8/8             │ favored paths : 4 (16.67%)             │
│ stage execs : 1114/1397 (79.74%)    │  new edges on : 3 (12.50%)             │
│ total execs : 13.0k                 │ total crashes : 1395 (1 unique)        │
│  exec speed : 9.39/sec (zzzz...)    │  total tmouts : 837 (9 unique)         │
├─ fuzzing strategy yields ───────────┴───────────────┬─ path geometry ────────┤
│   bit flips : 4/576, 4/573, 2/567                   │    levels : 3          │
│  byte flips : 0/72, 0/69, 0/63                      │   pending : 22         │
│ arithmetics : 9/2682, 0/2059, 0/1356                │  pend fav : 4          │
│  known ints : 1/188, 3/730, 0/1172                  │ own finds : 23         │
│  dictionary : 0/0, 0/0, 0/0                         │  imported : n/a        │
│       havoc : 1/1536, 0/0                           │ stability : 100.00%    │
│        trim : 99.99%/45, 0.00%                      ├────────────────────────┘
└─────────────────────────────────────────────────────┘          [cpu003: 60%]
```

### Run Crash Result
```
size of Herder 54
AddressSanitizer:DEADLYSIGNAL
=================================================================
==429494==ERROR: AddressSanitizer: stack-overflow on address 0x7ffcbcf177e8 (pc 0x55e9bb123f8b bp 0x7ffcbe718540 sp 0x7ffcbcf177f0 T0)
    #0 0x55e9bb123f8b in main /home/forbis/NYCU/112-spring-software-testing-and-secure-programming/lab6/src/hw0302.c:46                                     
    #1 0x7fd8e3d666c9 in __libc_start_call_main ../sysdeps/nptl/libc_start_call_main.h:58
    #2 0x7fd8e3d66784 in __libc_start_main_impl ../csu/libc-start.c:360
    #3 0x55e9bb1249e0 in _start (/home/forbis/NYCU/112-spring-software-testing-and-secure-programming/lab6/src/bmpcomp+0x29e0) (BuildId: 93ca3e5211cd92f749689e1636cc55aa5ea081b9)

SUMMARY: AddressSanitizer: stack-overflow /home/forbis/NYCU/112-spring-software-testing-and-secure-programming/lab6/src/hw0302.c:46 in main
==429494==ABORTING
```
