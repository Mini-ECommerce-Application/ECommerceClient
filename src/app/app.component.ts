import { Component, OnInit, PLATFORM_ID, Inject } from '@angular/core';
import {
  CustomToastrService,
  ToastrMessageType,
  ToastrPosition,
} from './services/ui/custom-toastr.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { isPlatformBrowser } from '@angular/common';
declare var $: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: false,
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  title = 'ECommerceClient';

  constructor(
    private toastr: CustomToastrService,
    private spinner: NgxSpinnerService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      $.get('https://localhost:7119/api/Products')
        .done(response => console.log('Response:', response))
        .fail((xhr, status, error) => {
          console.error('Request failed:', { status, error, response: xhr.responseText });
        });
    }
  }  
}
