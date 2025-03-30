export class Report {
  id: number;
  comment: string;
  reportedId: number;
  reporterId: number;

  constructor(id: number, comment: string, reportedId: number, reporterId: number) {
    this.id = id;
    this.comment = comment;
    this.reportedId = reportedId;
    this.reporterId = reporterId;
  }
}
