---
layout: post
title: "Dynamic Programming 기초1 - Fibonacci"
date: 2018-02-05
banner_image: /banner/algo.jpg"
categories: [algorithms]
tags: [dynamic-programming, java]
---

### 개요
피보나치 수열의 3가지 구현방법을 알아본다.
* Simple Recursion
* Recursion with Memoization
* Bottom-Up Approach

<a href="https://github.com/yaboong/problem-solving-java/blob/master/src/com/yaboong/algorithms/Fibonacci.java" target="_blank">Sample Code</a>


<!--more-->

#### 피보나치 수열

```
0, 1, 1, 2, 3, 5, 8, 13, 21...
```

nth value = (n-1)th + (n-2)th 의 방식으로 전개되는 수열이다. 재귀함수로 구현할 수 있다.

{% highlight javascript %}

private static long fibSimple(int n) {
    return (n < 2) ? n : fib(n-1) + fib(n-2);
}

{% endhighlight %}


#### 기존 Recursion 의 문제점
Recursive 하게 짠 fib() 함수는 아래와 같은 방식으로 호출이 일어난다.

<div style="text-align:center">
<img src="https://s3.ap-northeast-2.amazonaws.com/yaboong-blog-static-resources/fib-call-tree-1.svg"/>
</div>

n=5 일 때 벌써 함수 호출을 15번이나 해야 한다. n이 작을때는 문제 없지만 n이 커졌을 때 2가지 문제점을 발견할 수 있다.
* 재귀호출이 지나치게 많아져서 memory 가 부족해 질 수 있다.
    * 함수가 호출되고 return 하기 전까지는 memory 의 stack 영역에 돌아갈 곳을 기록해 둔다. n 이 커지면 커질수록 stack 에 함수 호출에 대한 기록이 더 많이 쌓이는데 return 하기 까지 또다른 재귀적 호출이 있기 때문에 문제가 생길 수 있다.
* 느리다. 
    * O(2<sup>n</sup>) 의 시간 복잡도를 가진다.
    
![https://s3.ap-northeast-2.amazonaws.com/yaboong-blog-static-resources/time-complexity-graph.png](https://s3.ap-northeast-2.amazonaws.com/yaboong-blog-static-resources/time-complexity-graph.png)

O(2<sup>n</sup>) 의 시간 복잡도를 가지는 알고리즘은 factorial 다음으로 최악의 성능을 가진다. Input 이 크다면 반드시 피해야 하는 방법이다.

#### 해결방법1 - Memoization

> Memoization 은 Dynamic Programming 의 한 방법으로 한번 계산한 값을 반복적으로 계산하지 않도록 기록해 두는 것이다.

기존 recursion 방식은 재귀호출 자체가 문제라기 보다는 불필요한 호출을 여러번 하게 된 다는 것이다.
fib(5) 를 구하기 위해 fib(3) 은 2회, fib(2) 는 3회, fib(1) 은 5회... 호출하게 된다. Memoization 의 아이디어는 처음 fib(n) 을 계산할 때 어딘가에 기록해 두고 또 사용하게 될 경우에는 기록해 둔 결과값만 가지고 오는 것이다.
Memoization 을 사용했을 때의 recursion tree 는 아래 그림과 같다. 

<div style="text-align:center">
<img src="https://s3.ap-northeast-2.amazonaws.com/yaboong-blog-static-resources/fib-call-tree-2.svg"/>
</div>

재귀 호출이 위 트리를 순회하는 방식은 [postorder](https://www.geeksforgeeks.org/tree-traversals-inorder-preorder-and-postorder/) 방식이다.

{% highlight javascript %}
private static long fibMemoization(int n, long[] memo) {
    if (memo[n] != 0) return memo[n];
    long result = (n == 1 || n == 2) ? 1 : fibMemoization(n-1, memo) + fibMemoization(n-2, memo);
    memo[n] = result;
    return result;
}
{% endhighlight %}

Memoization 을 사용하는 호출의 경우 상수시간이 걸리고, 첫번째 fib(n) 을 계산 할 때만 재귀적 호출이 두번 f(n-1) + f(n-2) 이루어지기 때문에 O(2n + c) = O(n) 의 time complexity 를 가진다.
기존 O(2<sup>n</sup>) 에서 O(n) 으로의 개선은 큰 변화다. 


#### 해결방법2 - Bottom-Up
작성중..



```log
fibMemoization: 12586269025 
fibMemoization elapsed time: 22 ms
fibRecursion: 12586269025 
fibRecursion elapsed time: 72259 ms

Process finished with exit code 0
```




