export class ReportCreation{
  comment: string;
  reportedId: number;

  constructor(comment: string, reportedId: number) {
    this.comment = comment;
    this.reportedId = reportedId;
  }
}
