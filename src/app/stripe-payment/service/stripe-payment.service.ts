import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';

declare const StripeUIPlugin: any;

export interface PaymentResult {
    customerId?: string;
    code?: string;
    message?: string;
    error?: string;
}

export interface PaymentConfig {
    publishableKey?: string;
    companyName?: string;
    customerId?: string;
    paymentIntent?: string;
    ephemeralKey?: string;
    appleMerchantId?: string;
    appleMerchantCountryCode?: string;
}

export interface BillingConfig {
    billingEmail?: string;
    billingName?: string;
    billingPhone?: string;
    billingCity?: string;
    billingCountry?: string;
    billingLine1?: string;
    billingLine2?: string;
    billingPostalCode?: string;
    billingState?: string;
}

@Injectable({ providedIn: 'root' })
export class StripePaymentService {

    private isCordova: boolean;
    private SERVER_URL = 'YOUR_BACKEND_URL/payment';

    constructor(
        private platform: Platform,
        private http: HttpClient
    ) {
        this.platform.ready().then(async () => {
            this.isCordova = this.platform.is('cordova');
        });
    }

    makePayment(amount: number, currency: string, customerId: string = null, customerEmail: string = null, customerName: string = null, billingConfig: BillingConfig): Promise<PaymentResult> {
        return new Promise((resolve, reject) => {
            if (this.isCordova) {
                const body = {
                    amount: amount,
                    currency: currency,
                    customerId: customerId,
                    customerEmail: customerEmail,
                    customerName: customerName
                };
                const subscribe = this.http.post(this.SERVER_URL, body).subscribe((result: any) => {
                    const paymentConfig: PaymentConfig = {
                        publishableKey: result.publishableKey,
                        companyName: result.companyName,
                        paymentIntent: result.paymentIntent,
                        customerId: result.customerId,
                        ephemeralKey: result.ephemeralKey,
                        appleMerchantId: result.appleMerchantId,
                        appleMerchantCountryCode: result.appleMerchantCountryCode
                    }
                    this.presentPaymentSheet(paymentConfig, billingConfig).then((result) => {
                        result.customerId = paymentConfig.customerId;
                        resolve(result);
                    }).catch((error) => {
                        reject(error);
                    });
                    subscribe.unsubscribe(); return;
                }, (error) => {
                    reject(error);
                    subscribe.unsubscribe(); return;
                });
            } else {
                reject('NOT_CORDOVA'); return;
            }
        });
    }

    private presentPaymentSheet(paymentConfig: PaymentConfig, billingConfig: BillingConfig): Promise<PaymentResult> {
        return new Promise((resolve, reject) => {
            if (this.isCordova) {
                StripeUIPlugin.presentPaymentSheet(paymentConfig, billingConfig, (success: any) => {
                    try {
                        const result = JSON.parse(success) as PaymentResult;
                        resolve(result);
                    } catch (unused) {
                        resolve(success);
                    }
                    return;
                }, (error: any) => {
                    reject(error); return;
                });
            } else {
                reject('NOT_CORDOVA'); return;
            }
        });
    }

}