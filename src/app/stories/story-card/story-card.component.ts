import { DatePipe, NgIf } from '@angular/common';
import { Component, EventEmitter, HostBinding, Input, Output } from '@angular/core';

@Component({
  selector: 'app-story-card',
  standalone: true,
  imports: [NgIf, DatePipe],
  templateUrl: './story-card.component.html',
  styleUrl: './story-card.component.scss'
})
export class StoryCardComponent {
  @Input({ required: true }) story: any;
  @Input({ required: true }) toggleId!: string;
  @Input() expanded = false;
  @Output() expand = new EventEmitter<string | null>();
  @Output() openTwitter = new EventEmitter<any>();
  @Output() viewDetails = new EventEmitter<any>();

  @HostBinding('class.story-card-host') hostBaseClass = true;
  @HostBinding('class.half') isHalf = false;
  @HostBinding('class.third') isThird = false;
  @HostBinding('class.full') isFull = false;

  private _layoutClass = '';

  @Input()
  set layoutClass(value: string) {
    this._layoutClass = value ?? '';
    this.syncLayoutClasses();
  }

  onHeaderClick() {
    if (this.expanded) {
      this.expand.emit(null);
      return;
    }

    const id = this.story?.bill_id ?? this.toggleId;
    this.expand.emit(id);
  }

  onOpenTwitter(event: Event) {
    event.preventDefault();
    event.stopPropagation();
    if (!this.story) {
      return;
    }
    this.openTwitter.emit(this.story);
  }

  onViewDetails(event: Event) {
    event.preventDefault();
    event.stopPropagation();
    if (this.story) {
      this.viewDetails.emit(this.story);
    }
  }

  private syncLayoutClasses() {
    const value = this._layoutClass;
    this.isHalf = value === 'half';
    this.isThird = value === 'third';
    this.isFull = value === 'full';
  }
}
