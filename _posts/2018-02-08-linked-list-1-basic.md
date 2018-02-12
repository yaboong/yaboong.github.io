---
layout: post
title: "Linked List - Java"
date: 2018-02-08
banner_image: /banner/ds-new.jpg"
categories: [data-structures]
tags: [data-structures, linked-list, java]
---

### 개요
* Singly Linked List 장점과 단점
* Java built-in LinkedList class
* Doubly Linked List 에 대한 간단한 설명
* Linked List 를 사용하여 구현할 수 있는 또 다른 데이터 구조
* [구현예제보기](https://github.com/yaboong/datastructures-algorithms-study/blob/master/src/cc/yaboong/ds/linkedlist/LinkedList.java)

<!--more-->

<br/>

### Singly Linked List
<div style="text-align:center">
{% include image_caption.html imageurl="https://s3.ap-northeast-2.amazonaws.com/yaboong-blog-static-resources/ds/linked-list-1.png" title="linked-list" caption="Singly Linked List" %}
</div>

얼핏 보면 array 와 비슷하게 생긴 자료구조가 linked list 이다. 박스 같이 생긴 하나하나를 node 라고 부르고, 각 node 는 다음 node 의 참조값을 가지고 있다. 
아래는 array 와 비교했을 때 linked list 가 가지는 장단점이다. 

##### Linked List 의 장점
* 동적 size 조절 가능
* 데이터 삽입/삭제가 편함

동적 size 조절의 경우, java 의 ArrayList 와 같은 클래스를 사용하면 할 수 있는 것 처럼 보이지만 ArrayList 는 사실상 copy 방식이므로 ([여기참고](https://yaboong.github.io/data-structures/2018/02/08/array-and-java-array-list/))
동적 size 조절이 되는 것 처럼 보이게 한 것이지 실제로는 linked list 의 방식에 비해 비용이 많이 드는 방식이다.
반면, linked list 는 head, tail 포인터만 있다면 list 의 앞 뒤 어디든 삽입 연산의 경우 O(1) 의 시간복잡도를 가진다.


##### Linked List 의 단점
* Random access 불가능. 첫 번째 요소 부터 탐색해야 한다. Binary search 같은 작업은 linked list 만으로는 어렵다.
* 각 노드의 reference 를 저장할 공간이 추가적으로 필요하다.

<br/>

### Singly Linked List 의 구현 - Java
구현 메소드 3가지
* 기존 리스트의 맨 뒤에 node 를 추가하는 append()
* head 앞에 node 를 추가하는 prepend()
* 지정한 값을 가지고 있는 node 를 삭제 하는 deleteWithValue()

> [Sample Code](https://github.com/yaboong/datastructures-algorithms-study/blob/master/src/cc/yaboong/ds/linkedlist/LinkedList.java)


##### class 정의
먼저 LinkedList 라는 이름으로 class 를 하나 만든다. 이 linked list 는 head 라는 Node 타입의 reference 변수를 가지고 있는데 linked list 의 진입점이라고 할 수 있다. 그러면 Node class 에 대한 정의도 필요하겠다.
Node 클래스는 LinkedList 객체 내부적으로만 조작할 수 있도록 하기 위해 private 제어자를 둔다. 
Node 클래스는 다음 값을 가리킬 레퍼런스 변수 next 와 자신의 값 data 를 가진다.

```javascript
class LinkedList {
    Node head;
    
    private class Node {
        Node next;
        int data;
        public Node(int data){
            this.data = data;
            this.next = null;
        }
    }
}
```


##### append()
* 현재 head 가 null 이면 (아무것도 없으면) head 에 새롭게 append 할 node 를 붙여준다.
* 그렇지 않은 경우 현재 head 를 current 라는 변수로 받고 리스트의 가장 끝으로 간다.
* current 를 마지막 node 로 옮겨간다 - while 문
* current.next == null 이면 current 는 마지막 node 에 도착한 것이다.
* current.next = "추가할 노드" 지정해주면 끝이다.

구현은 아래와 같다.
```javascript
public void append(int data) {
    Node appendNode = new Node(data);

    // 현재 head 가 null 이면 (아무것도 없으면) head 에 새롭게 append 할 node 를 붙여준다.
    if (head == null) {
        head = appendNode;
        return;
    }

    // 그렇지 않은 경우 현재 head 를 current 라는 변수로 받고 리스트의 가장 끝으로 간다.
    Node current = head;
    while (current.next != null) {  // current.next == null 이면 current 는 마지막 node 에 도착한 것이다
        current = current.next;     // current 를 마지막 node 로 옮겨간다. 
    }
    current.next = appendNode;      // current.next = "추가할 노드" 지정해주면 끝이다
}
```


##### prepend()
prepend 메소드 구현은 단순하다. 구현은 아래와 같다.
```javascript
public void prepend(int data) {
    Node newHead = new Node(data);
    newHead.next = head;
    head = newHead;
}
```

##### deleteWithValue()
그나마 조금 까다로워 보일 수 있는 특정 값을 지우는 메소드인데 비슷하게 하면 된다.

* head 부터 시작한다
* 리스트가 비어있는 경우 리턴
* 찾는 값이 head 에 있나? 그러면 head 삭제
* head 를 제외한 나머지. 그림 참고.

<div style="text-align:center">
{% include image_caption.html imageurl="https://s3.ap-northeast-2.amazonaws.com/yaboong-blog-static-resources/ds/linked-list-delete-1.png" title="linked-list-detele-1" caption="그림1" %}
</div>


<mark>그림1</mark> 지우려는 노드가 value 로 표시된 노드라면, node 하나씩 탐색 중 current.next.data 가 현재 지우려는 값과 일치 할 것이다. 

<div style="text-align:center">
{% include image_caption.html imageurl="https://s3.ap-northeast-2.amazonaws.com/yaboong-blog-static-resources/ds/linked-list-delete-2.png" title="linked-list-detele-2" caption="그림2" %}
</div>

<mark>그림2</mark> current.next 는 지우려는 node 를 가리키고 있었을 것이고, 지우려는 node 의 다음 node 는 current.next.next 로 표현할 수 있다.
그러므로 <mark>current.next = current.next.next</mark> 를 해주면 지우려는 node 이전의 node (current) 가 지우려는 node 다음 node (current.next.next) 와 연결되어 지우려는 노드는 연결에서 disconnect 된다.

```javascript
public boolean deleteWithValue(int data) {
    Node current = head; // head 부터 시작한다

    if (head == null) return false; // 리스트가 비어있는 경우 리턴

    // 찾는 값이 head 에 있나? 그러면 head 삭제
    if (current.data == data) {
        head = head.next;
        return true;
    }

    // head 를 제외한 나머지. 그림 참고.
    while (current.next != null) {
        if (current.next.data == data) {
            current.next = current.next.next;
            return true;
        }
        current = current.next;
    }

    return false;
}
```

##### print() 만들어보기
혹시 다른 메소드 만들어 보고 싶은 게 있다면 1->2->3->4 이런식으로 출력되는 print() 메소드 만들어 보는 것도 재밌다. [Sample Code](https://github.com/yaboong/datastructures-algorithms-study/blob/master/src/cc/yaboong/ds/linkedlist/LinkedList.java)

<br/>

### Linked List 의 사용 예
* Stack
* Queue
* Graph
* Tree

등 다양한 곳에 다양한 목적으로 사용될 수 있는 기본적인 data structure 가 linked list 이다. 

<br/>

### Java built-in LinkedList class
사실 java 에도 기본적으로 지원되는 LinkedList class 가 있다.
AbstractSequentialList 를 상속받고 List 인터페이스를 구현한 클래스이다. 
아래와 같은 방법으로 Queue 로 사용할 수 있다.

##### built-in LinkedList class 를 사용한 Queue
```javascript
import java.util.LinkedList;
import java.util.Queue;

public class BuiltinLinkedListQueueExample {
    public static void main(String[] args){
        Queue<Integer> queue = new LinkedList<>();

        queue.add(1);
        queue.add(2);
        queue.add(3);
        queue.add(4);
        queue.add(5);
        queue.add(6);
        queue.add(7);
        System.out.println(queue.remove());
        System.out.println(queue.toString());
    }
}
```


##### built-in LinkedList class 소스 까보기
Built-in LinkedList 소스를 까보면 linkLast(), linkBefore() 메소드에서 재밌는 것을 발견 할 수 있다. 글 시작부의 타이틀에 Singly Linked List 라는 표현을 썼다.
가장 기초가 되는 linked list 구현이었고, 한 방향으로만 연결되는 linked list 이기 때문이다. 참조값으로도 head 하나 밖에 쓰지 않았다.
하지만 built-in LinkedList 에는 first, last, prev, next 네 가지의 참조변수가 있다.


```javascript
/**
 * Links e as last element.
 */
void linkLast(E e) {
    final Node<E> l = last;
    final Node<E> newNode = new Node<>(l, e, null);
    last = newNode;
    if (l == null)
        first = newNode;
    else
        l.next = newNode;
    size++;
    modCount++;
}

/**
 * Inserts element e before non-null Node succ.
 */
void linkBefore(E e, Node<E> succ) {
    // assert succ != null;
    final Node<E> pred = succ.prev;
    final Node<E> newNode = new Node<>(pred, e, succ);
    succ.prev = newNode;
    if (pred == null)
        first = newNode;
    else
        pred.next = newNode;
    size++;
    modCount++;
}
```

이러한 방식을 Doubly Linked List 라고 하고 아래와 같이 각 node 들은 자신의 이전 node 에 대한 레퍼 값도 가지고 있다. 

[Java doc](https://docs.oracle.com/javase/9/docs/api/java/util/LinkedList.html) 의 LinkedList class 페이지로 가보면 아래와 같은 설명을 볼 수 있다.

> Doubly-linked list implementation of the List and Deque interfaces.


<div style="text-align:center">
{% include image_caption.html imageurl="https://s3.ap-northeast-2.amazonaws.com/yaboong-blog-static-resources/ds/doubly-linked-list.png " title="doubly-linked-list" caption="Doubly Linked List" %}
</div>


위 구현 그림을 보면 head(first), last(tail) 포인터도 존재하는데 Queue 를 구현할 때에는 보통 head, tail 두 종류의 포인터를 함께 쓴다. append 는 tail 에 하고, remove 는 head 에서 하여 FIFO 를 구현하기 때문이다. (Stack 의 경우에는 head 하나만 있어도 된다. LIFO 이기 때문에.)
Linked List 를 이용한 Stack, Queue 를 직접 구현하는 것은 다음 포스팅에서 다뤄 봐야겠다.

<br/>

#### 참고한 자료
* <a target="_blank" href="https://www.youtube.com/watch?v=njTh_OwMljA">HackerRank Youtube Channel - Data Structures: Linked Lists</a>