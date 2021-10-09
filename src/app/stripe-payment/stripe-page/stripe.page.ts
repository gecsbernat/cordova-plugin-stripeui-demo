import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { BillingConfig, PaymentResult, StripePaymentService } from '../service/stripe-payment.service';

@Component({
  selector: 'app-stripe',
  templateUrl: './stripe.page.html',
  styleUrls: ['./stripe.page.scss'],
})
export class StripePage implements OnInit {

  @Input() items: any[] = null;
  @Input() currency: string = null;
  @Input() customerId: string = null;
  @Input() customerEmail: string = null;
  @Input() customerName: string = null;
  @Input() billingConfig: BillingConfig = null;
  amount: number = null;
  loading = false;

  constructor(
    private modalController: ModalController,
    private stripeService: StripePaymentService
  ) { }

  ngOnInit() {
    if (!this.currency || !this.items) {
      this.dismiss(null);
    }
    this.amount = 0;
    this.items.forEach((i) => {
      this.amount += i.price;
    });
  }

  async payment() {
    try {
      this.loading = true;
      // customerId, customerEmail, customerName, billingConfig can be null.
      // customerId should be your saved customer from prevoius payment.
      const paymentResult = await this.stripeService.makePayment(this.amount, this.currency, this.customerId, this.customerEmail, this.customerName, this.billingConfig);
      const code = paymentResult.code ? Number(paymentResult.code) : -1;
      this.loading = false;
      if (code === 0) {
        // PAYMENT_COMPLETED
        this.savePayment(paymentResult);
      } else if (code === 1) {
        // PAYMENT_CANCELED
      } else if (code === 2) {
        // PAYMENT_FAILED
      }
    } catch (error) {
      this.loading = false;
      console.log(error);
    }
  }

  savePayment(paymentResult: PaymentResult) {
    // TODO: save the payment and customer in your database for later use...
    // customerId?: string; code?: string; message?: string; error?: string;
    console.log({ paymentResult });
    this.dismiss(true);
  }

  async dismiss(data: any = null) {
    this.modalController.dismiss(data);
  }

}
