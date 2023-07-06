import { Component, OnInit } from '@angular/core';
import {HttpErrorResponse} from "@angular/common/http";
import {Contact} from "../interfaces/contact.interface";
import {ContactService} from "../services/contact.service";
import {MatExpansionModule} from "@angular/material/expansion";
import {NgForOf} from "@angular/common";
import {MatIconModule} from "@angular/material/icon";
import {MatPaginatorModule} from "@angular/material/paginator";
import {MatDialog} from "@angular/material/dialog";
import {NgForm} from "@angular/forms";

@Component({
  selector: 'app-contact-panel',
  templateUrl: './contact-panel.component.html',
  styleUrls: ['./contact-panel.component.css'],
  standalone: true,
    imports: [MatExpansionModule, NgForOf, MatIconModule, MatPaginatorModule]
})
export class ContactPanelComponent implements OnInit {

  constructor(private contactService: ContactService, private dialog: MatDialog) { }

  public contacts: Contact[] = [];

  public panelOpenState = false;

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
          console.log(error.message)
        }
      }
    )
  }

  openDialog() {
    const dialogRef = this.dialog.open(AddContactDialog);
    dialogRef.afterClosed().subscribe(result => {
      setTimeout(() => {
        console.log("Get contacts function called")
        this.getContacts();
        console.log(this.contacts)
      },2000);
    });
  }



}

@Component({
  selector: 'add-contact-dialog',
  templateUrl: 'add-contact-dialog.html',
  styleUrls: ['add-contact-dialog.css']
})
export class AddContactDialog {

  constructor(private contactService: ContactService) { }

  onSubmit(addContactForm: NgForm) {
    console.log("form submitted")
    const formValue = addContactForm.value;
    console.log(formValue);

    this.contactService.addContact(formValue).subscribe(
      {
        next: (response: Contact) => {
          console.log("contact added");
          console.log(response)
        },
        error: (error: HttpErrorResponse) => {
          console.log("contact not added")
          console.log(error.message)
        }
      }
    );
  }
}
