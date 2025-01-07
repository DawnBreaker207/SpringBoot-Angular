import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Luv2ShopFormService } from '../../services/luv2-shop-form.service';
import { Country } from '../../common/country';
import { State } from '../../common/state';
import { Luv2ShopValidators } from '../../validators/luv2-shop-validators';
import { CartService } from '../../services/cart.service';
import { CheckoutService } from '../../services/checkout.service';
import { Router } from '@angular/router';
import { Order } from '../../common/order';
import { OrderItem } from '../../common/order-item';
import { Purchase } from '../../common/purchase';
import { environment } from '../../../environments/environment.development';
import { PaymentInfo } from '../../common/payment-info';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.scss',
})
export class CheckoutComponent implements OnInit {
  checkoutFormGroup!: FormGroup;

  totalPrice: number = 0;
  totalQuantity: number = 0;

  creditCardYears: number[] = [];
  creditCartMonths: number[] = [];

  countries: Country[] = [];
  shippingAddressStates: State[] = [];
  billingAddressStates: State[] = [];

  storage: Storage = sessionStorage;

  // Initialized Stripe API
  stripe = Stripe(environment.stripePublishableKey);
  paymentInfo: PaymentInfo = new PaymentInfo();
  cardElement: any;
  displayError: any = '';

  constructor(
    private formBuilder: FormBuilder,
    private luv2ShipFormService: Luv2ShopFormService,
    private cartService: CartService,
    private checkoutService: CheckoutService,
    private router: Router
  ) {}
  ngOnInit(): void {
    // Setup STRIPE payment form
    this.setupStripePaymentForm();

    this.reviewCartDetails();

    // Read the user email address from browser storage
    const email = JSON.parse(this.storage.getItem('userEmail')!);

    this.checkoutFormGroup = this.formBuilder.group({
      customer: this.formBuilder.group({
        firstName: new FormControl('', [
          Validators.required,
          Validators.minLength(2),
          Luv2ShopValidators.notOnlyWhiteSpace,
        ]),
        lastName: new FormControl('', [
          Validators.required,
          Validators.minLength(2),
          Luv2ShopValidators.notOnlyWhiteSpace,
        ]),
        email: new FormControl(email, [
          Validators.required,
          Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$'),
        ]),
      }),
      shippingAddress: this.formBuilder.group({
        street: new FormControl('', [
          Validators.required,
          Validators.minLength(2),
          Luv2ShopValidators.notOnlyWhiteSpace,
        ]),
        city: new FormControl('', [
          Validators.required,
          Validators.minLength(2),
          Luv2ShopValidators.notOnlyWhiteSpace,
        ]),
        state: new FormControl('', [Validators.required]),
        country: new FormControl('', [Validators.required]),
        zipCode: new FormControl('', [
          Validators.required,
          Validators.minLength(2),
          Luv2ShopValidators.notOnlyWhiteSpace,
        ]),
      }),
      billingAddress: this.formBuilder.group({
        street: new FormControl('', [
          Validators.required,
          Validators.minLength(2),
          Luv2ShopValidators.notOnlyWhiteSpace,
        ]),
        city: new FormControl('', [
          Validators.required,
          Validators.minLength(2),
          Luv2ShopValidators.notOnlyWhiteSpace,
        ]),
        state: new FormControl('', [Validators.required]),
        country: new FormControl('', [Validators.required]),
        zipCode: new FormControl('', [
          Validators.required,
          Validators.minLength(2),
          Luv2ShopValidators.notOnlyWhiteSpace,
        ]),
      }),
      creditCard: this.formBuilder.group({
        // cardType: new FormControl('', [Validators.required]),
        // nameOnCard: new FormControl('', [
        //   Validators.required,
        //   Validators.minLength(2),
        //   Luv2ShopValidators.notOnlyWhiteSpace,
        // ]),
        // cardNumber: new FormControl('', [
        //   Validators.required,
        //   Validators.pattern('[0-9]{16}'),
        // ]),
        // securityCode: new FormControl('', [
        //   Validators.required,
        //   Validators.pattern('[0-9]{3}'),
        // ]),
        // expirationMonth: new FormControl('', []),
        // expirationYear: new FormControl('', []),
      }),
    });

    const startMonth: number = new Date().getMonth() + 1;
    this.luv2ShipFormService
      .getCreditCardMonths(startMonth)
      .subscribe((data) => {
        this.creditCartMonths = data;
      });

    this.luv2ShipFormService
      .getCreditCardYear()
      .subscribe((data) => (this.creditCardYears = data));

    this.luv2ShipFormService.getCountries().subscribe((data) => {
      this.countries = data;
    });
  }

  onSubmit() {
    if (this.checkoutFormGroup.invalid) {
      this.checkoutFormGroup.markAllAsTouched();
      return;
    }

    // Set up order
    let order = new Order();
    order.totalPrice = this.totalPrice;
    order.totalQuantity = this.totalQuantity;

    // Get cart items
    const cartItems = this.cartService.cartItems;
    // Create orderItems from cartItems
    // //* Long way
    // let orderItems: OrderItem[] = [];
    // for (let i = 0; i < cartItems.length; i++) {
    //   orderItems[i] = new OrderItem(cartItems[i]);
    // }

    //* Short way of doing the same thing
    let orderItems: OrderItem[] = cartItems.map(
      (cartItem) => new OrderItem(cartItem)
    );

    // Set up purchase
    let purchase = new Purchase();

    // Populate purchase - customer
    purchase.customer = this.checkoutFormGroup.controls['customer'].value;

    // Populate purchase - shipping address
    purchase.shippingAddress =
      this.checkoutFormGroup.controls['shippingAddress'].value;
    const shippingState: State = JSON.parse(
      JSON.stringify(purchase.shippingAddress.state)
    );
    const shippingCountry: State = JSON.parse(
      JSON.stringify(purchase.shippingAddress.country)
    );
    purchase.shippingAddress.state = shippingState.name;
    purchase.shippingAddress.country = shippingCountry.name;

    // Populate purchase - billing address
    purchase.billingAddress =
      this.checkoutFormGroup.controls['billingAddress'].value;
    const billingState: State = JSON.parse(
      JSON.stringify(purchase.shippingAddress.state)
    );
    const billingCountry: State = JSON.parse(
      JSON.stringify(purchase.shippingAddress.country)
    );
    purchase.billingAddress.state = billingState.name;
    purchase.billingAddress.country = billingCountry.name;

    // Populate purchase - order and orderItems
    purchase.order = order;
    purchase.orderItems = orderItems;

    // Compute payment info
    this.paymentInfo.amount = Math.round(this.totalPrice * 100);
    this.paymentInfo.currency = 'USD';

    //  If valid form then
    //  Create payment intent
    // Confirm card payment
    // Place order
    if (
      !this.checkoutFormGroup.invalid &&
      this.displayError.textContent === ''
    ) {
      this.checkoutService
        .createPaymentIntent(this.paymentInfo)
        .subscribe((paymentIntentResponse) => {
          this.stripe
            .confirmCartPayment(
              paymentIntentResponse.client_secret,
              {
                payment_method: {
                  card: this.cardElement,
                  billing_details: {
                    email: purchase.customer.email,
                    name: `${purchase.customer.firstName} ${purchase.customer.lastName}`,
                    address: {
                      line1: purchase.billingAddress.street,
                      city: purchase.billingAddress.city,
                      state: purchase.billingAddress.state,
                      postal_code: purchase.billingAddress.zipCode,
                      country: this.billingAddressCountry?.value.code,
                    },
                  },
                },
              },
              { handleActions: false }
            )
            .then((result: any) => {
              if (result.error) {
                // Inform the customer there was an error
                alert(`There was an error: ${result.error.message}`);
              } else {
                // Call REST API via the CheckoutService
                this.checkoutService.placeOrder(purchase).subscribe({
                  next: (res: any) => {
                    alert(
                      `Your order has been received.\nOrder tracking number: ${res.orderTrackingNumber}`
                    );

                    // Reset cart
                    this.resetCart();
                  },
                  error: (err: any) => {
                    alert(`There was an error: ${err.message}`);
                  },
                });
              }
            });
        });
    } else {
      this.checkoutFormGroup.markAllAsTouched();
      return;
    }
  }
  resetCart() {
    // Reset cart data
    this.cartService.cartItems = [];
    this.cartService.totalPrice.next(0);
    this.cartService.totalQuantity.next(0);
    this.cartService.persistCartItems();
    // Reset the form
    this.checkoutFormGroup.reset();

    // Navigate back to the products page
    this.router.navigateByUrl('/products');
  }

  get firstName() {
    return this.checkoutFormGroup.get('customer.firstName');
  }
  get lastName() {
    return this.checkoutFormGroup.get('customer.lastName');
  }
  get email() {
    return this.checkoutFormGroup.get('customer.email');
  }

  get shippingAddressStreet() {
    return this.checkoutFormGroup.get('shippingAddress.street');
  }
  get shippingAddressCity() {
    return this.checkoutFormGroup.get('shippingAddress.city');
  }
  get shippingAddressZipcode() {
    return this.checkoutFormGroup.get('shippingAddress.zipCode');
  }
  get shippingAddressState() {
    return this.checkoutFormGroup.get('shippingAddress.state');
  }
  get shippingAddressCountry() {
    return this.checkoutFormGroup.get('shippingAddress.country');
  }

  get billingAddressStreet() {
    return this.checkoutFormGroup.get('billingAddress.street');
  }
  get billingAddressCity() {
    return this.checkoutFormGroup.get('billingAddress.city');
  }
  get billingAddressZipcode() {
    return this.checkoutFormGroup.get('billingAddress.zipCode');
  }
  get billingAddressState() {
    return this.checkoutFormGroup.get('billingAddress.state');
  }
  get billingAddressCountry() {
    return this.checkoutFormGroup.get('billingAddress.country');
  }

  get creditCardType() {
    return this.checkoutFormGroup.get('creditCard.cardType');
  }
  get creditCardNameOnCard() {
    return this.checkoutFormGroup.get('creditCard.nameOnCard');
  }
  get creditCardNumber() {
    return this.checkoutFormGroup.get('creditCard.cardNumber');
  }
  get creditCardSecurityCode() {
    return this.checkoutFormGroup.get('creditCard.securityCode');
  }
  copyShippingAddressToBillingAddress(event: any) {
    if (event.target.checked) {
      this.checkoutFormGroup.controls['billingAddress'].setValue(
        this.checkoutFormGroup.controls['shippingAddress'].value
      );

      this.billingAddressStates = this.shippingAddressStates;
    } else {
      this.checkoutFormGroup.controls['billingAddress'].reset();
      this.billingAddressStates = [];
    }
  }

  // handleMonthAndYears($event: Event) {
  //   const creditCardFormGroup = this.checkoutFormGroup.get('creditCard');
  //   const currentYear: number = new Date().getFullYear();
  //   const selectedYear: number = Number(
  //     creditCardFormGroup?.value.expirationYear
  //   );

  //   let startMonth: number;
  //   if (currentYear === selectedYear) {
  //     startMonth = new Date().getMonth() + 1;
  //   } else {
  //     startMonth = 1;
  //   }

  //   this.luv2ShipFormService
  //     .getCreditCardMonths(startMonth)
  //     .subscribe((data) => (this.creditCartMonths = data));
  // }

  getStates(formGroupName: string) {
    const formGroup = this.checkoutFormGroup.get(formGroupName);

    const countryCode = formGroup?.value.country.code;
    const countryName = formGroup?.value.country.name;

    this.luv2ShipFormService.getStates(countryCode).subscribe((data) => {
      if (formGroupName === 'shippingAddress') {
        this.shippingAddressStates = data;
      } else {
        this.billingAddressStates = data;
      }

      formGroup?.get('state')?.setValue(data[0]);
    });
  }

  reviewCartDetails() {
    this.cartService.totalQuantity.subscribe(
      (data) => (this.totalQuantity = data)
    );
    this.cartService.totalPrice.subscribe((data) => (this.totalPrice = data));
  }

  setupStripePaymentForm() {
    // Get a handle to stripe elements
    var elements = this.stripe.elements();

    // Create a card element ... and hide the zip-code field
    this.cardElement = elements.create('card', { hidePostalCode: true });

    // Add an instance of card UI component into the 'card-element' div
    this.cardElement.mount('#card-element');

    // Add event binding for the 'change' event on the card element
    this.cardElement.on('change', (event: any) => {
      // Get a handle to card-errors element
      this.displayError = document.getElementById('card-errors');

      if (event.complete) {
        this.displayError.textContent = '';
      } else if (event.error) {
        // Show validation error to customer
        this.displayError.textContent = event.error.message;
      }
    });
  }
}
