import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MainService } from 'src/app/core/services/main.service';
import { AccountService } from "../../core/services/account.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  browserName: any;
  @Output() loggedResult: EventEmitter<string> = new EventEmitter<string>();

  constructor(private accs: AccountService,
    private router: Router,
    private fb: FormBuilder,
    private main: MainService) { }

  ngOnInit(): void {
    this.fnBrowserDetect();
    this.loginForm = this.fb.group({
      uname: ['', Validators.required],
      pass: ['', Validators.required]
    });
  }

  login() {
    if(this.loginForm.valid){
      this.accs.matchUsernameAndPassword({data: this.loginForm.getRawValue()}).subscribe((res: any) =>{
        if(res.success){
          const ses_code = this.main.encrypt(res.data.priv_label ? res.data.priv_label : '', this.main.tokenKeys().session);
          
          const session_data : any = {
            branch_id: res.data.branch_id,
            acc_id: res.data.acc_id,
            ses_code: ses_code,
            ses_cookies: '',
            ses_browser: this.browserName,
          };

          const session_data_storage : any = {
            branch_id: res.data.branch_id,
            acc_id: res.data.acc_id,
            ses_code: ses_code,
            priv_label: res.data.priv_label,
            priv_binary: res.data.priv_binary
          };

          const session_data_storage_json =  JSON.stringify(session_data_storage);
          const session_data_encrypted = this.main.encrypt(session_data_storage_json,this.main.tokenKeys().session_data);

          localStorage.setItem('sessions', session_data_encrypted);
          localStorage.setItem('session', ses_code);

          this.main.addSession({data: session_data}).subscribe((res_session: any) =>{

            if(res_session.success){
              this.main.snackbar('Login Successful', 'X', 2000, '');
              this.loggedResult.emit('logged in');
              this.router.navigate([res.data.priv_label + '/dashboard']);
            } else {
              this.main.snackbar('Session Expired', 'X', 2000, '');
            }
          })
        } else {
          this.main.snackbar(res.data, 'X', 2000, 'warn-panel');
        }
      })
    } else {
      this.main.snackbar('Invalid Credentials', 'X', 2000, 'warn-panel');
    }
  }

  fnBrowserDetect(){
    let userAgent = navigator.userAgent;
    if(userAgent.match(/chrome|chromium|crios/i)){
        this.browserName = "chrome";
    } else if (userAgent.match(/firefox|fxios/i)){
      this.browserName = "firefox";
    } else if (userAgent.match(/safari/i)){
      this.browserName = "safari";
    } else if (userAgent.match(/opr\//i)){
      this.browserName = "opera";
    } else if (userAgent.match(/edg/i)){
      this.browserName = "edge";
    } else {
      this.browserName = "No browser detection";
    }
  }

}
