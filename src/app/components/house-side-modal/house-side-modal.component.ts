import {Component, EventEmitter, Input, Output} from '@angular/core';
import {CardComponent} from '../card/card.component';
import {HousePreview} from '../../core/models/housePreview.model';

@Component({
  selector: 'app-house-side-modal',
  imports: [
    CardComponent
  ],
  templateUrl: './house-side-modal.component.html',
  styleUrl: './house-side-modal.component.css'
})
export class HouseSideModalComponent {
  @Input() house!: HousePreview;
  @Output() closed = new EventEmitter<void>();

  close(){
    this.closed.emit();
  }

}
