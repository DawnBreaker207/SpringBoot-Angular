package com.dawn.ecommerce.service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.dawn.ecommerce.dao.CustomerRepository;
import com.dawn.ecommerce.dto.PaymentInfo;
import com.dawn.ecommerce.dto.Purchase;
import com.dawn.ecommerce.dto.PurchaseResponse;
import com.dawn.ecommerce.entity.Customer;
import com.dawn.ecommerce.entity.Order;
import com.dawn.ecommerce.entity.OrderItem;
import com.stripe.Stripe;
import com.stripe.exception.StripeException;
import com.stripe.model.PaymentIntent;

import jakarta.transaction.Transactional;

@Service
public class CheckoutServiceImpl implements CheckoutService {

    private CustomerRepository customerRepository;

    @Autowired
    public CheckoutServiceImpl(CustomerRepository customerRepository, @Value("${stripe.key.secret}") String secretKey) {
	this.customerRepository = customerRepository;

	// Initialize Stripe API with secret key
	Stripe.apiKey = secretKey;
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

	if (customerFromDB != null) {
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

    @Override
    public PaymentIntent createPaymentIntent(PaymentInfo paymentInfo) throws StripeException {
	List<String> paymentMethodTypes = new ArrayList<>();
	paymentMethodTypes.add("card");

	Map<String, Object> params = new HashMap<>();
	params.put("amount", paymentInfo.getAmount());
	params.put("currency", paymentInfo.getCurrency());
	params.put("payment_method_types", paymentMethodTypes);
	params.put("description", "Luv2Ship purchase");
	params.put("receipt_email", paymentInfo.getReceiptEmail());
	return PaymentIntent.create(params);
    }

}
