export class ReportCreation{
  comment: string;
  reportedId: number;
  reporterId: number;

  constructor(comment: string, reportedId: number, reporterId: number) {
    this.comment = comment;
    this.reportedId = reportedId;
    this.reporterId = reporterId;
  }
}
