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
import { catchError, Observable } from 'rxjs';
import { BillService } from '../services/bill.service';
import { HttpClient } from '@angular/common/http';
import { throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthenticateService {
  // baseURL = 'http://localhost:9000/api/v1/'; // URL to web api
  baseURL = 'https://backend.otherparty.ai/api/v1/'; // URL to web api
  userPool: any;
  cognitoUser: any;
  username: string = '';

  constructor(
    private readonly router: Router,
    private toastr: ToastrService,
    private http: HttpClient
  ) { }

  // Login
  login(email: any, password: any): Promise<any> {
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

    return new Promise((resolve, reject) => {
      this.cognitoUser.authenticateUser(authenticationDetails, {
        onSuccess: (session: any) => {
          this.router.navigate(['/']);
          localStorage.setItem(
            'registered-user',
            email
          );
          resolve(session);
        },
        onFailure: (error: any) => {
          if (error.code === 'UserNotConfirmedException') {
            this.resendConfirmationCode(email);
            localStorage.setItem(
              'registered-user',
              this.cognitoUser.getUsername()
            );
            this.toastr.error(`Let's confirm your account`, 'Error');
            this.router.navigate(['/otp-verification']);
          } else {
            this.toastr.error(`Let's confirm your account.`, 'Error');
          }
          reject(error);
        },
      });
    });

  }

  getUserSubscriptions(): Promise<Observable<any>> {
    return this.getIdToken().then((token) => {
      if (!token) {
        console.error('No authentication token found.');
        this.toastr.error('Please log in again.', 'Error');
        return throwError(() => new Error('Token is missing'));
      }

      return this.http
        .get(`${this.baseURL}stripe/get-subscription-status`, {
          headers: { Authorization: token }
        })
        .pipe(catchError(this.handleError<any>('getUserSubscriptions')));
    }).catch((error) => {
      console.error('Error fetching ID token:', error);
      this.toastr.error(`We're having trouble signing you in`, 'Error');
      return throwError(() => new Error(error));
    });
  }

  private handleError<T>(operation = 'operation') {
    return (error: any): Observable<T> => {
      console.error(`${operation} failed:`, error);

      // Optionally, show an error message to the user
      this.toastr.error(`It's not you, it's me.`, 'Error');

      // Return an observable with an appropriate error message
      return throwError(() => new Error(`Something went wrong during ${operation}. Please try again.`));
    };
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
          this.toastr.error(`We're having trouble signing you up.`, 'Error');
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
          this.toastr.error(`We're having trouble confirming your account.`, 'Error');
          return;
        }
        // this.toastr.success('Success!', 'Success');
        this.router.navigate(['/plans']);
      }
    );
  }

  checkUserStatus(email: string, userPoolId: string): Observable<any> {
    const url = `${this.baseURL}check-user-status`;
    return this.http.post(url, { email, userPoolId });
  }

  createUserAccountInDB(body: any): Observable<any> {
    const url = `${this.baseURL}auth/register`;
    return this.http.post(url, body);
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
            'We sent a verification code to your email',
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
        this.toastr.error(`We're having trouble finding your confirmation code.`, 'Error');
        return;
      }
      localStorage.setItem('registered-user', email);
      this.toastr.success('We sent you a confirmation code.', 'Success');
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

  async updateSubscriptionAttribute(payload: any, email: string) {

    const attributeList = [
      new CognitoUserAttribute({
        Name: 'custom:subscription',
        Value: payload,
      }),
    ];

    this.cognitoUser.updateAttributes(attributeList, (error: any, result: any) => {
      if (error) {
        console.error('Error updating attribute:', error);
        this.toastr.error('Robo-rage', 'Error');
        return;
      }
      // this.toastr.success('Success!', 'Success');
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
          this.toastr.error('Robo-rage', 'Error');
          return;
        }
        // this.toastr.success('Success!', 'Success');
      }
    );
  }


  // Function to refresh tokens if session is expired
  refreshCognitoToken(refreshToken: any) {
    return new Promise((resolve, reject) => {
      this.cognitoUser.refreshSession(refreshToken, (err: any, session: any) => {
        if (err) {
          reject(err);
        } else {
          console.log('Session refreshed successfully');
          localStorage.setItem('idToken', session.getIdToken().getJwtToken());
          localStorage.setItem('accessToken', session.getAccessToken().getJwtToken());
          resolve(session);
        }
      });
    });
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
        this.toastr.success('Your password has been updated.', 'Success');
        this.router.navigate(['/login']);
      },
      onFailure: (err: any) => {
        console.log(err);
        this.toastr.error(`We're having trouble right now. Please try again later.`, 'Error');
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
      // this.toastr.success(`You're logged out.`, 'Success');
      this.router.navigate(['login']);
    }
  }

  isSessionValid = (cognitoUser: any) => {
    return cognitoUser.getSession((err: any, session: any) => {
      if (err) {
        console.error(err)
        return false;
      }

      // console.log(session);


      // Return whether the session is valid
      if (session.isValid()) {
        localStorage.setItem('registered-reps', `${session.getIdToken().payload['custom:reps']}`);
        return true;
      }

      return false;
    });
  }

  getIdToken(): Promise<string | null> {
    return new Promise((resolve, reject) => {
      let poolData = {
        UserPoolId: environment.UserPoolId,
        ClientId: environment.ClientId,
      };

      this.userPool = new CognitoUserPool(poolData);
      this.cognitoUser = this.userPool.getCurrentUser();

      if (!this.cognitoUser) {
        console.log('No current user found');
        return resolve(null);
      }

      this.cognitoUser.getSession((err: any, session: any) => {
        console.log("Session retrieved:", session);
        console.log("Error:", err);

        if (err) {
          console.error('Error getting session:', err);
          return resolve(null);
        }

        if (!session.isValid()) {
          console.log('Session is invalid or expired.');
          return resolve(null);
        }

        resolve(session.getIdToken().getJwtToken());
      });
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
        return;
      }
      return session;
    });
  }

  sendUserAttribute(user: any, endpoint: any): Observable<any[]> { // Observable is correctly used here as a type
    return this.http.post<any[]>(`${endpoint}`, { user }); // The response is expected to be an array
  }
}
