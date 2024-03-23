import { Injectable } from '@angular/core';
import { NgToastService } from 'ng-angular-popup';

@Injectable({
  providedIn: 'root'
})
export class UtilService {

  constructor(private toast: NgToastService) { }

  strValidation(...strings: string[]): boolean {
    if(strings.some(str => !str)) {
      this.toast.error({detail:"FAILED",summary:'Invalid Inputs!', duration:2000, position:'topCenter'});
      return true;
    }
    return false;
  }

  numValidation(...numbers: string[]): boolean {
    const numericRegex = /^[0-9]*\.?[0-9]*$/;
    
    if (numbers.every(number => numericRegex.test(number))) {
        return false;
    } else {
        this.toast.error({detail: "FAILED", summary: 'Invalid Inputs!', duration: 2000, position: 'topCenter'});
        return true;
    }
}

  maskString(input: string): string {
    const maskedIdLength = 8; // Length of the masked ID
    const ellipsis = '...';
    if (input.length <= maskedIdLength) {
      return input; // Return the original ID if it's shorter than or equal to the masked length
    } else {
      return input.substring(0, maskedIdLength) + ellipsis; // Return the masked ID
    }
  }
}
