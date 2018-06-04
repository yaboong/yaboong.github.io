---
layout: post
title: "Java Memory Management - Stack and Heap"
date: 2018-05-26
banner_image: java-banner.png
categories: [java]
tags: [java, memory-management]
---

### 개요
* Stack 과 Heap 영역 각 역할에 대해 알아본다.
* 간단한 코드예제와 함께 실제 코드에서 어떻게 Stack 과 Heap 영역이 사용되는지 살펴본다.
* Wrapper Class 와 Immutable Object 에 대해서도 살짝 알아본다.
* Garbage Collection 이 무엇인지도 아주 살짝 알아본다.
<!--more-->


<br/>

### Java 의 Stack 과 Heap
Java 메모리 영역중 stack 과 heap 영역이 내가 짠 코드에서는 어떻게 작동하는지, 실제 어떤 데이터들이 garbage 로 분류되는지에 대해서는 몰랐다. 
Stack 과 heap 영역의 사용에 초점을 맞춰서 정리해보았다. Heap 영역도 더 세분화되어 구분되지만 garbage collection 에 대한 포스팅에서 다루어 봐야겠다.

{% include image_caption_href.html caption="Image from 'https://dzone.com/articles/java-memory-management'" title="java memory management - stack and heap" imageurl="https://s3.ap-northeast-2.amazonaws.com/yaboong-blog-static-resources/java/javamemory-stack-and-heap-dzone.jpg" %}


#### Stack
* Heap 영역에 생성된 Object 타입의 데이터의 참조값이 할당된다.
* 원시타입의 데이터가 값과 함께 할당된다.
* 지역변수들은 scope 에 따른 visibility 를 가진다.
* 각 Thread 는 자신만의 stack 을 가진다.

Stack 에는 heap 영역에 생성된 Object 타입의 데이터들에 대한 참조를 위한 값들이 할당된다. 또한, 원시타입(primitive types) - byte, short, int, long, double, float, boolean, char 타입의 데이터들이 할당된다.
이때 원시타입의 데이터들에 대해서는 참조값을 저장하는 것이 아니라 실제 값을 stack 에 직접 저장하게 된다.

Stack 영역에 있는 변수들은 visibility 를 가진다. 변수 scope 에 대한 개념이다. 
전역변수가 아닌 지역변수가 foo() 라는 함수내에서 Stack 에 할당 된 경우, 해당 지역변수는 다른 함수에서 접근할 수 없다.
예를들어, foo() 라는 함수에서 bar() 함수를 호출하고 bar() 함수의 종료되는 중괄호 <mark>}</mark> 가 실행된 경우 (함수가 종료된 경우), 
bar() 함수 내부에서 선언한 모든 지역변수들은 stack 에서 pop 되어 사라진다.

Stack 메모리는 Thread 하나당 하나씩 할당된다. 즉, 스레드 하나가 새롭게 생성되는 순간 해당 스레드를 위한 stack 도 함께 생성되며,
각 스레드에서 다른 스레드의 stack 영역에는 접근할 수 없다.

이제 Stack 이 어떻게 활용되는지 간단한 코드를 보면서 하나씩 살펴보자.
```java
public class Main {
    public static void main(String[] args) {
        int argument = 4;
        argument = someOperation(argument);
    }

    private static int someOperation(int param){
        int tmp = param * 3;
        int result = tmp / 2;
        return result;
    }
}
```

간단한 설명을 위해 args 배열은 무시한다. 아래에서 설명하게 될 Heap 의 동작과정을 알면 <mark>String[] args</mark> 는 어떻게 동작하는지도 알 수 있다.

argument 에 4 라는 값을 최초로 할당했고, 이 argument 변수를 함수에 넘겨주고 결과값을 또다시 argument 에 할당하는 방식이 그렇게 좋은 방식은 아니지만 설명의 편의를 위해 그냥 두자.

```java
int argument = 4;
```

에 의해 스택에 argument 라는 변수명으로 공간이 할당되고, argument 변수의 타입은 원시타입이므로 이 공간에는 실제 4 라는 값이 할당된다. 
현재 스택의 상태는 아래와 같다.

{% include image_caption_href.html height="358px" width="200px" imageurl="https://s3.ap-northeast-2.amazonaws.com/yaboong-blog-static-resources/java/java-memory-management_stack-1.png" %} 

다음으로, 
```java
argument = someOperation(argument);
```

에 의해 <mark>someOperation()</mark> 함수가 호출된다.
호출될때 인자로 argument 변수를 넘겨주며 scope 가 <mark>someOperation()</mark> 함수로 이동한다.
scope 가 바뀌면서 기존의 argument 라는 값은 scope 에서 벗어나므로 사용할 수 없다.
이때 인자로 넘겨받은 값은 파라미터인 param 에 복사되어 전달되는데, param 또한 원시타입이므로 stack 에 할당된 공간에 값이 할당된다.
현재 스택의 상태는 아래와 같다.
{% include image_caption_href.html height="400px" width="200px" imageurl="https://s3.ap-northeast-2.amazonaws.com/yaboong-blog-static-resources/java/java-memory-management_stack-2.png" %}

다음으로,
```java
int tmp = param * 3;
int result = tmp / 2;
```
에 의해 같은 방식으로 스택에 값이 할당되며 현재 스택의 상태는 아래와 같다.
{% include image_caption_href.html height="420px" width="200px" imageurl="https://s3.ap-northeast-2.amazonaws.com/yaboong-blog-static-resources/java/java-memory-management_stack-3.png" %}

다음으로,
닫는괄호 <mark>}</mark> 가 실행되어 <mark>someOperation()</mark> 함수호출이 종료되면 호출함수 scope 에서 사용되었던 모든 지역변수들은 stack 에서 pop 된다.
함수가 종료되어 지역변수들이 모두 pop 되고, 함수를 호출했던 시점으로 돌아가면 스택의 상태는 아래와 같이 변한다.

{% include image_caption_href.html height="420px" width="200px" imageurl="https://s3.ap-northeast-2.amazonaws.com/yaboong-blog-static-resources/java/java-memory-management_stack-4.png" %}

argument 변수는 4 로 초기화 되었지만, 함수의 실행결과인 6 이 기존 argument 변수에 재할당된다. 
물론 함수호출에서 사용되었던 지역변수들이 모두 pop 되기 전에 재할당 작업이 일어날 것이다.

그리고 main() 함수도 종료되는 순간 stack 에 있는 모든 데이터들은 pop 되면서 프로그램이 종료된다.


<br/>
 
#### Heap
이제 heap 영역에 대해서 알아보자.
* Heap 영역에는 주로 긴 생명주기를 가지는 데이터들이 저장된다. (대부분의 오브젝트는 크기가 크고, 서로 다른 코드블럭에서 공유되는 경우가 많다) 
* 애플리케이션의 모든 메모리 중 stack 에 있는 데이터를 제외한 부분이라고 보면 된다.
* 모든 Object 타입(Integer, String, ArrayList<T>, ...)은 heap 영역에 생성된다.
* 몇개의 스레드가 존재하든 상관없이 단 하나의 heap 영역만 존재한다.
* Heap 영역에 있는 오브젝트들을 가리키는 레퍼런스 변수가 stack 에 올라가게 된다.

간단한 코드예제와 함께 heap 영역이 어떻게 사용되는지 살펴보자.
```java
public class Main {
    public static void main(String[] args) {
        int port = 4000;
        String host = "localhost";
    }
}
```

<mark>int port = 4000;</mark> 에 의해서 기존처럼 stack 에 4000 이라는 값이 port 라는 변수명으로 할당되어 스택의 상태는 아래와 같이 된다.
 
{% include image_caption2_href.html height="30%" width="100%" caption="stack and heap" imageurl="https://s3.ap-northeast-2.amazonaws.com/yaboong-blog-static-resources/java/java-memory-management_heap-1.png" %}

String 은 Object 를 상속받아 구현되었으므로 (Object 타입은 최상위 부모클래스다, Polymorphism 에 의해 Object 타입으로 레퍼런스 가능하다) 
String 은 heap 영역에 할당되고 stack 에 host 라는 이름으로 생성된 변수는 heap 에 있는 "localhost" 라는 스트링을 레퍼런스 하게 된다.
그림으로 표현하면 아래와 같다.

{% include image_caption2_href.html height="30%" width="100%" caption="stack and heap" imageurl="https://s3.ap-northeast-2.amazonaws.com/yaboong-blog-static-resources/java/java-memory-management_heap-2.png" %}

기본적인 stack 과 heap 영역에 대한 이해는 끝났으므로, 조금 더 복잡한 예제코드와 함께 각 영역의 메모리 할당과 해제가 어떻게 일어나는지 살펴보자.

```java
import java.util.ArrayList;
import java.util.List;

public class Main {
    public static void main(String[] args) {
        List<String> listArgument = new ArrayList<>();
        listArgument.add("yaboong");
        listArgument.add("github");

        print(listArgument);
    }

    private static void print(List<String> listParam) {
        String value = listParam.get(0);
        listParam.add("io");
        System.out.println(value);
    }
}
```

물론 print() 하는 함수에서 List 에 값을 추가하는 짓은 하면 안되는 짓이지만 설명의 편의를 위해 넘어가자.

프로그램의 시작과 함께 실행되는 첫 구문은 아래와 같다.
```java
List<String> listArgument = new ArrayList<>();
```

여기서 <mark>new</mark> 키워드는 특별한 역할을 한다.
생성하려는 오브젝트를 저장할 수 있는 충분한 공간이 heap 에 있는지 먼저 찾은 다음, 빈 List 를 참조하는 listArgument 라는 로컬변수를 스택에 할당한다.
결과는 아래와 같다.

{% include image_caption2_href.html height="30%" width="100%" caption="stack and heap" imageurl="https://s3.ap-northeast-2.amazonaws.com/yaboong-blog-static-resources/java/java-memory-management_heap-3.png" %}
  
다음으로,
```java
listArgument.add("yaboong");
```
구문이 실행되는데, 위 구문은 <mark>listArgument.add(new String("yaboong"));</mark> 과 같은 역할을 한다.
즉, new 키워드에 의해 heap 영역에 충분한 공간이 있는지 확인한 후 "yaboong" 이라는 문자열을 할당하게 된다.
이때 새롭게 생성된 문자열인 "yaboong" 을 위한 변수는 stack 에 할당되지 않는다. List 내부의 인덱스에 의해 하나씩 add() 된 데이터에 대한 레퍼런스 값을 갖게 된다.
그림으로 표현하면 아래와 같다.

{% include image_caption2_href.html height="30%" width="100%" caption="stack and heap" imageurl="https://s3.ap-northeast-2.amazonaws.com/yaboong-blog-static-resources/java/java-memory-management_heap-4.png" %}

다음으로,
```java
listArgument.add("github");
```
가 실행되면 List 에서 레퍼런스 하는 문자열이 하나 더 추가된다.
그림으로 표현하면 아래와 같다.
 
{% include image_caption2_href.html height="30%" width="100%" caption="stack and heap" imageurl="https://s3.ap-northeast-2.amazonaws.com/yaboong-blog-static-resources/java/java-memory-management_heap-5.png" %}

다음으로,
```java
print(listArgument);
```
구문에 의해 함수호출이 일어난다. 이때, listArgument 라는 참조변수를 넘겨주게 된다. 
함수호출시 원시타입의 경우와 같이 넘겨주는 인자가 가지고 있는 값이 그대로 파라미터에 복사된다.

<mark>print(List&lt;String&gt; listParam)</mark> 메소드에서는 listParam 이라는 참조변수로 인자를 받게 되어있다.
따라서 print() 함수호출에 따른 메모리의 변화는 아래와 같다.

{% include image_caption2_href.html height="30%" width="100%" caption="stack and heap" imageurl="https://s3.ap-northeast-2.amazonaws.com/yaboong-blog-static-resources/java/java-memory-management_heap-6.png" %}

listParam 이라는 참조변수가 새롭게 stack 에 할당되어 기존 List 를 참조하게 되는데,
기존에 인자인 listArgument 가지고 있던 값(List 에 대한 레퍼런스)을 그대로 listParam 이 가지게 되는 것이다.
그리고 print() 함수 내부에서 listArgument 는 scope 밖에 있게 되므로 접근할 수 없는 영역이 된다.

다음으로, print() 함수 내부에서는 List 에 있는 데이터에 접근하여 값을 value 라는 변수에 저장한다.
이 때 print() 함수의 scope 에서 stack 에 value 가 추가되고, 이 value 는 listParam 을 통해 List 의 0번째 요소에 접근하여 그 참조값을 가지게 된다.
그리고나서 또 데이터를 추가하고, 출력함으로 print() 함수의 역할은 마무리 된다. 
```java
String value = listParam.get(0);
listParam.add("io");
System.out.println(value);
```

위 코드가 실행되고, 함수가 종료되기 직전의 stack 과 heap 은 아래와 같다. 

{% include image_caption2_href.html height="30%" width="100%" caption="stack and heap" imageurl="https://s3.ap-northeast-2.amazonaws.com/yaboong-blog-static-resources/java/java-memory-management_heap-7.png" %}

이제 함수가 닫는 중괄호 <mark>}</mark> 에 도달하여 종료되면 print() 함수의 지역변수는 모두 stack 에서 pop 되어 사라진다.
이때, List 는 Object 타입이므로 지역변수가 모두 stack 에서 pop 되더라도 heap 영역에 그대로 존재한다.
즉, 함수호출시 레퍼런스 값을 복사하여 가지고 있던 listParam 만 스택에서 사라지고 나머지는 모두 그대로인 상태로 함수호출이 종료된다.

```java
print(listArgument);
```

위 함수호출이 종료된 시점에서 스택과 힙 영역은 아래와 같다.

{% include image_caption2_href.html height="30%" width="100%" caption="stack and heap" imageurl="https://s3.ap-northeast-2.amazonaws.com/yaboong-blog-static-resources/java/java-memory-management_heap-8.png" %}

Object 타입의 데이터, 즉 heap 영역에 있는 데이터는 <mark>함수 내부에서 파라미터로 copied value 를 받아서 변경하더라도 
함수호출이 종료된 시점에 변경내역이 반영되는 것</mark>을 볼 수 있다.

<br/>

> 이쯤되면 아래 코드는 어떤 결과를 보여줄지 궁금할 때다.

<br/>

```java
public class Main {
    public static void main(String[] args) {
        Integer a = 10;
        System.out.println("Before: " + a);
        changeInteger(a);
        System.out.println("After: " + a);
    }

    public static void changeInteger(Integer param) {
        param += 10;
    }
}
```

<br/>

> Integer 도 Object 를 상속받아 구현되었으니... Object 타입이고... 당연히 20 이 나오겠지 ㅡ,.ㅡa

<br/>

지금까지 정리한 내용을 기초해서 실행순서대로 살펴보면,
* Integer 는 Object 타입이므로, 첫 구문인 <mark>Integer a = 10;</mark> 에서 10 은 heap 영역에 할당되고, 10 을 가리키는 레퍼런스변수 a 가 스택에 할당된다.
* 함수에 인자를 넘겨줄때에 파라미터는 copied value 를 넘겨받는다. 
* 그러므로, <mark>changeInteger(a);</mark> 에 의해, param 이라는 레퍼런스 변수가 스택에 할당되고, 이 param 은 main() 함수에서 a 를 가리키던 곳을 똑같이 가리키고 있다.
* main() 함수에서 레퍼런스하던 a 와 같은 곳을 param 이 가리키고 있으므로 param 에 10 을 더하면, changeInteger() 함수가 종료되고 a 의 값을 출력했을 때 바뀐 값이 출력될 것이다. 

<br/>

> 뭐냐... 20 이 아니다... 값이 안바뀐다... 헛배웠다...?

<br/>

값이 바뀌지 않는 이유는 아래 코드를 생각해보면 된다. String 은 불변객체(immutable) 로써 어떤 연산을 수행할때마다 기존 오브젝트를 변경하는 것이 아니라 새로운 오브젝트를 생성하는 것이라고 알고 있을 것이다.


```java
public class Main {
    public static void main(String[] args) {
        String s = "hello";
        changeString(s);
        System.out.println(s);
    }
    public static void changeString(String param) {
        param += " world";
    }
}
```

changeString() 내부동작만 살펴보면,
* main() 메소드 s 가 레퍼런스하는 "hello" 오브젝트를 param 에 복사하면서 changeString() 메소드가 시작된다.
* <mark>param += " world";</mark> 를 실행하는 것은 heap 에 "hello world" 라는 스트링 오브젝트가 새롭게 할당되는 작업이다. 
* 기존에 "hello" 오브젝트를 레퍼런스하고 있던 param 으로 새롭게 생성된 스트링 오브젝트인 "hello world" 를 레퍼런스 하도록 만드는 것이다.
* changeString() 함수가 종료되면, 새롭게 생성된 "hello world" 오브젝트를 레퍼런스 하는 param 이라는 변수는 스택에서 pop 되므로 어느것도 레퍼런스 하지 않는 상태가 된다.
* (아래에서 간략히 살펴보겠지만) 이런 경우 "hello world" 오브젝트는 garbage 로 분류된다. 

그러므로, changeString() 메소드를 수행하고 돌아가도 기존에 "hello" 를 레퍼런스하고 있던 s 변수의 값은 그대로이다.
Immutable Object 는 불변객체로써, 값이 변하지 않는다. 변경하는 연산이 수행되면 변경하는 것 처럼 보이더라도 실제 메모리에는 새로운 객체가 할당되는 것이다.

자바에서 Wrapper class 에 해당하는 Integer, Character, Byte, Boolean, Long, Double, Float, Short 클래스는 모두 Immutable 이다.
그래서 heap 에 있는 같은 오브젝트를 레퍼런스 하고 있는 경우라도, 새로운 연산이 적용되는 순간 새로운 오브젝트가 heap 에 새롭게 할당된다.

처음에는 왜 이렇게 되는거지? 의문을 가지다가 Integer 클래스의 구현을 보니 final 이라는 키워드가 붙어있었다. 이 final 때문인가? 싶었는데, 아니다.
클래스에 붙어있는 final 은 값을 바꾸지 못하도록 하는 역할이 아닌, <mark>상속을 제한하는 목적으로 붙이는 제어자이다.</mark>

Integer 클래스를 까보면 내부에서 사용하는 실제 값인 value 라는 변수가 있는데,
이 변수는 <mark>private final int value;</mark> 로 선언 되어있다.
즉, 생성자에 의해 생성되는 순간에만 초기화되고 변경불가능한 값이 된다.
이것 때문에 Wrapper class 들도 String 처럼 Immutable 한 오브젝트가 되는 것이다.



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

Garbage Collection 이 일어난 후의 메모리 상태는 아래와 같을 것이다.

{% include image_caption2_href.html height="30%" width="100%" caption="stack and heap" imageurl="https://s3.ap-northeast-2.amazonaws.com/yaboong-blog-static-resources/java/java-memory-management_heap-13.png" %}

Garbage Collection 정책과 방식에는 여러가지가 있지만 이 포스팅에서는 다루지 않겠다.

비슷한 예제를 하나 더 살펴보자.

```java
import java.util.ArrayList;
import java.util.List;

public class Main {
    public static void main(String[] args) {
        List<String> listArgument = new ArrayList<>();
        listArgument.add("yaboong");
        listArgument.add("github");

        print(listArgument);
        
        listArgument = new ArrayList<>();
    }

    private static void print(List<String> listParam) {
        listParam.add("io");
        System.out.println(listParam);
    }
}
```

위 코드에서는 listArgument 라는 변수에 두번의 할당작업이 일어난다. 위와 같이 실행한 경우 stack 과 heap 영역은 아래와 같이 될 것이다.

{% include image_caption2_href.html height="30%" width="100%" caption="stack and heap" imageurl="https://s3.ap-northeast-2.amazonaws.com/yaboong-blog-static-resources/java/java-memory-management_heap-9.png" %}

기존에 사용했던 listArgument 참조변수는 새롭게 생성한 빈 List 를 레퍼런스 한다.
세개의 String 오브젝트는 List 내부의 인덱스에 의해 레퍼런스 되고 있지만 stack 에서는 Unreachable 한 영역에 있다.
기존에 listArgument 가 참조했던 "yaboong", "github", "io" 를 가진 ArrayList 를 참조하고 있는 변수는 어느 stack 에서도 찾아볼 수 없다.

앞서 본 경우와 비슷하게 이런 경우에도 기존의 List 오브젝트와, List 오브젝트가 힙 내부에서 레퍼런스하고 있는 String 오브젝트 모두 garbage 로 분류된다.

Garbage Collection 이 일어난 후의 stack 과 heap 영역은 아래와 같을 것이다.

{% include image_caption2_href.html height="30%" width="100%" caption="stack and heap" imageurl="https://s3.ap-northeast-2.amazonaws.com/yaboong-blog-static-resources/java/java-memory-management_heap-10.png" %}


<br/>

다음 포스팅에서는 garbage collection 에 대해 조금 더 깊이있게 파보고 내용을 정리해봐야겠다.

<br/>

### 참고한 자료
* {% include href.html text="[Dzone] Java Memory Management" url="https://dzone.com/articles/java-memory-management" %}
* {% include href.html text="[Udemy] Java Memory Management" url="https://www.udemy.com/java-memory-management/" %}