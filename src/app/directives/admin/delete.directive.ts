import { Directive, ElementRef, EventEmitter, HostListener, Input, Output, Renderer2 } from '@angular/core';
import { ProductService } from '../../services/common/models/product.service';
import { BaseComponent, SpinnerType } from '../../base/base.component';
import { NgxSpinnerService } from 'ngx-spinner';
import { MatDialog } from '@angular/material/dialog';
import { DeleteDialogComponent, DeleteState } from '../../dialogs/delete-dialog/delete-dialog.component';

declare var $: any; // Jquery'i kullanamak için $any tanımlaması yapıyoruz.

@Directive({
  selector: '[appDelete]', // Directive'lerdeki keyword'ümüz buradaki selector'dır. Bu selector, HTML elementlerinde kullanacağımız isimdir. Örneğin, <img appDelete> şeklinde kullanacağız. Bu sayede, bu img elementine tıklandığında delete işlemi gerçekleşecek.
  standalone: false
})
export class DeleteDirective {

  // Şimdi bana ne lazım, direktifi çağırdığım html nesnesini elde etmeliyim (ElementRef),
  // Bu elemente manipülasyon yapma işlemi için ise Renderer2'ye ihtiyacım var. Kısaca Renderer2, Angular'ın DOM manipülasyonu yaparken kullandığı bir servistir. Renderer2'yi kullanarak, HTML elementlerine stil ekleyebilir, sınıf ekleyebilir, elementleri silebilir vb. işlemler yapabiliriz. Renderer2'yi kullanarak, Angular'ın platform bağımsız bir şekilde DOM manipülasyonu yapmasını sağlarız. Bu sayede, uygulamamız farklı platformlarda (örneğin, web, mobil) sorunsuz bir şekilde çalışır.
  // Bir de ProductService'e ihtiyacım var. Çünkü, silme işlemi gerçekleştiğinde, bu silme işlemini API'ye bildirmem gerekiyor. Yani, API'ye bir delete isteği göndermem gerekiyor. Bu delete isteğini göndermek için de ProductService'i kullanacağım.

  constructor(private element: ElementRef,
    private _renderer: Renderer2,
    private productService: ProductService,
    private spinner: NgxSpinnerService,
    public dialog: MatDialog
  ) {

    const img = _renderer.createElement("img"); // Bir img elementi oluşturuyoruz. Bu img elementini, silme işlemi için kullanacağız. Yani, bu img elementine tıklandığında silme işlemi gerçekleşecek.
    img.setAttribute("src", "/icons/delete.png");
    img.setAttribute("style", "cursor:pointer;");
    img.width = 25;
    img.height = 25;

    _renderer.appendChild(this.element.nativeElement, img); // Oluşturduğumuz img elementini, direktifi çağırdığımız HTML elementinin içine ekliyoruz. Yani, bu img elementi, direktifi çağırdığımız HTML elementinin bir çocuğu olacak.


  }

  @Input() id: string; // Silinecek olan ürünün id'sini tutacak bir input tanımlıyoruz. Bu input, direktifi çağırdığımız HTML elementinde kullanılacak. Örneğin, <td [id]="element.id" mat-cell *matCellDef="let element" appDelete> şeklinde kullanacağız. Bu sayede, bu td elementine tıklandığında, bu td elementinin id'si silinecek olan ürünün id'si olacak ve bu id'yi kullanarak API'ye delete isteği göndereceğiz.
  @Output() callback: EventEmitter<any> = new EventEmitter(); // Silme işlemi gerçekleştirdikten sonra callback adında td üzerinden bir değer tanımladık bu değer verileri yüklerken kullandığımız getProducts fonksiyonunu çağıracak. Yani, silme işlemi gerçekleştikten sonra ürünleri tekrar yükleyeceğiz. Bu sayede, silme işlemi gerçekleştikten sonra tablo güncellenecek ve silinen ürün tabloya yansımayacak.

  @HostListener("click") // HostListener, direktifi çağırdığımız HTML elementine tıklama olayını dinlemek için kullanılır. Yani, bu direktifi çağırdığımız HTML elementine tıklandığında, deleteItem fonksiyonu çalışacak.
  async onclick() {
    this.openDialog(async () => { // openDialog fonksiyonunu çağırıyoruz ve bu fonksiyona bir callback fonksiyonu gönderiyoruz. Bu callback fonksiyonu, dialog kapandıktan sonra çalışacak ve silme işlemi gerçekleşecek. Async olmasının sebebi, silme işlemi API'ye bir delete isteği göndermek olduğu için, bu işlemin sonucunu beklememiz gerekiyor. Yani, silme işlemi gerçekleşmeden önce, API'den gelen cevabı beklememiz gerekiyor. Bu yüzden, callback fonksiyonunu async yapıyoruz.

      this.spinner.show(SpinnerType.BallAtom);

      const td: HTMLTableCellElement = this.element.nativeElement;
      await this.productService.delete(this.id); // API'den dönecek silme işlemi sonucunu bekliyoruz.
      $(td.parentElement).animate({
        opacity: 0,
        left: "+=50",
        height: "toogle"
      }, 700, () => {
        this.callback.emit(); // Silme işlemi gerçekleştikten sonra callback fonksiyonunu çağırıyoruz. Bu sayede, silme işlemi gerçekleştikten sonra ürünleri tekrar yükleyeceğiz. Bu sayede, silme işlemi gerçekleştikten sonra tablo güncellenecek ve silinen ürün tabloya yansımayacak.
      });
    })

  }

  // Burası Önemli: Şimdi onclick fonksiyonunda silme işlemini daha önceden yazmıştık ancak şimdi silme işlemini önce bir dialog açıp ondan sonra bu fonksiyonu çağırmak için bir call yapacağız. Yani onclick fonksiyonunun içinde bulunan kodları direkt openDialog fonksiyonuna taşımaktan ziyade, openDialog fonksiyonunda callback fonksiyonunu alacağız. Böylece, openDialog fonksiyonunu istediğimiz yerde çağırabiliriz ve bu fonksiyonu çağırdığımız yerde silme işlemi gerçekleştikten sonra ne yapılacağını belirleyebiliriz. Örneğin, openDialog fonksiyonunu list.component.html'de silme butonuna tıklama olayına bağlayabiliriz ve bu sayede, silme butonuna tıklandığında dialog açılacak ve dialogda evet butonuna tıklandığında silme işlemi gerçekleşecek ve tablo güncellenecek. 
  openDialog(afterClosed: any): void {
    const dialogRef = this.dialog.open(DeleteDialogComponent, {
      width: '250px',
      data: DeleteState.Yes,
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      if (result === DeleteState.Yes) {
        afterClosed(); // Dialog kapandıktan sonra, eğer result DeleteState.Yes ise, afterClosed fonksiyonunu çağırıyoruz. Bu sayede, dialogda evet butonuna tıklandığında afterClosed fonksiyonu çalışacak ve silme işlemi gerçekleşecek.
      }
    });
  }



}
