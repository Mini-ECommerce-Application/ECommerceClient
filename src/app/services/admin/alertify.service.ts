import { Injectable } from '@angular/core';
declare var alertify: any;


@Injectable({
  providedIn: 'root'
})
export class AlertifyService {
  constructor() { }
  // message(message : string, messageType: MessageType, position: Position = Position.TopRight, delay: number = 3, dismissOthers: boolean = false) {
    message(message:string, options: Partial<AlertifyOptions>) { // Partial<AlertifyOptions> ile AlertifyOptions sınıfının tüm özelliklerini kullanabiliriz. Ancak hepsini kullanmak zorunda değiliz. Servisi kullanırken tanımlama aşamasında {} prantezlerii içerisinde tanımlamamızı yapabiliyoruz.
    
    alertify.set('notifier','delay', options.delay);
    
    alertify.set('notifier','position', options.position); // alertify.js kütüphanesinin notifier özelliğini kullanarak mesajın konumunu ayarlıyoruz.
    
    // Method türlerini aşağıda enum kullanarak tanımladık ve alerytify[] () kısmında köşeli parantez içinde gelen mesaj türüne ait fonksiyonu çağırıp mesajı içerisine ekledik.
    const msg = alertify[options.messageType](message)

    if(options.dismissOthers) {
      msg.dismissOthers() // msg dışında kalan tüm mesajları kapatıyoruz.
    }

  }

  dismiss(){
    alertify.dismissAll(); // alertify.js kütüphanesinin dismissAll özelliğini kullanarak tüm mesajları kapatıyoruz.
  }
}

export class AlertifyOptions {
  messageType: MessageType = MessageType.Message;
  position: Position= Position.TopRight;
  delay: number= 3;
  dismissOthers: boolean= false;
}

// Aşağıda kullanılan enum, alertify.js kütüphanesinin desteklediği mesaj türlerini temsil eder.
// Bu türler, mesajların görsel stilini ve anlamını belirlemek için kullanılır.
export enum MessageType {
  Success = "success",
  Error = "error",
  Warning = "warning",
  Notify = "notify",
  Message = "message",
}

// Angular'da bir şeyi parametrik hale getirmek demek enum kullanmak demektir.
export enum Position{
  TopRight = "top-right",
  TopCenter = "top-center",
  TopLeft = "top-left",
  BottomRight = "bottom-right",
  BottomCenter = "bottom-center",
  BottomLeft = "bottom-left",
}