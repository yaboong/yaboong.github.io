---
layout: post
title: "스프링 카프카 Batch Consumer - 의도치 않은 리스너 호출"
date: 2020-06-07
banner_image: kafka.png
categories: [spring]
tags: [spring, kafka]
---

### 개요
* 스프링 카프카 배치 컨슈머를 사용하는데, 의도하지 않은 @KafkaListener 호출이 발생했다.
* 그래서 스프링 카프카 코드를 까봤는데 뭔가 발견한 것 같아 정리해본다.


<!--more-->

<br/>

### TL;DR
* spring kafka batch consumer 를 사용할때 누적 메시지 사이즈나 레코드 개수를 기준으로 가져오는 것이 아닌,
일정한 시간간격을 가지고 읽어들이고 싶은 경우에
* @KafkaListener 메서드의 호출은 (최대), 카프카 클러스터를 구성하는 브로커 개수만큼 발생할 수 있다.
* 백그라운드에서 무한루프를 돌면서 polling 을 하고 있는데, 노드별로 비동기로 fetch 요청을 보내기 때문이다.
* spring kafka 2.3 버전이후부터 제공되는 ContainerProperties 의 `idleBetweenPolls` 값으로 해결할 수 있다.

> 아래부터는 파악하는 과정을 적어 보았다

### 사용버전
* java 11
* spring boot 2.2.6.RELEASE
* spring kafka 2.3.7.RELEASE
* apache kafka client  2.3.1

### 배경
hive 로 적재하는 consumer group 하나가 있고, 같은 topic 에 붙어서 통계수치를 집계하는 다른 consumer group 을 추가해야할 일이 생겼다.

30초 간격으로 (나중에는 10초로 바꿨다) 메시지들을 가져와서 group_no (각 메시지들을 그룹핑 할 수 있는 기준 값) 를 기준으로 집계하여 통계DB 를 업데이트하는 작업이었다.

### 하고자 했던 것
* 30초에 1회 `@KafkaListener` 메서드가 호출되도록 설정한다.
* 받아온 메시지들을 각각 group_no 를 기준으로  grouping 한다.
* 같은 group_no 로 들어온 메시지들이 몇개인지 DB 에 업데이트를 한다.

비교적 간단한 작업이었다. 근데 kafka 는 처음이라 좀 오래 걸렸다. (아직 쪼렙이라 다 처음이다 ^____^)

### 하고자 했던 것을 하기위해
아래와 같은 설정값을 사용하였다.
```
spring.kafka.consumer.max-poll-records=30000
spring.kafka.consumer.fetch-min-size=4MB
spring.kafka.consumer.fetch-max-wait=30s
spring.kafka.properties.request.timeout.ms=40000
```

> TODO 각 설정값 설명

* AbstractKafkaListenerContainerFactory 의 batchListener 설정을 true 로
* ContainerProperties.AckMode.BATCH 사용

코드는 아래와 같다.
(리스너에서 MyLogType 에 바로 매핑시킬 수 있도록 MyLogType 은 org.apache.kafka.common.serialization.Deserializer 를 구현했다)

```java
@KafkaListener(topics = "${spring.kafka.template.default-topic}")
public Integer onMessage(ConsumerRecords<String, MyLogType> consumerRecords) {
    StreamSupport.stream(consumerRecords.spliterator(), false)
                 .map(ConsumerRecord::value)
                 .filter(Objects::nonNull)
                 .filter(MyLogType::isCountable)
                 .collect(groupingBy(MyLogType::getGroupNo, counting()))
                 .forEach(repository::updateCount);
    return consumerRecords.count();
}
```

> TODO 코드설명 간단히

> TODO 내로잘 캡처사진

> TODO 운영에 올렸더니 (배포시 실제 DB 업데이트는 하지 않고, 로그만 찍도록 해서 배포해봤다) 캡처사진

> TODO 이게 왜 문제가 되냐 -> forEach, partition 마다 같은 group_no 가 있는데.. 분산된다

> TODO 현재는 round-robin 으로 던지는데, 같은 key 를 가지는 메시지는 같은 파티션으로 가기 때문에, producer 에서 key 를 줘서 던질수도 있겠다. 하지만, group_no 마다 들어오는 메시지수가 일정하지 않고, 어떤 것은 엄청 많고 어떤것은 거의 없고 그렇다. 그래서 특정 partition 메시지가 쏠릴수 있다.

> TODO 아무리 찾아도 안나와서 직접 소스를 까봤다.

> TODO 시퀀스 다이어그램

> TODO pseudo code

> TODO spring code 캡처








### 참고한 자료
* {% include href.html text="" url="" %}
