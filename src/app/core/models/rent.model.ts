export class Rent {
  id: number;
  price: number;
  startTime: string;
  endTime: string;
  cancelled: boolean;
  userId: number;
  houseId: number;

  constructor(id: number, price: number, startTime: string, endTime: string, cancelled: boolean, userId: number, houseId: number) {
    this.id = id;
    this.price = price;
    this.startTime = startTime;
    this.endTime = endTime;
    this.userId = userId;
    this.houseId = houseId;
    this.cancelled = cancelled;
  }
}
