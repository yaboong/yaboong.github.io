---
layout: post
title: "Merge Sort - 합병정렬"
date: 2018-02-14
banner_image: /banner/algorithms-banner.jpg"
categories: [algorithms]
tags: [algorithms, sorting, java]
---
<script type="text/javascript"  src="http://cdn.mathjax.org/mathjax/latest/MathJax.js?config=TeX-AMS-MML_HTMLorMML"></script>

### 개요
* Merge Sort 의 divide, merge 부분 동작 파악
* 구현 - Java
* 시간복잡도 분석 - 점화식 풀이 

<!--more-->


<br/>

### Merge Sort
1. 배열의 길이가 0 또는 1이면 이미 정렬된 것으로 본다. 그렇지 않은 경우에는
2. 정렬되지 않은 리스트를 절반으로 잘라 비슷한 크기의 두 부분 리스트로 나눈다.
3. 각 부분 리스트를 재귀적으로 합병 정렬을 이용해 정렬한다.
4. 두 부분 리스트를 다시 하나의 정렬된 리스트로 합병한다.

<br/>

### Divide 
Divide 에 대한 부분은 코드에서 mergeSort() 라는 메소드가 실행한다.
재귀적으로 배열을 반씩 자르고, 길이가 0 또는 1 이 되었을 때 merge 하는 과정은 아래와 같다.

{% include slideshare.html slideshare_url="//www.slideshare.net/slideshow/embed_code/key/qf766g9qnb2LAL" %}
 
<br/>


### Merge
merge() 메소드가 동작하는 과정은 아래와 같다.
몇 번의 divide(), merge() 작업이 반복적으로 실행 됐고, 최종적으로 처음에 divide 했던 두개의 sub array 를 merge 하는 과정이다.
두개의 sub array 들은 각각 정렬이 되어 있는 상태다.

바로 위 슬라이드에서 마지막 merge 가 실행되는 과정을 하나씩 살펴 본 슬라이드이다. 

{% include slideshare.html slideshare_url="//www.slideshare.net/slideshow/embed_code/key/sVWtJcBr2wb6cY" %}

<br/>

### 구현
```javascript
public class MergeSort {
    // 병합하면서 정렬한다
    private static void merge(Comparable[] a, Comparable[] aux, int lo, int mid, int hi){
        // 주어진 배열 a 의 특정 범위를 보조배열 aux 의 특정 범위에 할당해햐 하기 때문에 Arrays.copyRange() 를 쓸 수 없다
        for (int k = lo; k <= hi; k++){
            aux[k] = a[k];
        }
        int i = lo, j = mid+1;
        for (int k = lo; k <= hi; k++){
            if		(i > mid) 			  a[k] = aux[j++];
            else if (j > hi) 			  a[k] = aux[i++];
            else if (less(aux[j],aux[i])) a[k] = aux[j++];
            else						  a[k] = aux[i++];
        }
    }

    private static boolean less(Comparable v, Comparable w) {
        return v.compareTo(w) < 0;
    }

    private static void mergeSort(Comparable[] a, Comparable[] aux, int lo, int hi) {
        if(hi <= lo) return;            // 쪼갤 수 있는 범위를 벗어나면 return
        int mid = lo + (hi - lo)/2;     // 중간 인덱스
        mergeSort(a, aux, lo, mid);        // 왼쪽 반을 또 쪼갬
        mergeSort(a, aux, mid+1, hi);  // 오른쪽 반을 또 쪼갬
        merge(a, aux, lo, mid, hi);     // 병합
    }

    public static void sort(Comparable[] a){
        Comparable[] aux = new Comparable[a.length];        // 보조 배열 하나 생성. 재귀호출 밖에서 해줘야함.
        mergeSort(a, aux, 0, a.length-1);              // 재귀적으로 배열을 쪼갠다.
    }

    public static void main(String[] args) {
        Integer[] arr = {2, 3, 14, 10, 8, 1, 12, 9};
        System.out.println(Arrays.toString(arr));

        sort(arr);

        System.out.println(Arrays.toString(arr));
    }
}
```

<br/>


### 분석
Merge sort 는 O(nlogn) 의 시간복잡도를 가진다. 어떻게 그렇게 되는지 보자.

> T(n) = 2T(n/2) + n

위 점화식은 merge sort 를 표현한 점화식이다. T(n/2) 는 divide 하는 과정이고 n 은 merge 에 대한 부분이다.
T(n) 을 T(n/2) + n 으로 표현 가능하다면 T(n/2) 는 아래와 같이 표현 가능하다.

> T(n/2) = 2T(n/4) + n/2

각각의 T(x) 를 재귀적으로 표현해보면

> T(n/4) = 2T(n/8) + n/4

와 같이 표현 가능하다.

<br/>
각각의 점화식을 트리구조로 표현해보면 아래와 같다.

{% include image_caption.html caption="Recurrence Relation Tree" title="recurrence-relation-tree" imageurl="https://s3.ap-northeast-2.amazonaws.com/yaboong-blog-static-resources/algo/mergesort-recurrence-tree-1.png" %}

위 그림에서 T(n) 을 표현한 트리에서 T(n/2)을 T(n/2) 을 표현한 트리로 대치시키고, T(n/2) 을 표현한 트리에서 T(n/4) 을 표현한 트리로 계속해서 대치시켜 나가면 아래와 같은 트리를 그릴 수 있다.  

{% include image_caption.html caption="Recurrence Tree" title="recurrence-tree" imageurl="https://s3.ap-northeast-2.amazonaws.com/yaboong-blog-static-resources/algo/mergesort-recurrence-tree-2.png" %}

트리의 각 레벨에서 노드의 개수와, 각 레벨의 합을 구하면 아래와 같다.

{% include image_caption.html caption="Recurrence Tree Level Sum" title="recurrence-tree-level-sum" imageurl="https://s3.ap-northeast-2.amazonaws.com/yaboong-blog-static-resources/algo/mergesort-recurrence-tree-3.png" %}

Level 0 에는 n이 1개 있고, level 1 에는 n/2 이 2개, level 2 에는 n/4 이 4개, ... , level h 에는 T(1) 이 2<sup>h</sup> 개 있다.
T(1) = 1 로 표현 가능하므로 h = log<sub>2</sub>n 이라는 결과를 얻을 수 있다.

>   2<sup>h</sup> * T(1) = n<br/>
2<sup>h</sup> = n<br/>
h = log<sub>2</sub>n<br/>

즉, 각 레벨의 합인 n 이 트리의 높이인 logn 개 만큼 있으므로, 전체 시간 복잡도는 O(nlogn) 이라는 결론을 얻을 수 있다.

<br/>


### 비교
Coursera 강의에 재미있는 자료가 있었다. Merge sort 와 insertion sort 를 일반 컴퓨터, 슈퍼 컴퓨터로 실행한 결과에 대한 비교이다.
삽입정렬은 N 이 10억개면 317년이 걸린다.

<div style="text-align:center">
{% include image_caption.html imageurl="https://s3.ap-northeast-2.amazonaws.com/yaboong-blog-static-resources/algo/mergesort-vs-insertionsort.png" title="mergesort-vs-insertionsort" caption="merge sort vs insertion sort" %}
</div>


> Good algorithms are better than supercomputers. <cite>-- Robert Sedgewick 교수님 가라사대

<br/>

### 참고한 자료
* {% include href.html url="https://www.youtube.com/watch?v=iMT7gTPpaqw" text="Java: MergeSort explained" %}
* {% include href.html url="https://www.youtube.com/watch?v=Sk7IZESPgjk" text="Coursera Princeton University - Merge Sort" %}
* {% include href.html url="https://ko.wikipedia.org/wiki/%ED%95%A9%EB%B3%91_%EC%A0%95%EB%A0%AC" text="위키-합병정렬" %}
* {% include href.html url="https://www.youtube.com/watch?v=N50-z_3m_O0" text="Youtube Channel lennypitt - recursion tree" %}
* {% include href.html url="https://www.youtube.com/watch?v=4p1WqREIJq8" text="Youtube Channel Oresoft LWC - Recursion tree method - Example 1" %}

