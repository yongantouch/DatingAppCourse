import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { NavigationExtras, Router } from '@angular/router';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

  constructor(private toast: ToastrService, private router: Router) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      catchError(error => {
        if(error){
          switch(error.status){
            case 400:
              if(error.error.errors){
                const modelState = [];
                for(const key in error.error.errors){
                  if(error.error.errors[key]){
                    modelState.push(error.error.errors[key]);
                  }
                }
                throw modelState.flat();
              }else if(error.error === 'object'){
                this.toast.error(error.statusText, error.status);
              }
              else{
                this.toast.error(error.error, error.status);
              }
              break;
            case 401:
              this.toast.error(error.statusText, error.status);
              break;
            case 404:
              this.router.navigateByUrl('/not-found')
              break;
            case 500:
              const extras : NavigationExtras = {state: {error: error.error}};
              this.router.navigateByUrl('/server-error', extras);
              break;
            default:
              break;
          }
        }
        return throwError(error);
      })
    );
  }
}
