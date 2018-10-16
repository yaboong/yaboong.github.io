---
layout: post
title: "디자인패턴 - 어댑터 패턴"
date: 2018-10-15
banner_image: java-banner.png
categories: [design-pattern]
tags: [design-pattern, java, oop]
---

### 개요
* 어댑터 패턴에 대해서 알아본다.
* Rectangle, Bird,   
* JDK 에 사용된 어댑터 패턴을 살펴본다.
<!--more-->


<br/>

### 어댑터 패턴
어댑터 패턴은 이름대로 어댑터처럼 사용되는 패턴이다. 220V 를 사용하는 한국에서 쓰던 기기들을, 어댑터를 사용하면 110V 를 쓰는곳에 가서도 그대로 쓸 수 있다.
이처럼, 호환성이 없는 인터페이스 때문에 함께 동작할 수 없는 클래스들이 함께 작동하도록 해주는 패턴이 어댑터 패턴이라고 할 수 있겠다.
이를 위해 어댑터 역할을 하는 클래스를 새로 만들어야 한다.

기존에 있는 시스템에 새로운 써드파티 라이브러리가 추가된다던지, 
레거시 인터페이스를 새로운 인터페이스로 교체하는 경우에 코드의 재사용성을 높일 수 있는 방법이 어댑터 패턴을 사용하는 것이다.

구조를 보면 아래와 같다.

{% include image_caption_href.html title="Adapter Pattern" caption="[그림1] Coursera Design Pattern 강의 중" imageurl="https://s3.ap-northeast-2.amazonaws.com/yaboong-blog-static-resources/diagram/adapter-pattern-1.png" %}

**Client** <br/>써드파티 라이브러리나 외부시스템을 사용하려는 쪽이다. 

**Adaptee** <br/>써드파티 라이브러리나 외부시스템을 의미한다.

**Target Interface** <br/>Adapter 가 구현(implements) 하는 인터페이스이다. 클라이언트는 Target Interface 를 통해 Adaptee 인 써드파티 라이브러리를 사용하게 된다.

**Adapter** <br/> 
Client 와 Adaptee 중간에서 호환성이 없는 둘을 연결시켜주는 역할을 담당한다.
Target Interface 를 구현하며, 클라이언트는 Target Interface 를 통해 어댑터에 요청을 보낸다.
어댑터는 클라이언트의 요청을 Adaptee 가 이해할 수 있는 방법으로 전달하고, 처리는 Adaptee 에서 이루어진다.

<br/>

### 어댑터 패턴 호출 과정

{% include image_caption_href.html title="Adapter Pattern" caption="[그림2]Adapter Pattern Sequence Diagram" imageurl="https://s3.ap-northeast-2.amazonaws.com/yaboong-blog-static-resources/diagram/adapter-pattern-2.png" %}

클라이언트에서는 Target Interface 를 호출하는 것 처럼 보인다.
하지만 클라이언트의 요청을 전달받은 (Target Interface 를 구현한) Adapter 는 자신이 감싸고 있는 Adaptee 에게 실질적인 처리를 위임한다.
Adapter 가 Adaptee 를 감싸고 있는 것 때문에 Wrapper 패턴이라고도 불린다.  

<br/>

### 어댑터 패턴 사용예제
Coursera 의 디자인 패턴 강의 중 어댑터 패턴에 나오는 예제를 조금 수정해서 구현해 보려한다.
이해를 돕기위해 어댑터 패턴의 설명에 불필요하다고 생각하는 메소드와 코드는 제거했다.

위에서 Client, Target Interface, Adapter, Adaptee 가 나오는 다이어그램을 그대로 구현한 코드다.
UML 을 그려보면 아래와 같다.

{% include image_caption_href.html title="Coursera Design Pattern 강의 중" caption="[그림3] Coursera Design Pattern 강의 중" imageurl="https://s3.ap-northeast-2.amazonaws.com/yaboong-blog-static-resources/diagram/adapter-pattern-3.png" %}
 
헷갈리지 않도록 위 그림과 코드에 사용되는 클래스들을 간단히 설명하면,

| **그림1** | **그림3** | **코드** |
|--------------|-------------|--------------------------|
| **Client** | WebClient | AdapterDemo |
| **Target Interface** | WebRequester | WebRequester |
| **Adapter** | WebAdapter | WebAdapter |
| **Adaptee** | WebService | FancyRequester |

시나리오는 다음과 같다.

기존에는 <mark>WebClient</mark> 에서는 요청에 대한 처리로 doWork() 메소드를 호출하는데, 이 처리는 <mark>WebRequester</mark> 인터페이스를 구현한 OldWebRequester 에게 위임하도록 되어있다.
이때, <mark>WebRequester</mark> 인터페이스를 구현한 OldWebRequester 의 requestHandler() 를 호출한다.
 
하지만 이 OldWebRequester 를 써드파티 라이브러리인 <mark>FancyRequester</mark> 로 변경해야하는 상황이 생겼다고 가정하자.
이때 어댑터 패턴을 적용하여 기존의 코드와 써드파티 라이브러리 어느쪽도 수정하지 않고 <mark>FancyRequester</mark> 를 적용할 수 있다.

코드를 보자.

###### WebRequester <<Interface>> 
```java
public interface WebRequester {
    void requestHandler();
}
```
Target Interface 이다. 구현체를 가지지 않고 requestHandler() 메소드에 대한 정의만 되어있다. 

<br/>


###### WebClient
```java
public class WebClient {
    private WebRequester webRequester;

    public WebClient(WebRequester webRequester) {
        this.webRequester = webRequester;
    }

    public void doWork() {
        webRequester.requestHandler();
    }
}
```

doWork() 는 <mark>WebRequester</mark> 인터페이스를 구현한 클래스의 requestHandler() 메소드를 호출하여 동작한다.

<br/>

###### OldWebRequester
```java
public class OldWebRequester implements WebRequester {
    @Override
    public void requestHandler() {
        System.out.println("OldWebRequester is working");
    }
}
```
시나리오상에서, 기존에 사용하고 있던 <mark>WebRequester</mark> 의 구현클래스로써, <mark>WebClient</mark> 에서 doWork() 를 호출하면 내부에서 호출되던 녀석이다.
설명의 편의를 위해 작성했을 뿐, 이 예제의 Client 에서는 사용되지 않는다.

<br/>

###### FancyRequester
```java
public class FancyRequester {
    public void fancyRequestHandler() {
        System.out.println("Yay! fancyRequestHandler is called!");
    }
}
```

사용할 써드파티 라이브러리인 <mark>FancyRequester</mark> 이다. Adaptee 가 되겠다. 

<br/>

###### WebAdapter
```java
public class WebAdapter implements WebRequester {
    private FancyRequester fancyRequester;

    public WebAdapter(FancyRequester fancyRequester) {
        this.fancyRequester = fancyRequester;
    }

    @Override
    public void requestHandler() {
        fancyRequester.fancyRequestHandler();
    }
}
```

어댑터를 위와같이 작성해준다. 

<mark>WebAdapter</mark> 는 Target Interface 인 <mark>WebRequester</mark> 인터페이스를 구현하고, 인스턴스 생성시 <mark>FancyRequester</mark> 클래스를 주입한다. 
(FancyRequester 는 보통 또다른 어떤 인터페이스를 구현한 클래스이겠지만, 굳이 또 만들면 이해하기 복잡해지니까 그냥 구현 클래스만 언급했다)

그리고 Target Interface 인 <mark>WebRequester</mark> 인터페이스의 requestHandler() 를 구현하는데, 
이때 주입시킨 <mark>FancyRequester</mark> 의 fancyRequestHandler() 메소드를 호출하도록 만든다.

이렇게 하면 <mark>WebAdapter</mark> 도 <mark>WebRequester</mark> 인터페이스를 구현했으므로, <mark>WebRequester</mark> 인터페이스의 구현체를 받아 동작하던 <mark>WebClient</mark> 에 <mark>WebAdapter</mark> 를 넘겨줄 수 있고,
기존에 <mark>WebClient</mark> 에서 requesterHandler() 메소드를 호출하던 코드는 그대로 두면서도,
<mark>WebAdapter</mark> 의 requestHandler() 를 통해 써드파티 라이브러리인 <mark>FancyRequester</mark> 를 사용할 수 있게 된다. 

<br/>

###### 실행
```java
public class AdapterDemo {
    public static void main(String[] args) {
        WebAdapter adapter = new WebAdapter(new FancyRequester());
        WebClient client = new WebClient(adapter);
        client.doWork();
    }
}
```

위 예제 코드로 실행해보면 <mark>FancyRequester</mark> 가 동작하는 것을 확인할 수 있다.

<br/>

### WHY
> 애초에 두개의 인터페이스가 달라서 호환이 안된다면, 하나를 바꿔서 되게 하던지, 아니면 둘다 바꾸면 되지 않나?

예제에서는 이해를 돕기위해 <mark>FancyRequester</mark> 를 인터페이스를 만들지도 않았고 클래스 내부도 훤히 들여다 볼 수 있다.
하지만, <mark>FancyRequester</mark> 가 오픈소스가 아니라 미리 컴파일된 클래스 바이너리 파일만을 제공받은 써드파티 라이브러리라면 직접적인 접근이 불가능 할 수 있다.
직접적으로 접근할 수 있는 경우라 하더라도 Adaptee 쪽에서 우리가 변경한 코드로 인해 라이브러리나 벤더쪽 시스템 전체가 깨질 수도 있다.

> 그러면 우리쪽 인터페이스를 수정하면 되지 않나?

가능할 수 있다. 하지만 바꾸려는 우리쪽 인터페이스를 우리 시스템의 다른 어딘가에서 사용하고 있다면? 그 부분도 수정해줘야 한다.
우리쪽 인터페이스를 수정하고, 이에 영향을 받는 부분들을 수정하다가 예기치 못한 오류가 발생할 가능성이 매우 크다. 

<br/>

### JDK 에 사용된 어댑터 패턴
어댑터 패턴이 적용된 가장 대표적인 예가 자바의 <mark>InputStreamReader</mark> 이다.
콘솔에서 입력을 받을 때 아래와 같이 사용하는 것을 본 적이 있을 것이다. (알고리즘 문제풀때 자바로 하면 <mark>Scanner</mark> 클래스를 사용하지 않고 이렇게 많이 했던 것 같다)

```java
BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
```

<mark>BufferedReader</mark> 클래스를 까서 위 구문이 실행될때 사용되는 생성자를 보면 아래와 같이 <mark>Reader</mark> 타입을 받는다.

```java
public BufferedReader(Reader in) {
    this(in, defaultCharBufferSize);
}
```

하지만 System.in 은 <mark>InputStream</mark> 타입을 반환한다. 

```java
public final static InputStream in = null;
```

자바의 InputStream 은 바이트 스트림을 읽어들인다. 하지만, BufferedReader 는 캐릭터인풋 스트림을 읽어들인다.
둘은 호환되지 않는다. 하지만, 이 둘을 연결시켜 주는 어댑터가 <mark>InputStreamReader</mark> 클래스이다.
UML 로 보면 아래와 같은 구조다.

{% include image_caption_href.html title="Adapter Pattern used in JDK" caption="Adapter Pattern used in JDK" imageurl="https://s3.ap-northeast-2.amazonaws.com/yaboong-blog-static-resources/diagram/adapter-pattern-4.png" %}


<mark>BufferedReader</mark> 클래스는 <mark>Reader</mark> 클래스를 상속받는다. (Reader 클래스는 Readable 인터페이스를 구현한 추상클래스이다),
<mark>InputStreamReader</mark> 클래스도 <mark>Reader</mark> 클래스를 상속받는다.
둘 다 <mark>Reader</mark> 클래스의 서브클래스 이므로 <mark>Reader</mark> 타입으로 레퍼런스 할 수 있다.

그리고 <mark>InputStreamReader</mark> 클래스는 <mark>InputStream</mark> 타입을 받을 수 있는 생성자를 가지고 있으므로,
System.in 을 <mark>InputStreamReader</mark> 인스턴스 생성시 넘겨주는 방식이다.

<mark>InputStreamReader</mark> 클래스를 Adapter, <mark>System.in</mark> 을 Adaptee, <mark>Reader</mark> 를 Target Interface 라고 할 수 있겠다.

<br/>

### 어댑터 패턴 정리
* Adaptee 를 감싸고, Target Interface 만을 클라이언트에게 드러낸다.
* Target Interface 를 구현하여 클라이언트가 예상하는 인터페이스가 되도록 Adaptee 의 인터페이스를 <mark>간접적으로</mark> 변경한다.
* Adaptee 가 기대하는 방식으로 클라이언트의 요청을 간접적으로 변경한다.
* 호환되지 않는 우리의 인터페이스와 Adaptee 를 함께 사용할 수 있다.

<br/>

### 결론
사용해야하는 인터페이스가 현재의 시스템과 호환되지 않는다고 해서 현재의 시스템을 변경을 해야하는 것은 아니다.




<br/>

### 참고한 자료
* {% include href.html text="[Coursera - University of Alberta] Design Patterns 2.1.6 - Adapter Pattern" url="https://www.coursera.org/lecture/design-patterns/2-1-6-adapter-pattern-RRZST" %}
* {% include href.html text="[HowToDoInJava] Adapter Design Pattern in Java" url="https://howtodoinjava.com/design-patterns/structural/adapter-design-pattern-in-java/" %}
* {% include href.html text="[JENKOV.COM] Java IO: InputStream" url="http://tutorials.jenkov.com/java-io/inputstream.html" %}

