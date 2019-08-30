---
layout: post
title: "스프링 - 생성자 주입을 사용해야 하는 이유, 필드인젝션이 좋지 않은 이유"
date: 2019-08-29
banner_image: spring.png
categories: [spring]
tags: [spring]
---

### 개요
* Dependency Injection (의존관계 주입) 이란
  * Setter Based Injection (수정자를 통한 주입)
  * Constructor based Injection (생성자를 통한 주입)
* 스프링에서 사용할 수 있는 DI 방법 세가지
* 생성자 주입을 이용한 순환참조 방지
* 생성자 주입이 테스트 코드 작성하기 좋은 이유

<!--more-->

### 서론
의존관계 주입을 받을때는 아무생각없이 당연하게 <mark>@Autowired</mark> 를 사용한 필드주입 방식을 사용해왔다.
그런데 어느날 갑자기(?) 인텔리제이에서 경고메시지를 보여준다는 것을 보게 되었다. 항상 경고는 표시되고 있었겠지만 무시하다가 갑자기 궁금해졌다.
필드인젝션을 사용하고 있는 <mark>@Autowired</mark> 에 하이라이트 표시가 되면서 나오는 경고메시지는

> Field injection is not recommended ... **Always** use constructor based dependency injection in your beans

왜~~~~~~~~~~~~~~~???? 심지어 <mark>Always</mark> 라네

<br/>

### Dependency Injection (의존관계 주입)
이유를 알기 위해서는 DI 에 대한 이해가 필요하다.
DI 는 스프링에서만 사용되는 용어가 아니라 객체지향 프로그래밍에서는 어디에서나 통용되는 개념이다.

###### 강한 결합
객체 내부에서 다른 객체를 생성하는 것은 <mark>강한 결합도</mark>를 가지는 구조이다.
A 클래스 내부에서 B 라는 객체를 직접 생성하고 있다면, B 객체를 C 객체로 바꾸고 싶은 경우에 A 클래스도 수정해야 하는 방식이기 때문에 강한 결합이다.

###### 느슨한 결합
객체를 주입 받는다는 것은 외부에서 생성된 객체를 인터페이스를 통해서 넘겨받는 것이다.
이렇게 하면 결합도를 낮출 수 있고, <mark>런타임시에 의존관계가 결정</mark>되기 때문에 유연한 구조를 가진다.

SOLID 원칙에서 O 에 해당하는 **Open Closed Principle** 을 지키기 위해서 디자인 패턴 중 전략패턴을 사용하게 되는데, 생성자 주입을 사용하게 되면 전략패턴을 사용하게 된다.

<br/>

### Setter Based Injection (수정자를 통한 주입)

의존관계 주입에는 크게 <mark>생성자 주입, 수정자 주입</mark> 두가지 방법이 있다.

코드를 한번 보자.
클래스나 인터페이스 이름만 Controller, Service, ServiceImpl 로 지정했지 스프링과는 상관이 없는 순수 자바로만 짜여진 코드이다.

먼저 수정자를 이용한 의존관계 주입을 보자.
```java
public class Controller {
    private Service service;

    public void setService(Service service) {
        this.service = service;
    }

    public void callService() {
        service.doSomething();
    }
}
```
```java
public interface Service {
    void doSomething();
}
```
```java
public class ServiceImpl implements Service {
    @Override
    public void doSomething() {
        System.out.println("ServiceImpl is doing something");
    }
}
```
```java
public class Main {
    public static void main(String[] args) {
        Controller controller = new Controller();

        // 어떤 구현체이든, 구현체가 어떤방법으로 구현되든 Service 인터페이스를 구현하기만 하면 된다.
        controller.setService(new ServiceImpl1());
        controller.setService(new ServiceImpl2());

        controller.setService(new Service() {
            @Override
            public void doSomething() {
                System.out.println("Anonymous class is doing something");
            }
        });

        controller.setService(
          () -> System.out.println("Lambda implementation is doing something")
        );

        // 어떻게든 구현체를 주입하고 호출하면 된다.
        controller.callService();
    }
}
```

(참고) 익명클래스나 람다로 구현할 수 있었던 것은 Service 인터페이스가 함수형 인터페이스이기 때문이다.

* <mark>Controller</mark> 클래스의 callService() 메소드는 <mark>Service 타입의 객체에 의존</mark>하고 있다.
* Service 는 인터페이스이고, 인터페이스는 인스턴스화 할 수 없으므로 인터페이스의 구현체가 필요하다.
* Service 인터페이스를 구현하기만 했다면 어떤 타입의 객체라도 Controller 에서 사용할 수 있는데 (다형성) Controller 는 이 구현체의 내부 동작을 **아무 것도 알지 못하고 알 필요도 없다.**
* main 함수에서 Controller 클래스를 사용하는 것을 보면, 수정자 메소드인 setService() 에 Service
인터페이스의 구현체만 넘겨주면 된다.

**어떤 구현체이든, 구현체가 어떤방법으로 구현되든, Service 인터페이스를 구현하기만 하면 된다.**

> 신박하다?

수정자 주입으로 의존관계 주입은 런타임시에 할 수 있도록 <mark>낮은 결합도</mark>를 가지게 구현되었다.
하지만 문제는 수정자를 통해서 Service 의 구현체를 주입해주지 않아도 Controller 객체는 생성가능하다.
Controller 객체가 생성가능하다는 것은 내부에 있는 callService() 메소드도 호출 가능하다는 것인데,
callService() 메소드는 service.doSomething() 을 호출하고 있으므로

> NullPointerException 이 발생한다.

> 주입이 필요한 객체가 주입이 되지 않아도 얼마든지 객체를 생성할 수 있다는 것이 문제다.

이 문제를 해결 할 수 있는 방법이 생성자 주입이다.

<br/>

### Constructor based Injection (생성자를 통한 주입)
Controller 에 setter 를 없애고, 생성자를 이용해서 주입한다.
```java
public class Controller {
    private Service service;

    public Controller(Service service) {
        this.service = service;
    }

    public void callService() {
        service.doSomething();
    }
}
```

이렇게 생성자 주입을 해주면 사용하는 쪽은 아래와 같이 바뀐다.
```java
public class Main {
    public static void main(String[] args) {

        // Controller controller = new Controller(); // 컴파일 에러

        Controller controller1 = new Controller(new ServiceImpl());
        Controller controller2 = new Controller(
            () -> System.out.println("Lambda implementation is doing something")
        );
        Controller controller3 = new Controller(new Service() {
            @Override
            public void doSomething() {
                System.out.println("Anonymous class is doing something");
            }
        });

        controller1.callService();
        controller2.callService();
        controller3.callService();
    }
}
```

이를 통해 두가지 이득과 한가지 보너스 이득이 생긴다.

1. null 을 주입하지 않는 한 <mark>NullPointerException 은 발생하지 않는다.</mark>
2. <mark>의존관계 주입을 하지 않은 경우</mark>에는 Controller <mark>객체를 생성할 수 없다.</mark>
즉, 의존관계에 대한 내용을 외부로 노출시킴으로써 컴파일 타임에 오류를 잡아낼 수 있다.

보너스 이득은 final 을 사용할 수 있다는 것이다.
final 로 선언된 레퍼런스타입 변수는 반드시 선언과 함께 초기화가 되어야 하므로 setter 주입시에는 의존관계 주입을 받을 필드에 final 을 선언할 수 없다.
```java
public class Controller {
    private final Service service; // final 추가

    public Controller(Service service) {
        this.service = service;
    }

    public void callService() {
        service.doSomething();
    }
}
```
final 의 장점은 누군가가 Controller 내부에서 service 객체를 바꿔치기 할 수 없다는 점이다.

스프링에서 필드주입은 수정자를 통한 주입과 유사한 방식으로 이루어진다.
이제 슬슬 생성자 주입의 장점이 보이기 시작한다.

<br/>

### 스프링에서의 DI 방법 세가지
스프링에서는 수정자 주입, 생성자 주입과 더불어 필드 주입이란걸 할 수 있다.
필드 주입은 수정자를 통한 주입과 유사한 방식으로 이루어지기 때문에,
<mark>수정자를 통한 주입의 단점은 Field Injection 을 사용할 때의 단점을 그대로 가진다.</mark>

더불어, 수정자 주입은 스프링 컨테이너가 아닌 외부에서 수정자를 호출해서 주입할 수 있는 방법이라도 열려있지만,
필드주입은 스프링 컨테이너 말고는 외부에서 주입할 수 있는 방법이 없다.

아래는 각 DI 방법에 대한 간단한 예제다.
뒤에서도 쓰기 위해서 예제를 Student, Course 관련된 내용으로 변경했다.

**Field Injection**
```java
@Service
public class StudentServiceImpl implements StudentService {

    @Autowired
    private CourseService courseService;

    @Override
    public void studentMethod() {
        courseService.courseMethod();
    }

}
```

**Setter based Injection**
```java
@Service
public class StudentServiceImpl implements StudentService {

    private CourseService courseService;

    @Autowired
    public void setCourseService(CourseService courseService) {
        this.courseService = courseService;
    }

    @Override
    public void studentMethod() {
        courseService.courseMethod();
    }
}
```

**Constructor based Injection**
```java
@Service
public class StudentServiceImpl implements StudentService {

    private final CourseService courseService;

    @Autowired
    public StudentServiceImpl(CourseService courseService) {
        this.courseService = courseService;
    }

    @Override
    public void studentMethod() {
        courseService.courseMethod();
    }
}
```

인텔리제이에서 보여주는 경고메시지는 위 두 예제 중 아래에 있는 Constructor based Injection 을 사용하라는 것이다.

지금까지 살펴본 생성자 주입의 장점은
* <mark>NullPointerException</mark> 을 방지할 수 있다.
* 주입받을 필드를 <mark>final</mark> 로 선언 가능하다.

정도인데 또 다른 장점을 소개하고자 한다. 이는 스프링에서만 유용한 방법인 것 같다.

<br/>

### 생성자 주입을 이용한 순환참조 방지
개발하다보면 여러 서비스들 간에 의존관계가 생기게 되는 경우가 있다.
이 예제에서는 CourseService 에서 StudentService 에 의존하고,
StudentService 가 CourseService 에 의존하는 경우를 볼 것이다.

**Field Injection 의 경우**
```java
public interface CourseService {
    void courseMethod();
}
```

```java
@Service
public class CourseServiceImpl implements CourseService {

    @Autowired
    private StudentService studentService;

    @Override
    public void courseMethod() {
        studentService.studentMethod();
    }
}
```

```java
public interface StudentService {
    void studentMethod();
}
```

```java
@Service
public class StudentServiceImpl implements StudentService {

    @Autowired
    private CourseService courseService;

    @Override
    public void studentMethod() {
        courseService.courseMethod();
    }
}
```

이 상황은 StudentServiceImple 의 studentMethod() 는 CourseServiceImpl 의 courseMethod() 를 호출하고,
CourseServiceImpl 의 courseMethod() 는 StudentServiceImple 의 studentMethod() 를 호출하고 있는 상황이다.
서로서로 주거니 받거니 호출을 반복하면서 끊임없이 호출하다가 결국 <mark>StackOverflowError</mark> 를 발생시키고 죽는다.

```
2019-08-28 00:14:56.042 ERROR 46104 --- [nio-8080-exec-1] o.a.c.c.C.[.[.[/].[dispatcherServlet]    : Servlet.service() for servlet [dispatcherServlet] in context with path [] threw exception [Handler dispatch failed; nested exception is java.lang.StackOverflowError] with root cause


java.lang.StackOverflowError: null
    at com.yaboong.alterbridge.tmp.CourseServiceImpl.courseMethod(CourseServiceImpl.java:26) ~[classes/:na]
    at com.yaboong.alterbridge.tmp.StudentServiceImpl.studentMethod(StudentServiceImpl.java:25) ~[classes/:na]
    at com.yaboong.alterbridge.tmp.CourseServiceImpl.courseMethod(CourseServiceImpl.java:26) ~[classes/:na]
    at com.yaboong.alterbridge.tmp.StudentServiceImpl.studentMethod(StudentServiceImpl.java:25) ~[classes/:na]
    at com.yaboong.alterbridge.tmp.CourseServiceImpl.courseMethod(CourseServiceImpl.java:26) ~[classes/:na]
…
…
…
```

이게 순환참조의 문제인데, 실제 코드가 호출이 되기 전까지는 아무것도 알지 못한다. 스프링 애플리케이션 구동도 너무나 잘된다.
여기서 궁금했던게 하나 있다.

> 왜 빈 생성이 잘 되는거지...?

수정자 주입이나 필드 주입시에 스프링 <mark>ApplicationContext</mark> 를 통해서 현재 로딩된 빈 목록을 출력하면 사이클 호출 로직을 가진 두개의 빈이 모두 떠있는 것을 확인할 수 있었다. 아니 사이클 호출을 하고 있는데 빈이 어떻게 생성될 수 있는거지? 생성은 안하고 빈 목록만 가지고 있다가 lazy 로딩하는 방식인건가? 근데 따로 lazy init 옵션을 주지 않으면 lazy 로딩은 적용 되지 않는다던데...? 

여기저기 물어보니 한분이 명쾌한 답변을 주셨는데 '아 멍청이' 하는 생각이 들었다. (혹시 보고 계신다면 다시한번 감사드립니다 ㅋ ㅋ) 
<mark>객체생성시점에서 순환참조가 일어나는 것</mark>과 <mark>객체생성 후 비즈니스 로직상에서 순환참조가 일어나는 것</mark>은 완전히 다른 이야기인데, 하나로 묶어서 생각하고 있었기 때문에 이런 이상한 질문에 빠졌던 것이다.

> 필드 주입이나, 수정자 주입은 객체 생성시점에는 순환참조가 일어나는지 아닌지 발견할 수 있는 방법이 없다.


**Constructor based Injection 의 경우**
```java
@Service
public class CourseServiceImpl implements CourseService {

    private final StudentService studentService;

    @Autowired
    public CourseServiceImpl(StudentService studentService) {
        this.studentService = studentService;
    }

    @Override
    public void courseMethod() {
        studentService.studentMethod();
    }
}
```

```java
@Service
public class StudentServiceImpl implements StudentService {

    private final CourseService courseService;

    @Autowired
    public StudentServiceImpl(CourseService courseService) {
        this.courseService = courseService;
    }

    @Override
    public void studentMethod() {
        courseService.courseMethod();
    }
}
```

이 경우에도 애플리케이션이 구동이 잘 될까? 실행해보면 아래와 같은 로그가 찍히면서 앱 구동이 실패한다.
```
***************************
APPLICATION FAILED TO START
***************************

Description:

The dependencies of some of the beans in the application context form a cycle:

┌─────┐
|  courseServiceImpl defined in file [/Users/yaboong/.../CourseServiceImpl.class]
↑     ↓
|  studentServiceImpl defined in file [/Users/yaboong/.../StudentServiceImpl.class]
└─────┘
```

빈 생성시 아래와 같은 로직이 수행되면서 어떤 시점에 스프링이 그것을 캐치해서 순환참조라고 알려주는 것 같다.

```java
new CourseServiceImpl(new StudentServiceImpl(new CourseServiceImpl(new ...)))
```

이처럼 생성자 주입을 사용하면 객체 간 순환참조를 하고 있는 경우에 스프링 애플리케이션이 구동되지 않는다.

> 컨테이너가 빈을 생성하는 시점에서 객체생성에 사이클관계가 생기기 때문이다!

수정자 주입을 사용하면 아주 잘 구동되고 순환참조를 하고 있는 부분에 대한 호출이 이루어질 경우 StackOverflowError 를 뱉기 때문에,
오류를 뱉을 수 밖에 없는 로직을 품고 애플리케이션이 구동되는 것이다.

마지막으로, 생성자 주입을 사용하면 단위테스트 작성하기가 좋아진다.

<br/>


### 테스트 코드 작성하기 좋다
아직 테스트 코드를 열심히 짜보거나 하지는 않았지만, 요즘 테스트 코드의 중요성을 깨닫고 공부를 하고 있는 중이다. (참 일찍도 깨달았다 미련한 것)

<mark>CourserServiceImpl</mark> 이 가진 메소드들에 대해서 단위테스트를 수행하고 싶은 경우,
field injection 을 사용해서 작성된 클래스라면 단위테스트시 의존관계를 가지는 객체를 생성해서 주입할 수가 없다.
**할 수 있는 방법이 없다!** 스프링의 IoC 컨테이너가 다 생성해서 주입해 주는 방식이고 외부로 노출되어 있는 것이 하나도 없기 때문이다.
그래서 의존관계를 가지고 있는 메소드의 단위테스트를 작성하면 (courseMethod() 같은) <mark>NullPointerException</mark> 이 발생한다.

하지만, constructor based injection 을 사용해 작성된 클래스라면 <mark>CourseServiceImpl</mark> 객체를 생성할 때
원하는 구현체를 넘겨주면 되고, 구현체를 넘겨주지 않은 경우에는 객체생성 자체가 불가능하기 때문에 테스트하기도 편하다.

<br/>

### 요약
<mark>생성자 주입방식</mark>은 아래와 같은 장점을 가진다
* 의존관계 설정이 되지 않으면 객체생성 불가 -> 컴파일 타임에 인지 가능, NPE 방지
* 의존성 주입이 필요한 필드를 final 로 선언가능 -> Immutable
* (스프링에서) 순환참조 감지가능 -> 순환참조시 앱구동 실패
* 테스트 코드 작성 용이

<mark>필드 인젝션</mark>은 아래와 같은 장점을 가진다
* 편하다는 것 말고는 없다

<br/>

### 주저리
생성자 주입 방식의 장점으로...
주입받는 객체가 많아지는 경우 생성자가 길어지기 때문에 위기감을 느껴서 리팩토링을 하게 된다...
SRP(Single Responsibility Principle) 이 깨진것을 파악할 수 있다..
와 같은 이야기를 하는 곳도 있는데..
뭔가.. 손꼽히는 장점이라고 하기에는 좀.. 우기는 것 같은 느낌이 있어서 그냥 내가 다른 자료들 찾아보면서 장점이라고 생각되는 것들 위주로 정리해봤다.

<br/>

### 마무리
이제 생성자 주입을 써야할 이유가 생겼다 ~~~



<br/>

### 참고한 자료
* {% include href.html text="[StackOverflow] Injecting @Autowired private field during testing" url="https://stackoverflow.com/questions/16426323/injecting-autowired-private-field-during-testing" %}
* {% include href.html text="[StackOverflow] Spring @Autowire on Properties vs Constructor" url="https://stackoverflow.com/questions/40620000/spring-autowire-on-properties-vs-constructor" %}
* {% include href.html text="[Oliver Gierke] Why field injection is evil (이사람 스프링 컨트리뷰터임)" url="http://olivergierke.de/2013/11/why-field-injection-is-evil/" %}
