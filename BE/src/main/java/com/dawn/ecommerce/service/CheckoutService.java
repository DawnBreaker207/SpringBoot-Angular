package com.dawn.ecommerce.service;

import com.dawn.ecommerce.dto.Purchase;
import com.dawn.ecommerce.dto.PurchaseResponse;

public interface CheckoutService {
    PurchaseResponse placeOrder(Purchase purchase);
    
}
