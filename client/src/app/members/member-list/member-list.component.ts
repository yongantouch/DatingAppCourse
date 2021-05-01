import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { Member } from 'src/app/_models/member';
import { Pagination } from 'src/app/_models/pagination';
import { User } from 'src/app/_models/user';
import { UserParams } from 'src/app/_models/userParams';
import { AccountService } from 'src/app/_services/account.service';
import { MemberService } from 'src/app/_services/member.service';

@Component({
  selector: 'app-member-list',
  templateUrl: './member-list.component.html',
  styleUrls: ['./member-list.component.css']
})
export class MemberListComponent implements OnInit {
  members$: Observable<Member[]>
  members: Member[];
  pagination: Pagination;
  userParams: UserParams;
  genderList = [{value: 'male', display: 'Males'}, {value: 'female', display: 'Females'}];

  constructor(private memberService: MemberService) {
    this.userParams = memberService.getUserParams();
  }

  ngOnInit(): void {
    this.loadMember();
  }

  resetFilter(){
    this.userParams = this.memberService.resetUserParams();
    this.loadMember();
  }

  loadMember(){
    this.memberService.setUserParams(this.userParams);
    this.memberService.getMembers(this.userParams).subscribe(response =>{
      this.members = response.result;
      this.pagination = response.pagination;
    });
  }

  pageChanged(e:any){
    this.userParams.pageNumber = e.page;
    this.memberService.setUserParams(this.userParams);
    this.loadMember();
  }
}
