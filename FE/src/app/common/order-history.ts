export class OrderHistory {
  constructor(
    public id: string,
    public orderTrackingNumber: string,
    public totalPrice: number,
    public totalQuantity: number,
    public dateCreated: Date
  ) {}
}
export interface OrderHistory {
  id: string;
  orderTrackingNumber: string;
  totalPrice: number;
  totalQuantity: number;
  dateCreated: Date;
}
