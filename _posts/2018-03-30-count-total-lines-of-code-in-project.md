---
layout: post
title: "프로젝트에 있는 코드 줄 수 계산해보기"
date: 2018-03-30
banner_image: programming-banner.jpg
categories: [for-fun]
tags: [for-fun, python]
---

### 개요
* 프로젝트의 총 코드 라인수를 세는 방법
* linux 커맨드 이용해서 세보기
* python 스크립트로 세보기

<!--more-->
<br/>


모 회사 면접을 갔는데 본인이 짜본 프로젝트의 전체 코드수랑 자신이 짠 코드수는 얼마정도 되는지 물어보는 질문이 있었다.
코드의 라인수로 평가하려던건 아닐테고 프로젝트의 규모가 대략적으로 어느정도 되었는지 알고싶었던 것이 아닐까 생각한다.

대충 어림잡아 말했는데 집에오니까 진짜 라인수는 얼마나 될까 궁금한 마음에 직접 세 봤다.

<br/>

#### Linux 커맨드로 세보기
모든 java 파일의 라인수를 카운트 하려면 프로젝트 루트폴더로 가서 아래 명령어를 실행시켜주면 된다.  
```bash
$ find . -name '*.java' | xargs wc -l
```

점(.) 으로 표시한 현재 디렉토리에서 .java 로 끝나는 파일명을 찾고, 각각의 파일에 wc -l (word count, option 으로 라인수 출력) 명령어를 실행시켜서 한줄로 출력하는 것이다.

###### 결과
```bash
272 ./src/main/java/cd/ac/sagenet/controller/AdminController.java
101 ./src/main/java/cd/ac/sagenet/controller/CertificateController.java
101 ./src/main/java/cd/ac/sagenet/controller/CourseApplyController.java
.
.
(중략)
.
.
623 ./src/main/java/cd/ac/sagenet/util/PDFBuilder.java
5114 total
```

또는 아래와 같은 명령어를 사용해서 프로젝트 루트에서 java 파일의 라인수만 출력할 수도 있다.
```bash
$ find . -name *.java | xargs cat | grep "$" | wc -l
```

<mark>find . -name 'JavaFileName.java' | xargs cat</mark> 여기까지만 실행하면 현재디렉토리에서 JavaFileName.java 라는 파일을 찾은 후 cat 이라는 명령어를 실행하게 된다.
실행결과는 JavaFileName.java 파일 내용이 터미널에 표시된다.

여기에 파이프라인으로 <mark>grep "$"</mark> 를 해주면 JavaFileName.java 파일에서 "$" 를 찾는데, "$" 는 EOL을 의미한다.
그리고 파이프라인으로 <mark>wc -l</mark> 해줘서 EOL 의 라인수를 세는 방법이다.

그런데 프로젝트 안에는 라이브러리도 있고, 폰트 파일도 있고... 내가 손하나 대지 않은 코드들이 많이 있다. 이런 디렉토리는 제외하고 싶고, 또 특정 파일을 제외하고 싶기도 했다.

그래서 좀더 쉽게 사용하고 싶어서 파이썬으로 코드를 하나 짜봤다.
 
<br/>

#### 파이썬 스크립트 만들어서 세보기
사용법은 아래와 같다.
* ROOT_DIR: 조사할 프로젝트 루트 경로를 넣어준다.
* extensions: 조사할 확장자명들을 넣어준다. '*.java', '.py' 이런식으로.
* ignore_paths: 라인수 카운트에서 무시하고 싶은 디렉토리 경로를 넣어준다. (예, 라이브러리들이 담긴 디렉토리 경로)
* ignore_files: 라인수 카운트에서 무시하고 싶은 파일의 이름을 넣어준다.

{% gist 97c3990818220404795fe091a1e7f565 %}

###### 실행결과
```bash
 623 /Users/yaboong/DevWorkspace/eclipse-workspace/sagenet/src/main/java/cd/ac/sagenet/util/PDFBuilder.java
 529 /Users/yaboong/DevWorkspace/eclipse-workspace/sagenet/src/main/webapp/resources/js/functionScript.js
 361 /Users/yaboong/DevWorkspace/eclipse-workspace/sagenet/src/main/java/cd/ac/sagenet/util/ExcelUploadScore.java
 320 /Users/yaboong/DevWorkspace/eclipse-workspace/sagenet/src/main/resources/cd/ac/sagenet/mybatis/mapper/studentMapper.xml
 285 /Users/yaboong/DevWorkspace/eclipse-workspace/sagenet/src/main/resources/cd/ac/sagenet/mybatis/mapper/scoreMapper.xml
 276 /Users/yaboong/DevWorkspace/eclipse-workspace/sagenet/src/main/java/cd/ac/sagenet/controller/ScoreController.java
 .
 .
 (중략)
 .
 .
  16 /Users/yaboong/DevWorkspace/eclipse-workspace/sagenet/src/main/webapp/WEB-INF/views/student/noData.jsp
  
  지정한 확장자별 파일 개수
  *.java   48 개
  *.jsp    31 개
  *.xml    16 개
  *.css     8 개
  *.js      3 개
  
  프로젝트 전체 파일 수: 106 개
  프로젝트 전체 코드 라인 수: 10082 줄
```

이런식으로 나온다. 궁금하긴 했었는데 재밌다.