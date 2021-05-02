import { Component, OnInit } from '@angular/core';
import { Member } from '../_models/member';
import { Pagination } from '../_models/pagination';
import { MemberService } from '../_services/member.service';

@Component({
  selector: 'app-lists',
  templateUrl: './lists.component.html',
  styleUrls: ['./lists.component.css']
})
export class ListsComponent implements OnInit {
  members: Partial<Member[]>;
  predicate: 'liked';
  pageNumber = 1;
  pageSize = 5;
  pagination: Pagination;

  constructor(private memberService: MemberService) { }

  ngOnInit(): void {
  }

  loadLiked(){
    this.memberService.getLikes(this.predicate,this.pageNumber, this.pageSize).subscribe(response => {
      this.members = response.result;
      this.pagination = response.pagination;
    }, error => {
      console.log(error);
    });
  }

  pageChanged(e: any){
    this.pageNumber = e.page;
    this.loadLiked();
  }

}
