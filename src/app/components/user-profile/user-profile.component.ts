import { Component, OnInit } from '@angular/core';
import { AuthService } from "../../services/auth/auth.service";
import { UserService } from "../../services/user/user.service";
import { UserInfosModel } from 'src/app/models/user/userInfosModel';
import {CardDetailModel} from "../../models/card/cardDetailModel";

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit {
  username: string = 'User';
  userData : UserInfosModel = {} as UserInfosModel ;
  constructor(private authService: AuthService, private userService: UserService) {

  }
  ngOnInit() {
    if (this.authService.loggedInUsername) {
      this.username = this.authService.loggedInUsername;
    }

    this.userService.userProfile(this.username).subscribe((data: UserInfosModel) => {
      this.userData = data;
    });
  }

}
