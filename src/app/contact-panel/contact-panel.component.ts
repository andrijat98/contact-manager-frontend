import {Component, Inject, OnInit} from '@angular/core';
import {HttpErrorResponse} from "@angular/common/http";
import {Contact} from "../interfaces/contact.interface";
import {ContactService} from "../services/contact.service";
import {MatExpansionModule} from "@angular/material/expansion";
import {NgForOf} from "@angular/common";
import {MatIconModule} from "@angular/material/icon";
import {MatButtonModule} from "@angular/material/button";
import {MatPaginatorModule} from "@angular/material/paginator";
import {MAT_DIALOG_DATA, MatDialog} from "@angular/material/dialog";
import {NgForm} from "@angular/forms";
import {ContactType} from "../interfaces/contact-type.interface";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'app-contact-panel',
  templateUrl: './contact-panel.component.html',
  styleUrls: ['./contact-panel.component.css'],
  standalone: true,
  imports: [MatExpansionModule, NgForOf, MatIconModule, MatPaginatorModule, MatButtonModule]
})
export class ContactPanelComponent implements OnInit {

  constructor(private contactService: ContactService, private dialog: MatDialog, private snackBar: MatSnackBar) { }

  public contacts: Contact[] = [];

  ngOnInit(): void {
    this.getContacts();
  }

  getContacts(): void {
    this.contactService.getAllContacts().subscribe(
      {
        next: (result: Contact[]) => {
          this.contacts = result;
        },
        error: (error: HttpErrorResponse) => {
          this.snackBar.open(error.message, 'Close', {
            duration: 3000
          })
        }
      }
    )
  }

  openAddDialog() {
    const dialogRef = this.dialog.open(AddContactDialog);
    dialogRef.afterClosed().subscribe(() => {
      setTimeout(() => {
        this.getContacts();
      },100);
    });
  }

  openEditDialog(contact: Contact) {
    let contactData: Contact = {...contact};
    const dialogRef = this.dialog.open(EditContactDialog, {data: contactData});
    dialogRef.afterClosed().subscribe(() => {
      setTimeout(() => {
        this.getContacts();
      },100);
    });
  }

  openDeleteDialog(contact: Contact) {
    let contactData: Contact = {...contact};
    const dialogRef = this.dialog.open(DeleteContactDialog, {data: contactData});
    dialogRef.afterClosed().subscribe(() => {
      setTimeout(() => {
        this.getContacts();
      },100);
    });
  }
}

@Component({
  selector: 'add-contact-dialog',
  templateUrl: 'add-contact-dialog.html',
  styleUrls: ['contact-dialog.css']
})
export class AddContactDialog implements OnInit{

  contactTypes: ContactType[] = [];

  constructor(private contactService: ContactService, private snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.getAllContactTypes();
  }

  getAllContactTypes() {
    this.contactService.getContactTypes().subscribe(
      {
        next: (result: ContactType[]) => {
          this.contactTypes = result;
        },
        error: (error: HttpErrorResponse) => {
          this.snackBar.open(error.message, 'Close', {
            duration: 3000
          })
        }
      }
    )
  }

  onSubmit(addContactForm: NgForm) {

    const formValue = addContactForm.value;

    this.contactService.addContact(formValue).subscribe(
      {
        next: (response: Contact) => {
          this.snackBar.open('Contact ' + response.firstName + ' added', 'Close', {
            duration: 1500
          })
        },
        error: (error: HttpErrorResponse) => {
          const keys = Object.keys(error.error);
          const errorMessage = error.error[keys[keys.length - 1]];
          this.snackBar.open(errorMessage, 'Close', {
            duration: 5000
          })
        }
      }
    );
  }
}

@Component({
  selector: 'edit-contact-dialog',
  templateUrl: 'edit-contact-dialog.html',
  styleUrls: ['contact-dialog.css']
})
export class EditContactDialog implements OnInit{

  contactTypes: ContactType[] = [];

  constructor(private contactService: ContactService, @Inject(MAT_DIALOG_DATA) public data: Contact, private snackBar: MatSnackBar) { }

  ngOnInit(): void {
        this.getAllContactTypes();
  }

  getAllContactTypes() {
    this.contactService.getContactTypes().subscribe(
      {
        next: (result: ContactType[]) => {
          this.contactTypes = result;
        },
        error: (error: HttpErrorResponse) => {
          this.snackBar.open(error.message, 'Close', {
            duration: 3000
          })
        }
      }
    )
  }

  onSubmit(updateContactForm: NgForm) {

    const formValue = updateContactForm.value;
    console.log(formValue);

    this.contactService.editContact(formValue).subscribe(
      {
        next: (response: Contact) => {
          this.snackBar.open('Contact ' + response.firstName + ' edited', 'Close', {
            duration: 1500
          })
        },
        error: (error: HttpErrorResponse) => {
          const keys = Object.keys(error.error);
          const errorMessage = error.error[keys[keys.length - 1]];
          this.snackBar.open(errorMessage, 'Close', {
            duration: 5000
          })
        }
      }
    );
  }
}

@Component({
  selector: 'delete-contact-dialog',
  templateUrl: 'delete-contact-dialog.html',
  styleUrls: ['contact-dialog.css']
})
export class DeleteContactDialog {

  constructor(private contactService: ContactService, @Inject(MAT_DIALOG_DATA) public data: Contact, private snackBar: MatSnackBar) { }

  onSubmit(contactTsid: string) {

    this.contactService.deleteContact(contactTsid).subscribe(
      {
        next: () => {
          this.snackBar.open('Contact deleted', 'Close', {
            duration: 1500
          })
        },
        error: (error: HttpErrorResponse) => {
          this.snackBar.open(error.message, 'Close', {
            duration: 3000
          })
        }
      }
    );
  }
}
