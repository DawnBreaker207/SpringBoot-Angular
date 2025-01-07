export class PaymentInfo {
  constructor(public amount?: number, public currency?: string) {}
}
export interface PaymentInfo {
  amount?: number;
  currency?: string;
}
