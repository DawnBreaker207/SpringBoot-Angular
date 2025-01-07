package com.dawn.ecommerce.service;

import com.dawn.ecommerce.dto.PaymentInfo;
import com.dawn.ecommerce.dto.Purchase;
import com.dawn.ecommerce.dto.PurchaseResponse;
import com.stripe.exception.StripeException;
import com.stripe.model.PaymentIntent;

public interface CheckoutService {
    PurchaseResponse placeOrder(Purchase purchase);
    
    PaymentIntent createPaymentIntent(PaymentInfo paymentInfo) throws StripeException;
}
