---
slug: rust-tutorial
title: Rust 추리게임 튜토리얼
authors: halang
tags: [rust, tutorial]
---

러스트를 이용해 추리게임 튜토리얼을 진행해봅시다.

<!--truncate-->

1. 사용자가 추리한 값을 입력 받아 그대로 출력하는 코드

```rust
use std::io;

fn main() {
    println!("숫자 추측게임!");
    println!("예측값을 입력하세요.");

    // guess라는 이름의 mutable 변수에 빈 String 생성
    let mut guess = String::new();

    // io의 연관함수인 stdin호출
    io::stdin().read_line(&mut guess).expect("Failed to read line");
    println!("당신의 예측값 : {}", guess);
}
```

- 사용자 입력을 받고 결과값을 표시하기 위해서 io(input, output) 라이브러리를 스코프로 가져와야 합니다.
- io 라이브러리는 std라고 불리는 표준 라이브러리에 있습니다.
- 러스트는 모든 프로그램의 스코프에 `prelude` 내의 타입들을 가져옵니다. 만약 원하는 타입이 prelude에 없다면 `use`문을 활용해 명시적으로 해당 타입을 가져와야 합니다.
- `println!`은 string을 화면에 표시하는 매크로입니다.
- ::new에 있는 ::는 new가 String 타입의 연관함수임을 나타냅니다. 연관함수는 하나의 타입을 위한 함수이며, 이 경우에는 하나의 String 인스턴스가 아니라 String 타입을 위한 함수입니다. (몇몇 언어에서는 이를 정적 메소드라고 부릅니다.)
- read_line은 입력된 문자들을 하나의 문자열에 저장하므로 인자로 값을 저장할 문자열이 필요합니다. 이 문자열 인자는 사용자 입력을 추가하면서 변경되므로 가변이어야 합니다.
- &는 데이터를 메모리로 복사하지 않고 접근하기 위한 방법을 제공하는 참조자임을 나타냅니다. 여기서 인자는 가변이어야 하므로 가변성 참조자인 &mut를 사용해야 합니다.
- read_line은 우리가 인자로 넘긴 문자열에 사용자가 입력을 저장하고 io::Result 값으로 돌려줍니다.
- Result타입은 열거형으로써 enums라고 부르기도 합니다.
- Result의 variants는 Ok와 Err입니다. Ok는 처리가 성공했음을 나타내며 내부적으로 성공적으로 생성된 결과를 가지고 있습니다. Err는 처리가 실패했음을 나타내고 그 이유에 대한 정보를 갖고 있습니다.
- Result는 에러 처리를 위한 정보를 표현하기 위해 사용되며 io::Result 인스턴스는 expect 메소드를 갖고 있습니다.
- io:Result 인스턴스가 Err일 경우 expect 메소드는 프로그램이 작동을 멈추게 하고 expect에 인자로 넘겼던 메세지를 출력합니다.
- io:Result 인스턴스가 Ok일 경우 expect는 Ok가 가지고 있는 결과값을 돌려주어 사용할 수 있도록 합니다.
- {}는 변경자로써 값이 표시되는 위치를 나타냅니다.

---

2. 비밀번호 생성하기

사용자가 추리할 비밀번호를 임의의 값으로 만들어 봅시다. 매 게임마다 비밀번호를 다르게 하기 위해 난수를 사용합시다. 하지만 러스트는 표준 라이브러리에 임의의 값을 생성하는 기능이 없습니다.
rand 크레이트를 사용해봅시다.

```rust
[dependencies]
rand = "0.3.14"
```

- dependencies 절은 프로젝트가 의존하고 있는 외부 크레이트와 각각의 요구 버전을 Cargo에 명시하는 곳입니다.
- 레지스트리를 업데이트하면 Cargo는 [dependencies] 절을 확인하고 갖고 있지 않은 것을 다운 받습니다.
- 크레이트를 업데이트하고 싶은 경우 cargo update 명령어를 이용합니다. 이는 Cargo.lock 파일을 무시하고 Cargo.toml에 명시한 요구사항에 맞는 최신 버전을 확인합니다. 만약 이 버전들로 문제가 없다면 Cargo는 해당 버전을 Cargo.lock에 기록합니다.

```rust
// 러스트에게 외부에 의존하는 크레이트가 있음을 알린다.
extern crate rand;

use std::io;
use rand::Rng;

fn main() {
    println!("숫자 추측게임!");
    let secret_number = rand::thread_rng().gen_range(1, 101);
    println!("비밀 숫자: {}", secret_number);

    println!("예측값을 입력하세요.");

    let mut guess = String::new();
    io::stdin().read_line(&mut guess).expect("Failed to read line");
    println!("당신의 예측값 : {}", guess);
}

```
