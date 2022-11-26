---
sidebar_position: 5
title: "[Rust] 열거형과 패턴 매칭"
authors: hyunseung
tags: [rust, language]
last_update:
  author: hyunseung
---

# [RUST] 열거형과 패턴 매칭

이번 포스트에서는 열거형(enums)와 match표현식을 이용한 패턴매칭에 대해 소개한다.

## 열거형 정의하기

모든 가능한 값들을 나열(enumerate)할 수 있으며, 이 경우를 열거라고 부른다.  
열거형 값은 variants 중 하나만 될 수 있다는 특징이 존재한다.

```rust
enum IpAddrKind {
    V4,
    V6,
}
```

`IpAddrKind`이라는 열거형을 정의하면서 포함할수 있는 IP 주소인 `V4`와 `V6`를 나열함으로써 이 개념을 코드에 표현할 수 있다.  
이것들은 열거형의 `variants`라고 한다.

### 열거형 값

아래처럼 `IpAddrKind`의 두 개의 variants에 대한 인스턴스를 만들 수 있다.

```rust
let four = IpAddrKind::V4;
let six = IpAddrKind::V6;
```

`IpAddrKind` 타입을 인자로 받는 함수는 다음과 같이 정의한다.

```rust
fn route(ip_type: IpAddrKind) { }
```

그리고 variant중 하나를 사용해서 함수를 호출할 수 있다.

```rust
route(IpAddrKind::V4);
route(IpAddrKind::V6);
```

구조체보다 열거형을 사용했을 때 존재하는 여러가지 장점에 대해 살펴보려 한다.

```rust
enum IpAddrKind {
    V4,
    V6,
}

struct IpAddr {
    kind: IpAddrKind,
    address: String,
}

let home = IpAddr {
    kind: IpAddrKind::V4,
    address: String::from("127.0.0.1"),
};

let loopback = IpAddr {
    kind: IpAddrKind::V6,
    address: String::from("::1"),
};
```

열거형 variant에 데이터를 직접 넣는 방식을 사용해서 열거형을 구조체의 일부로 사용하는 방식보다 더 간결하게 동일한 개념을 표현할 수 있다.

```rust
enum IpAddr {
    V4(String),
    V6(String),
}

let home = IpAddr::V4(String::from("127.0.0.1"));

let loopback = IpAddr::V6(String::from("::1"));
```

위와 같이 작성하게 된다면, 열거형의 각 variant에 직접 데이터를 붙임으로써, 구조체를 사용할 필요가 없어진다.

열거형은 아래와 같이 각 variants에 다양한 유형의 타입을 저장할 수 있다.

```rust
enum Message {
    Quit,
    Move { x: i32, y: i32 },
    Write(String),
    ChangeColor(i32, i32, i32),
}
```

이와 같이 variants로 열거형을 정의하는 것은 다른 종류의 구조체들을 정의하는 것과 비슷하다. 열거형과 다른 점은 struct 키워드를 사용하지 않았다는 것과 모든 variants가 Message 타입으로 그룹화된다는 것이다.  
아래 구조체들은 이전 열거형의 variants가 갖는 것과 동일한 데이터를 포함할 수 있다.

```rust
struct QuitMessage; // 유닛 구조체
struct MoveMessage {
    x: i32,
    y: i32,
}
struct WriteMessage(String); // 튜플 구조체
struct ChangeColorMessage(i32, i32, i32); // 튜플 구조체
```

각기 다른 타입을 갖는 여러 개의 구조체를 사용한다면, 이 메시지 중 어떤 한 가지를 인자로 받는 함수를 정의하기 힘들 것이다.

구조체에서 `impl`을 사용해서 메소드를 정의한 것처럼, 열거형에도 정의가 가능하다.

```rust
impl Message {
    fn call(&self) {
        // 메소드 내용은 여기 정의할 수 있습니다.
    }
}

let m = Message::Write(String::from("hello"));
m.call();
```

`Message` 열거형에 정의한 `call`이라는 메소드에 대해 살펴보자.

열거형의 값을 가져오기 위해 `self`를 사용할 것이다. 이 예제에서 생성한 변수 `m`은 `Message::Write(String::from("hello"))`값을 갖게 되고, 이 값은 `m.call()`이 실행될 때, `call`메소드 안에서 `self`가 될 것이다.

### Option 열거형과 Null값 보다 좋은 점들

표준 라이브러리에서 열거형으로 정의된 또 다른 타입인 `Option`에 대한 사용 예를 살펴보자.  
`Option` 타입은 많이 사용되는데, 값이 있거나 없을 수도 있는 아주 흔한 상황을 나타내기 때문이다.  
타입 시스템의 관점으로 표현하자면, 컴파일러가 발생할 수 있는 모든 경우를 처리했는지 체크할 수 있다.

러스트는 다른 언어에서 흔하게 볼 수 있는 null특성이 없다.  
null 값으로 발생하는 문제는, null 값을 null이 아닌 값처럼 사용하려고 할 때 여러 종류의 오류가 발생할 수 있다. 이는 몹시 치명적인 오류이다.

이런 null 문제를 해결하기 위해 러스트에는 null이 없지만, 값의 존재 혹은 부재의 개념을 표현할 수 있는 열거형이 존재한다.

바로 `Option<T>`이다.

다음과 같이 표준 라이브러리에 정의되어 있다.

```rust
enum Option<T> {
    Some(T),
    None,
}
```

`Option<T>` 열거형은 매우 유용하며 기본적으로 포함되어 있기 때문에, 명시적으로 가져오지 않아도 사용할 수 있다.

예시를 통해 `Option`에 대해 살펴보자.

```rust
let some_number = Some(5);
let some_string = Some("a string");

let absent_number: Option<i32> = None;
```

주의해야 할 점은 Some 이 아닌 None 을 사용한다면, `Option<T>` 이 어떤 타입을 가질지 러스트에게 알려줄 필요가 있다.  
컴파일러는 None 만 보고는 Some variant 가 어떤 타입인지 추론할 수 없다.

`Some`값을 얻게 되면, 값이 있다는 것과 `Some`이 갖고 있는 값에 대해 알 수 있다.  
`None`값을 사용하면, 어떤 면에서는 null과 같은 의미를 갖게 된다. 유효한 값을 갖지 않았다는 뜻이다.

그렇다면 왜 `Option<T>`를 사용하는 것이 null을 갖는 것보다 나을까??

간단하게 말하면, `Option<T>`와 `T`는 다른 타입이며, 컴파일러는 `Option<T>` 값을 명확하게 유효한 값처럼 사용하지 못하도록 한다.

아래 코드를 살펴보자.

```rust
let x: i8 = 5;
let y: Option<i8> = Some(5);

let sum = x + y;
```

이 코드를 출력하면 아래와 같은 에러 메시지가 출력된다.

```
error[E0277]: the trait bound `i8: std::ops::Add<std::option::Option<i8>>` is
not satisfied
 -->
  |
7 | let sum = x + y;
  |           ^^^^^
  |
```

이 에러 메시지는 `Option<i8>`과 i8는 다른 타입이기에 어떻게 더해야 하는지 모른다는 것을 의미한다.

둘의 연산을 수행하기 위해서는 T에 대한 연산을 수행하기 이전에 `Option<T>`를 T로 반환해야 한다.

## match 흐름 제어 연산자

러스트는 match라고 불리는 흐름 제어 연산자를 가지고 있다.  
이는 우리에게 일련의 패턴에 대해 어떤 값을 비교한 뒤 어떤 패턴에 매치되었는지를 바탕으로 코드를 수행하도록 해준다.

동전 분류기를 예시로 들어 생각해보자. 동전들은 다양한 크기의 구멍들이 있는 트랙으로 미끄러져 내려가고, 각 동전은 그것에 맞는 첫 번째 구멍을 만났을 때 떨어진다. 동일한 방식으로, 값들은 match 내의 각 패턴을 통과하고, 해당 값에 맞는 첫 번째 패턴에서 해당하는 코드 블록 안으로 떨어질 것이다.

예시 코드는 다음과 같다.

```rust
enum Coin {
    Penny,
    Nickel,
    Dime,
    Quarter,
}

fn value_in_cents(coin: Coin) -> u32 {
    match coin {
        Coin::Penny => 1,
        Coin::Nickel => 5,
        Coin::Dime => 10,
        Coin::Quarter => 25,
    }
}
```

해당 코드를 세세히 살펴보자.

`match`키워드 뒤에 표현식을 써줬는데, 위의 경우에는 `coin`값이다.  
우리가 흔히 아는 if를 사용하는 표현식과 유사하지만, 부울린 값을 반환하는 if와 달리 어떠한 타입도 반환할 수 있다.

다음은 `match`의 갈래(arm)부분이다.  
하나의 갈래는 두 부분을 갖고 있다. `패턴`과 `어떤 코드`이다.

`match`표현식이 실행될 때, 결과 값을 각 갈래의 패턴에 대해서 순차적으로 비교한다. 만일 어떤 패턴이 그 값과 매치되면, 그 패턴과 연관된 코드가 실행되는 방식이다.

### 값을 바인딩하는 패턴들

매치 갈래의 또 다른 유용한 기능은 패턴과 매치된 값들의 부분을 바인딩할 수 있다는 것이다. 이것이 열거형 variant로부터 어떤 값들을 추출할 수 있는 방법이다.

예시 코드를 살펴보자.

```rust
enum UsState {
   Alabama,
   Alaska,
}

enum Coin {
   Penny,
   Nickel,
   Dime,
   Quarter(UsState),
}

fn value_in_cents(coin: Coin) -> u32 {
    match coin {
        Coin::Penny => 1,
        Coin::Nickel => 5,
        Coin::Dime => 10,
        Coin::Quarter(state) => {
            println!("State quarter from {:?}!", state);
            25
        },
    }
}
```

만일 우리가 `value_in_cents(Coin::Quarter(UsState::Alaska))`를 호출했다면, `coin`은 `Coin::Quarter(UsState::Alaska)`가 될 것이다. 각각의 매치 갈래들과 이 값을 비교할 때, `Coin::Quarter(state)`에 도달할 때까지 아무것도 매치되지 않는다. 이 시점에서, `state`에 대한 바인딩은 값 `UsState::Alaska`가 될 것이다. 그러면 이 바인딩을 `println!` 표현식 내에서 사용할 수 있고, 따라서 `Quarter`에 대한 `Coin` 열거형 variant로부터 내부의 주에 대한 값을 얻었다.

### `Option<T>`를 이용하년 매칭

`match`를 이용하여 `Option<T>`또한 다룰 수 있다.

```rust
fn plus_one(x: Option<i32>) -> Option<i32> {
    match x {
        None => None,
        Some(i) => Some(i + 1),
    }
}

let five = Some(5);
let six = plus_one(five);
let none = plus_one(None);
```

### Some(T) 매칭 하기

`plus_one(five)`가 호출될 때, `plus_one`의 본체 내의 변수 `x`는 값 `Some(5)`를 갖게 될 것이다.

`Some(5)` 값은 패턴 `None`과 매칭되지 않으므로, `Some(i)`와 매칭되고 해당 코드가 실행된다.  
따라서 최종적으로 `i`의 값에 1을 더한 `6`을 담은 새로운 `Some`이 생성된다.

### None 매칭 하기

`plus_one(None)`호출을 살펴보자.  
`match`안으로 들어와서 첫 번째 갈래인 `None`에 매칭되어 `None`값을 반환하고 매칭이 종료된다.

### 매치는 하나도 빠뜨리지 않는다

만약 다음과 같이 코드를 작성하면 에러가 발생한다.

```rust
fn plus_one(x: Option<i32>) -> Option<i32> {
    match x {
        Some(i) => Some(i + 1),
    }
}
```

여기서는 `None`케이스를 다루지 않았기 때문에 버그가 발생하고 다음과 같은 에러를 얻는다.

```
error[E0004]: non-exhaustive patterns: `None` not covered
 -->
  |
6 |         match x {
  |               ^ pattern `None` not covered
```

### \_변경자(placeholder)

모든 가능한 값을 나열하고 싶지 않을 경우 사용할 수 있는 패턴이다. 예를 들어, `u8`은 0에서 255까지 유효한 값을 가진다. 이 중, 몇가지 값에만 신경 쓰고자 한다면 다음과 같이 구현하면 된다.

```rust
let some_u8_value = 0u8;
match some_u8_value {
    1 => println!("one"),
    3 => println!("three"),
    5 => println!("five"),
    7 => println!("seven"),
    _ => (),
}
```

`_`패턴은 어떠한 값과도 매칭될 것이다. 하지만 `match`표현식은 우리가 단 한가지 경우에 대해 고려하는 상황에서는 다소 장황할 수 있다. 이러한 상황을 위해 러스트는 `if let`을 제공한다.

## if let을 사용한 간결한 흐름 제어

`if let`문법은 `if`와 `let`을 조합하여 하나의 패턴만 매칭 시키고 나머지 경우는 무시하는 패턴이다.

`Option<u8>`값을 매칭 하지만 그 값이 3일 경우에만 코드를 실행시키고 싶으면 다음과 같이 사용하면 된다.

```rust
// match를 이용한 경우
let some_u8_value = Some(0u8);
match some_u8_value {
    Some(3) => println!("three"),
    _ => (),
}

// if let을 이용한 경우
if let Some(3) = some_u8_value {
    println!("three");
}
```

`if let`은 `=`로 구분된 패턴과 표현식을 입력받는다. `if let`을 사용하면 보일러 플레이트 코드를 덜 쓰게 된다는 장점이 있지만, `match`가 강제했던 하나도 빠짐없는 검사를 잃게 된다는 단점이 존재한다.

따라서 상황에 맞게 잘 사용해야 한다.

`if let`과 함께 `else`를 포함시킬 수 있다. `else`뒤에 나오는 코드 블록은 `match`표현식에서 `_`케이스 뒤에 나오는 코드 블록과 동일하다.

```rust
let mut count = 0;
if let Coin::Quarter(state) = coin {
    println!("State quarter from {:?}!", state);
} else {
    count += 1;
}
```
