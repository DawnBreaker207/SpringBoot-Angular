package com.dawn.ecommerce.dto;

import java.util.Set;

import com.dawn.ecommerce.entity.Address;
import com.dawn.ecommerce.entity.Customer;
import com.dawn.ecommerce.entity.Order;
import com.dawn.ecommerce.entity.OrderItem;

import lombok.Data;

@Data
public class Purchase {
    private Customer customer;
    private Address shippingaddress;
    private Address billingAddress;
    private Order order;
    private Set<OrderItem> orderItems;
}
