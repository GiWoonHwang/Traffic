package com.example.PaymentService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.connection.stream.MapRecord;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.data.redis.stream.StreamListener;
import org.springframework.stereotype.Component;

import java.util.HashMap;
import java.util.Map;

// 새로 발행된 이벤트를 실시간으로 수신한다.
@Component
public class OrderEventStreamListener implements StreamListener<String, MapRecord<String, String, String>> {

    int paymentProcessId = 0;

    @Autowired
    StringRedisTemplate redisTemplate;

    // 오더 이벤트를 수신했을 때, 받은 이벤트를 처리한다.
    @Override
    public void onMessage(MapRecord<String, String, String> message) {

        // 엔트리의 field와 value를 Map으로 받는다
        Map<String, String> map = message.getValue();

        String userId = (String) map.get("userId");
        String productId = (String) map.get("productId");
        String price = (String) map.get("price");

        // 결제 관련 로직 처리
        // ...

        // 결제가 처리될 때 마다 증가하는 값
        String paymentIdStr = Integer.toString(paymentProcessId++);

        // 결제 완료 이벤트 발행
        Map<String, String> fieldMap = new HashMap<>();
        fieldMap.put("userId", userId);
        fieldMap.put("productId", productId);
        fieldMap.put("price", price);
        fieldMap.put("paymentProcessId", paymentIdStr);

        redisTemplate.opsForStream().add("payment-events", fieldMap);

        System.out.println("[Order consumed] Created payment: " + paymentIdStr);
    }
}
