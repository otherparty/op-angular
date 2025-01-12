import { Injectable } from '@angular/core';
import {
  AuthenticationDetails,
  CognitoUser,
  CognitoUserPool,
  CognitoUserAttribute,
} from 'amazon-cognito-identity-js';
import { environment } from './../environments/environment';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { BillService } from '../services/bill.service';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class AuthenticateService {
  baseURL = 'http://localhost:9000/api/v1'; // URL to web api
  // baseURL = 'https://backend.otherparty.ai/api/v1/'; // URL to web api
  userPool: any;
  cognitoUser: any;
  username: string = '';

  constructor(
    private readonly router: Router,
    private toastr: ToastrService,
    private userService: BillService,
    private http: HttpClient
  ) {}

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
        this.router.navigate(['/']);
        localStorage.setItem(
          'registered-user',
          email
        );
        return result;
      },
      onFailure: (error: any) => {
        if (error.code === 'UserNotConfirmedException') {
          this.resendConfirmationCode(email);
          localStorage.setItem(
            'registered-user',
            this.cognitoUser.getUsername()
          );
          this.toastr.error('User is not confirmed', 'Error');
          this.router.navigate(['/otp-verification']);
        } else {
          this.toastr.error(error.message, 'Error');
        }
      },
    });
  }

  register(payload: any) {
    let poolData = {
      UserPoolId: environment.UserPoolId,
      ClientId: environment.ClientId,
    };

    const attributeList = [];

    attributeList.push(
      new CognitoUserAttribute({ Name: 'email', Value: payload.email })
    );
    attributeList.push(
      new CognitoUserAttribute({ Name: 'given_name', Value: payload.firstName })
    );
    attributeList.push(
      new CognitoUserAttribute({ Name: 'family_name', Value: payload.lastName })
    );
    attributeList.push(
      new CognitoUserAttribute({
        Name: 'custom:receiveEmail',
        Value: payload.receiveEmails.toString(),
      })
    );
    attributeList.push(
      new CognitoUserAttribute({ Name: 'custom:reps', Value: payload.reps })
    );
    attributeList.push(
      new CognitoUserAttribute({
        Name: 'custom:zip',
        Value: payload.zipCode.toString(),
      })
    );

    this.userPool = new CognitoUserPool(poolData);

    this.userPool.signUp(
      payload.email,
      payload.password,
      attributeList,
      null,
      (error: any, result: any) => {
        if (error) {
          console.log('error', error);
          this.toastr.error(error.message, 'Error');
          return;
        }
        this.cognitoUser = result.user;
        localStorage.setItem('registered-user', payload.email);
        this.router.navigate(['/otp-verification']);
      }
    );
  }

  // First time login attempt - New password require
  otpVerification(otp: any) {
    let poolData = {
      UserPoolId: environment.UserPoolId,
      ClientId: environment.ClientId,
    };

    const email = localStorage.getItem('registered-user');

    this.userPool = new CognitoUserPool(poolData);

    let userData: any = { Username: email, Pool: this.userPool };
    this.cognitoUser = new CognitoUser(userData);

    this.cognitoUser.confirmRegistration(
      otp,
      true,
      (error: any, result: any) => {
        if (error) {
          console.log('error', error);
          this.toastr.error(error.message, 'Error');
          return;
        }
        this.toastr.success('User verified successfully', 'Success');
        this.router.navigate(['/plans']);
      }
    );
  }

  checkUserStatus(email: string, userPoolId: string): Observable<any> {
    const url = `${this.baseURL}/check-user-status`;
    return this.http.post(url, { email, userPoolId });
  }

  resetPassword(email: string): Observable<any> {
    return new Observable((observer) => {
      const poolData = {
        UserPoolId: environment.UserPoolId,
        ClientId: environment.ClientId,
      };

      this.userPool = new CognitoUserPool(poolData);
      const userData = { Username: email, Pool: this.userPool };
      this.cognitoUser = new CognitoUser(userData);

      this.cognitoUser.forgotPassword({
        onSuccess: (result: any) => {
          console.log(result);
          observer.next(result); // Emit success result
          observer.complete(); // Complete the observable
        },
        onFailure: (err: any) => {
          console.log(err);
          observer.error(err); // Emit error
        },
        inputVerificationCode: (data: any) => {
          this.toastr.success(
            'Verification code sent to your email',
            'Success'
          );
          localStorage.setItem('reset-password-user', email);
          this.router.navigate(['/new-password']);
          observer.next(data); // Emit the verification code data
          observer.complete(); // Complete the observable
        },
      });
    });
  }

  resendConfirmationCode(email: any) {
    let poolData = {
      UserPoolId: environment.UserPoolId,
      ClientId: environment.ClientId,
    };

    this.userPool = new CognitoUserPool(poolData);
    let userData = { Username: email, Pool: this.userPool };
    this.cognitoUser = new CognitoUser(userData);

    this.cognitoUser.resendConfirmationCode((error: any, result: any) => {
      if (error) {
        console.log('error', error);
        this.toastr.error(error.message, 'Error');
        return;
      }
      localStorage.setItem('registered-user', email);
      this.toastr.success('Confirmation code sent successfully', 'Success');
      this.router.navigate(['/otp-verification']);
    });
  }

  getTransformedAttribute(
    attributeName: string,
    transformer?: (value: string) => string
  ): Promise<string | null> {
    // Initialize Cognito User Pool
    const userPool = new CognitoUserPool({
      UserPoolId: environment.UserPoolId,
      ClientId: environment.ClientId,
    });
  
    // Get the current Cognito user
    const cognitoUser = userPool.getCurrentUser();
  
    if (!cognitoUser) {
      console.error('No user is currently signed in.');
      return Promise.resolve(null);
    }
  
    // Fetch user attributes
    return new Promise((resolve, reject) => {
      cognitoUser.getUserAttributes((err: Error | undefined, attributes: CognitoUserAttribute[] | undefined) => {
        if (err) {
          console.error('Error fetching attributes:', err);
          reject(err);
          return;
        }
  
        const attribute = attributes?.find((attr) => attr.getName() === attributeName);
  
        if (attribute) {
          const value = attribute.getValue();
          resolve(transformer ? transformer(value) : value);
        } else {
          console.warn(`Attribute "${attributeName}" not found.`);
          resolve(null);
        }
      });
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

    attributeList.push(
      new CognitoUserAttribute({
        Name: 'custom:reps',
        Value: payload.reps.toString(),
      })
    );

    this.cognitoUser.updateAttributes(
      attributeList,
      (error: any, result: any) => {
        if (error) {
          console.log('error', error);
          this.toastr.error(error.message, 'Error');
          return;
        }
        this.toastr.success('User updated successfully', 'Success');
      }
    );
  }

  changePassword(code: any, password: any) {
    let poolData = {
      UserPoolId: environment.UserPoolId,
      ClientId: environment.ClientId,
    };

    this.userPool = new CognitoUserPool(poolData);
    const email = localStorage.getItem('reset-password-user');
    let userData: any = { Username: email, Pool: this.userPool };
    this.cognitoUser = new CognitoUser(userData);

    this.cognitoUser.confirmPassword(code, password, {
      onSuccess: (result: any) => {
        this.toastr.success('Password changed successfully', 'Success');
        this.router.navigate(['/login']);
      },
      onFailure: (err: any) => {
        console.log(err);
        this.toastr.error(err.message, 'Error');
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
      this.toastr.success('User logged out successfully', 'Success');
      this.router.navigate(['login']);
    }
  }

  isSessionValid = (cognitoUser: any) => {
    return cognitoUser.getSession((err: any, session: any) => {
      if (err) {
        console.error(err)
        return false;
      }
  
      // Return whether the session is valid
      if (session.isValid()) {
        localStorage.setItem('registered-reps', `${session.getIdToken().payload['custom:reps']}`);
        return true;
      }
  
      return false;
    });
  }

  isAuthenticated() {
    let poolData = {
      UserPoolId: environment.UserPoolId,
      ClientId: environment.ClientId,
    };
    this.userPool = new CognitoUserPool(poolData);
    this.cognitoUser = this.userPool.getCurrentUser();

    if (!this.cognitoUser) return false;

    return this.isSessionValid(this.cognitoUser);
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

    const email = localStorage.getItem('registered-user');
    let userData: any = { Username: email, Pool: this.userPool };
    this.cognitoUser = new CognitoUser(userData);

    this.cognitoUser.getSession((err: any, session: any) => {
      if (err) {
        console.log("🚀 ~ file: cognito.service.ts:311 ~ AuthenticateService ~ getUserAttributes ~ err", err)
        return;
      }
      console.log("🚀 ~ file: cognito.service.ts:311 ~ AuthenticateService ~ getUserAttributes ~ session:", session)
      return session;
    });
  }
}
