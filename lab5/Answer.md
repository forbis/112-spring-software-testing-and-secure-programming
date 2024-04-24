# Answer

Name: 許彥彬
ID: 511558013

## Test Valgrind and ASan
### Environment
- valgrind: `valgrind-3.20.0`
  - `gcc -o <outfilename> <srcfilename>`
  - `valgrind <outfilename>`
- gcc: `13.2.0 (Debian 13.2.0-5)`
  - `gcc -fsanitize=address -Og -g -o <outfilename> <srcfilename>`
### Result
|                      | Valgrind | Asan |
| -------------------- | -------- | ---- |
| Heap out-of-bounds   |    V     |   V  |
| Stack out-of-bounds  |    X     |   V  |
| Global out-of-bounds |    X     |   V  |
| Use-after-free       |    V     |   V  |
| Use-after-return     |    X     |   V  |

### Heap out-of-bounds
#### Source code
```
#include <stdio.h>
#include <stdlib.h>


int main() {
    int *array = malloc(8 * sizeof(int));
    int x = array[8];
    array[8] = 0xff;
    free(array);
    
    return 0;
}
```
#### Valgrind Report
```
==19938== Memcheck, a memory error detector
==19938== Copyright (C) 2002-2022, and GNU GPL'd, by Julian Seward et al.
==19938== Using Valgrind-3.20.0 and LibVEX; rerun with -h for copyright info
==19938== Command: ./hoob_valgrind
==19938== 
==19938== Invalid read of size 4
==19938==    at 0x109163: main (in /home/forbis/NYCU/112-spring-software-testing-and-secure-programming/lab5/hoob_valgrind)
==19938==  Address 0x4a4e060 is 0 bytes after a block of size 32 alloc'd
==19938==    at 0x4840808: malloc (in /usr/libexec/valgrind/vgpreload_memcheck-amd64-linux.so)
==19938==    by 0x10915A: main (in /home/forbis/NYCU/112-spring-software-testing-and-secure-programming/lab5/hoob_valgrind)
==19938== 
==19938== Invalid write of size 4
==19938==    at 0x109171: main (in /home/forbis/NYCU/112-spring-software-testing-and-secure-programming/lab5/hoob_valgrind)
==19938==  Address 0x4a4e060 is 0 bytes after a block of size 32 alloc'd
==19938==    at 0x4840808: malloc (in /usr/libexec/valgrind/vgpreload_memcheck-amd64-linux.so)
==19938==    by 0x10915A: main (in /home/forbis/NYCU/112-spring-software-testing-and-secure-programming/lab5/hoob_valgrind)
==19938== 
==19938== 
==19938== HEAP SUMMARY:
==19938==     in use at exit: 0 bytes in 0 blocks
==19938==   total heap usage: 1 allocs, 1 frees, 32 bytes allocated
==19938== 
==19938== All heap blocks were freed -- no leaks are possible
==19938== 
==19938== For lists of detected and suppressed errors, rerun with: -s
==19938== ERROR SUMMARY: 2 errors from 2 contexts (suppressed: 0 from 0)
```
### ASan Report
```
=================================================================
==20819==ERROR: AddressSanitizer: heap-buffer-overflow on address 0x603000000060 at pc 0x558bd83461cb bp 0x7ffd7a955e50 sp 0x7ffd7a955e48
WRITE of size 4 at 0x603000000060 thread T0
    #0 0x558bd83461ca in main /home/forbis/NYCU/112-spring-software-testing-and-secure-programming/lab5/hoob.c:7
    #1 0x7fd8072456c9 in __libc_start_call_main ../sysdeps/nptl/libc_start_call_main.h:58
    #2 0x7fd807245784 in __libc_start_main_impl ../csu/libc-start.c:360
    #3 0x558bd83460b0 in _start (/home/forbis/NYCU/112-spring-software-testing-and-secure-programming/lab5/hoob_asan+0x10b0) (BuildId: 483f339f5c63e933295082fc3f26a7f4e2b19cb3)

0x603000000060 is located 0 bytes after 32-byte region [0x603000000040,0x603000000060)                                                                  
allocated by thread T0 here:                                                
    #0 0x7fd8074d85bf in __interceptor_malloc ../../../../src/libsanitizer/asan/asan_malloc_linux.cpp:69
    #1 0x558bd8346186 in main /home/forbis/NYCU/112-spring-software-testing-and-secure-programming/lab5/hoob.c:5

SUMMARY: AddressSanitizer: heap-buffer-overflow /home/forbis/NYCU/112-spring-software-testing-and-secure-programming/lab5/hoob.c:7 in main
Shadow bytes around the buggy address:
  0x602ffffffd80: 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00
  0x602ffffffe00: 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00
  0x602ffffffe80: 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00
  0x602fffffff00: 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00
  0x602fffffff80: 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00
=>0x603000000000: fa fa 00 00 00 fa fa fa 00 00 00 00[fa]fa fa fa
  0x603000000080: fa fa fa fa fa fa fa fa fa fa fa fa fa fa fa fa
  0x603000000100: fa fa fa fa fa fa fa fa fa fa fa fa fa fa fa fa
  0x603000000180: fa fa fa fa fa fa fa fa fa fa fa fa fa fa fa fa
  0x603000000200: fa fa fa fa fa fa fa fa fa fa fa fa fa fa fa fa
  0x603000000280: fa fa fa fa fa fa fa fa fa fa fa fa fa fa fa fa
Shadow byte legend (one shadow byte represents 8 application bytes):
  Addressable:           00
  Partially addressable: 01 02 03 04 05 06 07 
  Heap left redzone:       fa
  Freed heap region:       fd
  Stack left redzone:      f1
  Stack mid redzone:       f2
  Stack right redzone:     f3
  Stack after return:      f5
  Stack use after scope:   f8
  Global redzone:          f9
  Global init order:       f6
  Poisoned by user:        f7
  Container overflow:      fc
  Array cookie:            ac
  Intra object redzone:    bb
  ASan internal:           fe
  Left alloca redzone:     ca
  Right alloca redzone:    cb
==20819==ABORTING
```

### Stack out-of-bounds
#### Source code
```
#include <stdio.h>
#include <stdlib.h>


int main(){
    int array[8];
    int value = array[8];
    array[8] = 0xff;

    return 0;
}
```
#### Valgrind Report
```
==303082== Memcheck, a memory error detector
==303082== Copyright (C) 2002-2022, and GNU GPL'd, by Julian Seward et al.
==303082== Using Valgrind-3.20.0 and LibVEX; rerun with -h for copyright info
==303082== Command: ./soob_valgrind
==303082== 
==303082== 
==303082== HEAP SUMMARY:
==303082==     in use at exit: 0 bytes in 0 blocks
==303082==   total heap usage: 0 allocs, 0 frees, 0 bytes allocated
==303082== 
==303082== All heap blocks were freed -- no leaks are possible
==303082== 
==303082== For lists of detected and suppressed errors, rerun with: -s
==303082== ERROR SUMMARY: 0 errors from 0 contexts (suppressed: 0 from 0)
```
### ASan Report
```
=================================================================
==303435==ERROR: AddressSanitizer: stack-buffer-overflow on address 0x7fcf79600040 at pc 0x563eb6cb0225 bp 0x7fffc1c556e0 sp 0x7fffc1c556d8
WRITE of size 4 at 0x7fcf79600040 thread T0
    #0 0x563eb6cb0224 in main /home/forbis/NYCU/112-spring-software-testing-and-secure-programming/lab5/soob.c:6
    #1 0x7fcf7b6456c9 in __libc_start_call_main ../sysdeps/nptl/libc_start_call_main.h:58
    #2 0x7fcf7b645784 in __libc_start_main_impl ../csu/libc-start.c:360
    #3 0x563eb6cb00a0 in _start (/home/forbis/NYCU/112-spring-software-testing-and-secure-programming/lab5/soob_asan+0x10a0) (BuildId: 644b25c59bc98cc2f2d9be5933eece83a5470405)

Address 0x7fcf79600040 is located in stack of thread T0 at offset 64 in frame
    #0 0x563eb6cb0178 in main /home/forbis/NYCU/112-spring-software-testing-and-secure-programming/lab5/soob.c:3

  This frame has 1 object(s):
    [32, 64) 'array' (line 4) <== Memory access at offset 64 overflows this variable
HINT: this may be a false positive if your program uses some custom stack unwind mechanism, swapcontext or vfork
      (longjmp and C++ exceptions *are* supported)
SUMMARY: AddressSanitizer: stack-buffer-overflow /home/forbis/NYCU/112-spring-software-testing-and-secure-programming/lab5/soob.c:6 in main
Shadow bytes around the buggy address:
  0x7fcf795ffd80: 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00
  0x7fcf795ffe00: 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00
  0x7fcf795ffe80: 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00
  0x7fcf795fff00: 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00
  0x7fcf795fff80: 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00
=>0x7fcf79600000: f1 f1 f1 f1 00 00 00 00[f3]f3 f3 f3 00 00 00 00
  0x7fcf79600080: 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00
  0x7fcf79600100: 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00
  0x7fcf79600180: 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00
  0x7fcf79600200: 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00
  0x7fcf79600280: 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00
Shadow byte legend (one shadow byte represents 8 application bytes):
  Addressable:           00
  Partially addressable: 01 02 03 04 05 06 07 
  Heap left redzone:       fa
  Freed heap region:       fd
  Stack left redzone:      f1
  Stack mid redzone:       f2
  Stack right redzone:     f3
  Stack after return:      f5
  Stack use after scope:   f8
  Global redzone:          f9
  Global init order:       f6
  Poisoned by user:        f7
  Container overflow:      fc
  Array cookie:            ac
  Intra object redzone:    bb
  ASan internal:           fe
  Left alloca redzone:     ca
  Right alloca redzone:    cb
==303435==ABORTING                   
```

### Global out-of-bounds
#### Source code
```
#include <stdio.h>
#include <stdlib.h>


int array[8];

int main(){
    int value = array[8];
    array[8] = 0xff;

    return 0;
}
```
#### Valgrind Report
```
==304829== Memcheck, a memory error detector
==304829== Copyright (C) 2002-2022, and GNU GPL'd, by Julian Seward et al.
==304829== Using Valgrind-3.20.0 and LibVEX; rerun with -h for copyright info
==304829== Command: ./goob_valgrind
==304829== 
==304829== 
==304829== HEAP SUMMARY:
==304829==     in use at exit: 0 bytes in 0 blocks
==304829==   total heap usage: 0 allocs, 0 frees, 0 bytes allocated
==304829== 
==304829== All heap blocks were freed -- no leaks are possible
==304829== 
==304829== For lists of detected and suppressed errors, rerun with: -s
==304829== ERROR SUMMARY: 0 errors from 0 contexts (suppressed: 0 from 0)
```
### ASan Report
```
=================================================================
==305120==ERROR: AddressSanitizer: global-buffer-overflow on address 0x5647881a2100 at pc 0x56478819f1af bp 0x7ffd05e63280 sp 0x7ffd05e63278
WRITE of size 4 at 0x5647881a2100 thread T0
    #0 0x56478819f1ae in main /home/forbis/NYCU/112-spring-software-testing-and-secure-programming/lab5/goob.c:9
    #1 0x7fa9754456c9 in __libc_start_call_main ../sysdeps/nptl/libc_start_call_main.h:58
    #2 0x7fa975445784 in __libc_start_main_impl ../csu/libc-start.c:360
    #3 0x56478819f0b0 in _start (/home/forbis/NYCU/112-spring-software-testing-and-secure-programming/lab5/goob_asan+0x10b0) (BuildId: 124d71c8944ae42885a86068744874a683a97436)

0x5647881a2100 is located 0 bytes after global variable 'array' defined in 'goob.c:5:5' (0x5647881a20e0) of size 32
SUMMARY: AddressSanitizer: global-buffer-overflow /home/forbis/NYCU/112-spring-software-testing-and-secure-programming/lab5/goob.c:9 in main
Shadow bytes around the buggy address:
  0x5647881a1e80: 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00
  0x5647881a1f00: 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00
  0x5647881a1f80: 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00
  0x5647881a2000: 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00
  0x5647881a2080: f9 f9 f9 f9 f9 f9 f9 f9 00 00 00 00 00 00 00 00
=>0x5647881a2100:[f9]f9 f9 f9 00 00 00 00 00 00 00 00 00 00 00 00
  0x5647881a2180: 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00
  0x5647881a2200: 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00
  0x5647881a2280: 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00
  0x5647881a2300: 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00
  0x5647881a2380: 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00
Shadow byte legend (one shadow byte represents 8 application bytes):
  Addressable:           00
  Partially addressable: 01 02 03 04 05 06 07 
  Heap left redzone:       fa
  Freed heap region:       fd
  Stack left redzone:      f1
  Stack mid redzone:       f2
  Stack right redzone:     f3
  Stack after return:      f5
  Stack use after scope:   f8
  Global redzone:          f9
  Global init order:       f6
  Poisoned by user:        f7
  Container overflow:      fc
  Array cookie:            ac
  Intra object redzone:    bb
  ASan internal:           fe
  Left alloca redzone:     ca
  Right alloca redzone:    cb
==305120==ABORTING
```

### Use-after-free
#### Source code
```
#include <stdio.h>
#include <stdlib.h>


int main() {
    int *array = malloc(8 * sizeof(int));
    free(array);
    array[0] = 0xff;
    return 0;
}
```
#### Valgrind Report
```
==336234== Memcheck, a memory error detector
==336234== Copyright (C) 2002-2022, and GNU GPL'd, by Julian Seward et al.
==336234== Using Valgrind-3.20.0 and LibVEX; rerun with -h for copyright info
==336234== Command: ./myuaf_valgrind
==336234== 
==336234== Invalid write of size 4
==336234==    at 0x10916F: main (in /home/forbis/NYCU/112-spring-software-testing-and-secure-programming/lab5/myuaf_valgrind)
==336234==  Address 0x4a4e040 is 0 bytes inside a block of size 32 free'd
==336234==    at 0x48431EF: free (in /usr/libexec/valgrind/vgpreload_memcheck-amd64-linux.so)
==336234==    by 0x10916A: main (in /home/forbis/NYCU/112-spring-software-testing-and-secure-programming/lab5/myuaf_valgrind)
==336234==  Block was alloc'd at
==336234==    at 0x4840808: malloc (in /usr/libexec/valgrind/vgpreload_memcheck-amd64-linux.so)
==336234==    by 0x10915A: main (in /home/forbis/NYCU/112-spring-software-testing-and-secure-programming/lab5/myuaf_valgrind)
==336234== 
==336234== 
==336234== HEAP SUMMARY:
==336234==     in use at exit: 0 bytes in 0 blocks
==336234==   total heap usage: 1 allocs, 1 frees, 32 bytes allocated
==336234== 
==336234== All heap blocks were freed -- no leaks are possible
==336234== 
==336234== For lists of detected and suppressed errors, rerun with: -s
==336234== ERROR SUMMARY: 1 errors from 1 contexts (suppressed: 0 from 0)
```
### ASan Report
```
=================================================================
==336440==ERROR: AddressSanitizer: heap-use-after-free on address 0x603000000040 at pc 0x5614b17321c3 bp 0x7ffceb195680 sp 0x7ffceb195678
WRITE of size 4 at 0x603000000040 thread T0
    #0 0x5614b17321c2 in main /home/forbis/NYCU/112-spring-software-testing-and-secure-programming/lab5/myuaf.c:8
    #1 0x7f5ebe4456c9 in __libc_start_call_main ../sysdeps/nptl/libc_start_call_main.h:58
    #2 0x7f5ebe445784 in __libc_start_main_impl ../csu/libc-start.c:360
    #3 0x5614b17320b0 in _start (/home/forbis/NYCU/112-spring-software-testing-and-secure-programming/lab5/myuaf_asan+0x10b0) (BuildId: b815a2eb40db24c527ac59a069e2dd62a88f119e)

0x603000000040 is located 0 bytes inside of 32-byte region [0x603000000040,0x603000000060)                                                              
freed by thread T0 here:                                                    
    #0 0x7f5ebe6d7288 in __interceptor_free ../../../../src/libsanitizer/asan/asan_malloc_linux.cpp:52
    #1 0x5614b173218e in main /home/forbis/NYCU/112-spring-software-testing-and-secure-programming/lab5/myuaf.c:7

previously allocated by thread T0 here:
    #0 0x7f5ebe6d85bf in __interceptor_malloc ../../../../src/libsanitizer/asan/asan_malloc_linux.cpp:69
    #1 0x5614b1732183 in main /home/forbis/NYCU/112-spring-software-testing-and-secure-programming/lab5/myuaf.c:6

SUMMARY: AddressSanitizer: heap-use-after-free /home/forbis/NYCU/112-spring-software-testing-and-secure-programming/lab5/myuaf.c:8 in main
Shadow bytes around the buggy address:
  0x602ffffffd80: 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00
  0x602ffffffe00: 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00
  0x602ffffffe80: 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00
  0x602fffffff00: 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00
  0x602fffffff80: 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00
=>0x603000000000: fa fa 00 00 00 fa fa fa[fd]fd fd fd fa fa fa fa
  0x603000000080: fa fa fa fa fa fa fa fa fa fa fa fa fa fa fa fa
  0x603000000100: fa fa fa fa fa fa fa fa fa fa fa fa fa fa fa fa
  0x603000000180: fa fa fa fa fa fa fa fa fa fa fa fa fa fa fa fa
  0x603000000200: fa fa fa fa fa fa fa fa fa fa fa fa fa fa fa fa
  0x603000000280: fa fa fa fa fa fa fa fa fa fa fa fa fa fa fa fa
Shadow byte legend (one shadow byte represents 8 application bytes):
  Addressable:           00
  Partially addressable: 01 02 03 04 05 06 07 
  Heap left redzone:       fa
  Freed heap region:       fd
  Stack left redzone:      f1
  Stack mid redzone:       f2
  Stack right redzone:     f3
  Stack after return:      f5
  Stack use after scope:   f8
  Global redzone:          f9
  Global init order:       f6
  Poisoned by user:        f7
  Container overflow:      fc
  Array cookie:            ac
  Intra object redzone:    bb
  ASan internal:           fe
  Left alloca redzone:     ca
  Right alloca redzone:    cb
==336440==ABORTING
```

### Use-after-return
#### Source code
```
#include <stdio.h>
#include <stdlib.h>


int *array;

int* uar() {
    int tmp[8];
    array = tmp;
    return array;
}

int main() {
    int *array = uar();
    array[0] = 0xff;
    return 0;
}
```
#### Valgrind Report
```
==341394== Memcheck, a memory error detector
==341394== Copyright (C) 2002-2022, and GNU GPL'd, by Julian Seward et al.
==341394== Using Valgrind-3.20.0 and LibVEX; rerun with -h for copyright info
==341394== Command: ./uar_valgrind
==341394== 
==341394== 
==341394== HEAP SUMMARY:
==341394==     in use at exit: 0 bytes in 0 blocks
==341394==   total heap usage: 0 allocs, 0 frees, 0 bytes allocated
==341394== 
==341394== All heap blocks were freed -- no leaks are possible
==341394== 
==341394== For lists of detected and suppressed errors, rerun with: -s
==341394== ERROR SUMMARY: 0 errors from 0 contexts (suppressed: 0 from 0)
```
### ASan Report
```
=================================================================
==341637==ERROR: AddressSanitizer: stack-use-after-return on address 0x7fc4ef400020 at pc 0x55a966cf0288 bp 0x7ffecbef23b0 sp 0x7ffecbef23a8
WRITE of size 4 at 0x7fc4ef400020 thread T0
    #0 0x55a966cf0287 in main /home/forbis/NYCU/112-spring-software-testing-and-secure-programming/lab5/uar.c:15
    #1 0x7fc4f14456c9 in __libc_start_call_main ../sysdeps/nptl/libc_start_call_main.h:58
    #2 0x7fc4f1445784 in __libc_start_main_impl ../csu/libc-start.c:360
    #3 0x55a966cf00c0 in _start (/home/forbis/NYCU/112-spring-software-testing-and-secure-programming/lab5/uar_asan+0x10c0) (BuildId: c81a8dda451a16f8979833cb56c9adf9642ac9bb)

Address 0x7fc4ef400020 is located in stack of thread T0 at offset 32 in frame
    #0 0x55a966cf0198 in uar /home/forbis/NYCU/112-spring-software-testing-and-secure-programming/lab5/uar.c:7

  This frame has 1 object(s):
    [32, 64) 'tmp' (line 8) <== Memory access at offset 32 is inside this variable
HINT: this may be a false positive if your program uses some custom stack unwind mechanism, swapcontext or vfork
      (longjmp and C++ exceptions *are* supported)
SUMMARY: AddressSanitizer: stack-use-after-return /home/forbis/NYCU/112-spring-software-testing-and-secure-programming/lab5/uar.c:15 in main
Shadow bytes around the buggy address:
  0x7fc4ef3ffd80: 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00
  0x7fc4ef3ffe00: 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00
  0x7fc4ef3ffe80: 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00
  0x7fc4ef3fff00: 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00
  0x7fc4ef3fff80: 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00
=>0x7fc4ef400000: f5 f5 f5 f5[f5]f5 f5 f5 f5 f5 f5 f5 00 00 00 00
  0x7fc4ef400080: 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00
  0x7fc4ef400100: 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00
  0x7fc4ef400180: 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00
  0x7fc4ef400200: 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00
  0x7fc4ef400280: 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00
Shadow byte legend (one shadow byte represents 8 application bytes):
  Addressable:           00
  Partially addressable: 01 02 03 04 05 06 07 
  Heap left redzone:       fa
  Freed heap region:       fd
  Stack left redzone:      f1
  Stack mid redzone:       f2
  Stack right redzone:     f3
  Stack after return:      f5
  Stack use after scope:   f8
  Global redzone:          f9
  Global init order:       f6
  Poisoned by user:        f7
  Container overflow:      fc
  Array cookie:            ac
  Intra object redzone:    bb
  ASan internal:           fe
  Left alloca redzone:     ca
  Right alloca redzone:    cb
==341637==ABORTING
```

## ASan Out-of-bound Write bypass Redzone
### Source code
```
#include <stdio.h>
#include <stdlib.h>


int main(){
    int a[8];
    int b[8];
    a[16] = 0xff;
    return 0;
}
```
### Why
根據搜尋到的資料，redzone機制是會在原本變數分配的記憶體兩端各取一段記憶體加上防護以此偵測overflow，那以此例a、b皆為32bytes，a右側與b左側為同一塊redzone，為對齊記憶體排列及設計該段redzone為32bytes，故a[8]~a[15]為redzone，a[16] == b[0]。
