import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Member } from '../_models/member';
import { PaginatedResult } from '../_models/pagination';
import { User } from '../_models/user';
import { UserParams } from '../_models/userParams';
import { AccountService } from './account.service';

@Injectable({
  providedIn: 'root'
})
export class MemberService {
  baseUrl =  environment.apiUrl;
  members: Member[] = [];
  memberCache = new Map();
  userParams: UserParams;
  user: User;

  constructor(private http: HttpClient, private accountService: AccountService) { 
    this.accountService.currentUser$.pipe(take(1)).subscribe(user =>{
      this.user = user;
      this.userParams = new UserParams(this.user);
    });
  }

  getUserParams(){
    return this.userParams;
  }

  setUserParams(userParams: UserParams){
    this.userParams = userParams;
  }

  resetUserParams(){
    this.userParams = new UserParams(this.user);
    return this.userParams;
  }

  getMembers(userParams: UserParams){
    var response = this.memberCache.get(Object.values(userParams).join('-'));

    if(response) return of(response);

    let param = this.getParamHeader(userParams.pageNumber, userParams.pageSize);

    param = param.append('minAge', userParams.minAge.toString());
    param = param.append('maxAge', userParams.maxAge.toString());
    param = param.append('gender', userParams.gender);
    param = param.append('orderBy', userParams.orderBy);

    return this.getPaginationResult<Member[]>(this.baseUrl + 'users',param)
      .pipe(map(response =>{
        this.memberCache.set(Object.values(userParams).join('-'), response);
        return response;
      }));
  }

  private getPaginationResult<T>(url: string, param: HttpParams) {
    let paginatedResult: PaginatedResult<T> = new PaginatedResult<T>();

    return this.http.get<T>(url, { observe: 'response', params: param }).pipe(
      map(response => {
        paginatedResult.result = response.body;

        if (response.headers.get('Pagination')) {
          paginatedResult.pagination = JSON.parse(response.headers.get('Pagination'));
        }
        return paginatedResult;
      })
    );
  }

  getParamHeader(pageNumber: number, pageSize: number){
    let param = new HttpParams();
    param = param.append('pageNumber', pageNumber.toString());
    param = param.append('pageSize', pageSize.toString());
    return param;
  }

  getMember(username: string){
    // const member = this.members.find(x => x.userName === username);
    const member = [...this.memberCache.values()]
                    .reduce((arr, elemet) => arr.concat(elemet.result),[])
                    .find((member: Member) => member.userName === username);

    if(member !== undefined) return of(member);

    return this.http.get<Member>(this.baseUrl + 'users/'+ username);
  }

  updateMember(member: Member){
   
    return this.http.put(this.baseUrl + 'users', member).pipe(
      map(() =>{
        const index = this.members.indexOf(member);
        this.members[index] = member;
      })
    );
  }
  setMainPhoto(photoId: number){
    return this.http.put(this.baseUrl + 'users/set-main-photo/' + photoId, {});
  }
  deletePhoto(photoId: number){
    return this.http.delete(this.baseUrl + 'users/delete-photo/' + photoId);
  }
}
