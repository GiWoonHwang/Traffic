package io.dustin.apps;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class DustinApplication {

    public static void main(String[] args) {
        SpringApplication.run(DustinApplication.class, args);
        System.out.println("test");
    }

}
