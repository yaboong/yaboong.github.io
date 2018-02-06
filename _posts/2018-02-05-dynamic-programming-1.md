---
layout: post
title: "(TEST POST) Dynamic Programming 기초1 - Fibonacci"
date: 2018-02-05
banner_image: /banner/algo.jpg"
categories: [algorithms]
tags: [dynamic-programming, java]
---

### 개요
Recursion 을 사용하는 피보나치 수열의 구현법과 Dynamic Programming 으로의 구현법의 장단점을 알아본다.

<!--more-->

#### 피보나치 수열

```
0, 1, 1, 2, 3, 5, 8, 13, 21...
```

nth value = (n-1)th + (n-2)th 의 방식으로 전개되는 수열이다. 기본적인 접근방법은 재귀호출을 사용하는 것이다.

```java
public class FibRecursion {
    public static void main(String[] args) {
        System.out.println(fib(8));
    }

    private static int fib(int n) {
        if (n <= 0) return 0;
        else if (n == 1) return 1;
        else return fib(n-1) + fib(n-2);
    }
}
```




