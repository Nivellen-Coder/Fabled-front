import {Component, EventEmitter, Input, Output} from '@angular/core';
import {DatePipe, NgForOf, NgIf} from "@angular/common";
import {FormsModule} from "@angular/forms";

@Component({
  selector: 'app-order-detail',
  standalone: true,
  imports: [
    NgForOf,
    DatePipe,
    FormsModule,
    NgIf
  ],
  templateUrl: './order-detail.component.html',
  styleUrl: './order-detail.component.scss'
})
export class OrderDetailComponent {
  @Input() order: any;
  @Input() visible = false;
  @Output() closeModal = new EventEmitter<void>();
  @Output() statusUpdated = new EventEmitter<string>();

  close() {
    this.closeModal.emit();
  }

  saveStatus() {
    this.statusUpdated.emit(this.order.status);
    this.close();
  }
}
