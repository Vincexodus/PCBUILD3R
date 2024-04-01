import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UtilService {

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
