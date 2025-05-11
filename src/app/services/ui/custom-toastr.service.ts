import { Injectable } from '@angular/core';
import { ToastrService, IndividualConfig, ProgressAnimationType } from 'ngx-toastr';

@Injectable({
  providedIn: 'root',
})
export class CustomToastrService {
  constructor(private toastr: ToastrService) {}

  message(message: string, title: string, toastrOptions: Partial<ToastrOptions>) {
    const options: Partial<IndividualConfig> = {
      positionClass: toastrOptions.position,
      tapToDismiss: true,
      closeButton: true,
      timeOut: toastrOptions.timeout || 5000,
    };

    const toast = this.toastr[toastrOptions.messageType](message, title, options);
    
    // Ensure toast is removed after timeout
    setTimeout(() => {
      if (toast && toast.toastRef) {
        toast.toastRef.close();
      }
    }, options.timeOut);
  }
}

export class ToastrOptions{
  messageType: ToastrMessageType;
  position: ToastrPosition
  tapToDismiss: boolean;
  closeButton: boolean;
  timeout: number;
}

export enum ToastrMessageType {
  Success = 'success',
  Error = 'error',
  Info = 'info',
  Warning = 'warning',
}

export enum ToastrPosition {
  TopRight = 'toast-top-right',
  TopCenter = 'toast-top-center',
  TopLeft = 'toast-top-left',
  TopFullWidth = 'toast-top-full-width',
  BottomRight = 'toast-bottom-right',
  BottomCenter = 'toast-bottom-center',
  BottomLeft = 'toast-bottom-left',
  BottomFullWidth = 'toast-bottom-full-width',
}
