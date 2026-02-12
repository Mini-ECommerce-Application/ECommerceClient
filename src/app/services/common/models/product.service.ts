import { Injectable } from '@angular/core';
import { HttpClientService } from '../http-client.service';
import { Create_Product } from '../../../contracts/create_product';
import { HttpErrorResponse } from '@angular/common/http';
import { List_Product } from '../../../contracts/list_product';
import { first, firstValueFrom, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  constructor(private httpClientService: HttpClientService) { }

  create(product: Create_Product, successCallBack?: () => void, errorCallBack?: (errorMessage: string) => void) {
    this.httpClientService.post({
      controller: "products"
    }, product)
      .subscribe({
        next: (response) => {
          successCallBack();
        },
        error: (errorResponse: HttpErrorResponse) => {
          const _error: Array<{ key: string, value: Array<string> }> = errorResponse.error;
          let message = "";

          _error.forEach((v, index) => {
            v.value.forEach((_v, _index) => {
              message += `${_v}<br>`;
            })
            errorCallBack(message);
          });
        }
      });
  }

  // Kritik parametreler dışında kalan parametreleri nullable yapalım ki isteğe bağlı olsunlar, geliştirici sucess olduğunda illa bir mesaj vermek istemeyebilir.
  // Async fonksiyonlar her zaman bir promise döner o yüzden dönüş tipini Promise<{totalCount: number, List_Product[]}> yapıyoruz
  async read(page: number = 0, size: number = 5, sucessCallBack?: () => void, errorCallBack?: (errorMessage: string) => void): Promise<{ totalCount: number, products: List_Product[] }> {

    // await'i kaldırdık öncelikle promiseData diye bir değişken oluşturduk ve veriyi promiseData'ya atadık. (Await'i kaldırmamızın sebebi önce veriyi çekelim daha sonra success veya error callback fonksiyonlarını çalıştıralım. Eğer await kullanırsak, veriyi çekene kadar bekleyeceğiz ve success veya error callback fonksiyonlarını çalıştıramayacağız.)
    const promiseData: Promise<{ totalCount: number, products: List_Product[] }> = this.httpClientService.get<{ totalCount: number, products: List_Product[] }>({
      controller: "products",
      queryString: `page=${page}&size=${size}`
    }).toPromise();

    // promiseData'dan veri başarılı bir şekilde geliyorsa then() kısmında handle edeceğiz, eğer hata varsa catch() kısmında handle edeceğiz.
    promiseData.then(d => sucessCallBack())
      .catch((errorResponse: HttpErrorResponse) => errorCallBack(errorResponse.message));

    // Nihayetinde await kullanarak veriyi döndürüyoruz. (await kullanarak veriyi döndürmemizin sebebi, bu fonksiyonu çağıran yerde veriyi bekleyebilmek için. Eğer await kullanmazsak, bu fonksiyon bir promise dönecektir ve bu promise'in sonucunu beklemek zorunda kalacağız. Ancak await kullanarak veriyi döndürürsek, bu fonksiyonun sonucunu bekleyebiliriz ve veriyi doğrudan elde edebiliriz.)
    return await promiseData;
  }


  async delete(id: string) {

    const deleteObservable: Observable<any> = this.httpClientService.delete<any>(
      { controller: "products" }, id);

    await firstValueFrom(deleteObservable);

  }

}
