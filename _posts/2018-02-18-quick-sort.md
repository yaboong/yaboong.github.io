---
layout: post
title: "Quick Sort - 퀵정렬"
date: 2018-02-18
banner_image: algorithms-banner.jpg
categories: [algorithms]
tags: [algorithms, sorting, java]
---

### 개요
* Quick sort 파티셔닝 설명 및 구현 예제
* {% include href.html text="코드 보기" url="https://github.com/yaboong/datastructures-algorithms-study/blob/master/src/cc/yaboong/algorithms/sort/QuickSort.java" %}

<!--more-->


<br/>

### Quick Sort
1. 주어진 배열을 한번 섞는다.
2. pivot (기준값) 을 하나 설정하고, pivot 의 왼쪽에는 pivot 보다 작은 값들이, 오른쪽에는 pivot 보다 큰 값들이 오도록 partition 한다.
3. 왼쪽, 오른쪽으로 나뉜 배열에 대해 재귀적으로 반복한다.

평균적으로 O(nlogn), 최악의 경우(이미 정렬된 경우) O(n<sup>2</sup>). 최악의 경우를 피하기 위해 Shuffle 해주는 것.

<br/>

### Partition 과정
{% include slideshare.html slideshare_url="//www.slideshare.net/slideshow/embed_code/key/z3ULZUSP2WZMjK" %} 

<br/>


### 비교
삽입정렬, 합병정렬과의 비교

<div style="text-align:center">
{% include image_caption.html caption="삽입정렬 합병정렬 퀵정렬 비교" title="삽입정렬 합병정렬 퀵정렬 비교" imageurl="https://s3.ap-northeast-2.amazonaws.com/yaboong-blog-static-resources/algo/quicksort-comparison.png" %}
</div>

> Good algorithms are better than supercomputers. <br/>
Good algorithms are better than good ones. <cite>-- Robert Sedgewick 교수님 가라사대

<br/>


### 구현 - Java
{% include href.html text="github 에서 보기" url="https://github.com/yaboong/datastructures-algorithms-study/blob/master/src/cc/yaboong/algorithms/sort/QuickSort.java" %}
{% gist 058d1dc0fbbbf3e8759518e369046d69 %}


<br/>

### 참고한 자료
* {% include href.html text="Princeton Algorithms Course 7 1 Quicksort 19 33" url="https://youtu.be/UgshAvuW33o"%}


