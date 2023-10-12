import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { _CONST } from 'src/app/core/constants/app.constants';

@Component({
  selector: 'app-password-hints',
  templateUrl: './password-hints.component.html',
  styleUrls: ['./password-hints.component.scss']
})
export class PasswordHintsComponent implements OnInit, OnChanges {

  passwordHints = _CONST.passwordHints;
  specialChars = _CONST.specialChars;
  @Input('newPassword') newPassword;
  constructor(private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer) {
      this.matIconRegistry.addSvgIcon(
        'custom_check_circle',
        this.domSanitizer.bypassSecurityTrustResourceUrl('../../../../assets/images/svg/green_tick.svg')
      );
      this.matIconRegistry.addSvgIcon(
        'custom_cancel',
        this.domSanitizer.bypassSecurityTrustResourceUrl('../../../../assets/images/svg/red_cross.svg')
      );
      this.matIconRegistry.addSvgIcon(
        'grey_circle',
        this.domSanitizer.bypassSecurityTrustResourceUrl('../../../../assets/images/svg/grey_circle.svg')
      );
      
     }

  ngOnInit(): void {
  }

  ngOnChanges(): void {
    this.checkPasswordHints();
  }


  checkPasswordHints() {
    for (let key in this.passwordHints) {
      let isMatch = this.passwordHints[key].regex.test(this.newPassword);
      if (!this.newPassword) {
        this.passwordHints[key].matchStatus = 0;
        this.passwordHints[key].matIcon = "grey_circle";
      } else if (isMatch) {
        this.passwordHints[key].matchStatus = 1;
        this.passwordHints[key].matIcon = "custom_check_circle";
      } else {
        this.passwordHints[key].matchStatus = 2;
        this.passwordHints[key].matIcon = "custom_cancel";
      }
    }
  }
}
