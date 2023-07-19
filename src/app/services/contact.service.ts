import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders, HttpResponse} from "@angular/common/http";
import {map, Observable} from "rxjs";
import {Contact} from "../interfaces/contact.interface";
import {ContactType} from "../interfaces/contact-type.interface";
import {Count} from "../interfaces/count.interface";

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

  public searchContacts(searchData: FormData): Observable<Contact[]> {
    return this.http.post<Contact[]>(`${this.serverUrl}/contact/search`, searchData);
  }

  public getCsvFile(): Observable<any> {
    let headers = new HttpHeaders();
    headers = headers.append('Accept', 'text/csv');
    headers = headers.append("Content-disposition", "attachment; filename=contacts.csv")

    return this.http.get(`${this.serverUrl}/contact/exportcsv`, {
      headers: headers,
      responseType: 'text',
      observe: 'response'
    });
  }

  public uploadCsvFile(file: File): Observable<string> {
    let headers = new HttpHeaders().append('Accept', 'text/plain');
    const formData: FormData = new FormData();
    formData.append('file', file, file.name);
    return this.http.post(`${this.serverUrl}/contact/importcsv`, formData,{
      headers: headers,
      responseType: 'arraybuffer',
      observe: "response"
    }).pipe(
      map(response => {
        const decoder = new TextDecoder('utf-8');
        let text = '';
        if (response.body) {
          text = decoder.decode(response.body);
        }
        return text;
      })
    );
  }

  public verifyPhoneNumber(): Observable<HttpResponse<any>> {
    return this.http.get<HttpResponse<any>>(`${this.serverUrl}/verification/get-phone-verification-code`);
  }

  public sendVerificationCode(code: String): Observable<HttpResponse<any>> {
    return this.http.get<HttpResponse<any>>(`${this.serverUrl}/verification/verify-phone/${code}`);
  }

  public countContacts(): Observable<Count> {
    return this.http.get<Count>(`${this.serverUrl}/contact/count`);
  }
}
