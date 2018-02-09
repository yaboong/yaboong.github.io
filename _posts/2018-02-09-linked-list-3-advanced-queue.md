---
layout: post
title: "LinkedList 를 이용한 Queue 구현 예제"
date: 2018-02-09
banner_image: /banner/ds-new.jpg"
categories: [data-structures]
tags: [data-structures, linked-list, queue]
---

### 개요
* LinkedList 를 사용하여 Queue 를 직접 구현해본다.
* [구현예제보기](https://github.com/yaboong/datastructures-algorithms-study/blob/master/src/cc/yaboong/ds/linkedlist/LinkedListQueue.java)

<!--more-->

### Queue
* FIFO (First In First Out)
* head, tail 두 개의 포인터 사용

<div style="text-align:center">
{% include image_caption.html imageurl="https://s3.ap-northeast-2.amazonaws.com/yaboong-blog-static-resources/queue-1.png" title="queue" caption="Queue" %}
</div>

Queue 는 stack 과 구조적으로 다른 점은 먼저 넣은 데이터가 먼저 나온다는 것이다. FIFO (First In First Out).
Stack 은 head 포인터 하나만을 사용했다. head 만 사용해도 삽입/삭제 작업 모두 O(1) 의 시간복잡도를 갖는 것이 가능했다. head 에 추가하고 head 를 제거하기 때문이다.

하지만 linked list 로 구현한 queue 에서는 하나의 포인터만 사용하면 insert, delete 중 하나는 반드시 O(n) 의 시간복잡도를 갖게 된다.
어느 한쪽으로 데이터가 들어가서 반대쪽으로 데이터가 나와야 하는데, 한쪽의 포인터로 반대쪽 끝까지 이동하는 것이 필요하기 때문이다.

그래서 linked list 로 queue 를 구현할 때는 tail 에 추가하고 head 에 있는 것을 꺼낸다.
추가하는 작업을 enqueue, 꺼내는 작업을 dequeue 라고 한다.

<br/>

### Linked List Queue 구현 - Java
Queue 의 기본 메서드인 enqueue(), dequeue() 만 구현해 보자.
완성된 코드는 [여기](https://github.com/yaboong/datastructures-algorithms-study/blob/master/src/cc/yaboong/ds/linkedlist/LinkedListQueue.java) 에 있다.


##### LinkedListQueue, Node class 생성 
```javascript
public class LinkedListQueue<E extends Comparable<E>> {
    private Node head, tail;

    private class Node{
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
PriorityQueue 를 구현할 때 사용했었다. 일단은 Queue 구현과는 크게 상관 없으니 이 포스팅에서는 넘어가도록 한다.

##### enqueue() 구현
* 데이터의 추가는 tail 에 한다 (들어온 순서대로 줄을 세우는 셈)
* 기존의 tail 을 잠시 보관해두고 새로운 tail 을 생성한다
* queue 가 비어있으면 head = tail 로 head 와 tail 이 같은 node 를 가리키게 한다
* queue 가 비어있지 않으면 기존 tail 의 next = 새로운 tail 로 해주면 된다

```javascript
// 데이터의 추가는 tail 에 한다 (들어온 순서대로 줄을 세우는 셈)
public void enqueue(E item){
    Node oldlast = tail;        // 기존의 tail 을 잠시 보관해두고
    tail = new Node();          // 새로운 tail 을 생성한다
    tail.item = item;
    tail.next = null;
    if(isEmpty()) head = tail;  // queue 가 비어있으면 head = tail 로 head 와 tail 이 같은 node 를 가리키게 한다
    else oldlast.next = tail;   // queue 가 비어있지 않으면 기존 tail 의 next = 새로운 tail 로 해주면 된다
}
```

##### dequeue() 구현
* 데이터 꺼내는 작업은 head 에서 한다 (먼저 들어왔던 데이터부터 꺼낸다)
* head 의 데이터를 <mark>어딘가</mark> 에 저장
* 기존 head 다음 node (혹은 null) 를 head 로 설정해준다
* <mark>어딘가</mark> 를 반환

```javascript
// 데이터 꺼내는 작업은 head 에서 한다 (먼저 들어왔던 데이터부터 꺼낸다)
public E dequeue(){
    // 비어있는 경우
    if(isEmpty()){
        tail = head;
        System.out.println("Queue is empty");
        return null;
    }
    // 비어있지 않으면
    else{
        E item = head.item;     // head 의 데이터를 저장
        head = head.next;       // 기존 head 다음 node (혹은 null) 를 head 로 설정해준다 
        return item;
    }
}
```

삽입은 tail 포인터로, 제거는 head 포인터로 함으로써 삽입, 삭제 작업 모두 O(1) 로 가능하다.
하고 보니 queue 도 참 간단하다. 완성된 코드는 [여기](https://github.com/yaboong/datastructures-algorithms-study/blob/master/src/cc/yaboong/ds/linkedlist/LinkedListQueue.java) 에 있다.