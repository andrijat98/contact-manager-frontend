import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSliderModule } from '@angular/material/slider';
import { LoginComponent } from './login/login.component';
import { HttpClientModule } from "@angular/common/http";
import {AppHeaderComponent} from "./app-header/app-header.component";


@NgModule({
  declarations: [
    AppComponent,
  ],
  providers: [],
  bootstrap: [AppComponent],
  imports: [BrowserAnimationsModule, MatSliderModule, LoginComponent, HttpClientModule, AppHeaderComponent]
})
export class AppModule { }
