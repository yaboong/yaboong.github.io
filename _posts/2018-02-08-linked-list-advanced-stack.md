---
layout: post
title: "Data Structures - LinkedList 이용한 Stack 구현 예제"
date: 2018-02-08
banner_image: /banner/ds-new.jpg"
categories: [data-structures]
tags: [data-structures, linked-list, stack]
---

### 개요
LinkedList 를 사용하는 Stack 을 직접 구현해본다.

<!--more-->

### Stack
아래 그림은 Stack 에 대한 설명이다. 
Stack 은 새로운 값을 어디에 넣을지 지정하지 않으며 push 하면 stack 의 구현 방식에 맞게 데이터가 들어가고, pop 하면 stack 의 구현 방식에 맞게 데이터가 나온다.
그림을 보면 알 수 있듯이 Stack 은 가장 마지막으로 들어간 데이터가 가장 먼저 나오는 LIFO (Liast In First Out) 방식이다.


<div style="text-align:center">
{% include image_caption.html imageurl="https://s3.ap-northeast-2.amazonaws.com/yaboong-blog-static-resources/stack-1.png" title="stack" caption="stack" %}
</div> 

Linked list 로 표현하면 head 에 추가하고 head 를 반환한다고 생각하면 된다.
```javascript
5 -> 4 -> 3 -> 2 -> 1
```
의 linked list stack 에서는 5 가 head 이고, 6을 push (추가) 할 경우 <mark><strong>6</strong> -> 5 -> 4 -> 3 -> 2 -> 1</mark> 로 6이 새로운 head 가 된다.
pop 연산의 경우 현재 head 인 6을 반환하고 5가 새로운 head 가 되어 <mark><strong>5</strong> -> 4 -> 3 -> 2 -> 1</mark> 이 된다.

<br/>

### Linked List Stack 구현 - Java
Stack 의 기본 메서드인 push(), pop() 만 구현해 보자.
완성된 코드는 [여기](https://github.com/yaboong/datastructures-algorithms-study/blob/master/src/cc/yaboong/ds/linkedlist/LinkedListStack.java) 에 있다.


##### LinkedListStack, Node class 생성 
```javascript
public class LinkedListStack<E extends Comparable<E>> {
    private Node head = null;

    private class Node {
        E item;
        Node next;
    }
}
```

<mark><strong>&lt;E extends Comparable&lt;E&gt;&gt;</strong></mark> 
이는 Java 1.5 부터 지원되는 Generics 라는 것인데, 
간단히 설명하면 Comparable 인터페이스를 구현한 클래스들을 타입으로 사용하겠다는 것이다.
Comparable 인터페이스는 compareTo 라는 메서드 하나만을 가지는 단순한 인터페이스인데,
Comparable 인터페이스를 를 구현한 클래스는 compareTo 라는 메서드도 override 해서 구현해야 하고, 모두 구현 하고나면 객체간에 비교가 가능한 클래스가 된다.
대략적인 사용 예제는 algospot 에서 [이 문제](https://algospot.com/judge/problem/read/LECTURE)를 풀 때 [이런방식](https://github.com/yaboong/problem-solving-java/blob/master/src/com/yaboong/algospot/supereasy/Lecture.java) 으로 
PriorityQueue 를 구현할 때 사용했었다. 일단은 Stack 구현과는 크게 상관 없으니 이 포스팅에서는 넘어가도록 한다.

head 는 null 로 초기화 해 두고, 내부적으로만 사용할 Node class 는 private 으로 정의해 준다. 

##### push() 구현
* 기존의 head 를 잠시 다른 녀석으로 가리키게 해 두고
* 새로운 head 를 만든다
* 새로운 head 가 기존의 head 를 가리키게 한다
```javascript
public void push(E item) {
    Node oldHead = head;   // 기존의 head 를 잠시 다른 녀석으로 가리키게 해 두고
    head = new Node();     // 새로운 head 를 만든다
    head.item = item;
    head.next = oldHead;   // 새로운 head 가 기존의 head 를 가리키게 한다
}
```

##### pop() 구현
* stack 이 비어있지 않으면
* 현재 head 의 item 을 반환하고
* head 다음 node 를 head 로 만들어 준다

```javascript
public E pop() {
    if(!isEmpty()){         // stack 이 비어있지 않으면
        E item = head.item; // 현재 head 의 item 을 반환하고
        head = head.next;   // head 다음 node 를 head 로 만들어 준다
        return item;
    }
    else {
        System.out.println("Stack is empty.");
        return null;
    }
}
```

하고 보니 stack 은 참 간단하다. 완성된 코드는 [여기](https://github.com/yaboong/datastructures-algorithms-study/blob/master/src/cc/yaboong/ds/linkedlist/LinkedListStack.java) 에 있다.

