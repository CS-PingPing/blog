---
sidebar_position: 7
title: "[Rust] 일반적인 컬렉션"
authors: halang
tags: [rust, language]
last_update:
  author: halang
---

이 포스트에서는 러스트에서의 보편적인 프로그래밍 개념을 소개한다.

## 벡터 `Vec<T>`

- 같은 타입의 값만 저장 가능하다.
- 새 벡터 만들기

```rust
let v: Vec<i32> = Vec::new();
```

- 표준 라이브러리가 제공하는 Vec타입은 어떠한 종류의 값이라도 저장할 수 있다.
- 우리가 값을 집어넣으면 러스트는 우리가 저장하고자 하는 값의 타입을 유추할 수 있기 때문에, 타입 명시를 할 필요가 거의 없다.
- 초기값이 있는 벡터를 생성하는 메크로 `vec!`를 제공한다.

```rust
#![allow(unused)]
fn main() {
let v = vec![1, 2, 3];
}

```

벡터도 스코프 밖으로 벗어났을 때 해제된다. 백터가 드롭될 때 벡터의 내용물 또한 전부 드롭되는데, 이는 벡터가 갖고 있는 정수들이 모두 제거된다는 의미이다.

백터 내에 저장된 값을 참조하는 두 가지 방법이 있다.

```rust
#![allow(unused)]
fn main() {
let v = vec![1, 2, 3, 4, 5];

let third: &i32 = &v[2];
let third: Option<&i32> = v.get(2);
}

```

1. 인덱스 문법으로 벡터의 값에 접근하기

- &와 []를 이용하여 참조를 얻은 것
- 존재하지 않는 요소를 참조하면 panic!을 일으킨다.

2. get 메소드로 벡터의 값에 접근하기

- get 함수에 인덱스를 파라미터로 넘겨서 Option<&T>를 얻은 것
- 존재하지 않는 요소를 참조하면 패닉 없이 None이 반환된다.
- 따라서 Some(&element) 혹은 None에 대해 다루는 로직을 갖추어야 한다.

### 유효하지 않은 참조자

아래의 코드는 에러가 발생한다.

```rust
let mut v = vec![1, 2, 3, 4, 5];

let first = &v[0];

v.push(6);
```

새로운 요소를 추가하는 것은 새로 메모리를 할당해 예전 요소를 새 공간에 복사하는 일을 필요로 할 수 있다. 이는 벡터가 모든 요소들을 붙여서 저장할 공간이 충분치 않는 환경에서 일어날 수 있다.

이러한 경우, 첫번재 요소에 대한 참조자는 **할당이 해제된 메모리를 가리키게 된다.**

### 백터 내의 값들에 대한 반복처리

- 불변 참조자를 얻어 출력하는 방법

```rust
let v = vec![100, 32, 57];
for i in &v {
    println!("{}", i);
}
```

- 백터 내의 요소에 대한 가변 참조자로 반복하기

```rust
let mut v = vec![100, 32, 57];
for i in &mut v {
    *i += 50;
}
```

### 열거형을 사용해 여러 타입을 저장하기

- 열거형을 이용하면 같은 타입으로 취급되기 때문에 백터 내에 여러 타입의 값들을 저장할 수 있다.

```rust
enum SpreadsheetCell {
    Int(i32),
    Float(f64),
    Text(String),
}

let row = vec![
    SpreadsheetCell::Int(3),
    SpreadsheetCell::Text(String::from("blue")),
    SpreadsheetCell::Float(10.12),
];
```

- 컴파일 타임에 벡터 내에 저장될 타입이 어떤 것인지 알아야할 필요가 있는 이유는 각 요소를 저장하기 위해 얼만큼의 힙 메모리가 필요한지 알기 위함이다.

## 스트링

- 러스트의 핵심 언어 기능 내에서는 한가지 스트링 타입만 제공한다.
  - 스트링 슬라이스 (str)
- String 타입은 러스트의 표준 라이브러리를 통해 제공된다.
- 둘 모두 UTF-8로 인코딩 되어 있다.

### 새로운 스트링 생성하기

```rust
let mut s = String::new();
let s = String::from("initial contents"); // 스트링 리터럴로부터 String 생성
```

### 스트링 갱신하기

- `-` 연산자나 `format!` 매크로를 사용한다.

push_str과 push 이용하여 추가하기

```rust
let mut s = String::from("foo");
s.push_str("bar");

let mut s = String::from("lo");
s.push('l');
```

push_str 메소드는 스트링 슬라이스를 파라미터로 갖는다.
push 메소드는 한 개의 글자를 파라미터로 받아서 String에 추가한다.

연산자나 `format!` 매크로를 이용한 접합

```rust
let s1 = String::from("Hello, ");
let s2 = String::from("world!");
let s3 = s1 + &s2; // s1은 여기서 이동되어 더이상 쓸 수 없음을 유의하세요
```

add 메소드의 시그니처는 아래와 같다.

```rust
fn add(self, s: &str) -> String {
```

- &s2는 String 타입임에도 불구하고 add 호출에 사용할 수 있는 이유는 &String 인자가 &str로 강제될 수 있기 때문이다. (뒤에서 역참조 강제 배울 예정)
- 시그니처에서 add가 self의 소유권을 가져간다.
- s1의 소유권을 가져가 s2의 내용물의 복사본을 추가한 다음, 결과물의 소유권을 반환한다.

더 복잡한 스트링 조합을 위해 `format!` 매크로를 사용할 수 있다.

```rust
let s1 = String::from("tic");
let s2 = String::from("tac");
let s3 = String::from("toe");

let s = format!("{}-{}-{}", s1, s2, s3);
```

훨씬 읽기 쉽고, 어떠한 파라미터들의 소유권도 가져가지 않는다.

### 스트링 내부의 인덱싱

러스트에서 인덱싱 문법을 이용해 String 부분에 접근하려 하면 에러가 발생한다.

```rust
let s1 = String::from("hello");
let h = s1[0];
```

러스트 스트링은 인덱싱을 지원하지 않는다. 스트링의 바이트들 안의 인덱스는 유효한 유니코드 스칼라 값과 항상 대응되지는 않을 것이다.
