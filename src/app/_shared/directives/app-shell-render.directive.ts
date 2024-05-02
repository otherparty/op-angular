

import {
  Directive, Inject, OnInit, PLATFORM_ID,
  TemplateRef, ViewContainerRef
} from "@angular/core";
import { isPlatformServer } from "@angular/common";

@Directive({
  selector: "[appShellRender]"
})
export class AppShellRenderDirective implements OnInit {

  constructor(
    @Inject(PLATFORM_ID) private _platformId: Object,
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef) {

  }

  ngOnInit() {
    if (isPlatformServer(this._platformId)) {
      this.viewContainer.createEmbeddedView(this.templateRef);
    }
    else {
      this.viewContainer.clear();
    }

  }

}
