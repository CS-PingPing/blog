---
sidebar_position: 4
title: Decorator Pattern
authors: halang
tags: [Decorator Pattern, Design Pattern]
---

## Decorator Pattern

```csharp
// Main
Beverage beverage = new Espresso();
Console.WriteLine($"{beverage.GetDescription()} ${beverage.Cost()}");

Beverage beverage2 = new HouseBlend();
// HouseBlend를 decorate함
beverage2 = new Mocha(beverage2);
beverage2 = new Mocha(beverage2);
beverage2 = new Whip(beverage2);
Console.WriteLine($"{beverage2.GetDescription()} ${beverage2.Cost():N2}");

public abstract class Beverage
{
    protected string description = "제목 없음";

    public Beverage(string description)
    {
        this.description = description;
    }

    public virtual string GetDescription() => description;

    public abstract double Cost();
}

// 첨가물 데코레이터
public abstract class CondimentDecorator : Beverage
{
    protected Beverage beverage;

    public CondimentDecorator(Beverage beverage, string description) : base(description)
    {
        this.beverage = beverage;
    }
}

public class Espresso : Beverage
{

    public Espresso() : base("에스프레소") { }

    public override double Cost() => 1.99;
}

public class HouseBlend : Beverage
{
    public HouseBlend() : base("하우스 블렌드 커피") { }

    public override double Cost() => 0.89;
}

public class Mocha : CondimentDecorator
{
    public Mocha(Beverage beverage) : base(beverage, "모카") { }

    public override string GetDescription() => $"{beverage.GetDescription()}, {description}";

    public override double Cost() => beverage.Cost() + 0.2;
}

public class Whip : CondimentDecorator
{
    public Whip(Beverage beverage) : base(beverage, "휘핑크림") { }

    public override string GetDescription() => $"{beverage.GetDescription()}, {description}";

    public override double Cost() => beverage.Cost() + 0.1;
}
```
