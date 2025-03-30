export class Review {
  id: number;
  comment: string;
  houseId: number;
  userId: number;

  constructor(id: number, comment: string, houseId: number, userId: number) {
    this.id = id;
    this.comment = comment;
    this.houseId = houseId;
    this.userId = userId;
  }
}
