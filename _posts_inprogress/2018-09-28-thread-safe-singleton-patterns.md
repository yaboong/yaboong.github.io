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

#### Eager Initialization (Early Loading)
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

> 클라이언트에서 사용하지 않더라도 인스턴스는 항상 생성된다는 것이 단점이다.

라는 부분이 다른 많은 궁금증들을 불러일으켰다.

* 인스턴스가 언제 생성되길래 사용하지 않더라도 항상 생성되는 거지?
* EagerSingleton 클래스가 로드될 때 EagerSingleton 인스턴스가 생성된다면, 클래스 로딩은 언제 일어나는거지?
* 클래스 로딩과 클래스 초기화의 차이는 뭘까?

해답을 찾기위해
* {% include href.html text="When are static variables initialized?" url="https://stackoverflow.com/questions/8704423/when-are-static-variables-initialized" %}
* {% include href.html text="What is Static Variable Class method and keyword in Java - Example Tutorial" url="https://javarevisited.blogspot.com/2011/11/static-keyword-method-variable-java.html" %}
* {% include href.html text="Java Language Specification" url="https://docs.oracle.com/javase/specs/jls/se8/html/jls-12.html" %}
* {% include href.html text="클래스로더 1, 동적인 클래스 로딩과 클래스로더" url="http://javacan.tistory.com/entry/1" %}
* {% include href.html text="Difference between loading a class and instantiating it" url="https://stackoverflow.com/questions/17693828/difference-between-loading-a-class-and-instantiating-it" %}
* {% include href.html text="When a class is loaded and initialized in JVM - Java" url="https://javarevisited.blogspot.com/2012/07/when-class-loading-initialization-java-example.html#ixzz2ZHoZKA48" %}
* {% include href.html text="Is Java class loader guaranteed to not load classes that aren't used?" url="https://stackoverflow.com/questions/3487888/is-java-class-loader-guaranteed-to-not-load-classes-that-arent-used" %}

이것저것 많이도 읽어봤지만 가장 도움된 글은 
* {% include href.html text="When a class is loaded and initialized in JVM - Java" url="https://javarevisited.blogspot.com/2012/07/when-class-loading-initialization-java-example.html#ixzz2ZHoZKA48" %}
이 글인데, 내용 중 일부를 보면

> If Class is loaded before its actually being used, it can sit inside before being initialized. 
I believe this may vary from JVM to JVM. 
<strong>While its guaranteed by JLS that a class will be loaded when there is a need of static initialization.</strong>

라는 부분이 있다. (참고로, JLS 는 Java Language Specification 으로 Oracle 에서 작성한 문서이다)

static 초기화가 필요한 경우 클래스가 로드되고, 로드된 클래스는 계속해서 메모리에 남아있을 수 있다는 것이 가장 중요한 내용이다.

클라이언트에서 사용하지 않더라도 인스턴스는 항상 생성된다는 것이 단점이었는데, (<mark>EagerSingleton</mark> 클래스를 포함하는 애플리케이션은)
static 제어자에 의해 EagerSingleton 클래스는 항상 로드되고, instance 라는 이름의 static 변수에 <mark>EagerSingleton</mark> 인스턴스가 생성되어 할당된다는 것이다.

그런데, 위 코드만으로는 EagerSingleton.getInstance() 를 호출하지 않는 경우 인스턴스가 생성되지 않는다. EagerSingleton 클래스에 getInstance() 메소드 하나만 존재하기 때문이다.
만약 <mark>EagerSingleton</mark> 클래스에 다른 static 메소드가 존재하고, 이 다른 메소드가 getInstance() 가 호출되기 전에 어딘가에서 호출된다면, 
getInstance() 를 호출하지 않아도 <mark>EagerSingleton</mark> 클래스의 인스턴스는 생성된다.
다른 static 메소드에 의해 <mark>EagerSingleton</mark> 클래스가 로드되기 때문이다.

확인해보려면, 위 코드에 static 으로 선언된 메소드(m() 이라고하자)를 만든다. 실행을 위한 클래스의 main 메소드에는 EagerSingleton.m() 을 호출하는 코드를 넣는다.
EagerSingleton.getInstance() 는 어디에도 삽입하지 않는다.
그리고나서 JVM 옵션으로 ```-verbose:class``` 를 주고 실행하면 로딩되는 클래스들을 모두 출력하는데, EagerSingleton 클래스가 로딩되는 것을 확인할 수 있다.

```
[Loaded singleton.EagerSingleton from file:/Users/yaboong/dev-workspace/java-workspace/design-patterns/out/production/design-patterns/]
```

지금까지 살펴본 것 처럼 Eager Initialization 은 싱글톤 인스턴스를 클라이언트에서 사용하지 않더라도 인스턴스는 항상 생성될 수 있다는 단점을 가진 방법이다.

(이하 작성중...앞으로 작성할 내용들)
* 단점 세부내용으로 이 내용 삽입. This might be a considerable issue if your singleton class in creating a database connection or creating a socket. This may cause the memory leak problem.
* 이 단점을 해결할 수 있는 방법이 당연히 있다. (Lazy -> synchronized -> critical section synchronized -> double check)
* 이거보기전에 Static Block 방법을 보고가자 ~ 예외처리 가능한 방법
* Lazy 스레드 세이프하지 않다
* 메소드에 synchronized 사용한다. -> 비효율적이다. 첫번째 오브젝트를 생성할때에만 필요한 것인데, 이렇게 메소드에 synchronized 를 붙이면 여러개의 스레드에서 getInstance 를 할때마다 lock 이 걸린다.
* critical section 에만 synchronized 사용한다. -> double check (Dzone 의 Thread-Safe Singletons 부분의 OR 에 있는 코드는 스레드세이프하지 않다.)
* double check 에서 가장 중요한 것은 volatile 이다. (volatile 은 main memory 로부터 읽어오도록 하는 것.)
* 이는 main memory 와 스레드의 working memory 와 큰 연관이있다.
    * https://docs.oracle.com/javase/specs/jvms/se6/html/Threads.doc.html (read, load, store, write 정리하고 사진 찍어논거)
    * https://javarevisited.blogspot.com/2014/05/double-checked-locking-on-singleton-in-java.html
    * https://javarevisited.blogspot.com/2011/06/volatile-keyword-java-example-tutorial.html
* 맨 마지막에 싱글톤 예제로 Runtime 클래스.













- Java Runtime 클래스도 싱글톤인데, volatile 이 없다. 
> An application cannot create its own instance of this class.

때문인것 같다.





<br/>

#### Static Block Initialization
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

#### Lazy Initialization
```java
public class LazyInitializedSingleton {
    private static LazyInitializedSingleton instance;
    private LazyInitializedSingleton(){}
    public static LazyInitializedSingleton getInstance(){
        if(instance == null){
            instance = new LazyInitializedSingleton();
        }
        return instance;
    }
}
```





<br/>

#### Thread-Safe Singletons
```java
public class ThreadSafeSingleton {
    private static ThreadSafeSingleton instance;
    private ThreadSafeSingleton(){}
    public static synchronized ThreadSafeSingleton getInstance(){
        if(instance == null){
            instance = new ThreadSafeSingleton();
        }
        return instance;
    }
}
```

또는 

```java
public class ThreadSafeSingleton {
    private static ThreadSafeSingleton instance;
    private ThreadSafeSingleton(){}
    public static ThreadSafeSingleton getInstance(){
        if(instance == null){
            synchronized (ThreadSafeSingleton.class) {
            instance = new ThreadSafeSingleton();
          }
        }
        return instance;
    }
}
```





<br/>

#### Double-Checked Locking
```java
public static ThreadSafeSingleton getInstanceUsingDoubleLocking(){
    if(instance == null){
        synchronized (ThreadSafeSingleton.class) {
            if(instance == null){
                instance = new ThreadSafeSingleton();
            }
        }
    }
    return instance;
}
```





<br/>

#### Bill Pugh Solution
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





<br/>

#### Enum Singleton
```java
public enum EnumSingleton {
    INSTANCE;
    public void someMethod(String param) {
        // some class member
    }
}
```





<br/>

#### Using Reflection to Destroy Singleton Patterns
```java
public class ReflectionSingletonTest {
    public static void main(String[] args) {
        EagerInitializedSingleton instanceOne = EagerInitializedSingleton.getInstance();
        EagerInitializedSingleton instanceTwo = null;
        try {
            Constructor[] constructors = EagerInitializedSingleton.class.getDeclaredConstructors();
            for (Constructor constructor : constructors) {
                //Below code will destroy the singleton pattern
                constructor.setAccessible(true);
                instanceTwo = (EagerInitializedSingleton) constructor.newInstance();
                break;
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        System.out.println(instanceOne.hashCode());
        System.out.println(instanceTwo.hashCode());
    }
}
```





<br/>

#### Serialization and Singleton
```java
public class SerializedSingleton implements Serializable{
    private static final long serialVersionUID = -7604766932017737115L;
    private SerializedSingleton(){}
    private static class SingletonHelper{
        private static final SerializedSingleton instance = new SerializedSingleton();
    }
    public static SerializedSingleton getInstance(){
        return SingletonHelper.instance;
    }
}
```

테스트

```java
public class SingletonSerializedTest {
    public static void main(String[] args) throws FileNotFoundException, IOException, ClassNotFoundException {
        SerializedSingleton instanceOne = SerializedSingleton.getInstance();
        ObjectOutput out = new ObjectOutputStream(new FileOutputStream(
                "filename.ser"));
        out.writeObject(instanceOne);
        out.close();
        //deserailize from file to object
        ObjectInput in = new ObjectInputStream(new FileInputStream(
                "filename.ser"));
        SerializedSingleton instanceTwo = (SerializedSingleton) in.readObject();
        in.close();
        System.out.println("instanceOne hashCode="+instanceOne.hashCode());
        System.out.println("instanceTwo hashCode="+instanceTwo.hashCode());
    }
}
```





<br/>
 


<br/>

### 참고한 자료
* {% include href.html text="[DZone] All About the Singleton" url="https://dzone.com/articles/all-about-the-singleton" %}
* {% include href.html text="[Oracle] 12.4. Initialization of Classes and Interfaces" url="https://docs.oracle.com/javase/specs/jls/se8/html/jls-12.html#jls-12.4" %}