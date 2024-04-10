# Spring Boot + MySQL Read 성능 측정

## 사양
- CPU: Apple M3 11코어
- 메모리: 18GB
- 디스크: 512GB

## Tool
- Spring Boot 2.7.2
- Java 8
- Redis 7.4.2

## IntelliJ 메모리 설정
- 사용자 정의 VM 옵션 편집: `-Xmx4096m`

---

## 성능측정

1. LeaderBoard 유저 데이터 100만개 삽입 후 정렬
   * Redis 사용 전: 약 175 ms
   * Redis 사용 후
     * 100만명 중 1명에 대한 랭킹 조회: 약 2ms
     * 100만명 중 상위10명 랭킹 조회: 0ms

