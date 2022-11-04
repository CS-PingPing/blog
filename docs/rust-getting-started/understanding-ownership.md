---
sidebar_position: 2
title: "[Rust] 소유권 이해하기"
authors: DevSlem
tags: [rust, language]
last_update:
    author: DevSlem
---

이번 포스트에서는 러스트의 핵심 기능인 소유권 개념에 대해 알아본다.

## 소유권이란?

소유권 (Ownership)의 특징:

* 러스트의 핵심 기능
* 가비지 컬렉터 없이 메모리 안정성 보장
* 컴파일러가 체크할 규칙들로 구성된 소유권 시스템을 통해 메모리 관리

즉, 러스트는 런타임 비용을 발생시키지 않고 메모리를 안정적으로 관리할 수 있다.

## 기존 언어의 메모리 해제 방법

기존 언어의 메모리 해제 방법은 아래와 같다.

1. 가비지 컬렉터 (e.g., C#, Java)
2. 명시적 해제 (e.g., C, C++)

위 방식들은 각각의 문제를 안고 있으며 둘은 일종의 트레이드오프 관계이다.

### 가비지 컬렉터

* 런타임에 더 이상 참조되지 않는 객체를 끊임없이 찾아 메모리를 해제 - 성능 저하 발생

![](/img/garbage-collector.png)

### 명시적 해제

명시적 해제는 프로그래머가 직접 해제하기 때문에 여러 문제를 발생시킨다.

* 해제를 잊어버린? 메모리 낭비
* 너무 빨리 메모리를 반납하면? 유효하지 않은 변수 참조
* 반납을 2번 하면? 버그 발생 위험

아래는 C++에서 메모리 동적 할당과 명시적 해제에 대한 코드:

```cpp
int* ptr = new int; // dynamically allocate an integer
*ptr = 7; // put a value in that memory location
delete ptr; // return the memory to the operating system. ptr is now a dangling pointer.
```

## 메모리 스택과 힙 영역

메모리는 크게 스택과 힙 영역이 있다. (몰론, 이 외에 다른 영역이 더 있으나 여기서는 신경쓰지 않는다.)

메모리 구조에 대한 그림:

![](/img/memory-architecture.png)

### 스택

스택이 빠른 이유는 아래와 같은 특성 때문이다.

* Last In First Out (LIFO)
* 새로운 데이터를 넣기 위한 공간 or 데이터를 가져오기 위한 공간을 탐색할 필요 X - 항상 스택의 꼭대기 (top)이기 때문
* 스택에 담긴 모든 데이터는 **컴파일 타임에 결정되어 있는 고정된 크기**를 가져야 함!

### 힙

힙은 스택에 비해 느리지만 유연성을 가질 수 있다. 그 이유를 알아보자.

힙 영역에 메모리 할당 (allocating) 과정:

1. 데이터 저장 시 저장 가능한 공간이 있는지 확인
2. 운영체제가 빈 공간을 찾아 사용중이라고 표시 후 포인터 반환

힙 영역의 특성:

* **컴파일 타임에 크기가 결정되어 있지 않거나 크기가 변경될 수 있는 데이터**는 힙 영역에 저장
* 데이터 접근 속도가 스택 보다 느림 – 포인터가 가리킨 곳을 따라가야 함
* 힙 영역에서 붙어 있는 데이터들에 접근할 때가 서로 멀리 떨어져 있는 데이터들에 접근할 때 보다 더 빠름

## 소유권 규칙

이제 다시 러스트 언어로 돌아오자. 러스트의 핵심인 소유권 규칙에 대해 소개한다.

1. 러스트의 각각의 값은 해당값의 오너 (owner)라고 불리우는 변수를 갖고 있다.
2. 한번에 딱 하나의 오너만 존재할 수 있다.
3. 오너가 스코프 밖으로 벗어나는 때, 값은 버려진다 (dropped).

위 규칙은 반드시 명심해야한다. 위 규칙들이 러스트에 어떻게 적용되는지 알아볼 것이다.

## 변수와 스코프의 관계

변수는 스코프 범위 내에서만 유효하다. 스코프 범위는 중괄호 `{}`로 표시한다.

```rust
{                      // s는 유효하지 않습니다. 아직 선언이 안됐거든요.
    let s = "hello";   // s는 이 지점부터 유효합니다.

    // s를 가지고 뭔가 합니다.
}                      // 이 스코프는 이제 끝이므로, s는 더이상 유효하지 않습니다.
```

### String

러스트에서는 텍스트를 표현하는 두 가지 방법이 있다.

1. 스트링 리터럴 `&str` - 컴파일 타임에 결정 O, immutable
2. `String` - 컴파일 타임에 결정 X, mutable

아래는 스트링 리터럴로부터 `String`을 만들고 변경하는 코드:

```rust
let mut s = String::from("hello");

s.push_str(", world!"); // push_str()은 해당 스트링 리터럴을 String에 붙임

println!("{}", s);
```

### 러스트에서 메모리 할당과 반납

`String`은 컴파일 타임에 결정되지 않기 때문에 힙 영역에 데이터를 저장한다. 이는 아래 과정을 요구한다.

1. 런타임에 운영체제로부터 메모리를 요청
2. 사용이 끝나면 운영체제에게 메모리를 반납할 것이다.

기존 언어에서는 가비지 컬렉터나 명시적 해제를 통해 메모리를 반납한다. 그러나 러스트에서는 다르다!

러스트에서는 **변수가 소속되어 있는 스코프 밖으로 벗어나는 순간 자동으로 메모리를 반납**한다. 이는 러스트가 특수 함수 `drop()`을 자동으로 호출함으로써 수행된다. 

아래는 러스트의 메모리 반납 과정을 나타내는 샘플 코드:

```rust
{
    let s = String::from("hello"); // s는 여기서부터 유효합니다

    // s를 가지고 뭔가 합니다
}                                  // 이 스코프는 끝났고, s는 더 이상 
                                   // 유효하지 않습니다
```

## 이동 (move)이란?

일반적인 변수에 값을 할당하는 코드:

```rust
let x = 5;
let y = x;
```

위 코드는 변수 `y`에 변수 `x`의 값 `5`를 복사할 것이다. `String`도 위와 동일한 메커니즘으로 변수 `s1`의 텍스트를 변수 `s2`에 그대로 복사할까? NO!

`String` 대입 연산:

```rust
let s1 = String::from("hello");
let s2 = s1;
```

먼저, `String`에 대한 이해가 필요하다. `String`은 내부적으로 힙 영역에 동적 할당된다.

변수 `s1`의 메모리 구조:

![](https://rinthel.github.io/rust-lang-book-ko/img/trpl04-01.svg)

텍스트 `"hello"`는 가변 크기이기 때문에 힙 영역에, 포인터 변수 `ptr`과 길이 `len`, 용량 `capacity`는 정수형으로, 값은 변할 수 있지만 **메모리 크기는 변하지 않는다!** 즉, 메모리 크기는 컴파일 타임에 결정되기 때문에 스택 영역에 할당된다.

이제 변수 `s2`에 변수 `s1`을 대입했을 때의 변화를 살펴보자. 대입 연산 시 **오직 스택 영역에 할당된 값만 복사된다!** 즉, 변수 `s1`에 있던 `String`의 `ptr`, `len`, `capacity`만 복사되며 힙 영역에 있는 `"hello"` 텍스트는 그대로 유지된다.

변수 `s1`과 `s2`의 메모리 구조:

![](https://rinthel.github.io/rust-lang-book-ko/img/trpl04-02.svg)

이것이 우리가 기존에 알고 있던 *얕은 복사* 개념이다. 대표적으로 C++에서는 복사 생성자를 구현하지 않으면 위와 같이 동작한다. 그러나 얕은 복사는 치명적인 문제를 가지고 있다. 변수 `s1`과 `s2`가 동시에 같은 텍스트를 가리키는 시점에, 둘 중 한 변수의 메모리를 해제하면 어떨까? 혹은 두 변수의 메모리를 모두 해제하면 어떨까? 모두 버그의 위험이 되는 요소이다.

마찬가지로 러스트에 대해서도 위와 같이 얕은 복사가 수행된다고 가정할 때 아래와 같은 문제가 발생한다:

1. 러스트에서는 변수가 스코프를 벗어나면 자동으로 메모리 해제
2. 변수 `s1`과 `s2`가 같은 스코프 내에 있을 때 두 변수가 모두 메모리 해제를 시도
3. 두 변수는 힙 영역에 할당된 동일한 하나의 텍스트를 가리키고 있기 때문에 메모리를 두 번 해제하는 double free가 발생함

러스트에서는 위 문제를 소유권 (ownership)과 이동 (move)이라는 개념으로 해결한다. 변수 `s2`에 `s1`을 대입할 때 아래 과정이 발생한다:

1. 변수 `s1`은 `"hello"` 텍스트를 가지고 있는 `String` 데이터에 대한 소유권 보유
2. 변수 `s2`에 `s1`을 대입 시 `String` 데이터에 대한 소유권 이동
3. 변수 `s1`은 소유권을 잃어버렸으며 **더 이상 유효하지 않다고 간주!**
4. 변수 `s1`은 유효하지 않기 때문에 스코프 밖으로 벗어나도 변수 `s1`에 대해 아무런 일도 발생하지 않음
5. 소유권이 있는 유효한 변수 `s2`에 대해서만 drop됨

이 흐름은 반드시 기억해야 한다. 앞으로 더 이상 대입 연산은 단순한 복사가 아니다. **힙에 할당된 데이터에 대해서는 이동 연산**임을 명심한다.

변수 `s1`에서 `s2`로 이동 연산 발생 후의 메모리 구조:

![](https://rinthel.github.io/rust-lang-book-ko/img/trpl04-04.svg)

러스트 컴파일러는 소유권 이동이 발생해 더이상 유효하지 않은 변수에 대해 참조를 시도할 때 컴파일 에러를 발생시킨다.

유효하지 않은 변수 `s1` 참조 시도:

```rust
let s1 = String::from("hello");
let s2 = s1;

println!("{}, world!", s1);
```

유효하지 않은 변수 참조에 대한 컴파일 에러 메세지:

```
error[E0382]: use of moved value: `s1`
 --> src/main.rs:4:27
  |
3 |     let s2 = s1;
  |         -- value moved here
4 |     println!("{}, world!", s1);
  |                            ^^ value used here after move
  |
  = note: move occurs because `s1` has type `std::string::String`,
which does not implement the `Copy` trait
```

그러나 아래 코드는 에러가 발생하지 않는다.

```rust
let x = 5;
let y = x;

println!("x = {}, y = {}", x, y);
```

그 이유는 **스택에 할당된 데이터에 대해서는 이동 연산이 아닌 복사 연산이 발생**하기 때문이다. 정수형과 같이 컴파일 타임에 크기가 결정되는 타입은 스택에 저장되고 주로 크기가 작기 때문에 복사만으로 충분하다. 따라서 굳이 유효하지 않도록 해야 할 이유가 없다.

러스트에서는 복사와 이동 연산의 구분을 아래와 같은 방법을 통해 수행한다:

* 정수형과 같이 스택에 저장할 수 있는 타입은 `Copy` 트레잇을 구현
* 힙에 저장할 수 있는 타입은 `Drop` 트레잇을 구현

## 소유권과 함수

함수에 대해서도 소유권 법칙이 동일하게 적용된다.

### 매개변수로의 소유권 이동

함수에 변수를 매개변수 (parameter)의 인자 (argument)로 넘기는 것은 대입 연산과 마찬가지로 복사 or 이동 연산을 발생시킨다.

함수에서의 소유권 이동 샘플 코드:

```rust
fn main() {
    let s = String::from("hello");  // s가 스코프 안으로 들어왔습니다.

    takes_ownership(s);             // s의 값이 함수 안으로 이동했습니다...
                                    // ... 그리고 이제 더이상 유효하지 않습니다.
    let x = 5;                      // x가 스코프 안으로 들어왔습니다.

    makes_copy(x);                  // x가 함수 안으로 이동했습니다만,
                                    // i32는 Copy가 되므로, x를 이후에 계속
                                    // 사용해도 됩니다.

} // 여기서 x는 스코프 밖으로 나가고, s도 그 후 나갑니다. 하지만 s는 이미 이동되었으므로,
  // 별다른 일이 발생하지 않습니다.

fn takes_ownership(some_string: String) { // some_string이 스코프 안으로 들어왔습니다.
    println!("{}", some_string);
} // 여기서 some_string이 스코프 밖으로 벗어났고 `drop`이 호출됩니다. 메모리는
  // 해제되었습니다.

fn makes_copy(some_integer: i32) { // some_integer이 스코프 안으로 들어왔습니다.
    println!("{}", some_integer);
} // 여기서 some_integer가 스코프 밖으로 벗어났습니다. 별다른 일은 발생하지 않습니다.
```

### 반환 값과 소유권 이동

값의 반환 (return) 역시 소유권을 이동시킨다.

값의 반환에 따른 소유권 이동 샘플 코드:

```rust
fn main() {
    let s1 = gives_ownership();         // gives_ownership은 반환값을 s1에게
                                        // 이동시킵니다.

    let s2 = String::from("hello");     // s2가 스코프 안에 들어왔습니다.

    let s3 = takes_and_gives_back(s2);  // s2는 takes_and_gives_back 안으로
                                        // 이동되었고, 이 함수가 반환값을 s3으로도
                                        // 이동시켰습니다.

} // 여기서 s3는 스코프 밖으로 벗어났으며 drop이 호출됩니다. s2는 스코프 밖으로
  // 벗어났지만 이동되었으므로 아무 일도 일어나지 않습니다. s1은 스코프 밖으로
  // 벗어나서 drop이 호출됩니다.

fn gives_ownership() -> String {             // gives_ownership 함수가 반환 값을
                                             // 호출한 쪽으로 이동시킵니다.

    let some_string = String::from("hello"); // some_string이 스코프 안에 들어왔습니다.

    some_string                              // some_string이 반환되고, 호출한 쪽의
                                             // 함수로 이동됩니다.
}

// takes_and_gives_back 함수는 String을 하나 받아서 다른 하나를 반환합니다.
fn takes_and_gives_back(a_string: String) -> String { // a_string이 스코프
                                                      // 안으로 들어왔습니다.

    a_string  // a_string은 반환되고, 호출한 쪽의 함수로 이동됩니다.
}
```

여기서 중요한 사실을 짚고 넘어가자. `gives_ownership()` 함수에서 `some_string` 변수는 스코프를 벗어났음에도 왜 drop되지 않을까? 그 이유는 아래와 같다:

1. `some_string` 변수를 반환할 때 소유권 이동 발생
2. `some_string`은 소유권을 잃어버렸기 때문에 더 이상 유효하지 않음
3. `some_string` 변수는 유효하지 않기 때문에 아무 일도 발생하지 않음

즉, 소유권 이동에 따른 유효성 법칙이 함수의 값을 반환할 때도 동일하게 적용된다.

### 소유권 주고 받기

만약, 함수의 인자로 넘겨줘도 여전히 소유권을 유지하고 싶을 때는 변수의 소유권을 다시 반환하면 된다. 소유권 뿐만 아니라 계산된 추가적인 값을 반환하고 싶으면 튜플을 사용하면 된다.

소유권을 주고 다시 받는 코드:

```rust
fn main() {
    let s1 = String::from("hello");

    let (s2, len) = calculate_length(s1);

    println!("The length of '{}' is {}.", s2, len);
}

fn calculate_length(s: String) -> (String, usize) {
    let length = s.len(); // len()함수는 문자열의 길이를 반환합니다.

    (s, length)
}
```

하지만 위 과정은 너무 번거롭다. 소유권을 매번 주고 받아야 한다는 것은 지루하고 불편한 작업이다. 참조와 빌림이라는 개념을 통해 이 문제를 해결한다.

## 참조자와 빌림

러스트는 변수의 소유권을 넘기는 대신 객체에 대한 참조를 인자로 사용하는 참조자를 지원한다. 함수 매개변수로 참조자를 만드는 것을 빌림 (borrowing)이라고 한다. 참조자를 선언하는 키워드는 `&`이다. 참조자의 특징은 아래와 같다.

* 참조자는 소유권을 가지지 않음 - 스코프 밖으로 벗어나도 메모리를 반납하지 않음
* 변수가 기본적으로 불변인 것처럼 참조자도 불변임

참조에 대한 샘플 코드:

```rust
fn main() {
    let s1 = String::from("hello");

    let len = calculate_length(&s1);

    println!("The length of '{}' is {}.", s1, len);
}

fn calculate_length(s: &String) -> usize { // s는 String의 참조자입니다
    s.len()
} // 여기서 s는 스코프 밖으로 벗어났습니다. 하지만 가리키고 있는 값에 대한 소유권이 없기
  // 때문에, 아무런 일도 발생하지 않습니다.
```

`calculate_length()` 함수의 매개변수 `s`는 `String` 타입이 아닌 `&String` 참조자 타입이다.

`String s1`을 가리키고 있는 `&String s`에 대한 그림:

![](https://rinthel.github.io/rust-lang-book-ko/img/trpl04-05.svg)

## 가변 참조자

가변 참조자를 사용하면 변수를 변경 가능하다. 가변 참조자 키워드는 `&mut`이다.

```rust
fn main() {
    let mut s = String::from("hello");

    change(&mut s);
}

fn change(some_string: &mut String) {
    some_string.push_str(", world");
}
```

### 가변 참조자는 스코프 내에 반드시 1개만!

가변 참조자를 사용할 때 주의 사항이 있다. **가변 참조자는 스코프 내에 반드시 1개만 존재해야한다!!!** 따라서 아래 코드는 에러가 발생한다:

```rust
let mut s = String::from("hello");

let r1 = &mut s;
let r2 = &mut s;
```

복수의 가변 참조자에 대한 컴파일 에러 메세지:

```
error[E0499]: cannot borrow `s` as mutable more than once at a time
 --> borrow_twice.rs:5:19
  |
4 |     let r1 = &mut s;
  |                   - first mutable borrow occurs here
5 |     let r2 = &mut s;
  |                   ^ second mutable borrow occurs here
6 | }
  | - first borrow ends here
```

이러한 제한 조건은 **데이터 레이스 (data race)를 방지**할 수 있도록 해준다.

데이터 레이스란:

1. 두 개 이상의 포인터가 동시에 같은 데이터에 접근
2. 적어도 하나의 포인터는 데이터를 씀
3. 데이터에 접근하는데 동기화를 하는 어떠한 메커니즘도 없음

이는 동시성 프로그래밍에서 자주 발생하는 큰 문제이다. 데이터 레이스는 정의되지 않은 동작을 일으키고 추적도 어렵다. 러스트는 이 문제를 컴파일 시점에 차단한다!

아래 코드는 비슷하지만 유효한 동작이다:

```rust
let mut s = String::from("hello");

{
    let r1 = &mut s;

} // 여기서 r1은 스코프 밖으로 벗어났으므로, 우리는 아무 문제 없이 새로운 참조자를 만들 수 있습니다.

let r2 = &mut s;
```

### 불변 참조자가 있을 때는 가변 참조자는 불가능!

여러 개의 불변 참조자는 가능하다. 그러나 불변 참조자가 단 하나라도 있을 때는 가변 참조자를 만들 수 없다. 이 역시 러스트 컴파일러가 제한한다. 그 이유는 불변 참조자의 사용자는 사용 중인 동안 값이 바뀌리라 예상하지 않기 때문이다. 불변 참조자를 사용하고 있는데 값이 변한다면 이상할 것이다.

불변 참조자와 가변 참조자를 함께 만드려는 시도:

```rust
let mut s = String::from("hello");

let r1 = &s; // 문제 없음
let r2 = &s; // 문제 없음
let r3 = &mut s; // 큰 문제
```

불변 참조자와 가변 참조라를 함께 만들었을 때의 컴파일 에러 메세지:

```
error[E0502]: cannot borrow `s` as mutable because it is also borrowed as
immutable
 --> borrow_thrice.rs:6:19
  |
4 |     let r1 = &s; // 문제 없음
  |               - immutable borrow occurs here
5 |     let r2 = &s; // 문제 없음
6 |     let r3 = &mut s; // 큰 문제
  |                   ^ mutable borrow occurs here
7 | }
  | - immutable borrow ends here
```

## 댕글링 참조자

댕글링 포인터 (dangling pointer)란 어떤 메모리를 가리키는 포인터를 보존하는 동안, 그 메모리를 해제함으로써 다른 개체가 사용할 지도 모를 메모리를 참조하고 있는 포인터이다. 러스트에서는 컴파일러가 댕글링 참조자가 되지 않도록 보장한다!

댕글링 포인터를 만들려는 시도:

```rust
fn main() {
    let reference_to_nothing = dangle();
}

fn dangle() -> &String { // dangle은 String의 참조자를 반환합니다

    let s = String::from("hello"); // s는 새로운 String입니다

    &s // 우리는 String s의 참조자를 반환합니다.
} // 여기서 s는 스코프를 벗어나고 버려집니다. 이것의 메모리는 사라집니다.
  // 위험하군요!
```

댕글링 참조자에 대한 컴파일 에러 메세지:

```
error[E0106]: missing lifetime specifier
 --> dangle.rs:5:16
  |
5 | fn dangle() -> &String {
  |                ^^^^^^^
  |
  = help: this function's return type contains a borrowed value, but there is no
    value for it to be borrowed from
  = help: consider giving it a 'static lifetime

error: aborting due to previous error
```

## 참조자의 규칙

1. 어떠한 경우이든 간에, 둘 중 하나만 가능
      * 하나의 가변 참조자
      * 임의 개수의 불변 참조자들
2. 참조자는 항상 유효해야함

## 슬라이스

곧 추가될 예정...

## References

[1] The Rust Programming Language. [4. 소유권 이해하기](https://rinthel.github.io/rust-lang-book-ko/ch04-00-understanding-ownership.html).