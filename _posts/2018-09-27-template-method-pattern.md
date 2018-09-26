---
layout: post
title: "디자인패턴 - 템플릿 메소드 패턴"
date: 2018-09-27
banner_image: java-banner.png
categories: [design-pattern]
tags: [design-pattern, java, oop]
---

### 개요
객체지향 디자인 패턴 중 템플릿 메소드 패턴에 대해 알아본다.
<!--more-->

<br/>

### 템플릿 메소드 패턴
템플릿 메소드 패턴의 정의로 GoF Design Patterns 의 정의가 가장 깔끔한 것 같다.

> Defines the skeleton of an algorithm in a method, deferring some steps to subclasses. 
Template Method lets subclasses redefine certain steps of an algorithm without changing the algorithms structure.
<cite> -- GoF Design Patterns </cite>

알고리즘의 구조를 메소드에 정의하고, 하위 클래스에서 알고리즘 구조의 변경없이 알고리즘을 재정의 하는 패턴이다.
알고리즘이 단계별로 나누어 지거나, 같은 역할을 하는 메소드이지만 여러곳에서 다른형태로 사용이 필요한 경우 유용한 패턴이다.

<br/>

### 간단한 예제
{% include image_caption.html title="Template Method Pattern UML" caption="Template Method Pattern UML" imageurl="https://s3.ap-northeast-2.amazonaws.com/yaboong-blog-static-resources/uml/template-method-pattern.png" %}
위와 같은 구조의 템플릿 메소드 패턴 적용에 대한 코드이다.
###### AbstractClass.java
```java
public abstract class AbstractClass {
    
    protected abstract void hook1();
    
    protected abstract void hook2();
    
    public void templateMethod() {
        hook1();
        hook2();
    }
    
}
```

###### ConcreteClass.java
```java
public class ConcreteClass extends AbstractClass {

    @Override
    protected void hook1() {
        System.out.println("ABSTRACT hook1 implementation");
    }

    @Override
    protected void hook2() {
        System.out.println("ABSTRACT hook2 implementation");
    }

}
```

###### TemplateMethodPatternClient.java
```java
public class TemplateMethodPatternClient {
    public static void main(String[] args) {
        AbstractClass abstractClass = new ConcreteClass();
        abstractClass.templateMethod();
    }
}
```

템플릿 메소드 패턴이라고 하면 뭔가 대단해 보이지만, 막상 구현해보면 간단한 패턴이다.
추상클래스인 AbstractClass 에는 실제로 실행을 위해 호출 될 public 메소드인 templateMethod 가 정의되어 있고,
templateMethod 내부에는 hook1 -> hook2 의 단계를 가지는 추상메소드가 호출된다. 
이 추상메소드들은 AbstractClass 를 상속받아 구현한 ConcreteClass 에서 구체적인 구현이 정의된다.

<br/>

### JDK8 에서의 사용예제
<mark>AbstractMap<K,V></mark> 클래스를 보면 템플릿 메소드 패턴이 적용된 것을 볼 수 있다.

###### public abstract class AbstractMap<K,V> 의 get() 메소드
```java
public V get(Object key) {
    Iterator<Entry<K,V>> i = entrySet().iterator();
    if (key==null) {
        while (i.hasNext()) {
            Entry<K,V> e = i.next();
            if (e.getKey()==null)
                return e.getValue();
        }
    } else {
        while (i.hasNext()) {
            Entry<K,V> e = i.next();
            if (key.equals(e.getKey()))
                return e.getValue();
        }
    }
    return null;
}
```

###### public class HashMap<K,V> extends AbstractMap<K,V> 의 get() 메소드
```java
public V get(Object key) {
    Node<K,V> e;
    return (e = getNode(hash(key), key)) == null ? null : e.value;
}
```

###### public class TreeMap<K,V> extends AbstractMap<K,V> 의 get() 메소드
```java
public V get(Object key) {
    Entry<K,V> p = getEntry(key);
    return (p==null ? null : p.value);
}
```

<br/>

실제로 자바 라이브러리 코드를 뜯어보면 위와같이 <mark>HashMap, TreeMap</mark> 은 <mark>AbstractMap</mark> 을 상속받아 구현되는데,
<mark>AbstractMap</mark> 은 <mark>Map</mark> 인터페이스를 implements 하기 때문에 
```java
V get(Object key);
```
메소드를 구현하도록 되어있다. 

하지만, <mark>AbstractMap</mark> 추상클래스를 상속받은 <mark>HashMap, TreeMap</mark> 은 똑같이 get() 메소드를 가지지만 
각자 자신만의 구현방법으로 서로 다른 방식으로 구현되어 있음을 볼 수 있다. 템플릿 메소드 패턴이 적용된 대표적인 예시라고 할 수 있다. 

혹시 코드를 까볼일이 있다면 라이브러리 코드에는 <mark>@Override</mark> 어노테이션이 붙어있지 않아서 헷갈릴수 있으니 참고하기 바란다.

<br/>

### 개인적인 궁금증

> 자바8 부터는 인터페이스도 default 키워드를 사용하여 메소드의 구현부를 가질 수 있는데 꼭 추상클래스를 사용해야만 하나? 


이에 대한 답을 찾기 위해서는 자바8 에서 추상클래스와 인터페이스의 차이에 대해서 자세히 알 필요가 있는데,
{% include href.html text="자바8 에서 인터페이스와 추상클래스의 차이" url="https://yaboong.github.io/java/2018/09/25/interface-vs-abstract-in-java8/" %}
에 정리해 두었다.

<br/>

### 개인적인 궁금증에 대한 개인적인 답
인터페이스는 기본적으로 모든 제어자가 public, static, final 이므로 템플릿 메소드 내부에서만 호출되어야 할 메소드들이 public 제어자에 의해 의도치 않은 사용처에서 호출될 위험이 있다.
하지만 추상클래스를 사용하면 protected 제어자를 지정할 수 있다. 

따라서, hook 메소드에 protected 제어자를 사용하면 해당 추상클래스를 구현한 클래스에서만 호출가능하므로 
(같은 패키지내에서도 접근 가능하지만, 템플릿메소드패턴이 적용된 추상클래스는 라이브러리 형태로 외부패키지에서 제공되는 방식일 것이다),
추상클래스를 구현한 클래스의 인스턴스에서는 hook 메소드를 호출할 수 없기 때문에 조금더 엄격한 의미의 템플릿 메소드 패턴의 구현이 가능해진다.

참고로, 위에서 설명한 <mark>간단한 예제</mark> 코드를 직접 작성해 볼것이라면 
AbstractClass, ConcreteClass 가 있는 패키지와 TemplateMethodPatternClient 가 있는 패키지를 다르게 지정해 주어야 한다.
같은 패키지에 둔다면 hook 메소드를 protected 로 지정하는 의미가 없다. protected 제어자는 상속받은 클래스에서도 접근 할 수 있지만 같은 패키지 내에서도 접근할 수 있기 때문이다.






<br/>

### 참고한 자료
* {% include href.html text="[자바 디자인 패턴 이해] 3강 템플릿 메소드 패턴(Template Method Pattern)" url="https://youtu.be/qr7I18Lhsl8?list=PLsoscMhnRc7pPsRHmgN4M8tqUdWZzkpxY" %}
* {% include href.html text="[DZone] Template Method Pattern Tutorial with Java Examples" url="https://dzone.com/articles/design-patterns-template-method" %}
* {% include href.html text="Java 8 docs - AbstractMap" url="https://docs.oracle.com/javase/8/docs/api/java/util/AbstractMap.html#get-java.lang.Object-" %}
* {% include href.html text="Java 8 docs - HashMap" url="https://docs.oracle.com/javase/8/docs/api/java/util/HashMap.html#get-java.lang.Object-" %}
* {% include href.html text="Java 8 docs - TreeMap" url="https://docs.oracle.com/javase/8/docs/api/java/util/TreeMap.html#get-java.lang.Object-" %}
* {% include href.html text="Oracle Java Tutorials - Abstract Methods and Classes" url="https://docs.oracle.com/javase/tutorial/java/IandI/abstract.html" %}