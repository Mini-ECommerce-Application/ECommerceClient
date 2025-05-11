import { Component } from '@angular/core';
import { CustomToastrService, ToastrMessageType, ToastrPosition } from './services/ui/custom-toastr.service';
declare var $: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: false,
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'ECommerceClient';

  constructor(private toastr: CustomToastrService) {
    
  this.toastr.message('Hello e-Commerce', 'E-Commerce2', {
    messageType: ToastrMessageType.Success,
    position: ToastrPosition.BottomRight,
    tapToDismiss: true,
    closeButton: true,
    timeout: 3000,
  });

}

ngOnInit(): void {}

}
