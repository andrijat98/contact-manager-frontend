import {Component, Inject, OnInit} from '@angular/core';
import {MatIconModule} from '@angular/material/icon';
import {MatToolbarModule} from '@angular/material/toolbar';
import {RouterLink} from "@angular/router";
import {LoginService} from "../services/login.service";
import {NgIf} from "@angular/common";
import {UserService} from "../services/user.service";
import {MAT_DIALOG_DATA, MatDialog} from "@angular/material/dialog";
import {User} from "../interfaces/user.interface";
import {MatSnackBar} from "@angular/material/snack-bar";
import {HttpErrorResponse} from "@angular/common/http";
import {NgForm} from "@angular/forms";
import {ContactService} from "../services/contact.service";

@Component({
  selector: 'app-header',
  templateUrl: './app-header.component.html',
  styleUrls: ['./app-header.component.css'],
  standalone: true,
  imports: [MatToolbarModule, MatIconModule, RouterLink, NgIf]
})
export class AppHeaderComponent implements OnInit {

  constructor(private loginService: LoginService, private dialog: MatDialog) { }

  ngOnInit(): void {}

  loggedInUser = this.loginService.loggedInUser;

  onLogout() {
    this.loginService.logout();
    this.loggedInUser = this.loginService.loggedInUser;
  }

  openEditUserDialog() {
    let userData: User = {...this.loggedInUser};
    this.dialog.open(EditRegularUserDialog, {data: userData, disableClose: true});
  }
}

@Component({
  selector: 'edit--regular-user-dialog',
  templateUrl: 'edit-regular-user-dialog.html',
  styleUrls: ['../admin-panel/user-dialog.css']
})
export class EditRegularUserDialog {

  constructor(
    private userService: UserService,
    @Inject(MAT_DIALOG_DATA) public data: User,
    private snackBar: MatSnackBar,
    private contactService: ContactService,
    private loginService: LoginService
  ) { }

  public isVerified: boolean = this.loginService.loggedInUser.isPhoneVerified;
  public codeFormShown: boolean = false;

  onSubmit(updateUserForm: NgForm) {

    const formValue = updateUserForm.value;

    if (formValue.password === '') {
      delete formValue.password;
    }

    this.userService.updateUser(formValue).subscribe(
      {
        next: () => {
          this.loginService.login();
          this.snackBar.open('Your user info has been updated', 'Close', {
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

  onVerifyPhoneNumber() {
    this.contactService.verifyPhoneNumber().subscribe(
      {
        next: () => {
          this.codeFormShown = true;
        },
        error: () => {
          this.snackBar.open('Verification failed, request a new verification code', 'Close', {
            duration: 5000
          })
        }
      }
    )
  }

  onSendVerificationCode(verifyPhoneForm: NgForm) {
    const code: string = verifyPhoneForm.value.verificationCode;
    this.contactService.sendVerificationCode(code).subscribe(
      {
        next: () => {
          this.loginService.login();
          this.isVerified = true;
        },
        error: () => {
          this.snackBar.open('Incorrect or expired code', 'Close', {
            duration: 5000
          })
        }
      }
    )
  }
}
