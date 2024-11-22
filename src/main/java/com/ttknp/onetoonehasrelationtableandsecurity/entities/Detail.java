package com.ttknp.onetoonehasrelationtableandsecurity.entities;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

import java.util.Date;
@Entity
@Table(name = "details")

@Data
@NoArgsConstructor
@ToString
public class Detail {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long did;
    private Date birthday;
    private Boolean maritalStatus;
    private Double salary;
    private String phone;
}
