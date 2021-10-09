import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { BillingConfig } from '../stripe-payment/service/stripe-payment.service';
import { StripePage } from '../stripe-payment/stripe-page/stripe.page';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  constructor(
    private modalController: ModalController
  ) { }

  pay() {
    const items = [
      {
        name: 'Item 1',
        price: 100
      },
      {
        name: 'Item 2',
        price: 100
      },
      {
        name: 'Item 3',
        price: 100
      }
    ];
    const billingConfig: BillingConfig = {
      billingEmail: 'testuser@example.com',
      billingName: 'Test User',
      billingPhone: '+36201234567',
      billingCity: 'Szeged',
      billingCountry: 'HU',
      billingLine1: 'Test street 1',
      billingLine2: '1/1',
      billingPostalCode: '6724',
      billingState: 'Csongrad'
    };
    this.openPayment(items, 'USD', null, 'testuser@example.com', 'Test User', billingConfig);
  }

  async openPayment(items: any[], currency: string, customerId: string, customerEmail: string, customerName: string, billingConfig: BillingConfig) {
    const modal = await this.modalController.create({
      component: StripePage,
      backdropDismiss: false,
      componentProps: {
        items: items,
        currency: currency,
        customerId: customerId,
        customerEmail: customerEmail,
        customerName: customerName,
        billingConfig: billingConfig
      }
    });
    modal.onDidDismiss().then((data) => {
      console.log(data);
    });
    await modal.present();
  }

}
