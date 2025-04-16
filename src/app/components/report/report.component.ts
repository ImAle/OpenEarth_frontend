import {Component, EventEmitter, Input, Output} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {DialogModule} from 'primeng/dialog';
import {ButtonModule} from 'primeng/button';
import {ReportService} from '../../core/services/report.service';
import {ReportCreation} from '../../core/models/reportCreation.model';

@Component({
  selector: 'app-report',
  imports: [
    CommonModule,
    FormsModule,
    DialogModule,
    ButtonModule,
  ],
  templateUrl: './report.component.html',
  styleUrl: './report.component.css'
})
export class ReportComponent {
  @Input() visible: boolean = false;
  @Input() reportedUserId!: number;
  @Input() reporterUserId!: number;
  @Output() onClose = new EventEmitter<void>();
  @Output() onSubmit = new EventEmitter<void>();

  reportComment: string = '';
  submitting: boolean = false;

  constructor(private reportService: ReportService) {}

  close(): void {
    this.reportComment = '';
    this.onClose.emit();
  }

  submit(): void {
    if (!this.reportComment.trim()) {
      return;
    }

    this.submitting = true;
    const report = new ReportCreation(
      this.reportComment,
      this.reportedUserId,
      this.reporterUserId
    );

    this.reportService.create(report).subscribe({
      next: () => {
        this.submitting = false;
        this.reportComment = '';
        this.onSubmit.emit();
      },
      error: (error) => {
        console.error('Error:', error);
        this.submitting = false;
      }
    });
  }
}
