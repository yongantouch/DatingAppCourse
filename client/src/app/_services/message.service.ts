import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Message } from '../_models/message';
import { getPaginationResult, getParamHeader } from './paginationHelper';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getMessages(pageNumber:number, pageSize:number, container: string){
    let param = getParamHeader(pageNumber,pageSize);
    param = param.append('container', container);
    return getPaginationResult<Message[]>(this.baseUrl + 'messages',param, this.http);
  }

  getMessageThread(username: string){
    return this.http.get<Message[]>(this.baseUrl + 'messages/thread/' + username);
  }
  sendMessage(username:string, content:string){
    return this.http.post<Message>(this.baseUrl + 'messages', {recipientUsername: username, content});
  }
  deleteMessage(id: number){
    return this.http.delete(this.baseUrl + 'messages/'+ id);
  }
}
