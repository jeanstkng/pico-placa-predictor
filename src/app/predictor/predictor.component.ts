import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-predictor',
  templateUrl: './predictor.component.html',
  styleUrls: ['./predictor.component.scss']
})
export class PredictorComponent implements OnInit {

  public isPicoYPlaca: string | false = false;
  predictForm = new FormGroup({
    plateNumber: new FormControl('', [Validators.required, Validators.minLength(6), Validators.maxLength(8)]),
    date: new FormControl('', [Validators.required, Validators.minLength(10), Validators.maxLength(10)]),
    time: new FormControl('', [Validators.required, Validators.minLength(5), Validators.maxLength(5)]),
  });

  constructor() { }

  ngOnInit(): void {
  }

  get plateNumber(): AbstractControl | null { return this.predictForm.get('plateNumber'); }
  get date(): AbstractControl | null { return this.predictForm.get('date'); }
  get time(): AbstractControl | null { return this.predictForm.get('time'); }

  public predictPicoPlaca(): boolean {
    const plateNumber: string = this.plateNumber?.value;

    const isBike = this.checkIsPlateForBike(plateNumber);
    const lastNumber = this.takeLastNumberFromPlate(plateNumber, isBike);

    if (!lastNumber) {
      this.plateNumber?.setErrors({ invalidPlate: true });
    }

    const dates = this.takeDateValues(this.date?.value);

    if (!dates) {
      this.date?.setErrors({ invalid: true });
    }

    const times = this.takeTimeValues(this.time?.value);
    if (!times) {
      this.time?.setErrors({ invalid: true });
    }

    if (times && dates && lastNumber) {
      const fullDate = new Date(Date.UTC(+dates[2], +dates[1] - 1, +dates[0], +times[0], +times[1]));
      fullDate.setHours(+times[0], +times[1]);
      const day: number = fullDate.getDay();
      const isPicoPlaca = this.evaluateDateAndLastNumber(day, fullDate, lastNumber);
      this.isPicoYPlaca = isPicoPlaca ? 'yes' : 'no';
    }

    return false;
  }

  private evaluateDateAndLastNumber(day: number, date: Date, lastNumber: number): boolean {
    switch (day) {
      case 1:
        if (lastNumber === 1 || lastNumber === 2) {
          return this.checkHoursAndMinutes(date);
        }
        break;
      case 2:
        if (lastNumber === 3 || lastNumber === 4) {
          return this.checkHoursAndMinutes(date);
        }
        break;
      case 3:
        if (lastNumber === 5 || lastNumber === 6) {
          return this.checkHoursAndMinutes(date);
        }
        break;
      case 4:
        if (lastNumber === 7 || lastNumber === 8) {
          return this.checkHoursAndMinutes(date);
        }
        break;
      case 5:
        if (lastNumber === 9 || lastNumber === 0) {
          return this.checkHoursAndMinutes(date);
        }
        break;
      default:
        return false;
    }
    return false;
  }

  private checkHoursAndMinutes(date: Date): boolean {
    if ((date.getHours() >= 7) && (date.getHours() <= 9)) {
      if (date.getHours() === 9) {
        if (date.getMinutes() <= 30) {
          return true;
        } else {
          return false;
        }
      }
      return true;
    }
    if ((date.getHours() >= 16) && (date.getHours() <= 19)) {
      if (date.getHours() === 19) {
        if (date.getMinutes() <= 30) {
          return true;
        } else {
          return false;
        }
      }
      return true;
    }
    return false;
  }

  private takeTimeValues(time: string): string[] | false {
    if (!time.includes(':')) {
      return false;
    }
    const timeValues: string[] = time.split(':');
    return timeValues;
  }

  /**
   * Takes the date values from the string and turns them into an array
   * @param date String date as dd/mm/YYYY
   * @returns Array of strings with the order [day, month, year]
   */
  private takeDateValues(date: string): string[] | false {
    if (!date.includes('/')) {
      return false;
    }
    const dateValues: string[] = date.split('/');
    if (dateValues.length < 3) {
      return false;
    }
    return dateValues;
  }

  private checkIsPlateForBike(plateNumber: string): boolean {
    return plateNumber.length === 6 ? true : false;
  }

  private takeLastNumberFromPlate(plateNumber: string, isBike: boolean): number | false {
    const checkLastNumber = (lastNumber: number) => {
      if (isNaN(lastNumber)) {
        return false;
      }
      return lastNumber;
    };

    if (!isBike) {
      const lastNumber: number = +(plateNumber.slice(-1));
      return checkLastNumber(lastNumber);
    } else {
      const plateNumberLen = plateNumber.length;
      const lastNumber: number = +(plateNumber.slice(plateNumberLen - 2, plateNumberLen - 1));
      return checkLastNumber(lastNumber);
    }
  }

}
