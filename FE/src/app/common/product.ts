export class Product {
  constructor(
    public id: number,
    public sku: string,
    public name: string,
    public description: string,
    public unitPrice: string,
    public imageUrl: string,
    public active: string,
    public unitsInStock: string,
    public dateCreated: string,
    public lastUpdated: string
  ) {}
}
export interface Product {
  id: number;
  sku: string;
  name: string;
  description: string;
  unitPrice: string;
  imageUrl: string;
  active: string;
  unitsInStock: string;
  dateCreated: string;
  lastUpdated: string;
}
