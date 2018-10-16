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

{% include image_caption_href.html title="Adapter Pattern" caption="Adapter Pattern Sequence Diagram" imageurl="https://s3.ap-northeast-2.amazonaws.com/yaboong-blog-static-resources/diagram/adapter-pattern-2.png" %}

클라이언트에서는 Target Interface 를 호출하는 것 처럼 보인다.
하지만 클라이언트의 요청을 전달받은 (Target Interface 를 구현한) Adapter 는 자신이 감싸고 있는 Adaptee 에게 실질적인 처리를 위임한다.
Adapter 가 Adaptee 를 감싸고 있는 것 때문에 Wrapper 패턴이라고도 불린다.  

<br/>

### 어댑터 패턴 사용예시 1
Coursera 의 디자인 패턴 강의 중 어댑터 패턴에 나오는 예제를 조금 수정해서 구현해 보려한다.
이해를 돕기위해 어댑터 패턴의 설명에 불필요하다고 생각하는 메소드와 코드는 제거했다.

위에서 Client, Target Interface, Adapter, Adaptee 가 나오는 다이어그램을 그대로 구현한 코드다.
UML 을 그려보면 아래와 같다.

{% include image_caption_href.html title="Coursera Design Pattern 강의 중" caption="[그림2] Coursera Design Pattern 강의 중" imageurl="https://s3.ap-northeast-2.amazonaws.com/yaboong-blog-static-resources/diagram/adapter-pattern-3.png" %}
 
헷갈리지 않도록 위 그림과 코드에 사용되는 클래스들을 간단히 설명하면,

| **그림1** | **그림2** | **코드** |
|--------------|-------------|-----------------------------------------------------------------------------------------------------------|
| **Client** | WebClient | AdapterDemo |
| **Target Interface** | WebRequester | WebRequester |
| **Adapter** | WebAdapter | WebAdapter |
| **Adaptee** | WebService | FancyRequester |

시나리오는 다음과 같다.

기존에는 WebClient 에서는 요청에 대한 처리로 doWork() 메소드를 호출하는데, 이 처리는 WebRequester 인터페이스를 구현한 OldWebRequester 에게 위임하도록 되어있다.
이때, WebRequester 인터페이스를 구현한 OldWebRequester 의 requestHandler() 를 호출한다.
 
하지만 이 OldWebRequester 를 써드파티 라이브러리인 FancyWebRequester 로 변경해야하는 상황이 생겼다고 가정하자.
이때 어댑터 패턴을 적용하여 기존의 코드와 써드파티 라이브러리 어느쪽도 수정하지 않고 FancyWebRequester 를 적용할 수 있다.

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

doWork() 는 WebRequester 인터페이스를 구현한 클래스의 requestHandler() 메소드를 호출하여 동작한다.

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
시나리오상에서, 기존에 사용하고 있던 WebRequester 의 구현클래스로써, WebClient 에서 doWork() 를 호출하면 내부에서 호출되던 녀석이다.
설명의 편의를 위해 작성했을 뿐, 이 예제의 Client 에서는 사용되지 않는다.

<br/>

###### FancyWebRequester
```java
public class FancyRequester {
    public void fancyRequestHandler() {
        System.out.println("Yay! fancyRequestHandler is called!");
    }
}
```

사용할 써드파티 라이브러리인 FancyRequester 이다. Adaptee 가 되겠다. 

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

WebAdapter 는 Target Interface 인 WebRequester 인터페이스를 구현하고, 인스턴스 생성시 FancyRequester 클래스를 주입한다. 
(FancyRequester 는 보통 또다른 어떤 인터페이스를 구현한 클래스이겠지만, 굳이 또 만들면 이해하기 복잡해지니까 그냥 구현 클래스만 언급했다)

그리고 Target Interface 인 WebRequester 인터페이스의 requestHandler() 를 구현하는데, 
이때 주입시킨 FancyRequester 의 fancyRequestHandler() 메소드를 호출하도록 만든다.

이렇게 하면 WebAdapter 도 WebRequester 인터페이스를 구현했으므로, WebRequester 인터페이스의 구현체를 받아 동작하던 WebClient 에 WebAdapter 를 넘겨줄 수 있고,
기존에 WebClient 에서 requesterHandler() 메소드를 호출하던 코드는 그대로 두면서도,
WebAdapter 의 requestHandler() 를 통해 써드파티 라이브러리인 FancyRequester 를 사용할 수 있게 된다. 

<br/>

# 질문내용들

써드파티 라이브러리를 수정하면 안되니?
* 할수있으면 해. 근데 못하는 경우가 많지. 했다가도 예상치 못한 오류가 생길수도있고, 써드파티 라이브러리인데 수정하는 순간 라이브러리가 업데이트 되면, 업데이트 되는 거 맞춰서 내가 다 수정해줘야하는데.. 할수있으면 해.
 
우리쪽 코드를 수정하면 안되니?
* 할수있으면 해.
* 수정하려는 우리쪽 코드를 다른 어딘가에서 사용하고 있으면 어떡할거야?





<br/>

### 참고한 자료
* {% include href.html text="[javarevisited] Adapter Design Pattern in Java with Example" url="https://javarevisited.blogspot.com/2016/08/adapter-design-pattern-in-java-example.html?m=1" %}
* {% include href.html text="[위키] 어댑터 패턴" url="https://ko.wikipedia.org/wiki/어댑터_패턴" %}
* {% include href.html text="[Coursera] 2.1.6 - Adapter Pattern" url="https://www.coursera.org/lecture/design-patterns/2-1-6-adapter-pattern-RRZST" %}
* {% include href.html text="" url="" %}
* {% include href.html text="" url="" %}
* {% include href.html text="" url="" %}
* {% include href.html text="" url="" %}
* {% include href.html text="" url="" %}
* {% include href.html text="" url="" %}
* {% include href.html text="" url="" %}
* {% include href.html text="" url="" %}
* {% include href.html text="" url="" %}
* {% include href.html text="" url="" %}
* {% include href.html text="" url="" %}
* {% include href.html text="" url="" %}
* {% include href.html text="" url="" %}