import { Component } from '@angular/core';
import { AlertifyService, MessageType, Position } from '../../../services/admin/alertify.service';

@Component({
  selector: 'app-dashboard',
  standalone: false,
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {

  constructor(
    private alertify: AlertifyService
  ) { }

  ngOnInit(): void {
    
  }

  m(){
    this.alertify.message("Error test message.", {
      messageType: MessageType.Error,
      position: Position.TopRight,
      delay: 5,
      dismissOthers: false
    });
  }

  dismiss(){
    this.alertify.dismiss();
  }
}
