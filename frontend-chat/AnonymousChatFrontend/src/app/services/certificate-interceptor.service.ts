import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class CertificateInterceptor implements HttpInterceptor {
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Modify the request to include the client certificate
    const xhr = new XMLHttpRequest();
    xhr.open(request.method, request.url);
    console.log("test");
    

    // Set the client certificate
    // Note: This is a simplistic example, the actual process depends on your certificate format and browser support
    xhr.withCredentials = true;
    xhr.setRequestHeader('X-Client-Cert', 'YOUR_CLIENT_CERTIFICATE_HERE');

    // Other headers and configurations can be set here if needed

    xhr.send(request.body);

    // You might also need to handle the response here before passing it to the next handler

    // Pass on the modified request
    return next.handle(request);
  }
}
