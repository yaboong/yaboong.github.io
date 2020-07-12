---
layout: post
title: "HttpServletRequest, HttpServletResponse 를 스프링빈으로 주입받아서 사용하면 스레드 세이프할까?"
date: 2020-07-05
banner_image: spring.png
categories: [spring]
tags: [spring]
---

### 개요
* SpringMVC 에서 HttpServletRequest, HttpServletResponse 를 컨트롤러 메서드 파라미터로 받지않고, 스프링빈으로 주입받아서 사용할 수 있다.
* 매 요청마다 새로운 객체가 전달되어야 하는 request/response 객체를 주입받아서 사용하는 싱글톤 컨트롤러에서 스레드 세이프하게 동작할까?
* 만약 스레드 세이프 하다면? 이렇게 사용하는건 좋은 방법일까? 

<!--more-->

<br/>

### 디버그 찍고 역추적
(HttpServletRequest, HttpServletResponse 둘다 같은 방식으로 생성/주입되기 때문에 HttpServletResponse 객체 위주로 풀어나갈 예정)
  
{% include image_caption_href.html title="" caption="" imageurl="https://yaboong-blog-static-resources.s3.ap-northeast-2.amazonaws.com/spring/spring-bean-httpservlet-injection.png" %}
주입받는 객체가 언제 생성되는지 확인하기 위해 생성자에 디버그를 찍어보았다.
생성자로 전달받은 httpServletResponse 객체를 할당하는 line 을 실행하면 디버거에 아래와 같이 할당되는 것을 볼 수 있다. 

{% include image_caption_href.html title="" caption="" imageurl="https://yaboong-blog-static-resources.s3.ap-northeast-2.amazonaws.com/spring/httpservlet-object-proxy.png" %}
HttpServletResponse 객체는 프록시 객체다. ($Proxy50@5215)

프록시 객체라고 하면, 객체가 생성될때 프록시를 통해서 생성되었다는 것이고, 프록시를 통해서 생성하는 이유는 객체 접근시 공통적으로 필요한 부가기능 실행을 의도하고 있다고 볼 수 있다.

{% include href.html text="프록시 패턴 기초 참고" url="https://github.com/yaboong/spring-examples/commit/4231fca042c9f644a789c123af8740764a076efd" %}
<— 그런데 이렇게 하려면 매번 인터페이스를 직접 만들고 구현해줘야 하는 번거로움이 있는데 jdk dynamic proxy 를 사용하면 동적으로 runtime 에 프록시 객체를 생성할 수 있다.

위 HttpServletResponse 객체는 jdk dynamic proxy 를 통해서 동적으로 생성된 프록시 객체임을 <mark>$Proxy50@5215</mark> 로 디버거에 찍히는 것을 보고 알 수 있다.



<br/>

### 참고한 자료
* {% include href.html text="" url="" %}