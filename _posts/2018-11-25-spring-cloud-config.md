---
layout: post
title: "스프링 - Spring Cloud Config 예제"
date: 2018-11-25
banner_image: spring.png
categories: [spring-cloud]
tags: [spring-cloud, spring-cloud-config]
---

### 개요
* {% include href.html text="Spring Cloud Config" url="https://cloud.spring.io/spring-cloud-config/" %}
* 스프링 설정파일을 외부로 분리할 수 있는 스프링 클라우드 Config 에 대한 핸즈온 (Hands-On) 예제
<!--more-->


<br/>

### Spring Cloud Config 란
아래는 {% include href.html text="Spring Cloud Config" url="https://cloud.spring.io/spring-cloud-config/" %} 에 들어가면 나오는 설명 요약이다.
* Spring Cloud Config 는 분산 시스템에서 설정파일을 외부로 분리하는 것을 지원한다. 
* Spring Cloud Config 를 사용하면 외부 속성을 중앙에서 관리할 수 있다. 
* 스프링 애플리케이션은 물론, 다양한 애플리케이션에서 동일하게 설정파일을 사용할 수 있다. 
* 설정파일 구성의 기본은 git 을 사용한다.

필자의 수준으로 요약하면
스프링 프로젝트의 설정파일을 외부로 <mark>분리하여 다양한 환경에서 사용하도록 할 수 있고,
설정이 변경되었을 때 애플리케이션의 재배포 없이 적용가능하다</mark> 정도로 받아들였다. 

MSA 에서는 수많은 애플리케이션들이 생겨나게 되는데, 수많은 애플리케이션들의 설정파일을 한곳에서 중앙집중관리를 할 수 있도록 해주는 것이 장점인 것 같다.

<br/>

### TL;DR (Too Long; Didn't Read)
바로 예제 돌려보고 시작하길 원하는 사람은 아래 Repository 를 참고하면 된다.
* {% include href.html text="[Github] spring-cloud-config-server" url="https://github.com/yaboong/spring-cloud-config-server" %}
* {% include href.html text="[Github] spring-cloud-config-client" url="https://github.com/yaboong/spring-cloud-config-client" %}

<br/>

###### 잡생각
```
MSA(Micro Service Architecture: 마이크로 서비스 아키텍처) 
공부중에 Spring Cloud Netflix 와 Spring Cloud Config  알게됨

MSA 뭐 있나? 그냥 쪼개면 되는거아냐? 하고 무식한 생각을 했던 자신에 대한 반성과 함께...
참 무지하다 갈길이 멀다... 
Spring Cloud Netflix 도 하나씩 사용해봐야겠다.

애플리케이션을 잘게 쪼개면서 생기는 다양한 문제들 을 해결하기 위한 도구로
(로그관리, 모니터링, 부하분산, 써킷브레이킹, 상태파악 등등 갈길이 멀다..) 
자바진영에서는 Spring Cloud Netflix 를 많이 사용하는 것 같다.

MSA 를 공부하다보니... 최근(?)에 화두가 되는 
* CI / CD / Docker / Kubernetes
* ELK(ElasticSearch Logstash Kibana)
* TDD
* Spring Cloud / Spring Boot 
등등 다양한 기술들이 왜 그렇게 화두가 되는지 이제 아주 아주 아~~주 조금 알 것 같다. 
```
 

<br/>

### 살펴볼 내용
총 3가지를 만들 것이다.

1. Github Repository 에 설정파일 저장
2. Spring Cloud Config Server (이하 Config Server) - 설정파일 배달부
3. Spring Cloud Config Client (이하 Config Client) - 설정파일 사용자

클라이언트 앱이 기동할 때 사용하는 설정파일은 Config Server 에서 돌려준 설정파일을 사용할 것인데,
Config Server 에서 돌려줄 설정파일이 Github Repository 에 세팅해 둔 설정파일이 되도록 할 것이다.


<br/>

### 1. Github Repository 에 YAML 파일 저장
Github Repository 를 하나 파고 아래 두 파일을 만들어 저장한다.
YAML 파일이름의 경우 ${ApplicationName}-${EnvironmentName}.yml 로 해주는 것이 디폴트이다.
왜 그렇게 하는지는 아래 <mark>3. Spring Cloud Config Client</mark> 세팅에서 설명한다.

###### yaboong-dev.yml
```yaml
who:
  am:
    i: dev-yaboong
```

###### yaboong-live.yml
```yaml
who:
  am:
    i: live-yaboong
```

<br/>

### 2. Spring Cloud Config Server
##### 2-1. Dependency 추가
클라이언트에게 설정파일에 대한 요청을 반환해 때, 앞서 Github Repository 에 만들어 둔 설정파일을 반환하는 서버를 만들 차례다.
스프링 부트 프로젝트를 하나 생성하고 dependency 를 아래와 같이 설정해준다. 

```gradle
dependencies {
    implementation('org.springframework.cloud:spring-cloud-config-server')
}
```

<br/>

##### 2-2. Spring Cloud Config Server 설정파일 설정
<mark>src/main/resources/application.yml</mark> 파일을 아래와 같이 설정해준다. 
스프링 부트 프로젝트를 생성하면 자동으로 생성되는 application.properties 파일을 사용해도 되지만 YAML 파일이 타이핑을 덜 해도 돼서 좋다.

```yaml
spring:
  cloud:
    config:
      server:
        git:
          uri: https://github.com/yaboong/spring-cloud-config-repository
```

uri 에는 1번 단계에서 생성한 Github Repository 의 uri 를 적어준다.
환경변수로 SPRING_PROFILES_ACTIVE 를 별도 지정하지 않았다면 디폴트 설정파일인 application.yml 을 읽어 실행하게 된다.

(참고로 SPRING_PROFILES_ACTIVE 를 test 로 지정하고 실행하면 스프링 부트 앱 기동시 application-test.yml 파일을 찾아 실행한다)

<br/>

##### 2-3. YourApplication.java
스프링 부트 프로젝트를 생성하면 자동 생성되는 main() 함수가 담긴 클래스에 아래와 같이 <mark>@EnableConfigServer</mark> 어노테이션을 추가해준다.

```java
@SpringBootApplication
@EnableConfigServer
public class ConfigServerApplication {

    public static void main(String[] args) {
        SpringApplication.run(ConfigServerApplication.class, args);
    }
}
```

<br/>

##### 2-4. 실행
실행로그 중 Github 에 만들어둔 yaboong-dev.yml, yaboong-live.yml 파일을 가져와서 어딘가에 Add 해 두는 것을 볼 수 있다.

```bash
Adding property source: file:/var/folders/mz/7nk42g591rzd1v3x18ln5jpm0000gn/T/config-repo-8358493613395248430/yaboong-dev.yml
Adding property source: file:/var/folders/mz/7nk42g591rzd1v3x18ln5jpm0000gn/T/config-repo-8358493613395248430/yaboong-live.yml
```

<br/>

##### 2-5. 설정파일 가져오기
**yaboong-dev.yml**

```shell
$ curl -X GET http://localhost:8080/yaboong/dev
```

```json
{
  "name": "yaboong",
  "profiles": [
    "dev"
  ],
  "label": null,
  "version": "ad12fd3da589a62c58c095b4c84a87345e8972e9",
  "state": null,
  "propertySources": [
    {
      "name": "https://github.com/yaboong/spring-cloud-config-repository/yaboong-dev.yml",
      "source": {
        "who.am.i": "dev-yaboong"
      }
    }
  ]
}
```

**yaboong-live.yml**

```shell
$ curl -X GET http://localhost:8080/yaboong/live
```

```json
{
  "name": "yaboong",
  "profiles": [
    "live"
  ],
  "label": null,
  "version": "4d0b729cd29631d27f4ef68146c39beddd21572d",
  "state": null,
  "propertySources": [
    {
      "name": "https://github.com/yaboong/spring-cloud-config-repository/yaboong-live.yml",
      "source": {
        "who.am.i": "live-yaboong"
      }
    }
  ]
}
```

JSON 형태로 반환하기 때문에 다른 프레임워크나 언어로 된 애플리케이션에서도 가져다 쓸 수 있다.
이것으로 Github Repository 의 설정파일을 반환해주는 서버설정은 끝이다.


<br/>


### 3. Spring Cloud Config Client
이제 설정파일을 Config Server 로부터 받아와서 애플리케이션을 빌드할 클라이언트를 만들차례다.
Config Server 가 8080 포트를 사용중이므로 Config Client 는 8081 포트를 사용하도록 설정하겠다.

##### 3-1. Dependency 추가

```gradle
dependencies {
    implementation('org.springframework.boot:spring-boot-starter-web')
    implementation('org.springframework.cloud:spring-cloud-starter-config')
    implementation('org.springframework.boot:spring-boot-starter-actuator')
}
```

actuator 를 반드시 추가해주어야 한다.

<br/>

##### 3-2. Spring Cloud Config 클라이언트 설정파일 설정
서버의 경우 application.yml 만 사용했지만, 클라이언트의 경우 application.yml 이 아닌 다른 설정파일을 사용할 것이다.
bootstrap.yml 파일의 경우 스프링부트 앱 기동시 application.yml 보다 먼저 로드되므로 
<mark>src/main/resources/bootstrap.yml</mark> 파일의 설정정보를 아래와 같이 수정해준다.

```yaml
server:
  port: 8081

spring:
  application:
    name: yaboong
  cloud:
    config:
      uri: http://localhost:8080
```

<mark>server.port</mark> 값은 8081 에 Config Client 를 띄울것이라는 설정이고, Spring Cloud Config Client 와는 전혀 무관한 설정이다.
그냥 Config Server 가 8080 포트를 사용중이므로 충돌을 피하기 위함이다.

<mark>spring.application.name</mark> 값은 1번 단계에서 설정파일의 이름을 ${ApplicationName}-${EnvironmentName}.yml 으로 하는 것이 디폴트라고 한 것과 상관있다.

$SPRING_PROFILES_ACTIVE 값을 dev 로 설정한 경우, 위 설정을 바탕으로한다면 <mark>http://localhost:8080/yaboong/dev</mark> 의 설정을 읽어와 애플리케이션을 실행하게 된다.

<mark>spring.application.name</mark> 값을 yaboong 이 아닌 yb 로 한다면, 
http://localhost:8080 에 떠있는 Config Server 가 바라보고 있는 Github Repository 에 yb-dev.yml 파일이 있어야 한다.

<br/>

##### 3-3. 설정파일을 내용을 동적으로 반영할 컨트롤러 작성

아래와 같이 컨트롤러를 하나 만들어 준다. Github Repository 에 만들어둔 설정파일에서 who.am.i 값을 읽어와 반환하는 Rest Controller 이다.

```java
@RestController
@RefreshScope
public class ConfigClientController {

    @Value("${who.am.i}")
    private String identity;

    @GetMapping("/test")
    public String test() {
        return identity;
    }
}
```

포인트는 <mark>@RefreshScope</mark> 어노테이션이다.
이 어노테이션이 붙은 클래스에는 **특정행동** 수행시 변경된 설정파일의 설정이 애플리케이션의 재배포과정 없이 실시간으로 반영된다.

<br/>

##### 3-4. 설정파일 변경내용 반영을 위한 설정추가
Github Repository 의 설정파일을 변경하고 Push 하면 바로 설정이 반영되면 좋겠지만 그렇게 되지는 않는다.
직전 단계 (3-3) 에서 **특정행동** 수행시 라고 했는데, 설정파일이 변경되면 변경사항을 반영하기위해 <mark>Config Client</mark> 에 POST 요청을 하나 날려줘야 한다.

일단 아래와 같이 application.yml 파일을 설정해두고 애플리케이션을 실행시키고 어떻게 되는지 살펴보자.
```yaml
management:
  endpoints:
    web:
      exposure:
        include: refresh
```

위와 같이 설정해두면 http://localhost:8081/actuator/refresh 로 POST 요청을 보내면 설정파일을 새로 읽어들여서 애플리케이션이 재기동된다.

일단 클라이언트앱을 실행시켜보자. 실행시킬 때 SPRING_PROFILES_ACTIVE 값을 live 로 주고 실행시켜보자.
Github Repository 에 있는 yaboong-live.yml 설정파일을 읽어와 애플리케이션을 실행하게 될 것이다.

Intellij 에서 실행한다면, 우측상단의 Run 버튼 왼쪽의 YourApplication 을 클릭하고 Edit Configuration 으로 가서 Active profiles 값을 live 로 설정해주면 된다.

CLI 에서 실행한다면, build.gradle 파일을 아래와 같이 추가설정을 해주고 (환경변수로 지정해도 된다)
```gradle
bootRun {
    systemProperties = System.properties
}
```

프로젝트 디렉토리로 가서 아래와 같이 실행시켜도 된다.
```shell
$ gradle bootRun -Dspring.profiles.active=live
```

<br/>

##### 3-5. 실행
실행로그 중 첫 세줄이 중요하다.
```bash
Fetching config from server at : http://localhost:8080
Located environment: name=yaboong, profiles=[live], label=null, version=4d0b729cd29631d27f4ef68146c39beddd21572d, state=null
Located property source: CompositePropertySource {name='configService', propertySources=[MapPropertySource {name='configClient'}, MapPropertySource {name='https://github.com/yaboong/spring-cloud-config-repository/yaboong-live.yml'}]}
```

* Config Server 로 떠있는 http://localhost:8080 에서 설정을 가져온다.
* 가져올때는 http://localhost:8080/yaboong/live 로 요청을 보내 가져왔을 것이다.
* 실제로 가져온 파일은 https://github.com/yaboong/spring-cloud-config-repository/yaboong-live.yml 이다.

아래와 같이 /test 로 GET 요청을 보내면, Github Repository 에 있는 yaboong-live.yml 파일의 who.am.i 필드값을 반환하는 것을 확인할 수 있다.
(좀 더 정확히 말하면 Config Server 에 캐시해둔 yaboong-live.yml 파일이 되겠다)
```bash
$ curl -X GET http://localhost:8081/test
live-yaboong
```

<br/>

##### 3-6. Github Repository 의 설정파일 변경
yaboong-live.yml 파일의 내용을 변경하고 클라이언트 애플리케이션에 반영되는 것을 보자.

파일 내용을 간단하게 아래와 같이 수정하고 push 한다.

**yaboong-live.yml**
```yaml
who:
  am:
    i: live-yaboong, it's working!
```

이제 클라이언트 애플리케이션의 /actuator/refresh 로 POST 요청을 보내서 변경된 설정파일이 적용되도록 해보자.
```shell
$ curl -X POST http://localhost:8081/actuator/refresh
``` 

클라이언트 애플리케이션의 실행로그를 보고 있다면, POST 요청을 받자마자 설정파일을 Config Server 로부터 새로 받아와서 애플리케이션이 재시작 되는 것을 볼 수 있다.
변경된 설정의 경우 <mark>@RefreshScope</mark> 어노테이션이 적용되어 있는 클래스에만 적용된다.

이제 다시 /test 로 요청을 보내서 새로운 설정을 읽어왔는지 확인해보면

```bash
$ curl -X GET http://localhost:8081/test
live-yaboong, it's working!
```

<br/>

이렇게 Spring Cloud Config 에 대한 헬로월드는 마무리... 신기하당

<br/>





### 참고한 자료
* {% include href.html text="[spring.io] Spring Cloud Config" url="https://cloud.spring.io/spring-cloud-config/" %}
* {% include href.html text="[cloud.spring.io] spring-cloud-config document" url="http://cloud.spring.io/spring-cloud-static/spring-cloud-config/2.1.0.M3/" %}

