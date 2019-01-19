import { Injectable, Injector } from '@angular/core'
import { HttpInterceptor, HttpRequest, HttpResponse, HttpEvent, HttpHandler, HttpSentEvent,
	HttpHeaderResponse, HttpProgressEvent, HttpUserEvent, HttpErrorResponse, HttpHeaders
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
@Injectable({
    providedIn: 'root'
})

/**
 * @class 		: HttpInterceptor
 * @description : intercept the requestes to append the token
 */
export class HttpInterceptorHelper implements HttpInterceptor {
    public apiUrl: String = environment.apiUrl;
    constructor(private injector: Injector) { }
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        // add token to request headers        
         // get the token from a service
         /*
         const token: string = localStorage.getItem('token');

         // add it if we have one
         if (token) {
            request = request.clone({ headers: request.headers.set('x-access-token', token) });
         }        */
        const url = this.apiUrl + request.url;
        if (!request.headers.has('Content-Type')) {
            request = request.clone({ headers: request.headers.set('Content-Type', 'application/json') });
        }
        let cloneReq;
        if (request.url.includes('images/')) {
            cloneReq = request.clone({  url, responseType: 'blob' });
        } else {
            cloneReq = request.clone({url });
        }
        console.log(cloneReq);
        return next.handle(cloneReq);
    }
}
