---
layout: post
title: "Counting Sort - 계수정렬"
date: 2018-03-20
banner_image: algorithms-banner.jpg
categories: [algorithms]
tags: [algorithms, sorting, java]
---

### 개요
* 원소간 비교없이 정렬할 수 있는 카운팅 정렬에 대해 알아본다.

<!--more-->

<br/>

### 카운팅 정렬
* 원소간 비교하지 않고 각 원소가 몇개 등장하는지 갯수를 세서 정렬하는 방법이다.
* 모든 원소는 양의 정수여야 한다.
* 시간복잡도는 O(n+k) 로 퀵정렬, 병합정렬에 비해 일반적으로 빠르다.
* 정렬을 위한 길이 n의 배열 하나, 계수를 위한 길이 k의 배열 하나. O(n+k) 의 공간복잡도를 가진다.
 
<br/>

### 동작 방식
핵노가다... ㅎㅎ

{% include slideshare.html slideshare_url="//www.slideshare.net/slideshow/embed_code/key/LGIEmMMWNer6KW" %}

<br/>

### 구현

{% gist 93ceb7e5e590834171439d5f59ac0720 %}

<br/>

### 안정정렬
카운팅 정렬은 안정정렬의 형태를 가질 수 있다. 안정정렬이란 같은 값을 가지는 복수의 원소들이 정렬 후에도 정렬 전과 같은 순서를 가지는 것이다.
안정정렬이 아닌 대표적인 예는 퀵정렬이다.

누적합을 기반으로 aux 배열에 원소를 이동하며 정렬할 때, 기존 배열 a의 가장 큰 인덱스에서 작은 인덱스로 (오른쪽에서 왼쪽으로) 진행해야 안정 정렬이 가능하다.

{% include image_caption2.html caption="counting sort is stable" title="counting sort is stable" imageurl="https://s3.ap-northeast-2.amazonaws.com/yaboong-blog-static-resources/algo/counting-sort-stable.png" %}

오른쪽에서 왼쪽으로 진행했다면 위와 같은 형태로 정렬이 되기 때문에 기존 배열의 순서를 해치지 않는다.

<br/>

### 성능개선
위 예제에서는 원소의 숫자 범위가 0~3이었기 때문에 계수를 위한 배열 c는 0~3 까지의 인덱스만 있으면 가능했다.

그런데 위와 같은 방식으로는 배열이 [2147482647, 2147483547, 2147483647] 로 이루어져있다면 메모리 부족 오류가 뜬다.
계수를 위한 배열 c가 2147483647 + 1 개의 공간을 할당하기 때문이다.

이를 해결하기 위해서는 주어진 배열에서 최소값도 찾고 계수배열의 인덱스로 접근할 a[i] 값을 사용할 때 항상 min 값을 빼주면 된다.

이렇게 수정해도 0~2147483647 의 범위를 가진 배열을 정렬해야 한다면 메모리 부족 오류가 나지만 큰 수들을 가진 배열을 메모리 낭비없이 정렬 가능하다.

약간의 성능 개선을 한 카운팅 정렬의 코드는 아래와 같다.

{% gist 6fdcb44834a8411c75e038ac45a3411b %}

###### 실행결과
```
[2147482647, 2147483547, 2147483647]

Process finished with exit code 0
```