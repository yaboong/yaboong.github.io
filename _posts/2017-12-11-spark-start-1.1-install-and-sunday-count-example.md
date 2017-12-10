---
layout: post
title: Spark 시작하기 1.1 - 설치 및 간단한 예제
category: spark
tags: [scala, spark]
excerpt: "Spark 시작하기 - date string 을 가진 txt file 에서 일요일이 몇개인지 구하는 스파크 hello world"
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


## plugins.sbt 편
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


## Error
혹시 프로그램을 실행하는 중 `Service 'sparkDriver' could not bind on port` 에러가 뜬다면 ~/.bash_profile 에 `export SPARK_LOCAL_IP=127.0.0.1` 를 추가하고 실행하면 로컬 머신에서는 잘 작동하는 것을 확인 할 수 있다.
