extern crate rand;

use std::io;
use std::cmp::Ordering;
use rand::Rng;

fn main() {
    println!("숫자 추측게임!");
    let secret_number= rand::thread_rng().gen_range(1, 101);
    println!("비밀 숫자: {}", secret_number);

    println!("예측값을 입력하세요.");

    let mut guess = String::new();
    io::stdin().read_line(&mut guess).expect("입력값을 읽을 수 없습니다.");
    let guess: u32 = guess.trim().parse().expect("숫자를 입력하세요!");
    println!("당신의 예측값 : {}", guess);

    match guess.cmp(&secret_number) {
        Ordering::Less => println!("너무 작아요!"),
        Ordering::Greater => println!("너무 커요!"),
        Ordering::Equal => println!("정답!"),
    }
}

