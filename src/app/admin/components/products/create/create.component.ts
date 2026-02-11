import { Component, EventEmitter, OnInit, Output } from '@angular/core';
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

  // Output Event oluşturuyoruz, kısaca output event, bir component'in dışarıya veri göndermesini sağlayan bir mekanizmadır. Örneğin, bir form component'i düşünelim. Bu form component'i, kullanıcıdan veri alır ve bu veriyi parent component'e göndermek isteyebilir. İşte bu durumda output event kullanarak veriyi parent component'e gönderebiliriz. Output event, @Output dekoratörü ile tanımlanır ve EventEmitter sınıfı kullanılarak oluşturulur. Output event, bir component'in dışarıya veri göndermesini sağlar ve bu veriyi parent component tarafından dinlenebilir hale getirir.
  @Output() createdProduct: EventEmitter<Create_Product> = new EventEmitter();

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

    const create_product = new Create_Product();
    create_product.name = name.value;
    create_product.price = parseFloat(price.value);
    create_product.stock = parseInt(stock.value);
    
    
    
    this.productService.create(create_product, 
      () => { // başarılı ise burası çalışacak.
        this.hideSpinner(SpinnerType.BallAtom);
        this.alertify.message("Ürün başarıyla eklenmiştir.", {
          dismissOthers: true,
          messageType: MessageType.Success,
          position: Position.TopRight
        });

        this.createdProduct.emit(create_product); // Ürün başarıyla oluşturulduktan sonra, createdProduct event'ini emit ediyoruz ve oluşturulan ürünü parametre olarak gönderiyoruz. Böylece, parent component bu event'i dinleyebilir ve yeni oluşturulan ürünü alabilir.

        // Form reset
        name.value = '';
        price.value = '0';
        stock.value = '0';
      }, 
      errorMessage => { // başarısız ise burası çalışacak.
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
