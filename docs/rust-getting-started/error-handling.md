---
sidebar_position: 8
title: "[RUST] 에러 처리"
authors: hyunseung
tags: [rust, language]
last_update:
  author: hyunseung
---

# [RUST] 에러 처리

러스트에는 복구 가능한(recoverable)에러와 복구 불가능한(unrecoverable)에러가 존재한다. 이번 포스팅에선 이 두 가지 에러에 대해 살펴보자.

## panic!과 함께하는 복구 불가능한 에러

러스트는 `panic!`매크로를 가지고 있다. 이 매크로가 실행되면, 프로그램은 실패 메시지를 출력하고, 스택을 되감고 청소하고, 그 후 종료된다. 이런 일이 발생하는 가장 흔한 상황은 프로그래머가 이 에러를 어떻게 처리할지가 명확하지 않을 때이다.

### panic!에 응하여 스택을 되감거나 그만두기

기본적을 `panic!`이 발생하면 프로그램은 되감기(unwinding)를 시작하는데, 이는 러스트가 패닉을 마주친 각 함수로부터 스택을 거꾸로 훑어가면서 데이터를 제거한다는 뜻이다. 그러나 이 훑어가기 및 제거는 처리해야 할 일이 많다.  
다른 대안으로는 즉시 그만두기(abort)가 존재한다. 이는 데이터 제거 없이 프로그램을 끝내는 것이다. 프로그램이 사용하고 있던 메모리는 운영체에 의해 청소될 필요가 있을 것이다.

단순한 프로그램 내에서 `panic!`호출을 시도해 보자.

```rust
fn main() {
    panic!("crash and burn");
}
```

이 프로그램을 실행하면, 다음과 같은 결과가 나온다.

```
$ cargo run
   Compiling panic v0.1.0 (file:///projects/panic)
    Finished dev [unoptimized + debuginfo] target(s) in 0.25 secs
     Running `target/debug/panic`
thread 'main' panicked at 'crash and burn', src/main.rs:2
note: Run with `RUST_BACKTRACE=1` for a backtrace.
error: Process didn't exit successfully: `target/debug/panic` (exit code: 101)
```

우리가 주목해야 할 위치는 마지막 세줄이다.

첫 번째 줄은 패닉 메시지와 소스 코드에서 패닉이 발생한 지점을 보여준다. 위 예제의 경우, 가리키고 있는 줄은 우리 코드 부분이다. 이외에도 우리가 `panic!`호출이 우리가 호출한코드 내에 있는 경우도 존재한다. 즉, `panic!`을 이끌어낸 것이 우리 코드 라인이 아니라는 의미이다. 이러한 코드 부분을 발견하기 위해서는 백트레이스(backtrace)를 사용할 수 있다.

### panic! 백트레이스 사용하기

아래의 코드는 벡터 내의 요소를 인덱스로 접근 시도하는 코드이다.

```rust
fn main() {
    let v = vec![1, 2, 3];

    v[99];
}
```

벡터의 100번째 요소에 접근하기를 시도하고 있지만, 벡터는 오직 3개의 요소만 가지고 있다. **이러한 상황이면 러스트는 패닉을 일으킬 것이다.**

이러한 상황에서 C와 같은 다른 언어들은 우리가 원하는 것이 아닐지라도, 우리가 요청한 것을 정확히 주려고 시도할 것이다. 설령 그 메모리 영역이 벡터 소유가 아닐지라도 해당 위치의 값을 반환해 줄 것이다. 이를 **버퍼 오버리드(buffer overread)** 라고 부르며, 이는 보안 취약점을 발생시킬 수 있다.

따라서 러스트는 우리가 존재하지 않는 인덱스 상의 요소를 읽으려 시도한다면, 실행을 멈추고 계속하기를 거부할 것이다.

```
$ cargo run
   Compiling panic v0.1.0 (file:///projects/panic)
    Finished dev [unoptimized + debuginfo] target(s) in 0.27 secs
     Running `target/debug/panic`
thread 'main' panicked at 'index out of bounds: the len is 3 but the index is
100', /stable-dist-rustc/build/src/libcollections/vec.rs:1362
note: Run with `RUST_BACKTRACE=1` for a backtrace.
error: Process didn't exit successfully: `target/debug/panic` (exit code: 101)
```

위 처럼 에러가 발생하며, 에러에 대한 설명이 주어진다.

`RUST_BACKTRACE` 환경 변수를 설정하여 에러의 원인이 된 것이 무엇인지 정확하게 백트레이스할 수 있다고 말해주고 있다. 백트레이스란 어떤 지점에 도달하기까지 호출해온 모든 함수의 리스트를 의미한다.

예시 출력은 다음과 같다.

```
$ RUST_BACKTRACE=1 cargo run
    Finished dev [unoptimized + debuginfo] target(s) in 0.0 secs
     Running `target/debug/panic`
thread 'main' panicked at 'index out of bounds: the len is 3 but the index is 100', /stable-dist-rustc/build/src/libcollections/vec.rs:1392
stack backtrace:
   1:     0x560ed90ec04c - std::sys::imp::backtrace::tracing::imp::write::hf33ae72d0baa11ed
                        at /stable-dist-rustc/build/src/libstd/sys/unix/backtrace/tracing/gcc_s.rs:42
   2:     0x560ed90ee03e - std::panicking::default_hook::{{closure}}::h59672b733cc6a455
                        at /stable-dist-rustc/build/src/libstd/panicking.rs:351
   3:     0x560ed90edc44 - std::panicking::default_hook::h1670459d2f3f8843
                        at /stable-dist-rustc/build/src/libstd/panicking.rs:367
   4:     0x560ed90ee41b - std::panicking::rust_panic_with_hook::hcf0ddb069e7abcd7
                        at /stable-dist-rustc/build/src/libstd/panicking.rs:555
   5:     0x560ed90ee2b4 - std::panicking::begin_panic::hd6eb68e27bdf6140
                        at /stable-dist-rustc/build/src/libstd/panicking.rs:517
   6:     0x560ed90ee1d9 - std::panicking::begin_panic_fmt::abcd5965948b877f8
                        at /stable-dist-rustc/build/src/libstd/panicking.rs:501
   7:     0x560ed90ee167 - rust_begin_unwind
                        at /stable-dist-rustc/build/src/libstd/panicking.rs:477
   8:     0x560ed911401d - core::panicking::panic_fmt::hc0f6d7b2c300cdd9
                        at /stable-dist-rustc/build/src/libcore/panicking.rs:69
   9:     0x560ed9113fc8 - core::panicking::panic_bounds_check::h02a4af86d01b3e96
                        at /stable-dist-rustc/build/src/libcore/panicking.rs:56
  10:     0x560ed90e71c5 - <collections::vec::Vec<T> as core::ops::Index<usize>>::index::h98abcd4e2a74c41
                        at /stable-dist-rustc/build/src/libcollections/vec.rs:1392
  11:     0x560ed90e727a - panic::main::h5d6b77c20526bc35
                        at /home/you/projects/panic/src/main.rs:4
  12:     0x560ed90f5d6a - __rust_maybe_catch_panic
                        at /stable-dist-rustc/build/src/libpanic_unwind/lib.rs:98
  13:     0x560ed90ee926 - std::rt::lang_start::hd7c880a37a646e81
                        at /stable-dist-rustc/build/src/libstd/panicking.rs:436
                        at /stable-dist-rustc/build/src/libstd/panic.rs:361
                        at /stable-dist-rustc/build/src/libstd/rt.rs:57
  14:     0x560ed90e7302 - main
  15:     0x7f0d53f16400 - __libc_start_main
  16:     0x560ed90e6659 - _start
  17:                0x0 - <unknown>
```

위에서부터 시작하여 우리가 작성한 파일이 보일 때까지 읽으면 된다. 파일을 언급한 줄보다 위에 있는 줄들은 우리 코드가 호출한 코드이고, 밑의 코드는 우리의 코드가 호출한 코드다.

## Result와 함께하는 복구 가능한 에러

대부분의 에러는 프로그램을 전부 멈출만큼 심각하지 않기에, 우리는 `Result`를 이용하여 어느정도 해결 가능하다.

```rust
enum Result<T, E> {
    Ok(T),
    Err(E),
}
```

`T`는 성공한 경우에 `Ok` variant 내에 반환될 값의 타입을 나타낸다.  
`E`는 실패할 경우에 `Err` variant 내에 반환될 에러 타입을 나타낸다.

파일 열기를 시도하는 예제를 살펴보자.

```rust
use std::fs::File;

fn main() {
    let f = File::open("hello.txt");
}
```

`File::open`의 반환 타입은 `Result<T, E>`이다.  
`T`는 성공값의 타입인 `std::fs::File`로 채워져 있는데, 이것은 **파일 핸들** 이다. 에러에 사용되는 `E`의 타입은 `std::io::Error`이다.

이 반환 타입은 `File::open` 함수 호출에 성공했는지, 실패했는지를 알려줌과 동시에 파일 핸들이나 에러 정보 둘 중 하나를 우리에게 제공해준다. 바로 이러한 정보가 `Result` 열거형이 전달하는 것과 정확히 일치한다.

`File::open`이 성공한 경우, 변수 `f`가 가지게 될 값은 파일 핸들을 담고 있는 `Ok`인스턴스가 될 것이다. 실패한 경우, `f`의 값은 발생한 에러의 종류에 대한 정보를 갖고 있는 `Err`의 인스턴스가 될 것이다.

추가로 다음과 같이 `match`표현식을 이용하여 발생 가능한 `Result` variant들을 처리할 수 있다.

```rust
use std::fs::File;

fn main() {
    let f = File::open("hello.txt");

    let f = match f {
        Ok(file) => file,
        Err(error) => {
            panic!("There was a problem opening the file: {:?}", error)
        },
    };
}
```

위의 경우 `Ok`인 경우에는 내부의 `file`값을 반환하고, 만약 `Err`가 발생하면 `panic!`매크로를 호출하게끔 만들었다. 만약 현재 디렉토리 내에 hello.txt라는 이름의 파일이 없는데 코드를 실행하면 다음과 같은 출력이 나온다.

```
thread 'main' panicked at 'There was a problem opening the file: Error { repr:
Os { code: 2, message: "No such file or directory" } }', src/main.rs:9:12
```

### 서로 다른 에러에 대해 매칭하기

바로 위에서 봤던 코드는 `File::open`이 실패한 이유가 무엇이든 간에 `panic!`을 일으킬 것이다. 우리가 원하는 것은 실패 이유에 따라 다른 행동을 취하는 것이다.

예를 들어 파일이 없어 `File::open`이 실패한 것이라면, 새로운 파일을 만들어서 핸들을 반환한다고 하자. 만일 그 밖의 이유로 실패한 거라면, `panic!`일으키고자 한다. 해당 코드는 다음과 같다.

```rust
use std::fs::File;
use std::io::ErrorKind;

fn main() {
    let f = File::open("hello.txt");

    let f = match f {
        Ok(file) => file,
        Err(ref error) if error.kind() == ErrorKind::NotFound => {
            match File::create("hello.txt") {
                Ok(fc) => fc,
                Err(e) => {
                    panic!(
                        "Tried to create file but there was a problem: {:?}",
                        e
                    )
                },
            }
        },
        Err(error) => {
            panic!(
                "There was a problem opening the file: {:?}",
                error
            )
        },
    };
}
```

조건문 `if error.kind() == ErrorKind::NotFound`는 매치가드(match guard)라고 부른다. 이는 `match` 줄기 상에서 줄기의 패턴을 좀 더 정제해주는 추가 조건문이다.

패턴에는 `ref`를 사용하여 `error`가 가드 조건문으로 소유권 이동이 되지 않고 참조만 되게끔 해야 한다.

### 에러가 났을 때 패닉을 위한 숏컷: unwrap과 expect

`unwrap`이라 부르는 메소드는 `match`구문과 비슷한 구현을 한 숏컷 메소드이며 다음과 같이 사용한다.

```rust
use std::fs::File;

fn main() {
    let f = File::open("hello.txt").unwrap();
}
```

hello.txt 파일이 없는 상태에서 이 코드를 실행시키면, `unwrap`메소드에 의한 `panic!` 호출로부터의 에러 메시지를 보게 될 것이다.

```
thread 'main' panicked at 'called `Result::unwrap()` on an `Err` value: Error {
repr: Os { code: 2, message: "No such file or directory" } }',
/stable-dist-rustc/build/src/libcore/result.rs:868
```

또 다른 메소드인 `expect`는 `unwrap`과 유사한데, 우리가 `panic!` 에러 메시지를 선택할 수 있게 해준다.

```rust
use std::fs::File;

fn main() {
    let f = File::open("hello.txt").expect("Failed to open hello.txt");
}
```

에러 메시지는 다음과 같다.

```
thread 'main' panicked at 'Failed to open hello.txt: Error { repr: Os { code:
2, message: "No such file or directory" } }',
/stable-dist-rustc/build/src/libcore/result.rs:868
```

이 에러 메시지는 우리가 특정한 텍스트인 `Failed to open hello.txt`로 시작하기 때문에 에러를 찾기 조금 더 수월해질 것이다.

## panic!이냐, panic!이 아니냐, 그것디 문제로다

언제 `panic!`을 써야 하고, 언제 `Result`를 반환할지를 어떻게 결정해야 할까?

코드가 패닉을 일으킬 때는 복구할 방법이 없다. 그렇기에 우리는 코드를 호출하는 코드를 대신하여 현 상황은 복구 불가능한 것이라고 결정을 내리는 것이다.

_편의상 우리가 작성한 코드를 코드, 코드를 호출하는 코드를 사용자라고 하겠다._

우리가 `Result`값을 반환하는 선택을 한다면, 사용자에게 결단을 내려주기보다는 옵션을 제공하는 것이다. 그들은 적합한 방식으로 복구를 시도할 수 있고, 만약 불가능하다고 판단될 경우, `panic!`을 호출하여 우리가 만든 복구 가능한 에러(Result)를 복구 불가능한 상태로 바꿔놓을 수 있다.

**그러므로, 우리가 실패할지도 모르는 함수를 정의할 때는 `Result`를 반환하는 것이 기본적으로 좋은 선택이다.**
