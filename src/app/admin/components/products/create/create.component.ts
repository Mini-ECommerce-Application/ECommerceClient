import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../../../services/common/models/product.service';
import { Create_Product } from '../../../../contracts/create_product';
import { BaseComponent, SpinnerType } from '../../../../base/base.component';
import { NgxSpinnerService } from 'ngx-spinner';
import { AlertifyService, MessageType, Position } from '../../../../services/admin/alertify.service';

@Component({
  selector: 'app-create',
  standalone: false,
  templateUrl: './create.component.html',
  styleUrl: './create.component.scss'
})
export class CreateComponent extends BaseComponent implements OnInit {
  constructor(
    spinner: NgxSpinnerService,
    private productService: ProductService,
    private alertify: AlertifyService) {
    super(spinner);
  }

  ngOnInit(): void { }

  create(name: HTMLInputElement, price: HTMLInputElement, stock: HTMLInputElement) {
    // Form validation
    if (!name.value) {
      this.alertify.message("Ürün adı boş olamaz!", {
        messageType: MessageType.Error,
        position: Position.TopRight
      });
      return;
    }

    // Validation rules
    // Ürünün ismi olmalıdır
    // ürünün stock bilgisi 0'dan büyük veya eşit olmalıdır
    // ürünün fiyat bilgisi 0'dan büyük veya eşit olmalıdır

    this.showSpinner(SpinnerType.BallAtom);

    const product = new Create_Product();
    product.name = name.value;
    product.price = parseFloat(price.value);
    product.stock = parseInt(stock.value);
    
    
    
    this.productService.create(product, 
      () => {
        this.hideSpinner(SpinnerType.BallAtom);
        this.alertify.message("Ürün başarıyla eklenmiştir.", {
          dismissOthers: true,
          messageType: MessageType.Success,
          position: Position.TopRight
        });
        // Form reset
        name.value = '';
        price.value = '0';
        stock.value = '0';
      }, 
      errorMessage => {
        this.hideSpinner(SpinnerType.BallAtom);
        this.alertify.message(errorMessage, {
          dismissOthers: true,
          messageType: MessageType.Error,
          position: Position.TopRight
        });
      }
    );
  }
}
