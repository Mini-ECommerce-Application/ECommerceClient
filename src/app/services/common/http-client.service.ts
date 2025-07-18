import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class HttpClientService {
  constructor(
    private httpClient: HttpClient,
    @Inject('baseUrl') private baseUrl: string
  ) { }

  private url(requestParameter: Partial<RequestParameters>): string {
    return `${requestParameter.baseUrl ? requestParameter.baseUrl : this.baseUrl}/${requestParameter.controller}${requestParameter.action ? `/${requestParameter.action}` : ``}`;
  }

  // T generik tipini kullanmamızın sebebi, bu fonksiyonun gelen türü uygun bir şekilde döndürmesini sağlamak. Örneğin, bir API'den gelen verinin türü Product olabilir. Bu durumda, get fonksiyonunundan gelen verinin türü Product olacaktır.
  get<T>(requestParameter: Partial<RequestParameters>, id?: string): Observable<T> {
    let url: string = '';

    if (requestParameter.fullEndPoint)
      url = requestParameter.fullEndPoint;
    else
      url = `${this.url(requestParameter)} ${id ? `/${id}` : ''}`;


    return this.httpClient.get<T>(url, { headers: requestParameter.headers });
  }

  post<T>(requestParameter: Partial<RequestParameters>, body: Partial<T>): Observable<T> {
    let url: string = '';

    if (requestParameter.fullEndPoint)
      url = requestParameter.fullEndPoint;
    else
      url = `${this.url(requestParameter)}`


    return this.httpClient.post<T>(url, body, { headers: requestParameter.headers });
  }

  put<T>(requestParameter: Partial<RequestParameters>, body: Partial<T>) {
    let url: string = '';

    if (requestParameter.fullEndPoint)
      url = requestParameter.fullEndPoint;
    else
      url = `${this.url(requestParameter)}`

    return this.httpClient.put<T>(url, body, { headers: requestParameter.headers })
  }

  delete<T>(requestParameter: Partial<RequestParameters>, id: string): Observable<T> {
    let url: string = '';

    if (requestParameter.fullEndPoint)
      url = requestParameter.fullEndPoint;
    else
      url = `${this.url(requestParameter)}/${id}`;

    return this.httpClient.delete<T>(url, { headers: requestParameter.headers })


  }
}

export class RequestParameters {
  controller?: string;
  action?: string;

  headers?: HttpHeaders;
  baseUrl?: string;
  fullEndPoint?: string;
}
