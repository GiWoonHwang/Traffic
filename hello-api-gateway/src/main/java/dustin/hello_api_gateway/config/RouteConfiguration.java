package dustin.hello_api_gateway.config;

import org.springframework.cloud.gateway.route.RouteLocator;
import org.springframework.cloud.gateway.route.builder.RouteLocatorBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RouteConfiguration {

    // 마이크로서비스가 실행 중인 호스트 URL을 상수로 정의
    public static final String MICROSERVICE_HOST_8080 = "http://localhost:8080";
    // 외부 API 서버 (httpbin.org)를 호출하는 데 사용될 URL을 상수로 정의
    public static final String ECHO_HTTP_BIN = "http://httpbin.org";

    /**
     * RouteLocator 빈을 정의하여 라우팅 설정을 구성합니다.
     *
     * @param builder RouteLocatorBuilder 인스턴스
     * @return RouteLocator 인스턴스
     */
    @Bean
    public RouteLocator helloRouteLocator(RouteLocatorBuilder builder) {
        return builder.routes()
                // "/gateway-hello" 경로로 들어오는 요청을 처리하는 라우트 정의
                .route("path_route_hello", r -> r.path("/gateway-hello")
                        .filters(f -> f.rewritePath("/gateway-hello", "/microservice-hello"))
                        .uri(MICROSERVICE_HOST_8080))
                // "/get" 경로로 들어오는 요청에 "role" 헤더를 추가하는 라우트 정의
                .route("add-header-route", r -> r.path("/get")
                        .filters(f -> f.addRequestHeader("role", "hello-api")
                                .addRequestHeader("X-Request-Id", "12345") // 추가 헤더 예시
                                .circuitBreaker(config -> config.setName("myCircuitBreaker")
                                        .setFallbackUri("forward:/fallback"))
                                .filter((exchange, chain) -> {
                                    exchange.getAttributes().put("org.springframework.cloud.gateway.support.TimeoutException", 2000);
                                    return chain.filter(exchange);
                                })) // 라우트별 타임아웃 설정
                        .uri(ECHO_HTTP_BIN))
                .build();
    }
}
