import { Component } from '@angular/core';
import { BaseComponent, SpinnerType } from '../../../base/base.component';
import { NgxSpinnerService } from 'ngx-spinner';
import { HttpClientService } from '../../../services/common/http-client.service';
import { Product } from '../../../contracts/product';

@Component({
  selector: 'app-products',
  standalone: false,
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss',
})
export class ProductsComponent extends BaseComponent {
  constructor(
    spinner: NgxSpinnerService,
    private httpClientService: HttpClientService
  ) {
    super(spinner);
  }

  ngOnInit(): void {
    this.showSpinner(SpinnerType.BallAtom);

    this.httpClientService.get<Product[]>({
      controller: 'products',
    }).subscribe((data) => console.log(data));

    // this.httpClientService.put({
    //   controller: 'products'
    // }, {
    //   id: 'a223db15-af41-4147-a900-70872ed88542',
    //   name: 'New updated product',
    //   stock: 1,
    //   price: 111,
    // }).subscribe((data) => console.log(data));

    // this.httpClientService.delete({
    //   controller: 'products'
    // }, 'c3c01d62-58c5-4025-9493-d26e37635432')
    //   .subscribe((data) => console.log(data));

    // Trying full endpoint from other API
    this.httpClientService.get({
      baseUrl: 'https://jsonplaceholder.typicode.com',
      controller: 'posts',
    }).subscribe((data) => console.log(data));

  }
}
