import { ApplicationConfig, mergeApplicationConfig } from '@angular/core';
import { provideServerRendering } from '@angular/platform-server';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { ActiveToast, ToastrService } from 'ngx-toastr';

import { appConfig } from './app.config';

class NoopToastrService {
  success(): ActiveToast<any> | undefined {
    return undefined;
  }

  error(): ActiveToast<any> | undefined {
    return undefined;
  }

  info(): ActiveToast<any> | undefined {
    return undefined;
  }

  warning(): ActiveToast<any> | undefined {
    return undefined;
  }

  show(): ActiveToast<any> | undefined {
    return undefined;
  }

  clear(): void {
    return;
  }

  remove(): boolean {
    return false;
  }
}

const serverConfig: ApplicationConfig = {
  providers: [
    provideServerRendering(),
    provideNoopAnimations(),
    {
      provide: ToastrService,
      useClass: NoopToastrService,
    },
  ],
};

export const config = mergeApplicationConfig(appConfig, serverConfig);
