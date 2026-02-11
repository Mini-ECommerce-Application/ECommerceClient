import { Component, ViewChild } from '@angular/core';
import { BaseComponent, SpinnerType } from '../../../base/base.component';
import { NgxSpinnerService } from 'ngx-spinner';
import { HttpClientService } from '../../../services/common/http-client.service';
import { Create_Product } from '../../../contracts/create_product';
import { ListComponent } from './list/list.component';

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
 
  }

// Şimdi burada bir ViewChild kullanarak list component'ine erişeceğiz ve createdProduct event'ini dinleyeceğiz. Böylece, create component'inde bir ürün oluşturulduğunda, bu ürünü list component'ine gönderebileceğiz ve list component'i de bu ürünü listeye ekleyebilecek.

@ViewChild(ListComponent) listComponent: ListComponent; // ListComponent'e erişmek için ViewChild kullanıyoruz. Böylece, list component'ine erişebilir ve createdProduct event'ini dinleyebiliriz.

  createdProduct(createdProduct : Create_Product){
    this.listComponent.getProducts(); // createdProduct event'i tetiklendiğinde, list component'ine erişerek getProducts fonksiyonunu çağırıyoruz. Böylece, list component'i yeni oluşturulan ürünü listeye ekleyebilir.

  }
}
