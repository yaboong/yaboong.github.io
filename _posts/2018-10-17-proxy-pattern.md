---
layout: post
title: "디자인패턴 - 프록시 패턴"
date: 2018-10-17
banner_image: java-banner.png
categories: [design-pattern]
tags: [design-pattern, java, oop]
---

### 개요
* 프록시 패턴에 대해 알아본다.
* {% include href.html text="Coursera 의 디자인패턴 강의" url="https://www.coursera.org/learn/design-patterns" %}
를 기반으로 작성했다.
<!--more-->


<br/>

### 프록시 패턴
주체가 되는 클래스는 민감한 정보를 가지고 있거나, 인스턴스화 하기에는 resource intensive (자원 집약적인.. 뭔가 무거운 느낌이라고 생각하면 됨) 한 클래스일 수 있다.
프록시 클래스가 Wrapper 의 역할을 함으로써, 클라이언트에서는 프록시 클래스를 통해 간접적으로 주체 클래스를 사용하는 방식이다.

> 간단하게 말해서, 왕고한테 물어보기 전에 사수한테 먼저 물어보는 방식이다.

짬찌가 클라이언트라면, 짬찌의 맞고참이 프록시고, 최고참이 주체클래스인 셈이다.

<br/>

### 프록시가 사용되는 세가지 방법
###### 1. Virtual Proxy
주체 클래스가 리소스 집약적인 경우이다. 
예를들어, 주체 클래스가 해상도가 아주 높은 이미지를 처리해야 하는 경우 인스턴스화 할때 많은 메모리를 사용하게 되는데, 
이런 이미지들에 동시에 많은 접근이 이루어진다면 시스템에 부하가 많이 가게 될 것이다.
프록시 클래스에서 자잘한 작업들을 처리하고 리소스가 많이 요구되는 작업들이 필요할 때에만 주체 클래스를 사용하도록 구현할 수 있다. 

###### 2. Protection Proxy
주체 클래스에 대한 접근을 제어하기 위한 경우이다.
프록시 클래스에서 클라이언트가 주체 클래스에 대한 접근을 허용할지 말지 결정하도록 할 수 있다.
어떤 접근권한을 가지고 있는지에 따라 그에 맞는 주체 클래스의 메소드를 호출하도록 구현할 수 있다.

###### 3. Remote Proxy
프록시 클래스는 로컬에 두고, 주체 클래스는 Remote 로 존재하는 경우이다.
Google Docs 같은 것이 대표적인 예시이다. 
브라우저는 브라우저대로 필요한 자원을 로컬에 가지고 있고, 또다른 일부 자원은 Google 서버에 있는 형태이다.

<br/>

### 프록시 패턴 Overview
{% include image_caption_href.html title="Proxy" caption="Proxy and Real Subject" imageurl="/yaboong-blog-static-resources/diagram/proxy-pattern-1.png" %}

위 그림과 같이 프록시 클래스는 주체 클래스를 감싸면서 클라이언트의 요청을 주체 클래스에게 위임하거나 리다이렉트한다.
프록시 클래스는 주체 클래스 경량화된 버전으로 사용되기 때문에 항상 모든 요청을 위임하는 것은 아니고, 보다 실질적인 (or 독립적인) 요청들을 주체 클래스에 위임하는 것이다.

주체 클래스에게 요청을 위임하기 위해서 프록시는 주체 클래스와 같은 인터페이스를 구현함으로써 Polymorphism (다형성) 을 가지게 된다.
즉, 클라이언트에서는 프록시와 주체 클래스의 인터페이스 타입으로 접근하여 사용할 수 있게 된다.

<br/>

### 프록시 패턴 사용예제

###### <<Scenario>>
글로벌 유통 및 창고를 갖춘 커머스를 운영한다고 가정하자.
주문을 처리하기 위해서는 주문을 전달할 창고를 지정해야한다.
이때 주문서에 재고가 없는 창고로 주문 전달되지 않도록 어떤 창고에 주문을 보낼지 결정할 방법이 필요하다.
주문의 전체 처리를 적절한 창고로 라우트하는 시스템을 구성하여, 재고가 없는 창고에는 주문을 넣지 않도록 하고 싶다.

이 경우는 Protection Proxy 로써 프록시 패턴이 사용되는 경우라고 할 수 있다.
Warehouse(창고) 로 전달되는 요청을 프록시에서 걸러서 보냄으로써 Warehouse 에 처리할 수 없는 요청이 가지 않도록 막을 수 있다.
    
{% include image_caption_href.html title="Proxy" caption="Proxy and Real Subject" imageurl="/yaboong-blog-static-resources/diagram/proxy-pattern-2.png" %}


<br/>

###### 1. IOrder <<Interface>>
클라이언트 소프트웨어가 시스템과 상호작용할 인터페이스를 정의하는 것이 가장 첫 단계다.
이 인터페이스는 <mark>OrderFulfillment</mark>, <mark>Warehouse</mark> 클래스가 구현한다.

```java
public interface IOrder {
    boolean fulfillOrder(Order order);
}
```

<br/>

###### 2. Warehouse - 주체클래스
두번째 단계는 주체 클래스를 구현하는 것이다.
이 주체 클래스는 실질적으로 주문을 처리하는 구현 메소드를 가지며, 프록시 클래스에서 주문이 가능한지 확인할때 사용할 메소드를 가지고 있다.

```java
public class Warehouse implements IOrder {
    private Hashtable<Integer, Integer> stock;
    private String address;

    @Override
    public void fulfillOrder(Order order) {
        for (Item item: order.getItemList()) {
            Integer sku = item.getSku();
            this.stock.replace(sku, stock.get(sku) - 1);
            
            /* 포장, 배송 등 기타 작업들이 추가적으로 이루어질 수 있음 */
            
            processOne();
            processTwo();
            processThree();
            
        }
    }

    public int currentInventory(Item item) {
        return stock.getOrDefault(stock.get(item.getSku()), 0);
    }
}
```

<br/>

###### 3. OrderFulfillment - 프록시 클래스
마지막으로 프록시 클래스를 구현한다.
프록시 클래스에서는 주문이 가능한지 확인하는 모든 작업이 이루어지며, 주문을 이행할 수 있는 경우에만 주체 클래스에 요청을 위임한다.

```java
public class OrderFulfillment implements IOrder {
    private List<Warehouse> warehouses;

    @Override
    public void fulfillOrder(Order order) {
        for (Item item: order.getItemList()) {
            for (Warehouse warehouse: warehouses) {
                if (warehouse.currentInventory(item) != 0) {
                    warehouse.fulfillOrder();
                }
            }
        }
    }
}
```

이렇게 프록시 클래스로 인해 주문 유효성 검사, 주문의 이행 두 부분으로 분리할 수 있다. 
주체 클래스에서는 유효성 검증 작업을 할 필요가 없으며, 주체 클래스의 각 인스턴스인 창고들에서는 재고가 없을 경우에 대한 처리를 신경쓸 필요가 없다.

<br/>

### 정리 & 요약
프록시 클래스가 주체 클래스를 감싸는 것을 통해,
* Polymorphism(다형성)을 가지도록 디자인함으로써 클라이언트가 하나의 인터페이스 접근할 수 있으며, 
* 리소스 집약적인 객체가 실제로 필요해질 때까지 라이트한 버전의 프록시 클래스로 전처리 등 필요한 작업을 진행할 수 있고, **--Virtual Proxy**
* 클라이언트가 주체 클래스에 접근하는 것에 대한 제한이나 어떤 클라이언트인지에 따라 서로 다른 방식으로 요청이 처리되도록 할 수 있다. **--Protection Proxy**
* 또한, 동일한 물리적 또는 가상 공간에 있지 않은 시스템을 로컬에 있는 것 처럼 표현할 수 있다. **--Remote Proxy**


<br/>

### 참고한 자료
* {% include href.html text="[Coursera - University of Alberta] Design Patterns 2.1.8 – Proxy Pattern" url="https://www.coursera.org/lecture/design-patterns/2-1-8-proxy-pattern-9Vb0W" %}