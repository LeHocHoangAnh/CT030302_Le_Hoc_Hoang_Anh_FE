import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CommonService {

  constructor() { }
  // change data according to screen width 
  changeDialogResolution(innerWidth: any, res:any){
    let dialogWidth;
    // <=1280x720
    if(innerWidth<500){
      dialogWidth=res.r300;
    }
    else if(innerWidth<1400){
      dialogWidth= res.r1280;
    }
    // <=1366x768
    else if(innerWidth<1700){
      dialogWidth=res.r1366;
    }
    // >1366x768
    else{
      dialogWidth=res.r1400;
    }

    return dialogWidth;
  }
  
  // base64 encode & decode
  b64EncodeUnicode(str) {
    return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, function (match, p1) {
      return String.fromCharCode(parseInt(p1, 16))
    }))
  }
  b64DecodeUnicode(str) {
    return decodeURIComponent(Array.prototype.map.call(atob(str), function (c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
    }).join(''))
  }
  //
}
