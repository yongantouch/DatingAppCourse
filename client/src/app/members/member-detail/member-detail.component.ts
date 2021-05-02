import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgxGalleryAnimation, NgxGalleryImage, NgxGalleryOptions } from '@kolkov/ngx-gallery';
import { TabDirective, TabsetComponent } from 'ngx-bootstrap/tabs';
import { Member } from 'src/app/_models/member';
import { Message } from 'src/app/_models/message';
import { MemberService } from 'src/app/_services/member.service';
import { MessageService } from 'src/app/_services/message.service';

@Component({
  selector: 'app-member-detail',
  templateUrl: './member-detail.component.html',
  styleUrls: ['./member-detail.component.css']
})
export class MemberDetailComponent implements OnInit {
  @ViewChild('memberTabs',{static: true}) memberTab: TabsetComponent;
  member: Member;
  galleryOptions: NgxGalleryOptions[];
  galleryImages: NgxGalleryImage[];
  activeTab: TabDirective;
  messages: Message[] = [];

  constructor(private memberService: MemberService,private activatedRoute: ActivatedRoute,
    private messageService: MessageService) { }

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
      this.loadMessages();
    }
  }

  selectedTab(tabIndex: number){
    this.memberTab.tabs[tabIndex].active=true;
  }
}
