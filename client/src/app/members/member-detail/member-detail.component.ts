import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgxGalleryAnimation, NgxGalleryImage, NgxGalleryOptions } from '@kolkov/ngx-gallery';
import { TabDirective, TabsetComponent } from 'ngx-bootstrap/tabs';
import { take } from 'rxjs/operators';
import { Member } from 'src/app/_models/member';
import { Message } from 'src/app/_models/message';
import { User } from 'src/app/_models/user';
import { AccountService } from 'src/app/_services/account.service';
import { MemberService } from 'src/app/_services/member.service';
import { MessageService } from 'src/app/_services/message.service';
import { PresenceService } from 'src/app/_services/presence.service';

@Component({
  selector: 'app-member-detail',
  templateUrl: './member-detail.component.html',
  styleUrls: ['./member-detail.component.css']
})
export class MemberDetailComponent implements OnInit, OnDestroy {
  @ViewChild('memberTabs',{static: true}) memberTab: TabsetComponent;
  member: Member;
  galleryOptions: NgxGalleryOptions[];
  galleryImages: NgxGalleryImage[];
  activeTab: TabDirective;
  messages: Message[] = [];
  user: User;

  constructor(public presenceService: PresenceService,private activatedRoute: ActivatedRoute,
    private messageService: MessageService, private accountService: AccountService) { 
      this.accountService.currentUser$.pipe(take(1)).subscribe(user =>{
        this.user = user;
      });
    }
  ngOnDestroy(): void {
    this.messageService.stopHubConnection();
  }

    ngOnInit(): void {
      this.activatedRoute.data .subscribe(data => {
      this.member = data.member;
    })

    this.activatedRoute.queryParams.subscribe(params =>{
      params.tab? this.selectedTab(params.tab) : this.selectedTab(0);
    });

    this.galleryOptions = [{
      width: '500px',
      height: '500px',
      imagePercent: 100,
      thumbnailsColumns: 4,
      imageAnimation: NgxGalleryAnimation.Slide,
      preview: false
    }];
    this.galleryImages = this.getImages();
  }

  getImages() : NgxGalleryImage[] {
    const photoUrls = [];
    for(const photo of this.member.photos){
      photoUrls.push({
        small: photo?.url,
        medium: photo?.url,
        big: photo?.url
      });
    }
    return photoUrls;
  }

  loadMessages(){
    this.messageService.getMessageThread(this.member.userName).subscribe(response =>{
      this.messages = response;
    });
  }

  onTabActivated(data: TabDirective){
    this.activeTab = data;
    if(this.activeTab.heading == "Message" && this.messages.length ===0){
      //this.loadMessages();
      this.messageService.createHubConnection(this.user, this.member.userName);
    } else{
      this.messageService.stopHubConnection();
    }
  }

  selectedTab(tabIndex: number){
    this.memberTab.tabs[tabIndex].active=true;
  }
}
