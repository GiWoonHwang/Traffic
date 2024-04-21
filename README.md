# Part3.Redis

## 환경
- Framework: SpringBoot 2.7.2
- Language: Java 8
- DataBase: MySQL@8.0
- Redis: 7.2

## 목차
* Redis 소개  
  * Redis 이해하기


* Redis Data Type


* 분산환경에서 세션 스토어 만들기
    * 세션이란
    * Spring Boot에서의 세션 관리
    * Redis를 사용한 세션 클러스터링


* 캐싱
    * Redis를 사용한 캐싱
    * Spring Boot의 캐싱 기능을 활용한 비즈니스 로직 구현


* 리더보드 만들기
    * Sorted-Set을 이용한 리더보드 구현


* Pub-Sub을 이용한 채팅방 기능 만들기
    * Pub-Sub 이해하기
    * 채팅방 만들기
  

* Redis 백업과 장애 복구 이용한 채팅방 기능 만들기
  * RDB
  * AOF
  * 복제
  * Sentinel을 이용한 장애조치


* Redis 클러스터
  * 클러스터 이해하기
  * 클러스터 구성하기


* Redis 성능 튜닝
  * Eviction 정책
  * 시스템 튜닝
  * SLOWLOG를 이용한 쿼리 튜닝


* Redis Streams을 이용한 Event-Driven 아키텍쳐
  * Redis Streams 이해하기
  * Redis Streams을 이용한 이벤트 기반 통신 개발


* 글로벌 서비스를 위한 Active-Active Architecture
  * Active-Active Architecture 구성하기 
  * CRDTs로 데이터 충돌 최소화 하기
  * Docker를 사용해 Active-Active 아키텍처 구성해보기



[Write 성능측정 확인하기](./Write.test.md)

[Read 성능측정 확인하기](./Read.test.md)
