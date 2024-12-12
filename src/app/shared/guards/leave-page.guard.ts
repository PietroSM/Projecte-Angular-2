import { CanDeactivateFn } from '@angular/router';
import { Observable } from 'rxjs';


export interface CanComponentDeactive {
  canDeactivate: () => Observable<boolean> | Promise<boolean> | boolean;
}

export const leavePageGuard: CanDeactivateFn<CanComponentDeactive> = (component) => {
  return component.canDeactivate? component.canDeactivate() : true;
};
