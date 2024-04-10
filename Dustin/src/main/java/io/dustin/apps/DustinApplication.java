package io.dustin.apps;

import io.dustin.apps.chat.ChatService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.annotation.EnableCaching;

// 커맨드라인 실행을 위한 CommandLineRunner 인터페이스 구현
@EnableCaching
@SpringBootApplication
public class DustinApplication implements CommandLineRunner {

    @Autowired
    private ChatService chatService;

    public static void main(String[] args) {
        SpringApplication.run(DustinApplication.class, args);
    }

    @Override
    public void run(String... args){
        System.out.println("Application started");

        // chat1이라는 pub을 구독한다.
        chatService.enterCharRoom("chat1");

    }

}
