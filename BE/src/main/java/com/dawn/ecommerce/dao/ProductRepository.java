package com.dawn.ecommerce.dao;

import org.springframework.data.jpa.repository.JpaRepository;

import com.dawn.ecommerce.entity.Product;

public interface ProductRepository extends JpaRepository<Product, Long> {

}
