import { Component, OnInit } from '@angular/core';
import { AuthService } from "../../services/auth/auth.service";
import { UserService } from "../../services/user/user.service";
import {Address, UserInfosModel} from 'src/app/models/user/userInfosModel';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit {
  username: string = 'User';
  userData : UserInfosModel = {} as UserInfosModel ;
  userAddress : Address = {} as Address;
  constructor(private authService: AuthService, private userService: UserService) {

  }
  ngOnInit() {
    if (this.authService.loggedInUsername) {
      this.username = this.authService.loggedInUsername;
    }

    this.userService.userProfile(this.username).subscribe((data: UserInfosModel) => {
      this.userData = data;
      this.userAddress = data?.address;
      console.log(this.userAddress);
    });
  }

}
