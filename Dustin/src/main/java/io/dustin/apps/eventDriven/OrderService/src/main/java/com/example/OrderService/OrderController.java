package com.example.OrderService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
public class OrderController {

    @Autowired
    StringRedisTemplate redisTemplate;

    @GetMapping("/order")
    public String order(
            @RequestParam String userId,
            @RequestParam String productId,
            @RequestParam String price
    ) {
        // feild-value를 맵에 저장 후 엔트리에 추가한다.
        Map<String, String> fieldMap = new HashMap<>();
        fieldMap.put("userId", userId);
        fieldMap.put("productId", productId);
        fieldMap.put("price", price);

        // 스트림에 값을 추가한다. 이벤트 이름을 order-events
        redisTemplate.opsForStream().add("order-events", fieldMap);

        System.out.println("Order created.");
        return "ok";
    }
}
