import {Component, OnInit} from '@angular/core';
import {Order, Items} from "../../models/order/admin-orders";
import {AdminOrdersService} from "../../services/admin-orders/admin-orders.service";
import {DatePipe, NgClass, NgForOf, TitleCasePipe} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {OrderDetailComponent} from "../order-detail/order-detail.component";
import {CardService} from "../../services/card/card.service";

@Component({
  selector: 'app-admin-orders',
  standalone: true,
  imports: [
    TitleCasePipe,
    NgForOf,
    FormsModule,
    DatePipe,
    NgClass,
    OrderDetailComponent
  ],
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.scss'
})
export class OrdersComponent implements OnInit {
  selectedStatus: string = 'all';
  orders: Order[] = [];
  filteredOrders: Order[] = [];
  paginatedOrders: Order[] = [];
  selectedOrder: Order | undefined;
  isModalOpen = false;

  searchQuery: string = '';
  currentPage: number = 1;
  itemsPerPage: number = 10;

  constructor(private orderService: AdminOrdersService, private cardService: CardService) {}

  ngOnInit() {
    this.orderService.getAllOrders().subscribe((data) => {
      this.orders = data
      this.orders.sort((a, b) => {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
      this.filterOrders();
    });
  }

  openOrderDetails(order: Order) {
    const updatedItems: Items[] = [];

    let remaining = order.items.length;

    for (const item of order.items) {
      this.cardService.getCardById(item.productName).subscribe((card: any) => {
        updatedItems.push({
          ...item,
          productName: card.name
        });

        remaining--;

        if (remaining === 0) {
          // Une fois toutes les requêtes terminées
          this.selectedOrder = {
            ...order,
            items: updatedItems,
          };
          this.isModalOpen = true;
        }
      });
    }
  }


  get uniqueStatuses(): string[] {
    return Array.from(new Set(this.orders.map(o => o.status))).filter(Boolean);
  }

  filterOrders() {
    this.filteredOrders = this.orders.filter(order => {
      const matchesSearch = order.user?.toLowerCase().includes(this.searchQuery.toLowerCase());
      const matchesStatus = this.selectedStatus === 'all' || order.status === this.selectedStatus;
      return matchesSearch && matchesStatus;
    });

    this.filteredOrders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    this.currentPage = 1;
    this.paginate();
  }

  paginate() {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    this.paginatedOrders = this.filteredOrders.slice(start, end);
  }

  goToPage(page: number) {
    this.currentPage = page;
    this.paginate();
  }

  get totalPages(): number[] {
    return Array.from({ length: Math.ceil(this.filteredOrders.length / this.itemsPerPage) }, (_, i) => i + 1);
  }
}
