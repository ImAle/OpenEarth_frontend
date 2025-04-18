import {Component, ElementRef, OnInit, signal, ViewChild} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { User } from '../../core/models/user.model';
import { Report } from '../../core/models/report.model';
import { UserService } from '../../core/services/user.service';
import { ReportService } from '../../core/services/report.service';
import { finalize } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import {HeaderComponent} from '../header/header.component';

@Component({
  selector: 'app-admin-panel',
  imports: [CommonModule, RouterModule, FormsModule, HeaderComponent],
  templateUrl: './admin-panel.component.html',
  styleUrl: './admin-panel.component.css'
})
export class AdminPanelComponent implements OnInit {

  // Modal reference
  @ViewChild('reportModalRef') reportModalRef!: ElementRef;

  // Loading states
  loading = signal<boolean>(false);
  loadingReports = signal<boolean>(false);
  processingUser = signal<number | null>(null);
  processingReport = signal<number | null>(null);

  // Modal state
  showModal = signal<boolean>(false);

  // Users
  allUsers = signal<User[]>([]);
  usernameFilter: string = '';

  // Pagination for users
  usersPerPage: number = 20;
  filteredUsers = signal<User[]>([]);
  displayedUsers = signal<User[]>([]);
  currentUserPage = signal<number>(1);
  totalUserPages = signal<number>(1);

  // Reports
  allReports = signal<Report[]>([]);

  // Pagination for reports
  reportsPerPage: number = 20;
  displayedReports = signal<Report[]>([]);
  currentReportPage = signal<number>(1);
  totalReportPages = signal<number>(1);

  // Selected report for modal
  selectedReport = signal<Report | null>(null);

  // Error handling
  error = signal<string | null>(null);

  constructor(private userService: UserService, private reportService: ReportService) {}

  ngOnInit(): void {
    // Initialization
    this.allUsers.set([]);
    this.filteredUsers.set([]);
    this.displayedUsers.set([]);
    this.allReports.set([]);
    this.displayedReports.set([]);

    this.loadUsers();
    this.loadReports();
  }

  loadUsers(): void {
    this.loading.set(true);
    this.error.set(null);

    this.userService.getAllUsers()
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (response: any) => {
          const users = response.users;
          this.allUsers.set(users);
          this.applyUserFilter();
        },
        error: (err: HttpErrorResponse) => {
          console.error('Error loading users:', err);
          this.error.set('Failed to load users. Please try again later.');
        }
      });
  }

  loadReports(): void {
    this.loadingReports.set(true);
    this.error.set(null);

    this.reportService.getAll()
      .pipe(finalize(() => this.loadingReports.set(false)))
      .subscribe({
        next: (response: any) => {
          const reports = response.reports;
          this.allReports.set(reports || []);
          this.updateDisplayedReports();
        },
        error: (err: HttpErrorResponse) => {
          console.error('Error loading reports:', err);
          this.error.set('Failed to load reports. Please try again later.');
          this.allReports.set([]); // Empty array if fails
          this.updateDisplayedReports();
        }
      });
  }

  // User functions
  applyUserFilter(): void {
    // Verify if there is any filter
    const filtered = this.usernameFilter.trim() === ''
      ? [...this.allUsers()]  // Otherwise, show all users
      : this.allUsers().filter(user =>
        user.username.toLowerCase().includes(this.usernameFilter.toLowerCase())
      );

    this.filteredUsers.set(filtered);
    this.calculateUserPages();
    this.updateDisplayedUsers();
  }

  calculateUserPages(): void {
    const total = Math.ceil(this.filteredUsers().length / this.usersPerPage);
    this.totalUserPages.set(Math.max(1, total));

    // Adjust current page if needed
    if (this.currentUserPage() > this.totalUserPages()) {
      this.currentUserPage.set(this.totalUserPages());
    }
  }

  updateDisplayedUsers(): void {
    const startIndex = (this.currentUserPage() - 1) * this.usersPerPage;
    const endIndex = startIndex + this.usersPerPage;
    this.displayedUsers.set(this.filteredUsers().slice(startIndex, endIndex));
  }

  goToUserPage(page: number | string): void {
    page = Number(page);
    if (page >= 1 && page <= this.totalUserPages()) {
      this.currentUserPage.set(page);
      this.updateDisplayedUsers();
    }
  }

  resetUserPagination(): void {
    this.currentUserPage.set(1);
    this.calculateUserPages();
    this.updateDisplayedUsers();
  }

  userPagesArray(): (number | string)[] {
    const totalPages = this.totalUserPages();
    const currentPage = this.currentUserPage();

    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    if (currentPage <= 4) {
      return [1, 2, 3, 4, 5, '...' as any, totalPages];
    }

    if (currentPage >= totalPages - 3) {
      return [1, '...' as any, totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
    }

    return [
      1,
      '...' as any,
      currentPage - 1,
      currentPage,
      currentPage + 1,
      '...' as any,
      totalPages
    ];
  }

  toggleUserStatus(user: User): void {
    this.processingUser.set(user.id);

    const operation = user.enabled ?
      this.userService.deactivate(user.id) :
      this.userService.activate(user.id);

    operation.pipe(finalize(() => this.processingUser.set(null)))
      .subscribe({
        next: () => {
          user.enabled = !user.enabled;
        },
        error: (err: HttpErrorResponse) => {
          console.error(`Error ${user.enabled ? 'deactivating' : 'activating'} user:`, err);
          console.log(err);
          this.error.set(`Failed to ${user.enabled ? 'deactivate' : 'activate'} user. Please try again.`);
        }
      });
  }

  // Report functions
  updateDisplayedReports(): void {
    const startIndex = (this.currentReportPage() - 1) * this.reportsPerPage;
    const endIndex = startIndex + this.reportsPerPage;
    this.displayedReports.set(this.allReports().slice(startIndex, endIndex));
    this.calculateReportPages();
  }

  calculateReportPages(): void {
    const total = Math.ceil(this.allReports().length / this.reportsPerPage);
    this.totalReportPages.set(Math.max(1, total));

    // Adjust current page if needed
    if (this.currentReportPage() > this.totalReportPages()) {
      this.currentReportPage.set(this.totalReportPages());
    }
  }

  goToReportPage(page: number | string): void {
    page = Number(page);
    if (page >= 1 && page <= this.totalReportPages()) {
      this.currentReportPage.set(page);
      this.updateDisplayedReports();
    }
  }

  resetReportPagination(): void {
    this.currentReportPage.set(1);
    this.updateDisplayedReports();
  }

  reportPagesArray(): (number | string)[] {
    const totalPages = this.totalReportPages();
    const currentPage = this.currentReportPage();

    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    if (currentPage <= 4) {
      return [1, 2, 3, 4, 5, '...' as any, totalPages];
    }

    if (currentPage >= totalPages - 3) {
      return [1, '...' as any, totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
    }

    return [
      1,
      '...' as any,
      currentPage - 1,
      currentPage,
      currentPage + 1,
      '...' as any,
      totalPages
    ];
  }

  openReportModal(report: Report): void {
    this.selectedReport.set(report);
    this.showModal.set(true);
    // Prevent body scrolling when modal is open
    document.body.style.overflow = 'hidden';
  }

  closeModal(): void {
    this.showModal.set(false);
    // Restore body scrolling
    document.body.style.overflow = '';
  }

  deleteReport(report: Report): void {
    this.processingReport.set(report.id);

    this.reportService.delete(report.id)
      .pipe(finalize(() => this.processingReport.set(null)))
      .subscribe({
        next: () => {
          // Remove the report from the list
          const reports = this.allReports().filter(r => r.id !== report.id);
          this.allReports.set(reports);
          this.updateDisplayedReports();
          // Close modal if open
          if (this.showModal()) {
            this.closeModal();
          }
        },
        error: (err: HttpErrorResponse) => {
          console.error('Error deleting report:', err);
          this.error.set('Failed to delete report. Please try again.');
        }
      });
  }

  findUserById(id: number): User | undefined {
    return this.allUsers().find(user => user.id === id);
  }

  getUserInitial(userId: number | undefined): string {
    if (!userId) return '?';
    const user = this.findUserById(userId);
    return user?.username?.charAt(0).toUpperCase() || '?';
  }

  dismissError(): void {
    this.error.set(null);
  }
}
