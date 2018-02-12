---
layout: post
title: "Min Heap & Heap Sort - Java"
date: 2018-02-10
banner_image: /banner/ds-new.jpg"
categories: [data-structures]
tags: [data-structures, heap, array, java]
---

### 개요
* Array 를 이용하여 Heap 을 직접 구현해 본다.
* Heap 구현 - Java
* 시간복잡도 분석
* Heapsort 구현
* <a href="https://github.com/yaboong/datastructures-algorithms-study/blob/master/src/cc/yaboong/ds/heap/MinHeap.java" target="_blank" >예제코드 보기</a>

<!--more-->
Binary Tree 에 대해 모른다면 <a target="_blank" href="https://yaboong.github.io/data-structures/2018/02/10/1_binary-tree-1/"> 여기 </a>먼저 보고 오는게 Heap 을 이해하기 쉬울 것 같다.
<br/>


------


### Heap
* (Min) Heap 이란, 부모노드의 값이 자식 노드의 값보다 항상 작은 Complete Binary Tree 이다.
* Heap 은 [Heapsort 구현을 위한 데이터 구조로](https://en.wikipedia.org/wiki/Binary_heap) 만들어졌지만, Heapsort 외에도 Priority Queue 구현을 위한 데이터 구조로 많이 사용된다.
* Heap 은 Complete Binary Tree 형태의 계층적 데이터 구조이다. 
* Tree 를 구현할 때는 Linked List 를 사용할 수도 있고 Array 를 사용할 수도 있다.
* Complete Binary Tree 구현에는 Array 를 사용하는 것이 일반적이다. 
* Array 로 구현하면 부모 자식 노드간의 인덱스를 이용한 이동이 쉽고 직관적이기 때문이다. 

|  **Expression** |  **Return**                 |
|:---------------:|:---------------------------:|
| array[i/2]        | Returns the parent node     |
| array[(2*i)+1]    | Returns the left child node |
| array[(2*i)+2]    | Returns the right child node|

<br/>
Heap 에는 min heap 과 max heap 이 있는데, min heap 에서는 부모노드가 반드시 자식 노드보다 작은 값을 가져야 하고 max heap 은 그 반대다.
구현에 있어서는 부등호 방향 하나만 바꾸어 주면 되기 때문에 <mark>Min Heap 을 기준으로 구현해보겠다.</mark>


<br/>

--------


### Min Heap 구현 개요
(Min) Heap 이란, 부모노드의 값이 자식 노드의 값보다 항상 작은 Complete Binary Tree 이다.
    
##### Helper 메소드 목록

|  **메소드**                    |  **기능**                 |
|:-----------------------------|:---------------------------|
| getLeftChildIndex()          | 왼쪽 자식 노드의 index    |
| getRightChildIndex()         | 오른쪽 자식 노드의 index    |
| getParentIndex()             | 보모 노드의 index   |
| hasLeftChild()               | 왼쪽 자식 노드가 있는지    |    
| hasRightChild()              | 오른쪽 자식 노드가 있는지   |    
| hasParent()                  | 부모 노드가 있는지    |    
| leftChild()                  | 왼쪽 자식노드의 value   |    
| rightChild()                 | 오른쪽 자식노드의 value   |    
| parent()                     | 부모 노드의 value   |    
| swap()                       | index 값으로 노드 위치 교체        |    
| ensureExtraCapacity()        | heap 용량이 다 차면 capacity 를 2배로 늘림
| less()                       |  Comparable 구현 클래스들의 순서를 비교할 수 있도록 구현한 메소드   |    

<br/>

##### 주요 메소드 목록

|  **메소드**                    |  **기능**                 |
|:----------------------------|:---------------------------| 
| buildMinHeap()  |  array 지정하여 heap 생성하는 경우 array 내부 element 를 min heap 형태로 정렬   |    
| heapifyUp()  |  원소 삽입 후 처리   |    
| heapifyDown()  |  원소 삭제 후 처리   |    
| ensureExtraCapacity()  |  heap 이 가득차면 크기를 두배로   |    
| peek()  |  heap 의 root node (min heap 에서는 가장 작은 원소) 반환. 삭제는 하지 않음.   |   
| poll()  |  heap 의 root node (min heap 에서는 가장 작은 원소) 반환 후 삭제.   |   
| add()  |  데이터 추가   |   
    
<br/>

##### 주요 메소드 1 - heapifyUp() 개념 설명
* 새로운 원소가 추가 되었을 때 min heap 의 방식에 알맞은 위치로 원소를 재배치 시키는 역할을 한다.
* 새로운 원소가 추가 될 때는 가장 마지막 leaf node 다음 위치에 들어가고 heapifyUp() 메소드로 알맞은 위치로 보내준다.
* 동작 방식은 아래 slide 를 참고하면 된다.

{% include slideshare.html slideshare_url="//www.slideshare.net/slideshow/embed_code/key/9IvwueLCLFKjNh" %}
 
<br/>

##### 주요 메소드 2 - poll() & heapifyDown() 개념 설명
* 최소값을 return 하는 poll() 메소드는 root 를 반환한다. 
* Root 를 반환한 후, 마지막 노드를 root 에 위치시킨다.
* Heap 의 방식에 맞게 대체된 root 노드를 재배치 시키는 함수가 heapifyDown() 이다.
* 동작 방식은 아래 slide 를 참고한다. (heapifyUp() 설명 슬라이드와 element 값이 다르니 참고... 직접 만들었는데... 겁나 오래 걸린다.. 다시는 안만든다 이런거...)

{% include slideshare.html slideshare_url="//www.slideshare.net/slideshow/embed_code/key/BbLHbYkcfznApN" %}

<br/>

<br/>

---------


### Heap 구현 코드 설명 - Java
<a target="_blank" href="https://github.com/yaboong/datastructures-algorithms-study/blob/master/src/cc/yaboong/ds/heap/MinHeap.java">전체 소스 보기</a>

<br/>

##### 생성자

```javascript
public class MinHeap <T extends Comparable<T>> {
    private static final int DEFAULT_CAPACITY = 10;
    private int capacity;
    private int size;
    private T[] items;


    public MinHeap() {
        capacity = DEFAULT_CAPACITY;
        items = (T[]) new Comparable[capacity];
        size = 0;
    }

    public MinHeap(T[] inputArray) {
        size = inputArray.length;
        capacity = size;
        items = Arrays.copyOf(inputArray, size);
        buildMinHeap();
    }
}
```

* 두 개의 생성자를 만들 것이다. 
* 디폴트 생성자는 기본 10 개 capacity 를 가진 heap 을 생성한다.
* 다른 생성자는 배열을 받아서 min heap 으로 정렬시키는 방법도 포함하는 생성자이다.
* Heap 에 맞게 정렬이 되어있지 않은 배열을 받아서 Heap 으로 만들어 주는 함수가 buildMinHeap() 이다.

<br/>

##### buildMinHeap()
* <mark>(size >>> 1) - 1</mark> 은 size / 2 - 1 과 같은 의미다. 
* 자바 build-in PriorityQueue 클래스에서 이런식으로 비트연산을 사용했길래 나도 따라해봤다.
* 1-bit right shift 는 나누기 2 한 것과 같고, 1-bit left shift 는 곱하기 2 한 것과 같은데 비트연산이 더 빠르다. 

```javascript
private void buildMinHeap() {
    for (int i = (size >>> 1) - 1; i >= 0; i--) {
        heapifyDown(i);
    }
}
```

어쨌든 size / 2 - 1 은 마지막 노드의 부모 노드를 의미한다. 즉, 마지막 노드의 부모 노드 부터 차례대로 heap 화 시켜 나가겠다는 것이다.

<br/>

##### Helper 메소드 여러개
* Helper 메소드는 사실 메소드 이름이 의미하는 것이 구현부의 전부다. 
* <mark>hasLeftChild()</mark> 와 <mark>hasRightChild</mark> 부분이 잘 이해 되지 않을 수 있다.
* 자식 노드의 index 가 size 보다 작으면 자식노드가 존재하는 것으로 구현을 했다. 존재하는 모든 노드의 index 는 size 보다는 작아야 하기 때문이다.

```javascript
private int getLeftChildIndex(int parentIndex) { return (parentIndex << 1) + 1; }
private int getRightChildIndex(int parentIndex) { return (parentIndex << 1) + 2; }
private int getParentIndex(int childIndex) { return (childIndex - 1) >> 1; }

private boolean hasLeftChild(int index) { return getLeftChildIndex(index) < size; }
private boolean hasRightChild(int index) { return getRightChildIndex(index) < size; }
private boolean hasParent(int index) { return getParentIndex(index) >= 0; }

private T leftChild(int index) { return items[getLeftChildIndex(index)]; }
private T rightChild(int index) { return items[getRightChildIndex(index)]; }
private T parent(int index) { return items[getParentIndex(index)]; }

private void swap(int indexA, int indexB) {
    T temp = items[indexA];
    items[indexA] = items[indexB];
    items[indexB] = temp;
}

private void ensureExtraCapacity() {
    if (size == capacity) {
        items = Arrays.copyOf(items, capacity << 1);
        capacity = capacity << 1;
    }
}

private static boolean less(Comparable v, Comparable w){ return v.compareTo(w) < 0; }
```

<br/>

##### 주요 메소드 설명 heapifyUp, heapifyDown, peek, poll, add

이제 이 다섯개의 주요메소드만 알면 heap 에 대한 기본적인 코드 작성은 끝이다.

##### heapifyUp()
새로운 element 가 add() 호출로 추가되면 heap 에 맞게 재배치 하는 메소드이다.
* 파라미터 index 의 값으로는 마지막 노드의 index 가 온다.
* 재배치 하려는 노드의 부모노드가 존재하고, 재배치 하려는 노드가 부모노드 보다 작은 동안 반복
* 부모노드의 index 가져와서
* 부모노드와 자식노드의 위치 swap
* 반복

```javascript
private void heapifyUp(int index) {                                     
    while (hasParent(index) && less(items[index], parent(index))) {      
        int parentIndex = getParentIndex(index);                        
        swap(index, parentIndex);                                       
        index = parentIndex;                                            
    }
}
```
<br/>


##### heapifyDown()
poll() 호출로 root 노드가 반환되면 마지막 노드를 root 에 위치시키고 heap 에 맞게 재배치 시키는 메소드.
* buildMinHeap() 에서 호출 될 때 이외에는 항상 index 0 이라는 값을 넘겨준다.
* left child 가 없으면 right child 도 없다. 즉, child 가 있는 동안 반복.
* 두 children 중 더 작은 노드를 찾는다. 일단은 left child 가 더 작다고 가정하고 시작
* right child 가 있고, right child 가 left child 보다 작으면
* 더 작은 child 는 right child 로 지정
* 재배치 하려는 노드가 자녀 노드보다 작으면 멈춤
* 자녀 노드가 더 크거나 같으면
* swap
* 반복

```javascript
private void heapifyDown(int index) {                                               
    while (hasLeftChild(index)) {                                                                    
        int smallerChildIndex = getLeftChildIndex(index);                           
        if ( hasRightChild(index) && less( rightChild(index), leftChild(index) ) )  
            smallerChildIndex = getRightChildIndex(index);  
        
        if (less(items[index], items[smallerChildIndex]))                           
            break;                                                                                          
        else                                                                        
            swap(index, smallerChildIndex);                
        
        index = smallerChildIndex;                                                  
    }
}
```
<br/>

##### peek()
* Root 노드의 값이 무엇인지 확인만 하고 끝

```javascript
public T peek() {
    if (size == 0) throw new IllegalStateException();
    return items[0];
}
```

<br/>

##### poll()
* heap 이 비었으면 예외 던짐
* Root 노드 저장
* 마지막 노드를 root 위치로 보냄
* 마지막 노드 삭제
* heapifyDown()

```javascript
public T poll() {
    if (size == 0) throw new IllegalStateException();   
    T item = items[0];                                  
    items[0] = items[--size];                           
    items[size] = null;                                 
    heapifyDown(0);                                     
    return item;
}
```
<br/>

##### add()
* heap 이 다 찼으면 capacity 를 2배로 늘림
* 새로운 노드 추가하고 size 1 증가 시킴
* 방금 추가한 마지막 노드를 재배치 시킴

```javascript
public void add(T item) {
    ensureExtraCapacity();      
    items[size++] = item;       
    heapifyUp(size - 1);        
}
```
<br/>


--------

### 시간 복잡도 분석
heap 의 경우 insert, delete 모두 시간 복잡도가 최악의 경우에 O(log n) 이다. 

|**Algorithm** | **Worst case**  |
|:---------:|:-----------:| 
|Insert		| O(log n)    |  
|Delete		| O(log n)    |  
|Peek		| O(1)        |  

Insert 할 때 최악의 경우는 새롭게 insert 되는 요소가 가장 작은 값이라서 root 까지 가야하는 경우이고
Delete 할 때 최악의 경우는 root 가 반환되고 새로운 root 가 된 마지막 요소가 가장 큰 값이어서 다시 마지막 위치로 가는 경우이다.

두 경우 모두 트리의 높이 만큼만 움직이면 되기 때문에 트리의 높이를 의미하는 O(log n) 이 된다.


<br/>

### Heapsort
구현한 Min Heap 을 이용해서 간단하게 heapsort 구현해보자.
* 오름차순으로 정렬에는 Max Heap, 내림차순 정렬에는 Min Heap 이 사용된다.
* 순서
    * Heapify 한다. (배열을 힙의 구조를 가지게 만든다)
    * Root 를 맨 끝으로 보낸다.
    * Heap 의 size 만큼 반복한다.
    
Root 를 맨 끝으로 보내는 것은 poll() 메소드를 실행하고 반환된 결과 값을 배열의 마지막 위치로 보내면 된다.
Min Heap 의 경우 가장 작은 값을 N번 동안 마지막으로 보낼 것이기 때문에 내림차순으로의 정렬이 된다.
반대로 Max Heap 이었다면 가장 큰 값을 N번 동안 마지막으로 보낼 것이기 때문에 오름차순으로의 정렬이 된다.

위에 구현한 Min Heap 을 이용하면 heapsort 메소드는 굉장히 간단하다.
Min Heap 을 생성할 때 buildMinHeap() 으로 Heapify 해 주었으므로 나머지 작업만 해 주면 된다.

```javascript
public T[] heapSort() {
    for (int i=size - 1; i >= 0; i--) {
        T max = poll();
        items[i] = max;
    }
    return items;
}
```

poll() 메소드는 worst case 때 O(log n) 이 되는데 heapsort 에서는 poll() 메소드를 n번 호출하여 정렬 하게 되므로 heapsort 의 wort case time complexity 는 O(n log n) 이 된다.
<a target="_blank" href="https://www.cs.usfca.edu/~galles/visualization/HeapSort.html">여기</a> 가면 heapsort 동작에 대한 visualization 자료를 볼 수 있다.

<a target="_blank" href="https://github.com/yaboong/datastructures-algorithms-study/blob/master/src/cc/yaboong/ds/heap/MinHeap.java">전체 소스 보기</a>

<br/>

### Customized class 로 Heap 사용하기
* MinHeap class 를 정의 할 때 <mark>MinHeap T extends Comparable&lt;T&gt;&gt;</mark> 로 제너릭스를 이용해서 Comparable 인터페이스를 구현한 타입이면 모두 받을 수 있도록 정의했다.
* 나에게 필요한 class 를 정의해서 Min Heap 으로 만들어보자.

Comparable 인터페이스를 구현하는 것은 간단하다. compareTo() 메소드만 정의해주면 된다.
compareTo() 메소드는 작으면 -1, 크면 1, 같으면 0 을 반환하는 메소드로 이에 맞게만 정의해주면 된다.

```javascript
class Product implements Comparable<Product> {
    String name;
    int price;

    public Product(String name, int price) {
        super();
        this.name = name;
        this.price= price;
    }

    @Override
    public int compareTo(Product obj) {
        if      (this.price < obj.price) return -1;
        else if (this.price > obj.price) return  1;
        else                             return  0;
    }

    public String toString() {
        return "{" + this.name + ", " + this.price + "}";
    }
}
```

이제 min heap 에서 less() 메소드로 객체간 값을 비교할 때 이 compareTo() 메소드를 사용하여 비교하게 된다.
위와 같이 정의한 클래스로 아래와 같이 사용할 수 있다.

```javascript
Product[] arrayOfProduct = {
    new Product("알파스캔 24형 AOC 2470", 137440),
    new Product("알파스캔 2481 IPS", 176640),
    new Product("알파스캔 광시야각 AOC 2779", 219000),
    new Product("알파스캔 27형 AOC 2777", 266110),
    new Product("알파스캔 광시야각 AOC 3288", 289000),
    new Product("알파스캔 게이밍 무결점 AOC G2460", 294730),
    new Product("알파스캔 프레스티지 2215", 129000)
};
MinHeap<Product> productMinHeap = new MinHeap<>(arrayOfProduct);
productMinHeap.print();
```

<a target="_blank" href="https://github.com/yaboong/datastructures-algorithms-study/blob/master/src/cc/yaboong/ds/heap/MinHeap.java">전체 소스 보기</a>

<br/>

#### 참고한 자료
* <a target="_blank" href="https://www.youtube.com/watch?v=onlhnHpGgC4">Algorithms with Attitude Youtube Channel - Heap Sort</a>
* <a target="_blank" href="https://www.youtube.com/watch?v=WCm3TqScBM8">Algorithms with Attitude Youtube Channel - Introduction to Binary Heaps (MaxHeaps)</a>
* <a target="_blank" href="https://www.youtube.com/watch?v=t0Cq6tVNRBA">HackerRank Youtube Channel - Data Structures: Heaps</a>
* <a target="_blank" href="https://www.geeksforgeeks.org/binary-heap/">https://www.geeksforgeeks.org/binary-heap/</a>
* <a target="_blank" href="https://www.geeksforgeeks.org/heap-sort/">https://www.geeksforgeeks.org/heap-sort/</a>
