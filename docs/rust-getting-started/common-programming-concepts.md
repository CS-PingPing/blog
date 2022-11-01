---
sidebar_position: 2
title: "[Rust] 보편적인 프로그래밍 개념"
authors: DevSlem
tags: [rust, language]
last_update:
    author: DevSlem
---

이 포스트에서는 러스트에서의 보편적인 프로그래밍 개념을 소개한다.

## 변수와 가변성

러스트의 변수는 기본적으로 *불변성*이다. 불변성 변수는 `let` 키워드를 통해 선언한다.

```rust
let x = 5;
```

가변성 변수는 `let mut` 키워드를 통해 선언한다.

```rust
let mut x = 5;
x = 6;
```

### 상수

상수와 불변성 변수는 다른 개념이다. 상수는 불변성 그 자체이다. 상수는 상수 표현식만 허용하며 런타임에 결정되는 값은 허용하지 않는다. 또한 상수는 반드시 데이터 타입을 선언해야한다. 상수는 `const` 키워드를 통해 선언한다.

```rust
const MAX_POINTS: u32 = 100_000; // 100,000
```

### Shadowing

*shadowing*이란 이전에 선언한 변수와 같은 이름의 새 변수를 선언해, 새 변수가 이전 변수를 숨기는 것을 의미한다. 아래는 shadowing의 예시이다.

```rust
let x = 5;

let x = x + 1;

let x = x * 2;
```

위 shadowing은 가변성 변수의 값을 변경하는 것과는 다르다. 불변성 변수 `x`를 다시 할당하는 행위이다. shadowing을 사용하면 여러 변수명을 사용할 필요가 없어지며 서로 다른 타입에 대해서도 동일한 변수명이 가능하다는 장점이 있다. 아래는 이에 대한 예시이다.

```rust
let spaces = "   ";
let spaces = spaces.len();
```

첫 번째 `spaces`는 문자열이지만, 두 번째 `spaces`는 정수형 타입이다. 만약 shadowing이 불가능하다면, 두 번째 변수명을 `num_spaces`와 같이 다른 변수명을 사용해야 한다.

또한 shadowing과 가변성 변수의 차이는 아래 샘플 코드에서 극명히 드러난다.

```rust
let mut spaces = "   ";
spaces = spaces.len();
```

위 코드는 컴파일 에러가 발생한다. `spaces` 가변성 변수는 문자열이기 때문에 정수형 값을 할당하는 것이 불가능하다.

## 데이터 타입들

데이터 타입은 스칼라와 컴파운드로 나뉜다. 스칼라 타입에는 정수형, 부동소수점 숫자, boolean, 문자 4가지가 있다.

### 스칼라

스칼라 타입에 대해 알아보자.

#### 정수형

|Length|Signed|Unsigned|
|:---:|:---:|:---:|
|8-bit|i8|u8|
|16-bit|i16|u16|
|32-bit|i32|u32|
|64-bit|i64|u64|
|arch|isize|usize|

`isize`와 `usize`는 32-bit와 64-bit 아키텍처 환경에 따라 자동으로 결정된다.

#### 부동 소수점

|Length|Type|
|:---:|:---:|
|32-bit|f32|
|64-bit|f64|

#### Boolean

`bool` 타입으로 `true`와 `false` 값이 존재한다.

#### 문자

`char` 타입으로 Unicode Scalar를 표현한다. 작은따옴표 (e.g., `'a'`)를 통해 문자를 표현한다.

### 컴파운드 타입

러스트의 컴파운드 타입에는 튜플과 배열이 있다.

#### 튜플

러스트는 튜플을 지원한다. 아래는 튜플의 명시적 선언의 예시이다.

```rust
let tup: (i32, f64, u8) = (500, 6.4, 1);
let a = x.0;
```

패턴 매칭을 사용하여 튜플의 값을 개별 변수로 구조해체 시킬 수 있다.

```rust
let tup = (500, 6.4, 1);
let (x, y, z) = tup;
```

#### 배열

아래는 배열을 선언하는 예시이다.

```rust
let a = [1, 2, 3, 4, 5];
```

인덱싱은 `a[0]`, `a[1]`과 같이 수행한다.

## 함수

`fn` 키워드를 사용해 함수를 선언할 수 있다. 아래는 샘플 코드이다.

```rust
fn main() {
    println!("Hello, world!");

    another_function();
}

fn another_function() {
    println!("Another function.");
}
```

러스트에서는 함수를 어느 위치에 선언해도 상관 없다.

매개변수가 있는 함수는 아래와 같이 선언할 수 있다. 매개 변수 선언은 `parameter: type` 형식으로 수행한다.

```rust
fn another_function(x: i32, y: i32) {
    println!("The value of x is: {}", x);
    println!("The value of y is: {}", y);
}
```

### 구문과 표현식

구문은 어떤 명령들의 나열로 값을 반환하지 않는 어떤 동작을 수행한다. **구문은 값을 반환하지 않는다.** 아래는 구문의 예시이다.

```rust
let y = 6;
```

반대로 표현식은 결과 값을 산출한다. 아래는 표현식의 예시이다. 새로운 범위를 생성하는 block `{}`은 표현식이다.

```rust
let x = 5;

let y = {
    let x = 3;
    x + 1
};

println!("The value of y is: {}", y);
```

표현식 부:

```rust
{
    let x = 3;
    x + 1
}
```

위 block에서 `x + 1`에는 세미콜론이 없다. 세미 콜론은 구문에 사용되기 떄문이다. 결과적으로 변수 `y`는 `4`의 값을 가진다.

### 반환 값을 갖는 함수

반환 타입은 화살표 `->` 뒤에 선언한다. 아래 샘플 코드는 `x + 1`을 반환하는 함수이다.

```rust
fn plus_one(x: i32) -> i32 {
    x + 1
}
```

중요한 사실은 반환 값에 대해 반드시 세미 콜론을 붙이지 말아야 한다.

## 주석

```rust
// Hello, world.
```

## 제어문

제어문에는 분기문과 반복문이 있다. 

### 분기문

`if`, `else if`, `else` 키워드를 사용해 분기문을 작성할 수 있다.

```rust
let number = 6;

if number % 4 == 0 {
    println!("number is divisible by 4");
} else if number % 3 == 0 {
    println!("number is divisible by 3");
} else if number % 2 == 0 {
    println!("number is divisible by 2");
} else {
    println!("number is not divisible by 4, 3, or 2");
}
```

`if`는 표현식이다. 따라서 아래와 같은 것이 가능하다.

```rust
let condition = true;
let number = if condition {
    5
} else {
    6
};
```

조건이 참이면 `5`를, 거짓이면 `6`을 변수 `number`에 대입한다. 다만, 주의할 점은 각 갈래의 결과는 반드시 같은 타입이어야 한다.

### 반복문

#### loop문

무한 루프는 `loop` 키워드를 사용한다.

```rust
loop {
    println!("again!");
}
```

#### while문

`while`문 역시 지원된다.

```rust
let mut number = 3;

while number != 0 {
    println!("{}!", number);

    number = number - 1;
}
```

#### for문

`for`문 역시 지원된다. `for`문은 `while`문에 비해 빠르고, 에러에 안전하다.

```rust
let a = [10, 20, 30, 40, 50];

for element in a.iter() {
    println!("the value is: {}", element);
}
```

`for`문에 `Range`와 결합해 사용할 수 있다. 아래는 1 ~ 3까지의 숫자를 역순으로 출력하는 샘플 코드이다.

```rust
for number in (1..4).rev() {
    println!("{}!", number);
}
```