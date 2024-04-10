package io.dustin.apps.prc.service;

import org.springframework.stereotype.Service;

@Service
public class ExternalApiService {

    public String getUserName(String userId) {
        // 외부 서비스나 DB 호출 예시
        try {
            Thread.sleep(500);
        } catch (InterruptedException e) {

        }

        System.out.println("Getting user name from other service");

        if(userId.equals("A")) {
            return "Dustin";
        }

        if(userId.equals("B")) {
            return "Tom";
        }

        return "";

    }

    public int getUserAge(String userId) {
        // 외부 서비스나 DB 호출 예시
        try {
            Thread.sleep(500);
        } catch (InterruptedException e) {

        }

        System.out.println("Getting user age from other service");

        if(userId.equals("A")) {
            return 27;
        }

        if(userId.equals("B")) {
            return 25;
        }

        return 0;

    }
}
