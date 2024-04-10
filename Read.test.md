# Spring Boot + MySQL Read 성능 측정

## 사양
- CPU: Apple M3 11코어
- 메모리: 18GB
- 디스크: 512GB

## Tool
- Spring Boot 2.7.2
- Java 16
- MySQL 8.0

## IntelliJ 메모리 설정
- 사용자 정의 VM 옵션 편집: `-Xmx4096m`

## 데이터 수
- 입력데이터 수: 3,000,000(300만)
    - memberId = 3인 데이터: 1,000,000(100만)
    - memberId = 4인 데이터: 2,000,000(200만)

## 성능 측정 결과
### 인덱스 설정 전
- 쿼리:
  ```sql
  SELECT createdDate, memberId, count(id) as count 
  FROM POST 
  WHERE memberId = 4 and createdDate  BETWEEN '1900-01-01' and '2023-01-01'
  GROUP BY  memberId, createdDate 
  ```
    - 조회 시간 : 0.54초

### 인덱스 설정 후
- 쿼리 [USE INDEX(POST__index_member_id )]:
  ```sql
    SELECT createdDate, memberId, count(id) as count
    FROM POST USE INDEX(POST__index_member_id )
    WHERE memberId = 4 and createdDate  BETWEEN '1900-01-01' and '2023-01-01'
    GROUP BY  memberId, createdDate;
  ```
    - 조회 시간 : 3.19초


- 쿼리 [USE INDEX(POST__index_created_date)]:
  ```sql
    SELECT createdDate, memberId, count(id) as count 
    FROM POST USE INDEX(POST__index_created_date)
    WHERE memberId = 4 and createdDate  BETWEEN '1900-01-01' and '2023-01-01'
    GROUP BY  memberId, createdDate;
  ```
    - 조회 시간 : 0.189초


- 쿼리 [USE INDEX(POST__index_member_id_created_date)]:
  ```sql
    SELECT createdDate, memberId, count(id) as count 
    FROM POST USE INDEX(POST__index_member_id_created_date)
    WHERE memberId = 4 and createdDate  BETWEEN '1900-01-01' and '2023-01-01'
    GROUP BY  memberId, createdDate;
  ```
    - 조회 시간 : 0.054초