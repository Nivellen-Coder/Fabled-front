import {Component, OnInit} from '@angular/core';
import {UserListModel} from "../../models/user/userListModel";
import {UserService} from "../../services/admin-user/user.service";
import {HttpErrorResponse} from "@angular/common/http";
import {DatePipe, NgClass, NgForOf, NgIf} from "@angular/common";
import {LucideAngularModule} from "lucide-angular";
import {FormsModule} from "@angular/forms";
import {ToastrService} from "ngx-toastr";

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [
    NgForOf,
    LucideAngularModule,
    NgIf,
    NgClass,
    FormsModule,
    DatePipe
  ],
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss'
})
export class UsersComponent implements OnInit {
  users: UserListModel[] = [];
  selectedUser: UserListModel | null = null;
  isModalOpen: boolean = false;
  filteredUsers: UserListModel[] = [];
  searchTerm: string = '';

  currentPage: number = 1;
  itemsPerPage: number = 10;

  constructor(private userService: UserService, private toastr: ToastrService) {
  }

  ngOnInit(): void {
    this.loadUsers();
  }

  filterUsers() {
    const term = this.searchTerm.toLowerCase();
    this.filteredUsers = this.users.filter(user =>
      user.username.toLowerCase().includes(term) ||
      user.email.toLowerCase().includes(term)
    );
    this.currentPage = 1;
  }

  get totalPages(): number {
    return Math.ceil(this.filteredUsers.length / this.itemsPerPage);
  }

  paginatedUsers(): any[] {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredUsers.slice(start, start + this.itemsPerPage);
  }

  nextPage() {
    if (this.currentPage < this.totalPages) this.currentPage++;
  }

  prevPage() {
    if (this.currentPage > 1) this.currentPage--;
  }

  loadUsers(): void {
    this.userService.userList().subscribe({
      next: (data: UserListModel[]) => {
        this.users = data;
        this.filteredUsers = data;
      },
      error: (error: HttpErrorResponse) => {
        console.log(error);
      }
    });
  }

  deleteUser(userId: number) {
    this.userService.deleteUser(userId).subscribe(({
      next: () => {
        this.toastr.success('User deleted successfully');
        this.loadUsers();
      },
      error: (err) => {
        this.toastr.error(err.error.message || 'Failed to delete user');
        console.error("Delete Error:", err);
      }
    }));
  }

  openEditModal(user: UserListModel): void {
    this.selectedUser = { ...user };
    this.isModalOpen = true;
  }

  closeModal(): void {
    this.isModalOpen = false;
    this.selectedUser = null;
  }

  saveUser(id: number | undefined): void {
    if (!this.selectedUser) return;

    this.userService.updateUser(this.selectedUser, id).subscribe({
      next: (updatedUser) => {
        // Mets à jour localement
        const index = this.users.findIndex(u => u.id === updatedUser.id);
        if (index !== -1) this.users[index] = updatedUser;
        this.filterUsers(); // au cas où il y a un filtre actif
        this.closeModal();
        location.reload();
      },
      error: (error) => {
        console.error('Error while updating', error);
      }
    });
  }

  reactivateUser(userId: number) {
    this.userService.reactivateUser(userId).subscribe({
      next: () => {
        this.toastr.success('User activated successfully');
        this.loadUsers(); // recharge les données
      },
      error: err => {
        console.error('Error while reactivating User', err);
      }
    });
  }
}
