package io.dustin.apps.prc.controller;

import io.dustin.apps.prc.dto.UserProfile;
import io.dustin.apps.prc.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class ApiController {

    @Autowired
    private  UserService userService;

    /**
     * Cache-Aside 구현 해보지
     * 1. api를 호출하면 캐시를 조회하고 캐시에 없다면 외부서비스를 호출하여 데이터를 리턴한다.
     */
    @GetMapping("/users/{userId}/profile")
    public UserProfile getUserProfile(@PathVariable(value = "userId") String userId) {
        return userService.getUserProfile(userId);
    }
}
