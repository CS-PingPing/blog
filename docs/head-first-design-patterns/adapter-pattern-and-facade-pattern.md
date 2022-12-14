---
sidebar_position: 5
title: Adapter Pattern & Facade Pattern
authors: halang
tags: [Composite Pattern, Facade Pattern, Design Pattern]
---

## 어댑터?

![어댑터](https://velog.velcdn.com/images/lhr4884/post/ad04d990-9093-487b-9faa-95d7305555e2/image.png)

어댑터는 우리 주변에서도 쉽게 볼 수 있습니다. 한국에서 사용하던 충전기를 해외에서 사용하려면 플러그 모양을 바꿀 어댑터가 필요합니다. 이처럼 어댑터는 내가 가지고 있는 인터페이스를 다른 곳에 적용할 인터페이스로 바꿔 주는 역할을 합니다.

## Adapter Pattern이란?

Adapter Pattern은 이미 제공되어 있는 것과 필요한 것 사이의 차이를 없애주는 디자인 패턴입니다. 특정 클래스 인터페이스를 클라이언트에서 요구하는 다른 인터페이스로 변환합니다. Wrappter 패턴이라고도 부릅니다.
![warpper](https://velog.velcdn.com/images/lhr4884/post/de96d74e-141b-4fc9-8cb9-91ef1e832054/image.png)

위 사진처럼 클라이언트에서는 Target Interface를 호출하는 것처럼 보입니다. 하지만 클라이언트의 요청을 받은 Adapter는 자신이 감싸고 있는 Adaptee에게 실질적인 처리를 위임합니다. Adapter가 Adaptee를 감싸고 있는 것 때문에 Wrapper 패턴이라고도 불립니다.

## Adapter Pattern 예시

![어댑터](https://velog.velcdn.com/images/lhr4884/post/314604ef-8789-4c54-8171-b0069b2fdd9a/image.png)
어댑터 패턴을 실제 사용하는 예시를 들어보겠습니다.

어떤 회사에서 파일 읽기 코드를 개발했습니다. 레거시 코드(옛날 버전의 코드들)가 너무 많아 다시 개발을 했었는데 갑자기 알 수 없는 곳에서 에러가 생겼습니다. 결국 기존 시스템을 사용하기 위해 어댑터를 사용합니다. 이처럼 기존 시스템의 인터페이스를 바꾸는 것이 힘들 경우가 생깁니다. 결국 어댑터 패턴은 프로그램의 완결성은 높지만 재사용성은 떨어질 때 사용합니다.

## Adapter Pattern 등장인물

![등장인물](https://velog.velcdn.com/images/lhr4884/post/b16dac96-ce26-433a-9df5-96f3cb97cae7/image.png)

1. Client
   Target 역할의 메소드를 사용해서 일을 합니다.

2. Target
   Client는 Target을 통해 Adaptee를 사용할 수 있습니다. 또한 지금 필요한 메소드를 결정합니다.

3. Adapter
   Client가 사용하려는 Target Interface와 Adaptee 중간에서 둘을 연결해주는 역할입니다.
   Adaptee 역할의 메소드를 사용해서 어떻게든 Target 역할을 만족시키기 위한 것이 Adapter 패턴의 목적입니다.

4. Adaptee
   이미 준비되어 있는 메소드를 가지고 있는 역할입니다.

## Adapter Pattern Code

```c#
using System;

public interface Duck
{
    void quack();
    void fly();
}

public class MallarDuck : Duck
{
    public void quack()
    {
        Console.WriteLine("꽥");
    }

    public void fly()
    {
        Console.WriteLine("날고 있어요");
    }
}

public interface Turkey
{
    void gobble();
    void fly();
}

public class WildTurkey : Turkey
{
    public void gobble()
    {
        Console.WriteLine("글골");
    }

    public void fly()
    {
        Console.WriteLine("짧은 거리를 날고 있어요!");
    }
}

/// <summary>
/// 우리가 필요한건 Duck
/// Turkey 어댑터를 이용해 우리가 원하는 Duck 이용하기
/// </summary>

public class TurkeyAdapter : Duck
{
    Turkey turkey;

    public TurkeyAdapter(Turkey turkey)
    {
        this.turkey = turkey;
    }

    public void quack()
    {
        turkey.gobble();
    }

    public void fly()
    {
        for(int i = 0; i < 5; i++)
        {
            turkey.fly();
        }
    }
}

public class DuckTestDrive
{
    static void Main(String[] args)
    {
        Duck duck = new MallarDuck();
        Turkey turkey = new WildTurkey();

        // turkey를 adapter로 감싸서 duck 객체처럼 보이도록 만듦
        Duck turkeyAdapter = new TurkeyAdapter(turkey);

        Console.WriteLine("칠면조가 말하길");
        turkey.gobble();
        turkey.fly();

        Console.WriteLine("오리가 말하길");
        testDuck(duck);

        Console.WriteLine("칠면조 어댑터가 말하길");
        testDuck(turkeyAdapter); // 오리 대신 칠면조 넘김
    }

    static void testDuck(Duck duck)
    {
        duck.quack();
        duck.fly();
    }
}
```

## Facade Pattern?

이번엔 비슷하지만 조금 다른 패턴을 배워봅시다. (참고로 facade란 겉모양이나 외관 이라는 뜻입니다)

지금까지 어댑터 패턴을 사용하여 어떤 클래스의 인터페이스를 클라이언트가 원하는 인터페이스로 변환하는 방법을 배웠습니다. 이번에 배울 퍼사드 패턴은 비슷하지만 다른 목적으로 인터페이스를 변경합니다.
우선 퍼사드 패턴이란 서브시스템에 있는 일련의 인터페이스를 통합 인터페이스로 묶어주는 역할을 하며 서브시스템을 더 편리하게 사용하기 위해 사용합니다.

![예시](https://velog.velcdn.com/images/lhr4884/post/836490f8-7c71-4a5c-aeb8-203fac8a8b9e/image.png)

예를 들어, 홈시어터를 구축한다고 가정해봅시다. 스트리밍 플레이어, 프로젝터, 자동 스크린, 서라운드 음향, 그리고 팝콘 기계까지 갖춘 시스템을 구성해 두었습니다. 이들은 클래스가 굉장히 많으며 서로 복잡하게 얽혀있습니다. 영화를 보려면 굉장히 많은 작업들을 처리해주어야 합니다. 이런 복잡한 일을 퍼사드 패턴으로 간단하게 처리할 수 있습니다.

![퍼사드패턴](https://velog.velcdn.com/images/lhr4884/post/b5ba9cdf-4ce6-4b10-afbe-4c15f74a47b2/image.png)
이로써 클라이언트는 서브시스템이 아닌 홈시어터 퍼사드에 있는 메소드를 호출할 수 있습니다.
사용자는 watchMovie()만 호출하면 조명, 스트리밍 플레이어, 프로젝터 등이 알아서 준비됩니다.

## Facade Pattern code

```c#
using System;

public class HomeTheaterFacade
{
    Amplifier amp;
    Tuner tuner;
    StreamingPlayer player;
    Projector projector;
    TheaterLights llights;
    Screen screen;
    PopcornPopper popper;

    public HomeTheaterFacade(Amplifier amp, Tuner tuner,
                        StreamingPlayer player,
                        Projector projector,
                        Screen screen,
                        TheaterLights lights,
                        PopcornPopper popper)
    {
        this.amp = amp;
        this.tuner = tuner;
        this.player = player;
        this.projector = projector;
        this.screen = screen;
        this.llights = lights;
        this.popper = popper;
    }

    public void watchMovie(String movie)
    {
        Console.WriteLine("영화 볼 준비 중");
        popper.on();
        popper.pop();
        llights.dim(10);
        screen.down();
        projector.on();
        projector.wideScreenMode();
        amp.on();
        amp.setStreamingPlayer(player);
        amp.setVolume(5);
        player.on();
        player.play(movie);
    }

    public void endMovie()
    {
        Console.WriteLine("홈시티어터를 끄는 중");
        popper.off();
        llights.on();
        screen.up();
        projector.off();
        amp.off();
        player.stop();
        player.off();
    }

    public class HomeTheaterTestDrive
    {

        static void Main(String[] args)
        {
            // 구성 요소 초기화

            HomeTheaterFacade homeTheater =
                new HomeTheaterFacade(amp, tuner, player,
                projector, screen, lights, popper);

            homeTheater.watchMovie("인디아나 존: 레이더스");
            homeTheater.endMovie();
        }
    }
}

```

## 결론

1. 퍼사드 패턴은 main이 쉽게 프로그래밍 하기 위해 사용합니다.
2. 퍼사드 패턴에서 이야기하는 서브시스템(syb system)은 써드파티 모듈이나 다른 패키지를 말합니다. (넓은 단위로 봐야 합니다.) 예를 들어, 오픈 소스를 사용하면서 버전업 할 때마다 이를 반영해야 한다면 퍼사드 패턴을 이용해 귀찮은 일들을 덜어줄 수 있습니다.
3. 이렇게 퍼사드는 써드파티에 대해 단순화 시키면서 운영 책임을 가지게 됩니다. 따라서 클라이언트는 써드파티의 복잡도를 모르고 운영해도 문제가 되지 않습니다.
4. 어댑터 같은 경우 기능이 바뀌었고 버전업이 되었는데 과거 레거시 코드를 바꾸는 행위가 리스크가 있을 때 어댑터로 새로운 기능으로 전환할 때 사용합니다.
