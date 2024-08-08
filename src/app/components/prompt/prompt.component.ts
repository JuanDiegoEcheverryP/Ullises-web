import { Component, Input, Output, EventEmitter} from '@angular/core';

@Component({
  selector: 'app-prompt',
  templateUrl: './prompt.component.html',
  styleUrls: ['./prompt.component.css']
})
export class PromptComponent {
  @Input() show: boolean = false;
  @Input() title: string = 'Alert';
  @Input() message: string = '';
  @Output() closePrompt = new EventEmitter<void>();
  @Output() acceptPrompt = new EventEmitter<void>();
  @Output() cancelPrompt = new EventEmitter<void>();

  constructor() { }
  
  // Métodos para emitir eventos
  onAccept(): boolean {
    this.show = false
    this.acceptPrompt.emit();
    return true
  }

  onCancel(): boolean {
    this.show = false
    this.cancelPrompt.emit();
    return false
  }

  onClose() {
    this.show = false
    this.closePrompt.emit();
  }
}
