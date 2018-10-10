---
layout: post
title: "디자인패턴 - 싱글톤 패턴"
date: 2018-09-28
banner_image: java-banner.png
categories: [design-pattern]
tags: [design-pattern, java, oop]
---

### 개요
* 싱글톤 패턴의 다양한 구현 방법을 알아본다.
* Thread Safe 한 싱글톤 패턴의 구현도 포함한다.
* volatile 과 memory consistency 도 조금 알아본다.
* 구현
    * Eager Initialization (Early Loading)
    * Static Block Initialization
    * Lazy Initialization
    * Thread-Safe Singletons
    * Double-Checked Locking
    * Bill Pugh Solution
    * Enum Singleton
    * Using Reflection to Destroy Singleton Patterns
    * Serialization and Singleton
<!--more-->


<br/>

### 싱글톤 패턴이란
단순하다. 그냥 전체 애플리케이션을 통틀어서 단 하나의 인스턴스만 생성되도록 하는 것이다.
인스턴스 생성은 외부에서 이루어질 수 없고, 접근 제어자를 이용해서 싱글톤 패턴으로 정의된 클래스의 내부에서만 생성되록 제한한다.

<br/> 


### 싱글톤 패턴의 구현 방법
싱글톤 패턴은 간단하니 금방 끝내고 다른거 공부해야지 하는 마음으로 여기저기 찾아다니다 보니... 
같은 싱글톤이라도 정말 다양한 구현방법들이 있었고, 각각의 구현방법들이 어떻게 동작하는 것인지 파헤치다보니 정말 시간을 많이 쓰게 됐다.
이 글의 내용은 DZone 의 {% include href.html text="All About the Singleton" url="https://dzone.com/articles/all-about-the-singleton" %} 을 이해해 나가는 나만의 과정을 기록한 글이다.
DZone 의 설명중 잘못된 설명이라 생각하는 것은 고치고, 설명이 부족한 부분은 추가하면서 작성했다.

<br/> 

### Eager Initialization (Early Loading)
EagerSingleton 클래스가 로드될 때 EagerSingleton 인스턴스가 생성된다.
싱글톤 패턴을 구현하는 가장 간단한 방법이지만 클라이언트에서 사용하지 않더라도 인스턴스는 항상 생성된다는 것이 단점이라고 설명한다.

```java
public class EagerSingleton {
    private static EagerSingleton instance = new EagerSingleton();
    
    // private constructor
    private EagerSingleton() {
    }
    
    public static EagerSingleton getInstance() {
        return instance;
    }
}
```

(Dzone 의 {% include href.html text="All About the Singleton" url="https://dzone.com/articles/all-about-the-singleton" %}
 에서는 Eager Initialization 에서 싱글톤 인스턴스를 레퍼런스하는 변수에 volatile 을 붙였는데, 필요없는 것 같아서 뺐다.)

**"클라이언트에서 사용하지 않더라도 인스턴스는 항상 생성된다는 것이 단점이다."** 라는 부분이 다른 많은 궁금증들을 불러일으켰다.

* 인스턴스가 언제 생성되길래 사용하지 않더라도 항상 생성되는 거지?
* EagerSingleton 클래스가 로드될 때 EagerSingleton 인스턴스가 생성된다면, 클래스 로딩은 언제 일어나는거지?
* 클래스 로딩과 클래스 초기화의 차이는 뭘까?

해답을 찾기위해 이것저것 많이도 읽어봤지만 가장 도움된 글은 {% include href.html text="이 글" url="https://javarevisited.blogspot.com/2012/07/when-class-loading-initialization-java-example.html#ixzz2ZHoZKA48" %}인데, 
한줄로 내가 필요한 내용만 요약하면 아래와 같다. 

> static 초기화가 필요한 경우 클래스가 로드되고, 로드된 클래스는 계속해서 메모리에 남아있을 수 있다.

Eager Initialization 은 클라이언트에서 사용하지 않더라도 인스턴스는 항상 생성된다는 것이 단점이었는데, (<mark>EagerSingleton</mark> 클래스를 포함하는 애플리케이션은)
static 제어자에 의해 EagerSingleton 클래스는 항상 로드되고, instance 라는 이름의 static 변수에 <mark>EagerSingleton</mark> 인스턴스가 생성되어 할당된다는 것이다.

그런데, 위 코드만으로는 EagerSingleton.getInstance() 를 호출하지 않는 경우 인스턴스가 생성되지 않는다. EagerSingleton 클래스에 getInstance() 메소드 하나만 존재하기 때문이다.
좀 더 정확하게 말하면, EagerSingleton 클래스가 사용되는 경우가 getInstance() 밖에 없으므로, getInstance() 호출 외에는 EagerSingleton 이 사용될 수가 없다.
사용되지 않는 클래스는 로드되지 않는다. 따라서, 클래스가 로드되지 않으면 static 초기화도 진행되지 않는다.
 
만약 <mark>EagerSingleton</mark> 클래스에 다른 static 메소드가 존재하고, 이 다른 메소드가 getInstance() 가 호출되기 전에 어딘가에서 호출된다면, 
getInstance() 를 호출하지 않아도 <mark>EagerSingleton</mark> 클래스의 인스턴스는 생성된다.
다른 static 메소드에 의해 <mark>EagerSingleton</mark> 클래스가 로드되기 때문이다.

<br/>

###### 클래스 로딩 확인해보기
확인해보려면, 위 코드에 static 으로 선언된 메소드(doNothing() 이라고하자)를 만든다. 실행을 위한 클래스의 main 메소드에는 EagerSingleton.doNothing() 을 호출하는 코드를 넣는다.
EagerSingleton.getInstance() 는 어디에도 삽입하지 않는다.
그리고나서 JVM 옵션으로 ```-verbose:class``` 를 주고 실행하면 로딩되는 클래스들을 모두 출력하는데, EagerSingleton 클래스가 로딩되는 것을 확인할 수 있다.

```
[Loaded singleton.EagerSingleton from file:/Users/yaboong/dev-workspace/java-workspace/design-patterns/out/production/design-patterns/]
```

지금까지 살펴본 것 처럼 Eager Initialization 은 싱글톤 인스턴스를 클라이언트에서 사용하지 않더라도 인스턴스는 항상 생성될 수 있다는 단점을 가진 방법이다.

이 단점을 보완할 수 있는 싱글톤패턴을 구현하는 다른 방법들이 당연히 있다.
그 방법들을 살펴보기 전에 <mark>Static Block Initialization</mark> 을 간단하게 살펴보고 넘어가자.

<br/>


### Static Block Initialization
Static Block Initialization 은 Eager Initialization 과 유사하다. 
다만, 인스턴스가 static block 내에거 만들어지고, static block 안에서 예외처리를 할 수 있다는 점이 다르다.

```java
public class StaticBlockSingleton {
    private static StaticBlockSingleton instance;
    private StaticBlockSingleton(){}
    
    //static block initialization for exception handling
    static{
        try{
            instance = new StaticBlockSingleton();
        }catch(Exception e){
            throw new RuntimeException("Exception occured in creating singleton instance");
        }
    }
    public static StaticBlockSingleton getInstance(){
        return instance;
    }
}
```

<br/>

### Lazy Initialization
자 이제 Lazy Initialization 을 보자. 이는 Eager Initialization 의 단점을 보완한 방법이다.
생성자는 private 으로 클래스 내부에서만 호출할 수 있고, 객체생성은 <mark>getInstance()</mark> 메소드를 이용해서만 가능하다.

```java
public class LazyInitializedSingleton {
    private static LazyInitializedSingleton instance;
    
    private LazyInitializedSingleton() {}
    
    public static LazyInitializedSingleton getInstance(){
        if(Objects.isNull(instance)) {
            instance = new LazyInitializedSingleton();
        }
        return instance;
    }
}
```

<mark>getInstance()</mark> 의 호출에서는 인스턴스를 레퍼런스하는 변수 instance 가 null 인 경우에만 인스턴스를 생성하므로 싱글톤패턴에 부합하며,
getInstance()의 호출 이외에는 인스턴스를 생성하지 않기 때문에 인스턴스가 필요한 경우에만 인스턴스가 생성되게 함으로써 Eager Initialization 의 단점을 보완했다.

하지만 위 코드는 스레드 세이프하지 않다.
멀티 스레드 환경에서 아직 싱글톤 인스턴스를 생성하지 않은 상태(instance null 인 상황) 라고 가정하자. 
이 상태에서 여러개 스레드가 동시에 getInstance() 를 호출하고, 동시에 instance 의 null 체크를 하는 상황이라면 여러개 스레드가 모두 instance 가 null 이라고 판단하게 되고,
그 결과 여러개의 인스턴스가 생성되므로 싱글톤이 아니다.

<br/>


### Thread-Safe Singleton
스레드 세이프하게 만들려면 간단하다. getInstance() 앞에 <mark>synchronized</mark> 만 붙여주면 된다.
하지만 이는 비효율적이다. synchronized 를 메소드에 사용하게되면, 해당 메소드를 호출할때마다 다른 스레드에서 접근할 수 없게 되기 때문이다.
우리가 원하는 것은 싱글톤으로 인스턴스가 하나만 생성되게 하는 것이지, 메소드 호출시마다 락을 걸어 성능을 저하시키려는 것이 아니다.
일단 하나의 인스턴스만 생성되고 나면 그 다음부터는 synchronized 가 필요없다. 
바람직한 방법은 <mark>Double Checked Locking Pattern</mark> 을 사용하는 것이다.

<br/>

### Double Checked Locking
이 방법은 critical section 에만 synchronized 를 사용하는 것이다. 
{% include href.html text="[Javarevisited] Double Checked Locking on Singleton Class in Java" url="https://javarevisited.blogspot.com/2014/05/double-checked-locking-on-singleton-in-java.html#axzz5TDnUaIpM" %} 글을 많이 참고했다.

코드를 보면 null 체크를 synchronized 블록 밖에서 한번, 안에서 한번 하도록 되어있다.
밖에서 하는 체크는 이미 인스턴스가 생성된 경우 빠르게 인스턴스를 리턴하기 위함이고,
안에서 하는 체크는 인스턴스가 생성되지 않은 경우 단 한개의 인스턴스만 생성되도록 보장하기 위함이다. 
안에서 체크하는 부분이 없으면 두개의 스레드가 동시에 접근할 때 그냥 순차적으로 인스턴스를 생성하도록 하는 수준 밖에 되지 않기 때문에, synchronized 블록의 안팎으로 null 체크를 해줘야한다. 

```java
public class DoubleCheckedSingleton {
    private static volatile DoubleCheckedSingleton instance = null;

    private DoubleCheckedSingleton() {}

    public static DoubleCheckedSingleton getInstance() {
        if (Objects.isNull(instance)) {
            synchronized (DoubleCheckedSingleton.class) {
                if (Objects.isNull(instance)) {
                    instance = new DoubleCheckedSingleton();
                }
            }
        }
        return instance;
    }
}
```

표면적으로는 완벽해 보인다. 하지만 조금 더 깊이있는 이해를 위해서는 '뭐지?' 하고 그냥 지나치기 쉬운 <mark>volatile</mark> 에 대한 이해가 필요하다.

<br/>

##### volatile
한참 여기저기 자료를 찾아보다가 volatile 을 이해하는데 큰 도움이 된 글이다.
* {% include href.html text="[Oracle] Threads and Locks" url="https://docs.oracle.com/javase/specs/jvms/se6/html/Threads.doc.html" %}
* {% include href.html text="[Javarevisited] How Volatile in Java works?" url="https://javarevisited.blogspot.com/2011/06/volatile-keyword-java-example-tutorial.html" %}

먼저, volatile 을 제대로 이해하기 위해서는 Main Memory 와 Working Memory 에 대한 이해가 필요하다.
아래 그림을 함께 보자.

{% include image_caption2.html title="Java Memory" caption="Java Memory" imageurl="https://s3.ap-northeast-2.amazonaws.com/yaboong-blog-static-resources/java/java-volatile-working-emory-main-memory.png" %}

그림을 보면 메인 메모리가 있고, 스레드마다 Working Memory 가 있는 것을 볼 수 있다.
그림에는 Load/Save 로 단순하게 표현되어 있는데, 메인메모리 <-> Working Memory 간의 데이터 이동과정은 아래와 같이 세부적으로 표현할 수 있다.

| **ACTION** | **사용** | **하는 일** |
|--------|-------------|-----------------------------------------------------------------------------------------------------------|
| **read** | Main Memory | 변수의 master copy 의 컨텐츠를 (나중에 load 연산에서 사용하기 위해) 스레드의 working memory 로 보냄.|
| **load** | Thread | read 에 의해 메인메모리에서 전달된 값을 스레드에 있는 변수의 working copy 에 넣는다.|
| **use** | Thread | 스레드에 있는 변수의 working copy 를 스레드 execution engine 에 보냄.|
| **assign** | Thread | 스레드 execution engine 의 값을 스레드에 있는 변수의 working copy 로 보냄.|
| **store** | Thread | 스레드에 있는 변수의 working copy 를 (나중에 write 연산에서 사용하기 위해) 메인 메모리에 전달한다.|
| **write** | Main Memory | store 에 의해 스레드의 working memory 로부터 전달된 값을 메인메모리에 있는 변수의 master copy 에 넣는다.|
 
메인메모리에서 스레드로 값을 가져와 사용할 때에는 <mark>read -> load -> use</mark> 순서로 진행되며,
스레드에 있는 값을 메인메모리로 가져올 때에는 <mark>assign -> store -> write</mark> 순서로 진행된다.

이렇게 메인메모리와 스레드의 Working 메모리 간에 데이터의 이동이 있기 때문에 메인메모리와 Working 메모리간에 동기화가 진행되는 동안 빈틈이 생기게 된다. 
따라서, 싱글톤 패턴 구현시 인스턴스를 레퍼런스하는 변수에 volatile 을 사용해줘야 한다. (jdk5 이상에서만 유효하다)

volatile 로 선언된 변수는 아래와 같은 기능을 하기 때문이다.
* 각 스레드가 해당 변수의 값을 메인 메모리에서 직접 읽어온다.
* volatile 변수에 대한 각 write 는 즉시 메인 메모리로 플러시 된다.
* 스레드가 변수를 캐시하기로 결정하면 각 read/write 시 메인 메모리와 동기화 된다.

<br/> 

##### volatile 을 사용하지 않는 Double Checked Locking 방법에서 일어날 수 있는 문제
* 첫번째 스레드가 instance 를 생성하고 synchronized 블록을 벗어남.
* 두번째 스레드가 synchronized 블록에 들어와서 null 체크를 하는 시점에서,
* 첫번째 스레드에서 생성한 instance 가 working memory 에만 존재하고 main memory 에는 존재하지 않을 경우
* 또는, main memory 에 존재하지만 두번째 스레드의 working memory 에 존재하지 않을 경우
* 즉, 메모리간 동기화가 완벽히 이루어지지 않은 상태라면
* 두번째 스레드는 인스턴스를 또 생성하게 된다.

<br/>


#### Bill Pugh Solution
다음으로, Bill Pugh Solution 을 살펴보자.
BillPughSingleton.getInstance() 를 호출하면 BillPughSingleton 클래스가 로드된다.
static 인 getInstance() 메소드 내부에는 SingletonHelper.INSTANCE 가 있는데 이 또한 static 이므로 SingletonHelper 클래스가 로드된다.
static 변수인 INSTANCE 변수에 BillPughSingleton() 생성자가 호출되어 인스턴스가 할당된다.

* Double Checked 코드와 비교했을때 구현이 간단하다. 
* Lazy Loading 이 가능하다. 클래스가 로드될 때 인스턴스가 생성되므로, getInstance() 를 호출하기 전에는 클래스도 로드되지 않고 인스턴스도 생성되지 않는다.
* 스레드 세이프하다. 클래스가 로드될때 인스턴스가 생성되므로 멀티 스레드 환경에서도 안전하게 사용가능하다.
 
```java
public class BillPughSingleton {
    
    private BillPughSingleton(){}
    
    private static class SingletonHelper{
        private static final BillPughSingleton INSTANCE = new BillPughSingleton();
    }
    
    public static BillPughSingleton getInstance(){
        return SingletonHelper.INSTANCE;
    }
}
```

혹시 나같이 쓸데 없는게 궁금한 사람들을 위해 클래스 로딩에 대한설명을 조금 덧붙인다. 
아까 Eager Initialization 에서, 클래스가 어디선가 사용되면 클래스가 로드된다고 했다. (jdk8 이후에서는 Meta Space, 이전에는 PermGen 에 로드됨)
조금 더 덧붙이자면, 인스턴스화 되어 사용될 수도 있고, static 필드에 대한 호출로 사용될수도 있다.
즉, 클래스에 static 필드가 있고 static 필드에 대한 접근이 이루어지면 클래스가 로드된다. 

BillPughSingleton 클래스에도 doNothing() 이라는 아무것도 하지 않는 static 메소드를 선언하고, 이에대한 호출을 하면 BillPughSingleton 클래스가 로드되는 것을 확인할 수 있다. (jvm 옵션에 -verbose:class 주고 실행)
이때 doNothing() 만 호출해서는 SingletonHelper 클래스는 로드되지 않는 것도 확인할 수 있다.
만약 getInstance() 호출로 SingletonHelper 클래스에 대한 사용이 이루어지는 코드를 삽입하면 SingletonHelper 클래스가 로드되는 것을 확인할 수 있다.


<br/>

> 그런데... 이 모든것을 파괴해버릴 수 있는 녀석이 있다. Reflection 이다.

<br/>

#### Reflection 을 이용해 Singleton 부숴버리기
예제 코드에서는 Bill Pugh Solution 을 사용했지만, 그 어떤 형태의 싱글톤이라도 Reflection 의 setAccessible(true) 를 사용하면 모든 private 생성자, 메소드에 접근이 가능해진다.
Reflection 에 대한 자세한 설명은 
{% include href.html text="여기" url="https://www.concretepage.com/java/how-to-access-all-private-fields-methods-and-constructors-using-java-reflection-with-example" %}
에 잘 되어있다.

```java
import singleton.BillPughSingleton;
import java.lang.reflect.Constructor;

public class SingletonDestroyer {
    public static void main(String[] args) throws Exception {
        BillPughSingleton instanceOne = BillPughSingleton.getInstance();
        System.out.println(instanceOne.toString());

        Constructor[] constructors = BillPughSingleton.class.getDeclaredConstructors();
        for (Constructor constructor : constructors) {
            constructor.setAccessible(true); // singleton breaker
            System.out.println(constructor.newInstance().toString());
            break;
        }
    }
}
```

```setAccessible(true)``` 를 하면 끝난다. newInstance() 메소드를 통해 (직접 생성자를 호출하는 것이므로) 계속해서 다른 인스턴스를 생성할 수 있다.

이 문제에 대한 해결방법은 Enum 을 이용해서 싱글톤을 구현하는 것이다.

<br/>



#### Enum Singleton
Enum 을 사용한 싱글톤의 구현은 아래와 같다. 엄청 간단하다.

```java
public enum EnumSingleton {
    INSTANCE;
}
```

메소드를 추가하고 싶으면 아래와 같이 사용 가능하다.

```java
public enum EnumSingleton {
    INSTANCE;
    
    public void someMethod(String param) {
        
    }
}
```

Enum 을 사용한 싱글톤 패턴은 Lazy Loading 이 아니라는 단점을 가지지만 강력한 세가지 장점이 있다.
1. 구현이 쉽다.
2. Serialization 을 알아서 다룬다.
3. 스레드 세이프하다.

구현이 쉬운것은 제외하고 2번 3번에 대해서만 조금 더 자세히 살펴보자.

###### Serialization 을 알아서 다룬다.
기존의 싱글톤 패턴을 구현한 클래스들은 Serializable 인터페이스를 구현하는 경우, 또 싱글톤 패턴이 파괴된다.

------------ 이부분은 dzone 이랑 javarevisited 자료 같이봐.

```java
//readResolve to prevent another instance of Singleton
private Object readResolve(){
    return INSTANCE;
}
```




 


<br/>

### 참고한 자료
* {% include href.html text="[DZone] All About the Singleton" url="https://dzone.com/articles/all-about-the-singleton" %}
* {% include href.html text="[DZone] Java Multi-threading: Volatile Variables, Happens-before Relationship, and Memory Consistency" url="https://dzone.com/articles/java-multi-threading-volatile-variables-happens-be-1" %}
* {% include href.html text="[Oracle] 12.4. Initialization of Classes and Interfaces" url="https://docs.oracle.com/javase/specs/jls/se8/html/jls-12.html#jls-12.4" %}
* {% include href.html text="[Oracle] Threads and Locks" url="https://docs.oracle.com/javase/specs/jvms/se6/html/Threads.doc.html" %}
* {% include href.html text="[Oracle] Java Language Specification" url="https://docs.oracle.com/javase/specs/jls/se8/html/jls-12.html" %}
* {% include href.html text="[Javarevisited] When a class is loaded and initialized in JVM - Java" url="https://javarevisited.blogspot.com/2012/07/when-class-loading-initialization-java-example.html#ixzz2ZHoZKA48" %}
* {% include href.html text="[Javarevisited] 10 Singleton Pattern Interview Questions in Java - Answered" url="https://javarevisited.blogspot.com/2011/03/10-interview-questions-on-singleton.html" %}
* {% include href.html text="[Javarevisited] How Volatile in Java works?" url="https://javarevisited.blogspot.com/2011/06/volatile-keyword-java-example-tutorial.html" %}
* {% include href.html text="[Javarevisited] What is Static Variable Class method and keyword in Java - Example Tutorial" url="https://javarevisited.blogspot.com/2011/11/static-keyword-method-variable-java.html" %}
* {% include href.html text="[Javarevisited] Double Checked Locking on Singleton Class in Java" url="https://javarevisited.blogspot.com/2014/05/double-checked-locking-on-singleton-in-java.html#axzz5TDnUaIpM" %}
* {% include href.html text="[Javarevisited] Java Enum Tutorial: 10 Examples of Enum in Java" url="https://javarevisited.blogspot.com/2011/08/enum-in-java-example-tutorial.html" %}
* {% include href.html text="[StackOverflow] When are static variables initialized?" url="https://stackoverflow.com/questions/8704423/when-are-static-variables-initialized" %}
* {% include href.html text="[StackOverflow] Difference between loading a class and instantiating it" url="https://stackoverflow.com/questions/17693828/difference-between-loading-a-class-and-instantiating-it" %}
* {% include href.html text="[StackOverflow] Is Java class loader guaranteed to not load classes that aren't used?" url="https://stackoverflow.com/questions/3487888/is-java-class-loader-guaranteed-to-not-load-classes-that-arent-used" %}
* {% include href.html text="How to Access All Private Fields, Methods and Constructors using Java Reflection with Example" url="https://www.concretepage.com/java/how-to-access-all-private-fields-methods-and-constructors-using-java-reflection-with-example" %}
* {% include href.html text="클래스로더 1, 동적인 클래스 로딩과 클래스로더" url="http://javacan.tistory.com/entry/1" %}





- 맨 마지막에 싱글톤 예제로 Runtime 클래스.
- Java Runtime 클래스도 싱글톤인데, volatile 이 없다. 
> An application cannot create its own instance of this class.
때문인것 같다.
