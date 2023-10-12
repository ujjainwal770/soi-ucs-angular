import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})



export class LoginComponent implements OnInit {
  
  
  currentUrl : string;
  title : string;
  setPasswordUrl:string;
  constructor(private router:Router) {
    this.currentUrl = router.url;
    this.setPasswordUrl = this.currentUrl.substring(0, this.currentUrl.lastIndexOf('/') + 1);
    this.title = this.setPasswordUrl === '/auth/set-password/'?"Set":this.setPasswordUrl === '/auth/reset-password/'?'Reset':'';
  }

  ngOnInit(): void {
  }

  
}
