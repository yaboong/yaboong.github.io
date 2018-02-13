---
layout: post
title: "Basic Sorting Algorithms - Bubble, Selection, Insertion Sort"
date: 2018-02-13
banner_image: /banner/algorithms-banner.jpg"
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

**Bubble Sort 구현 예제**
```javascript
public class BubbleSort {
    public static void bubbleSort(int[] arr) {
        int temp = 0;
        for(int i = 0; i < arr.length; i++) {
            for(int j= 1 ; j < arr.length-i; j++) {
                if(arr[j]<arr[j-1]) {
                    temp = arr[j-1];
                    arr[j-1] = arr[j];
                    arr[j] = temp;
                }
            }
        }
        System.out.println(Arrays.toString(arr));
    }

    public static void main(String[] args) {
        bubbleSort(new int[]{10, 9, 8, 7, 6, 5, 4, 3, 2, 1});
    }
}
```

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
```javascript
public class SelectionSort {
    public static void selectionSort(Comparable[] arr){
        int N = arr.length;
        for (int i = 0; i < N; i++){
            int min = i;
            for (int j = i+1; j < N; j++)
                if (less(arr[j], arr[min])) min = j;
            exch(arr, i, min);
        }
        System.out.println(Arrays.toString(arr));
    }

    private static boolean less(Comparable v, Comparable w){
        return v.compareTo(w) < 0;
    }

    private static void exch(Comparable[] a, int i, int j){
        Comparable swap = a[i];
        a[i] = a[j];
        a[j] = swap;
    }

    public static void main(String[] args) {
        selectionSort(new Integer[]{10, 9, 8, 7, 6, 5, 4, 3, 2, 1});
    }
}
```



<br/>

### Insertion Sort - 삽입정렬
배열의 모든 요소를 앞에서부터 차례대로 이미 정렬된 배열 부분과 비교하여, 자신의 위치를 찾아 삽입함으로써 정렬을 완성하는 알고리즘이다.

최악의 경우 (오름차순으로 정렬하려는데 내림차순으로 정렬되어 있는 경우) for loop 을 처음부터 끝까지 두번 반복하게 되어 O(n<sup>2</sup>) 이 되지만 그렇지 않은 경우 두번째 반복문을 도중에 멈추기 때문에 일반적으로 선택정렬이나 버블정렬에 비해 빠르다.

**참고영상**

{% include youtube.html id="kU9M51eKSX8" %}

<br/>

**Insertion Sort 구현 예제**
```javascript
public class InsertionSort {
    public static void insertionSort(Comparable[] arr){
        int N = arr.length;
        for(int i = 0; i < N; i++){
            for(int j = i; j > 0; j--){
                if(less(arr[j], arr[j-1])) exch(arr, j, j-1);
                else break;
            }
        }
        System.out.println(Arrays.toString(arr));
    }

    private static boolean less(Comparable v, Comparable w){
        return v.compareTo(w) < 0;
    }

    private static void exch(Comparable[] a, int i, int j){
        Comparable swap = a[i];
        a[i] = a[j];
        a[j] = swap;
    }

    public static void main(String[] args) {
        insertionSort(new String[]{"G", "F", "E", "D", "C", "B", "A"});
    }
}
```

<br/>