#[derive(Debug)]
struct Rectangle {
  length: u32,
  width: u32,
}

impl Rectangle {
  fn area(&self) -> u32 {
    self.length * self.width
  }

  fn can_hold(self, other: &Rectangle) -> bool {
    self.length > other.length && self.width > other.width
  }
}

fn main() {
  let rect1 = Rectangle {length: 50, width: 30};
  let rect3 = Rectangle {length: 45, width: 60};
  // let a = rect1.can_hold(&rect3);
  println!("Can rect1 hold rect3? {}", rect1.can_hold(&rect3));
}

