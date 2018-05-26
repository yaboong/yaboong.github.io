---
layout: post
title: "Jenkins 로 빌드 자동화하기 1 - GitHub 에 push 되면 자동 빌드하도록 구성"
date: 2018-05-14
banner_image: jenkins-github.jpg
categories: [jenkins]
tags: [jenkins, devops]
---

### 개요
* GitHub private repository 에 소스를 push 했을때, Jenkins 서버에 webhook 을 날려서 자동으로 빌드가 되도록 세팅하는 과정을 알아본다.
<!--more-->


<br/>

### 1. GitHub Repository Setting
Private repository 에 있는 GitHub 소스를 Jenkins 에서 접근하기 위해서는 공개키 암호화 방식의 SSH key 세팅이 필요하다.

이 세팅을 통해 비공개 저장소에 id, pw 를 사용하지 않고 접근이 가능하다.
비공개 GitHub repository 에 push 된 코드를 젠킨스에서 읽어와서 빌드하기 위해서 필요한 과정이다.

<br/>

##### 1-1. GitHub Integration Plugin 설치
<mark>Jenkins 관리 > 플러그인 관리</mark> 로 가서 <mark>GitHub Integration Plugin</mark> 을 설치한다.

<br/>

##### 1-2. SSH Key Setting
```bash
$ sudo su -s /bin/bash jenkins
$ ssh-keygen
```
명령을 실행하면 public key 와 private key 가 생성되고, 생성된 public key 를 복사한다.

```bash
$ cat /var/lib/jenkins/.ssh/id_rsa.pub
```

자신의 GitHub private 저장소에서 <mark>Settings > Deploy keys</mark> 에서 복사한 공개키를 등록해준다. 

{% include image_caption2_href.html caption="deploy keys" title="deploy keys" imageurl="https://s3.ap-northeast-2.amazonaws.com/yaboong-blog-static-resources/jenkins/github-deploy-keys.png" %}


<br/>


##### 1-3. Webhook Setting
Webhook 은 웹상의 Trigger 같은 존재다. GitHub 의 지정한 브랜치에 소스가 push 되면 webhook 으로 젠킨스에게 알려주어 빌드를 유발하도록 설정한다.

<mark>Settings > Integrations & services > Add service</mark> 에서 jenkins 로 검색해서 나오는 <mark>Jenkins (GitHub plugin)</mark> 을 등록한다.

{% include image_caption2_href.html caption="Add Service from GitHub Repository Setting" title="Add Service from GitHub Repository Setting" imageurl="https://s3.ap-northeast-2.amazonaws.com/yaboong-blog-static-resources/jenkins/github-jenkins-webhook-setting.png" %}

다음 화면에서 아래와같이 <mark>http://YOUR-JENKINS-SERVER/github-webhook/</mark> 을 Jenkins hook url 로 지정해주고 Active 에 체크한다.
나의 경우 http://build.oyabun.cc:8080/github-webhook/ 으로 등록했다.

참고한 다른 글들에서 마지막 / 를 빼면 안된다고 하는데 빼고 해보지는 않았다. (굳이 뺄 이유가.. ^^;)

{% include image_caption2_href.html caption="Jenkins Webhook" title="Jenkins Webhook" imageurl="https://s3.ap-northeast-2.amazonaws.com/yaboong-blog-static-resources/jenkins/github-jenkins-webhook-setting-2.png" %}

<br/>


### 2. Jenkins Project Setting
예제를 위해 my-first-jenkins 라는 이름으로 freestyle 프로젝트를 하나 만들었다.


##### 2-1. GitHub Credentials
소스 코드 관리 탭에서 GitHub Repository 의 Clone with SSH 항목을 복사해서 Repositoy URL 에 입력한다.

{% include image_caption2_href.html caption="소스 코드 관리 탭" title="소스 코드 관리 탭" imageurl="https://s3.ap-northeast-2.amazonaws.com/yaboong-blog-static-resources/jenkins/jenkins-project-setting-3.png" %}

입력만 하면 위와같이 <span style="color:red">Failed to connect to repository : ... </span> 오류가 난다. 접근권한이 없음을 의미하는데, 처음에 설정해 둔 private key 를 설정해줘야 한다.
오류 메시지 바로 아래 Credentials 항목 Add 버튼을 눌러 아래와 같이 세팅해준다.

{% include image_caption2_href.html caption="Add GitHub Credential" title="Add GitHub Credential" imageurl="	https://s3.ap-northeast-2.amazonaws.com/yaboong-blog-static-resources/jenkins/jenkins-github-credentials-add.png" %}

Username 은 깃헙 계정명이고, ID 는 Jenkins 에서 사용할 이 Credential 에 대한 식별자이다.
Passphrase 는 제일 처음 단계에서 ssh-keygen 수행시 입력한 passphrase 를 적어주면 된다.

그리고 나서 Add 버튼을 누르고, Credentials 에 본인이 방금 등록한 것을 선택해주면 오류메시지가 사라진다.

<br/>


##### 2-2. 빌드 유발
빌드 유발 탭에서는 <mark>GitHub hook trigger for GITScm polling</mark> 를 선택해준다. 말 그대로 GitHub 의 hook trigger 를 받으면 빌드를 하겠다는 것이다.
{% include image_caption2_href.html caption="빌드 유발 탭" title="빌드 유발 탭" imageurl="https://s3.ap-northeast-2.amazonaws.com/yaboong-blog-static-resources/jenkins/jenkins-build-type-setting.png" %}
	
<br/>


##### 2-3. 빌드 스크립트
Build 탭에서 Execute shell 에 테스트용 문구를 하나 넣어준다. 
이 예제에서는 GitHub 의 Webhook 으로 Jenkins 에서 자동 빌드를 할 수 있도록 설정하는 것이 목적이므로, 실제 빌드 스크립트가 아닌 간단한 스크립트를 적어준다.
나중에 로그로 확인할 것이다.

{% include image_caption2_href.html caption="Build Command" title="Build Command" imageurl="https://s3.ap-northeast-2.amazonaws.com/yaboong-blog-static-resources/jenkins/jenkins-build-command.png" %}

<br/>

### 3. 테스트
이제 모든 설정은 끝났으니 소스를 push 해서 Jenkins 에서 빌드를 수행하는지 확인해보자.

{% include image_caption2_href.html caption="Git Push" title="Git Push" imageurl="https://s3.ap-northeast-2.amazonaws.com/yaboong-blog-static-resources/jenkins/jenkins-git-push-example.png" %}

소스를 변경하고 Commit and Push 를 했더니,

{% include image_caption2_href.html caption="빌드 대기 목록" title="빌드 대기 목록" imageurl="https://s3.ap-northeast-2.amazonaws.com/yaboong-blog-static-resources/jenkins/jenkins-build-queue-1.png" %}

왼쪽 네비게이션 바 아래 빌드 대기 목록에 my-first-jenkins 가 뜬다. Push 만 했지 Jenkins 관리화면에서는 아무것도 안했음에도 알아서 빌드작업을 수행한다.

그리고 잠시 기다리니까 빌드 실행 상태 창에 진행상황과 함께 #1 으로 my-first-jenkins 프로젝트가 뜬다. (아래 그림)

{% include image_caption2_href.html caption="빌드 실행 상태" title="빌드 실행 상태" imageurl="https://s3.ap-northeast-2.amazonaws.com/yaboong-blog-static-resources/jenkins/jenkins-build-queue-2.png" %}

모두 끝나고 페이지를 새로고침 해주면, 원래 회색이었던 아이콘이 아래와 같이 파란색 공모양으로 변하고 최근 성공에 빌드넘버가 #1 으로 표시된다.

{% include image_caption2_href.html caption="빌드 완료" title="빌드 완료" imageurl="https://s3.ap-northeast-2.amazonaws.com/yaboong-blog-static-resources/jenkins/jenkins-build-job-done.png" %}

해당 프로젝트의 Console Output 으로 가보면,

{% include image_caption2_href.html caption="Console Output" title="Console Output" imageurl="https://s3.ap-northeast-2.amazonaws.com/yaboong-blog-static-resources/jenkins/jenkins-build-job-log.png" %}

아까 빌드 스크립트에 작성했던 <mark>GitHub hook trigger is working</mark> 명령이 수행된 것을 확인할 수 있고, Finished: SUCCESS 로 빌드가 성공적으로 이루어졌음을 알리는 로그도 함께 출력 되었다.

지금까지 {% include href.html text="AWS EC2 에 Jenkins 서버 구축하기" url="https://yaboong.github.io/jenkins/2018/04/29/run-jenkins-on-aws-ec2/" %} 
로 Jenkins 서버 구축과, GitHub 저장소에 Push 하면 자동으로 빌드하도록 구성까지 해 보았다.

###### 다음 포스팅에서는 
* Jenkins Pipeline 사용
* 빌드시 Jenkinsfile 의 pipeline script 를 읽어서 빌드
* 빌드시 Docker Image 생성
* 생성한 Docker Image AWS ECR 에 Push

하는 과정을 다루어 봐야겠다.

<br/>

### 참고한 자료
* {% include href.html text="[StackOverflow] Jenkins-Build when a change is pushed to GitHub option is not working" url="https://stackoverflow.com/questions/30576881/jenkins-build-when-a-change-is-pushed-to-github-option-is-not-working/30577823" %}
* {% include href.html text="[GitHub Help] Generating a new SSH key and adding it to the ssh-agent" url="https://help.github.com/articles/generating-a-new-ssh-key-and-adding-it-to-the-ssh-agent/" %}
* {% include href.html text="[YouTube] Asymmetric encryption - Simply explained" url="https://youtu.be/AQDCe585Lnc" %}
