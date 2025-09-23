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

  /**
   * Fetch paginated headline cards for the stories feed.
   */
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

  /**
   * Load a full story payload by bill identifier. Optionally scope data to specific reps.
   */
  getFullStory(bill_id: string, reps?: Array<number> | string[]): Observable<any> {
    const payload: Record<string, unknown> = { bill_id };
    if (Array.isArray(reps) && reps.length) {
      payload['reps'] = reps;
    }

    return this.http
      .post(`${this.storiesBase}/full-story`, payload)
      .pipe(catchError(this.handleError<any>('getFullStory')));
  }

  /**
   * Search for a single bill by slug/identifier.
   */
  searchBill(search: string): Observable<any> {
    return this.http
      .get(`${this.storiesBase}/${search}`)
      .pipe(catchError(this.handleError<any>('searchBill')));
  }

  /**
   * Load subscriber engagement metrics for a representative.
   */
  getSubscriberDetails(sponsorId: string): Observable<any> {
    return this.http
      .post(`${this.storiesBase}/emailVotes`, { sponsorId })
      .pipe(catchError(this.handleError<any>('getSubscriberDetails')));
  }

  /**
   * Fetch bills a representative voted in favor of.
   */
  votedForList(sponsorId: string): Observable<any> {
    return this.http
      .post(`${this.storiesBase}/votedForList`, { sponsorId })
      .pipe(catchError(this.handleError<any>('votedForList')));
  }

  /**
   * Fetch bills a representative sponsored or co-sponsored.
   */
  votedSponsoredCosponsoredList(sponsorId: string): Observable<any> {
    return this.http
      .post(`${this.storiesBase}/votedSponsoredCosponsoredList`, { sponsorId })
      .pipe(catchError(this.handleError<any>('votedSponsoredCosponsoredList')));
  }

  /**
   * Search for representatives using a free-form term.
   */
  searchForReps(search: string): Observable<any> {
    return this.http
      .post(`${this.storiesBase}/rep`, { search })
      .pipe(catchError(this.handleError<any>('searchForReps')));
  }

  /**
   * Retrieve the list of bills a representative voted against.
   */
  votedAgainstList(sponsorId: string): Observable<any> {
    return this.http
      .post(`${this.storiesBase}/votedAgainstList`, { sponsorId })
      .pipe(catchError(this.handleError<any>('votedAgainstList')));
  }

  /**
   * Broadcast subscriber tab changes to listeners.
   */
  callXFunction(tab: any, isSubscriberPage: boolean) {
    this.xFunctionSubject.next([tab, isSubscriberPage]);
  }

  /**
   * Broadcast feed tab toggles (e.g. checkboxes) to listeners.
   */
  callYFunction(tab: any, isChecked: boolean) {
    this.yFunctionSubject.next([tab, isChecked]);
  }

  /**
   * Resolve representatives for a supplied ZIP code.
   */
  getRepsFromZipCode(zip: any): Observable<any> {
    return this.http
      .get(`${this.apiBase}/user/zip/${zip}`)
      .pipe(catchError(this.handleError<any>('getRepsFromZipCode')));
  }

  /**
   * Verify an authenticated user's Stripe subscription status.
   */
  checkForUserSubscription(token: string): Observable<any> {
    return this.http
      .get(`${this.apiBase}/stripe/get-subscription-status`, {
        headers: { Authorization: token },
      })
      .pipe(catchError(this.handleError<any>('checkForUserSubscription')));
  }

  /**
   * Cancel the authenticated user's Stripe subscription.
   */
  cancelForUserSubscription(token: string): Observable<any> {
    return this.http
      .delete(`${this.apiBase}/stripe/cancel-subscription-status`, {
        headers: { Authorization: token },
      })
      .pipe(catchError(this.handleError<any>('cancelForUserSubscription')));
  }

  /**
   * Persist the set of bills a user follows in the backend.
   */
  updateUserWithFollowBills(followBills: string, iCognitoId: string): Observable<any> {
    return this.http
      .put(`${this.apiBase}/auth/update-user`, { followBills, iCognitoId })
      .pipe(catchError(this.handleError<any>('updateUserWithFollowBills')));
  }

  /**
   * Generic RxJS error handler that logs and returns a safe fallback observable.
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

  /** Log a message through the shared MessageService. */
  private log(message: string) {
    this.messageService.add(`BillService: ${message}`);
  }
}
