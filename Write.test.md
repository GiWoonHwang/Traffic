# Spring Boot + MySQL Insert 성능 측정

## 사양
- CPU: Apple M3 11core
- MEMORY: 18G
- DISK: 512G

## Tool
- Spring Boot 2.7.2
- Java 16
- MySQL 8.0

## IntelliJ 메모리 설정
- Edit custom VM options: `-Xmx4096m`

## 성능 측정 결과

### 입력데이터 수: 1,000,000(100만)

#### 인덱스 설정 전
- 객체 생성 시간 : 7.251237875
- DB 인서트 시간 : 8.364204667

#### 인덱스 설정 후
- 객체 생성 시간 : 4.838371208
- DB 인서트 시간 : 10.574140917
