---
layout: post
title: "AWS EC2 에 Jenkins 서버 구축하기"
date: 2018-04-29
banner_image: jenkins.jpg
categories: [jenkins]
tags: [jenkins, aws]
---

### 개요
* Jenkins 서버를 AWS EC2 에 구축하는 방법을 알아본다.
<!--more-->


<br/>

### EC2 생성
일반적으로 ec2 를 생성하는 과정과 동일하게 생성하면 된다. 
주의할 점으로, Apache 를 사용하지 않고 바로 8080 포트에 붙을 것이므로 ec2 security group 의 인바운드 규칙에 8080 포트를 추가해 줘야한다.
EC2 와 연결한 security group 은 기본적으로 아래와 같이 설정되어 있으면 된다.

{% include image_caption2_href.html caption="security group setting for jenkins" title="security group setting for jenkins" imageurl="/yaboong-blog-static-resources/aws/aws-ec2-security-group-for-jenkins-8080.png" %}  

<br/>

### EC2 에 Jenkins 설치하기
EC2에 접속한다.
```
$ ssh -i your_pem_file.pem ec2-user@{your-ec2-public-dns}
```

yum 패키지 매니저를 최신으로 업데이트 해준다.
```
$ sudo yum -y update
```

AWS Linux 에 기본으로 설치된 자바버전은 7 이다. Jenkins 는 Java 8 이 필요하므로 기존 java 는 지우고 java 8 을 재설치 하도록 한다.
```
$ sudo yum remove java-1.7.0-openjdk
$ sudo yum install java-1.8.0
```

yum 이 어디서 jenkins 를 설치해야 할지 알 수 있도록 Jenkins repository 를 추가해준다.
```
$ sudo wget -O /etc/yum.repos.d/jenkins.repo http://pkg.jenkins-ci.org/redhat/jenkins.repo
```

Jenkins 를 설치할 때, 파일들이 신뢰할 수 있는 source 로 부터 제공됨을 증명하기 위해 로컬 GPG 키링에 Jenkins GPG key 를 추가해준다.
```
$ sudo rpm --import http://pkg.jenkins-ci.org/redhat/jenkins-ci.org.key
```

이제 Jenkins 를 설치하면 된다.
```
$ sudo yum install jenkins
```

Jenkins 서버 시작
```
$ sudo service jenkins start
Starting Jenkins                                           [  OK  ]
```

8080 port LISTEN 하고 있는지 확인
```
$ netstat -na | grep 8080
tcp        0      0 :::8080                     :::*                        LISTEN
```

<br/>


### Jenkins 서버 접속 & 초기 설정
이제 http://${your-ec2-public-dns}:8080 으로 접속하면 아래와 같은 화면이 뜰 것이다.

{% include image_caption2_href.html caption="jenkins init access" title="jenkins initial access" imageurl="/yaboong-blog-static-resources/jenkins/jenkins-init-access.png" %}

초기 접속 비밀번호는 <mark>/var/lib/jenkins/secrets/initialAdminPassword</mark> 여기에 있다는 말이다.

```
$ sudo cat /var/lib/jenkins/secrets/initialAdminPassword
```

실행 후 나온 스트링을 복붙한다.

다음화면에서 플러그인을 필요한 것만 설치할지, 디폴트로 설치할지 선택한다. 일단은 suggested plugins 을 다 설치하도록 한다.

{% include image_caption2_href.html imageurl="/yaboong-blog-static-resources/jenkins/jenkins-install-plugins.png" %}

설치중
{% include image_caption2_href.html imageurl="/yaboong-blog-static-resources/jenkins/jenkins-plugin-install.png" %}

사용자 계정을 생성한다.
{% include image_caption2_href.html imageurl="/yaboong-blog-static-resources/jenkins/jenkins-create-user.png" %}

아래와 같은 화면이 나오면 Jenkins 를 사용할 준비는 끝.
{% include image_caption2_href.html imageurl="/yaboong-blog-static-resources/jenkins/jenkins-logged-in.png" %}

추가로, 혹시 jenkins 서버에 git 이 설치되어있지 않다면 아래 명령어로 git 은 설치되어있는지 확인해주면 나중에 편하다.
```
$ sudo yum install git
``` 


이제 써보즈아~~~~~~~~~~~





<br/>




### 참고한 자료
* {% include href.html text="Install jenkins 2.x in AWS (Amazon Linux AMI)" url="https://github.com/carlosCharz/installjenkinsaws" %}