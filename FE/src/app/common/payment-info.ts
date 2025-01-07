export class PaymentInfo {
  constructor(
    public amount?: number,
    public currency?: string,
    public receiptEmail?: string
  ) {}
}
export interface PaymentInfo {
  amount?: number;
  currency?: string;
  receiptEmail?: string;
}
