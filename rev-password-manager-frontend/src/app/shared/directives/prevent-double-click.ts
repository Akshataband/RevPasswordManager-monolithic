import { Directive, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[preventDoubleClick]',
  standalone: true
})
export class PreventDoubleClickDirective {

  @Input() debounceTime = 1000;
  private isClicked = false;

  @HostListener('click', ['$event'])
  handleClick(event: Event) {

    if (this.isClicked) {
      event.stopImmediatePropagation();
      event.preventDefault();
      return;
    }

    this.isClicked = true;

    setTimeout(() => {
      this.isClicked = false;
    }, this.debounceTime);
  }
}