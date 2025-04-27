export class RentCreation{
  startTime: Date;
  endTime: Date;
  houseId: number;

  constructor(startTime: Date, endTime: Date, houseId: number) {
    this.startTime = startTime;
    this.endTime = endTime;
    this.houseId = houseId;
  }
}
