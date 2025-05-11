import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {HttpClient} from "@angular/common/http";
import {ToastrService} from "ngx-toastr";

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [
    ReactiveFormsModule
  ],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.scss'
})
export class ContactComponent implements OnInit {
  private apiURL = 'http://127.0.0.1:8000/api/contact';
  contactForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.contactForm = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(100)]],
      email: ['', [Validators.required, Validators.email]],
      message: ['', [Validators.required, Validators.maxLength(1000)]]
    });
  }

  submitForm(): void {
    if (this.contactForm.invalid) return;

    const formData = this.contactForm.value;

    this.http.post(this.apiURL + '/create', formData).subscribe({
      next: () => {
        this.toastr.success('Message sent successfully!');
        this.contactForm.reset();
      },
      error: () => {
        this.toastr.error('An error occurred. Please try again.');
      }
    });
  }
}
