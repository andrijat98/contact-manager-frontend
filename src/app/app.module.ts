import {NgModule} from '@angular/core';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSliderModule } from '@angular/material/slider';
import { LoginComponent } from './login/login.component';
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import {AppHeaderComponent} from "./app-header/app-header.component";
import {RouterModule, Routes} from "@angular/router";
import {
  AddContactDialog,
  ContactPanelComponent,
  DeleteContactDialog,
  EditContactDialog
} from './contact-panel/contact-panel.component';
import {AuthInterceptor} from "./auth/auth.interceptor";

import {MatDialogModule} from "@angular/material/dialog";
import {MatButtonModule} from "@angular/material/button";
import {FormsModule} from "@angular/forms";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {MatSelectModule} from "@angular/material/select";
import {AuthGuard} from "./auth/auth.guard";
import {
  AddUserDialog,
  AdminPanelComponent,
  DeleteUserDialog,
  EditUserDialog,
  ContactTypesDialog
} from './admin-panel/admin-panel.component';
import {MatCheckboxModule} from "@angular/material/checkbox";

const appRoutes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'contacts', component: ContactPanelComponent, canActivate: [AuthGuard], data: {requiresLogin: true} },
  { path: 'login', component: LoginComponent },
  { path: 'users', component: AdminPanelComponent, canActivate: [AuthGuard], data: {requiresAdmin: true}}
];

@NgModule({
  declarations: [
    AppComponent,
    AddContactDialog,
    EditContactDialog,
    DeleteContactDialog,
    EditUserDialog,
    DeleteUserDialog,
    AddUserDialog,
    ContactTypesDialog
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }
  ],

  bootstrap: [AppComponent],
  imports: [
    BrowserAnimationsModule,
    MatSliderModule,
    LoginComponent,
    HttpClientModule,
    AppHeaderComponent,
    ContactPanelComponent,
    RouterModule.forRoot(appRoutes),
    MatDialogModule,
    MatButtonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    AdminPanelComponent,
    MatCheckboxModule,
  ]
})
export class AppModule{
}
