import {
  Component,
  Injectable,
  InjectionToken,
  Provider,
  inject,
  provideExperimentalZonelessChangeDetection,
} from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { RouterModule, RouterOutlet, provideRouter } from '@angular/router';
// import 'zone.js';

@Injectable()
export class Service1 {
  service2 = inject(Service2);
}

@Injectable()
export class Service2 {
  service2 = inject(Service1);
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  template: `
   <router-outlet></router-outlet>
  `,
})
export class App {}

@Component({
  selector: 'app-hello',
  standalone: true,
  template: `
    <h1>Hello from {{ name }}!</h1>
  `,
})
export class AppHello {
  service2 = inject(ACTION_CONTEXT_SERVICE);
  name = 'Angular';
}

export const ACTION_CONTEXT_SERVICE = new InjectionToken<any>(
  'ACTION_CONTEXT_SERVICE'
);

let c = [Service1,
  {
    provide: ACTION_CONTEXT_SERVICE,
    useClass: Service2,
  },]

bootstrapApplication(App, {
  providers: [
    provideExperimentalZonelessChangeDetection(),
    ((c: Provider[]) => provideRouter([
      {
        path: '',
        component: AppHello,
        providers: [
         ...c 
        ],
      },
    ]))(c),
  ],
});
