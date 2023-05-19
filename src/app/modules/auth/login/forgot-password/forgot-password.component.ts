import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/data/service/auth.service';
import { ConstantsCommon } from 'src/app/shared/constants.common';
import { MessageValidate } from 'src/app/shared/message-validation';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit {
  
  public formData: FormGroup;

  public submitted: boolean=false;

  public flagCheck: boolean= false;

  public flagSuccess=true;

  public validate = MessageValidate;
  
  constructor(    private router: Router,
    private authService: AuthService,
    private routers: ActivatedRoute) { }
    
  ngOnInit(): void {
    this.initForm();
  }
  initForm() {
    this.formData = new FormGroup({
      email: new FormControl('', [
        Validators.required,
        Validators.maxLength(40),
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
      this.flagSuccess=false;
      return;
    }
    let request=this.formData.value;
    this.authService.sendMailForgot(request.email).subscribe((res)=>
    {
      if (res.status === ConstantsCommon.HTTP_STATUS_200) {
       this.flagSuccess=true;
      }
    },
    (err) => {
      this.flagSuccess=false;
    })

  }
  
}
