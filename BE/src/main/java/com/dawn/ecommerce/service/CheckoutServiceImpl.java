package com.dawn.ecommerce.service;

import java.util.Set;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.dawn.ecommerce.dao.CustomerRepository;
import com.dawn.ecommerce.dto.Purchase;
import com.dawn.ecommerce.dto.PurchaseResponse;
import com.dawn.ecommerce.entity.Customer;
import com.dawn.ecommerce.entity.Order;
import com.dawn.ecommerce.entity.OrderItem;

import jakarta.transaction.Transactional;

@Service
public class CheckoutServiceImpl implements CheckoutService {
    private CustomerRepository customerRepository;

    @Autowired
    public CheckoutServiceImpl(CustomerRepository customerRepository) {
	this.customerRepository = customerRepository;
    }

    @Override
    @Transactional
    public PurchaseResponse placeOrder(Purchase purchase) {
	// Retrieve the order info form DTO
	Order order = purchase.getOrder();

	// Generate tracking number
	String orderTrackingNumber = generateOrderTrackingNumber();
	order.setOrderTrackingNumber(orderTrackingNumber);

	// Populate order with orderItems
	Set<OrderItem> orderItems = purchase.getOrderItems();
	orderItems.forEach(item -> order.add(item));

	// Populate order with billingAddress and shippingAddress
	order.setBillingAddress(purchase.getBillingAddress());
	order.setBillingAddress(purchase.getShippingaddress());
	
	// Populate customer with order
	Customer customer = purchase.getCustomer();
	
	// Check if this is an existing customer
	String email = customer.getEmail();
	
	Customer customerFromDB = customerRepository.findByEmail(email);
	
	if(customerFromDB != null) {
	    customer = customerFromDB;
	}
	
	customer.add(order);
	
	// Save to the database
	customerRepository.save(customer);
	
	// Return a response
	return new PurchaseResponse(orderTrackingNumber);
    }

    private String generateOrderTrackingNumber() {
	// Generate a random UUID number (UUID version-4)
	return UUID.randomUUID().toString();
    }

}
