---
layout: post
title: "디자인패턴 - 싱글톤 패턴 (feat. 스레드 세이프)"
date: 2018-09-28
banner_image: java-banner.png
categories: [design-pattern]
tags: [design-pattern, java, oop]
---

### 개요
* 싱글톤 패턴의 다양한 구현 방법을 알아본다.
* Eager Initialization
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

### 서론
싱글톤 패턴은 간단하니 금방 끝내고 다른거 공부해야지 하는 마음으로 여기저기 찾아다니다 보니... 
같은 싱글톤이라도 정말 다양한 구현방법들이 있었다. 역시 DZone.
다양한 싱글톤 패턴의 구현을 알아보자.

<br/>

### Eager Initialization
```java
public class EagerSingleton {
    private static volatile EagerSingleton instance = new EagerSingleton();
    // private constructor
    private EagerSingleton() {
    }
    public static EagerSingleton getInstance() {
        return instance;
    }
}
```





<br/>

### Static Block Initialization
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

### Thread-Safe Singletons
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

### Double-Checked Locking
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

### Bill Pugh Solution
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

### Enum Singleton
```java
public enum EnumSingleton {
    INSTANCE;
    public void someMethod(String param) {
        // some class member
    }
}
```





<br/>

### Using Reflection to Destroy Singleton Patterns
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

### Serialization and Singleton
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