---
layout: post
title: "Programming in Scala summary"
date: 2017-10-17
banner_image:
tags: [scala]
---

    
## CH2
* val var 차이 var 은 재할당

## CH3
* p78 배열을 생성하는 방법 두가지
    ```
    new Array[String](3)
    ```
    ```
    Array("a", "b", "c") 
    ```
* Array 에서는 팩토리메소드 apply 호출.
* 배열을 생성 한 후 해당 배열에 대한 apply, update 메소드는 인스턴스 메소드인듯
* Array 에 있는 apply, update 메소드
* 임의의 개수 인자 받기 \* 사용
* List 에서
    ```
    val twoThree = List(2, 3)
    val oneTwoThree = 1 :: twoThree
    ```
    * 일반적으로 a * b 의 경우 a.\*(b) 와 같이 왼쪽 피연산자의 메소드를 호출하는 것이다.
    * 하지만 메소드 이름이 콜론(:) 으로 끝나는 경우 연산자 방식으로 사용 시 오른쪽 피연산자에 대한 호출을 한다.
    * 따라서 `1 :: twoThree` 에서 twoThree 를 호출 대상 객체로 1을 인자로 받는 메소드 호출인 `twoThree.::(1)` 로 해석한다.
    * 그래서 리스트 끝에는 항상 Nil 이 필요하다.
        * 왜냐하면, 1 :: 2 :: 3 만을 사용해서 리스트를 만들었다면 `1 :: (2 :: 3)` 의 형태가 되는 것인데, 
        * 여기서 :: 연산자(함수)는 오른쪽 피연산자에 대한 호출을 하므로 (2 :: 3) 은 3.::(2) 의 호출 형태를 보인다.
        * 3은 Int 이기 때문에 :: 이라는 함수가 없다.
        * :: 함수를 호출하기 위해서는 리스트 타입이 있어야 하는데, 이를 위해 스칼라에서는 Nil 을 List 클래스의 멤버로 둔 것이다.
<!--more-->
* List, Tuple, Set, Map
    ```
    val set = scala.collection.immutable.Set    // 변경불가
    val set = scala.collection.mutable.Set      // mutable 이라서 변경가능
    var set = scala.collection.immutable.Set    // immutable 이지만 var로 재할당 하기때문에 변경가능
    var set = scala.collection.mutable.Set      // mutable 에 var로 재할당 이므로 변경가능
    ```
* Map
    1. Map 생성할때 생성과함께 초기화 하지 않으면 타입명시해야함
    2. 생성과 함께 초기화 하면 타입추론하므로 타입 명시 안해도됨
* Tuple
    1. Tuple22 클래스까지 정의되어 있음
* 함수형 프로그래밍 스타일
    1. p93 - foreach
    2. 근데 foreach 들어가도 결국 while loop 사용
    3. mkString 사용하면 완전 함수형. side effect 없음
    
## CH4
* 싱글톤 오브젝트 (Companion Object): 자바의 static method 를 담아두는 집처럼 생각하는 것도 한 가지 방법이다 하지만 싱글톤 객체는 정적 메소드를 보관하는 곳 이상이다.
* 클래스와 싱글톤 오브젝트의 한 가지 차이는 싱글톤 객체는 파라미터를 받을 수 없지만, 클래스는 받을 수 있다는 점이다. (싱글톤을 new 로 인스턴스화 할 수 없기 때문에 파라미터를 싱글톤에 넘길 방법이 없다)
* 싱글톤 객체의 초기화는 어떤 코드가 그 객체에 처음 접근할 때 일어난다.
* 스칼라 프로그램을 실행하려면
    1. Array[String]을 유일한 인자로 받고
    2. Unit 을 반환하는
    3. main 이라는 메소드가 들어있으면 된다
* App trait 을 extends 하면 위 과정이 필요없다.
* 캐시 역할을 하는 Map 을 사용할 때는 scala.collection.jcl.WeakHashMap 같은 weak map 을 사용하는 것이 좋다. 그렇게 하면 메모리가 부족할 때 캐시의 원소를 garbage collector 가 수집할 수 있다.
* 스칼라 메소드 파라미터에 있어 중요한 한 가지는 이들이 val 이지 var 이 아니라는 점이다 메소드 본문에서 파라미터에 값을 재할당 하면 컴파일을 할 수 없다. val 의 경우 분석을 위해 나중에 재할당해서 값이 바뀌는지 살펴볼 필요가 없지만 var 의 경우에는 재할당 할 수 있으므로 이를 추적해야 하기 때문에 val 이 더 분석하기 쉽다는 장점이 있다.
 
## CH5
* 별내용 없음

## CH6
* 변경 불가능한 객체의 장단점 비교
    * 장점
        1. 변경 불가능한 객체는 시간에 따라 변하는 상태공간을 가지 않기 때문에, 변경 가능한 객체보다 추론이 쉬운 경우가 종종 있다.
        2. 변경 불가능한 객체는 전달을 비교적 자유롭게 할 수 있다. 상태를 갖는 변경 가능한 객체의 경우, 코드의 다른 부분에 전달하기 전에 복사를 해놓는 등의 방어적인 조치가 필요하다.
        3. 두 스레드가 동시에 객체에 접근하는 경우라고 해도 변경 불가능한 객체는 말 그대로 상태를 바꿀 수 없기에 상태를 망쳐놓는 일이 발생할 수 없다.
        4. 변경 불가능한 객체는 안전한 해시 테이블 키다. HashSet 에 변경 가능한 객체를 키로 설정했는데 나중에 상태를 변경했다면 HashSet 에서 해당 객체를 찾을 수 없는 경우가 발생한다.
    * 단점
        1. 그 자리에서 바로 상태를 변경하면 간단할 수 있는데도 거대한 객체 그래프(특정 시점 메모리에서 객체들 사이의 참조관계)를 복사해야 하는 경우가 있다. 그러므로 많은 라이브러리가 변경 불가능한 클래스를 대신할 수 있는 변경 가능한 클래스를 함께 제공한다.
   
* 자바에는 클래스에 인자를 받는 생성자가 있지만 스칼라에서는 클래스가 바로 인자를 받는다. 이러한 스칼라의 표기는 클래스 내부에서 파라미터를 바로 사용할 수 있어서 좀 더 간결하다. 필드를 정의하고 생성자의 인자를 필드로 복사하는 할당문을 작성할 필요가 없다. 이런 특성은 특히 작은 클래스의 경우 틀에 박힌 코드 작성을 상당히 줄여준다.
   
## CH9
* 고차함수는 function literal 을 인자로 받는 함수를 말한다.
* function literal 은 함수의 정의부가 없고 구현부만 있는 함수를 말한다. 변수에 할당 될 수도, 함수 호출 시 인자로 넘겨줄 수도 있다.
* function literal 이 실행 된 결과를 function value라고 하고, 해당 function value 가 계산되는 과정에서 function literal 이 자유변수를 포함하고 있는 open term 이었다면 그 함수 값을 클로저라고 한다.
* 고차함수, function literal, function value, closure, open term, closed term, 자유변수, 바운드변수 에 대한 설명은 195, 196, 210, 211을 보면 잘 설명되어있다.

## CH13
#### import
* 나중에 임포트한 패키지가 더 앞에서 임포트한 것을 가린다.
* 즉, 임포트 한 패키지에 같은 이름을 가진 클래스가 있다면 더 나중에 임포트한(더 아랫줄에 있는 임포트문) 것이 우선된다.
#### 접근 수식자
* private
    * 자바와 비슷함
    * 하지만, 내부클래스에 private 멤버가 있다면 해당 내부클래스를 포함하고 있는 외부클래스의 스코프에서 내부클래스의 private멤버에 접근 할 수 없다.
    * 자바에서는 외부클래스가 자신의 내부 클래스에 있는 private 멤버에 접근 가능하지만 스칼라는 그 정의를 포함한 클래스나 객체 내부에서만 접근 가능하다.
* protected
    * private 과 마찬가지로, 자바에서 보다 더 제한적이다.
    * 스칼라에서는 protected 멤버를 정의한 클래스의 서브클래스에서만 그 멤버에 접근할 수 있다.
    * 자바에서는 같은 패키지 안에 있으면 모든 protected 멤버에 접근이 가능한 것 보다 제한적이다.
* public
    * 스칼라에서는 따로 접근수식자를 명시하지 않았다면 모두 public 으로 지정된다.
#### 보호 스코프
* 접근 수식자의 의미를 지정자(qualifier)로 확장할 수 있다.
* private[X], protected[X] 에서 X 는 패키지의 각 단위를 말한다, 이렇게 더 세부적인 제어가 가능하다.
* 자바에서는 어떤 정의를 패키지 스코프 외부로 노출시키면 외부 세계 전체에 그 정의가 드러난다.
#### private 보다 더 제한적인 접근 수식자
* 객체 비공개 (object-private): private[this]라고 정의 앞에 붙이면 그 정의를 포함하는 객체 내부에서만 접근이 가능하다.
#### companion object 와 class 에서의 관계
* private, protected 접근에 대해 companion object 와 class 에 동일한 권리를 준다.
* 클래스가 동반 객체의 비공개 멤버에 모두 접근할 수 있는 것처럼 객체도 동반 클래스의 모든 비공개 멤버에 접근할 수 있다.
#### package object
* 모든 패키지는 패키지 객체를 가질 수 있다.
* 패키지 내에서 사용할 type alias(타입 별칭)과 implicit conversion(암시적 변환) 을 넣기 위해 패키지 객체를 쓰는 경우가 많다.

## CH15
#### Case Class
* 컴파일러는 케이스 클래스 이름과 같은 이름의 팩토리 메소드를 추가한다. new 명령어 없이 케이스 클래스 객체를 생성할 수 있다.
* 케이스 클래스의 파라미터 목록에 있는 모든 인자에 암시적으로 val 접두사를 붙인다. 그래서 각 파라미터가 클래스의 필드도 된다.
#### Pattern Matching

* 패턴 매치는 스칼라에서 함수를 단순화하는 핵심이다.
* 패턴 매치 case 문의 순서대로 패턴을 하나씩 검사한다.
* 패턴의 종류
    * 와일드카드 패턴: _ 로 디폴트 패턴매치에 사용.
    * 상수패턴: 자신과 똑같은 값에 매치된다.
    * 변수패턴: 변수 사용 가능.
    * 생성자패턴 객체의 내용에 대해서도 매치를 시도한다.
        ```
        abstract class Expr
        case class Number(num: Double) extends Expr
        case class BinOp(operator: String, left: Expr, right: Expr) extends Expr
        
        expr match {
            case BinOp("+", e, Number(0)) => println("a deep match")
            case _ =>
        }
        ```
        위와 같이 사용 가능하다.
    * 시퀀스 패턴
        ```
        //길이가 정해진 시퀀스 패턴
        expr match {
            case List(0, _, _) => println("found it")
            case _ =>
        }
        
        //길이와 관계없이 매치할 수 있는 시퀀스 패턴
        expr match {
            case List(0, _*) => println("found it"
            case _ =>
        }
        ```
    * 튜플패턴: 시퀀스 패턴과 비슷한 방식으로 사용 가능하다.
    * 타입지정패턴
        ```
        def generalSize(x: Any) = x match {
            case s: String => s.length
            case m: Map[_, _] => m.size
            case _ => -1
        }
        ```
        * 위의 예시처럼 타입을 매치시킬 수도 있다.
        * 하지만 generics 에 대해서는 스칼라에서도 자바와 마찬가지로 type erasure(타입소거) 모델을 사용한다. 
        * 이는 실행 시점에 타입 인자에 대한 정보를 유지하지 않는다는 뜻이다.
            ```
            def isIntIntMap(x:Any) = x match {
             case intMap: Map[Int, Int] => true
             case _ => false
            }
            ```
        * 위 패턴매치 처럼 사용하더라도 실행시에는 어떤 맵 객체가 어떤 타입을 인자로 받아서 생성한 것인지 알 방법이 없다.
            ```
            scala> isIntIntMap(Map(1 -> 1))
            res1: Boolean = true
            
            scala> isIntIntMap(Map("abc" -> "abc"))
            res2: Boolean = true
            ```
            콜렉션의 제너릭스의 경우 타입소거 모델에 의해 타입에 대한 패턴매치가 불가능함을 알 수 있다.
        * 타입소거의 유일한 예외는 배열이다. 배열은 자바뿐 아니라 스칼라에서도 특별하게 다뤄지기 때문이다.
        * 배열에서는 원소 타입과 값을 함께 저장한다.
        * 그래서 배열 타입과 패턴매치를 할 수 있다.

#### Sealed Class
* 케이스 클래스에 의한 패턴 매치를 작성할 때 마다 모든 가능한 경우를 다 다뤘는지 확인할 필요가 있다.
* 패턴 매치를 위한 클래스 계층을 작성한다면 그 계층에 속한 클래스를 봉인하는 것을 고려해야 한다.
* sealed 키워드는 패턴매치를 해도 좋다는 면허처럼 쓰이곤 한다.
        
#### Option 타입
* Option 타입은 선택적인 값을 표현하며 두 가지 형태가 있다. 값이 있으면 Some(x), 없으면 None 이다.
* 옵션 값을 분리해내는 가장 일반적인 방법은 패턴매치다.
    ```
    def show(x: Option[String]) = x match {
        case Some => s
        case None => "?"
    }
    ```
* 스칼라 프로그램에서는 옵션 타입을 자주 사용한다. 값이 없음을 표현하기 위해 null 을 사용하는 자바와 다르다.
* Java 에서의 null 처리
    * java.util.HashMap 의 get 메소드는 HashMap 안에 있는 값을 반환하거나, 값이 없으면 null 을 반환한다. 이런 접근 방식은 작동하기는 하지만, 오류가 발생하기 쉽다. 프로그램에서 어떤 변수가 null 이 될 수 있는지 추적하기가 어렵기 때문이다.
      (실제로 스프링에서 MVC 패턴으로 개발을 하다보면 DAO - Service - Controller 로 데이터 반환 도중 항상 null 체크를 해줘야 하고, null 체크가 어디에선가 빠져서 NullPointerException 이 발생하게 되면 이를 추적하기가 매우 번거로웠던 기억이 있다)
    * 어떤 변수가 null 이 되도록 허용했다면 그 변수를 사용할 때마다 null 여부를 검사해야만 한다.
* Scala 에서의 null 처리 -> Option 타입의 사용
    * 스칼라에서는 null 을 사용하는 접근 방식이 거의 동작하지 않는다. 해시 맵에 값 타입을 지정하는 일이 가능하고 null 은 어떤 값 타입의 원소가 아니기 때문이다.
    * 스칼라에서는 HashMap[Int, Int] 에서 '원소 없음'을 표시하기 위해 null 을 반환할 수 없다.
    * 스칼라에서는 선택적인 값을 나타내기 위해 *Option* 을 사용하도록 권장한다.
        * 장점1: Option[String] 타입의 변수가 null 이 될 수 있는 String 변수(자바) 보다 '선택적인 String' 이라는 사실을 더 명확히 드러내 준다.
        * 장점2: null 여부를 검사하지 않고 null 이 될 수도 있는 변수를 사용하는 프로그램(자바)이 스칼라의 관점에서는 *타입오류* 라는 점이다.
        * 어떤 변수가 Option[String] 타입이라면 그 변수를 String 으로 사용하려 하는 부분이 있으면 컴파일이 되지 않는다.
        * null 대신 Option 을 사용하면 NullPointerException 이 발생하는 것을 원천 차단할 수 있다.
 
 
## CH16
#### 분할 정복 원칙 (Divide & Conquer Algorithm)
* ::: 메소드는 List 클래스 안에 구현되어 있는 메소드다. 동일한 역할을 하는 append() 메소드를 만들고 직접 구현해보자.
    ```
    def append[T](xs: List[T], ys: List[T]): List[T] =
        xs match {
            case List() => ys
            case x :: xs1 => x :: append(xs1, ys)
        }
    ```
    * xs 가 비어있는 리스트일 경우 ys 를 반환하고 끝낸다.
    * xs 가 비어있지 않은 경우는 1개 이상 있는 경우다.
    * 예를 들어 Int 타입의 원소가 1개 있는 경우에는 x 는 1, xs1 은 Nil 이 될 것이다.
    * x 는 head 가 되고, 나머지인 xs1 은 tail 이 된다.
    * xs 의 tail 부분과 xs 에 이어 붙일 ys 에 대해 append 메소드를 재귀적으로 호출한다.
    ```
    xs = List(1, 2)
    ys = List(9, 8)
    ```
    위 두개의 리스트가 주어졌다면 재귀호출은 아래와 같을 것이다.
    ```
    1 :: append((2::Nil), (9::8::Nil))  // tail 인 (2::Nil)과 ys 로 append 메소드 호출
        2 :: append((Nil), (9::8::Nil)) // 비어있는 리스트에 패턴매치가 되어서 ys 즉 9::8::Nil 을 반환한다.
        2 :: (9::8::Nil)
    1 :: 2 :: 9 :: 8 :: Nil
    ```
    xs 의 tail 에 대해 재귀적으로 append() 메소드를 호출한다. 결국 tail 은 Nil 에 도달할 것이고 이 때 ys 를 이어붙이고 돌아가면서 재귀호출시 head 에 해당했던 부분들에 붙여나가면서 되돌아 간다. 

#### 리스트 패턴매치
* x :: xs 라는 'cons' 패턴은 특별한 중위 연산자 패턴이다.
    * 표현식의 중위 연산자는 메소드 호출과 같다. 
        ```
        a + b 라면 a.+(b) 와 같은 것이다.
        ```
    * 하지만,패턴에서는 규칙이 다르다.
        ```
        p op q 같은 중위연산자는 op(p,q)와 같다.
        ```
    * 즉, 스칼라는 중위 연산자를 생성자 패턴으로 다룬다.
    * 특히, x :: xs 같은 콘즈 패턴은 ::(x, xs) 처럼 다뤄진다.
* 이는 이 패턴의 생성자에 해당하는 :: 라는 클래스가 있어야만 함을 알려준다. 정말로 그런 클래스가 있다. (ch22)

#### 리스트 기타 용법
* length
    * 배열의 length 와 달리, 리스트의 length 는 비교적 비싼 연산이다. 배열의 length 는 O(1)
    * 리스트의 끝을 찾기 위해 전체 리스트를 순회해야 하기 때문이다. 리스트의 length 는 O(n)
    * 그러므로 list.isEmpty 같은 검사를 list.length == 0 으로 사용하는 것은 같은 결과를 가져오지만 좋은 방식이 아니다.
* init, last
    * head: 첫 번째 요소 반환
    * tail: 첫 번째 요소를 제외한 나머지 리스트를 반환
    * last: 마지막 요소를 반환
    * init: 마지막 원소를 제외한 모든 원소를 반환
    * 리스트를 사용할 때, 대부분의 접근을 리스트의 앞에서 수행하 수 있도록 데이터를 잘 조직화 하는 것이 좋다.
* reverse
    * 어떤 알고리즘이 계산 중에 리스트의 끝을 자주 참조하면 먼저 리스트의 방향을 거꾸로 뒤집은 다음 작업하는 것이 낫다.
* drop, take, splitAt
* apply, indices
    * 임의의 원소를 선택하는 것은 apply 메소드를 통해 지원된다.
    * 그러나 이 메소드는 배열에 비해 리스트에서는 자주 사용하지 않는 것이 좋다.
    * 임의의 원소를 선택하는 연산은 리스트에서는 O(n) 의 시간이 걸리기 때문이다.
* flatten
* zip, unzip
* toString, mkString
* iterator, toArray, copyToArray
* map, flatmap, foreach
    * flatmap 은 List 에 피연산자를 적용한 결과가 Option 이나 Try 에 감싸져 있을 때 값만 가지고 오고 싶을 때 사용하면 유용할 것 같다.
* forall, exists
* sortWith(_ < _) 오름차순 정렬


## CH17 컬렉션
#### Sequence
* List
    * List 앞부분에 빠르게 원소를 추가하거나 삭제할 수 있다.
    * 그러나 리스트를 순차적으로 따라가야만 하기 때문에 임의의 위치에 접근할 때는 빠르지 않다.
* Array
    * 원소의 시퀀스를 저장하며, 임의의 위치에 있는 원소에 효율적으로 접근하게 해준다.
    * 자바의 배열과 달리 각괄호가 아니라 소괄호 사이에 인덱스를 넣어서 접근한다.
* ListBuffer
    * ListBuffer 는 변경 가능한 객체다. (scala.collection.mutable.ListBuffer)
    * 원소를 추가할 필요가 있을 때 더 효율적으로 리스트를 생성하게 해준다.
    * 상수시간이 걸리는 append, prepend 연산을 제공한다.
    * += 연산자로 원소를 리스트 뒤에 추가할 수 있고, +=: 연산자로 원소를 앞에 추가할 수 있다.
    * 리스트를 다 만들고 나면 ListBuffer 에 toList 를 호출해서 List 를 얻을 수 있다.
* ArrayBuffer
    * 끝부분과 시작 부분에 원소를 추가하거나 삭제할 수 있다는 점만 제외하면 배열과 같다.
    * ArrayBuffer 에서 Array 의 모든 연산을 사용할 수 있다.
    * 새 원소를 추가하거나 삭제하는 데는 평균적으로 상수 시간이 걸리지만, 버퍼의 내용을 저장하기 위해 새로운 배열을 할당해야 하기 때문에 종종 선형 시간이 걸린다.
    * 생성할 때 타입인자를 지정해야 한다.
    * 크기는 지정할 필요 없다. 필요에 따라 할당한 공간을 자동으로 조정한다.
* Seq 메소드를 구현한 StringOps
    * Predef 에 String 을 StringOps 로 바꾸는 암시적 변환이 있기 때문에, Seq 처럼 문자열을 다룰 수 있다.
        ```
        def hasUppercase(s: String) = s.exists.(_.isUpper)
        ```
        String 클래스 자체에는 exists 라는 메소드가 없다. 따라서 스칼라 컴파일러는 s 를 그런 메소드가 있는 StringOps 로 변환한다.
        
#### Set, Map
* empty
    ```
    val emptySet = scala.collection.mutable.Set.empty[String]
    val emptyMap = scala.collection.mutable.Map.empty[String, Int]
    ```
    mutable 이 아닌 그냥 Set 이나 Map 을 써도 되지만 의미가 없다. 그냥 Set, Map 을 사용할 경우 val 로 선언하면 변경불가 이기 때문.
* 원소가 5개보다 적은 집합이나 맵에 대해서는 성능을 극대화 하기 위해 특정 크기만 담는 특별한 클래스를 사용한다.
    * class Set1, Set2, Set3, Set4
    * class Map1, Map2, Map3, Map4
    * 5개 이상 부터는 HashSet, HashMap 으로 초기화됨.
* 정렬된 Set, Map
    * 정해진 순서대로 원소를 반환하는 이터레이터를 제공하는 맵이나 집합이 필요할 경우 SortedSet, SortedMap 트레이트를 구현한 TreeSet, TreeMap 을 사용한다.
    * TreeSet, TreeMap 은 내부적으로 red-black tree 데이터 구조를 사용한다.
    * 순서는 Ordered 트레이트를 따라 결정한다.
    * 정렬된 집합이나 정렬된 맵의 키는 반드시 Ordered 트레이트를 혼합하거나, 암시적으로 Ordered 트레이트로 변환 가능해야 한다.

#### 변경 가능 컬렉션과 변경 불가능 컬렉션
* 변경 불가능한 컬렉션이 변경 가능한 컬렉션보다 프로그램을 추론하기가 더 쉽다.
* 더불어, 변경 불가능 컬렉션은 컬렉션에 저장할 원소의 수가 적은 경우에 변경 가능 컬렉션보다 일반적으로 더 작게 저장할 수 있다.
    * 변경 가능한 빈 맵의 디폴트 구현인 HashMap 은 80바이트이고 원소를 하나 추가할 때마다 16바이트가 더 든다.
    * 변경 불가능한 빈 맵은 싱글톤 객체 하나를 모든 참조가 공유하기 때문에 기본적으로 포인터 필드 하나만큼만 메모리가 필요하다.
* 현재 스칼라 컬렉션 라이브러리 구현은 변경 불가능한 Map 이나 Set 의 크기가 4일 때까지 단일 객체를 사용한다.
* 그런 단일 객체는 보통 컬렉션에 들어 있는 원소의 개수에 따라 16~40바이트 정도의 공간을 차지한다.
* 따라서, 크기가 작은 Map, Set 의 경우 변경 불가능한 쪽이 변경 가능한 쪽보다 훨씬 작다.
* 많은 컬렉션이 작은 크기라면, 변경 불가능한 컬렉션을 만드는 것이 공간을 절약하고 성능을 향상하는 중요한 선택이 될 수 있다.

#### 변경 가능한 Set,Map 과 변경 불가능한 Set,Map 사이의 변환
```
import scala.collection.mutable

val treeSet = TreeSet("blue", "green", "red", "yellow")
val mutaSet = mutable.Set.empty ++= treeSet
val immutaSet = Set.empty ++ mutaSet
```

#### Tuple
* 튜플은 각기 다른 타입의 객체를 결합할 수 있기 때문에, Traversable 을 상속하지 않는다.
* 정수하나와 문자열 하나를 묶고 싶다면 리스트나 배열이 아닌 튜플이 필요하다.
* 튜플을 사용하는 가장 일반적인 경우는 메소드에서 여러 값을 반환하는 것이다.
* 튜플은 서로 다른 타입간의 결합에 유용하다.
* 하지만, 결합에 어떤 의미가 있거나, 결합에 어떤 메소드를 추가하기 원한다면 클래스를 생성하는 편이 더 좋다.
* 예를들어, 연/월/일을 결합하고 싶다면 3튜플을 사용하기 보다는 Date 클래스를 만드는 것이 좋다.
* 클래스를 만들면 의도를 명확하게 표현하기 때문에, 코드를 읽는 사람들도 더 쉽게 이해할 수 있고, 컴파일러와 언어가 제공하는 기능을 통해 오류를 더 잘 찾을 수 있다.

## CH18
* 순수 함수형 객체의 필드에 접근하거나 메소드를 호출하면 항상 동일한 결과가 나온다.
    ```
    val cs = List('a', 'b', 'c', 'd')
    ```
* cs.head 는 항상 'a' 를 반환한다. 
* cs를 정의한 지점부터 cs.head 를 호출한 지점 사이에서 cs 리스트에 여러 가지 연산을 가했다고 해도 이 메소드가 반환하는 값은 항상 같다.
* 반면 변경 가능한 개체에 대해 메소드를 호출하거나 그 객체 필드에 접근한 결과는 이전에 어떤 연산자를 실행했는가에 따라 달라진다.

#### 재할당 가능한 변수와 프로퍼티
* 스칼라는 어떤 객체의 멤버 중 비공개가 아닌 모든 var 멤버에 게터와 세터 메소드를 자동으로 정의해 준다.
* 게터와 세터의 이름은 자바의 관례와 다르다.
* var x 의 게터는 그냥 x 이고, 세터는 x_= 이다.
* 예를들어, 어떤 클래스 안에 다음과 같은 var 필드 정의가 있다면
    ```
    val hour = 12
    ```
    재할당 가능한 필드에 게터 hour 와 세터 hour_= 가 생긴다.
* 이런경우 필드에는 항상 private[this]라는 표시가 붙는다. private[this]는 그 필드를 포함하는 객체에서만 접근할 수 있다는 뜻이다.
* 반면, 게터와 세터는 원래의 var 과 같은 가시성을 제공한다.

#### etc
* 필드 초기화에 '= _' 을 사용하면, 필드에 제로를 할당한다.
* 제로 값은 필드의 타입에 따라 다르다.
* Int 는 0, Boolean 은 false, 참조 타입은 null 이다.
* 스칼라에서는 '= _' 초기화를 생략할 수 없다.
    ```
    var celsius: Float
    ```
와 같이 선언하면 celsius 를 초기화 하는 것이 아니라 추상 변수를 선언하게 된다.
* fahrenheit 를 정의하는 필드 없이 섭씨 화씨를 변환하는 클래스를 작성할 수 있다.
    ```
    class Thermometer {
        var celsius: Float = _
        
        def fahrenheit = celsius * 9 / 5 + 32
        def fahrenheit_ = (f: Float) = {
            celsius = (f - 32) * 5 / 9
        }
        override def toString = fahrenheit + "F/" + celsius + "C"
    }
    ```


## CH19 - 타입 파라미터화
* 타입 파라미터화를 사용하면 제네릭 클래스와 트레이트를 쓸 수 있다.
* 예를 들어, Set 은 제네릭이며 타입 파라미터를 받기 때문에 Set[T] 이다.
* 그 결과, 특정 집합 인스턴스는 Set[String], Set[Int] 등이 될 수 있다.
* 자바와 달리, 스칼라에서는 반드시 타입 파라미터를 명시해야 한다.
* *타입 변성(type variance)* 은 *파라미터 타입 간의 상속 관계를 지정*한다.
 
#### 비공개 생성자와 팩토리 메소드
* 자바에서는 생성자를 비공개로 만들어 숨길 수 있다.
* 스칼라에서는 명시적으로 주 생성자를 정의하지 않는다. 다만 클래스 파라미터와 본문에 의해 암시적으로 주 생성자가 만들어진다.
* 하지만 클래스의 파라미터 목록 앞에 private 수식자를 붙여서 주 생성자를 감출 수 있다. ("감출 수 있다" <- 직접적으로 접근하지 못하도록 할 수 있다는 말)
    ```
    class Queue[T] private (
        private val leading: List[T],
        private val trailing: List[T]
    )
    ```
* 클래스 이름과 파라미터 사이의 private 는 Queue 의 생성자를 private 으로 만든다.
* 이 생성자는 오직 클래스 자신과 동반 객체 (companion object) 에서만 접근 가능하다.
* 클래스 이름 Queue 는 여전히 공개적으로 알려저 있기 때문에 타입으로 그 이름을 사용할 수는 있지만, 그 생성자를 호출하는 일은 불가능하다.
* 동반 객체의 apply 메소드를 정의해서 새 Queue 의 인스턴스를 만들도록 할 수 있다.
    ```
    object Queue {
        def apply[T](xs: T*) = new Queue[T](xs.toList, Nil)
    }
    ```
    * 이 객체를 class Queue 가 있는 소스파일에 넣으면, Queue 객체를 Queue 클래스의 동반 객체로 만들 수 있다.
    * 동반 객체는 그 동반 클래스와 같은 접근 권한을 갖는다. (13.5절)
    * 따라서, Queue(싱글톤 object) 객체의 apply 메소드는 클래스의 생성자가 비공개라고 해도 새 Queue 객체를 만들 수 있다.
    * 이 팩토리 메소드가 apply 라는 이름이기 때문에, 클라이언트가 큐를 Queue(1, 2, 3) 같은 표현식을 써서 만들 수 있다.
    
#### 변성 표기
* 아래와 같이 더 추상화 된 Queue trait 가 있다고 치자.
    ```
    trait Queue[T] {
        def head: T
        def tail: Queue[T]
        def enqueue(x: T): Queue[T]
    }
    // 구체적인 구현은 리스트 19.4 참고
    ```
    * 위에서 정의한 Queue 는 트레이트이며, 타입이 아니다. 타입이 아닌 이유는 타입파라미터를 따로 받기 때문이다.
        ```
        x match {
            case x: Queue => 
        }
        ```
        이런식으로 쓰면 "Type Queue takes type parameters" 라는 오류를 볼 수 있다. 패턴매치에 사용한 Queue 라는 Type 은 타입파라미터를 받기 때문에 구체적인 타입을 지정해 주어야 한다는 것이다.
    * 따라서, Queue 는 트레이트이고, Queue[String] 은 타입이다.
    * Queue 는 또한 타입 생성자(type constructor) 라고도 한다. 타입 파라미터를 지정하면 타입을 만들 수 있기 때문이다.
    * 타입 생성자인 Queue 는 Queue[Int], Queue[Strig], Queue[AnyRef] 같은 일련의 타입을 '생성'한다.
    * 또한 Queue 를 제네릭(generic) 트레이트라 부를 수도 있다. 
    * '제네릭' 이라는 말은 여러 타입을 고려해 포괄적으로 작성한 클래스나 트레이트를 가지고 여러 구체적인 타입을 정의할 수 있다는 뜻이다.
        * 예를 들어, Queue 트레이트는 제네릭 큐다. 반면 Queue[Int] 나 Queue[String] 은 구체적 큐다.

* Queue[T] 에 의해 발생하는 여러 타입 사이의 서브타입 관계
    * S가 T의 서브타입이라면 Queue[S] 가 Queue[T] 의 서브타입이라면
        * Queue 트레이트는 타입 파라미터 T에 대해 공변적(covariant)이다.
        * 이 경우, 타입 파라미터가 하나 밖에 없기 대문에 그냥 Queue 가 공변적이라고 말해도 된다.
        * 공변적이라는 의미는 Queue[String]을 Queue[AnyRef] 를 필요로 하는 곳에 넘길 수 있다는 말이다.
        * Queue[AnyRef] 타입으로 Queue[String] 타입을 참조할 수 있다(?)
            ```     
            Queue 트레이트가 파라미터 T에 대해 공변적이라면 아래와 같은 할당이 성립한다.
            val qs: Queue[String] = Queue("str")
            val ar: Queue[AnyRef] = qs
            ```
        * 하지만 스칼라에서 제네릭 타입은 기본적으로 무공변(non-variant) 이다.
        * 그래서 기본적으로 Queue 트레이트를 공변적으로 사용할 수 없다.
        * 하지만 Queue 클래스 정의의 첫 줄을 다음과 같이 바꾸면 큐의 서브타입 관계에 공변성을 요구할 수 있다.
            ```
            trait Queue[+T] { ... }
            ```
        * 형식적인 파라미터 앞에 + 를 붙이면 서브타입 관계가 그 파라미터에 대해 공변적이라는 이야기다.
        * 컴파일러는 Queue 의 '구현'에서 해당 서브타입이 건전한지 검사한다.
    * T가 S의 서브타입인 경우 Queue[S]가 Queue[T]의 서브타입이라면
        * Queue 트레이트는 타입파라미터 S에 대해 반공변적(contravariant)이다.
            ```
            trait Queue[-T] { ... }
            ```
    * 어떤 타입 파라미터의 공변, 반공변, 무공변 여부를 파라미터의 변성(variance)라고 부른다.
    * 타입 파라미터에 붙일 수 있는 + 나 - 기호는 변성표기(variance annotation)라고 부른다. 
        
#### 하위 바운드, 상위 바운드
* 하위 바운드
    ```
    class Queue[+T] (private val leading: List[T], private val trailing: List[T]) {
        def enqueue[U >: T] (x: U) = new Queue[U](leading, x :: trailing) // ...
    }
    ```
    U >: T 의 의미 -> "U 는 T 의 슈퍼타입이어야만 한다"
* 상위바운드
    ```
    def orderedMergeSort[T <: Ordered[T]](xs: List[T]): List[T] = { ... }
    ```
    T <: Ordered[T] 의 의미 -> "orderedMergeSort에 전달하는 리스트 원스의 타입이 Ordered 의 서브타입이어야만 한다"


## CH20 - 추상멤버
* 클래스나 트레이트의 멤버가 그 클래스 안에 완전한 정의를 갖고 있지 않으면 추상 멤버 (abstract member)
* 스칼라는 메소드 뿐 아니라 추상 필드도 정의할 수 있으며 클래스나 트레이트의 멤버로 추상 타입을 정의할 수도 있다.

#### 추상멤버 간략 Summary
* Example
    * 아래 트레이트는 추상 타입(T), 메소드(transform), val(initial), var(current) 각 종류의 추상 멤버를 하나씩 정의한다.
        ```
        trait Abstract {
            type T
            def transform(x: T): T
            val initial: T
            var current: T
        }
        ```
    * Abstract 구현
        ```
        class Concrete extends Abstract {
            type T = String
            def transform(x: String) = x + x
            val initial = "hi"
            var current = initial
        }
        ```
        
#### 추상멤버 요소별 설명
* 타입멤버
    * type T 와 같은 타입 멤버를 사용하면 클래스나 트레이트의 코드를 더 명확하게 만드는 데 도움을 준다.
* 추상 val
    * val 에 대해 이름과 타입은 주지만 값은 지정하지 않는다. 값은 서브클래스의 구체적 val 정의가 제공해야 한다.
    * 어떤 클래스 안에서 어떤 변수에 대해 정확한 값을 알 수 없지만, 그 변수가 클래스의 인스턴스에서 변하지 않으리란 사실은 알고 있을 때 추상 val 을 사용한다.
    * 추상 val 선언은 파라미터 없는 추상 메소드 선언과 비슷해 보인다.
        ```
        def initial: String
        ```
        * 하지만 initial 이 추상 val 이라면 클라이언트는 obj.initial 을 사용할 때마다 같은 값을 얻을 수 있음을 확신할 수 있다.
        * 만약 initial 이 추상 메소드라면 그런 보장은 없다. initial 을 호출 할 때마다 다른 값을 반환하는 구체적인 메소드로 구현할 수도 있기 때문이다.
        * 추상 val 은 그에 대한 구현에 '구현시 val 정의를 사용해야 한다' 라는 제약을 가한다.
        ```
        abstract class Fruit {
            val v: String // 'v' 는 값을 의미
            def m: String // 'm' 은 메소드를 의미
        }
        
        abstract class Apple extends Fruit {
            val v: String
            val m: String // 'def' 를 'val' 로 오버라이드 할 수 있다.
        }
        
        abstract class BadApple extends Fruit {
            def v: String // 오류: 'val' 은 'def' 로 오버라이드 할 수 없다.
            def m: String
        }
        ```
* 추상 var
    * 18.2절에서 클래스의 멤버인 var 에는 게터와 세터 메소드를 스칼라가 만들어 준다는 것을 보았다.
    * 이는 추상 var 에도 성립한다.
    * 예를 들어, hour 라는 추상 var 를 만들면 암시적으로 게터 메소드인 hour 와 세터 메소드인 hour_= 를 정의하는 것과 같다.
        ```
        trait AbstractTime {
            var hour: Int
            var minute: Int
        }
        ```
        위 트레이트 정의는 정확이 아래와 같다.
        ```
        trait AbstractTime {
            def hour: Int
            def hour_=(x: Int)
            def minute: Int
            def minute_=(x: Int)
        }
        ```
* 추상 val 초기화
    * 추상 val 은 때때로 슈퍼클래스 파라미터오 같은 역할을 한다.
    * 즉 슈퍼클래스에 빠진 자세한 부분을 서브클래스에 전달할 수 있는 수단을 제공한다.
    * 이는 트레이트의 경우 특히 중요하다. 트레이트에는 파라미터를 넘길 생성자가 없기 때문이다.
    * 따라서, 보통 트레이트를 파라미터화하려면 서브클래스에서 구현하는 추상 val 을 통하기 마련이다.
        ```
        trait RationalTrait {
            val numerArg: Int
            val denomArg: Int
        }
        ```
        위 트레이트를 구체적으로 인스턴스화하려면, 추상 val 정의를 구현해야 한다.
        ```
        new RationalTrait {
            val numerArg = 1
            val denomArg = 2
        }
        ```
    * 두번째 new 가 붙은 표현식은 트레이트를 혼합한 익명클래스의 인스턴스를 만들며, 클래스 정의는 본문에 있다.
    * 이 익명 클래스 인스턴스화 표현식은 Rational(1, 2) 에 상응하는 효과를 발휘한다.
    * 하지만 표현식의 초기화 순서에 있어 중요한 차이가 존재한다.
        ```
        new Rational(expr1, expr2)
        ```
        * 위와 같이 표현식을 쓰면, 클래스 Rational 을 초기화하기 전에 두 식 expr1, expr2 를 계산한다.
        * 따라서, expr1 과 expr2 의 값을 Rational 클래스의 초기화 시에 사용 가능하다.
        * 하지만 트레이트의 경우 상황은 정반대다.
        ```
        new RationalTrait {
            val numerArg = expr1
            val denomArg = expr2
        }
        ```
        * 위와 같이 쓴다면 익명 클래스를 초기화하는 도중에 표현식 expr1, expr2 를 계산한다.
        * 익명 클래스는 RationalTrait 다음에 초기화된다.
        * 따라서, numerArg 와 denomArg 의 값은 RationalTrait 를 초기화하기 전에는 사용 가능하지 않다.
        * 더 정확하게 말하면, 두 값 중 어느 것이든 읽는 경우 Int 타입의 기본 값인 0을 돌려 받는다.
        ```
        trait RationalTrait {
            val numerArg: Int
            val denomArg: Int
            require(denomArg != 0)
            private val g = gcd(numberArg, denomArg)
            .
            .
            .
        }
        ```
        * 위 트레이트의 분모나 분자에 단순 리터럴이 아닌 표현식을 넣어서 초기화하려고 하면 예외가 발생한다.
            ```
            scala> val x = 2
            x: Int = 2
            scala> new RationalTrait {
                      val numerArg = 1 * x
                      val denomArg = 2 * x
                   }
            java.lang.IllegalArgumentException: requirement failed
              ...
            ```
        * RationalTrait 클래스를 초기화 할 때 denomArg 의 값이 여전히 디폴트 값인 0이기 때문에 require 호출이 실패하여 예외가 발생한다.
        * 1 \* x, 2 \* x 에 대한 계산은 RationalTrait 의 인스턴스가 생성 된 후에 계산되기 때문이다.
        * (by-name parameter 가 아니라면) 클래스 파라미터 인자는 클래스 생성자에 전달되 전에 계산되는 것과 비교하면 큰 차이다. 
    * 이를 해결할 수 있는 방법으로 필드를 미리 초기화 하는 방법과 지연 계산 val 변수를 사용하는 방법이 있다.
    
#### 필드를 미리 초기화하기
* 슈퍼클래스를 호출하기 전에 서브클래스의 필드를 초기화 하는 방법
    ```
    new {
        val numerArg = 1 * x
        val denomArg = 2 * x
    } with RationalTrait
    ```
    * 초기화 부분에 해당하는 {} 가 슈퍼트레이트인 RationalTrait 를 언급하는 부분보다 앞에 있다.
    * 미리 초기화 한 필드는 슈퍼클래스 생성자를 호출하기 전에 초기화 되기 때문에 초기화시 생성중인 객체를 언급할 수는 없다.
    * 따라서 초기화 부분에서 this 를 참조한다면, 이 참조는 해당 클래스나 객체를 포함하는 바깥쪽 객체를 의미하지 생성중인 객체 자제를 의미하지는 않는다.
        ```
        scala> new {
                 val numerArg = 1
                 val denomArg = this.numerArg * 2
               } with RationalTrait
        <console>:11: error: value numerArg is not a member of object
        ...
        ```
        위 예제는 컴파일 할 수 없다. this.numerArg 라는 참조는 new 가 들어있는 객체에서 numerArg 필드를 찾는 것이기 때문이다.

* 지연 계산 val 변수를 사용하는 방법
    * 때로는 시스템이 스스로 모든 것을 어떻게 초기화할지 결정하게 두는 편이 더 나은 경우가 있다.
    * 어떤 val 정의를 lazy 하게 만들면 그렇게 할 수 있다.
    * 어떤 val 정의 앞에 lazy 수식자가 있으면 val 변수를 정의할 때 오른쪽의 초기화 표현식을 계산하지 않는다. 프로그램에서 그 val 의 값을 처음 사용할 때 초기화 표현식을 계산한다.
    * lazy val 로 트레이트 초기화 하기
        ```
        trait LazyRationalTrait {
            val numerArg: Int
            val denomArg: Int
            lazy val numer = numerArg / g
            lazy val denom = denomArg / g
            override def to String = numer + "/" + denom
            private lazy val g = {
                require(denomArg != 0)
                gcd(numerArg, denomArg)
            }
            private def gcd(a: Int, b: Int): Int =
                if (b == 0) a else gcd(b, a % b)
        }
        ```
    * lazy val 은 처음 계산한 값을 보관해 두고, 나중에 같은 val 을 다시 사용하면 그 때는 저장했던 값을 사용하는 방식이다. (두번 계산하지 않는다)
    
    
#### 추상타입
* 추상 타입 선언은 서브클래스에서 구체적으로 정해야 하는 어떤 대상에 대한 빈 공간을 마련해 두는 것이다.
* 이 경우, 클래스 계층구조의 하위 계층에서 정의해야 하는 것은 어떤 '타입'이다.
    ```
    class Food
    
    abstract class Animal {
        type SuitableFood <: Food
        def eat(food: SuitableFood)
    }
    
    class Grass extends Food
    
    class Cow extends Animal {
        type SuitableFood = Grass
        override def eat(food: Grass) = {}
    }
    ```

 
## CH21 - 암시적 변환과 암시적 파라미터
    ```
    val button = new JButton
    button.addActionListener(
        new ActionListener {
            def actionPerformed(event: ActionEvent) = {
                println("pressed!")
            }
        }
    )
    ```
암시적 변환을 사용하면 위 코드를 아래와 같이 줄일 수 있다. 현재로써는 실행이 되지 않는다.
    ```
    button.addActionListener(
        (_: ActionEvent) => println("pressed!")
    )
    ```

* 첫단계 - 두 타입 사이에 암시적인 변환 방법을 작성한다.
    ```
    implicit def function2ActionListener(f: ActionEvent => Unit) =
        new ActionListener {
            def actionPerformed(Event: ActionEvent) = f(event)
        }
    ```
    * 위 implicit 메소드로 인해 아래와 같이 호출 할 수 있다.
        ```
        button.addActionListener(
            function2ActionListener(
                (_: ActionEvent) => println("pressed!")
            )
        )
        ```
    * 설명
        * function2ActionListener 함수에 ```(_: ActionEvent) => println("pressed!")``` 라는 function literal 을 넘겨준다.
        * f 라는 파라미터가 function literal 을 받는다. 받을 function literal 은 ActionEvent 타입을 받아서 Unit 타입을 반환하는 함수여야 한다.
        * function2ActionListener 함수는 실행시 넘겨받은 f를 클래스 생성과 함께 실행한다.
* 두번째 단계 - function2ActionListener 를 implicit 으로 선언해 뒀기 때문에 이를 생략해도 컴파일러가 자동으로 추가 해 준다.
    * 이제 아래와 같이 실행할 수 있다.
        ```
        button.addActionListener(
            (_: ActionEvent) => println("pressed!")
        )
        ```
    * 먼저 컴퍼알러는 코드를 있는 그대로 컴파일해 본다.
    * 하지만 타입오류가 발생한다.
        * button.addActionListener() 에 넘겨줘야 하는 것은 ActionLister 타입이다.
        * 근데 ActionEvent 를 받아서 Unit 을 반환하는 함수밖에 없네? -> 타입에러
    * 포기하기 전에 컴파일러는 암시적 변환을 통해 문제를 해결할 수 있는지 살펴본다.
        * implicit 으로 선언된 녀석들 중에 ActionEvent => Unit 의 함수를 받는게 있네?
        * 어? 이놈이 반환하는게 ActionListener 타입이네?
        * 이놈을 쓰면 타입에러를 해결할 수 있겠구나!
    * 따라서 컴파일러는 이 메소드를 시도해 보고 작동하면 계속 다음 단계를 진행한다.
    
* 암시가 쓰이는 부분
    * 값을 컴파일러가 원하는 타입으로 변환하거나
    * 어떤 선택의 수신 객체를 변환하거나
    * 암시적 파라미터를 지정하는 경우

* 컴파일러가 암시적 파라미터를 고를 때 스코프 안에 있는 값의 타입과 파라미터의 타입이 일치하게 하기 때문에, 실수로 일치하는 일이 적도록 암시적 파라미터를 충분히 '드물거나, '특별한' 타입으로 만들어야 한다.
* 적용 가능한 암시적 변환이 스코프 안에 여러개 있는 경우, 가능한 변환 중 하나가 다른 하나보다 절대적으로 '더 구체적' 이라면 컴파일러는 더 구체적인 것을 선택한다.
* 디버깅 시, 컴파일러가 집어넣는 암시적 변환이 무엇인지 살펴보려면 컴파일러에 -Xprint:typer 옵션을 주면 컴파일러는 타입 검사기가 추가한 모든 암시적 변환이 있는 코드를 보여준다.
    
## CH23 - for 표현식 다시보기
* for 표현식 변환 
    * 제너레이터 한개인 경우
        ```
        for (x <- expr1) yield expr2
        ```
        ```
        expr1.map(x => expr2)
        ```
    * 제너레이터로 시작하고 필터가 하나있는 for 표현식의 변환
        ```
        for (x <- expr1 if expr2) yield expr3
        ```
        ```
        for (x <- expr1 withFilter (x => expr2)) yield expr3
        ```
        ```
        expr1 withFilter (x => expr2) map (x => expr3)
        ```
        * 필터 다음에 다른 원소가 더 있더라도 마찬가지 방법을 사용해 변환할 수 있다. seq 가 임의의 제너레이터 정의 필터로 된 시퀀스라고 할 때, 아래 for 표현식의 변환은 다음과 같다.
        ```
        for (x <- expr1 if expr2; seq) yield expr3
        ```
        ```
        for (x <- expr1 withFilter expr2; seq) yield expr3
        ```
    * 제너레이터 2개로 시작하는 for 표현식의 변환 (seq 는 비어있어도 된다)
        ```
        for (x <- expr1; y <- expr2; seq) yield expr3
        ```
        ```
        expr1.flatMap(x => for (y <- expr2; seq) yield expr3)
        ```
        
        ```
        expr1.flatMap(x => expr2.map(y => expr3))
        ```
* Example
    ```
    for {
        b1 <- books
        b2 <- books if b1 != b2
        a1 <- b1.authors
        a2 <- b2.authors if a1 == a2
    } yield a1
    ```
    ```
    books flatMap (b1 =>
      books withFilter (b2 => b1 != b2) flatMap (b2 =>
        b1.authros flatMap (a1 =>
          b2.authors withFilter (a2 => a1 == a2) map (a2 =>
            a1))))
    ```
        
## CH24 - 컬렉션 자세히 들여다보기
* 컬렉션 계층구조
    ```
    Traversable
        Iterable
            Seq
                IndexedSeq
                    Vector
                    ResizableArray
                    GenericArray
                LinearSeq
                    MutableList
                    List
                    Stream
                Buffer
                    ListBuffer
                    ArraryBuffer
            Set
                SortedSet
                    TreeSet
                HashSet (mutable)
                LinkedHashSet
                HashSet (immutable)
                BitSet
                EmptySet, Set1, Set2, Set3, Set4
            Map
                SortedMap
                    TreeMap
                HashMap (mutable)
                LinkedHashMap (mutable)
                HashMap (immutable)
                EmptyMap, Map1, Map2, Map3, Map4
    ```
    * 대부분의 클래스는 루트(scala.collection 패키지), 변경가능(scala.collection.mutable 패키지), 변경 불가능(scala.collection.immutable 패키지)한 세 가지 버전이 존재한다.
    * 유일한 예외는 Buffer 트레이트로, 변경 가능한 컬렉션에만 있다.

#### Traversable 트레이트
* 컬렉션 계층의 가장 꼭대기에는 Traversable 트레이트가 있다 Traversable 에 있는 유일한 연산은 foreach 뿐이다.
    ```
    def foreach[U](f: A => U)
    ```
* 클래스가 Traversable 을 구현하려면 이 메소드만 정의하면 된다. 다른 모든 메소드는 Traversable 의 것을 상속한다.

#### Iterable 트레이트
* 이 트레이트의 모든 메소드는 하나의 추상 메소드 iterator 를 기반으로 한다.
* iterator 는 컬렉션의 원소를 하나하나 돌려준다.
* Iterable 은 Traversable 에서 상속한 추상 foreach 메소드를 iterator 를 사용해 정의한다.
    ```
    def foreach[U](f: A => U): Unit = {
        val it = iterator
        while (it.hasNext) f(it.next())
    }
    ```
* Iterable 의 하위에는 Seq, Set, Map 세가지 트레이트가 위치한다.
    * 세 트레이트의 공통점은 PartialFunction 을 구현해서 apply 와 isDefinedAt 메소드를 제공한다.
    * 하지만 각 트레이트가 PartialFunction 을 구현하는 방식은 각기 다르다.
    
#### 시퀀스 트레이트: Seq, IndexedSeq, LinearSeq
* Seq 트레이트는 시퀀스를 표현한다.
* 시퀀스는 길이가 정해져 있고, 각 원소의 위치를 0부터 시작하는 고정된 인덱스로 지정할 수 있는 이터러블의 일종이다.
* Seq 트레이트는 두 가지 하위 트레이트 LinearSeq, IndexedSeq 가 있다.
    * LinearSeq
        * 더 효율적인 head 와 tail 연산을 제공.
        * List, Stream 가 많이 쓰인다.
    * IndexedSeq
        * 효율적인 apply, length, update(변경가능한 경우) 연산을 제공한다.
        * Array, ArrayBuffer 가 많이 쓰인다.
* Vector
    * LinearSeq 와 IndexedSeq 사이의 절충.
    * Vector 는 사실상 인덱스 시간과 선형 접근 시간이 상수라 할 수 있다.
    * 따라서, 인덱스와 선형 접근을 모두 사용해야 하는 혼합 접근 패턴의 경우 Vector 가 좋은 기반 클래스가 될 수 있다.
* Buffer
    * 변경 가능한 시퀀스의 중요한 하위 범주
    * 버퍼는 기존 원소의 변경을 허용할 뿐만 아니라, 원소의 삽입과 제거도 지원하며, 버퍼의 맨 뒤에 효율적으로 원소를 추가하도록 지원한다.
    * ListBuffer, ArrayBuffer 가 가장 많이 사용된다.
    
#### Set
* 집합은 원소중복을 허용하지 않는 Iterable 이다.
* 집합 연산으로 합집합, 교집합, 차집합이 있다.
    * 알파벳 버전
        * intersect, union, diff
    * 기호 
        * &amp;, |, &amp;~
* 변경 가능한 집합의 기본 구현에서는 해시 테이블을 사용해 집합의 원소를 저장한다.
* 변경 불가능한 집합의 기본 구현은 집합에 들어 있는 원소의 개수에 따라 가변적인 표현 방식을 사용한다.
    * 빈 집합은 싱글톤 객체를 단 하나 사용한다.
    * 원소가 4개 이하인 집합은 모든 원소를 필드로 저장하는 객체 하나로 표현한다. (Set1, Set2, Set3, Set4)
    * 원소가 4개를 넘어가면 변경 불가능한 집합은 hash trie 를 사용해 구현한다. (HashSet)
* 원소가 4개 이하인 변경 불가능한 집합은 변경 가능 집합보다 훨씬 작고 효율적이다. 
* 따라서 집합 크기가 작으리라 예상한다면 변경 불가능한 집합을 사용하도록 노력하는 게 좋다.

#### Map
* 맵은 키와 값의 쌍의 Iterable 이다.
* 스칼라의 Predef 클래스에는 key -> value 를 (key, value) 쌍 대신 사용할 수 있는 암시적 변환이 들어 있다.
* 맵을 캐시로 사용하는 경우 getOrElseUpdate 메소드가 유용하다.

#### 변경 불가능한 구체적인 컬렉션 클래스
* 리스트
    * 유한한 변경 불가능한 시퀀스
    * 리스트의 첫 원소(head)에 접근하거나 첫 원소를 제외한 나머지 부분(tail)에 접근하기 위해서는 상수 시간이 걸린다. -> O(1)
    * 다른 많은 연산은 선형 시간이 걸린다. -> O(n)

* 스트림
    * 리스트와 비슷하지만, 원소를 지연 계산한다는 점이 다르다.
    * 이로 인해 스트림은 무한할 수가 있다. 외부에서 요청하는 원소만 계산한다.
    * 그 외에는 리스트와 비슷하다.
    * 리스트를 :: 연산자로 구성하는 반면, 스트림은 #:: 를 사용해 구성한다.
    * 스트림을 사용해서 피보나치 수열을 계산하는 것은 아래와 같다.
        ```
        def fibFrom(a: int, b: Int): Stream[Int] = a #:: fibFrom(b, a + b)
        ```
        * 이 함수가 #:: 대신 :: 를 사용했다면, 이 함수에 대한 호출이 다른 호출을 다시 만들어내서 무한 재귀가 일어났을 것이다.
        * 하지만 #:: 를 사용했기 때문에 #:: 의 오른쪽 부분은 요청이 있기 전까지 계산하지 않는다.
        ```
        scala> val fibs = fibFrom(1, 1).take(7)
        fibs: scala.collection.immutable.Stream[Int] = Stream(1, ?)
        ```
        ```
        scala> fibs.toList
        res0: List[Int] = List(1, 1, 2, 3, 4, 8, 13)
        ```
* 벡터
    * 리스트를 사용하는 알고리즘이 주의 깊게 헤드만을 처리한다면 매우 효율적이다.
    * 리스트의 헤드에 접근, 추가, 제거하는 데는 상수 시간이 걸린다.
    * 하지만, 리스트의 뒤쪽에 있는 원소에 접근하거나 이를 변경하는 시간은 리스트의 길이에 선형으로 비례해 길어진다.
    * 벡터는 헤드가 아닌 원소도 효율적으로 접근할 수 있는 컬렉션 타입이다.
    * 벡터에 있는 임의의 원소에 접근하기 위해서는 '사실상 상수 시간'이 걸린다. 리스트의 헤드에 접근하거나 배열의 원소를 읽는 경우보다는 더 큰 상수이긴 하다.

* 변경 불가능한 스택
    * 기능상 리스트가 스택을 모두 포함하기 때문에 변경 불가능한 스택을 스칼라에서 사용하는 경우는 드물다.
    * 변경 불가능한 스택에 push 하는 것은 리스트의 :: 와 같고, 스택의 pop 은 tail 과 같다.
    
* 변경 불가능한 큐
    * 스택과 비슷하지만 FIFO(first in first out)을 제공한다.
    
* 범위 (Range)
    * 간격이 일정한 정수를 순서대로 나열한 시퀀스다.
    * to, until, by 를 이용해 만들 수 있다.
    
* 해시 트라이
    * 변경불가능한 집합이나 맵을 효율적으로 구현하는 표준적인 방법이다.
    
* 적흑트리
    * 집합과 맵에 대한 배부 표현으로 적흑 트리를 제공한다. 이를 사용하려면 TreeSet 이나 TreeMap 을 사용해야 한다.
    * sortedSet 의 표준 구현이기도 하다. 적흑 트리를 사용하면 모든 원소를 정렬 순서대로 방문할 수 있는 효율적인 이터레이터를 만들 수 있기 때문이다.
    
* 리스트맵
    * 키값 쌍의 연결 리스트로 맵을 표현한다.
    * 리스트맵에 대한 연산은 맵의 크기에 선형으로 비례하는 시간이 걸린다.
    * 대부분의 경우 표준적인 변경 불가능 맵이 더 빠르기 때문에 스칼라에서 리스트 맵을 사용할 일은 거의 없다.
    
#### 변경 가능한 구체적인 컬렉션 클래스
* 배열버퍼
    * 배열버퍼는 배열과 크기를 저장한다.
    * 배열 버퍼에 대한 대부분의 연산은 배열과 속도가 같다.
    * 배열 버퍼는 데이터를 배열 끝에 효율적으로 추가할 수 있다.
    * 배열 버퍼에 원소를 추가하는 데는 상수 분할 상환 시간이 걸린다.
    
* 리스트 버퍼
    * 배열 버퍼와 비슷하지만, 내부에서 배열 대신 연결 리스트를 사용한다.
    * 버퍼를 다 구성한 다음에 리스트로 변환할 예정이라면 배열 버퍼 대신에 리스트 버퍼를 사용하는 것이 좋다.

* 문자열 빌더
    * 배열 버퍼가 배열을 만들 때 유용하고, 리스트 버퍼가 리스트 만들 때 유용한 것 처럼 문자열 빌더는 문자열을 만들 때 유용하다.
    
* 연결 리스트
    * 연결 리스트는 다음 노드를 가리키는 next 포인터로 서로 연결된 노드들로 이뤄진 변경가능 시퀀스다.
    
* 이중 연결 리스트
    * DoubleLinkedList 는 단일 연결 리스트와 비슷하지만, next 외에 현재 노드의 바로 앞 노드를 가리키는 변경 가능한 필드 prev 를 제공한다.
    * prev 링크를 추가해서 생기는 주된 이점은 원소 삭제가 아주 빠르다는 것이다.
    
* 변경 가능한 리스트
    * MutableList 는 단일 연결 리스트에 리스트의 맨 마지막 빈 노드를 가리키는 포인터가 더 들어있다.
    * 그로 인해 리스트 뒤에 덧붙이는 연산을 상수 시간에 할 수 있다. 마지막 노드를 찾기 위해 전체 노드를 다 방문할 필요가 없기 때문이다.
    
* 큐
* 배열 시퀀스
    * 원소를 내부에서 Array[AnyRef]로 저장하는 고정된 크기의 변경 가능한 시퀀스다.
    * 스칼라에서는 ArraySeq 가 이를 구현한다.
    * 배열과 같은 성능 특성이 필요한데, 원소의 타입도 모르고 실행 시점에 클래스 태그도 없는 상황에서 시퀀스의 제네릭한 인스턴스를 만들 필요가 있다면 보통 ArraySeq 를 사용한다.
* 스택
* 배열스택
    * ArrayStack 은 변경가능 스택에 대한 대체 구현이다.
    * ArrayStack 은 필요에 따라 크기를 변화시키는 배열을 기반으로 한다.
    * 배열스택은 인덱스를 사용한 빠른 접근을 제공하며, 일반적인 스택보다 대부분의 연산에서 보통 아주 약간 더 효율적이다.
* 해시테이블
    * 해시 테이블은 원소를 배열에 저장한다.
    * 이때, 각 원소의 해시코드에 따라 그 위치를 결정한다.
    * 해시 테이블에 있는 배열에 이미 같은 해시코드를 갖는 원소가 없는 한, 해시 테이블에 원소를 추가하는 데는 상수 시간만 걸린다.
    * 따라서 원소들의 해시 코드 분포가 고르기만 하면, 해시 테이블은 아주 빠르다.
    * 스칼라의 변경가능 맵과 변경 가능 집합 타입의 기본 구현은 해시 테이블을 기반으로 한다.
    * 해시 집합과 맵은 다른 집합이나 맵과 마찬가지로 사용 할 수 있다.
    * 해시 테이블에 대한 이터레이션은 어떤 정해진 순서를 따르지 않는다.
        * 이터레이션 순서를 보장해야 한다면 LinkedHashMap, LinkedHashSet 을 사용해야 한다.
* 약한 해시맵
    * 가비지 콜렉터가 맵 내부에 저장한 키를 따라 방문하지 않는 특별한 종류의 해시 맵이다.
    * 어떤 키와 그 키에 대응하는 값은 해당 키에 대한 다른 참조가 없다면 맵에서 사라진다.
    * 비용이 많이 드는 함수의 결과를 저장해 뒀다가 같은 인자로 호출 시 저장했던 결과를 바로 사용하는 캐시 같은 작업에서 유용하다.
* 동시적 맵
    * 동시적 맵은 여러 스레드에서 동시에 접근 가능하다.
* 변경 가능한 비트 집합

#### 배열
* 스칼라 배열은 제네릭할 수 있다.
* 스칼라 배열은 스칼라 시퀀스와 호환 가능하다.
* 스칼라 배열은 모든 시퀀스의 연산을 지원한다.

#### 문자열
* 배열과 마찬가지로 문자열도 직접적인 시퀀스는 아니다.
* 하지만 이들도 시퀀스로 변환할 수 있고 모든 시퀀스 연산을 지원한다.

#### 성능특성
[http://docs.scala-lang.org/overviews/collections/performance-characteristics.html](http://docs.scala-lang.org/overviews/collections/performance-characteristics.html)
   
   
## CH26 익스트랙터
* 익스트랙터는 멤버 중에 unapply 라는 메소드가 있는 객체다.
* unapply 메소드의 목적은 값을 매치시켜 각 부분을 나누는 것이다.
    ```
    object Extractor {
      def main(args: Array[String]): Unit = {
        val selectorString = "daniel.yebon.yoo@gmail.com"
    
        selectorString match {
          case Email(user, domain) => println(s"$user, $domain")
          case _ =>
        }
      }
    }
    
    object Email {
      def apply(user: String, domain: String) = user + "@" + domain
    
      def unapply(str: String): Option[(String, String)] = {
        val parts = str split "@"
        if (parts.length == 2) Some(parts(0), parts(1)) else None
      }
    }
    ```
    * 위와 같이 정의하면 패턴 매치 시 익스트랙터 객체를 참조하는 패턴을 만나면 항상 그 익스트랙터의 unapply 메소드를 셀렉터 식에 대해 호출한다.
    * apply 메소드는 인젝션(injection) 이라고 부른다. 이 메소드는 인자를 몇 가지 받아서 어떤 집합의 원소를 만들어 내기 때문이다.
    * unapply 메소드는 익스트랙션(extraction) 이라고 하는데 그 이유는 어떤 집합에 속한 원소에서 여러 부분의 값을 뽑아내기 때문이다.
    * 인젝션이나 익스트랙션은 종종 한 객체 안에서 짝 지워지곤한다.
    * 인젝션 메소드가 포함된 경우라면 인젝션은 익스트랙션 메소드와 서로 쌍대성(dual) 이어야 한다.

#### 익스트랙터와 케이스 클래스
* 어떤 컴포넌트가 여러 케이스 클래스를 정의해서 외부에 노출된 경우, 그 케이스 클래스에 대해 패턴매치를 하는 클라이언트 코드가 이미 있다면, 쉽게 그 케이스 클래스를 바꿀 수 없다.
* 케이스 클래스의 이름을 바꾸거나 클래스 계층구조를 변경하면 클라이언트 코드에 영향을 끼친다.
* 익스트랙터는 이런 문제가 없다. 이런 특성을 표현 독립성이라 한다.
* 표현 독립성은 케이스 클래스에 비교해 익스트랙터가 지닌 중요한 장점이다.
* 케이스 클래스가 익스트랙터 보다 더 좋은 점은
    * 설정하고 정의하기가 쉽고 코드도 적게 필요하다.
    * 보통 익스트랙터 보다 효과적인 패턴 매치가 가능하다.
    * 스칼라 컴파일러가 케이스 클래스의 패턴 매치를 익스트랙터의 패턴 매치보다 더 잘 최적화할 수 있기 때문이다.
    * 케이스 클래스의 매커니즘은 변하지 않는 반면, 익스트랙터의 unapply 나 unapplySeq 메소드 안에서는 거의 아무 일이나 할 수 있기 때문이다.
    * 또한, 어떤 케이스 클래스가 sealed case class 를 상속하는 경우, 패턴 매치가 모든 가능한 패턴을 다 다루는지를 스칼라 컴파일러가 검사해서 그렇지 않은 경우 경고를 해준다.
    하지만 익스트랙터를 사용하면 그런 검사를 하지 않는다.
* 케이스 클래스로 시작한 다음, 필요에 따라 익스트랙터로 바꿀 수 있다.

#### 정규표현식
* 문자열에 .r 을 호출하면 정규표현식을 얻을 수 있다. StringOps 클래스 안에 r 이라는 메소드가 있어서 문자열을 정규표현식으로 변환한다.


## CH27 - 애노테이션
#### 표준 애노테이션
```
@deprecated     - 사용금지
@volatile       - 컴파일러에게 대상 변수를 여러 스레드가 사용한다는 점을 알린다. 컴파일러는 여러 스레드에서 접근 해도 스레드의 동작을 더 예측하기 좋게 그 변수를 구현한다.
@serializable   - 직렬화가 가능한 클래스라면 추가한다.
@transient      - 직렬화해서는 안 되는 필드를 표시할 때 추가한다.
@BeanProperty   - 자바스러운 게터세터를 만들어 준다. (scala.reflect.BeanProperty)
@tailrec        - 꼬리 재귀 함수일 필요가 있는 메소드에 애노테이션 한다. 컴파일러가 꼬리 재귀를 최적화 한다.
@unchecked      - 클라이언트의 패턴 매치 코드가 모든 경우를 다 다루지 않음을 컴파일러에게 알린다.
@native         - 메소드 구현이 스칼라 코드가 아니라 런타임을 통해 주어진다는 사실을 알려준다.
                  @native
                  def beginCountdown() = { }
```
        
        
## CH29 - 객체를 사용한 모듈화 프로그래밍
#### 셀프타입
* 셀프 타입을 사용한 트레이트
    ```
    trait SimpleFoods {
        object Pear extends Food("Pear")
        def allFoods = List(Apple, Pear)
        def allCategories = Nil
    }
    ```
    ```
    trait SimpleRecipes {
        this: SimpleFoods =>                // 함께 사용해야하는 다른 트레이트(SimpleFoods)를 가정했음을 기술
        
        object FruitSalad extends Recipe(
            "fruit salad",
            List(Apple, Pear),              // Pear 는 암시적으로 this.Pear 로 간주된다 
            "Mix it all together."
        )
        def allRecipes = List(FruitSalad)
    }
    ```
* 기술적으로 볼 때 셀프타입은 클래스 안에서 사용하는 모든 this 의 타입이 어떤 것인지를 가정하는 것이다.
* 실용적인 측면에서 볼 떄 셀프 타입은 트레이트가 섞여 들어갈 구체적 클래스를 제한한다.
* 만약 어떤 트레이트가 또 다른 트레이트나 트레이트들과 함께 섞여야만 한다면, 이렇게 함께 사용해야 하는 다른 트레이트를 가정했음을 기술해야 한다.
# Typo
* p83 '왼쪽' -> '오른쪽'
* p83 'towThree' -> 'twoThree'
* p139 '가능한' -> '불가능한'
* p362 'toStirng' -> 'toString'
* p410 '케터' -> '게터'
* p529 'Peson' -> 'Person'
* p590 'Array' -> 'Seq' 의미상 Seq 가 되어야 하는 거 아님?
