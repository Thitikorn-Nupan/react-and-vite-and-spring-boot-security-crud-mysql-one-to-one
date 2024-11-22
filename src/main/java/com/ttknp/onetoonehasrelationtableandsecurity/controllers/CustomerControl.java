package com.ttknp.onetoonehasrelationtableandsecurity.controllers;

import com.ttknp.onetoonehasrelationtableandsecurity.entities.Customer;
import com.ttknp.onetoonehasrelationtableandsecurity.services.CustomerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping(value = "/api/customer")
public class CustomerControl {

    private final CustomerService customerService;

    @Autowired
    public CustomerControl(CustomerService customerService) {
        this.customerService = customerService;
    }

    @GetMapping(value = "/reads")
    private ResponseEntity<Iterable<Customer>> reads() {
        return ResponseEntity
                .status(200)
                .body(customerService.getCustomers());
    }

    @GetMapping(value = "/read")
    private ResponseEntity<Customer> read(@RequestParam long cid) {
        return ResponseEntity
                .status(200)
                .body(customerService.getCustomer(cid));
    }

    @PostMapping(value = "/create")
    private ResponseEntity<Boolean> create(@RequestBody Customer customer) {
        return ResponseEntity
                .status(201)
                .body(customerService.addCustomerJoinDetail(customer));
    }

    @PutMapping(value = "/update")
    private ResponseEntity<Boolean> update(@RequestBody Customer customer, @RequestParam long cid) {
        return ResponseEntity
                .status(202)
                .body(customerService.updateCustomer(customer,cid));
    }

    @DeleteMapping(value = "/delete")
    private ResponseEntity<Boolean> delete(@RequestParam long cid) {
        return ResponseEntity
                .status(200)
                .body(customerService.deleteCustomer(cid));
    }
}
