package io.dustin.kafka.prc2;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.kafka.support.SendResult;
import org.springframework.stereotype.Service;
import org.springframework.util.concurrent.ListenableFuture;
import org.springframework.util.concurrent.ListenableFutureCallback;

@Service
public class KafkaProduceService {

    private static final String TOPIC_NAME = "dustin";

    // 템플릿을 이용해 메세지를 발생
    @Autowired
    private KafkaTemplate<String, String> kafkaTemplate;

    @Autowired
    private KafkaTemplate<String, MyMessage> newKafkaTemplate;

    // dto 객체를 json으로 전송
    public void sendJson(MyMessage message) {
        newKafkaTemplate.send(TOPIC_NAME, message);
    }

    public void send(String message) {
        kafkaTemplate.send(TOPIC_NAME, message);
    }

    public void sendWithCallback(String message) {

        // 결과를 얻는다
        ListenableFuture<SendResult<String, String>> future = kafkaTemplate.send(TOPIC_NAME, message);

        // addCallback을 브로커 전송 결과를 비동기로 확인한다.
        future.addCallback(new ListenableFutureCallback<SendResult<String, String>>() {
            // 실패했을 때
            @Override
            public void onFailure(Throwable ex) {
                System.out.println("Failed " + message + " due to : " + ex.getMessage());
            }

            // 성공했을 때
            @Override
            public void onSuccess(SendResult<String, String> result) {
                System.out.println("Sent " + message + " offset:"+result.getRecordMetadata().offset());
            }
        });
    }
}
