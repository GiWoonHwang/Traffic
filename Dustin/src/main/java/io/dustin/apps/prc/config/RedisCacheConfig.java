package io.dustin.apps.prc.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.cache.CacheKeyPrefix;
import org.springframework.data.redis.cache.RedisCacheConfiguration;
import org.springframework.data.redis.cache.RedisCacheManager;
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.data.redis.serializer.RedisSerializationContext;
import org.springframework.data.redis.serializer.StringRedisSerializer;

import java.time.Duration;
import java.util.HashMap;

@Configuration
public class RedisCacheConfig {
    @Bean
    public RedisCacheManager cacheManager(RedisConnectionFactory connectionFactory) {
        RedisCacheConfiguration configuration = RedisCacheConfiguration.defaultCacheConfig() //RedisCacheConfiguration 을 retur한다.
                .disableCachingNullValues()
                .entryTtl(Duration.ofSeconds(10))   // 기본 TTL, 캐시 유효시간
                .computePrefixWith(CacheKeyPrefix.simple())
                .serializeKeysWith(
                        RedisSerializationContext.SerializationPair.fromSerializer(new StringRedisSerializer())
                );

        HashMap<String, RedisCacheConfiguration> configMap = new HashMap<>();
        configMap.put("userAgeCache", RedisCacheConfiguration.defaultCacheConfig() // userAgeCache에 대해서는 defaultCacheConfig를 설정한다.
                .entryTtl(Duration.ofSeconds(5)));  // 특정 캐시에 대한 TTL

        return RedisCacheManager
                .RedisCacheManagerBuilder
                .fromConnectionFactory(connectionFactory)
                .cacheDefaults(configuration)
                .withInitialCacheConfigurations(configMap)
                .build();
    }
}
