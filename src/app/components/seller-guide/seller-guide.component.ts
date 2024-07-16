import { Component } from '@angular/core';
import { NavigationEnd, Router} from "@angular/router";

@Component({
  selector: 'app-seller-guide',
  templateUrl: './seller-guide.component.html',
  styleUrls: ['./seller-guide.component.scss']
})
export class SellerGuideComponent {

  ngOnInit() {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        window.scrollTo(0, 0);
      }
    });
  }

  constructor(private router: Router) {
  }

  getStarted() {
    this.router.navigate(['/card-list']).then(r => true);
  }
}
