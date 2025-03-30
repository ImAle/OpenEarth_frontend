export class Rent {
  id: number;
  startTime: string;
  endTime: string;
  userId: number;
  houseId: number;

  constructor(id: number, startTime: string, endTime: string, userId: number, houseId: number) {
    this.id = id;
    this.startTime = startTime;
    this.endTime = endTime;
    this.userId = userId;
    this.houseId = houseId;
  }
}
