---
slug: rust-tutorial
title: Rust 연습문제
authors: halang
tags: [rust, tutorial]
---

러스트 공식문서에 나온 간단한 예제를 풀어봅시다.

<!--truncate-->

- 정수 리스트가 주어졌을 때, 벡터를 이용하여 이 리스트의 평균값(mean, average), 중간값(median, 정렬했을 때 가장 가운데 위치한 값), 그리고 최빈값(mode, 가장 많이 발생한 값; 해쉬맵이 여기서 도움이 될 것입니다)를 반환해보세요.

```rust
use std::collections::HashMap;
fn main() {
    let list = vec![1, 2, 3, 4, 5, 6, 6];
    print!("평균값: {}\n", get_mean(&list));
    print!("중간값: {}\n", get_median(&list));
    print!("최빈값: {}", get_mode(&list));
}

fn get_mean(list: &Vec<i32>) -> f32 {
    let mut sum = 0;
    for i in list {
        sum += i;
    }
    sum as f32 / list.len() as f32
}

fn get_median(list: &Vec<i32>) -> f32 {
    let mut sorted_list = list.clone();
    sorted_list.sort();
    match sorted_list.len() % 2 {
        0 => ((sorted_list[sorted_list.len() / 2] + sorted_list[sorted_list.len()/ 2 - 1]) as f32 / 2 as f32) as f32,
        1 => sorted_list[sorted_list.len() / 2] as f32,
        _ => 0.0
    }
}

fn get_mode(list: &Vec<i32>) -> i32 {
    let mut map = HashMap::new();

    for i in list {
        let count = map.entry(i).or_insert(0);
        *count += 1;
    }

    let mut max_value = 0;
    let mut max_key = 0;
    for (key, value) in map {
        if max_value < value {
            max_value = value;
            max_key = *key;
        }
    }
    max_key
}
```
