---
sidebar_position: 1
title: Strategy Pattern
authors: DevSlem
tags: [Strategy Pattern, Design Pattern]
---

## Strategy Pattern

```csharp
// Author: @DevSlem

// Main()
Duck mallard = new MallardDuck();
mallard.PerformQuack();
mallard.PerformFly();

Duck model = new ModelDuck();
model.PerformFly();
model.Flyable = new FlyRocketPowered();
model.PerformFly();

// 날 수 있는 오브젝트에 대한 표준 인터페이스
public interface IFlyable
{
    void Fly();
}

// 꽥꽥거리는 오브젝트에 대한 표준 인터페이스
public interface IQuackable
{
    void Quack();
}

// 오리 추상 클래스. IFlyable과 IQuackable로 "구성 (composition)"된 클래스로
// 각각의 행동을 Duck 클래스의 상속에 의한 다형성보다는 이 행동을 분리하여 캡슐화함.
// 이러한 패턴을 "전략 패턴 (Strategy Pattern)"이라고 부름.
public abstract class Duck
{
    public IFlyable Flyable { get; set; }

    public IQuackable Quackable { get; set; }

    // 렌더링과 관련된 메서드로 반드시 구현해야함!
    public abstract void Display();

    public void PerformFly() => Flyable?.Fly();

    public void PerformQuack() => Quackable?.Quack();

    public void Swim() => Console.WriteLine("모든 오리는 물에 뜬다. 가짜 오리도 뜬다.");
}

// 날 수 있는 오브젝트
public class FlyWithWings : IFlyable
{
    public void Fly() => Console.WriteLine("날고 있음!!");
}

// 날지 못하는 오브젝트
public class FlyNoWay : IFlyable
{
    public void Fly() => Console.WriteLine("난 못날음!");
}

// 꽥꽥거림
public class GeneralQuack : IQuackable
{
    public void Quack() => Console.WriteLine("꽥!");
}

// 아무 소리도 못냄
public class MuteQuack : IQuackable
{
    public void Quack() => Console.WriteLine("<< 조용.. >>");
}

// 삑삑거림
public class Squeak : IQuackable
{
    public void Quack() => Console.WriteLine("삑");
}

public class MallardDuck : Duck
{
    public MallardDuck()
    {
        Quackable = new GeneralQuack();
        Flyable = new FlyWithWings();
    }

    public override void Display() => Console.WriteLine("물오리!");

    public void Test() => Console.WriteLine("Test");
}

public class FlyRocketPowered : IFlyable
{
    public void Fly() => Console.WriteLine("로켓 추진으로 날라감!");
}

public class ModelDuck : Duck
{
    public ModelDuck()
    {
        Flyable = new FlyNoWay();
        Quackable = new GeneralQuack();
    }

    public override void Display() => Console.WriteLine("모형 오리!");
}
```
