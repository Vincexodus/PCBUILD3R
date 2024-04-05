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

  maskStringLong(input: string | undefined): string {
    const maskedIdLength = 15;
    const ellipsis = '...';
    if (input) {
      if (input.length <= maskedIdLength) {
        return input;
      } else {
        return input.substring(0, maskedIdLength) + ellipsis;
      }
    } else {
      return "";
    }
  }

  maskReviewUser(input: string | undefined): string {
    const maskedIdLength = 10;
    const ellipsis = '***';
    if (input) {
      if (input.length <= maskedIdLength) {
        return input;
      } else {
        return input. substring(0, maskedIdLength) + ellipsis;
      }
    } else {
      return "";
    }
  }

  dateFormat(input: Date): string {
    const date = new Date(input);

    const day = date.getDate();
    const month = date.getMonth() + 1; // Month is zero-based, so we add 1
    const year = date.getFullYear();

    const hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();

    const formattedDate = `${day}/${month}/${year}`;
    const formattedTime = `${hours}:${minutes}:${seconds}`;

    return `${formattedDate} ${formattedTime}`;
  }
}
