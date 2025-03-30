export class ReviewCreation {
  comment: string;
  houseId: number;

  constructor(comment: string, houseId: number) {
    this.comment = comment;
    this.houseId = houseId;
  }
}
