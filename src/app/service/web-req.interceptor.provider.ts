// interceptor.provider.ts

import { Provider } from '@angular/core';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { WebReqInterceptor } from './web-req.interceptor';

// Provider for the Noop Interceptor
export const WebReqInterceptorProvider: Provider = {
  provide: HTTP_INTERCEPTORS,
  useClass: WebReqInterceptor,
  multi: true,
};
