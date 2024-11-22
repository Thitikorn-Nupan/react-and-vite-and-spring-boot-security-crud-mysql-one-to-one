package com.ttknp.onetoonehasrelationtableandsecurity.repositories;

import com.ttknp.onetoonehasrelationtableandsecurity.entities.Customer;
import org.springframework.data.repository.CrudRepository;

public interface CustomerRepo extends CrudRepository<Customer, Long> {
    // Modifying queries can only use ((void or int/Integer)) */
//    @Modifying
//    @Query(name = "delete from one_to_one.details where did = :did" , nativeQuery = true)
//    int deleteDetailById(@Param("did") long did);
}
