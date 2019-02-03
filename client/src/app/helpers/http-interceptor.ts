import { Injectable, Injector } from '@angular/core'
import {
    HttpInterceptor, HttpRequest, HttpResponse, HttpEvent, HttpHandler, HttpSentEvent,
    HttpHeaderResponse, HttpProgressEvent, HttpUserEvent, HttpErrorResponse, HttpHeaders
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { SnotifyService } from 'ng-snotify';
import { AuthenticationService} from "../services/authentication.service";
import { Router } from '@angular/router';
@Injectable({
    providedIn: 'root'
})

/**
 * @class 		: HttpInterceptor
 * @description : intercept the requestes to append the token
 */
export class HttpInterceptorHelper implements HttpInterceptor {
    public apiUrl: String = environment.apiUrl;
    constructor(private injector: Injector,private notificationService : SnotifyService,private router: Router) { }
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        // add token to request headers              
        let token = localStorage.getItem('token');

        // add it if we have one
        if (token) {
            request = request.clone({ headers: request.headers.set('x-access-token', token) });
        }
        const url = this.apiUrl + request.url;
        if (!request.headers.has('Content-Type') && !request.url.includes('saveFile') ) {
            request = request.clone({ headers: request.headers.set('Content-Type', 'application/json') });
        }
        let cloneReq;
        if (request.url.includes('downloadFile')) {
            cloneReq = request.clone({ url, responseType: 'blob' });
        } else {
            cloneReq = request.clone({ url });
        }
        return next.handle(cloneReq).pipe(
            //handling common errors 
            catchError((error, caught) => {
                try {
                    if(error.error.hasOwnProperty('auth') && error.error.auth === false){                       
                        this.notificationService.error('Sorry you must login', {
                            timeout: 2000,
                            showProgressBar: false,
                            closeOnClick: false,
                            pauseOnHover: false,
                            position:"rightTop"
                          });
                          localStorage.removeItem('token');
                          localStorage.removeItem('currentUser');
                          localStorage.removeItem('username');
                          this.router.navigate(['/']);
                    }else if(error.statusText == "Unknown Error"){
                        this.notificationService.error('Unable to connect to server, please try again later', {
                            timeout: 2000,
                            showProgressBar: false,
                            closeOnClick: false,
                            pauseOnHover: false,
                            position:"rightTop"
                          });
                    }
                } catch (ex) {
                    console.log(ex);
                }
                return throwError(error);
            }),
            map((ret) => {
                return ret;

            })

        );
    }
}
