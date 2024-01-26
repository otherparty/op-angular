import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { MessageService } from './message.service';
import { Observable, catchError, of, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class BillService {
  // billsURL = 'http://localhost:9000/api/v1/stories';  // URL to web api
  billsURL = `https://backend.otherparty.ai/api/v1/stories`;

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
    return this.http.post(this.billsURL, { nLimit, nOffset }).pipe(
      tap((headlines) => this.log(`Got 10 headlines`)),
      catchError(this.handleError<any>('getHeadLines'))
    );
  }

  /** POST: add a new hero to the server */
  getFullStory(_id: string): Observable<any> {
    return this.http
      .post(`${this.billsURL}/full-story`, { _id })
      .pipe(catchError(this.handleError<any>('getFullStory')));
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
