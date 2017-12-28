---
layout: post
title: "What is functional programming? - 1"
date: 2017-10-18
banner_image:
tags: [scala, summary, functional-programming]
---
## What is functional programming? - 1

#### 함수형 프로그래밍
> 프로그램을 오직 **순수 함수(pure function)** 들로만, **부수효과(side effect)** 가 없는 함수들로만 구축한다는 것.

부수효과(side effect) 란 그냥 결과를 돌려주는 것 이외의 어떤 일을 수행하는 함수를 말한다. 아래는 부수효과의 예시들이다.

* 변수를 수정한다
* 자료구조를 제자리에서 수정한다
* 객체의 필드를 설정한다
* 예외를 던지거나 오류를 내면서 실행을 중단한다
* 콘솔에 출력하거나 사용자의 입력을 읽어들인다
* 파일에 기록하거나 파일에서 읽어들인다
* 화면에 그린다

함수형 프로그래밍은 우리가 프로그램을 작성하는 **방식**에 대한 제약이지 표현 가능한 프로그램의 **종류**에 대한 제약은 아니다.

순수 함수들로 프로그램을 작성하면 **모듈성(modularity)**이 증가하고, 이 덕분에 순수 함수는 테스트, 재사용, 병렬화, 일반화, 분석이 쉽고 버그가 생길 여지가 훨씬 적다.
<!--more-->
실제 프로그램에서 부수효과는 아래와 같은 코드에서 발생한다.
```scala
class Cafe {
  def buyCoffee(cc: CreditCard): Coffee = {
    val cup = new Coffee()
	cc.charge(cup.price)
	cup
  }
}
```
`cc.charge(cup.price)` 가 부수효과의 예이다. 위 함수를 정말 함수적인 관점에서 보면 CreditCard를 받아서 Coffee 를 돌려주는 것이다. 하지만 함수 안에서는 넘겨준 CreditCard에 커피값을 청구(charge)하는 부분이 포함된다. charge에서는 또 내부적으로 대금을 청구하고, 거래 기록을 기록하는 등의 작업들이 포함될 것이다. 함수의 목적인 CreditCard를 받아 Coffee 를 돌려주는 것 외에 다른 모든 기능들을 부수적으로 발생하는 것이다.

-----
#### 순수함수(pure function)란 무엇인가
> 입력 타입이 A이고 출력타입이 B인 함수 f(스칼라에서는 A => B 라는 하나의 형식으로 표기한다)는 타입이 A인 모든 값 a를 각각 타입이 B인 b에 연관시키되, b가 오직 a의 값에 의해서만 결정된다는 조건을 만족하는 계산이다.

예를들어, Int => String 형식의 intToString 함수는 모든 정수를 그에 대응되는 문자열에 대응시킨다. 위와 같은 방식으로 표현하면, 타입이 Int인 모든 값 i를 각각 타입이 String인 s에 연관시키되, s가 오직 i의 값에 의해서만 결정된다는 조건을 만족하는 계산이다.

다른말로, 함수(순수함수)는 주어진 입력으로 뭔가를 계산하는 것 외에는 프로그램의 실행에 그 어떤 관찰 가능한 영향도 미치지 않는다. 객체지향 프로그래머들도 익숙한 순수함수로는 + 함수나(스칼라에서는 + 도 함수다), String 객체의 length 메소드도 순수함수이다.

순수함수의 이러한 개념을 **참조 투명성(referential transparency, RT)** 라는 개념을 이용해서 공식화 할 수 있다. 참조 투명성은 함수가 아니라 **표현식(expression)** 의 한 속성이다. 표현식이란 프로그램을 구성하는 코드 중 하나의 결과로 평가될 수 있는 임의의 코드조각이라고 생각하면 된다. (스칼라 Interpreter에 입력했을 때 답이 나오면 모두 표현식이다)

-----
#### 참조 투명성과 순수성
> 만일 모든 프로그램 p에 대해 표현식 e의 모든 출현(occurrence)을 e의 **평가 결과로 치환**해도 p의 의미에 아무 영향이 미치지 않는다면, 그 표현식 e는 **참조에 투명하다(referentially transparent)**. 만일 표현식 f(x)가 참조에 투명한 모든 x에 대해 참조에 투명하면, 함수 f는 **순수하다(pure)**.

위에서 부수효과가 있었던 buyCoffee 함수를 다시 한 번 살펴보자
```scala
def buyCoffee(cc: CreditCard): Coffee = {
  val cup = new Coffee()
  cc.charge(cup.price)
  cup
}
```
`cc.charge(cup.price)`의 반환 형식이 무엇이든 `buyCoffee`는 그 반환값을 폐기한다. 따라서 `buyCoffee(myCreditCard)` 의 평가결과는 그냥 cup이며, 이는 `new Coffee()` 와 동등하다. 참조 투명성의 정의하에서 `buyCoffee`가 순수하려면 임의의 p(프로그램)에 대해 `p(buyCoffe(myCreditCard))` 가 `p(new Coffee())` 와 동일하게 작동해야 한다. 이것이 참이 아님은 명백하다.

참조 투명성은 함수가 수행하는 모든 것이 함수가 돌려주는 값으로 대표된다는 불변(invariant)조건을 강제한다. 이러한 제약을 지키면 **치환 모형(substitution model)**이라고 부르는 추론 모형이 가능해진다. 참조에 투명한 표현식들의 계산 과정은 마치 대수 방정식을 풀 때와 아주 비슷하다.

* 표현식의 모든 부분을 전개(확장)하고
* 모든 변수를 해당 값으로 치환하고
* 그것들을 가장 간단한 형태로 환원(축약)하면 된다
* 각 단계마다 하나의 항(term)을 그에 동등한 것으로 대체한다.

> 참조 투명성은 프로그램에 대한 등식적 추론(equational reasoning)을 가능하게 한다.

-----
#### 치환 모형을 이용한 참조 투명성 검증
첫번째 예제는 참조에 투명한 경우이다. 간단한 예제 이므로 REPL에 입력해서 나오는 결과는 생략했다.
```scala
val x = "Hello, World"
val r1 = x.reverse
val r2 = x.reverse
```
위 예제에서 r1, r2 는 항상 같은 값을 가진다. 여기서 x항의 모든 출현을 x가 지칭하는 표현식으로 치환하면 다음과 같은 모습이 된다.
```scala
val r1 = "Hello, World".reverse
val r2 = "Hello, World".reverse
```
r1과 r2는 여전히 같다. 이러한 변환은 결과에 영향을 미치지 않는다. 따라서 x 는 참조에 투명하다.

이번에는 참조에 투명하지 않은 경우이다. java.lang.StringBuilder 클래스의 append 함수를 생각해 보자. 이 함수는 StringBuilder를 그 자리에서 조작한다. append를 호출하고 나면 StringBuilder의 이전 상태는 파괴된다.

```scala
val x = new StringBuilder("Hello")
val y = x.append(", World")
val r1 = y.toString
val r2 = y.toString
```

지금까지는 이전의 x, r1, r2가 모두 참조 투명성을 가지는 예제와 별반 다를 게 없어 보인다. 하지만 앞에서 처럼 y의  모든 출현을 해당 x.append(", World")로 치환해보자

```scala
val x = new StringBuilder("Hello")
x: java.lang.StringBuilder = Hello

val y = x.append(", World")
y: java.lang.StringBuilder = Hello, World

val r1 = x.append(", World").toString
r1: java.lang.String = Hello, World

val r2 = x.append(", World").toString
r2: java.lang.String = Hello, World, World
```
이제 r1과 r2는 같지 않다. 이러한 변환에 의해 프로그램은 이전과는 다른 결과를 낸다. 따라서 StringBuilder.append는 순수함수가 아니라는 결론을 내릴 수 있다. 이처럼 부수효과가 존재하면 프로그램의 행동에 관한 추론이 어려워 진다. 반면 치환 모형은 추론이 간단하다. 코드블록을 이해하기 위해 머릿속에서 일련의 상태 갱신들을 따라갈 필요가 없다. 

> 부수효과가 없는 함수는 함수의 실행이전과 이후에 발생할 수 있는 모든 상태 변화들을 머릿속으로 짚어 나가지 않고도 함수가 하는 일을 이해할 수 있다.

* 모듈적인 프로그램은 전체와는 독립적으로 이해하고 재사용할 수 있는 구성요소들로 구성된다.
* 그런 프로그램에서 프로그램 전체의 의미는 오직 구성요소들의 의미와 구성요소들의 합성에 관한 규칙들에만 의존한다.
* 즉, 구성요소들은 **합성가능**하다.
* 순수 함수는 모듈적이고 합성 가능한다. 이는 순수 함수에서 계산 자체의 논리가 "결과로 무엇을 할 것인가"나 "입력을 어떻게 얻을 것인가"와는 분리되어 있기 때문이다.
* 즉, 순수함수는 하나의 블랙박스이다.
* 입력이 주어지는 방식은 단 하나, 항상 함수에 대한 인수들로만 주어진다.
* 그리고 함수는 결과를 계산해서 돌려줄 뿐.

-----

> (참고) "Functional Programming in SCALA" - Paul Chiusano and Runar Bjarnason, 류광 옮김