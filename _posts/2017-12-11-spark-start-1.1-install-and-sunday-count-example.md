---
layout: post
title: "Spark 시작하기 1.1 - 설치 및 간단한 예제"
date: 2017-12-11
banner_image:
tags: [scala, spark]
---

## 소스 받기
> $ git pull [https://github.com/yaboong/spark-study-project.git](https://github.com/yaboong/spark-study-project)


## 개요
%Y%m%d (20171210) 형식의 date string 을 가진 .txt 파일을 input 으로 받아 각 date string 을 가지고 있는 line 을 
Date 오브젝트로 변환후 joda time 으로 무슨 요일인지 알아내고, 일요일의 총 개수를 카운트 하는 프로그램.


## 로컬 머신에 스파크 설치
java 와 scala 는 설치되어 있다는 가정하에 spark 설치는 아래와 같이 간단하다.
```bash
$ brew install apache-spark
```
설치를 완료한 후 spark-shell 명령어를 쳤을 때 아래와 같이 뜨면 제대로 설치가 된 것이다.
```bash
$ spark-shell
Welcome to
      ____              __
     / __/__  ___ _____/ /__
    _\ \/ _ \/ _ `/ __/  '_/
   /___/ .__/\_,_/_/ /_/\_\   version 2.2.0
      /_/

Using Scala version 2.11.8 (Java HotSpot(TM) 64-Bit Server VM, Java 1.8.0_121)
Type in expressions to have them evaluated.
Type :help for more information.

scala>
```
<!--more-->


## 로컬 머신에 스파크 프로젝트 생성
> [https://github.com/holdenk/sparkProjectTemplate.g8](https://github.com/holdenk/sparkProjectTemplate.g8)

```bash
sbt new holdenk/sparkProjectTemplate.g8
```
위 프로젝트 템플릿 뿐만 아니라 giter8 을 사용하면 sbt 를 사용하는 프로젝트를 스켈레톤을 간단하게 생성할 수 있다.
[https://github.com/foundweekends/giter8/wiki/giter8-templates](https://github.com/foundweekends/giter8/wiki/giter8-templates) 참고.



## build.sbt 편집 - libraryDependencies 설정
spark 라이브러리와 일요일을 판단하기 위해 joda-time 라이브러리를 사용할 것 이므로 build.sbt 의  libraryDependencies 를 아래와 같이 설정 해 준다.
```scala
libraryDependencies ++= Seq(
      "org.scalatest" %% "scalatest" % "3.0.1" % "test",
      "org.scalacheck" %% "scalacheck" % "1.13.4" % "test",
      "com.holdenkarau" %% "spark-testing-base" % "2.2.0_0.7.2" % "test",
      "joda-time" % "joda-time" % "2.8.2",
      "org.apache.spark" % "spark-core_2.11" % "2.2.0" % "provided"
    )
```
* libraryDependencies 에는 sbt 가 자동 관리하는 프로젝트가 의존하는 라이브러리가 구체적으로 무엇인지 설정하는데, 해당 라이브러리가 빌드 과정 중 어느 시점에 의존할지 설정한다. (예를들어, 컴파일할 때 또는 패키징 할 때 의존관계를 가지도록 다르게 설정 할 수 있다)
* 하나의 의존 라이브러리는 "\<groupID\>" % "\<artifactID\>" % "\<version\>" % "\<configuration\>" 형식으로 기술한다.
* [http://search.maven.org/](http://search.maven.org/) 참고
* <configuration> 은 해당 라이브러리가 빌드 과정 중 어느 단계에 의존하는지 설정하는 항목이다. 애플리케이션의 컴파일 단계에 필요한 라이브러리나, 어셈블리 JAR 파일에 포함되는 라이브러리의 경우에는 굳이 설정할 필요는 없다.
* <configuration> 을 "provided" 로 설정하면, 애플리케이션의 컴파일 단계에는 클래스패스에 포함되지만, sbt-assembly 를 이용한 패키지 단계에는 어셈블리 JAR 에 포함되지 않는다는 의미이다.
* 애플리케이션이 spark-core 2.11 에 의존하고 있음에도 불구하고 어셈블리 JAR 에 포함하지 않아도 되는 이유는 spark-core 2.11 에 들어있는 클래스 파일이 스파크 본체에 포함되기 때문이다. 애플리케이션이 실행 될 때 자동으로 스파크 본체에 포함된 클래스 파일을 참조하므로 어셈블리 JAR 에 포함할 필요가 없다.

## build.sbt 편집 - assemblyOption 설정
assemblyOption 항목은 sbt-assembly 플러그인을 사용하기 위한 옵션 설정이다. sbt-assembly 플러그인으로 어셈블리 JAR 파일을 작성할 경우, 기본적으로 스칼라 라이브러리도 피요하다  이 라이브러리도 스파크 본체에 들어 있으므로 어셈블리 JAR 파일에 포함할 필요가 없고, 샘플 프로젝트의 정의 파일에도 포함하지 않도록 설정 `(includeScala=false)` 한다.
```scala
assemblyOption in assembly := (assemblyOption in assembly).value.copy(includeScala = false)
```


## plugins.sbt 편집
sbt-assembly 플러그인을 사용하려면 plugins.sbt 에 아래와 같이 추가해 준다.
```scala
addSbtPlugin("com.eed3si9n" % "sbt-assembly" % "0.13.0")
```


## 예제코드
> SundayCount.scala

```scala
package com.yaboong.spark

import org.apache.spark.{SparkConf, SparkContext}
import org.joda.time.format.DateTimeFormat
import org.joda.time.{DateTime, DateTimeConstants}

object SundayCount {
  def main(args: Array[String]): Unit = {
    if (args.length < 1) {
      throw new IllegalArgumentException("명령 인수에 날짜가 기록된 파일의 경로를 지정해 주세요")
    }

    val filePath = args(0)
    val conf = new SparkConf()
    val sc = new SparkContext(conf)

    try {
      val textRDD = sc.textFile(filePath)

      val dateTimeRDD = textRDD.map { dateStr =>
        val pattern = DateTimeFormat.forPattern("yyyyMMdd")
        DateTime.parse(dateStr, pattern)
        }

      val sundayRDD = dateTimeRDD.filter { dateTime =>
        dateTime.getDayOfWeek == DateTimeConstants.SUNDAY
      }

      val numOfSunday = sundayRDD.count
      println(s"주어진 데이터에는 일요일이 ${numOfSunday}개 들어 있습니다")
    } finally {
      sc.stop()
    }
  }
}

```


## 빌드
```bash
$ cd "your project root"
$ sbt assembly
```
* 빌드가 성공하면 프로젝트의 루트 디렉터리 아래 target 디렉터리가 만들어지고, 그 밑으로 scala-${scalaVersion} 디렉터리와 그 아래 .jar 파일이 생성된다.
* 어셈블리 JAR 파일의 이름은 `build.sbt` 의 name 과 version 에 설정한 값으로 `\<name\>-assembly-\<version\>.jar` 라는 이름으로 생성된다.


## 실행
* Spark 애플리케이션의 실행에는 spark-submit 명령어를 사용한다.
```bash
$ spark-submit \ 
    --master <동작모드>
    --class <main 메서드가 구현된 애플리케이션의 클래스> \
    --name <애플리케이션의 이름> \
    <spark-submit 명령의 옵션> \
    애플리케이션의 클래스가 포함된 JAR 파일 \
    <애플리케이션에 넘기는 옵션 - args>
```

* 프로그램 실행 예시
```bash
$ spark-submit --master local --class com.yaboong.spark.SundayCount target/scala-2.11/spark-study-project-assembly-0.0.1.jar resource/test_small_data.txt
```


## 실행결과
```java
$ spark-submit --master local --class com.yaboong.spark.SundayCount target/scala-2.11/spark-study-project-assembly-0.0.1.jar resource/test_small_data.txt
Using Spark's default log4j profile: org/apache/spark/log4j-defaults.properties
17/12/11 03:00:40 INFO SparkContext: Running Spark version 2.2.0
17/12/11 03:00:40 WARN NativeCodeLoader: Unable to load native-hadoop library for your platform... using builtin-java classes where applicable
17/12/11 03:00:41 INFO SparkContext: Submitted application: com.yaboong.spark.SundayCount
17/12/11 03:00:41 INFO SecurityManager: Changing view acls to: yaboong
17/12/11 03:00:41 INFO SecurityManager: Changing modify acls to: yaboong
17/12/11 03:00:41 INFO SecurityManager: Changing view acls groups to:
17/12/11 03:00:41 INFO SecurityManager: Changing modify acls groups to:
17/12/11 03:00:41 INFO SecurityManager: SecurityManager: authentication disabled; ui acls disabled; users  with view permissions: Set(yaboong); groups with view permissions: Set(); users  with modify permissions: Set(yaboong); groups with modify permissions: Set()
17/12/11 03:00:41 INFO Utils: Successfully started service 'sparkDriver' on port 50747.
17/12/11 03:00:41 INFO SparkEnv: Registering MapOutputTracker
17/12/11 03:00:41 INFO SparkEnv: Registering BlockManagerMaster
17/12/11 03:00:41 INFO BlockManagerMasterEndpoint: Using org.apache.spark.storage.DefaultTopologyMapper for getting topology information
17/12/11 03:00:41 INFO BlockManagerMasterEndpoint: BlockManagerMasterEndpoint up
17/12/11 03:00:41 INFO DiskBlockManager: Created local directory at /private/var/folders/mz/7nk42g591rzd1v3x18ln5jpm0000gn/T/blockmgr-97df123e-30af-4bad-812a-e74c1429a79e
17/12/11 03:00:41 INFO MemoryStore: MemoryStore started with capacity 366.3 MB
17/12/11 03:00:41 INFO SparkEnv: Registering OutputCommitCoordinator
17/12/11 03:00:41 INFO Utils: Successfully started service 'SparkUI' on port 4040.
17/12/11 03:00:41 INFO SparkUI: Bound SparkUI to 127.0.0.1, and started at http://127.0.0.1:4040
17/12/11 03:00:41 INFO SparkContext: Added JAR file:/Users/yaboong/DevWorkspace/etc-workspace/spark-study-project/target/scala-2.11/spark-study-project-assembly-0.0.1.jar at spark://127.0.0.1:50747/jars/spark-study-project-assembly-0.0.1.jar with timestamp 1512928841680
17/12/11 03:00:41 INFO Executor: Starting executor ID driver on host localhost
17/12/11 03:00:41 INFO Utils: Successfully started service 'org.apache.spark.network.netty.NettyBlockTransferService' on port 50748.
17/12/11 03:00:41 INFO NettyBlockTransferService: Server created on 127.0.0.1:50748
17/12/11 03:00:41 INFO BlockManager: Using org.apache.spark.storage.RandomBlockReplicationPolicy for block replication policy
17/12/11 03:00:41 INFO BlockManagerMaster: Registering BlockManager BlockManagerId(driver, 127.0.0.1, 50748, None)
17/12/11 03:00:41 INFO BlockManagerMasterEndpoint: Registering block manager 127.0.0.1:50748 with 366.3 MB RAM, BlockManagerId(driver, 127.0.0.1, 50748, None)
17/12/11 03:00:41 INFO BlockManagerMaster: Registered BlockManager BlockManagerId(driver, 127.0.0.1, 50748, None)
17/12/11 03:00:41 INFO BlockManager: Initialized BlockManager: BlockManagerId(driver, 127.0.0.1, 50748, None)
17/12/11 03:00:42 INFO MemoryStore: Block broadcast_0 stored as values in memory (estimated size 236.5 KB, free 366.1 MB)
17/12/11 03:00:42 INFO MemoryStore: Block broadcast_0_piece0 stored as bytes in memory (estimated size 22.9 KB, free 366.0 MB)
17/12/11 03:00:42 INFO BlockManagerInfo: Added broadcast_0_piece0 in memory on 127.0.0.1:50748 (size: 22.9 KB, free: 366.3 MB)
17/12/11 03:00:42 INFO SparkContext: Created broadcast 0 from textFile at SundayCount.scala:22
17/12/11 03:00:42 INFO FileInputFormat: Total input paths to process : 1
17/12/11 03:00:42 INFO SparkContext: Starting job: count at SundayCount.scala:33
17/12/11 03:00:42 INFO DAGScheduler: Got job 0 (count at SundayCount.scala:33) with 1 output partitions
17/12/11 03:00:42 INFO DAGScheduler: Final stage: ResultStage 0 (count at SundayCount.scala:33)
17/12/11 03:00:42 INFO DAGScheduler: Parents of final stage: List()
17/12/11 03:00:42 INFO DAGScheduler: Missing parents: List()
17/12/11 03:00:42 INFO DAGScheduler: Submitting ResultStage 0 (MapPartitionsRDD[3] at filter at SundayCount.scala:29), which has no missing parents
17/12/11 03:00:42 INFO MemoryStore: Block broadcast_1 stored as values in memory (estimated size 3.5 KB, free 366.0 MB)
17/12/11 03:00:42 INFO MemoryStore: Block broadcast_1_piece0 stored as bytes in memory (estimated size 2.1 KB, free 366.0 MB)
17/12/11 03:00:42 INFO BlockManagerInfo: Added broadcast_1_piece0 in memory on 127.0.0.1:50748 (size: 2.1 KB, free: 366.3 MB)
17/12/11 03:00:42 INFO SparkContext: Created broadcast 1 from broadcast at DAGScheduler.scala:1006
17/12/11 03:00:42 INFO DAGScheduler: Submitting 1 missing tasks from ResultStage 0 (MapPartitionsRDD[3] at filter at SundayCount.scala:29) (first 15 tasks are for partitions Vector(0))
17/12/11 03:00:42 INFO TaskSchedulerImpl: Adding task set 0.0 with 1 tasks
17/12/11 03:00:42 INFO TaskSetManager: Starting task 0.0 in stage 0.0 (TID 0, localhost, executor driver, partition 0, PROCESS_LOCAL, 4914 bytes)
17/12/11 03:00:42 INFO Executor: Running task 0.0 in stage 0.0 (TID 0)
17/12/11 03:00:42 INFO Executor: Fetching spark://127.0.0.1:50747/jars/spark-study-project-assembly-0.0.1.jar with timestamp 1512928841680
17/12/11 03:00:42 INFO TransportClientFactory: Successfully created connection to /127.0.0.1:50747 after 30 ms (0 ms spent in bootstraps)
17/12/11 03:00:42 INFO Utils: Fetching spark://127.0.0.1:50747/jars/spark-study-project-assembly-0.0.1.jar to /private/var/folders/mz/7nk42g591rzd1v3x18ln5jpm0000gn/T/spark-1f60cc49-57f1-4eb7-a2d1-81affd8b386d/userFiles-b1dbde70-0d8b-4f05-98f6-482026da9499/fetchFileTemp1285813487153374630.tmp
17/12/11 03:00:42 INFO Executor: Adding file:/private/var/folders/mz/7nk42g591rzd1v3x18ln5jpm0000gn/T/spark-1f60cc49-57f1-4eb7-a2d1-81affd8b386d/userFiles-b1dbde70-0d8b-4f05-98f6-482026da9499/spark-study-project-assembly-0.0.1.jar to class loader
17/12/11 03:00:42 INFO HadoopRDD: Input split: file:/Users/yaboong/DevWorkspace/etc-workspace/spark-study-project/resource/test_small_data.txt:0+17
17/12/11 03:00:42 INFO Executor: Finished task 0.0 in stage 0.0 (TID 0). 875 bytes result sent to driver
17/12/11 03:00:43 INFO TaskSetManager: Finished task 0.0 in stage 0.0 (TID 0) in 318 ms on localhost (executor driver) (1/1)
17/12/11 03:00:43 INFO TaskSchedulerImpl: Removed TaskSet 0.0, whose tasks have all completed, from pool
17/12/11 03:00:43 INFO DAGScheduler: ResultStage 0 (count at SundayCount.scala:33) finished in 0.339 s
17/12/11 03:00:43 INFO DAGScheduler: Job 0 finished: count at SundayCount.scala:33, took 0.481286 s
주어진 데이터에는 일요일이 1개 들어 있습니다
17/12/11 03:00:43 INFO SparkUI: Stopped Spark web UI at http://127.0.0.1:4040
17/12/11 03:00:43 INFO MapOutputTrackerMasterEndpoint: MapOutputTrackerMasterEndpoint stopped!
17/12/11 03:00:43 INFO MemoryStore: MemoryStore cleared
17/12/11 03:00:43 INFO BlockManager: BlockManager stopped
17/12/11 03:00:43 INFO BlockManagerMaster: BlockManagerMaster stopped
17/12/11 03:00:43 INFO OutputCommitCoordinator$OutputCommitCoordinatorEndpoint: OutputCommitCoordinator stopped!
17/12/11 03:00:43 INFO SparkContext: Successfully stopped SparkContext
17/12/11 03:00:43 INFO ShutdownHookManager: Shutdown hook called
17/12/11 03:00:43 INFO ShutdownHookManager: Deleting directory /private/var/folders/mz/7nk42g591rzd1v3x18ln5jpm0000gn/T/spark-1f60cc49-57f1-4eb7-a2d1-81affd8b386d
```


## Error
혹시 프로그램을 실행하는 중 `Service 'sparkDriver' could not bind on port` 에러가 뜬다면 ~/.bash_profile 에 `export SPARK_LOCAL_IP=127.0.0.1` 를 추가하고 실행하면 로컬 머신에서는 잘 작동하는 것을 확인 할 수 있다.
