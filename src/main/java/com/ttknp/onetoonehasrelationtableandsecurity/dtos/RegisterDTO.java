package com.ttknp.onetoonehasrelationtableandsecurity.dtos;

import lombok.Data;

@Data
public class RegisterDTO {
    private String email;
    private String password;
    private String fullname;
}
