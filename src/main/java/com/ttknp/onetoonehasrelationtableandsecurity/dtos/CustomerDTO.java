package com.ttknp.onetoonehasrelationtableandsecurity.dtos;

import com.ttknp.onetoonehasrelationtableandsecurity.entities.Customer;
import com.ttknp.onetoonehasrelationtableandsecurity.repositories.CustomerRepo;
import com.ttknp.onetoonehasrelationtableandsecurity.services.CustomerService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;

@Service
public class CustomerDTO implements CustomerService {

    private final CustomerRepo customerRepo;
    // private final DetailService detailService;
    private final Logger log;

    @Autowired
    public CustomerDTO(CustomerRepo customerRepo) { // , DetailService detailService
        this.customerRepo = customerRepo;
        log = LoggerFactory.getLogger(this.getClass());
        // this.detailService = detailService;
    }

    @Override
    public Iterable<Customer> getCustomers() {
        return customerRepo.findAll();
    }

    @Override
    public Customer getCustomer(long id) {
        return customerRepo
                .findById(id)
                .orElse(null);
    }

    @Override
    public Boolean addCustomerJoinDetail(Customer customer) {
        log.warn("customer before adding new customer {}", customer);
        customer.setTimeCreateId(new Date()); // new Date() will work seem like current_timestamp function in mysql
        return customerRepo.save(customer).getCid() != null;
    }

    @Override
    public Boolean updateCustomer(Customer customer, long id) {
        log.warn("customer's fields for update {}", customer);
        return customerRepo
                .findById(id)
                .map((customerFound) -> {
                    customerFound.setImage(customer.getImage());
                    customerFound.setEmail(customer.getEmail());
                    customerFound.setPassword(customer.getPassword());
                    return customerRepo.save(customerFound).getCid() != null;
                })
                .orElse(false);
    }

    @Override
    public Boolean deleteCustomer(long id) {
        // detailService.deleteDetail(did);
        // *** we don't need to remove relation on own
        // @OneToOne it did before remove @OneToOne
        // log.warn("check and delete detail id {}");
        /*
            Hibernate: delete from customers_details where cid=?
            Hibernate: delete from customers where cid=?
            Hibernate: delete from details where did=?
         */
        return customerRepo.findById(id).map((customer) -> {
            customerRepo.delete(customer);
            return true;
        }).orElse(false);
    }
}
