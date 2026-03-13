import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

import { Navbar } from '../../../shared/components/navbar/navbar';
import { Hero } from '../../landing/hero/hero';
import { Features } from '../../landing/features/features';
import { Footer } from '../../landing/footer/footer';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [
  CommonModule,
  Navbar,
  Hero,
  Features,
  Footer
],
  templateUrl: './landing.html',
  styleUrls: ['./landing.scss']
})
export class Landing {}