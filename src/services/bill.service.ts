import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { MessageService } from './message.service';
import { Observable, Subject, catchError, of, tap } from 'rxjs';
import { AuthenticateService } from './cognito.service';
import { switchMap } from 'rxjs/operators';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class BillService {
  private readonly apiBase = environment.baseURL?.replace(/\/?$/, '') || '';
  private readonly storiesBase = environment.billsURL || `${this.apiBase}/stories`;

  private xFunctionSubject = new Subject<[any, boolean]>();
  private yFunctionSubject = new Subject<[any, boolean]>();

  xFunctionCalled$ = this.xFunctionSubject.asObservable();
  yFunctionCalled$ = this.yFunctionSubject.asObservable();

  constructor(
    private http: HttpClient,
    private messageService: MessageService,
    private cognito: AuthenticateService
  ) { }

  /** POST: add a new hero to the server */
  getHeadLines(
    nLimit: number,
    nOffset: number,
    orderBy: string
  ): Observable<any> {
    return this.http.post(this.storiesBase, { nLimit, nOffset, orderBy }).pipe(
      tap((headlines) => this.log(`Got 10 headlines`)),
      catchError(this.handleError<any>('getHeadLines'))
    );
  }

  /** POST: add a new hero to the server */
  getFullStory(bill_id: string, reps?: Array<number> | string[]): Observable<any> {
    const payload: Record<string, unknown> = { bill_id };
    if (Array.isArray(reps) && reps.length) {
      payload['reps'] = reps;
    }

    return this.http
      .post(`${this.storiesBase}/full-story`, payload)
      .pipe(catchError(this.handleError<any>('getFullStory')));
  }

  /** POST: add a new hero to the server */
  searchBill(search: string): Observable<any> {
    return this.http
      .get(`${this.storiesBase}/${search}`)
      .pipe(catchError(this.handleError<any>('searchBill')));
  }

  getSubscriberDetails(sponsorId: string): Observable<any> {
    return this.http
      .post(`${this.storiesBase}/emailVotes`, { sponsorId })
      .pipe(catchError(this.handleError<any>('getSubscriberDetails')));
  }

  votedForList(sponsorId: string): Observable<any> {
    return this.http
      .post(`${this.storiesBase}/votedForList`, { sponsorId })
      .pipe(catchError(this.handleError<any>('votedForList')));
  }

  votedSponsoredCosponsoredList(sponsorId: string): Observable<any> {
    return this.http
      .post(`${this.storiesBase}/votedSponsoredCosponsoredList`, { sponsorId })
      .pipe(catchError(this.handleError<any>('votedSponsoredCosponsoredList')));
  }

  searchForReps(search: string): Observable<any> {
    return this.http
      .post(`${this.storiesBase}/rep`, { search })
      .pipe(catchError(this.handleError<any>('searchForReps')));
  }

  /**
   *
   * @param sponsorId
   * @returns
   */
  votedAgainstList(sponsorId: string): Observable<any> {
    return this.http
      .post(`${this.storiesBase}/votedAgainstList`, { sponsorId })
      .pipe(catchError(this.handleError<any>('votedAgainstList')));
  }

  callXFunction(tab: any, isSubscriberPage: boolean) {
    this.xFunctionSubject.next([tab, isSubscriberPage]);
  }
  callYFunction(tab: any, isChecked: boolean) {
    this.yFunctionSubject.next([tab, isChecked]);
  }

  getRepsFromZipCode(zip: any): Observable<any> {
    return this.http
      .get(`${this.apiBase}/user/zip/${zip}`)
      .pipe(catchError(this.handleError<any>('getRepsFromZipCode')));
  }

  checkForUserSubscription(token: string): Observable<any> {
    return this.http
      .get(`${this.apiBase}/stripe/get-subscription-status`, {
        headers: { Authorization: token },
      })
      .pipe(catchError(this.handleError<any>('checkForUserSubscription')));
  }

  cancelForUserSubscription(token: string): Observable<any> {
    return this.http
      .delete(`${this.apiBase}/stripe/cancel-subscription-status`, {
        headers: { Authorization: token },
      })
      .pipe(catchError(this.handleError<any>('cancelForUserSubscription')));
  }

  updateUserWithFollowBills(followBills: string, iCognitoId: string): Observable<any> {
    return this.http
      .put(`${this.apiBase}/auth/update-user`, { followBills, iCognitoId })
      .pipe(catchError(this.handleError<any>('updateUserWithFollowBills')));
  }

  /**
   * Handle Http operation that failed.
   * Let the app continue.
   *
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      this.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

  // postContent(user: any, endpoint: any): Observable<any> {
  //   // Fetch account info using AccountService
  //   return this.cognito.getAccountInfo(accountId).pipe(
  //     switchMap((accountInfo) => {
  //       console.log('Account Info:', accountInfo);

  //       // Use the account info to make a POST request for content
  //       const url = `${this.contentBaseUrl}/specific-endpoint`;
  //       return this.http.post(url, { content, accountInfo });
  //     })
  //   );
  // }

  /** Log a HeroService message with the MessageService */
  private log(message: string) {
    this.messageService.add(`HeroService: ${message}`);
  }
}
