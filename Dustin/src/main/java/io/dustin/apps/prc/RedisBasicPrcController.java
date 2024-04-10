package io.dustin.apps.prc;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.data.redis.core.ValueOperations;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class RedisBasicPrcController {

    @Autowired
    StringRedisTemplate redisTemplate; // 레디스의 스트링 처리

    @GetMapping("/setFruit")
    public String setFruit(@RequestParam String name) {
        /**
         * ValueOperations:  Redis의 String 타입 키와 값을 사용한 연산을 수행하는데 사용되는 인터페이스
         * opsForValue: ValueOperations의 인스턴스를 반환한다.
         */
        ValueOperations<String, String> ops = redisTemplate.opsForValue();

        ops.set("fruit",name);

        return "saved";
    }

    @GetMapping("/getFruit")
    public String getFruit() {
        ValueOperations<String, String> ops = redisTemplate.opsForValue();

        String fruitName = ops.get("fruit");

        return fruitName;
    }



}
