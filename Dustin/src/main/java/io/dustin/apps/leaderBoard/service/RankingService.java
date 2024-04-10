package io.dustin.apps.leaderBoard.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.data.redis.core.ZSetOperations;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;

@Service
public class RankingService {

    private static final String LEADERBOARD_KEY = "leaderBoard";
    @Autowired
    StringRedisTemplate redisTemplate;

    public boolean setUserScore(String userId, int score) {
        // sortedSet을 위한 오퍼레이션
        ZSetOperations<String, String> zSetOps = redisTemplate.opsForZSet();
        zSetOps.add(LEADERBOARD_KEY, userId, score);

        return true;
    }

    // 특정유저 랭킹 조회
    public Long getUserRanking(String userId) {
        ZSetOperations<String, String> zSetOps = redisTemplate.opsForZSet();
        Long rank = zSetOps.reverseRank(LEADERBOARD_KEY, userId);

        return rank;
    }

    // 범위기반 조회, 몇위까지 보여줄지 parm으로 받는다.
    public List<String> getTopRank(int limit) {
        ZSetOperations<String, String> zSetOps = redisTemplate.opsForZSet();
        Set<String> rangeSet = zSetOps.reverseRange(LEADERBOARD_KEY, 0, limit - 1);

        return new ArrayList<>(rangeSet);
    }
}
