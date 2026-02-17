import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { List_Product } from '../../../../contracts/list_product';
import { ProductService } from '../../../../services/common/models/product.service';
import { BaseComponent, SpinnerType } from '../../../../base/base.component';
import { NgxSpinnerService } from 'ngx-spinner';
import { AlertifyService, MessageType, Position } from '../../../../services/admin/alertify.service';
import { MatPaginator } from '@angular/material/paginator';

declare var $: any; // Jquery'i kullanabilmek için $any tanımlaması yapıyoruz. Böylece, JQuery'i kullanarak HTML elementlerine erişebiliriz. Örneğin, delete fonksiyonunda event.srcElement ile tıklanan elemente erişiyoruz. Ancak, TypeScript'te event.srcElement'in tipi EventTarget olduğu için, bu elementin parentElement özelliğine erişemeyiz. Bu yüzden, $any kullanarak event.srcElement'in tipini any yapıyoruz ve böylece parentElement özelliğine erişebiliriz.

@Component({
  selector: 'app-list',
  standalone: false,
  templateUrl: './list.component.html',
  styleUrl: './list.component.scss'
})
export class ListComponent extends BaseComponent implements OnInit {

  constructor(
    spinner: NgxSpinnerService,
    private productService: ProductService,
    private alertiyfy: AlertifyService) {

    super(spinner)
  }

  displayedColumns: string[] = ['name', 'stock', 'price', 'createdDate', 'updatedDate', 'edit', 'delete']; // Tablo başlıklarını tanımlıyoruz. HTML'de mat-header-cell'lerde bu isimleri kullanacağız. Ayrıca, mat-row'larda da bu isimleri kullanarak verileri göstereceğiz.

  dataSource: MatTableDataSource<List_Product> = null; // Buradaki nesne oluşturma işlemini, ürünler geldikten sonra yapılacak. O yüzden null olarak başlatıldı. (yani API'den ürünler geldikten sonra oluşturulacak.) Çünkü API'den ürünler gelmeden önce oluşturulursa, boş bir tablo oluşur ve ürünler geldikten sonra tablo güncellenmez.

  @ViewChild(MatPaginator) paginator: MatPaginator; // MatPaginator'ı kullanabilmek için, HTML'de tanımlanan MatPaginator'ı ViewChild ile tanımlıyoruz. Böylece, MatTableDataSource'un paginator özelliğine erişebiliriz.


  async ngOnInit(): Promise<void> {

    await this.getProducts();

  }

  async getProducts() {
    this.showSpinner(SpinnerType.BallAtom)

    // Read'den dönen veri Promise olduğu için await kullanarak veriyi bekliyoruz. Veriyi bekledikten sonra tabloyu oluşturacağız. Eğer await kullanmazsak, tabloyu oluştururken veri gelmemiş olur ve tablo boş kalır. Ancak await kullanarak veriyi beklersek, veri geldikten sonra tabloyu oluşturabiliriz.
    const allProducts: { totalCount: number, products: List_Product[] } = await this.productService.read(this.paginator ? this.paginator.pageIndex : 0, this.paginator ? this.paginator.pageSize : 5, () => this.hideSpinner(SpinnerType.BallAtom),
      errorMessage => {
        this.hideSpinner(SpinnerType.BallAtom);
        this.alertiyfy.message("Ürünler yüklenirken bir hata oluştu.",
          {
            dismissOthers: true,
            messageType: MessageType.Error,
            position: Position.TopRight
          })
      })
    this.dataSource = new MatTableDataSource<List_Product>(allProducts.products);
    this.paginator.length = allProducts.totalCount; // Paginator'ın toplam ürün sayısını bilmesi gerekiyor ki sayfalama işlemi doğru çalışsın. Bu yüzden paginator'ın length özelliğine totalCount değerini atıyoruz. (totalCount, API'den dönen toplam ürün sayısıdır.)
    // this.dataSource.paginator = this.paginator; // bu satırı da yorum satırı yaptık. Çünkü paginatior.length'i atadıktan sonra paginator'ı dataSource'a atarsak, sayfalama işlemi doğru çalışmaz. 
  }

  // Sayfa değiştiğinde çalışacak fonksiyon. Paginator'ın pageIndex ve pageSize değerlerini kullanarak ürünleri tekrar yükleyeceğiz. Çünkü sayfa değiştiğinde yeni sayfanın ürünlerini yüklememiz gerekiyor.
  async pageChanged() {
    await this.getProducts();
  }

}


// Burada delete işlemini her element için yapmamak adına Direktif elementini kullanacağız, Direktif kısaca:
// 3 tür directive vardır.
// 1- Attribute Directive: HTML elementlerine yeni özellikler eklemek için kullanılır. Örneğin, ngClass, ngStyle gibi.
// 2- Structural Directive: HTML elementlerinin yapısını değiştirmek için kullanılır. Örneğin, ngIf, ngFor gibi.
// 3- Component Directive: Kendi başına bir HTML elementi oluşturan directive türüdür. Örneğin, app-list gibi. Component Directive'ler, HTML elementleri gibi kullanılabilirler ve kendi template'lerine sahip olabilirler. Bu sayede, tekrar kullanılabilir ve modüler bir yapı oluşturulabilir.