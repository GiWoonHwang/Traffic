# Part6.Pinpoint

## 환경
- Framework: SpringBoot 3.2.8
- Language: Java 17

## 목차
* Docker를 통한 Pinpoint 설치
    ```shell
    git clone https://github.com/pinpoint-apm/pinpoint-docker.git
    cd pinpoint-docker
    docker-compose pull && docker-compose up -d
    ```


* Web/API Pinpoint Agent 추가해보기


* 의존성를 주입하여 Java App에 Pinpoint 연결
    ```shell
    -javaagent:$AGENT_PATH/pinpoint-bootstrap-$VERSION.jar
  -Dpinpoint.agentId: Pinpoint Agent가 실행 중인 앱의 식별자
  -Dpinpoint.applicationName: 실행 중인 앱의 그룹

    ```


