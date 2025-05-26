import {Component, EventEmitter, Output, Input, OnInit} from '@angular/core';
import { CommonModule } from "@angular/common";


@Component({
  imports: [
    CommonModule,
  ],
  selector: 'app-pagination',
  standalone: true,
  styleUrls: ['./pagination.component.scss'],
  templateUrl: './pagination.component.html'
})
export class PaginationComponent implements OnInit {
  @Input() currentPage: number = 1;
  @Input() total: number = 1;
  @Input() limit: number = 50;
  @Input() pagesCount: number = 1;
  @Input() name: string = "";
  @Output() changePage = new EventEmitter<number>();

  pages: number[] = [];
  next: boolean = false;
  previous: boolean = false;

  constructor() {
  }

  ngOnInit(): void {
    this.getPagesCount();
  }

  range(start: number, end: number): number[] {
    return [...Array(end).keys()].map((el) => el + start);
  }

  onNextClick(): void {
    if (this.currentPage < this.pagesCount) {
      this.currentPage++;
      this.changePage.emit(this.currentPage);
      this.next = true;
    }
    this.next = false;
  }

  onPreviousClick(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.changePage.emit(this.currentPage);
      this.previous = true;
    }
    this.previous = false;
  }

  getPagesCount() {
    this.pagesCount = Math.ceil(this.total / this.limit);
    this.pages = this.range(1, this.pagesCount);
  }
}
