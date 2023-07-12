import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {Contact} from "../interfaces/contact.interface";
import {ContactType} from "../interfaces/contact-type.interface";

@Injectable({
  providedIn: 'root'
})
export class ContactService {

  private serverUrl: string = "http://localhost:8080";

  constructor(private http: HttpClient) { }

  public getAllContacts(): Observable<Contact[]> {
    return this.http.get<Contact[]>(`${this.serverUrl}/contact/get-all/page/0/size/10/sort-by/firstName`);
  }

  public addContact(contact: FormData) {
    return this.http.post<Contact>(`${this.serverUrl}/contact/add`, contact);
  }

  public editContact(contact: FormData) {
    return this.http.put<Contact>(`${this.serverUrl}/contact/edit`, contact);
  }

  public getContactTypes(): Observable<ContactType[]> {
    return this.http.get<ContactType[]>(`${this.serverUrl}/contact-type/get-all`);
  }

  public deleteContact(contactTsid: string): Observable<any> {
    return this.http.delete(`${this.serverUrl}/contact/delete/${contactTsid}`);
  }

  public addContactType(contactType: FormData) {
    return this.http.post<ContactType>(`${this.serverUrl}/contact-type/add`, contactType);
  }
}
