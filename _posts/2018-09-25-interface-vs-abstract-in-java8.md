---
layout: post
title: "자바8 에서 인터페이스와 추상클래스의 차이"
date: 2018-09-25
banner_image: java-banner.png
categories: [java]
tags: [java]
---

### 개요
자바8 부터 인터페이스도 메소드 구현부를 가질 수 있게 되면서, 추상클래스와 인터페이스의 차이가 모호해졌다. 이 부분에 대해서 정리해본다.
<!--more-->


<br/>

### 이 글은 왜 쓰게 되었는지

디자인 패턴 중 템플릿 메소드 패턴에 대해 정리해서 글을 쓰려고 했었다. 
템플릿 메소드 패턴에서는 템플릿 메소드와 hook 메소드를 분리하여 일정한 프로세스를 가진 기능을 hook 단위로 분리시킨다.
이때 추상클래스를 하나 만들고, 템플릿 메소드에서는 hook 메소드를 호출하고, 추상클래스를 상속받아 구현한 클래스에서 hook 메소드들을 구현하는 방식이다.  

그런데 <mark>자바8 부터는 인터페이스도 default 키워드를 통해 구현체를 가질 수 있는데 왜 추상클래스를 사용해야 하는지</mark>에 대한 의문이 생겼다.

개인적인 생각으로, 인터페이스를 사용해도 구현은 똑같이 할 수 있지만 추상클래스를 사용하여 hook 메소드들에 대한 엄격한 접근제어를 사용할 때, 
템플릿 메소드 패턴을 강제할 수 있다는 결론을 내렸다.

왜 그렇게 생각했는지에 대한 자세한 설명은 템플릿 메소드 패턴에 대한 글에서 다룰 예정이다.
일단 이 글에서는 템플릿 메소드 패턴에서 왜 추상클래스를 사용하는 것이 더 나은지, 자바8 이상 버전에서 추상클래스와 인터페이스의 차이를 분석한 내용을 정리한다.

<br/>

### 추상클래스 & 추상메소드

추상클래스는 abstract 라는 키워드와 함께 선언된 클래스이다 (추상 메소드를 포함할 수도 있고 하지 않을 수도 있다). 
추상클래스는 인스턴스화 될 수 없지만 상속될 수 있다. 

추상메소드는 아래와 같이 메소드 구현부가 없는 메소드이다.

```java
abstract void moveTo(double deltaX, double deltaY);
``` 

어떤 클래스가 추상메소드를 포함한다면 추상클래스로 선언되어야 한다.

```java
public abstract class GraphicObject {
   // declare fields
   // declare nonabstract methods
   abstract void draw();
}
```

추상클래스를 상속받는 클래스에서는 일반적으로 부모클래스에 있는 모든 추상메소드들을 구현한다. 그렇지 않은경우 해당 서브클래스 또한 abstract 로 선언되어야 한다.

> 참고 <br/>
인터페이스의 경우, default 또는 static 으로 선언되지 않은 모든 메소드는 암묵적으로 abstract 이기 때문에 abstract 제어자가 필요없다. (붙여도 상관은 없다)

<br/>


### 추상클래스 vs 인터페이스 (Java 8 기준)

* 추상클래스와 인터페이스는 인스턴스화 하는 것은 불가능하며, 구현부가 있는 메소드와 없는 메소드 모두 가질 수 있다는 점에서 유사하다. 
* 인터페이스에서 모든 변수는 기본적으로 public static final 이며, 모든 메소드는 public abstract 인 반면 <br/>
추상클래스에서는 static 이나 final 이 아닌 필드를 지정할 수 있고, public, protected, private 메소드를 가질 수 있다.
* 인터페이스를 구현하는 어떤 클래스는, 다른 여러개의 인터페이스들을 함께 구현할 수 있다.
추상클래스는 상속을 통해 구현되는데, 자바에서는 다중상속을 지원하지 않으므로 추상클래스를 상속받은 서브클래스는 다른 클래스를 상속받을 수 없다.

<br/>

### 추상클래스, 인터페이스의 적절한 사용 케이스
##### 추상클래스
* 관련성이 높은 클래스 간에 코드를 공유하고 싶은 경우
* 추상클래스를 상속받은 클래스들이 공통으로 가지는 메소드와 필드가 많거나, public 이외의 접근제어자(protected, private) 사용이 필요한 경우
* non-static, non-final 필드 선언이 필요한 경우. 즉, 각 인스턴스에서 state 변경을 위한 메소드를 선언할 수 있다.

##### 인터페이스
* 서로 관련성이 없는 클래스들이 인터페이스를 구현하게 되는 경우에 사용한다.
예를 들어, <mark>Comparable</mark>, <mark>Cloneable</mark> 인터페이스는 여러 클래스들에서 구현되는데, 구현클래스들 간에 관련성이 없는 경우가 대부분이다.
* 특정 데이터 타입의 행동을 명시하고 싶은데, 어디서 그 행동이 구현되는지는 신경쓰지 않는 경우.
* 다중상속을 허용하고 싶은 경우

<br/>


### JDK 에서 추상클래스와 인터페이스의 사용 예시

JDK 에서 추상클래스의 대표적인 예시는 Collections Framework 의 일부인 <mark>AbstractMap</mark> 이다. 
AbstractMap 의 서브클래스인 <mark>HashMap, TreeMap, ConcurrentHashMap</mark> 에서는
AbstractMap 에 정의되어 있는 <mark>get, put, isEmpty, containsKey, containsValue</mark> 등의 메소드를 공유한다.

여러개의 인터페이스를 구현하는 JDK 의 클래스 예시로는 <mark>HashMap</mark> 이 있다.
HashMap 은 <mark>Serializable, Cloneable, Map&lt;K,V&gt;</mark> 를 구현한 클래스이다.
위 인터페이스를 통해 HashMap 의 인스턴스는 복제가능하며, 직렬화(byte stream 으로 컨버팅)가 가능하며, map 으로써의 기능을 가진다는 것을 추론할 수 있다.


<br/>

### 마무리
Java 8 이전에는 추상클래스와 인터페이스의 차이에서 가장 크게 느껴졌던 부분은 <mark>인터페이스는 메소드 구현부를 가질 수 없지만, 
추상클래스에서는 가질 수 있다</mark> 는 것이었다.
이 큰 차이점 때문에 다른 중요한 부분들이 눈에 띄지 않았다.
하지만 Java 8 부터 인터페이스도 default 키워드를 사용해 메소드 구현부를 가질 수 있게 되면서 상당히 비슷해졌다고 할 수 있겠으나,
기존에도 있었지만 크게 신경쓰지 않았던(?) 둘의 차이점이 분명하게 드러나게 된 것 같다.

그래서 처음 가졌던 궁금증인, <mark>템플릿 메소드 패턴에서 왜 인터페이스가 아닌 추상클래스를 써야하는지</mark>에 대한 내가 내린 결론은
{% include href.html text="여기" url="https://yaboong.github.io/design-pattern/2018/09/27/template-method-pattern/" %} 에 정리했다.


<br/>

### 참고한 자료
* {% include href.html text="Oracle Java Tutorials - Abstract Methods and Classes" url="https://docs.oracle.com/javase/tutorial/java/IandI/abstract.html" %}