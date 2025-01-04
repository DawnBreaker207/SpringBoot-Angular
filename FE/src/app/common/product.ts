export class Product {
  constructor(
    public id: string,
    public sku: string,
    public name: string,
    public description: string,
    public unitPrice: number,
    public imageUrl: string,
    public active: string,
    public unitsInStock: string,
    public dateCreated: string,
    public lastUpdated: string
  ) {}
}
export interface Product {
  id: string;
  sku: string;
  name: string;
  description: string;
  unitPrice: number;
  imageUrl: string;
  active: string;
  unitsInStock: string;
  dateCreated: string;
  lastUpdated: string;
}
