import {Component, Inject, OnInit} from '@angular/core';
import {MatIconModule} from "@angular/material/icon";
import {MatExpansionModule} from "@angular/material/expansion";
import {MatPaginatorModule} from "@angular/material/paginator";
import {User} from "../interfaces/user.interface";
import {MAT_DIALOG_DATA, MatDialog} from "@angular/material/dialog";
import {UserService} from "../services/user.service";
import {HttpErrorResponse} from "@angular/common/http";
import {NgForOf} from "@angular/common";
import {MatButtonModule} from "@angular/material/button";
import {NgForm} from "@angular/forms";
import {UserRole} from "../interfaces/userRole.interface";
import {ContactService} from "../services/contact.service";
import {ContactType} from "../interfaces/contact-type.interface";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'app-admin-panel',
  standalone: true,
  templateUrl: './admin-panel.component.html',
  imports: [
    MatIconModule,
    MatExpansionModule,
    MatPaginatorModule,
    NgForOf,
    MatButtonModule,
  ],
  styleUrls: ['./admin-panel.component.css']
})
export class AdminPanelComponent implements OnInit {

  public users: User[] = [];

  constructor(private userService: UserService, private dialog: MatDialog, private snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.getAllUsers();
  }

  getAllUsers() {
    this.userService.getAllUsers().subscribe(
      {
        next: (result: User[]) => {
          this.users = result;
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
    const dialogRef = this.dialog.open(AddUserDialog);
    dialogRef.afterClosed().subscribe(() => {
      setTimeout(() => {
        this.getAllUsers();
      },1000);
    });
  }

  openEditDialog(user: User) {
    let userData: User = {...user};
    const dialogRef = this.dialog.open(EditUserDialog, {data: userData});
    dialogRef.afterClosed().subscribe(() => {
      setTimeout(() => {
        this.getAllUsers();
      },100);
    });
  }

  openDeleteDialog(user: User) {
    let userData: User = {...user};
    const dialogRef = this.dialog.open(DeleteUserDialog, {data: userData});
    dialogRef.afterClosed().subscribe(() => {
      setTimeout(() => {
        this.getAllUsers();
      },100);
    });
  }

  openAddContactTypeDialog() {
    const dialogRef = this.dialog.open(ContactTypesDialog, {
      width: '500px'
    });
    dialogRef.afterClosed().subscribe(() => {
      setTimeout(() => {
        this.getAllUsers();
      },100);
    });
  }
}

@Component({
  selector: 'add-user-dialog',
  templateUrl: 'add-user-dialog.html',
  styleUrls: ['user-dialog.css']
})
export class AddUserDialog implements OnInit{

  userRoles: UserRole[] = [];

  constructor(private userService: UserService, private snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.getAllUserRoles();
  }

  getAllUserRoles() {
    this.userService.getAllUserRoles().subscribe(
      {
        next: (result: UserRole[]) => {
          this.userRoles = result;
          this.userRoles.forEach(role => role.selected = false);
        },
        error: (error: HttpErrorResponse) => {
          this.snackBar.open(error.message, 'Close', {
            duration: 3000
          })
        }
      }
    )
  }

  onSubmit(addUserForm: NgForm) {

    const formValue = addUserForm.value;
    const userRoleTsids: string[] = [];
    this.userRoles.forEach(role => {
      if (role.selected) {
        userRoleTsids.push(role.roleTsid);
      }
    })
    formValue.userRoleTsids = userRoleTsids;
    this.userService.addUser(formValue).subscribe(
      {
        next: (response: User) => {
          this.snackBar.open('User ' + response.firstName + ' added', 'Close', {
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
  selector: 'edit-user-dialog',
  templateUrl: 'edit-user-dialog.html',
  styleUrls: ['user-dialog.css']
})
export class EditUserDialog implements OnInit{

  userRoles: UserRole[] = [];

  constructor(private userService: UserService, @Inject(MAT_DIALOG_DATA) public data: User, private snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.getAllUserRoles();
  }

  getAllUserRoles() {
    this.userService.getAllUserRoles().subscribe(
      {
        next: (result: UserRole[]) => {
          this.userRoles = result;
          this.userRoles.forEach(role => {
            role.selected = false;
          this.data.roles.forEach(userRole => {
            if (userRole.roleTsid === role.roleTsid) {
              role.selected = true;
            }
          })
          });
        },
        error: (error: HttpErrorResponse) => {
          this.snackBar.open(error.message, 'Close', {
            duration: 3000
          })
        }
      }
    )
  }

  onSubmit(updateUserForm: NgForm) {
    const formValue = updateUserForm.value;
    const userRoleTsids: string[] = [];
    this.userRoles.forEach(role => {
      if (role.selected) {
        userRoleTsids.push(role.roleTsid);
      }
    })
    formValue.userRoleTsids = userRoleTsids;
    console.log(formValue);

    this.userService.updateUser(formValue).subscribe(
      {
        next: (response: User) => {
          this.snackBar.open('User ' + response.firstName + ' updated', 'Close', {
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
  selector: 'delete-user-dialog',
  templateUrl: 'delete-user-dialog.html',
  styleUrls: ['user-dialog.css']
})
export class DeleteUserDialog {

  constructor(private userService: UserService, @Inject(MAT_DIALOG_DATA) public data: User, private snackBar: MatSnackBar) { }

  onSubmit(userTsid: string) {

    this.userService.deleteUser(userTsid).subscribe(
      {
        next: () => {
          this.snackBar.open('User deleted', 'Close', {
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

@Component({
  selector: 'contact-types-dialog',
  templateUrl: 'contact-types-dialog.html',
  styleUrls: ['user-dialog.css']
})

export class ContactTypesDialog implements OnInit{

  public contactTypes: ContactType[] = [];

  constructor(private contactService: ContactService, private snackBar: MatSnackBar) {}

  ngOnInit(): void {
    this.getContactTypes();
  }

  getContactTypes() {
    this.contactService.getContactTypes().subscribe(
      {
        next: (response: ContactType[]) => {
          this.contactTypes = response;
      },
        error: (error: HttpErrorResponse) => {
          this.snackBar.open(error.message, 'Close', {
            duration: 3000
          });
        }
      }
    )
  }

  onSubmit(addContactTypeForm: NgForm) {
    this.contactService.addContactType(addContactTypeForm.value).subscribe(
      {
        next: () => {
          this.getContactTypes();
        },
        error: (error: HttpErrorResponse) => {
          this.snackBar.open(error.message, 'Close', {
            duration: 3000
          });
        }
      }
    )
  }
}
