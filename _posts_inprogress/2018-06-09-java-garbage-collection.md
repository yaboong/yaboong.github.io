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
* 모니터링 툴 VisualVM 과 VisualGC 에 대해 알아본다.
* Heap 영역은 세부적으로 어떻게 구성이 되는지 살펴보고, 각 영역의 역할에 대해 간략하게 알아본다.
* Heap Dump 를 통해 Memory Leak 에 대한 추적은 어떻게 가능한지 알아본다.
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

> System.gc() 호출하는게 하면 안되는 짓이라는데 한번 해보자.

아무것도 하지 않고 시간만 측정하는 코드다.

```java
public class GCTimeCheck {
    public static void main(String[] args) {
        long startTime = System.nanoTime();
        long endTime = System.nanoTime();
        System.out.println(endTime - startTime + "ns");
    }
}
``` 

내 피씨에서는 275ns 가 나온다. 275 나노초면 0.000000275초의 시간이다. 아무것도 하는게 없는 코드니까 당연히 엄청 빠르다.
이제 startTime, endTime 사이에 System.gc() 를 심어보자. 

* 가비지 컬렉션이 수행되는지 보려면 jvm 옵션으로 <mark>-verbose:gc</mark> 를 주면 된다.
* 어떤 가비지 컬렉터를 사용하고 있는지 보기위해 jvm 옵션으로 <mark>-XX:+PrintCommandLineFlags</mark> 도 주고 시작하자.
* IntelliJ 라면 Edit Configurations -> VM options -> <mark>-verbose:gc -XX:+PrintCommandLineFlags</mark> 를 입력하면 된다.

```java
public class GCTimeCheck {
    public static void main(String[] args) {
        long startTime = System.nanoTime();
        System.gc();
        long endTime = System.nanoTime();
        System.out.println(endTime - startTime + "ns");
    }
}
```

실행결과는 아래와 같다.

```bash
-XX:InitialHeapSize=134217728 -XX:MaxHeapSize=2147483648 -XX:+PrintCommandLineFlags -XX:+PrintGC -XX:+UseCompressedClassPointers -XX:+UseCompressedOops -XX:+UseParallelGC 
[GC (System.gc())  2673K->536K(125952K), 0.0013911 secs]
[Full GC (System.gc())  536K->428K(125952K), 0.0048825 secs]
6959381ns
```

첫번째 라인은 <mark>-XX:+PrintCommandLineFlag</mark> 에 의해 출력된 값들이고,
두번째 세번째 라인은 <mark>-verbose:gc</mark> 옵션을 주어 가비지 컬렉션이 일어날때 자동출력된 부분이다.

첫번째 라인의 마지막을 보면 <mark>-XX:+UseParallelGC</mark> 옵션이 있는데 <mark>ParallelGC</mark> 라는 가비지 컬렉터를 사용하고 있다는 것이다.

어쨌든 실행시간에 대한 결과를 보면 6959381 나노초가 나온다. 0.006959381 초의 시간이다. JVM 옵션을 모두 제거하고 돌려도 비슷한 시간이 나온다.
System.gc() 를 호출하기 전에 275 나노초, 호출하면 6959381 나노초. 
아무역할도 하지 않는 코드로 단순히 산술적 비교를 하는 것이 무의미할 수도 있지만, 호출하면 안될 것 같다는 위험성은 느껴진다. 

<br/>

### System.gc() 소스까보기
System.gc() 를 타고 들어가면 아래와 같이 생겼다.

```java
public static void gc() {
    Runtime.getRuntime().gc();
}
```

Runtime.getRuntime().gc() 를 타고 들어가면, 

```java
public native void gc();
```
이게 끝이다.

native 라는 키워드가 붙은 메소드는 자바가 아닌 다른 프로그래밍 언어로 쓰여진 메소드를 말한다. 
JVM 이 C 언어 로 쓰여졌으니까 아마 C 언어로 작성되었을 것 같다.
어쨌든 자바의 영역을 벗어나니까 일단 넘어가자.

<br/>


### 가비지 컬렉션 눈으로 확인하기
OutOfMemoryError 를 빨리내기 위해서 jvm 옵션으로 <mark>-Xmx16m -verbose:gc</mark> 를 주고 시작하자.
-Xmx 는 힙영역의 최대 사이즈 를 설정하는 것이다. 16MB 로 설정했다.

코드는 아래와 같다.

```java
public class ListGCTest {
    public static void main(String[] args) throws Exception {
        List li = new ArrayList<Integer>();
        int i = 1;
        while (true) {
            if (i % 100 == 0) {
                Thread.sleep(100);
            }
            for (int d=0; d<100; d++)  li.add(d);
            i++;
        }
    }
}
```

실행 결과는 아래와 같다.

```
[GC (Allocation Failure)  3656K->1145K(15872K), 0.0033858 secs]
[Full GC (Ergonomics)  13590K->5166K(15872K), 0.3319230 secs]
[GC (Allocation Failure)  5166K->5166K(15872K), 0.0071300 secs]
[Full GC (Allocation Failure) Exception in thread "main" java.lang.OutOfMemoryError: Java heap space
	at java.util.Arrays.copyOf(Arrays.java:3210)
	at java.util.Arrays.copyOf(Arrays.java:3181)
	at java.util.ArrayList.grow(ArrayList.java:261)
	at java.util.ArrayList.ensureExplicitCapacity(ArrayList.java:235)
	at java.util.ArrayList.ensureCapacityInternal(ArrayList.java:227)
	at java.util.ArrayList.add(ArrayList.java:458)
	at gc.test.ListGCTest.main(ListGCTest.java:15)
 5166K->5147K(15872K), 0.3608906 secs]
```

실행결과를 보면 가비지 컬렉션 작업을 몇번 반복하다가 결국 OutOfMemoryError 를 뱉으며 프로그램이 죽어버린다.
그 이유는 while 루프 밖에서 ArrayList 를 생성하고 무한루프를 도는 곳에서 계속해서 데이터를 추가하기 때문이다.
위에서, 가비지 컬렉션의 대상이 되는 오브젝트는 <mark>Unreachable</mark> 오브젝트라고 했다.
그런데 무한루프의 외부에서 선언한 ArrayList 는 무한루프가 도는 동안 레퍼런스가 끊이지 않기 때문에, 가비지 컬렉션 작업이 진행되어도 힙에 모든 데이터가 계속 남아있게 된다. 
즉, 가비지 컬렉션 작업이 아무 의미가 없는 것이나 마찬가지다.

Thread.sleep() 하는 부분에서 li 변수에 새로운 ArrayList 를 생성하도록 해보자.
코드는 아래와 같다.

```java
public class ListGCTest {
    public static void main(String[] args) throws Exception {
        List li = new ArrayList<Integer>();
        int i = 1;
        while (true) {
            if (i % 100 == 0) {
                li = new ArrayList<Integer>();  // 새로운 List 를 li 변수에 할당한다.
                Thread.sleep(100);
            }
            for (int d=0; d<100; d++) {
                li.add(d);
            }
            i++;
        }
    }
}
```


<br/>

### 참고한 자료
* {% include href.html text="[Udemy] Java Memory Management" url="https://www.udemy.com/java-memory-management/" %}
* {% include href.html text="Visual GC Download link" url="https://visualvm.github.io/download.html" %}
* {% include href.html text="Integrating Native Methods into Java Programs" url="http://journals.ecs.soton.ac.uk/java/tutorial/native/index.html" %}
* {% include href.html text="Java 8 Docs" url="https://docs.oracle.com/javase/8/docs/api/" %}
* {% include href.html text="[Naver D2] Java Garbage Collection" url="https://d2.naver.com/helloworld/1329" %}
* {% include href.html text="Minor GC vs Major GC vs Full GC – Plumbr" url="https://plumbr.io/blog/garbage-collection/minor-gc-vs-major-gc-vs-full-gc" %}

