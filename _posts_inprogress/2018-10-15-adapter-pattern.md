---
layout: post
title: "디자인패턴 - 어댑터 패턴"
date: 2018-10-15
banner_image: java-banner.png
categories: [design-pattern]
tags: [design-pattern, java, oop]
---

### 개요
* 어댑터 패턴에 대해서 알아본다.
<!--more-->


<br/>

### 어댑터 패턴
어댑터 패턴은 이름대로 어댑터처럼 사용되는 패턴이다. 220V 를 사용하는 한국에서 쓰던 기기들을, 어댑터를 사용하면 110V 를 쓰는곳에 가서도 그대로 쓸 수 있다.
이처럼, 호환성이 없는 인터페이스 때문에 함께 동작할 수 없는 클래스들이 함께 작동하도록 해주는 패턴이 어댑터 패턴이라고 할 수 있겠다.
이를 위해 어댑터 역할을 하는 클래스를 새로 만들어야 한다.

기존에 있는 시스템에 새로운 써드파티 라이브러리가 추가된다던지, 
레거시 인터페이스를 새로운 인터페이스로 교체하는 경우에 코드의 재사용성을 높일 수 있는 방법이 어댑터 패턴을 사용하는 것이다.

구조를 보면 아래와 같다.

{% include image_caption_href.html title="Adapter Pattern" caption="Coursera Design Pattern 강의 중" imageurl="https://s3.ap-northeast-2.amazonaws.com/yaboong-blog-static-resources/diagram/adapter-pattern-1.png" %}

**Client** <br/>써드파티 라이브러리나 외부시스템을 사용하려는 쪽이다. 

**Adaptee** <br/>써드파티 라이브러리나 외부시스템을 의미한다.

**Target Interface** <br/>Adapter 가 구현(implements) 하는 인터페이스이다. 클라이언트는 Target Interface 를 통해 Adaptee 인 써드파티 라이브러리를 사용하게 된다.

**Adapter** <br/> 
Client 와 Adaptee 중간에서 호환성이 없는 둘을 연결시켜주는 역할을 담당한다.
Target Interface 를 구현하며, 클라이언트는 Target Interface 를 통해 어댑터에 요청을 보낸다.
어댑터는 클라이언트의 요청을 Adaptee 가 이해할 수 있는 방법으로 전달하고, 처리는 Adaptee 에서 이루어진다.

<br/>

### 어댑터 패턴 호출 과정

{% include image_caption_href.html title="Adapter Pattern" caption="Adapter Pattern Sequence Diagram" imageurl="https://s3.ap-northeast-2.amazonaws.com/yaboong-blog-static-resources/diagram/adapter-pattern-2.png" %}

클라이언트에서는 Target Interface 를 호출하는 것 처럼 보인다.
하지만 클라이언트의 요청을 전달받은 (Target Interface 를 구현한) Adapter 는 자신이 감싸고 있는 Adaptee 에게 실질적인 처리를 위임한다.
Adapter 가 Adaptee 를 감싸고 있는 것 때문에 Wrapper 패턴이라고도 불린다.  

<br/>

### 어댑터 패턴 사용예시 - 간단한거
 




<br/>

### 참고한 자료
* {% include href.html text="[javarevisited] Adapter Design Pattern in Java with Example" url="https://javarevisited.blogspot.com/2016/08/adapter-design-pattern-in-java-example.html?m=1" %}
* {% include href.html text="[위키] 어댑터 패턴" url="https://ko.wikipedia.org/wiki/어댑터_패턴" %}
* {% include href.html text="" url="" %}
* {% include href.html text="" url="" %}
* {% include href.html text="" url="" %}
* {% include href.html text="" url="" %}
* {% include href.html text="" url="" %}
* {% include href.html text="" url="" %}
* {% include href.html text="" url="" %}
* {% include href.html text="" url="" %}
* {% include href.html text="" url="" %}
* {% include href.html text="" url="" %}
* {% include href.html text="" url="" %}
* {% include href.html text="" url="" %}
* {% include href.html text="" url="" %}
* {% include href.html text="" url="" %}