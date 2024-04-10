package io.dustin.apps.prc.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpSession;

@RestController
public class LoginController {


    @GetMapping("/login")
    public  String Login(HttpSession session, @RequestParam String name) {
        // 세션에 파라미터로 들어온 name을 저장한다
        session.setAttribute("name",name);
        return "saved";

    }

    @GetMapping("/myName")
    public  String Login(HttpSession session) {
        String myName = (String)session.getAttribute("name");

        return myName;
    }
}
