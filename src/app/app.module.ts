import { NgModule } from '@angular/core';
import {
  BrowserModule,
  provideClientHydration,
  withEventReplay,
} from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AdminModule } from './admin/admin.module';
import { UiModule } from './ui/ui.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { NgxSpinnerModule } from 'ngx-spinner';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AdminModule,
    UiModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot({
      timeOut: 5000,
      positionClass: 'toast-top-right',
      preventDuplicates: false,
      tapToDismiss: true,
      closeButton: true,
      enableHtml: true,
      progressBar: true,
      newestOnTop: true,
      maxOpened: 5,
      autoDismiss: true,
    }),
    NgxSpinnerModule,
    HttpClientModule
  ],
  providers: [
    provideClientHydration(withEventReplay()),
    // Multi = true, kullanmamızın amacı birden fazla provider yani servis tanımlayabilmemizdir. Örneğin birden fazla baseUrl tanımlamak istiyorsak, multi: true kullanmalıyız.
    { provide: 'baseUrl', useValue: ' https://localhost:7119/api' , multi: true},
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
