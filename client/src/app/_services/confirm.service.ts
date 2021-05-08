import { Injectable } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Observable } from 'rxjs';
import { ConfirmDoalogComponent } from '../modals/confirm-doalog/confirm-doalog.component';

@Injectable({
  providedIn: 'root'
})
export class ConfirmService {
  bsModalRef: BsModalRef;

  constructor(private bsModalService: BsModalService) { }

  confirm(title='Confirmation', message = 'Are you sure you want to do this?',
    btnOkText='Ok', btnCancelText='Cancel') : Observable<boolean>{
      const config = {
        initialState:{
          title,
          message,
          btnOkText,
          btnCancelText
        }
      };
      this.bsModalRef = this.bsModalService.show(ConfirmDoalogComponent, config);

      return new Observable<boolean>(this.getResult());
  }

  private getResult(){
    return (observer) => {
      const subsription = this.bsModalRef.onHidden.subscribe(() =>{
        observer.next(this.bsModalRef.content.result);
        observer.complete();
      });

      return {
        unsubscribe() {
          subsription.unsubscribe();
        }
      }
    }
  }
}
