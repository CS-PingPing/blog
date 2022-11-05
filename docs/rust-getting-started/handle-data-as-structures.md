---
sidebar_position: 2
title: "[Rust] 연관된 데이터들을 구조체로 다루기"
authors: halang
tags: [rust, language]
last_update:
  author: halang
---

이 포스트에서는 러스트에서 연관된 데이터들을 구조체로 다루는 방법을 소개한다.

## 구조체를 정의하고 생성하기

### 구조체를 정의하고 초기화하기

- 구조체는 튜플과 유사하게, 구성요소들이 각자 다른 타입을 지닐 수 있다.
- 하지만 튜플과는 다르게 각 구성요소들을 명명할 수 있다. 구조체 내의 특정 요소 데이터 명세를 기술하거나, 접근할 때 순서에 의존할 필요가 없기 때문에 튜플보다 유연하게 다룰 수 있다.
- 문법은 아래와 같다.

```rust
// struct 키워드 + 구조체명
struct User {
  username: String,
  email: String,
  sign_in_count: u64,
  active: bool,
}
```

- 정의한 구조체를 사용하려면, 각 필드의 값을 명세한 인스턴스를 생성해야 한다.
- 구조체를 정의할 때 필드의 순서와 같을 필요는 없다.
- 구조체에서 특정한 값을 읽으려면, 점(.) 표기법을 사용한다.
- 변경이 가능한 구조체 인스턴스에 들어있는 값을 바꿀 때는, 점(.) 표기법을 사용하여 특정 필드에 새 값을 할당할 수 있다.

```rust
let mut user1 = User {
  email: String::from("a@example.com"),
  username: String::from("abc"),
  active: true,
  sign_in_count: 1,
}
user1.email = String::from("b@example.com");
```

- 인스턴스는 반드시 <span style="color:violet">변경 가능(mutable)</span> 해야한다.
- Rust에서는 특정 필드만 변경할 수 있도록 허용하지 않는다. 새 인스턴스 구조체를 표현식으로 생성하여 새 인스턴스를 바로 반환할 수 있다.

### 변수명이 필드명과 같을 때 간단하게 필드 초기화하기

- 변수명이 필드명과 같을 때는 필드 초기화 축약법(field init shorthand)을 이용한다.

```rust
fn build_user(email: String, username: String) -> User {
  User {
    email,
    username,
    active: true,
    sign_in_count: 1,
  }
}
```

### 구조체 갱신법을 이용하여 기존 구조체 인스턴스로 새 구조체 인스턴스 생성하기

- 구조체 갱신법(struct update syntax)은 입력으로 주어진 인스턴스와 변화하지 않는 필드들을 명시적으로 할당하지 않기 위해 `.. 구문`을 사용한다.
- 새 User 구조체 생성 시 email과 username은 새 값을 할당하고 나머지 필드는 user1에서 재사용

```rust
let user2 = User {
  email: String::from("another@example.com"),
  username: String::from("anotherusername567"),
  ..user1
}
```

### 이름이 없고 필드마다 타입은 다르게 정의 가능한 튜플 구조체

- 구조체명을 통해 의미를 부여할 수 있으나 필드의 타입만 정의할 수 있고 명명하지 못하는 구조체를 튜플 구조체라 한다.
- 아래와 같이 사용한다.

```rust
struct Color(i32, i32, i32);
struct Point(i32, i32, i32);

let black = Color(0, 0, 0);
let origin = Point(0, 0, 0);
```

- 여기서 black과 origin은 **서로 다른 타입**이다. 구조체 내의 타입이 모두 동일하더라도 각각의 구조체는 고유의 타입이기 때문이다.

### 필드가 없는 유사 유닛 구조체

- **어떤 필드도 없는 구조체도 정의 가능**하다. 유닛 타입인 ()와 비슷하게 동작하기 때문에 **유사 유닛 구조체**라 불린다.

### 구조체 데이터의 소유권(Ownership)

- 구조체 전체가 유효한 동안 구조체가 해당 데이터를 소유하게 의도적으로 설정한다.
- 구조체가 소유권이 없는 데이터의 참조를 저장할 수 있지만, 라이프타임(구조체가 존재하는동안 참조하는 데이터를 계속 존재할 수 있도록 함)의 사용을 전제로 한다.
- 라이프타임을 사용하지 않고 참조를 저장하고자 하면 아래와 같은 에러가 발생한다.

```rust
struct User {
  username: &str,
  email: &str,
  sign_in_count: u64,
  active: bool,
}

fn main() {
  let user1 = User {
    email: "a@example.com",
    username: "b",
    active: true,
    sign_in_count: 1,
  }
}
```

```text
error[E0106]: missing lifetime specifier
 -->
  |
2 |     username: &str,
  |               ^ expected lifetime parameter

error[E0106]: missing lifetime specifier
 -->
  |
3 |     email: &str,
  |            ^ expected lifetime parameter

```

- 컴파일러는 라이프타임이 명시되어야 한다고 에러를 발생시킨다.
- 참조가 저장이 불가능한 위 에러 개선에 대해서 추후 10장에서 살펴볼 것이다. 지금은 우선 &str 대신 String을 사용하는 방식으로 에러를 고치자.

## 구조체를 이용한 예제 프로그램

- 구조체를 이용하지 않은 예제 프로그램과 이용한 예제 프로그램을 비교해보자.

```rust
// 아무것도 이용 x
fn main() {
  let length = 50;
  let width1 = 30;

  println!(
    "직사각형 넓이 {}", area(length, width)
  );
}

fn area(length: u32, width: u32) -> u32 {
  length * width
}
```

```rust
// 튜플 이용
fn main() {
  let rect = (30, 50)

  println!("직사각형 넓이 {}", area(rect));
}

fn area(dimensions: (u32, u32)) -> u32 {
  dimensions.0 * dimensions.1
}
```

```rust
// 구조체 이용
struct Rectangle {
  length: u32,
  width: u32,
}

fn main() {
  let rect = Rectangle {length: 50, width: 30};

  println!("직사각형 넓이 {}", area(&rect));
}

fn area(rectangle: &Rectangle) -> u32 {
  rectangle.length * rectangle.width
}
```

- 튜플을 사용할 경우 인자를 하나만 넘겨도 된다. 하지만 튜플은 요소에 대한 이름이 없어 명확하지 않다.

### 파생 트레잇(derived trait)으로 유용한 기능 추가하기

```rust
struct Rectangle {
  length: u32,
  width: u32,
}

fn main() {
  let rect = Rectangle {length: 50, width: 30};
  println!("rect is {}", rect);
}
```

- 위 코드를 입력하면 아래와 같은 오류 메세지가 나온다.

```text
error[E0277]: the trait bound `Rectangle: std::fmt::Display` is not satisfied
```

- println! 매크로는 다양한 종류의 포맷 출력이 가능하다. {}은 println!에게 Display라고 알려진 포맷팅을 이용하라고 전달한다. 기본 타입들은 Display에 기본적으로 구현되어 있지만 구조체를 사용하는 경우 해당 값을 출력하는게 애매하기 때문에 기본 제공되는 구현체가 없다.
- 따라서 {} 내에 `:?` 명시자를 집어넣어 println!에게 Debug라 불리우는 출력 포맷을 사용하고 싶다고 말해주면 된다. 구조체에 대하여 해당 기능을 활성화하도록 `#[derive(Dubug)]` 어노테이션을 추가해야 한다.

```rust
#[derive(Debug)]
struct Rectangle {
  length: u32,
  width: u32,
}

fn main() {
  let rect = Rectangle {length: 50, width: 30};
  println!("rect is {:?}", rect);
}
```

- 위 코드에 대한 출력값은 다음과 같다.

```text
rect1 is Rectangle { length: 50, width: 30 }
```

- 더 큰 구조체를 가질 경우 {:?} 대신 {:#?}을 사용하면 된다. 출력은 다음과 같다.

```text
rect1 is Rectangle {
    length: 50,
    width: 30
}
```

## 메소드 문법

- 메소드는 함수와 유사하다 : fn 키워드와 이름으로 선언, 파라미터와 반환값을 가짐, 호출되었을 때 실행될 코드를 담고 있음
- 하지만 메소드는 함수와는 달리 **구조체의 내용 안에 정의**되며, 첫번째 파라미터가 언제나 self인데 이는 메소드가 호출되고 있는 구조체의 인스턴스를 나타낸다.

### 메소드 정의하기

- Rectangle 구조체 위에서 정의된 area 메소드를 만들어보자.

```rust
#[derive(Debug)]
struct Rectangle {
  length: u32,
  width: u32,
}

impl Rectangle {
  fn area(&self) -> u32 {
    self.length * self.width
  }
}

fn main() {
  let rect1 = Rectangle {length: 50, width: 30};

  println!(
    "The area of the rectangle is {} square pixels.",
    rect1.area()
  );
}
```

- 위와 같이 Rectangle 인스턴스 상의 area 메소드를 호출할 수있다.
- area의 시그니처 내에서는, rectangle: &Rectangle 대신 &self가 사용된다. 이는 메소드가 impl Rectangle 내용물 안에 위치하고 있어 러스트가 self 타입이 Rectangle 라는 사실을 알 수 있기 때문이다.
- 주의할 점은 &Rectangle이라고 썼던 것 처럼 self 앞에서 &를 써야 한다. self도 소유권을 가져갈 수 있고 변경 불가능하게 빌릴 수도 있고(`&self`), 혹은 다른 파라미터와 비슷하게 변경 가능하도록 빌릴 수도(`&mut self`) 있기 때문이다.

- 함수 대신 메소드를 이용하면 생기는 주요 잇점

1. self의 타입을 반복해 타이핑하지 않아도 된다.
2. 조직화에 관한 관점 : Rectangle이 사용 가능한 지점을 찾도록 하는 것보다 하나의 impl 블록 내에 해당 타입의 인스턴스로 할 수 있는 모든 것을 모아두는게 보기 편하다.

### 러스트의 자동 참조 및 역참조 (automatic referencing and dereferencing)

### 더 많은 파라미터를 가진 메소드

```rust
#[derive(Debug)]
struct Rectangle {
  length: u32,
  width: u32,
}

impl Rectangle {
  fn area(&self) -> u32 {
    self.length * self.width
  }

  fn can_hold(&self, other: &Rectangle) -> bool {
    self.length > other.length && self.width > other.width
  }
}

fn main() {
  let rect1 = Rectangle {length: 50, width: 30};
  let rect2 = Rectangle {length: 40, width: 10};
  let rect3 = Rectangle {length: 45, width: 60};

  println!("Can rect1 hold rect2? {}", rect1.can_hold(&rect2));
  println!("Can rect1 hold rect3? {}", rect1.can_hold(&rect3));
}
```

```text
Can rect1 hold rect2? true
Can rect1 hold rect3? false
```

- can_hold메소드에서 또다른 Rectangle의 불변 참조라를 파라미터로 받는다. 이는 우리가 rect2를 그냥 읽기만 하길 원하기 때문에 타당하다.

### 연관 함수

- impl 블록에서 self 파라미터를 갖지 않는 함수도 impl 내에 정의가능하다.
- 이 함수가 해당 구조체와 연관되어 있기 때문에 이를 **연관 함수(associated functions)**라고 부른다.
- 또한 이들은 함께 동작할 구조체의 인스턴스를 가지고 있지 않기 때문에 메소드가 아니라 여전히 함수이다.

- 연관 함수는 새로운 구조체의 인스턴스를 반환해주는 생성자로서 자주 사용된다.

```rust
impl Rectangle {
  fn square(size: u32) -> Rectangle {
    Rectangle {length: size, width: size}
  }
}
```

- 위와 같은 연관 함수를 호출하기 위해서 `let sq = Rectangle::square(3);` 처럼 구조체 이름과 함께 `::` 문법을 이용한다.
- `::` 문법은 연관 함수와 모듈에 의해 생성된 이름공간 두 곳 모두에서 사용된다.

## 정리

- 구조체를 이용하면 연관된 데이터의 조각들을 서로 연결하여 유지할 수 있으며 각 데이터에 네이밍을 함으로써 코드를 더 명확하게 만들 수 있다.
- 메소드는 구조체의 인스턴스가 가지고 있는 동작을 명시하도록 해주며, 연관 함수는 이용 가능한 인스턴스 없이 우리의 구조체에 특정 기능을 이름공간 내에 넣을 수 있도록 해준다.
