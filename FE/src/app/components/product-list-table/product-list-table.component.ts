import { Component } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { Product } from '../../common/product';

@Component({
  selector: 'app-product-list-table',
  templateUrl: './product-list-table.component.html',
  styleUrl: './product-list-table.component.scss',
})
export class ProductListTableComponent {
  products: Product[] = [];
  constructor(private productService: ProductService) {}
  ngOnInit(): void {
    this.listProduct();
  }
  listProduct() {
    this.productService.getProductList().subscribe((data) => {
      this.products = data;
    });
  }
}
