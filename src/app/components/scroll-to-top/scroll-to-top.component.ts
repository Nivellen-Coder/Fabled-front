import {Component, HostListener} from '@angular/core';
import {NgIf} from "@angular/common";

@Component({
  selector: 'app-scroll-to-top',
  standalone: true,
  imports: [
    NgIf
  ],
  templateUrl: './scroll-to-top.component.html',
  styleUrl: './scroll-to-top.component.scss'
})
export class ScrollToTopComponent {
  isVisible = false;

  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.isVisible = window.scrollY > 200; // Affiche après 200px de scroll
  }

  scrollToTop(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
