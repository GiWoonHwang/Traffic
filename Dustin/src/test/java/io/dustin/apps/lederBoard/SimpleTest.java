package io.dustin.apps.lederBoard;

import io.dustin.apps.leaderBoard.service.RankingService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.time.Duration;
import java.time.Instant;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

@SpringBootTest
public class SimpleTest {

    @Autowired
    private RankingService rankingService;

    @Test
    void getRanks() {

        // 최초 연결시 네트워크 비용이 더 발생하기 때문에, 첫 호출로 한번 실행시키는 코드
        rankingService.getTopRank(1);

        // 1) Get user_100's rank
        Instant before = Instant.now();
        Long userRank = rankingService.getUserRanking("user_100");
        Duration elapsed = Duration.between(before, Instant.now());

        // 100만명의 유저중 특정 유저의 랭킹 조회
        // 2 ms
        System.out.println(String.format("Rank(%d) - Took %d ms", userRank, elapsed.getNano() / 1000000));

        // 2) Get top 10 user list
        before = Instant.now();
        List<String> topRankers = rankingService.getTopRank(10);
        elapsed = Duration.between(before, Instant.now());

        // 100만명의 유저중 상위 10명 유저 조회
        // 0 ms
        System.out.println(String.format("Range - Took %d ms", elapsed.getNano() / 1000000));
    }

//    @Test
//    void insertScore() {
//        for(int i=0; i<1000000; i++) {
//            int score = (int)(Math.random() * 1000000); // 0 ~ 999999
//            String userId = "user_" + i;
//
//            rankingService.setUserScore(userId, score);
//        }
//    }

    // 자바의 ArrayList에 값을 추가하고 정렬을 했을 때 걸리는 시간 측정, 100만개 데이터 삽입
    // 약 175 ms
    @Test
    void inMemorySortPerformance() {
        ArrayList<Integer> list = new ArrayList<>();
        for(int i=0; i<1000000; i++) {
            int score = (int)(Math.random() * 1000000); // 0 ~ 999999
            list.add(score);
        }

        Instant before = Instant.now();
        Collections.sort(list); // nlogn
        Duration elapsed = Duration.between(before, Instant.now()); // 정렬 전 시간과 현재 시간의 차이
        System.out.println((elapsed.getNano() / 1000000) + " ms"); // 나노초로 받아오기 때문에 1000000으로 나누어 준다.
    }
}
