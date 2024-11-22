package com.ttknp.onetoonehasrelationtableandsecurity.entities;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

import java.util.Date;

@Entity
@Table(name = "customers")
@Data
@NoArgsConstructor
@ToString
public class Customer {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long cid;
    private String email;
    private String password;
    private String image;
    private Date timeCreateId; // Date type can map timestamp type in mysql
    // I have relation table this way below for join it
    @OneToOne(cascade = CascadeType.ALL)
    @JoinTable(
            name = "customers_details",
            joinColumns = {
                    // mean to access customers.cid and referent customers_details.cid
                    @JoinColumn(name = "cid", referencedColumnName = "cid")
            },
            inverseJoinColumns = {
                    @JoinColumn(name = "did", referencedColumnName = "did")
            })
    private Detail detail;
}
