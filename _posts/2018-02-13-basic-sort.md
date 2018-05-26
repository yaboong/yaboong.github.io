---
layout: post
title: "Basic Sorting Algorithms - Bubble, Selection, Insertion Sort"
date: 2018-02-13
banner_image: algorithms-banner.jpg
categories: [algorithms]
tags: [algorithms, sorting, java]
---

### 개요
기초적인 정렬 알고리즘인 거품정렬, 선택정렬, 삽입정렬에 대해 알아본다. 
<!--more-->


<br/>

### Bubble Sort - 거품정렬
거품 정렬(Bubble sort)은 두 인접한 원소를 검사하여 정렬하는 방법이다. 인접한 원소끼리 검사하며 큰건 오른쪽으로, 작은건 왼쪽으로 옮긴다. 
상당히 느리지만, 코드가 단순하기 때문에 자주 사용된다. 원소의 이동이 거품이 수면으로 올라오는 듯한 모습을 보이기 때문에 지어진 이름이다.

최악의 경우 O(n<sup>2</sup>) 이다. 이미 정렬이 되어있는 배열의 경우 O(n) 이다.

**참고영상**

{% include youtube.html id="RT-hUXUWQ2I" %}


<br/>

**Bubble Sort 구현 예제**<br/>
두 번째 for loop 에서 arr.length - 1 이 아니라 <mark>arr.length - i</mark> 임에 주의하자. i 다. 아이. 영어 소문자 아이. i.<br/>
바깥쪽 for loop 이 한번 실행 될 때마다 인접한 두 요소를 비교하여 큰 값은 오른쪽으로, 작은 값은 왼쪽으로 보낸다. 
그 결과, 가장 마지막 인덱스에는 주어진 배열에서 가장 큰 값이 위치하게 되기 때문에 정렬이 된 것으로 볼 수 있으므로 <mark>arr.length - i</mark> 를 해주어서 매번 바깥쪽 for loop 이 실행될 때마다 마지막 인덱스는 탐색에서 제외시켜 주는 것이다.
{% gist d04c3739a03a41e949d4a02d380c2b7f %}

<br/>





### Selection Sort - 선택정렬
1. 주어진 리스트 중에 최솟값을 찾는다.
2. 그 값을 맨 앞에 위치한 값과 교체한다(패스(pass)).
3. 맨 처음 위치를 뺀 나머지 리스트를 같은 방법으로 교체한다.

for loop 을 처음부터 끝까지 반드시 두번 반복해야 하므로 항상 O(n<sup>2</sup>) 이다.

**참고영상**

{% include youtube.html id="3hH8kTHFw2A" %}


<br/>

**Selection Sort 구현 예제**
{% gist b1810eaf0ce37b8e763c86826fe83bd7 %}



<br/>

### Insertion Sort - 삽입정렬
배열의 모든 요소를 앞에서부터 차례대로 이미 정렬된 배열 부분과 비교하여, 자신의 위치를 찾아 삽입함으로써 정렬을 완성하는 알고리즘이다.
* 배열의 모든 요소를 앞에서부터 차례대로 -> <mark>for(int i = 0; i < N; i++)</mark>
    * i 는 평범하게 0 ~ length-1 까지 하나씩 돈다
* 이미 정렬된 배열 부분과 비교하여 -> <mark>for(int j = i; j > 0; j--)</mark>
    * 각 i 를 기준으로 (j = i 로 할당해주고) j 의 왼쪽에 있는녀석들을 차례대로 스캔하면서 (j 를 감소시키면서 ) j-1 이 j 보다 작으면 둘의 위치를 바꾼다. 그렇지 않은 경우, 그 왼쪽 녀석들은 이미 정렬이 되어있는 것이므로 멈추고, 다음 i 에 대해 진행한다.

최악의 경우 (오름차순으로 정렬하려는데 내림차순으로 정렬되어 있는 경우) for loop 을 처음부터 끝까지 두번 반복하게 되어 O(n<sup>2</sup>) 이 되지만 그렇지 않은 경우 두번째 반복문을 도중에 멈추기 때문에 일반적으로 선택정렬이나 버블정렬에 비해 빠르다.

**참고영상**

{% include youtube.html id="kU9M51eKSX8" %}

<br/>

**Insertion Sort 구현 예제**
{% gist 4d7feb990ee9cdcb1171f9de503c3a05 %}

<br/>