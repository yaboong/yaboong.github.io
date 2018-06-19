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
* {% include href.html text="Java Memory Management - Stack and Heap" url="https://yaboong.github.io/java/2018/05/26/java-memory-management/" %} 를 먼저 읽는 것을 추천한다.
* 모니터링 툴 VisualVM 과 VisualGC 플러그인에 대해 알아본다.
* Metaspace, Young/Old Generation 에 대해 알아본다.
* 가비지 컬렉션 프로세스에 대해 알아본다.
<!--more-->


<br/>

### Java Virtual Machine (JVM)
C 나 C++ 에서는 OS 레벨의 메모리에 직접 접근하기 때문에 free() 라는 메소드를 호출하여 할당받았던 메모리를 명시적으로 해제해주어야 한다.
그렇지 않으면 memory leak 이 발생하게 되고, 현재 실행중인 프로그램에서 memory leak 이 발생하면 다른 프로그램에도 영향을 끼칠 수 있다.

반면, 자바는 OS 의 메모리 영역에 직접적으로 접근하지 않고 JVM 이라는 가상머신을 이용해서 간접적으로 접근한다.
JVM 은 C 로 쓰여진 또 다른 프로그램인데, 오브젝트가 필요해지지 않는 시점에서 알아서 free() 를 수행하여 메모리를 확보한다.
웹 애플리케이션을 만들 때 모든 것을 다 직접 개발하여 쓰기보다 검증된 라이브러리나 프레임워크를 이용하는 것이 더 안전하고 편리한 것 처럼, 
메모리 관리라는 까다로운 부분을 자바 가상머신에 모두 맡겨버리는 것이다.

프로그램 실행시 JVM 옵션을 주어서 OS에 요청한 사이즈 만큼의 메모리를 할당 받아서 실행하게된다.
할당받은 이상의 메모리를 사용하게 되면 에러가 나면서 자동으로 프로그램이 종료된다.
그러므로 현재 프로세스에서 메모리 누수가 발생하더라도 현재 실행중인 것만 죽고, 다른 것에는 영향을 주지 않는다.

이렇게 자바는 가상머신을 사용함으로써 (운영체제로 부터 독립적이라는 장점 외에도) OS 레벨에서의 memory leak 은 불가능하게 된다는 장점이 있다. 

자바가 메모리 누수현상을 방지하는 또 다른 방법이 가비지 컬렉션이다.

<br/>

### Garbage Collection
> Garbage collection was invented by John McCarthy around 1959 to simplify manual memory management in Lisp.  <cite> [Wiki] Garbage collection (computer science)</cite>

가비지 컬렉션이라는 개념은 자바에서 처음 사용된 것이 아니다. LISP 라는 언어에서 처음 도입된 개념이다. 하지만, 자바가 가비지 컬렉션이란 개념을 더욱 대중화 시킨데 기여한 부분은 있다.

프로그래머는 힙을 사용할 수 있는 만큼 자유롭게 사용하고, 더 이상 사용되지 않는 오브젝트들은 가비지 컬렉션을 담당하는 프로세스가 자동으로 메모리에서 제거하도록 하는 것이 가비지 컬렉션의 기본 개념이다.

자바는 가비지 컬렉션에 아주 단순한 규칙을 적용한다.

> Heap 영역의 오브젝트 중 stack 에서 도달 불가능한 (Unreachable) 오브젝트들은 가비지 컬렉션의 대상이 된다.

무슨말인지 정확히 이해되지 않는다면, {% include href.html text="Java Memory Management - Stack and Heap" url="https://yaboong.github.io/java/2018/05/26/java-memory-management/" %} 를 먼저 읽는 것을 추천한다.

<br/>


### Garbage Collection 살짝 겉핥아보기
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

> 기존의 <mark>"https://"</mark> 라는 문자열을 레퍼런스 하고 있는 변수는 아무것도 없으므로 <mark>Unreachable</mark> 오브젝트가 된다.

JVM 의 Garbage Collector 는 Unreachable Object 를 우선적으로 메모리에서 제거하여 메모리 공간을 확보한다.
Unreachable Object 란 Stack 에서 도달할 수 없는 Heap 영역의 객체를 말하는데, 지금의 예제에서 <mark>"https://"</mark> 문자열과 같은 경우가 되겠다.
아주 간단하게 이야기해서 이런 경우에 Garbage Collection 이 일어나면 Unreachable 오브젝트들은 메모리에서 제거된다.

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

* 가비지 컬렉션이 수행되는지 보려면 jvm 옵션으로 `-verbose:gc` 를 주면 된다.
* 어떤 가비지 컬렉터를 사용하고 있는지 보기위해 jvm 옵션으로 `-XX:+PrintCommandLineFlags`도 주고 시작하자.
* IntelliJ 라면 Edit Configurations -> VM options -> `-verbose:gc -XX:+PrintCommandLineFlags` 를 입력하면 된다.

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

첫번째 라인은 `-XX:+PrintCommandLineFlag` 에 의해 출력된 값들이고,
두번째 세번째 라인은 `-verbose:gc` 옵션을 주어 가비지 컬렉션이 일어날때 자동출력된 부분이다.

첫번째 라인의 마지막을 보면 `-XX:+UseParallelGC` 옵션이 있는데 <mark>ParallelGC</mark> 라는 가비지 컬렉터를 사용하고 있다는 것이다.

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


### Garbage Collection ```코드로 확인하기```

##### 1. 프로그램이 메모리 부족으로 죽는 경우
OutOfMemoryError 를 빨리내고, GC 를 확인하기 위해서 jvm 옵션으로 `-Xmx16m -verbose:gc` 를 주고 시작하자.
-Xmx 는 힙영역의 최대 사이즈 를 설정하는 것이다. 16MB 로 설정했다.

코드는 아래와 같다.

```java
public class ListGCTest {
    public static void main(String[] args) throws Exception {
        List<Integer> li = IntStream.range(1, 100).boxed().collect(Collectors.toList());
        for (int i=1; true; i++) {
            if (i % 100 == 0) {
                Thread.sleep(100);
            }
            IntStream.range(0, 100).forEach(li::add);
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
위에서, 가비지 컬렉션의 대상이 되는 오브젝트는 <mark>Unreachable</mark> 오브젝트라고 했다.
그런데 무한루프의 외부에서 선언한 ArrayList 는 무한루프가 도는 동안에도 계속해서 <mark>Reachable</mark> 하기 때문에 (레퍼런스가 끊이지 않기 때문에), 
가비지 컬렉션 작업이 진행되어도 힙에 모든 데이터가 계속 남아있게 된다. 

즉, 무한루프를 돌기 때문에 프로그램이 죽은 것이 아니라, 
(<mark>Unreachable</mark> 오브젝트가 없으므로) 가비지 컬렉션이 일어나도 모든 오브젝트가 살아있기 때문에 OutOfMemoryError 가 발생한 것이다.

똑같이 무한루프를 돌지만, <mark>Unreachable</mark> 오브젝트를 만들어 내는 코드를 살펴보자. 

<br/>


##### 2. 가비지 컬렉터가 열일하여 프로그램이 죽지 않는 경우

JVM 옵션으로 똑같이 `-Xmx16m -verbose:gc` 를 주고 실행했다.

Thread.sleep() 하는 부분에서 li 변수에 새로운 ArrayList 를 생성하도록 해보자.
그리고 몇번째 루프에서 가비지 컬렉션이 수행되는지 확인하기 위해 프린트도 하나 찍어보자. 
무한루프를 돌면서 중간중간에 List 를 가비지가 되도록 만들어서 가비지 컬렉션이 수행되면 프로그램은 죽지않고 계속해서 돌아갈 것이다.
코드는 아래와 같다.

```java
public class ListGCTest {
    public static void main(String[] args)throws Exception {
        List<Integer> li = IntStream.range(1, 100).boxed().collect(Collectors.toList());
        for (int i=1; true; i++) {
            if (i % 100 == 0) {
                li = new ArrayList<>();
                Thread.sleep(100);
            }
            IntStream.range(0, 100).forEach(li::add);
        }
    }
}
```

실행결과는 아래와 같다. 루프 횟수는 `....` 으로 표시했다.

```bash
1 2 3 4 5 6 7 8 9  .... 1259 1260 1261 1262 [GC (Allocation Failure)  4059K->520K(15872K), 0.0020576 secs]
1263 1264 1265 1266 .... 3559 3560 3561 3562 [GC (Allocation Failure)  4587K->528K(15872K), 0.0015161 secs]
3563 3564 3565 3566 .... 5859 5860 5861 5862 [GC (Allocation Failure)  4588K->536K(15872K), 0.0008102 secs]
5863 5864 5865 5866 ....
```

`if (i % 100 == 0)` 구문으로 100 번째 단위로 루프를 돌때마다 (새로운 리스트를 할당하여) 기존에 있던 리스트를 가비지로 만들어주니 프로그램이 죽지 않고 계속 돌아가는 것을 보면,
가비지 컬렉터가 열일하고 있다는 것을 알 수 있다.

첫 번째 코드예제에서, 스택에 한개의 리스트 레퍼런스 변수를 두고 같은 리스트에 계속해서 데이터를 추가하면, 
가비지 컬렉션이 이루어져도 가비지로 분류되는 <mark>Unreachable</mark> 오브젝트가 없기 때문에 프로그램이 죽는 것을 확인했다.

두 번째 코드예제에서는, 똑같이 스택에 한개의 리스트 레퍼런스 변수를 두더라도, 주기적으로 새로운 리스트를 생성해서 새롭게 생성한 리스트를 레퍼런스 하도록 만들었다. 
그 결과, <mark>Unreachable</mark> 오브젝트 가 되어버린 기존 리스트들을 가비지 컬렉터가 메모리에서 제거함으로써 프로그램이 죽지않고 돌아가는 것을 확인했다.  

<br/>

### VisualVM 으로 모니터링하기
시각화된 그래프를 보면서 프로그램을 모니터링 할 수 있다. 본인의 java 설치경로 (아마 $JAVA_HOME) 의 bin 디렉토리로 가서 jvisualvm 을 실행시킨다.

```
> $JAVA_HOME/bin/jvisualvm
```

힙의 세부적인 모니터링을 위해 VisualGC 라는 플러그인을 설치할 것인데 이렇게 실행하니까 잘 안돼서 그냥 툴을 다운 받았다.
{% include href.html text="[Go to VisualVM Download Page]" url="https://visualvm.github.io/download.html" %}

Java 9 부터는 {% include href.html text="Graal Visual VM" url="https://visualvm.github.io/graal.html" %} 으로 바뀌었다고 한다.
이 글은 Java 8 을 기준으로 작성되었으므로 Java 9 을 사용한다면 Graal Visual VM 을 사용할 수 있다.

{% include image_caption2_href.html caption="Visual VM" imageurl="https://s3.ap-northeast-2.amazonaws.com/yaboong-blog-static-resources/java/java-memory-management_gc-2.png" %}

Visual VM 을 실행하면 위와같은 화면을 볼 수 있다. 왼쪽에 있는 프로세스들에 대한 모니터링이 가능하다. 
하지만 지금은 가비지 컬렉션인 어떻게 이루어지는지 보기 위해 heap 영역을 좀더 세부적으로 모니터링 하고 싶다.
그러기 위해서 VisualGC 라는 플러그인이 필요한데, 상단 메뉴에서 Tool > Plugins > Available Plugins 로 가서 Visual GC 를 체크한 후 Install 을 클릭한다.

{% include image_caption2_href.html caption="Visual GC Plugin" imageurl="https://s3.ap-northeast-2.amazonaws.com/yaboong-blog-static-resources/java/java-memory-management_gc-3.png" %}

Visual GC 플러그인을 설치하면 힙의 각 영역별로 세부적인 모니터링이 가능하다.

<br/>

### 메모리 구성 - Metaspace & Heap

Visual VM 과 Visual GC 를 이용하여 프로그램을 실행했을 때 메모리 변화에 대한 모니터링을 해보자.

##### 1. Metaspace
먼저 metaspace 에 대해 알아보자. 자바 8 에 적용된 변화로 람다, 스트림, 인터페이스의 default 지시자가 대표적이다.
하지만, 메모리의 관점에서 가장 큰 변화로는 PermGen 이 사라지고 Metaspace 가 이를 대체하게 되었다는 것이다.

PermGen 은 자바 7까지 클래스의 메타데이터를 저장하던 영역이었고 Heap 의 일부였다.
주요 내용만 뽑아보면,
>  
* Permanent Generation은 <mark>힙 메모리 영역중에 하나로</mark> 자바 애플리케이션을 실행할때 클래스의 메타데이터를 저장하는 영역이다.(Java 7기준) 
* 아래와 같은 것들이 Java Heap 이나 native heap 영역으로 이동했다.
    * Symbols -> native heap
    * Interned String -> Java Heap 
    * Class statics -> Java Heap 
* <mark>OutOfMemoryError: PermGen Space error</mark> 는 더이상 볼 수 없고 JVM 옵션으로 사용했던 PermSize 와 MaxPermSize는 더이상 사용할 필요가 없다. 이 대신에 MetaspaceSize 및 MaxMetaspaceSize가 새롭게 사용되게 되었다.

<cite> 
    {% include href.html text="출처: http://starplatina.tistory.com/entry/JDK8에선-PermGen이-완전히-사라지고-Metaspace가-이를-대신-함 [Clean Code that Works.]" url="http://starplatina.tistory.com/entry/JDK8%EC%97%90%EC%84%A0-PermGen%EC%9D%B4-%EC%99%84%EC%A0%84%ED%9E%88-%EC%82%AC%EB%9D%BC%EC%A7%80%EA%B3%A0-Metaspace%EA%B0%80-%EC%9D%B4%EB%A5%BC-%EB%8C%80%EC%8B%A0-%ED%95%A8" %}
</cite>


자바 8 부터 클래스들은 모두 힙이 아닌 네이티브 메모리를 사용하는 Metaspace 에 할당된다고 하는데, 한번 확인해보자.


```java
public class MetaspaceTest {
    static javassist.ClassPool cp = javassist.ClassPool.getDefault();

    public static void main(String[] args) throws Exception{
        for (int i = 0; ; i++) {
            if (i % 1000 == 0) Thread.sleep(100);
            Class c = cp.makeClass("io.github.yaboong.Generated" + i).toClass();
        }
    }
}
```

위 코드는 metaspace 를 사용하게 될 class 들을 런타임시에 생성한다.
코드를 실행하기 전에 {% include href.html text="javassist" url="https://mvnrepository.com/artifact/javassist/javassist/3.12.1.GA" %} 라이브러리를 추가하고, 아래코드를 실행시킨 뒤 VisualVM 에서 모니터링 해보자.  
Metaspace 를 제한하기 위해 vm 옵션으로 `-XX:MaxMetaspaceSize=128m` 을 주고 실행시킨다. 최대 Metaspace 의 크기를 128 MB 로 제한하는 옵션이다. 

VisualVM 의 VisualGC 탭으로 들어가면 아래와 같은 화면을 볼 수 있다. 
java.lang.OutOfMemoryError: Metaspace 에러로 인해 프로그램이 죽은 상태의 캡처본이다.

{% include image_caption2_href.html caption="java.lang.OutOfMemoryError: Metaspace" imageurl="https://s3.ap-northeast-2.amazonaws.com/yaboong-blog-static-resources/java/java-memory-management_gc-5.png" %}

Metaspace 의 크기가 128MB 에 도달하면 `OutOfMemoryError: Metaspace` 오류를 뱉으며 죽는 것을 확인할 수 있다. 
```
Exception in thread "main" javassist.CannotCompileException: by java.lang.OutOfMemoryError: Metaspace
	at javassist.ClassPool.toClass(ClassPool.java:1085)
	at javassist.ClassPool.toClass(ClassPool.java:1028)
	at javassist.ClassPool.toClass(ClassPool.java:986)
	at javassist.CtClass.toClass(CtClass.java:1079)
	at gc.test.MetaspaceTest.main(MetaspaceTest.java:10)
Caused by: java.lang.OutOfMemoryError: Metaspace
	at java.lang.ClassLoader.defineClass1(Native Method)
	at java.lang.ClassLoader.defineClass(ClassLoader.java:763)
	at java.lang.ClassLoader.defineClass(ClassLoader.java:642)
	at sun.reflect.GeneratedMethodAccessor1.invoke(Unknown Source)
	at sun.reflect.DelegatingMethodAccessorImpl.invoke(DelegatingMethodAccessorImpl.java:43)
	at java.lang.reflect.Method.invoke(Method.java:498)
	at javassist.ClassPool.toClass2(ClassPool.java:1098)
	at javassist.ClassPool.toClass(ClassPool.java:1079)
	... 4 more
```

<br/>

> 서론이 너무 길었는데, 어쨌든 Metaspace 는 Heap 과는 상관없는 네이티브 메모리 영역이다.

> Metaspace 를 제외한, Heap 에 해당하는 Old, Eden, S0, S1 에 대해서 알아보자.

<br/>

##### 2. Heap - Old & Young (Eden, Survivor)
위 모니터링 화면에서 Spaces 부분을 보면 다섯개의 영역으로 나누어져 있는 것을 볼 수 있다. <mark>Metaspace, Old, Eden, S0, S1</mark> 총 다섯개 영역이다.

{% include image_caption2_href.html caption="http://www.waitingforcode.com/off-heap/on-heap-off-heap-storage/read" imageurl="https://s3.ap-northeast-2.amazonaws.com/yaboong-blog-static-resources/java/java-memory-management_gc-6.png" %}

Heap 은 <mark>Young Generation, Old Generation</mark> 으로 크게 두개의 영역으로 나누어 지고, Young Generation 은 또다시 <mark>Eden, Survivor Space 0, 1</mark> 로 세분화 되어진다.
S0, S1 으로 표시되는 영역이 Survivor Space 0, 1 이다.
각 영역의 역할은 가비지 컬렉션 프로세스를 알면 알 수 있다.



#### 가비지 컬렉션 프로세스

 
1. 새로운 오브젝트는 Eden 영역에 할당된다. 두개의 Survivor Space 는 비워진 상태로 시작한다.
2. Eden 영역이 가득차면, MinorGC 가 발생한다.
3. MinorGC 가 발생하면, Reachable 오브젝트들은 S0 으로 옮겨진다. Unreachable 오브젝트들은 Eden 영역이 클리어 될때 함께 메모리에서 사라진다.
4. 다음 MinorGC 가 발생할때, Eden 영역에는 3번과 같은 과정이 발생한다. Unreachable 오브젝트들은 지워지고, Reachable 오브젝트들은 Survivor Space 로 이동한다.
기존에 S0 에 있었던 Reachable 오브젝트들은 S1 으로 옮겨지는데, 이때, age 값이 증가되어 옮겨진다. 살아남은 모든 오브젝트들이 S1 으로 모두 옮겨지면, S0 와 Eden 은 클리어 된다.
<mark>Survivor Space 에서 Survivor Space 로의 이동은 이동할때마다 age 값이 증가한다.</mark>
5. 다음 MinorGC 가 발생하면, 4번 과정이 반복되는데, S1 이 가득차 있었으므로 S1 에서 살아남은 오브젝트들은 S0 로 옮겨지면서 Eden 과 S1 은 클리어 된다. 이때에도, age 값이 증가되어 옮겨진다. 
<mark>Survivor Space 에서 Survivor Space 로의 이동은 이동할때마다 age 값이 증가한다.</mark>
6. Young Generation 에서 계속해서 살아남으며 age 값이 증가하는 오브젝트들은 age 값이 특정값 이상이 되면 Old Generation 으로 옮겨지는데 이 단계를 Promotion 이라고 한다.
7. MinorGC 가 계속해서 반복되면, Promotion 작업도 꾸준히 발생하게 된다.
8. Promotion 작업이 계속해서 반복되면서 Old Generation 이 가득차게 되면 MajorGC 가 발생하게 된다.

{% include href.html text="[Oracle] Java Garbage Collection Basics" url="http://www.oracle.com/webfolder/technetwork/tutorials/obe/java/gc01/index.html" %} 를 참고하여 작성했다.

위 과정의 반복이 가비지 컬렉션이다.

###### 용어정리
* MinorGC : Young Generation 에서 발생하는 GC
* MajorGC : Old Generation (Tenured Space) 에서 발생하는 GC
* FullGC  : Heap 전체를 clear 하는 작업 (Young/Old 공간 모두)
 

<br/>

### Garbage Collection 눈으로 확인하기

###### 1. 프로그램이 메모리 부족으로 죽는 경우

```java
public class ListGCTest {
    public static void main(String[] args)throws Exception {
        List<Integer> li = IntStream.range(1, 100).boxed().collect(Collectors.toList());
        for (int i=1; true; i++) {
            if (i % 50 == 0) {
//                li = new ArrayList<Integer>();  // 새로운 List 를 li 변수에 할당한다.
                Thread.sleep(200);
            }
            IntStream.range(0, 100).forEach(li::add);
        }
    }
}
```

실행시 VisualVM 으로 모니터링 한 화면을 녹화해 보았다.
(유튜브 영상 전체화면 기능이 이상하게 먹힙니다... 유튜브 페이지로 가서 전체화면으로 봐주세요... )

{% include youtube.html id="r_JAjpy42ug" %}

VisualVM 그래프를 보면, Eden 영역이 활발하게 생성되는 것이 보인다.
또한, Eden 이 가득차면 Survivor Space 로 이동하고, 기존에 Survivor Space 에서 오랫동안 살아남은 오브젝트들이 Old Generation 으로 이동하게 되는 것도 보인다.
심지어 Eden 이 차기도 전에 Old Generation 으로 이동하는 경우도 보인다.
실행 로그를 보면 FullGC 가 발생하는 것도 볼 수 있는데, FullGC 가 실행되었음에도 불구하고 힙에 더 이상 할당할 수 있는 공간이 없어서 OutOfMemoryError 를 뱉으면서 죽는다. 

<br/>

###### 2. 가비지 컬렉터가 열일하여 프로그램이 죽지 않는 경우

```java
public class ListGCTest {
    public static void main(String[] args)throws Exception {
        List<Integer> li = IntStream.range(1, 100).boxed().collect(Collectors.toList());
        for (int i=1; true; i++) {
            if (i % 50 == 0) {
                li = new ArrayList<>();
                Thread.sleep(200);
            }
            IntStream.range(0, 100).forEach(li::add);
        }
    }
}
```


아래 영상 역시 VisualVM 으로 모니터링 한 화면을 녹화한 것이다. 
(유튜브 영상 전체화면 기능이 이상하게 먹힙니다... 유튜브 페이지로 가서 전체화면으로 봐주세요... )

{% include youtube.html id="kKBRy6wlz2c" %}

VisualVM 그래프를 보면, 첫 번째 경우와 동일하게 Eden 은 활발하게 움직이는 것을 볼 수 있다.
또한, 처음에는 Eden 에서 Survivor Space 로 이동하는 오브젝트가 많지만, 시간이 지나면서 살아남는 오브젝트들이 점점 줄어드는 것이 보인다.
이는 생성되는 오브젝트들의 생명주기가 굉장히 짧은 것을 의미한다.
Survivor Space 에서 Old Generation 으로의 Promotion 과정도 미미하게 발생하지만 첫 번째 경우보다 Old Generation 이 증가하는 속도는 굉장히 더딘 것을 확인할 수 있다.


<br/>



### 참고한 자료
* {% include href.html text="[Udemy] Java Memory Management" url="https://www.udemy.com/java-memory-management/" %}
* {% include href.html text="Integrating Native Methods into Java Programs" url="http://journals.ecs.soton.ac.uk/java/tutorial/native/index.html" %}
* {% include href.html text="Java 8 Docs" url="https://docs.oracle.com/javase/8/docs/api/" %}
* {% include href.html text="[Plumbr] Minor GC vs Major GC vs Full GC" url="https://plumbr.io/blog/garbage-collection/minor-gc-vs-major-gc-vs-full-gc" %}
* {% include href.html text="[Plumbr] Java Metaspace" url="https://plumbr.io/outofmemoryerror/metaspace" %}
* {% include href.html text="[Oracle] Java Garbage Collection Basics" url="http://www.oracle.com/webfolder/technetwork/tutorials/obe/java/gc01/index.html" %}

### 다운로드 링크
* {% include href.html text="Visul VM Download" url="https://visualvm.github.io/download.html" %}
* {% include href.html text="Javassist 3.12.1.GA" url="https://mvnrepository.com/artifact/javassist/javassist/3.12.1.GA" %}
* {% include href.html text="Memory Analyzer Tool Download" url="http://www.eclipse.org/mat/downloads.php" %}
