---
layout: post
title: "Docker 로 Http4s 프로젝트 Aws Elastic Beanstalk 에 배포해보기 - 1"
date: 2018-01-19
banner_image: docker-on-aws.png
categories: [docker]
tags: [docker, http4s, aws, elastic-beanstalk]
---

### 개요
* [이전포스팅](https://yaboong.github.io/2018/01/18/web-frame-work-comparison/) 에서 http4s 를 사용해 보기로 했다.
* [http4s](https://github.com/http4s/http4s) 는 http 서비스에 scala 인터페이스를 활용하는 것으로 java 의 servlet 과 같은 녀석이라 보면 되겠다.
* Aws elastic beanstalk 에 Docker 를 사용해서 배포해보자.
* Http4s 프로젝트 생성(sbt, g8) -> Dockerizing -> Aws ECR push -> Aws EB deploy
<!--more-->


### Intro
[이전포스팅](https://yaboong.github.io/2018/01/18/web-frame-work-comparison/) 에서 http4s 를 사용해 보기로 했다.
[http4s](https://github.com/http4s/http4s) 는 http 서비스에 scala 인터페이스를 활용하는 것으로, python 의 wsgi, java 의 servlet 과 같은 녀석이라 보면 되겠다.
Java 의 servlet 이 tomcat 을 container 로 사용하는 것 처럼 scala 의 http4s 는 [blaze](https://github.com/http4s/blaze) 라는 녀석을 사용한다.
Blaze 는 http4s 에서 네트워크에 필요한 부분을 구현한 것이다.


#### Why Docker?
일단 목표는 http4s 로 간단한 웹 애플리케이션을 하나 만들어서 aws elastic beanstalk (이하 eb) 에 배포해 보는 것이었다. 
전에 scala 와 scalatra 로 aws eb 에 배포를 해서 서비스를 관리 해봤는데 scalatra 는 결국 servlet 기반이어서 그냥 war 파일로 묶어서 올리기만 하면 만사형통이었다.
Local 에서는 `sbt run` 을 실행하면 서버가 동작하는데 배포를 어떻게 해야할 지 이것저것 찾아보던 중 Docker 라는 놈을 알게 됐고,
개발, 테스트, 운영 에서의 배포환경을 동일하게 가져갈 수 있다고 하는 말에 끌려서 Docker 를 사용해서 배포해 보기로 했다.
Docker 에 대한 설명은 [여기](https://subicura.com/2017/01/19/docker-guide-for-beginners-1.html) 참 좋다.


#### Why AWS Elastic Beanstalk?
굳이 aws eb 을 사용해서 배포하려는 이유는 auto scaling 을 지원하기 때문이다. 거기다 심지어 사용하기 쉽다. 
처음 개발을 시작할 때는 '와... 배포는 어떻게 하는거지... 우와... 로드밸런싱... 난 언제 저런거 해보지...' 했는데 Aws 가 알아서 다 해준다 ^^ 
웹 서비스 사용자가 많아지면 트래픽이 높아지고 트래픽을 분산처리 해 주는 로드밸런서가 필요하다. (로드밸런싱에 대한 설명은 [여기](https://opentutorials.org/course/608/3008))
하지만 eb 를 사용하면 그냥 아무것도 안해도 알아서 다 해준다 ^^ 로드밸런싱만 해줄 뿐 아니라 트래픽이 급증해서 현재 가지고 있는 서버 개수로 부족한 경우 알아서 서버 개수를 늘려준다.
관리이슈를 줄이는 것은 개발자 입장에서는 생산성을 높일 수 있는 중요한 요소다.

#### http4s 프로젝트 생성
sbt 와 [giter8 template](https://github.com/foundweekends/giter8/wiki/giter8-templates) 을 이용하면 쉽게 생성할 수 있다.

```
$ brew install sbt
$ sbt sbtVersion
[info] ans: String = null
[info] ans: String = null
[info] Set current project to framework-test (in build file:/Users/yaboong/DevWorkspace/framework-test/)
[info] 0.13.13
$ sbt -sbt-version 0.13.13 new http4s/http4s.g8
```

하면 프로젝트 생성에 필요한 정보를 입력받는다. 그냥 엔터치면 [default] 로 설정된다. 나는 아래와 같이 입력했다.

```
name [quickstart]: http4s-test-app
organization [com.example]: com.yaboong
package [com.yaboong.http4stestapp]:
scala_version [2.12.4]: 2.12.1
sbt_version [1.0.4]: 0.13.13
http4s_version [0.18.0-M7]:
logback_version [1.2.3]:
specs2_version [4.0.2]:
```

생성한 프로젝트에 예제 `HelloWorldServer.scala` 로 가면
```python
object HelloWorldServer extends StreamApp[IO] with Http4sDsl[IO] {
  val service = HttpService[IO] {
    case GET -> Root / "hello" / name =>
      Ok(Json.obj("message" -> Json.fromString(s"Hello, ${name}")))
  }

  def stream(args: List[String], requestShutdown: IO[Unit]) =
    BlazeBuilder[IO]
      .bindHttp(8080, "0.0.0.0")
      .mountService(service, "/")
      .serve
}
```

예제 코드가 있다. 확실히 처음에 쓰려고 했던 fintrospect 보다는 라우팅이 직관적이다. 


#### Run
name 에 입력한 경로로 가서 `sbt run` 을 실행시켜서 아래와 같은 화면이 나오면 제대로 실행 된 것이다.
![](/yaboong-blog-static-resources/http4s/http4s-sbt-run.png)

localhost:8080/hello/yourname 으로 접속하면 잘 도는 걸 확인할 수 있다.


#### Dockering
이제 이 프로젝트를 docker image 로 떠보자. Docker 는 [여기](https://store.docker.com/editions/community/docker-ce-desktop-mac) 받고 실행시키면 된다.

```
$ docker images
```

sbt 에서 지원하는 plugin 으로 이미지를 만들어보자.
> project-root/project/plugins.sbt
```
addSbtPlugin("com.typesafe.sbt" % "sbt-native-packager" % "1.2.1")
```

> project-root/build.sbt
```
enablePlugins(JavaAppPackaging)
enablePlugins(DockerPlugin)
```

IntelliJ 에서 프로젝트를 열고 External Libraries 의 sbt-and-plugins 를 보면 `sbt-native-packager-1.2.1.jar` 가 추가 된 것을 볼 수 있고
sbt-native-packager-1.2.1.jar/sbt/sbt.autoplugins 파일을 보면

```python
com.typesafe.sbt.SbtNativePackager
com.typesafe.sbt.packager.archetypes.JavaAppPackaging
com.typesafe.sbt.packager.archetypes.JavaServerAppPackaging
com.typesafe.sbt.packager.archetypes.jar.ClasspathJarPlugin
com.typesafe.sbt.packager.archetypes.jar.LauncherJarPlugin
com.typesafe.sbt.packager.archetypes.scripts.AshScriptPlugin
com.typesafe.sbt.packager.archetypes.scripts.BashStartScriptPlugin
com.typesafe.sbt.packager.archetypes.scripts.BatStartScriptPlugin
com.typesafe.sbt.packager.archetypes.systemloader.SystemVPlugin
com.typesafe.sbt.packager.archetypes.systemloader.SystemdPlugin
com.typesafe.sbt.packager.archetypes.systemloader.SystemloaderPlugin
com.typesafe.sbt.packager.archetypes.systemloader.UpstartPlugin
com.typesafe.sbt.packager.debian.DebianDeployPlugin
com.typesafe.sbt.packager.debian.DebianPlugin
com.typesafe.sbt.packager.debian.JDebPackaging
com.typesafe.sbt.packager.docker.DockerPlugin
com.typesafe.sbt.packager.docker.DockerSpotifyClientPlugin
com.typesafe.sbt.packager.jdkpackager.JDKPackagerDeployPlugin
com.typesafe.sbt.packager.jdkpackager.JDKPackagerPlugin
com.typesafe.sbt.packager.linux.LinuxPlugin
com.typesafe.sbt.packager.rpm.RpmDeployPlugin
com.typesafe.sbt.packager.rpm.RpmPlugin
com.typesafe.sbt.packager.universal.UniversalDeployPlugin
com.typesafe.sbt.packager.universal.UniversalPlugin
com.typesafe.sbt.packager.windows.WindowsDeployPlugin
com.typesafe.sbt.packager.windows.WindowsPlugin
```

이런 plugin 들을 사용할 수 있는데 이 중 JavaAppPackaging, DockerPlugin 을 사용 할 것이다. 저장하면 알아서 다시 빌드한다.

이제 프로젝트 root 로 가서
 
```python
$ sbt docker:publishLocal
$ docker images
```
를 실행하면 아래와 같이 docker image 가 새로 생성된 것을 볼 수 있다.

```python
MacBook-Pro-3:http4s-test-app yaboong$ docker images
REPOSITORY          TAG                         IMAGE ID             CREATED          SIZE
http4s-test-app     0.0.1-SNAPSHOT    828c8b1d9e0b    3 seconds ago   785MB
```


#### AWS Elastic Container Registry
이제 이 도커 이미지를 docker hub 에 올려도 되겠지만 private repository 는 한개만 무료로 제공되기 때문에 Aws Elastic Container Registry 에 올려서 ecr 에 있는 걸 eb 에 deploy 시켜보자.
[Awscli 를 설치](https://docs.aws.amazon.com/ko_kr/cli/latest/userguide/installing.html) 하고
```python
$ aws --profile yaboong ecr create-repository --repository-name yaboong/http4s-test-app
``` 
명령어 실행하면 
```python
{
    "repository": {
        "createdAt": 1516344095.0,
        "repositoryName": "yaboong/http4s-test-app",
        "repositoryUri": "<registry_id>.dkr.ecr.ap-northeast-2.amazonaws.com/yaboong/http4s-test-app",
        "registryId": "<registry_id>",
        "repositoryArn": "arn:aws:ecr:ap-northeast-2:<registry_id>:repository/yaboong/http4s-test-app"
    }
}
```

이렇게 생성되었다고 알려준다. aws ecr 명령어 실행할 때 \-\-profile yaboong 을 입력해준 건 aws cli 는 하나지만 aws 계정은 여러개를 사용하고 있어서 그렇다.


\<registry_id\> 값은 계정마다 고유하게 가지는 숫자인 것 같다. repository 마다 registryId 값이 다를 줄 알았는데 모두 같은 걸 사용한다.

```python
$ vi ~/.aws/config
```

```python
[profile yaboong]
aws_access_key_id = YABOONGKEYID
aws_secret_access_key = yaboongACCESSkey
region=your-region

[profile yours]
aws_access_key_id = YOURKEYID
aws_secret_access_key = yourACCESSkey

[default]
region = ap-northeast-2
```

이런식으로 저장해두면 \-\-profile 옵션으로 서로 다른 IAM 계정에 접속할 수 있다. 아니면 ~/.aws/credentials 파일에 [default] 를 설정해 둬도 된다.
이제 생성한 docker image 를 ECR 에 push 하면 된다. 보통은 계정을 하나만 사용하니까 매번 치기 귀찮다. ~/.aws/credentials 에 default 로 자신의 access 정보를 저장해두자. 
```
$ docker images
$ docker tag http4s-test-app:0.0.1-SNAPSHOT <registry_id>.dkr.ecr.ap-northeast-2.amazonaws.com/yaboong/http4s-test-app:latest
```
로 sbt docker plugin 으로 dockerizing 한 image 를 aws ecr repository uri 로 닉네임을 달아준다.

docker push 라는 docker 커맨드로 aws ecr 에 push 할건데, docker 커맨드에서 aws 접속정보를 알리가 없다. 그래서 aws cli 에서 로그인 한 상태가 유지 되도록 먼저 해준다.
Aws document 에는 아래와 같이 하라고 되어 있지만 이렇게 하면 제대로 안된다. 이유를 찾고있는데 잘 모르겠다.
```
$ aws ecr get-login --no-include-email --region ap-northeast-2
```

이유는 모르겠고 해결방법은 [Docker Forum](https://forums.docker.com/t/docker-push-to-ecr-failing-with-no-basic-auth-credentials/17358) 에서 겨우 찾았는데
```
$ eval $(aws ecr get-login --no-include-email | sed 's|https://||')
```
이렇게 해주면 Login Succeeded 가 화면에 출력된다. 이제 docker push 로 aws ecr 에 image 를 올릴 수 있다.

```
$ docker push <registry_id>.dkr.ecr.ap-northeast-2.amazonaws.com/yaboong/http4s-test-app:latest
```

```python
The push refers to repository [<registry_id>.dkr.ecr.ap-northeast-2.amazonaws.com/yaboong/http4s-test-app]
69086d6748c1: Pushed
cac7e31cf8c0: Pushed
af02c8032044: Pushed
875b1eafb4d0: Pushed
7ce1a454660d: Pushing [==============>                                    ]    137MB/461.2MB
d3b195003fcc: Pushed
92bd1433d7c5: Pushed
f0ed7f14cbd1: Pushed
b31411566900: Pushing [============>                                      ]  35.97MB/141.7MB
06f4de5fefea: Pushing [================>                                  ]  2.519MB/7.801MB
851f3e348c69: Pushing [=====================>                             ]  10.17MB/23.84MB
e27a10675c56: Waiting
```

이제 EB 에 방금 생성한 docker image 를 ECR 에서 가져와서 배포해보자.
일단 eb 환경을 하나 생성하자. AWS management console (web) 에서 해도 되고 cli 로 해도 되는데 그냥 웹에서 하는 게 편하더라. 아무튼 플랫폼은 Docker 로 생성한다. 


#### Deployment
Tomcat 환경의 eb 에서는 .war 파일을 업로드 하면 됐었는데 Docker 환경에서는 Dockerrun.aws.json 파일을 하나 작성해서 .zip 파일로 업로드 하면 된다. 

```
$ vi Dockerrun.aws.json
```

```
{
  "AWSEBDockerrunVersion": "1",
  "Image": {
    "Name": "<registry_id>.dkr.ecr.ap-northeast-2.amazonaws.com/yaboong/http4s-test-app",
    "Update": "true"
  },
  "Ports": [
    {
      "ContainerPort": "8080"
    }
  ]
}
```


> 주의할 점 1 - 폴더를 압축하는 것이 아니라 Dockerrun.aws.json 파일 하나만 압축해서 올려야 한다.

> 주의할 점 2 - Elastic Beanstalk 의 권한에 AmazonEC2ContainerRegistryReadOnly 를 추가해줘야 한다.

###### 주의할점 2 - 부연설명
EB 관리도구 화면에서 생성한 환경 마다 가질 수 있는 권한이 있다. 이 권한은 '환경이름' > 구성 > 인스턴스 설정 아이콘 > 인스턴스 프로파일 에 설정되어 있다.
Default 는 aws-elasticbeanstalk-ec2-role 로 설정이 되는데, 기본으로 가지는 role 에는 ECR 접속 권한이 없기 때문에 Dockerrun.aws.json.zip 파일을 올려
deploy 를 하더라도 eb 에서 docker image 를 가져올 수 없다. aws-elasticbeanstalk-ec2-role 에 AmazonEC2ContainerRegistryReadOnly 를 추가해 줘도 되고 새롭게 role 을 생성해서 같은 권한을 추가해줘도 된다.

권한 추가는 IAM Management Console > 역할 에서 수정하고자 하는 role 을 선택하고 '정책연결' 로 AmazonEC2ContainerRegistryReadOnly 를 추가해 주면 된다. 


#### 최종 결과

> https://your-env-name.your-region.elasticbeanstalk.com/hello/anything

![](/yaboong-blog-static-resources/http4s/aws-eb-docker-deploy-complete.png)


#### 뭘 좀 더 해볼까
일단 엄청난 트래픽의 hello world 를 받을 수 있는 웹 애플리케이션이 하나 생겼다.
근데 과정이 너무 복잡하고 비효율적이다.

sbt 로 docker image 생성 -> image ecr push -> Dockerrun.aws.json 생성 -> eb deploy

과정을 단순화 하고 자동화 할 수 있는 것이 있는지 알아보고 수정 해 봐야겠다.
그리고 같은 기능을 하는 다른 프레임워크로 구성 된 여러 웹 애플리케이션을 만들어서 성능 테스트를 한번 해 봐야겠다.



