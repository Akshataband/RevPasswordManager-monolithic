import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-stats-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './stats-card.html',
  styleUrls: ['./stats-card.scss']
})
export class StatsCard {

  @Input() title: string = '';
  @Input() value: number | string = 0;
  @Input() highlight: boolean = false;

}