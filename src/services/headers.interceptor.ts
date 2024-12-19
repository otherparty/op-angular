import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthenticateService } from './cognito.service';

@Injectable()
export class HeadersInterceptor implements HttpInterceptor {

  constructor(private readonly cognito: AuthenticateService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    // const user:any = this.cognito.getUser();
    const modifiedRequest = request.clone({
      setHeaders:{
        username: 'TEST'
      }
    })
    return next.handle(modifiedRequest);
  }
}