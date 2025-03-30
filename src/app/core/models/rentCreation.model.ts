export class RentCreation{
  startTime: string;
  endTime: string;
  houseId: number;

  constructor(startTime: string, endTime: string, houseId: number) {
    this.startTime = startTime;
    this.endTime = endTime;
    this.houseId = houseId;
  }
}
