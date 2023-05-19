import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { constants } from 'buffer';
import { LoginRequest } from 'src/app/data/model/request/LoginRequest';
import { AuthService } from 'src/app/data/service/auth.service';
import { ConstantsCommon } from 'src/app/shared/constants.common';
import { MessageValidate } from 'src/app/shared/message-validation';

@Component({
  selector: 'app-create-new-password',
  templateUrl: './create-new-password.component.html',
  styleUrls: ['./create-new-password.component.css']
})
export class CreateNewPasswordComponent implements OnInit {
  public formData: FormGroup;

  public submitted: boolean=false;

  public flagCheck: boolean= true;

  public checkToken: boolean=false;

  public validate = MessageValidate;

  public request= new LoginRequest();

  public token: string;
  
  constructor(    private router: Router,
    private authService: AuthService,
    private routers: ActivatedRoute) { }
    
  ngOnInit(): void {
    const paramPageRoute = this.routers.snapshot.paramMap.get('token');
    this.token=paramPageRoute;
    this.authService.checkToken(paramPageRoute).subscribe(res=>
      {
        if(res.status===ConstantsCommon.HTTP_STATUS_200)
        {
          this.checkToken=true;
          if(this.checkToken)
          {
            this.initForm();
          }
        }
      })
  }
  initForm() {
    this.formData = new FormGroup({
      // email: new FormControl('', [
      //   Validators.required,
      //   Validators.maxLength(40),
      // ]),
      password: new FormControl('', [
        Validators.required,
        Validators.maxLength(30),
      ]),
      passwordRetype: new FormControl('', [
        Validators.required,
        Validators.maxLength(30),
      ]),
  })
  }

  get f() {
    return this.formData.controls;
  }

  onSubmit()
  {
    this.submitted = true;
    if(this.formData.invalid){
      return;
    }
    let request=this.formData.value;
    if(request.password!=request.passwordRetype)
    {
      this.flagCheck=false;
      return; 
    }
    this.request.token=this.token;
    this.request.password=request.password
    this.authService.changePassword(this.request).subscribe((res)=>
    {
      if (res.status === ConstantsCommon.HTTP_STATUS_200) {
       this.flagCheck=true;
       this.router.navigate(['/login']);
      }
    },
    (err) => {
      this.flagCheck=false;
    })

  }
  

}
