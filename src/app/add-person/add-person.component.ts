import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { AddressBookService } from '../services/address-book.service';

@Component({
  selector: 'app-add-person',
  templateUrl: './add-person.component.html',
  styleUrls: ['./add-person.component.css']
})
export class AddPersonComponent {
  personForm: FormGroup;
  isSubmitting = false; // ✅ Prevent multiple requests

  constructor(
    private fb: FormBuilder,
    private addressBookService: AddressBookService,
    private dialogRef: MatDialogRef<AddPersonComponent> // ✅ Inject dialog reference
  ) {
    this.personForm = this.fb.group({
      fullName: ['', Validators.required],
      address: ['', Validators.required],
      city: ['', Validators.required],
      state: ['', Validators.required],
      zipcode: ['', Validators.required],
      phoneNumber: ['', [Validators.required, Validators.pattern('^\\d{10}$')]]
    });
  }

  onSubmit(): void {
    if (this.personForm.valid && !this.isSubmitting) {
      this.isSubmitting = true; // ✅ Prevent duplicate requests
      console.log('Submitting Form:', this.personForm.value); // Debugging

      this.addressBookService.addPerson(this.personForm.value).subscribe(
        (response) => {
          console.log('✅ Person added successfully!', response);
          this.isSubmitting = false;
          this.dialogRef.close(response); // ✅ Close dialog with response
        },
        (error) => {
          console.error('❌ Error adding person:', error);
          this.isSubmitting = false;
        }
      );
    } else {
      console.log('❌ Form is invalid or already submitting!');
    }
  }

  resetForm(): void {
    this.personForm.reset();
  }
}
