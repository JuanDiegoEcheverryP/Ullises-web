import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.css']
})
export class AlertComponent {
  @Input() show: boolean = false;
  @Input() title: string = 'Alert';
  @Input() message: string = '';
  @Output() close = new EventEmitter<void>();

  closePopup() {
    this.show = false;
    this.close.emit();
  }
}
