package io.dustin.apps.chat;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.data.redis.connection.RedisClusterConfiguration;
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.data.redis.connection.lettuce.LettuceConnectionFactory;
import org.springframework.data.redis.listener.RedisMessageListenerContainer;

import java.util.List;

/**
 * 여기 설정파일에 존재하는 LettuceConnectionFactory와 레디스 클러스터의 충돌이 발생함 원인 파악 필요
 * org.springframework.data.redis.RedisConnectionFailureException: Unable to connect to Redis; nested exception is io.lettuce.core.RedisConnectionException: Unable to connect to localhost/<unresolved>:6379
 */

@Configuration
public class RedisConfig {

    @Value("${spring.redis.cluster.nodes}")
    private List<String> clusterNodes;

    @Bean
    public RedisConnectionFactory redisConnectionFactory() {
//        return new LettuceConnectionFactory();

        // 레디스 클러스터 설정시 Lettuce를 사용하기 위해선 RedisClusterConfiguration에 node들을 넣어줘야 함
        RedisClusterConfiguration redisClusterConfiguration = new RedisClusterConfiguration(clusterNodes);
        return new LettuceConnectionFactory(redisClusterConfiguration);
    }

    // pub-sub 기능을 사용하기 위한 설정, 메세지 구독을 처리해주고 이에 대한 인터페이스를 컨테이너에 등록해서 수신된 메세지를 처리한다.
    // RedisMessageListenerContainer와 springSessionRedisMessageListenerContainer의 충돌이 발생하므로 @Primary를 통해 우선순위 부여
    @Bean
    @Primary
    RedisMessageListenerContainer redisContainer() {
        final RedisMessageListenerContainer container = new RedisMessageListenerContainer();
        container.setConnectionFactory(redisConnectionFactory());
        return container;
    }


}
