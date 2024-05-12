package io.dustin.kafka.prc1;

import org.apache.kafka.clients.consumer.ConsumerConfig;
import org.apache.kafka.clients.consumer.ConsumerRecord;
import org.apache.kafka.clients.consumer.ConsumerRecords;
import org.apache.kafka.clients.consumer.KafkaConsumer;
import org.apache.kafka.common.serialization.StringDeserializer;

import java.time.Duration;
import java.util.Arrays;
import java.util.Properties;

public class Consumer1 {

    private final static String BOOTSTRAP_SERVER = "localhost:9092";

    private final static String TOPIC_NAME = "dustin";

    private final static String GROUP_ID = "group_one";

    public static void main(String args []) {

        Properties configs = new Properties();
        configs.put(ConsumerConfig.BOOTSTRAP_SERVERS_CONFIG, BOOTSTRAP_SERVER);
        configs.put(ConsumerConfig.KEY_DESERIALIZER_CLASS_CONFIG, StringDeserializer.class.getName());
        configs.put(ConsumerConfig.VALUE_DESERIALIZER_CLASS_CONFIG, StringDeserializer.class.getName());

        // 컨슈머를 구분하기 위해 group_id 추가
        configs.put(ConsumerConfig.GROUP_ID_CONFIG, GROUP_ID);

        // earliest 설정함으로서 처음 메세지부터 읽어온다.
        configs.put(ConsumerConfig.AUTO_OFFSET_RESET_CONFIG, "earliest");

        // 인스턴스 생성
        KafkaConsumer<String, String> consumer = new KafkaConsumer<>(configs);
        // 토픽 이름 지정
        consumer.subscribe(Arrays.asList(TOPIC_NAME));

        // 반복문을 통해 주기적으로 폴링으로 메세지 컨슘
        while(true){
            ConsumerRecords<String, String> records = consumer.poll(Duration.ofSeconds(1));

            for(ConsumerRecord<String, String> record : records) {
                System.out.println(">>>" + record);
                System.out.println(">>>>" + record.value());
            }
        }
    }
}
