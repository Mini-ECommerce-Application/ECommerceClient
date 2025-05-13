import { Component } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';

export class BaseComponent {
  constructor(private spinner: NgxSpinnerService) {}

  showSpinner(spinnerNameType: SpinnerType) {
    this.spinner.show(spinnerNameType);;

    setTimeout( () => this.hideSpinner(spinnerNameType), 600);
  }

  hideSpinner(spinnerNameType: SpinnerType) {
    this.spinner.hide(spinnerNameType);
  }
}

export enum SpinnerType {
  BallAtom = 's1',
  SquareJellyBox = 's2',
  SquareBallScaleMultiple = 's3',
}
