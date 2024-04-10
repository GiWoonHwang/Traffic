package io.dustin.apps.chat;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.data.redis.connection.lettuce.LettuceConnectionFactory;
import org.springframework.data.redis.listener.RedisMessageListenerContainer;

@Configuration
public class RedisConfig {

    @Bean
    public RedisConnectionFactory redisConnectionFactory() {
        return new LettuceConnectionFactory();
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
