---
layout: post
title: "Array 를 이용한 Stack 구현 예제"
date: 2018-02-09
banner_image: /banner/ds-new.jpg"
categories: [data-structures]
tags: [data-structures, array, stack, java]
---

### 개요
* Array 를 사용하여 Stack 을 직접 구현해본다.
* Generics, Comparable, @SuppressWarnings("unchecked") 에 대한 간략한 설명
* [구현예제보기](https://github.com/yaboong/datastructures-algorithms-study/blob/master/src/cc/yaboong/ds/array/ArrayOfStack.java)

<!--more-->

<br/>

### Stack
Stack 에 대한 개념은 [여기](https://yaboong.github.io/data-structures/2018/02/08/linked-list-2-advanced-stack/) 설명 참고

<br/>

### Array 로 Stack 구현해보기 - Java
* class 정의
* 생성자 정의
* push, pop, resize 메서드 정의
만 한번 살펴보자. 전위, 후위 증감연산자의 성질만 파악하면 구현은 전혀 어렵지 않다.
전체 예제 코드는 [여기](https://github.com/yaboong/datastructures-algorithms-study/blob/master/src/cc/yaboong/ds/array/ArrayOfStack.java) 에 있다.


##### class 정의
타입을 동적으로 받아 생성할 수 있도록 제너릭스를 사용할 것이다. 
이 때 타입은 Comparable 인터페이스를 구현한 타입들에 한에서만 받을 수 있도록 한다.

```javascript
public class ArrayOfStack<T extends Comparable<T>>{
    private static final int DEFAULT_CAPACITY = 1;
    private T[] stack;
    private int N = 0;

    @SuppressWarnings("unchecked")
    public ArrayOfStack(){
        stack = (T[]) new Comparable[DEFAULT_CAPACITY];
    }
}
```

<mark>@SuppressWarnings("unchecked")</mark> 의 역할은, 
compile 시에 type check 를 하기 위한 충분한 정보가 없으므로 "unchecked" 된다는 경고를 Suppress (억제하다) 하겠다는 의미이다.
실제로 어떤 타입의 데이터를 가지는 stack 을 만들 것인지는 런 타임시 결정되므로 type-casting 이 유효한 것인지 컴파일러 입장에서는 알 수가 없다.
즉 컴파일러가 경고를 해주는데 이 경고를 무시하겠다는 것이다. 무시 하겠다는게 그냥 쌩까면 안되고 <mark>런 타임시</mark>에 문제가 없을 것임을 확인해야만 한다.

생성자를 보면 Comparable 인터페이스 타입의 배열을 생성하고, 이를 T 라는 타입의 배열로 type-casting 을 시켜준다.
이 때, 우리의 T 는 Comparable<T> 를 구현 한 타입들에 한해서만 받을 수 있도록 할 것이기 때문에 Comparable 타입의 배열을 T 타입의 배열로 형변환 하는데에 문제가 없다는 것을 알 수 있다.
런 타임시 문제가 없을 것임을 확인 했기 때문에 경고를 무시하는 annotation 을 사용하도록 한다.

Stack 의 기본 크기는 1로 시작한다. Stack 의 크기에 따라서 array 의 size 를 유동적으로 조절할 resize 메서드를 작성할 것이므로 괜찮다.


##### resize() 구현
메모리의 효율적인 사용을 위해서, stack 이 가득차거나 할당 된 array 의 size 보다 훨씬 적은 데이터가 들어 있는 경우 array 의 size 를 조절해 줄 필요가 있다.
조절하는 규칙은
* push 하다가 가득차면 2배로 늘린다.
* pop 하다가 데이터의 개수가 현재 stack size 의 1/4 로 줄어들면 stack size 를 반으로 줄인다.
* resize() 호출 시 파라미터로 size 값을 어떻게 넘겨준다.

```javascript
private void resize(int newCapacity){
    stack = Arrays.copyOf(stack, newCapacity);
}
```

내부적으로만 사용할 것이므로 private 제어자를 지정해준다. 그리고 새롭게 지정한 size 값인 newCapacity 값을 가지는 기존 array 를 복사해서 stack 변수에 할당해주면 끝이다.


##### push() 구현
* 가득찼으면 현재 사이즈의 2배로 늘려준다.
* 현재 N 값의 index 에 삽입하고 N 을 1 증가시킨다.

N 은 항상 마지막 element 의 index 보다 1 크기 때문에 가능하다.

```javascript
public void push(T item){
    if(isFull()) resize(2*stack.length);
    stack[N++] = item;
}
``` 



##### pop() 구현
* 비어있지 않은 경우에 N-1 의 index 에 위치한 element 를 반환값으로 지정한다.
* 방금 반환한 값의 index 를 null 로 만들어서 빈공간으로 채운다.
* Element 개수가 stack size 의 1/4 이 되었다면 stack 을 기존 size 의 반으로 줄여준다.

```javascript
public T pop(){
    if (!isEmpty()) {
        T item = stack[--N];
        stack[N] = null;
        if (N > 0 && N == stack.length / 4) resize(stack.length / 2);
        return item;
    }
    return null;
}
```


### 정리
* 그냥 ArrayList 를 쓰면 더 편할 것 같다.
* 짜고보니 malloc 만 없지 C 코드 같다.
* Linked List 를 사용하는 게 stack 구현은 더 편한 것 같다.
* 하지만, 이렇게 array 를 resize 하는 방법은 heap 을 구현할 때에도 동일하게 쓰이므로 알아두면 좋다.
* 전체 예제 코드는 [여기](https://github.com/yaboong/datastructures-algorithms-study/blob/master/src/cc/yaboong/ds/array/ArrayOfStack.java) 에 있다.