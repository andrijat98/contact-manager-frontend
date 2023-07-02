import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSliderModule } from '@angular/material/slider';
import { LoginComponent } from './login/login.component';
import { HttpClientModule } from "@angular/common/http";
import {AppHeaderComponent} from "./app-header/app-header.component";
import {RouterModule, Routes} from "@angular/router";
import { ContactPanelComponent } from './contact-panel/contact-panel.component';

const appRoutes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'contacts', component: ContactPanelComponent }
];

@NgModule({
  declarations: [
    AppComponent,
    ContactPanelComponent,
  ],
  providers: [],
  bootstrap: [AppComponent],
  imports: [
    BrowserAnimationsModule,
    MatSliderModule,
    LoginComponent,
    HttpClientModule,
    AppHeaderComponent,
    RouterModule.forRoot(appRoutes)
  ]
})
export class AppModule { }
