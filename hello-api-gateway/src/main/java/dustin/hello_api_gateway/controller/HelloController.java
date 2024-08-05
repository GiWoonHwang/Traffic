package dustin.hello_api_gateway.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HelloController {

    /**
     * /microservice-hello 엔드포인트에 대한 GET 요청을 처리합니다.
     * 이 메서드는 클라이언트가 /gateway-hello 경로로 요청을 보낼 때 호출됩니다.
     *
     * @return "Hello, World!" 문자열 응답
     */
    @GetMapping("/microservice-hello")
    public String hello() {
        return "Hello, World!";
    }

    /**
     * /hello 엔드포인트에 대한 GET 요청을 처리합니다.
     * 이 메서드는 클라이언트가 /hello 경로로 직접 요청을 보낼 때 호출됩니다.
     *
     * @return "Hello from /hello endpoint!" 문자열 응답
     */
    @GetMapping("/hello")
    public String helloDirect() {
        return "Hello from /hello endpoint!";
    }

    /**
     * /header-info 엔드포인트에 대한 GET 요청을 처리합니다.
     * 요청 헤더에 포함된 "role" 헤더 값을 반환합니다.
     *
     * @param role 요청 헤더의 "role" 값
     * @return 헤더 정보가 포함된 문자열 응답
     */
    @GetMapping("/header-info")
    public String headerInfo(@RequestHeader("role") String role) {
        return "Received role: " + role;
    }

    /**
     * /fallback 엔드포인트에 대한 GET 요청을 처리합니다.
     * 서킷 브레이커의 폴백(fallback)으로 사용됩니다.
     *
     * @return "Fallback response" 문자열 응답
     */
    @GetMapping("/fallback")
    public String fallback() {
        return "Fallback response";
    }
}
