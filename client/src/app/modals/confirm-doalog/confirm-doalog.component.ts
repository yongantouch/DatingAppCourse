import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-confirm-doalog',
  templateUrl: './confirm-doalog.component.html',
  styleUrls: ['./confirm-doalog.component.css']
})
export class ConfirmDoalogComponent implements OnInit {
  title: string;
  message: string;
  btnOkText: string;
  btnCancelText: string;
  result: boolean;

  constructor(public bsModalRef: BsModalRef) { }

  ngOnInit(): void {
  }

  confirm(){
    this.result = true;
    this.bsModalRef.hide();
  }
  decline(){
    this.result = false;
    this.bsModalRef.hide();
  }

}
