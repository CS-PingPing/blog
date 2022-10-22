---
sidebar_position: 2
title: Composite Pattern
authors: halang
tags: [Composite Pattern, Design Pattern]
---

## Composite Pattern

![Composite 패턴 001](https://user-images.githubusercontent.com/64428916/197357206-8ea03a8d-2f06-48a9-86e3-2d2cd23acc70.png)
![Composite 패턴 002](https://user-images.githubusercontent.com/64428916/197357211-6b561409-f4d7-4f54-bcff-0bdefcc25088.png)
![Composite 패턴 003](https://user-images.githubusercontent.com/64428916/197357219-d5cdc599-5606-43ac-abd8-d3511f411b27.png)
![Composite 패턴 004](https://user-images.githubusercontent.com/64428916/197357226-eba87d55-9d9b-4426-9a11-27e58351b970.png)
![Composite 패턴 005](https://user-images.githubusercontent.com/64428916/197357228-a1a1d84a-aa5e-4b77-a798-32a11b4f4e7a.png)
![Composite 패턴 006](https://user-images.githubusercontent.com/64428916/197357230-56912d88-3681-4ae8-9eca-e1c6d1d39964.png)
![Composite 패턴 007](https://user-images.githubusercontent.com/64428916/197357233-f626f18c-8384-475d-ac35-0c2ddabd6c57.png)
![Composite 패턴 008](https://user-images.githubusercontent.com/64428916/197357236-2ef8450f-40ba-43b3-8593-5fae18ce790d.png)
![Composite 패턴 009](https://user-images.githubusercontent.com/64428916/197357240-6918796e-7412-4c0c-ae6d-113011a6e2df.png)
![Composite 패턴 010](https://user-images.githubusercontent.com/64428916/197357248-691adba5-5ed9-4841-b35c-e93d5e74a03d.png)
![Composite 패턴 011](https://user-images.githubusercontent.com/64428916/197357251-9dab7093-068d-4b6d-a0c9-de58062cfd2d.png)
![Composite 패턴 012](https://user-images.githubusercontent.com/64428916/197357255-f64ce9be-f750-4b8f-bb90-6087c23d5fdb.png)
![Composite 패턴 013](https://user-images.githubusercontent.com/64428916/197357257-a7f87111-5be7-45a4-b2c1-b35006204a09.png)
![Composite 패턴 014](https://user-images.githubusercontent.com/64428916/197357259-fbd7d4f9-f081-4209-b5c2-11adf0140335.png)
![Composite 패턴 015](https://user-images.githubusercontent.com/64428916/197357262-268cbf29-2349-40f3-ae9e-fc2a9aa6d161.png)
![Composite 패턴 016](https://user-images.githubusercontent.com/64428916/197357264-7077f096-ad45-45e9-a310-2ad4e3e93325.png)
![Composite 패턴 017](https://user-images.githubusercontent.com/64428916/197357267-dbabeb3c-7a57-413d-bb29-03d4bd550391.png)
![Composite 패턴 018](https://user-images.githubusercontent.com/64428916/197357268-9af1a365-c3d8-42ef-8145-b75469a12b65.png)
![Composite 패턴 019](https://user-images.githubusercontent.com/64428916/197357272-e50ac694-6dd4-43b6-80b5-037f655f2daf.png)
![Composite 패턴 020](https://user-images.githubusercontent.com/64428916/197357274-d9c21d92-fd0b-449a-9887-7f0e82f9410b.png)

## 코드

```C#
using System;
using System.Collections.Generic;
using System.Diagnostics;

/// <summary>
/// MenuComponent에서 모든 메소드 구현함
/// </summary>
public abstract class MenuComponent
{
    /*
      MenuItem에서만 쓰거나 Menu에서만 쓸 수 있기에 기본적으로 에러 처리 해줌
        -> 자기 역할에 맞지 않는 메소드는 오버라이드하지 않고 기본 구현 그대로 사용 가능
     */
    public virtual void add(MenuComponent menuComponent)
    {

    }

    public virtual void remove(MenuComponent menuCompoent)
    {

    }

    public virtual MenuComponent getChild(int i)
    {
        return null;
    }

    public abstract string getName();

    public abstract string getDescription();

    public abstract double getPrice();

    public abstract bool isVegetarian();

    public abstract void print();

}

public class MenuItem : MenuComponent
{
    string name;
    string description;
    bool vegetarian;
    double price;

    public MenuItem(string name, string description, bool vegetarian, double price)
    {
        this.name = name;
        this.description = description;
        this.vegetarian = vegetarian;
        this.price = price;
    }

    public override void print()
    {
        Console.Write($" {name} ");
        if (vegetarian)
        {
            Console.Write("(v), ");
        }
        Console.WriteLine($"{price} -- {description}");
    }

    public override string getName()
    {
        return name;
    }

    public override string getDescription()
    {
        return description;
    }

    public override double getPrice()
    {
        return price;
    }

    public override bool isVegetarian()
    {
        return vegetarian;
    }
}

public class Menu : MenuComponent
{
    List<MenuComponent> menuComponents = new List<MenuComponent>();
    string name;
    string description;

    public Menu(string name, string description)
    {
        this.name = name;
        this.description = description;
    }

    public override void add(MenuComponent menuComponent)
    {
        menuComponents.Add(menuComponent);
    }

    public override void remove(MenuComponent menuComponent)
    {
        menuComponents.Remove(menuComponent);
    }

    public override MenuComponent getChild(int i)
    {
        return menuComponents[i];
    }

    public override void print()
    {
        Console.WriteLine($"\n{name}, {description}");
        Console.WriteLine("---------------");

        for(int i = 0; i < menuComponents.Count; i++)
        {
            menuComponents[i].print();
        }
    }

    public override string getName()
    {
        return name;
    }

    public override string getDescription()
    {
        return description;
    }

    public override double getPrice()
    {
        throw new NotImplementedException();
    }

    public override bool isVegetarian()
    {
        throw new NotImplementedException();
    }
}

// 이 코드를 사용하는 클라이언트
public class Waitress
{
    public MenuComponent allMenus;

    public Waitress(MenuComponent allMenus)
    {
        this.allMenus = allMenus;
    }

    // 메뉴 전체의 계층구조(모든 메뉴 및 메뉴 항목)를 출력하고 싶다면 그냥 최상위 메뉴의 print() 메소드만 호출하면 됨
    public virtual void printMenu()
    {
        allMenus.print();
    }
}

public class MenuTestDrive
{
    static void Main(string[] args)
    {
        MenuComponent pancakeHouseMenu = new Menu("팬케이크 하우스 메뉴", "아침 메뉴");
        MenuComponent dinnerMenu = new Menu("객체마을 식당 메뉴", "점심 메뉴");
        MenuComponent cafeMenu = new Menu("카페 메뉴", "저녁 메뉴");
        MenuComponent dessertMenu = new Menu("디저트 메뉴", "디저트를 즐겨보세요.");

        MenuComponent allMenus = new Menu("전체 메뉴", "전체 메뉴");

        allMenus.add(pancakeHouseMenu);
        allMenus.add(dinnerMenu);
        allMenus.add(cafeMenu);

        // 메뉴 항목 추가
        dinnerMenu.add(new MenuItem(
            "파스타",
            "마리나라 소스 스파게, 효모빵도 드림",
            true,
            3.89
            ));
        dinnerMenu.add(dessertMenu);

        dessertMenu.add(new MenuItem(
            "애플 파이",
            "바삭한 크러스트에 바닐라 아스크림이 얹혀 있는 애플 파이",
            true,
            1.59
            ));

        // 메뉴 항목 추가
        Waitress waitress = new Waitress(allMenus);
        waitress.printMenu();

    }
}

```
