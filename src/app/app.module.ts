import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSliderModule } from '@angular/material/slider';
import { LoginComponent } from './login/login.component';
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import {AppHeaderComponent} from "./app-header/app-header.component";
import {RouterModule, Routes} from "@angular/router";
import {AddContactDialog, ContactPanelComponent} from './contact-panel/contact-panel.component';
import {AuthInterceptor} from "./auth/auth.interceptor";

import {MatDialogModule} from "@angular/material/dialog";
import {MatButtonModule} from "@angular/material/button";
import {FormsModule} from "@angular/forms";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {MatSelectModule} from "@angular/material/select";

const appRoutes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'contacts', component: ContactPanelComponent },
  { path: 'login', component: LoginComponent }
];

@NgModule({
  declarations: [
    AppComponent,
    AddContactDialog
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
    MatSelectModule
  ]
})
export class AppModule { }
