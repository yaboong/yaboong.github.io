---
layout: post
title: "Dynamic Programming - 2×n 타일링"
date: 2018-02-26
banner_image: /banner/algorithms-banner.jpg"
categories: [problem-solving]
tags: [problem-solving, java, dynamic-programming]
private: "true"
---

### 개요
* {% include href.html text="2×n 타일링 문제보기" url="https://www.acmicpc.net/problem/11726" %}
* {% include href.html text="예제코드보기" url="https://gist.github.com/yaboong/e624944318d697803cf3c22b6812545d" %}
<!--more-->


<br/>


### 문제
> 2×n 크기의 직사각형을 1×2, 2×1 타일로 채우는 방법의 수를 구하는 프로그램을 작성하시오.

<br/>

### 풀이
결론부터 말하면 이 문제는 피보나치 수열의 다른 표현 방식이다.

d[] 배열에는 2xn 크기의 직사각형을 채우는 방법의 수를 저장할 것이다.

2 x n 직사각형이 주어졌을 때, n 번째 위치에 세로로 타일을 놓는 경우와 가로로 타일을 놓는 경우 두 가지로 나누어 생각할 수 있다. (이때 놓는 타일의 갯수는 생각할 필요가 없다)
n 번째 위치에 세로로 놓는 경우 d[n-1] 의 방법이 있고, 가로로 놓는 경우 d[n-2] 의 방법이 있다.

결국 d[n] = d[n-1] + d[n-2] 로 피보나치 수열에서 n번째 항을 구하는 것과 같은 방법으로 풀면 된다.
  
<br/>

### 구현
{% gist e624944318d697803cf3c22b6812545d %}