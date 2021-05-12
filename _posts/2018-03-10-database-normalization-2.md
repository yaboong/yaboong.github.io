---
layout: post
title: "데이터베이스 정규화 - BCNF"
date: 2018-03-10
banner_image: db.png
categories: [database]
tags: [database, normalization]
---

### 개요
* 데이터베이스 정규화에서 BCNF 에 대해 알아본다.

<!--more-->

BCNF를 이해하기 위한 사전지식으로 1NF, 2NF, 3NF 에 대한 이해가 필요하다.
기억이 안난다면 {% include href.html text="여기" url="https://yaboong.github.io/database/2018/03/09/database-normalization-1/" %}를 봐도 도움이 될 것 같다.

<br/>

### 3NF 면 BCNF 이다?

{% include href.html text="이전 포스팅" url="https://yaboong.github.io/database/2018/03/09/database-normalization-1/" %}
에서 3NF 를 만족하는 테이블을 보았다.

3NF 를 만족하는 릴레이션 R의 후보키가 1개 밖에 없고, R의 후보키가 기본키가 되고, 3NF를 만족하면 항상 BCNF 를 만족한다.
즉, {% include href.html text="이전 포스팅" url="https://yaboong.github.io/database/2018/03/09/database-normalization-1/" %}
에서 3NF 를 만족하는 릴레이션들은 모두 후보키가 1개 밖에 없었기 때문에 3NF 를 만족시키는 정규화를 했지만 BCNF 도 만족한다.

하지만 후보키가 여러개인 경우에는 3NF를 만족시키지만 이상현상이 발생하는 경우가 있는데, 
이를 해결하기 위한 정규형이 보이스-코드 정규형 (BCNF; Boyce-Codd Normal Form)이다. 
제3정규형보다 조금 더 엄격한 제약조건을 가지기 때문에 Strong 3NF 라고도 한다.

<br/>

### BCNF (Boyce-Codd Normal Form)
이론적으로는 아래 조건을 만족시키는 릴레이션은 BCNF 라고 한다.

> X -> Y 는 trivial FD 이거나, X 는 릴레이션 R 의 슈퍼키이다.

Trivial FD 는 Y 가 X 의 부분집합인 경우를 말한다. A->A 이거나 AB->A 같은 당연한 경우를 말하는 것이다.
그래서 BCNF 에 대한 정의를 실용적인 말로 바꾸면 <mark>"모든 결정자가 KEY 인 경우 <strong>BCNF</strong> 이다"</mark> 
라고 할 수 있겠다. BCNF 를 위반하는 릴레이션은 이론적으로는 아래와 같은 구조를 가지게 된다. (A, B 가 키)

{% include image_caption2.html text="BCNF를 위반하는 경우" caption="BCNF를 위반하는 경우" imageurl="https://s3.ap-northeast-2.amazonaws.com/yaboong-blog-static-resources/etc/bcnf-violate.png" %}

위 릴레이션은 1NF 는 만족한다는 가정하에,
* 기본키가 아닌 모든 속성이 기본키에 완전 함수 종속이므로 2NF 를 만족한다.
* 기본키가 아닌 모든 속성이 기본키에 이행적 함수 종속이 되지 않으므로 3NF 를 만족한다.

하지만, 결정자인 C 가 슈퍼키가 아니다. 그러므로 BCNF 를 위반한다.
A, B, C 속성만 사용해서 예제를 만들어보자.

<br/>

### BCNF 를 위반하는 사례

{% include image_caption.html text="BCNF 위반" caption="BCNF 위반 예제" imageurl="https://s3.ap-northeast-2.amazonaws.com/yaboong-blog-static-resources/etc/bcnf-violation-ex.png" %}

{Student, Course} 를 기본키로 선정한 경우 
3NF 까지 만족하지만 BCNF 를 만족하지 않는 경우에도 삽입이상, 갱신이상, 삭제이상이 생길 수 있다.

**삽입이상**<br/>
Algorithms 라는 수업이 Dijkstra 에 의해 열렸다고 하자. 하지만 수강생이 아무도 없는 경우 삽입할 수 없다.

**갱신이상**<br/>
James Gosling 이 담당하는 강의가 바뀌게 될 경우 수강생의 수만큼 갱신해줘야 하므로 하나라도 빠뜨리면 데이터 불일치 문제가 발생할 여지가 있다.

**삭제이상**<br/>
모찌가 자퇴해서 Computer Architecture 수업의 수강생이 없어지면 Alan Turing 이라는 강사도 사라진다.


<br/>

### 분해
BCNF 를 위반하는 릴레이션에 대한 분해과정은 아래와 같다.

* BCNF 를 위반하는 nontrivial FD X -> Y  를 찾는다.
* 두 개의 릴레이션으로 분해한다.
    * XY 로 구성된 릴레이션 하나
    * X 와 나머지 속성들로 구성된 릴레이션 하나

위 과정을 Student, Course, Instructor 예제에 적용시키면 아래와 같다.

* nontrivial FD <mark>Instructor -> Course</mark> 를 찾았다.
* 두 개의 릴레이션으로 분해한다.
    * Instructor, Course 하나
    * Instructor 와 나머지 속성들로 구성된 릴레이션 Instructor, Student

분해한 두 개의 릴레이션에서 기존 릴레이션에서 결정자역할을 했던 속성을 키로 해준다. 그러면 BCNF 까지 만족시키는 릴레이션 두 개가 생기게 된다.

{% include image_caption.html text="BCNF를 만족하는 두개의 릴레이션으로 분해" caption="BCNF를 만족하는 두개의 릴레이션으로 분해" imageurl="https://s3.ap-northeast-2.amazonaws.com/yaboong-blog-static-resources/etc/bcnf-violation-resolved.png" %}

<br/>

### 하고보니 드는 의문점


BCNF 를 위반하는 좀 더 현실적인 예제를 찾기위해 애썼는데 저게 최선이었다. 
근데 내가 못찾는거거나 사람들이 몰라서 안올린게 아니라 그런 경우가 잘 없을 것 같다는 생각이 들었다.
의미를 공유하는 속성들을 제대로 잘 분리하여 3정규형 까지 왔으면 BCNF 를 만족시키지 않는 형태가 나오는 것 자체가 
애초에 관심사를 잘못 분리해 온 경우가 아닌가 싶다.

위 예제를 봐도, 최종 테이블의 형태가 좀 어색하다.
학생이 수강한 내역을 과목에 대응시키는 것이 의미상으로 맞는 것이지 강사에 대응시키는 것은 뭔가 어색하다.

내 개인적인 생각으로는 BCNF 를 위반하는 예제에 사용했던 릴레이션이 그 자체로 문제가 있다기 보다는 
이 릴레이션에 모든것을 담으려다 보니까 생긴 문제라고 생각한다.
DBA 이거나 전문가가 아니라서 현실세계에서 어떤 경우가 더 많이 발생하고 채택되는지 정확히 알 수는 없지만,
BCNF 를 위반하는 경우 자체가 이론적으로 접근할 때에만 많이 생기는 것 같다.
(AB->C, C->B 의 FD 를 가지는 실생활 예제를 찾으려고 계속 생각해봐도 참 안떠오르고 떠오른다고 해도 억지스럽고 어색하다)

위 예제 같은 경우 애초에 
* 과목ID를 키로 가지는 과목 테이블이 있을테고
* 학생ID를 키로 가지는 학생 테이블이 있을테고
* 강사ID를 키로 가지는 강사 테이블이 있어야 할 것이다.

그렇게 세 테이블이 추가적으로 존재하고, 
BCNF 를 만족하지 않았던 테이블의 데이터가 과목ID, 학생ID, 강사ID 를 외래키로 가진다면, 
BCNF 를 만족하는 어색한 테이블 두개를 만들어내는 방법에서 각종 이상현상을 해소했던 것처럼 이상현상을 해소할 수 있다.

처음부터 잘못 설계 된 구조로 시스템을 운영하다가 어떤 기능을 추가하려고 하다보니 BCNF 를 위반하는 사례는 어쩌면 생길 수도 있을 것 같지만,
아무리 생각해도 BCNF 를 위반하는 사례는 이론적으로만 많이 존재할 것 같다.


<br/>

### 참고한 자료
* {% include href.html text="http://www.vertabelo.com/blog/technical-articles/boyce-codd-normal-form-bcnf" url="http://www.vertabelo.com/blog/technical-articles/boyce-codd-normal-form-bcnf"%}
* {% include href.html text="https://www.studytonight.com/dbms/database-normalization.php" url="https://www.studytonight.com/dbms/database-normalization.php"%}
* {% include href.html text="https://db.grussell.org/section009.html" url="https://db.grussell.org/section009.html"%}
* {% include href.html text="https://opentutorials.org/module/1361/8769" url="https://opentutorials.org/module/1361/8769"%}

