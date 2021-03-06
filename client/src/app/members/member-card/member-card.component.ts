import { Component, Input, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Member } from 'src/app/_models/member';
import { MemberService } from 'src/app/_services/member.service';
import { PresenceService } from 'src/app/_services/presence.service';

@Component({
  selector: 'app-member-card',
  templateUrl: './member-card.component.html',
  styleUrls: ['./member-card.component.css']
})
export class MemberCardComponent implements OnInit {
  @Input() member: Member;

  constructor(private memberService: MemberService, private toast: ToastrService,
    public presenceService: PresenceService) { }

  ngOnInit(): void {
    console.log(this.member);
  }

  addLike(member: Member){
    this.memberService.addLike(member.userName).subscribe(() =>{
      this.toast.success('You have liked ' + member.userName);
    })
  }

}
