---
layout: post
title: "Java Memory Management - Garbage Collection"
date: 2018-06-09
banner_image: java-banner.png
categories: [java]
tags: [java, memory-management, garbage-collection]
---

### 개요
* Java 가비지 컬렉션에 대해서 공부한 내용을 정리해본다.
* Java 에서 메모리 관리는 어떻게 이루어지는지 이해하고 있으면 좋다.
* {% include href.html text="Java Memory Management" url="https://yaboong.github.io/java/2018/05/26/java-memory-management/" %} 를 먼저 읽는 것을 추천한다.
<!--more-->


<br/>

### Java Virtual Machine (JVM)
C 나 C++ 에서는 OS 레벨의 메모리에 직접 접근하기 때문에 free() 라는 메소드를 호출하여 할당받았던 메모리를 명시적으로 해제해주어야 한다.
그렇지 않으면 memory leak 이 발생하게 되고, 현재 실행중인 프로그램에서 memory leak 이 발생하면 다른 프로그램에도 영향을 끼칠 수 있다.

자바는 OS 의 메모리 영역에 직접적으로 접근하지 않고 JVM 이라는 가상머신을 이용해서 간접적으로 접근한다.
JVM 은 C 로 쓰여진 또 다른 프로그램인데, 오브젝트가 필요해지지 않는 시점에서 알아서 free() 를 수행하여 메모리를 확보한다.
웹 애플리케이션을 만들 때 모든 것을 다 직접 개발하여 쓰기보다 검증된 라이브러리나 프레임워크를 이용하는 것이 더 안전하고 편리한 것 처럼, 
메모리 관리라는 까다로운 부분을 자바 가상머신에 모두 맡겨버리는 것이다.

프로그램 실행시 JVM 옵션을 주어, OS에 요청한 사이즈 만큼의 메모리를 할당 받아서 할당받은 이상의 메모리를 사용하게 되면 에러가 나면서 자동으로 프로그램이 종료된다.
메모리 누수가 발생하더라도 현재 실행중인 자바 프로그램만 죽고, 다른 프로그램에는 영향을 주지 않는다.

이렇게 자바는 가상머신을 사용함으로써 (운영체제로 부터 독립적이라는 장점 외에도) OS 레벨에서의 memory leak 은 불가능하게 된다는 장점이 있다. 
물론 JVM 이 안정적으로 구현이 되었다는 가정하에 가능한 것이지만 JVM 이 안정적으로 구현이 되어있지 않다면 지금처럼 자바가 널리 사용되지 않았을 것이다.

자바가 메모리 누수현상을 방지하는 또 다른 방법이 가비지 컬렉션이다.

<br/>

### Garbage Collection
> Garbage collection was invented by John McCarthy around 1959 to simplify manual memory management in Lisp.  <cite> [Wiki] Garbage collection (computer science)</cite>

가비지 컬렉션이라는 개념은 자바에서 처음 사용된 것이 아니다. LISP 라는 언어에서 처음 도입된 개념이다. 하지만, 자바가 가비지 컬렉션이란 개념을 더욱 대중화 시킨데 기여한 부분은 있다.

프로그래머는 힙을 사용할 수 있는 만큼 자유롭게 사용하고, 더 이상 사용되지 않는 오브젝트들은 가비지 컬렉션을 담당하는 프로세스가 자동으로 메모리에서 제거하도록 하는 것이 가비지 컬렉션의 기본 개념이다.

자바는 가비지 컬렉션에 아주 단순한 규칙을 적용한다.

> Heap 영역의 오브젝트 중 stack 에서 도달 불가능한 (Unreachable) 오브젝트들은 가비지 컬렉션의 대상이 된다.

무슨말인지 정확히 이해되지 않는다면, {% include href.html text="Java Memory Management" url="https://yaboong.github.io/java/2018/05/26/java-memory-management/" %} 를 먼저 읽는 것을 추천한다.

<br/>


#### Garbage Collection 살짝 겉핥아보기
이제 간단한 코드를 살펴보면서 garbage collection 이 뭔지 살짝만 알아보자.

```java
public class Main {
    public static void main(String[] args) {
        String url = "https://";
        url += "yaboong.github.io";
        System.out.println(url);
    }
}
```

위 코드에서 

```java
String url = "https://";
```

구문이 실행된 뒤 스택과 힙은 아래와 같다.

{% include image_caption2_href.html height="30%" width="100%" caption="stack and heap" imageurl="https://s3.ap-northeast-2.amazonaws.com/yaboong-blog-static-resources/java/java-memory-management_heap-11.png" %}

다음 구문인 

```java
url += "yaboong.github.io";
```

문자열 더하기 연산이 수행되는 과정에서, (String 은 불변객체이므로) 기존에 있던 <mark>"https://"</mark> 스트링에 <mark>"yaboong.github.io"</mark> 를 덧붙이는 것이 아니라, 
문자열에 대한 더하기 연산이 수행된 결과가 새롭게 heap 영역에 할당된다.
그 결과를 그림으로 표현하면 아래와 같다.

{% include image_caption2_href.html height="30%" width="100%" caption="stack and heap" imageurl="https://s3.ap-northeast-2.amazonaws.com/yaboong-blog-static-resources/java/java-memory-management_heap-12.png" %}

Stack 에는 새로운 변수가 할당되지 않는다.
문자열 더하기 연산의 결과인 <mark>"https://yaboong.github.io"</mark> 가 새롭게 heap 영역에 생성되고, 기존에 <mark>"https://"</mark> 를 레퍼런스 하고 있던 url 변수는
새롭게 생성된 문자열을 레퍼런스 하게 된다.

> 기존의 <mark>"https://"</mark> 라는 문자열을 레퍼런스 하고 있는 변수는 아무것도 없다.

JVM 의 Garbage Collector 는 Unreachable Object 를 우선적으로 메모리에서 제거하여 메모리 공간을 확보한다.
Unreachable Object 란 Stack 에서 도달할 수 없는 Heap 영역의 객체를 말하는데, 지금의 예제에서 <mark>"https://"</mark> 문자열과 같은 경우가 되겠다.
아주 간단하게 이야기해서 이런 경우에 Garbage Collection 이 일어나게 되는 것이다.  

Garbage Collection 과정은 <mark>Mark and Sweep</mark> 이라고도 한다. 
JVM의 Garbage Collector 가 스택의 모든 변수를 스캔하면서 각각 어떤 오브젝트를 레퍼런스 하고 있는지 찾는과정이 Mark 다. 
Reachable 오브젝트가 레퍼런스하고 있는 오브젝트 또한 marking 한다.
첫번째 단계인 marking 작업을 위해 모든 스레드는 중단되는데 이를 stop the world 라고 부르기도 한다. (System.gc() 를 생각없이 호출하면 안되는 이유이기도 하다) 

그리고 나서 mark 되어있지 않은 모든 오브젝트들을 힙에서 제거하는 과정이 Sweep 이다.
  
Garbage Collection 이라고 하면 garbage 들을 수집할 것 같지만 실제로는 garbage 를 수집하여 제거하는 것이 아니라,
garbage 가 아닌 것을 따로 mark 하고 그 외의 것은 모두 지우는 것이다. 만약 힙에 garbage 만 가득하다면 제거 과정은 즉각적으로 이루어진다.

Garbage Collection 이 일어난 후의 메모리 상태는 아래와 같을 것이다.

{% include image_caption2_href.html height="30%" width="100%" caption="stack and heap" imageurl="https://s3.ap-northeast-2.amazonaws.com/yaboong-blog-static-resources/java/java-memory-management_heap-13.png" %}

<br/>

### System.gc()
System.gc() 를 호출하여 명시적으로 가비지 컬렉션이 일어나도록 코드를 삽입할 수 있지만, 모든 스레드가 중단되기 때문에 코드단에서 호출하는 짓은 하면 안된다. 
자바 도큐먼트를 보면 gc() 메소드에 대한 설명은 아래와 같다.

{% include image_caption_href.html title="System.gc()" caption="https://docs.oracle.com/javase/8/docs/api/" imageurl="https://s3.ap-northeast-2.amazonaws.com/yaboong-blog-static-resources/java/java-memory-management_gc-1.png" %}




<br/>

### 참고한 자료
* {% include href.html text="[Udemy] Java Memory Management" url="https://www.udemy.com/java-memory-management/" %}
* {% include href.html text="Visual GC Download link" url="https://visualvm.github.io/download.html" %}
* {% include href.html text="Integrating Native Methods into Java Programs" url="http://journals.ecs.soton.ac.uk/java/tutorial/native/index.html" %}
* {% include href.html text="Java 8 Docs" url="https://docs.oracle.com/javase/8/docs/api/" %}
* {% include href.html text="[Naver D2] Java Garbage Collection" url="https://d2.naver.com/helloworld/1329" %}

