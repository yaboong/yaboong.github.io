---
layout: post
title: "듣보잡(?) Web Framework 사용해보기 - 1"
date: 2018-01-18
banner_image: web-frameworks.jpg
categories: [frameworks]
tags: [http4s]
---

### 개요
백엔드 프레임워크로 사용할 수 있는 것 중 여기저기서 쓴다고 들어 본 것들은 .net, node, flask, django, sinatra, rails, play, spring
정도가 있는 것 같다. 지금 유명하지는 않지만 앞으로도 유명하지 않을 수도 있겠지만 빠른 성능을 가진 다른 프레임워크를 써보고 싶었다. 
[https://www.techempower.com/benchmarks/](https://www.techempower.com/benchmarks/) 에 가면 프레임워크-DB 별로 성능을 비교해 놓은 걸 볼 수 있는데,
얼마나 신뢰할 수 있는 자료인지는 모르겠지만 재미로 본다고 생각하고 슬쩍 훑어 보았다. 뭘 한번 써볼까?
<!--more-->

### 걍 썰
Spring 의 경우 2015년 아직 대학생일 때 아프리카 콩고민주공화국에서 학사정보시스템을 개발하는 프로젝트가 있었는데 인턴으로 가서 혼자.. 개발했던 적이 있다.
개발 관련된 것은 아니지만 내 블로그니까 ^^ 내가 하고싶은 이야기 적는 거니까 이 썰도 한번 풀어봐야겠다. 아무튼 그렇게 토비의 Spring 책 보면서 맨땅에 헤딩으로 했던 적이 있다.
그리고 한국 돌아와서 잠깐 6개월 정도 스타트업에서 일 했었는데 그 때도 Spring 을 썼었다. 

그리고 다른 스타트업에서 Scala 를 사용했는데 Scala 도 낯선데 Scalatra 라는 더 낯선 프레임워크를 쓰고 있었고 얄팍하게 나마 경험해 보았다.
찾아보니 Play 다음으로 많이 쓰이는 게 Scalatra 이긴 한가보다 ([여기서봄](https://hotframeworks.com/languages/scala)).
개발할 때 구글링해도 나오는 게 거의 없어서 Scalatra Cookbook pdf 파일 하나에 의존해서 이것저것 파악했던 기억이 난다.

심지어 내가 stackoverflow 에 올린 질문이 하루만에 구글 검색결과에서 세번째 결과로 노출되는 영광(?)도 얻었다.
(질문 수준이 하도 낮아서 쪽팔려서 안적으려고 했지만 누군가 '구라치네..' 할까봐 적어보면) 'scalatra jquery' 로 검색하면 세번째로 나온다...
Scalatra 에 적응해 보려고 회의실 예약 시스템을 간단하게 만들어 보았는데 ([여기](https://github.com/yaboong/scalatra-meeting-room-reservation)) 그 과정에서 jquery 를 좀 쓰게 되면서 질문했던 내용이다.
근데 답변도 내가 달았다... ㅋㅋ 사람들이 많이 사용하지 않는 걸 쓸 경우 단점을 몸으로 체감했다. 참고할 만한 자료가 너무 없다.
  
전 사수님이 SQLAlchemy 를 써보자고 해서 Flask 도 살짝 맛만 보았다. 
관리도구 하나를 Flask 로 만들었는데 flask-admin 이라는 라이브러리를 사용하면 테이블 구조에 맞게 CRUD 를 할 수 있는 화면을 자동으로 생성해준다.
 
기존 내부 시스템이 Rails 로 되어 있어서 내부 프로세스 파악하느라 Ruby 코드도 살짝 읽어보고 미약하게 나마 유지보수 정도는 해 보았다. 
근데 Ruby 랑 Rails 는 맛 본 것도 아니고 냄새만 맡은 정도..?
아무튼 짧은 시간동안 꽤나 다양한 프레임워크들을 접해 보았는데 어떤 프레임워크는 뭐가 좋고 왜 쓰고 얼마나 성능이 뛰어난지에 대한 생각은 안 해본 것 같다.

프레임워크를 선택 할 때는 성능도 중요하지만, 안정성, 지원하는 언어, 언어의 생산성, 라이브러리나 레퍼런스는 다양한지, 오픈소스라면 활발하게 커밋이 이루어지고 있는지 등등 고려해야 할 요소들이 많은 것 같다.
하지만 일단 재미로 써 보는 것이니가 성능이랑 언어 위주로만 골라보았다. 

[techempower.com](https://www.techempower.com/benchmarks/#section=motivation&hw=ph&test=fortune) 에서 

> Choosing a web application framework involves evaluation of many factors. While comparatively easy to measure, performance is frequently given little consideration. We hope to help change that.`

라고 말하는 것으로 보아 성능위주로 각 프레임워크에 점수를 매긴다. 결과의 일부를 캡쳐해 보았다.


### Benchmarks

![]({{ site.baseurl }}/yaboong-blog-static-resources/etc/web-framework-comparison-1.png)
...(중략)
![]({{ site.baseurl }}/yaboong-blog-static-resources/etc/web-framework-comparison-3.png)
...(중략)
![]({{ site.baseurl }}/yaboong-blog-static-resources/etc/web-framework-comparison-2.png)

C++ 나 Java 가 많은 것을 보고 살짝 놀랐다. C++ 도 쓸 수 있구나.

1위 조합에 100% 의 점수를 주고 이를 기준으로 다른 프레임워크들은 1위를 기준으로 몇 퍼센트의 성능을 발휘하는지 측정한 것 같다. 
182,991 같은 점수는 어떻게 측정 되는지 잘 모르겠지만 어떤 테스트들을 거치는지는 [여기](https://www.techempower.com/benchmarks/#section=code&hw=ph&test=fortune) 에 설명되어있다.

잘 보면 light-java 라는 놈이 무려 86.8% 의 성능을 내는 것을 볼 수 있다. 오라클에서 또 딴지를 걸어서 지금은 light-4j 라는 이름으로 관리되고 있다.
근데 일단 java 말고 다른게 써보고 싶고 C++은 내가 잘 모르고....
 
node.js 의 경우에도 높은 성능을 내는 것을 볼 수 있다. 
설계상 single thread 만을 사용하는 node.js 는 event loop 가 async 로 request 를 처리한다.
Single thread 를 사용하는 정책은 Multi Threading 에 비해 골칫거리는 확실히 줄어들고 높은 성능을 보장한다.
그러나 I/O bound job 이 많을 경우에는 높은 성능을 낼 수 있지만 CPU-intensive 한 task 를 처리 할 때는 single thread 라는 제약으로 인해 오히려 성능이 제한 될 수 있다.
자세히 알지는 못하지만 뭔가 찝찝하다. node.js 의 장단점과 특성에 대해서는 [여기](http://voidcanvas.com/describing-node-js/) 에서 잘 비교해 놓은 것 같다.

또 눈에 들어오는 녀석이 fintrospect 라는 놈인데 언어는 scala 를 사용하는구나. Twitter 에서 만든 Finagle RPC framework 기반으로 만들어 졌다.
관심이 가서 찾아봤더니 라우팅을 뭔가 익숙하지 않은 방식으로 하는 것 같아서 거부감이 든다.

```python
RouteSpec().at(Method.Get) / "employee"
```

이게... http://host.com/employee 라는 GET request 처리하는 부분인 것 같다... 나같은 초빱이 받아들이기엔 좀 난해했다.
그럼 scala 를 쓸 수 있는 다른 프레임워크 중 괜찮은 건 없을까? http4s 라는 놈이 눈에 들어왔다.

Java, C++, node.js, fintrospect 를 이런저런 핑계로 제외하면서 결국 압도적인 성능을 자랑하는 녀석들을 써보지 못하는 상황을 내가 만들었지만.. 
뭐 http4s 정도면 flask, spring, sinatra 보다 2배이상 빠르고 Go 프레임워크인 gin 보다도 조금 빠른 녀석이라 나쁘지 않다고 생각했다.
> http4s 한번 써보자...! 


