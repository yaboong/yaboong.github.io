---
layout: post
title: "자바 제네릭 이해하기 Part 1"
date: 2019-01-19
banner_image: java-banner.png
categories: [java]
tags: [java, generics]
---

### 개요
* 제네릭이란?
* 제네릭을 사용하는 이유
* 제네릭을 사용할 수 없는 경우
* 제네릭 메서드란?
* 제네릭 타입 제한하기 (Bounded Type Parameter)

<!--more-->


<br/>

### 서론
사실 제네릭을 공부할 생각은 없었다. 이미 잘 쓰고있고 잘 이해하고 있다고 착각(?) 했기 때문이다.
자바로 개발을 하면서 JDK 소스를 볼일이 한번씩 생기는데, 자바를 개발한 사람은 이걸 어떻게 만들었나 훑어보다가 '봐도 모르겠네~' 하고 넘어가는게 습관처럼 되어 버렸다.
그러다가 JPA 를 사용하면서 Optional 을 사용하게 됐고, Optional 을 사용하다보니 람다와 스트림 API 를 사용하게 됐고, 그러다가 만난녀석이

```java
public void ifPresent(Consumer<? super T> consumer) {
    if (value != null)
        consumer.accept(value);
}
```

이놈이다. 

```Consumer<? super T>``` 는 대체 뭐하는 놈일까 궁금해졌다. 항상 그냥 지나치다가 이번에는 좀 짚고 넘어가야겠다 싶어서 다시 공부해보았다.
이번 포스팅에서는 저놈이 뭐하는 놈인지 설명하지는 않고, 저놈이 뭐 하는 놈인지 이해하기 위한 배경지식을 쌓는 포스팅이다. 

<br/>


### 제네릭이란
JDK1.5 에 처음 도입되었다.

* Generics add stability to your code by making more of your bugs detectable at compile time. -- Oracle Javadoc
* 제네릭(Generic)은 클래스 내부에서 사용할 데이터 타입을 외부에서 지정하는 기법을 의미한다. -- 생활코딩
* 지네릭스는 다양한 타입의 객체들을 다루는 메서드나 컬렉션 클래스에 컴파일 시의 타입체크를 해주는 기능이다. -- 자바의 정석

대충 읽어보면 뭔가 타입에 대한 정보를 동적으로 넘겨줄 수 있고, 런타임시에 발생할 수 있는 오류를 컴파일 타임에 발견할 수 있도록 하는 것 같다. 
일단 이정도 이해하고 넘어가고 예제를 보면서 하나씩 뜯어보자.


<br/>

### 제네릭을 사용하지 않는 경우 문제점
자바에서 자주 사용하게 되는 ArrayList<E> 를 모방하여, 아주 간단하고 제네릭을 사용하지 않는 SimpleArrayList 를 만들어보자.
제네릭을 사용하지 않아도 여러가지 타입을 받아 저장할 수 있는 ArrayList 를 만들 수 있다.
모든 클래스는 Object 클래스를 상속받기 때문에 Object 타입으로 받으면 그 어떤 타입이라도 받을 수 있기 때문이다.

제네릭을 사용하지 않고도 어떤 타입이든 5개 요소를 담을 수 있는 ArrayList 를 만들면 아래와 같다.

(설명의 편의를 위해 capacity 가 다 찼을 때 array 를 resizing 하거나 하는 로직은 모두 빼고 보도록 하자. 혹시 궁금하다면...
{% include href.html text="여기" url="https://yaboong.github.io/data-structures/2018/02/08/array-and-java-array-list/" %}와
{% include href.html text="여기" url="https://yaboong.github.io/data-structures/2018/02/09/array-advanced-1-stack/" %}를 참고하기 바란다.)

```java
public class SimpleArrayList {
    private int size;
    private Object[] elementData = new Object[5];

    public void add(Object value) {
        elementData[size++] = value;
    }

    public Object get(int idx) {
        return elementData[idx];
    }
}
``` 

이제 이걸 사용해보자.

```java
public class SimpleArrayListTest {
    public static void main(String[] args) {
        SimpleArrayList list = new SimpleArrayList();

        list.add(50);
        list.add(100);

        Integer value1 = (Integer) list.get(0);
        Integer value2 = (Integer) list.get(1);

        System.out.println(value1 + value2);
    }
}
```

컴파일도 잘 되고 잘 동작하는 것을 확인할 수 있다.

add() 메소드는 파라미터로 Object 를 받기 때문에 어떤 데이터타입도 모두 받을 수 있다. 
그러므로 list.get() 부분에서 형변환만 잘 시켜주면 어떤 데이터 타입이든 저장할 수 있다.
add(50) 에 들어가게될 50이 스트링으로 들어가게 됐다고 가정해보면 코드는 아래와 같이 될 것이다.

```java
public class SimpleArrayListTest {
    public static void main(String[] args) {
        SimpleArrayList list = new SimpleArrayList();

        list.add("50");  // 달라진부분
        list.add("100"); // 달라진부분

        Integer value1 = (Integer) list.get(0);
        Integer value2 = (Integer) list.get(1);

        System.out.println(value1 + value2);
    }
}
```

add() 메서드는 Object 타입은 모두 받을 수 있으므로 String, Integer 모두 인자로 줄 수 있다. 
get() 메서드도 Object 타입을 반환하기 때문에 ```Integer value1 = (Integer) list.get(0);``` 이라는 코드에는 문법적으로 아무런 문제가 없다.

실제로도 컴파일이 잘 되는데, 실행하면 런타임에 아래와 같은 오류가 발생하게 된다.

```
Exception in thread "main" java.lang.ClassCastException: 
    java.lang.String cannot be cast to java.lang.Integer
    at com.example.java.generics.basic.SimpleArrayListTest.main(SimpleArrayListTest.java:11)
```

잘못된 타입캐스팅이 이루어졌다는 오류메시지이다. String 을 넣어놓고서 Integer 로 형변환했기 때문이다.

(제네릭 없는 자바를 사용해보지는 않았지만) 위와같은 방식으로 사용하는 경우, 
어떤 타입으로 형변환 할 수 있는지 조차 모호한 경우도 많기 때문에 잠재적인 오류를 가지고 있는 매우 좋지 않은 방식이다. 

<br/>

> 하지만 컴파일 시점에서는 어떤 오류도 발생하지 않는다는 것이 문제다!

<br/>

이런 문제를 해결하기 위해 Integer 타입을 가질 수 있는 SimpleArrayList 를 만들고, String 타입을 가질 수 있는 SimpleArrayList 를 만들 수 있다.

##### SimpleArrayListForInteger.java

```java
public class SimpleArrayListForInteger {
    private int size;
    private int[] elementData = new int[5];

    public void add(int value) {
        elementData[size++] = value;
    }

    public int get(int idx) {
        return elementData[idx];
    }
}
```

##### SimpleArrayListForString.java

```java
public class SimpleArrayListForString {
    private int size;
    private String[] elementData = new String[5];

    public void add(String value) {
        elementData[size++] = value;
    }

    public String get(int idx) {
        return elementData[idx];
    }
}
```

코드의 중복이 생기기 시작한다. 같은 역할을 하는 메소드 add(), get() 이지만 두 군데에 생긴다.
메서드 파라미터 타입과 반환타입이 서로 달라서 인터페이스나 상속을 통해 해결할 수도 없다.
아니면 SimpleArrayList 생성시 변수명을 intList, stringList 처럼 변수명을 다르게 해서 표현할 수도 있을 것 같지만 그래도 좋은 해결방법은 아닌 것 같다.


<br/>

### 제네릭을 사용해서 문제해결

##### GenericArrayList.java
```java
public class GenericArrayList<T> {

    private Object[] elementData = new Object[5];
    private int size;

    public void add(T value) {
        elementData[size++] = value;
    }

    public T get(int idx) {
        return (T) elementData[idx];
    }
}
```

\<T\> 로 표현한 것이 제네릭이다. 
GenericArrayList 는 객체를 생성할때 타입을 지정하면, 생성되는 오브젝트 안에서는 T 의 위치에 지정한 타입이 대체되어서 들어가는 것 처럼 컴파일러가 인식한다.
좀 더 정확하게 말하면, Raw 타입 으로 사용하는데 컴파일러에 의해 필요한 곳에 형변환 코드가 추가된다. 
(List\<String\> 을 List 로만 쓰는 것이 Raw 타입으로 사용하는 것이다)  

사용은 아래처럼 할 수 있다. 형변환이 필요없다는 것, 지정한 타입과 다른 타입의 참조변수를 선언하면 컴파일타임에 오류가 발생한다는 것이 중요포인트다.

###### Test.java
```java
class Test {
    public static void main(String[] args) {
        GenericArrayList<Integer> intList = new GenericArrayList<>();
        intList.add(1);
        intList.add(2);

        int intValue1 = intList.get(0); // 형변환이 필요없다
        int intValue2 = intList.get(1); // 형변환이 필요없다
        
        // String strValue = intList.get(0); // 컴파일에러
        }
}
```

위 Test.java 파일을 컴파일하고, 컴파일한 Test.class 파일을 역컴파일하면 아래와 같은 결과를 볼 수 있다.

###### 디컴파일 한 결과 (Test.java -> Test.class -> decompile)
```java
class Test {
    Test() {
    }

    public static void main(String[] var0) {
        GenericArrayList var1 = new GenericArrayList(); // 제네릭이 사라졌다
        var1.add(1);
        var1.add(2);
        int var2 = (Integer)var1.get(0); // 형변환이 추가되었다
        int var3 = (Integer)var1.get(1); // 형변환이 추가되었다
    }
}
``` 

GenericArrayList\<Integer\> 로 생성했던 타입파라미터가 사라지고, Raw 타입으로만 사용하는데, 값을 꺼내 쓰는 곳에 형변환 코드가 추가되었다.
제네릭을 사용하면 컴파일러가 형변환을 알아서 진행한다는 것을 확인했다. 

<br/>

### 한정적 타입 매개변수 (Bounded Type Parameter)
제네릭으로 사용될 타입 파라미터의 범위를 제한할 수 있는 방법이 있다.

위에서 만든 GenericArrayList 가 Number 의 서브클래스만 타입으로 가지도록 하고 싶은 경우 아래와 같이 제네릭의 타입을 제한할 수 있다.
(인터페이스나 클래스나 추상클래스나 모두 extends 를 사용한다)

```java
public class GenericArrayList<T extends Number>
```

위와 같이 정의했다면 GenericArrayList 에는 String 을 담을 수 없다.

Number 의 상위클래스만 타입으로 가지도록 하고 싶은 경우 (적절한 예시는 아니지만) 아래와 같이 제네릭의 타입을 제한할 수 있다.

```java
public class GenericArrayList<T super Number>
```

바운디드 타입 파라미터가 사용되는 가장 흔한 예시는 Comparable 을 적용하는 경우다.
<mark>T extends Comparable&lt;T&gt;</mark> 와 같이 정의하면 Comparable 인터페이스의 서브클래스들만 타입으로 사용하겠다는 것이다.
Comparable 인터페이스를 구현하기 위해서는 compareTo() 메소드를 반드시 정의해야하기 때문에 Comparable 인터페이스를 구현한 클래스들은 비교가 가능한 타입이 된다.

비교하는 로직이 들어간 클래스에는 비교가 가능한 타입들을 다루는 것이 맞을 것이다. 이를 강제하도록 할 수 있는게 바운디드 타입 파라미터이다.

<br/>



### 제네릭을 사용할 수 없는 경우
GenericArrayList 를 정의할 때, 다른 부분에는 모두 T 를 사용했는데, 배열을 생성하는 부분에서는 T 를 사용하지 않고 Object 를 사용했고
get() 호출시 T 타입으로 형변환 하는 코드를 삽입했다.

GenericArrayList 가 가지는 elementData 도 <mark>new T[5]</mark> 와 같이 생성하면 get() 메서드에서 (T) 로 형변환 하는 작업을 안해도 될텐데 왜 한걸까?

그 이유는 new 연산자 때문이다. new 연산자는 heap 영역에 충분한 공간이 있는지 확인한 후 메모리를 확보하는 역할을 한다.
충분한 공간이 있는지 확인하려면 타입을 알아야한다. 
그런데 컴파일 시점에 타입 T 가 무엇인지 알 수 없기 때문에 <mark>new T[5]</mark> 와 같이 **제네릭으로 배열을 생성할 수는 없다.**

**static 변수에도 제네릭을 사용할 수 없다.** static 변수는 인스턴스에 종속되지 않는 클래스변수로써 모든 인스턴스가 공통된 저장공간을 공유하게 되는 변수이다.

static 변수에 제네릭을 사용하려면, 
GenericArrayList\<Integer\> 에서는 Integer 타입으로, GenericArrayList\<String\> 에서는 String 타입으로 사용될 수 있어야 하는데
하나의 공유변수가, 생성되는 인스턴스에 따라 타입이 바뀐다는 개념 자체가 말이 안되는 것이다. 그래서 static 변수에는 제네릭을 사용할 수 없다.

하지만, (아래에서 살펴보겠지만) **static 메서드에는 제네릭을 사용할 수 있다.**


<br/>


### 제네릭 메서드
static 메서드에는 제네릭을 사용할 수 있다고 했는데 왜 그런 것일까?
이 질문에 대답하기 전에 제네릭 메서드가 무엇인지 먼저 살펴보자.

<br/>

###### 제네릭 메서드란

제네릭 메서드를 정의할때는 리턴타입이 무엇인지와는 상관없이 내가 제네릭 메서드라는 것을 컴파일러에게 알려줘야한다. 
그러기 위해서 리턴타입을 정의하기 전에 제네릭 타입에 대한 정의를 반드시 적어야 한다.

그리고 중요한 점이 제네릭 클래스가 아닌 일반 클래스 내부에도 제네릭 메서드를 정의할 수 있다.
그 말은, <mark>클래스에 지정된 타입 파라미터와 제네릭 메서드에 정의된 타입 파라미터는 상관이 없다</mark>는 것이다.
즉, 제네릭 클래스에 \<T\> 를 사용하고, 같은 클래스의 제네릭 메서드에도 \<T\> 로 같은 이름을 가진 타입파라미터를 사용하더라도 둘은 전혀 상관이 없다는 것을 의미한다.

<br/>

###### static 메서드 with 제네릭

바로 위에서, static 변수에는 제네릭을 사용할 수 없지만 static 메서드에는 제네릭을 사용할 수 있다고 했는데 왜 그런 것일까?

앞서 말한 것 처럼 static 변수의 경우에 제네릭을 사용하면 여러 인스턴스에서 어떤 타입으로 공유되어야 할지 지정할 수가 없어서 사용할 수 없다.
static 변수는 값 자체가 공유되기 때문이다. 값 자체가 공유되려면 타입에 대한 정보도 있어야 한다.
 
하지만, static 메서드의 경우 메서드의 틀만 공유된다고 생각하면 된다. 
그리고 그 틀 안에서 지역변수처럼 타입 파라미터가 다양하게 오가는 형태로 사용될 수 있는 것이다.

이는 static 메서드가 아닌 인스턴스 메서드의 경우에도 마찬가지다. 클래스에 정의된 타입 파라미터와는 전혀 별개로 제네릭 메서드는 자신만의 타입파라미터를 가진다.

<br/>

###### static 메서드 with 제네릭 주의사항

착각하면 안되는 것이, 아래와 같은 static 메서드는 허용되지 않는다.
아래 코드에는 두 가지 오류가 있는데, 첫번째는 param 의 타입인 T 를 알 수 없다는 것이고, 두번째는 T 의 타입을 알 수 없기 때문에 charAt() 메서드 호출이 불가능 하다는 것이다.

```java
public static void printFirstChar(T param) {
    System.out.println(param.charAt(0));
}
```

허용되지 않는 가장 중요한 이유는 제네릭 메서드가 아니기 때문이다. 리턴 타입 앞에 제네릭에 대한 선언이 없다.

클래스에 표시하는 &lt;T&gt; 는 인스턴스 변수라고 생각하면 된다. 인스턴스가 생성될때마다 지정되는 것이기 때문이다. 
그러므로, static 메서드에서 인스턴스 변수로 여겨지는 타입 파라미터를 사용하고 있으므로 컴파일 에러가 발생한다.

static 메서드에서 제네릭을 사용하려면 아래처럼 제네릭 메서드로 정의해야 한다.

```java
public static <T extends CharSequence> void printFirstChar(T param) {
    System.out.println(param.charAt(0));
}
```

제네릭 메서드 선언시 \<T\> 만 사용해도 상관없다. 위 예시의 경우 charAt() 메서드를 호출하기 위해서 CharSequence 의 서브타입만 가능하다는 제약을 넣은 것이다.

printFirstChar() 제네릭 메서드를 GenericArrayList 에 정의해 주었다면 호출은 아래와 같이 하면 된다.

```java
GenericArrayList.<String>printFirstChar("YABOONG");
```

그런데 여기서 "YABOONG" 을 통해 인자의 타입이 String 인 것을 컴파일러가 추론할 수 있으므로 &lt;String&gt; 은 생략가능하다. 
대부분의 경우 타입추론이 가능하므로 아래와 같이 타입은 생략하고 호출할 수 있다.

```java
GenericArrayList.printFirstChar("YABOONG");
```

<br/>

###### TIP
<mark>printFirstChar(T param)</mark> 에서 param 변수의 타입은 T 로 아직 지정되지 않았음에도 <mark>param.charAt(0)</mark> 처럼 
charAt() 메서드 호출이 가능한 이유는 <mark>&lt;T extends CharSequence&gt;</mark> 를 통해 CharSequence 인터페이스를 하위 클래스 타입만 받도록 제한했기 때문이다.
CharSequence 인터페이의 하위 클래스 타입이 되려면 charAt() 을 포함하여 CharSequence 에 정의된 메서드들을 반드시 구현해야 한다.

<br/>


### 요약
제네릭을 사용하는 이유는 아래와 같다.

* 형변환이 필요없고, 타입안정성이 보장된다.
* 코드의 재사용성이 높아진다.


<br/>

### 참고한 자료
* {% include href.html text="[Udemy] Introduction to Collections & Generics in Java" url="https://www.udemy.com/introduction-to-generics-in-java/" %}
* {% include href.html text="[Tutorials Point] Java Generics" url="https://www.tutorialspoint.com/java/java_generics.htm" %}
* {% include href.html text="[Tutorials Point] Java Generics - No Static field" url="https://www.tutorialspoint.com/java_generics/java_generics_no_static.htm" %}
* {% include href.html text="[Oracle Javadoc] Generics" url="https://docs.oracle.com/javase/tutorial/java/generics/index.html" %}
* {% include href.html text="[Oracle Javadoc] Why Use Generics?" url="https://docs.oracle.com/javase/tutorial/java/generics/why.html" %}
* {% include href.html text="[도서] 자바의 정석" url="http://www.kyobobook.co.kr/product/detailViewKor.laf?ejkGb=KOR&mallGb=KOR&barcode=9788994492032&orderClick=LAG&Kc=" %}

