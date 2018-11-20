---
layout: post
title: "운영체제(OS) - 프로세스란"
date: 2018-11-20
banner_image: os.jpg
categories: []
tags: []
---

### 개요
* {% include href.html text="[Udacity] Introduction to Operating Systems by Georgia Tech" url="https://www.udacity.com/course/introduction-to-operating-systems--ud923" %}
* 
<!--more-->


<br/>

### 프로세스(Process) 란?
* OS 는 애플리케이션을 대신하여 하드웨어 자원을 관리한다.
* 애플리케이션은 그 자체로는 실행중인 것이 아니므로 static entity 이다. 디스크에 있을 수도 있고 플래시 메모리에 있을 수도 있다.
* 프로세스는 그 자체로 active entity 이다. 애플리케이션이 launch 되면 메모리에 로드되어 실행되는데, 그게 프로세스가 되는 것이다.
* 한 애플리케이션으로부터 여러개의 프로세스가 실행될 수 있으며 프로세스는 활성화된 애플리케이션의 실행 상태(execution state) 를 표현한다.
* 프로세스는 항상 움직이는 상태이기 보다는 어떤 입력을 기다리고 있을 수 있다.
* 예를들어, 메모장 애플리케이션이 실행되면 사용자가 무언가를 입력하기를 기다리고 있는다던지, 만약 CPU 가 하나뿐인 컴퓨터에서는 다른 프로세스가 CPU 사용을 마치기를 기다릴 수도 있다.

<br/>

### 프로세스의 구조
* 프로세스는 실행중인 애플리케이션의 코드, 데이터 애플리케이션이 사용하는 모든 변수들 등을 모두 캡슐화 한다.
* 프로세스의 모든 상태는 주소공간(address space)으로 고유하게 식별되어야 한다.
* 프로세스의 상태를 캡슐화 하는데 사용되는 OS 추상화는 주소공간이다.

{% include image_caption_href.html title="What does a process look like" caption="What does a process look like" height="300px" imageurl="	https://s3.ap-northeast-2.amazonaws.com/yaboong-blog-static-resources/os/4_P2L1_4_WhatDoesAProcessLookLike.png" %}

* 주소공간은 위 그림처럼 V0 ~ Vmax 주소값을 범위로 가지며, 서로 다른 process state 는 V0 ~ Vmax 의 주소공간에서 서로 다른 영역에 나타난다.

###### 서로 다른 process state 란 무엇?
* 위 그림에 text 라고 표시해둔 코드영역이 있을 것이고, 프로세스가 초기화될 때 사용가능한 데이터가 있을 것이다. 이것들은 프로세스가 처음 로드될 때 사용가능한 static state 이다.
* 추가적으로, 프로세스는 실행중에 동적으로 상태를 변화시킨다. 메모리를 할당하고, 일시적인 결과값을 저장하고, 파일로부터 데이터를 읽어들이기도 한다.
* 이 경우에 사용되는 주소공간을 힙(heap) 이라고 한다.
* 그림에서도 힙영역은 연속적인 주소공간으로 표현되어 있음을 볼 수 있다. 경우에 따라 힙영역에 빈공간이 존재하기도 하므로 완전히 연속적인 공간이라고는 할 수 없으나, data 나 text 영역처럼 정적으로 딱 잘라서 표시해두지 않았다.
* 또 다른 주소공간은 스택(stack) 이라 표현하는 영역이다. 힙영역처럼 동적으로 할당되어 프로세스의 실행상태에 따라 줄었다 늘었다 하는 영역이며 LIFO 방식으로 동작한다.
* 힙과 스택 영역은 active state 라고 할 수 있겠다.

<br/>

### 프로세스의 구조 (조금 더 자세히)
{% include image_caption_href.html title="Process Address Space" caption="Process Address Space" imageurl="https://s3.ap-northeast-2.amazonaws.com/yaboong-blog-static-resources/os/4_P2L1_5_ProcessAddressSpace.png" %}
* 애플리케이션이 메모리에 로드되어 실행되면 메모리의 주소공간으로 프로세스에 대한 모든것이 표현 되는데, 이때 사용되는 주소는 가상주소(Virtual Address)다.
* 가상주소는 물리적인 메모리의 주소와 매치되지 않고, OS에서 메모리 관리를 담당하는 컴포넌트(ex. 페이지 테이블) 가 가상주소와 물리주소의 매핑을 담당한다.
* 가상주소와 물리주소간의 매핑을 하는 방법을 사용함으로써 가상주소공간에 있는 데이터가 실제 주소공간에 어떻게 배치되는지를 완전히 분리할 수 있으며 이는 물리적 메모리 관리를 보다 단순하게 만들어 준다.
* 위 그림에서 처럼, 프로세스가 x 라는 변수에 접근을 하면, 가상주소 0x03c5 는 페이지테이블에서 0x0f0f 라는 실제 물리적 주소에 매핑되어 참조된다. 

<br/>

### 주소공간과 메모리 관리
{% include image_caption_href.html title="Address Space and Memory Management" caption="Address Space and Memory Management" imageurl="https://s3.ap-northeast-2.amazonaws.com/yaboong-blog-static-resources/os/4_P2L1_6_AddressSpaceAndMemoryManagement.png" %}
* 프로세스가 실행되는데에 V0 ~ Vmax 라는 임의의 주소공간이 모두 필요한 것은 아니다. 어떤 부분은 할당되지 않을 것이다.
* 또한, 모든 프로세스의 상태를 표현하기에 물리 메모리가 충분하지 않을 수도 있다.
* 예를들어 가상주소가 32bit 로 이루어져 있다면 주소공간의 최대 크기는 4GB 가 된다. (2^32 bits = 4 * 1024 * 1024 * 1024 = 4GB)
* 동시에 여러개의 프로세스가 실행중이라면 물리적 메모리는 금방 부족해질 것이다.
* 이를 해결하기 위해 운영체제는 동적으로, 어떤 주소공간의 어떤 부분을 물리 메모리의 어디에 표현할 것인지 결정한다.
* 예를들어 어떤 시스템에서 P1, P2 프로세스가 실행되고 있을때, 위 그림과 같은 방식으로 물리메모리를 공유하도록 할 수 있다.
* P1, P2 모두 주소공간의 일부분이 실제로 사용되지 않을 경우, 일시적으로 디스크에 swap 해서 저장해두었다가 나중에 필요해지는 경우에 다시 메모리로 가지고 오게 된다.
* 다시 메모리로 가지고 오게 되는 경우, 가지고 올 공간을 확보하기 위해 P1, P2 에서 실제 사용되지 않는 일부분을 다시 디스크에 swap 하는 과정을 진행하기도 한다.
* 그러므로, 운영체제는 가상주소가 실제로 어디에 있는지에 (메모리에 있는지 디스크에 있는지) 대한 정보를 유지해야한다.
* 메모리 관리에 대한 내용은 뒤에서 자세히 다룰 예정이므로 여기서는 이정도로만 간략하게 설명하고 넘어간다.
* 여기서는, 운영체제는 프로세스의 주소공간에 대한 정보를 어떻게든 유지하는 역할을 담당한다는 것은 기억하자. 페이지 테이블이 그 대표적인 예시이다.   

<br/>

### 프로세스 실행 상태
운영체제가 프로세스를 관리하려면 프로세스에 대한 정보가 필요하다.
운영체제가 프로세스를 중단하면 (종료말고 일시적 중단), 운영체제는 중단시에 프로세스가 무엇을 하고 있었는지 기록해두고, 다른 작업을 처리하고 나서 돌아왔을 때 중단시점부터 재개해야 한다.
운영체제는 프로세스가 무엇을 하고 있는지 어떻게 알 수 있을까?

{% include image_caption_href.html title="Process Execution State" caption="Process Execution State" imageurl="https://s3.ap-northeast-2.amazonaws.com/yaboong-blog-static-resources/os/4_P2L1_8_ProcessExecutionState.png" %}


###### 프로그램 카운터 (PC: Program Counter)
* CPU 라는 하드웨어가 어떻게 애플리케이션을 실행하는지 살펴보자.
* 애플리케이션은 실행되기 이전에 그 소스코드가 먼저 컴파일 (인간이 보기 편하게 만든 소스코드를 컴퓨터가 이해 할 수 있는 기계어 구조로 변환하는 일련의 과정) 되어야 한다.
* 컴파일이 완료되면 컴퓨터가 해석할 수 있는 언어인 바이너리가 생성된다.
* 바이너리는 instruction 의 집합이지만 점프, 루프, 인터럽트 등이 발생할 수 있으므로 반드시 순차적으로 실행되지는 않는다.
* CPU 는 프로세스의 instruction 중 프로세스가 현재 어느 instruction 에 있는지 알 필요가 있다.
* 이것을 기억하기 위한 것을 프로그램 카운터 (PC) 라고 한다.

###### CPU 레지스터
* 프로그램 카운터는 프로세스가 어떤 레지스터에서 실행되는 동안 CPU 에서 유지되며, 다른 레지스터들을 CPU 에서 관리된다.
* 이러한 것들이 프로세스가 실행되는 동안 필요한 값들 (데이터의 주소, instruction 의 실행에 영향을 미치는 상태 정보 등) 을 가지고 있게 되며 이들이 모두 프로세스 상태를 구성하는 부분들이다.

###### 프로세스 스택
* 프로세스가 무엇을 하는지 정의하는 또 다른 부분은 프로세스 스택이다. 
* 프로세스 스택의 가장 윗부분(top) 을 OS 가 알고있어야 하는데 이는 스택 포인터에 의해 유지된다.

지금까지 언급한 프로그램 카운터, CPU 레지스터, 스택 포인터 외에도 프로세스가 무엇을 하는지 파악하기 위해 OS 가 알아야 할 것들은 많이 있다.
각각의 프로세스마다 이러한 정보들을 유지하기 위해 OS 는 PCB 라고 불리는 Process Control Block 을 유지한다.

<br/>

### 프로세스 제어 블록 (PCB: Process Control Block)
  
     


### 참고한 자료
* {% include href.html text="" url="" %}