import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { MessageService } from './message.service';
import { Observable, Subject, catchError, of, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class BillService {
  // billsURL = 'http://localhost:9000/api/v1/stories'; // URL to web api
  billsURL = `https://backend.otherparty.ai/api/v1/stories`;

  private xFunctionSubject = new Subject<[any, boolean]>();
  private yFunctionSubject = new Subject<[any, boolean]>();

  xFunctionCalled$ = this.xFunctionSubject.asObservable();
  yFunctionCalled$ = this.yFunctionSubject.asObservable();

  constructor(
    private http: HttpClient,
    private messageService: MessageService
  ) {}

  /** POST: add a new hero to the server */
  getHeadLines(
    nLimit: number,
    nOffset: number,
    orderBy: string
  ): Observable<any> {
    return this.http.post(this.billsURL, { nLimit, nOffset, orderBy }).pipe(
      tap((headlines) => this.log(`Got 10 headlines`)),
      catchError(this.handleError<any>('getHeadLines'))
    );
  }

  /** POST: add a new hero to the server */
  getFullStory(bill_id: string): Observable<any> {
    return this.http
      .post(`${this.billsURL}/full-story`, { bill_id })
      .pipe(catchError(this.handleError<any>('getFullStory')));
  }

  /** POST: add a new hero to the server */
  searchBill(search: string): Observable<any> {
    return this.http
      .get(`${this.billsURL}/${search}`)
      .pipe(catchError(this.handleError<any>('searchBill')));
  }

  getSubscriberDetails(sponsorId: string): Observable<any> {
    return this.http
      .post(`${this.billsURL}/emailVotes`, { sponsorId })
      .pipe(catchError(this.handleError<any>('getSubscriberDetails')));
  }

  votedForList(sponsorId: string): Observable<any> {
    return this.http
      .post(`${this.billsURL}/votedForList`, { sponsorId })
      .pipe(catchError(this.handleError<any>('votedForList')));
  }

  votedSponsoredCosponsoredList(sponsorId: string): Observable<any> {
    return this.http
      .post(`${this.billsURL}/votedSponsoredCosponsoredList`, { sponsorId })
      .pipe(catchError(this.handleError<any>('votedSponsoredCosponsoredList')));
  }

  searchForReps(search: string): Observable<any> {
    return this.http
      .post(`${this.billsURL}/rep`, { search })
      .pipe(catchError(this.handleError<any>('searchForReps')));
  }

  /**
   *
   * @param sponsorId
   * @returns
   */
  votedAgainstList(sponsorId: string): Observable<any> {
    return this.http
      .post(`${this.billsURL}/votedAgainstList`, { sponsorId })
      .pipe(catchError(this.handleError<any>('votedAgainstList')));
  }

  callXFunction(tab: any, isSubscriberPage: boolean) {
    this.xFunctionSubject.next([tab, isSubscriberPage]);
  }
  callYFunction(tab: any, isChecked: boolean) {
    this.yFunctionSubject.next([tab, isChecked]);
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

  /** Log a HeroService message with the MessageService */
  private log(message: string) {
    this.messageService.add(`HeroService: ${message}`);
  }
}
