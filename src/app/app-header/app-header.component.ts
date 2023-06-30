import { Component, OnInit } from '@angular/core';
import {MatIconModule} from '@angular/material/icon';
import {MatToolbarModule} from '@angular/material/toolbar';

@Component({
  selector: 'app-header',
  templateUrl: './app-header.component.html',
  styleUrls: ['./app-header.component.css'],
  standalone: true,
  imports: [MatToolbarModule, MatIconModule]
})
export class AppHeaderComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
