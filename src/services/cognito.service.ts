import { Injectable } from "@angular/core";
import {
  AuthenticationDetails,
  CognitoUser,
  CognitoUserPool,
  CognitoUserAttribute
} from "amazon-cognito-identity-js";
import { environment } from "./../environments/environment";
import { Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";

@Injectable({
  providedIn: "root",
})
export class AuthenticateService {
  userPool: any;
  cognitoUser: any;
  username: string = "";

  constructor(private readonly router: Router, private toastr: ToastrService) { }

  // Login
  login(email: any, password: any) {
    let authenticationDetails = new AuthenticationDetails({
      Username: email,
      Password: password,
    });

    let poolData = {
      UserPoolId: environment.UserPoolId,
      ClientId: environment.ClientId,
    };

    this.username = email;
    this.userPool = new CognitoUserPool(poolData);
    let userData = { Username: email, Pool: this.userPool };
    this.cognitoUser = new CognitoUser(userData);

    this.cognitoUser.authenticateUser(authenticationDetails, {
      onSuccess: (result: any) => {
        this.router.navigate(["/"]);
        console.log("Success Results : ", result);
        return result;
      },
      onFailure: (error: any) => {
        this.toastr.error(error.message, "Error");
        
      },
    });
  }

  register(payload: any) {
    let poolData = {
      UserPoolId: environment.UserPoolId,
      ClientId: environment.ClientId,
    };

    const attributeList = [];

    attributeList.push(new CognitoUserAttribute({ Name: "email", Value: payload.email }));
    attributeList.push(new CognitoUserAttribute({ Name: "given_name", Value: payload.firstName }));
    attributeList.push(new CognitoUserAttribute({ Name: "family_name", Value: payload.lastName }));
    attributeList.push(new CognitoUserAttribute({ Name: "custom:receiveEmail", Value: payload.receiveEmails.toString() }));
    attributeList.push(new CognitoUserAttribute({ Name: "custom:reps", Value: payload.reps }));

    this.userPool = new CognitoUserPool(poolData);

    this.userPool.signUp(payload.email, payload.password, attributeList, null, (error: any, result: any) => {
      if (error) {
        console.log("error", error);
        this.toastr.error(error.message, "Error");
        return;
      }
      this.cognitoUser = result.user;
      localStorage.setItem('registered-user', this.cognitoUser.getUsername());
      this.router.navigate(['/otp-verification']);
    });
  }

  // First time login attempt - New password require
  otpVerification(
    otp: any,
  ) {
    let poolData = {
      UserPoolId: environment.UserPoolId,
      ClientId: environment.ClientId,
    };

    const email = localStorage.getItem('registered-user');

    this.userPool = new CognitoUserPool(poolData);

    let userData : any = { Username: email, Pool: this.userPool };
    this.cognitoUser = new CognitoUser(userData);

    this.cognitoUser.confirmRegistration(otp, true, (error: any, result: any) => {
      if (error) {
        console.log("error", error);
        this.toastr.error(error.message, "Error");
        return;
      }
      this.toastr.success("User verified successfully", "Success");
      this.router.navigate(['/login']);
    });
  }

  resetPassword(email: any) {
    let poolData = {
      UserPoolId: environment.UserPoolId,
      ClientId: environment.ClientId,
    };

    this.userPool = new CognitoUserPool(poolData);
    let userData = { Username: email, Pool: this.userPool };
    this.cognitoUser = new CognitoUser(userData);

    this.cognitoUser.forgotPassword({
      onSuccess: (result: any) => {
        console.log(result);
      },
      onFailure: (err: any) => {
        console.log(err);
      },
      inputVerificationCode: (data: any) => {
        this.toastr.success("Verification code sent to your email", "Success");
        localStorage.setItem("reset-password-user", email);
        this.router.navigate(["/new-password"]);
      }
    });
  }

  updateAttributes(payload: any, email: any) { 
    let poolData = {
      UserPoolId: environment.UserPoolId,
      ClientId: environment.ClientId,
    };

    this.userPool = new CognitoUserPool(poolData);
    let userData = { Username: email, Pool: this.userPool };
    this.cognitoUser = new CognitoUser(userData);


    const attributeList = [];

    attributeList.push(new CognitoUserAttribute({ Name: "custom:reps", Value: payload.reps.toString() }));

    this.cognitoUser.updateAttributes(attributeList, (error: any, result: any) => {
      if (error) {
        console.log("error", error);
        this.toastr.error(error.message, "Error");
        return;
      }
      this.toastr.success("User updated successfully", "Success");
    })

   }

  changePassword(code: any, password: any) {
    let poolData = {
      UserPoolId: environment.UserPoolId,
      ClientId: environment.ClientId,
    };

    this.userPool = new CognitoUserPool(poolData);
    const email = localStorage.getItem("reset-password-user");
    let userData :any = { Username: email, Pool: this.userPool };
    this.cognitoUser = new CognitoUser(userData);

    this.cognitoUser.confirmPassword(code, password,{
      onSuccess: (result: any) => {
        this.toastr.success("Password changed successfully", "Success");
        this.router.navigate(["/login"]);
      },
      onFailure: (err: any) => {
        console.log(err);
        this.toastr.error(err.message, "Error");
      },
    });
  }

  // Logout 
  logOut() {
    let poolData = {
      UserPoolId: environment.UserPoolId,
      ClientId: environment.ClientId,
    };
    this.userPool = new CognitoUserPool(poolData);
    this.cognitoUser = this.userPool.getCurrentUser();
    if (this.cognitoUser) {
      this.cognitoUser.signOut();
      localStorage.clear();
      this.toastr.success("User logged out successfully", "Success");
      this.router.navigate(["login"]);
    }
  }

  getUser() {
    let poolData = {
      UserPoolId: environment.UserPoolId,
      ClientId: environment.ClientId,
    };
    this.userPool = new CognitoUserPool(poolData);
    return this.userPool.getCurrentUser();
  }

  getUserAttributes() {
    let poolData = {
      UserPoolId: environment.UserPoolId,
      ClientId: environment.ClientId,
    };
    this.userPool = new CognitoUserPool(poolData);
    this.cognitoUser = this.userPool.getUsername()
  }

}