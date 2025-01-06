package com.dawn.ecommerce.dao;

import org.springframework.data.jpa.repository.JpaRepository;

import com.dawn.ecommerce.entity.Customer;

public interface CustomerRepository extends JpaRepository<Customer, Long> {
    
}
