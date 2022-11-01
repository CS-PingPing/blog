---
sidebar_position: 1
title: "[Rust] Hello World"
authors: DevSlem
tags: [rust, language]
last_update:
    author: DevSlem
---

이 포스트는 러스트 프로그래밍을 위한 기초적인 내용을 간단히 소개한다.

## Installation

러스트 프로그래밍을 위해 먼저 러스트를 설치한다. 설치 방법은 아래 문서를 참조한다.

> https://rinthel.github.io/rust-lang-book-ko/ch01-01-installation.html

## Cargo

Cargo는 러스트의 빌드 시스템 및 패키지 매니저이다. 위 문서에 따라 러스트를 설치했다면 Cargo가 자동적으로 설치되어있을 것이다. 먼저, 터미널에 Cargo가 설치되어있는지 확인하기 위해 다음 명령어를 입력한다:

```
$ cargo --version
```

Cargo 버전이 정상적으로 나오면 된다.

### Cargo를 사용해 프로젝트 생성

아래 커맨드를 입력한다.

```
$ cargo new hello_cargo --bin
$ cd hello_cargo
```

`cargo new` 다음의 문자는 프로젝트 이름이며 `--bin`은 실행 가능 애플리케이션을 의미한다.

프로젝트 폵더는 아래와 같이 구성된다.

* src - 소스파일 폴더
* Cargo.toml - 패키지 및 의존성 관리

*/src/main.rs* 파일을 열면 아래와 같은 코드를 확인할 수 있다.

Filename: /src/main.rs
```rust
fn main() {
    println!("Hello, world!");
}
```

위에서 한가지 특이한 사실이 있는데 `println!`를 보자. 느낌표 `!`가 있음을 확인할 수 있는데 이는 러스트의 매크로를 의미한다. 만약  함수라면 느낌표 없이 `println`이어야 한다.

### Cargo 빌드 및 실행

빌드 커맨드를 입력한다:

```
$ cargo build
```

실행 커맨드를 입력한다:

```
$ ./target/debug/hello_cargo # or .\target\debug\hello_cargo.exe on Windows
```

`Hello, world!`가 정상적으로 출력되는지 확인한다. 빌드와 실행을 한번에 하기 위해서는 아래 커맨드를 입력한다:

```
$ cargo run
```

빌드가 가능한지 여부만 확인하고 싶다면 아래 커맨드를 입력한다:

```
$ cargo check
```

`cargo check`는 `cargo build`에 비해 훨씬 빠른데 그 이유는 실행파일을 생성하지 않기 때문이다. `cargo check`는 개발할 때 컴파일 가능 여부를 확인하기 위해 자주 쓰이니 꼭 알아두자

### 릴리즈 빌드

배포를 위한 빌드 커맨드는 아래와 같다.

```
cargo build --release
```

이 커맨드는 *target/debug* 대신 *target/release*에 실행파일을 생성한다.