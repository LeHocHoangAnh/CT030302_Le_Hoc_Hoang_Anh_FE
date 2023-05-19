import { Component, NgZone, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { parseMarker } from '@fullcalendar/core';
import { LoginRequest } from 'src/app/data/model/request/LoginRequest';
import { AuthService } from 'src/app/data/service/auth.service';
import { TokenStorageService } from 'src/app/data/service/token-storage.service';
import { MessageValidate } from 'src/app/shared/message-validation';
import { environment } from 'src/environments/environment.prod';
declare var google: any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  public validate = MessageValidate;

  public formData: FormGroup;

  public isLoginFailed = false;

  public submitted = false;

  public rules: string[] = [];

  public urlParam: any;

  public socialData: any;

  public loginRequest: LoginRequest = new LoginRequest();

  public token: String;
  
  constructor(
    private zone: NgZone,
    private authService: AuthService,
    private tokenStorage: TokenStorageService,
    private router: Router,
    private routers: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.getToken();
    this.initForm();
    this.initLogin();
    this.routers.queryParams.subscribe((param) => {
      if (param.returnUrl === null || param.returnUrl === undefined) {
        this.urlParam = null;
      } else {
        this.urlParam = param.returnUrl;
      }
    });
  }

  getToken() {
    if (this.tokenStorage.getToken()) {
      this.router.navigate(['/home']);
    }
  }

  initForm() {
    this.formData = new FormGroup({
      email: new FormControl('', [
        Validators.required,
        Validators.maxLength(40),
      ]),
      password: new FormControl('', [
        Validators.required,
        Validators.maxLength(30),
      ]),
    });
  }

  get f() {
    return this.formData.controls;
  }

  onSubmit() {
    this.submitted = true;
    if (this.formData.invalid) {
      if (this.socialData.email_verified != undefined) {
        if (this.socialData.email_verified == true) {
          this.loginRequest.email = this.socialData.email;
          this.loginRequest.token = this.token;
        }
        else {
          return;
        }
      }
    }
    this.loginRequest = this.formData.value;
    if (this.socialData?.email_verified != undefined) {
      if (this.socialData?.email_verified == true) {
        this.loginRequest.email = this.socialData.email;
        this.loginRequest.token = this.token;
      }
    }
    this.authService.login(this.loginRequest).subscribe(
      (data) => {
        if (data.token) {
          this.tokenStorage.setMemoryStore(data);
          this.tokenStorage.saveToken(data.token);
          this.tokenStorage.saveUser(data);
          this.rules = this.tokenStorage.getUser().roles;
          this.isLoginFailed = false;
          if (this.urlParam === null) {
            this.zone.run(() => {
              this.router.navigate(['/home']);
            });
          } else {
            this.router.navigate([this.urlParam]);
          }
        } else {
          this.isLoginFailed = true;
        }
        // window.location.reload();
      },
      (err) => {
        this.isLoginFailed = true;
        this.socialData.email_verified = false;
        this.zone.run(() => {
          this.router.navigate([this.urlParam]);
        });
      }
    );
  }

  // login with google
  initLogin(): void {
    google.accounts.id.initialize({
      client_id: environment.oAuthClientId,
      callback: (response: any) => { this.handleGoogleSignIn(response); },
    });
    google.accounts.id.renderButton(
      document.getElementById("buttonDiv"),
      { size: "large", type: "standard", theme: "outline", shape: "rectangular", width: '100%'}  // customization attributes
    );
  }

  handleGoogleSignIn(response: any) {
    // This next is for decoding the idToken to an object to see the details.
    let base64Url = response.credential.split('.')[1];
    let base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    let jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    this.socialData = JSON.parse(jsonPayload);
    this.token = response.credential;
    this.onSubmit();
  }
}
