package io.dustin.kafka.prc2;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

@Component
public class KafkaConsumer {

    private static final String TOPIC_NAME = "dustin";

    ObjectMapper objectMapper = new ObjectMapper();

    // 받은 메세지를 dto 형식으로 변환
    @KafkaListener(topics = TOPIC_NAME)
    public void listenMessage(String jsonMessage) {
        try {
            MyMessage message = objectMapper.readValue(jsonMessage, MyMessage.class);
            System.out.println(">>>" + message.getName() + "," +message.getMessage());
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
