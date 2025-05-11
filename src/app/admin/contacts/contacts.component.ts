import {Component, OnInit} from '@angular/core';
import {ContactMessage, ContactMessageService} from "../../services/contact-message/contact-message.service";
import {DatePipe, NgForOf, NgIf, SlicePipe} from "@angular/common";

@Component({
  selector: 'app-contacts',
  standalone: true,
  imports: [
    NgForOf,
    DatePipe,
    SlicePipe,
    NgIf
  ],
  templateUrl: './contacts.component.html',
  styleUrl: './contacts.component.scss'
})
export class ContactsComponent implements OnInit {
  messages: ContactMessage[] = [];
  selectedMessage: ContactMessage | null = null;

  constructor(private contactMessageService: ContactMessageService) {}

  ngOnInit(): void {
    this.loadMessages();
  }

  loadMessages(): void {
    this.contactMessageService.getMessages().subscribe({
      next: (data) => {
        this.messages = data;
      },
      error: (err) => {
        console.error('Erreur lors de la récupération des messages', err);
      }
    });
  }

  openMessage(message: ContactMessage): void {
    this.selectedMessage = message; // Store the selected message to display in the modal
  }

  closeMessage(): void {
    this.selectedMessage = null; // Close the modal by clearing the selected message
  }
}
