---
layout: post
title: "디자인패턴 - 템플릿 메소드 패턴"
date: 2018-09-27
banner_image: java-banner.png
categories: [design-pattern]
tags: [design-pattern, java, oop]
---

### 개요
* 객체지향 디자인 패턴 중 템플릿 메소드 패턴에 대해 알아본다.
* AbstractMap 에 사용된 템플릿 메소드 패턴을 살펴본다.
* 템플릿 메소드 패턴 구현시 추상클래스가 아닌 인터페이스를 사용하면 안되는가?
<!--more-->

<br/>

### 템플릿 메소드 패턴
템플릿 메소드 패턴의 정의로 GoF Design Patterns 의 정의가 가장 깔끔한 것 같다.

> Defines the skeleton of an algorithm in a method, deferring some steps to subclasses. 
Template Method lets subclasses redefine certain steps of an algorithm without changing the algorithms structure.
<cite> -- GoF Design Patterns </cite>

알고리즘의 구조를 메소드에 정의하고, 하위 클래스에서 알고리즘 구조의 변경없이 알고리즘을 재정의 하는 패턴이다.
알고리즘이 단계별로 나누어 지거나, 같은 역할을 하는 메소드이지만 여러곳에서 다른형태로 사용이 필요한 경우 유용한 패턴이다.

토비의 스프링에서는 아래와 같이 정의한다.

> 상속을 통해 슈퍼클래스의 기능을 확장할 때 사용하는 가장 대표적인 방법.
변하지 않는 기능은 슈퍼클래스에 만들어두고 자주 변경되며 확장할 기능은 서브클래스에서 만들도록 한다. <cite> -- 토비의 스프링 3.1 </cite>


<br/>

### 간단한 예제
{% include image_caption.html title="Template Method Pattern UML" caption="Template Method Pattern UML" imageurl="https://s3.ap-northeast-2.amazonaws.com/yaboong-blog-static-resources/diagram/template-method-pattern.png" %}
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
토비의 스프링에 나온 설명처럼 <mark>"변하지 않는 기능은 슈퍼클래스에 만들어두고 자주 변경되며 확장할 기능은 서브클래스에서 만들도록 한다"</mark> 는 관점에서 보면,
hashCode() 메소드는 <mark>AbstractMap</mark> 추상클래스에 있는 것을 사용하고,
get() 등 기타 많은 메소드들은 HashMap, TreeMap 등 서브클래스에서 오버라이드하여 재정의 하고 있는 것을 볼 수 있다.

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

위에서 은근슬쩍 넘어간게 hook 메소드에 대한 설명인데, 
슈퍼클래스에서 디폴트 기능을 정의해두거나 비워뒀다가 서브클래스에서 선택적으로 오버라이드할 수 있도록 만들어둔 메소드를 훅(hook) 메소드라고 한다.
<mark>AbstractMap</mark> 클래스에서 get() 메소드의 경우 훅 메소드라고 할 수 있겠다. 
(훅메소드가 반드시 추상메소드여야만 하는 것은 아니라는 것을 말하고 싶었다)  

혹시 코드를 까볼일이 있다면 라이브러리 코드에는 <mark>@Override</mark> 어노테이션이 붙어있지 않아서 헷갈릴수 있으니 참고하기 바란다.

<br/>

### 개인적인 궁금증

> 자바8 부터는 인터페이스도 default 키워드를 사용하여 메소드의 구현부를 가질 수 있는데 꼭 추상클래스를 사용해야만 하나? 


이에 대한 답을 찾기 위해서는 자바8 에서 추상클래스와 인터페이스의 차이에 대해서 자세히 알 필요가 있는데,
{% include href.html text="자바8 에서 인터페이스와 추상클래스의 차이" url="https://yaboong.github.io/java/2018/09/25/interface-vs-abstract-in-java8/" %}
에 정리해 두었다.

<br/>

### 개인적인 궁금증에 대한 개인적인 답 
hook 메소드든 추상메소드든 그 메소드들이 실행되는 순서가 중요할 수 있다. 그래서 템플릿 메소드를 만들고 그 안에 어떤 메소드들을 순서에 맞게 호출해 두었다고 치자.

(템플릿 메소드와 템플릿 메소드 패턴은 다르다는 것을 의식하고 읽어주시길)

이때, 템플릿 메소드 내부에서 사용되는 메소드들에 대한 (구현은 하위클래스에서 하고) 외부에서의 호출을 막고 싶다면 추상클래스로 사용하는게 맞는 것 같다.
추상클래스를 사용하면 protected, private 제어자를 지정할 수 있기 때문이다. 
(추상클래스가 같은 패키지 내에 있다면 protected 라도 접근 가능하지만, 
템플릿메소드패턴이 적용된 추상클래스는 라이브러리 형태로 외부패키지에서 제공되는 방식일 것이므로, 
상속을 받지 않은 클래스에서는 호출하지 못하게 할 수 있다고 봐도 될 것 같다)

인터페이스는 기본적으로 모든 제어자가 public, static, final 이므로 인터페이스로 구현할 경우,
템플릿 메소드 내부에서만 호출되어야 할 메소드들이 public 제어자에 의해 의도치 않은 사용처에서 호출될 위험이 있다.

이때 또 생각해야 할 것은, 자바는 다중상속을 허용하지 않기 때문에 템플릿 메소드 패턴이 적용된 추상클래스를 구현한 서브클래스는 다른 클래스를 상속받을 수 없다는 단점이 있다.
반면, 인터페이스로 템플릿 메소드 패턴을 구현했다면 다른 클래스를 상속 받을 수 있는 가능성을 열어둘 수 있다.

그러면 자바의 AbstractMap, AbstractSet 등은 왜 인터페이스가 아닌 추상클래스로 선언된 것일까?
이건 딱히 무슨 대단한 이유가 있다기 보다는... 자바8 이전에 인터페이스는 구현체를 가질 수 없었기 때문이다.

무엇이든 장단점이 있고, 항상 그렇듯 정답은 없는 것 같다.


<br/>

### 참고한 자료
* {% include href.html text="토비의 스프링 3.1" url="#" %}
* {% include href.html text="[Youtube] 자바 디자인 패턴 이해 - 3강 템플릿 메소드 패턴(Template Method Pattern)" url="https://youtu.be/qr7I18Lhsl8?list=PLsoscMhnRc7pPsRHmgN4M8tqUdWZzkpxY" %}
* {% include href.html text="[DZone] Template Method Pattern Tutorial with Java Examples" url="https://dzone.com/articles/design-patterns-template-method" %}
* {% include href.html text="[StackOverflow] why AbstractList,AbstractSet make abstract not interface" url="https://stackoverflow.com/questions/25863894/why-abstractlist-abstractset-make-abstract-not-interface" %}
* {% include href.html text="Java 8 docs - AbstractMap" url="https://docs.oracle.com/javase/8/docs/api/java/util/AbstractMap.html#get-java.lang.Object-" %}
* {% include href.html text="Java 8 docs - HashMap" url="https://docs.oracle.com/javase/8/docs/api/java/util/HashMap.html#get-java.lang.Object-" %}
* {% include href.html text="Java 8 docs - TreeMap" url="https://docs.oracle.com/javase/8/docs/api/java/util/TreeMap.html#get-java.lang.Object-" %}
* {% include href.html text="Oracle Java Tutorials - Abstract Methods and Classes" url="https://docs.oracle.com/javase/tutorial/java/IandI/abstract.html" %}