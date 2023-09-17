import {Component, Inject, OnInit} from '@angular/core';
import {HttpErrorResponse} from "@angular/common/http";
import {Contact} from "../interfaces/contact.interface";
import {ContactService} from "../services/contact.service";
import {MatExpansionModule} from "@angular/material/expansion";
import {NgForOf} from "@angular/common";
import {MatIconModule} from "@angular/material/icon";
import {MatButtonModule} from "@angular/material/button";
import {MatPaginatorModule, PageEvent} from "@angular/material/paginator";
import {MAT_DIALOG_DATA, MatDialog} from "@angular/material/dialog";
import {FormsModule, NgForm} from "@angular/forms";
import {ContactType} from "../interfaces/contact-type.interface";
import {MatSnackBar} from "@angular/material/snack-bar";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {MatSelectModule} from "@angular/material/select";
import {Count} from "../interfaces/count.interface";

@Component({
  selector: 'app-contact-panel',
  templateUrl: './contact-panel.component.html',
  styleUrls: ['./contact-panel.component.css'],
  standalone: true,
  imports: [MatExpansionModule, NgForOf, MatIconModule, MatPaginatorModule, MatButtonModule, FormsModule, MatFormFieldModule, MatInputModule, MatSelectModule]
})
export class ContactPanelComponent implements OnInit {

  constructor(private contactService: ContactService, private dialog: MatDialog, private snackBar: MatSnackBar) { }

  public contacts: Contact[] = [];
  private fileToUpload: File | null = null;
  public fileName: string = '';
  selectedSearchParameter: string = 'firstName';
  selectedSortBy: string = 'firstName';
  public pageLength: number = 0;
  public pageIndex: number = 0;
  public pageSize: number = 10;

  ngOnInit(): void {
    this.countContacts();
    this.getContacts();
  }

  getContacts(): void {
    this.countContacts();
    this.contactService.getAllContacts(this.pageIndex, this.pageSize).subscribe(
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

  countContacts() {
    this.contactService.countContacts().subscribe(
      {
        next: (result: Count) => {
          this.pageLength = result.count;
        },
        error: (error: HttpErrorResponse) => {
          this.snackBar.open(error.message, 'Close', {
            duration: 3000
          })
        }
      }
    )
  }

  handlePageEvent(event: PageEvent) {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.getContacts();
  }

  searchContact(searchContactForm: NgForm) {

    const formValue = searchContactForm.value;
    formValue.page = 0;
    formValue.size = 10;
    this.contactService.searchContacts(searchContactForm.value).subscribe(
      {
        next: (result: Contact[]) => {
          this.contacts = result;
          if (this.contacts.length === 0) {
            this.snackBar.open('No contacts found', 'Close', {
              duration: 3000
            })
          }
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

  downloadCsvFile() {
    this.contactService.getCsvFile().subscribe(
      {
        next: (result) => {
          if (result.body) {
            console.log(result.body);
            this.saveFile(result.body);
          }

        },
        error: (error: HttpErrorResponse) => {
          console.log(error);
          this.snackBar.open('Error while exporting csv file', 'Close', {
            duration: 5000
          })
        }
      }
    );
  }

  saveFile(data: any) {
    const blob = new Blob([data], {type: 'text/csv'});
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = 'contacts.csv';
    link.click();
  }

  uploadCsvFile() {
    if (this.fileToUpload) {
      this.contactService.uploadCsvFile(this.fileToUpload).subscribe(
        {
          next: (result) => {
            this.snackBar.open(result, 'Close', {
              duration: 5000
            })
            this.getContacts();
            this.fileToUpload = null;
            this.fileName = '';
          },
          error: (error: HttpErrorResponse) => {
            this.snackBar.open(error.message, 'Close', {
              duration: 5000
            })
          }
        }
      )
    } else {
      this.snackBar.open('Please select a .csv file', 'Close', {
        duration: 5000
      })
    }
  }

  onFileSelected(event: any) {
    this.fileToUpload = event.target.files[0];
    if(this.fileToUpload) {
      this.fileName = this.fileToUpload.name;
    }
  }

  openAddDialog() {
    const dialogRef = this.dialog.open(AddContactDialog, {disableClose: true});
    dialogRef.afterClosed().subscribe(() => {
      setTimeout(() => {
        this.getContacts();
      },100);
    });
  }

  openEditDialog(contact: Contact) {
    let contactData: Contact = {...contact};
    const dialogRef = this.dialog.open(EditContactDialog, {data: contactData, disableClose: true});
    dialogRef.afterClosed().subscribe(() => {
      setTimeout(() => {
        this.getContacts();
      },100);
    });
  }

  openDeleteDialog(contact: Contact) {
    let contactData: Contact = {...contact};
    const dialogRef = this.dialog.open(DeleteContactDialog, {data: contactData, disableClose: true});
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
