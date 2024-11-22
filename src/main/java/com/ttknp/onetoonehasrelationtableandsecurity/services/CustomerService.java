package com.ttknp.onetoonehasrelationtableandsecurity.services;

import com.ttknp.onetoonehasrelationtableandsecurity.entities.Customer;

public interface CustomerService {
    Iterable<Customer> getCustomers();
    Customer getCustomer(long id);
    Boolean addCustomerJoinDetail(Customer customer);
    Boolean updateCustomer(Customer customer, long id);
    Boolean deleteCustomer(long id);
}
