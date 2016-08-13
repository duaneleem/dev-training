import { Component, OnInit } from '@angular/core';

@Component({
  moduleId: module.id,
  selector: 'app-another',
  template: `
    <article>
        <ng-content></ng-content>
    </article>
  `,
  styles: [`
      article {
          border: 1px solid black;
      }
  `]
})
export class AnotherComponent {

}
