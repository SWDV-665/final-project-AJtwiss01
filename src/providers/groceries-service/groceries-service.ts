import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

import { Observable } from "rxjs/observable"
import {map, catchError  }  from "rxjs/operators"

import { Subject } from "rxjs"

/*
  Generated class for the groceriesServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class groceriesServiceProvider {
  items: any= [];
  dataChanged$: Observable<boolean>;

  private dataChangeSubject: Subject<boolean>;

  baseUrl = "https://grociery-server-demo.herokuapp.com";

  constructor(public http: HttpClient) {
    console.log("Hello groceriesServiceProvider Provider");
    this.dataChangeSubject = new Subject<boolean>();
    this.dataChanged$ = this.dataChangeSubject.asObservable();
  }
  getItems(): Observable<object[]> {
    return this.http.get(this.baseUrl + '/api/groceries').pipe(
      map(this.extractData),
      catchError(this.handleError)
    )
  }
  private extractData(res: Response){
    let body = res;
    return body || {}
  }
  private handleError(error: Response | any){
    return Observable.throw(error.status)
   }
  removeItem(id) {
    this.http.delete(this.baseUrl + '/api/groceries/'+id).subscribe(res => {
      this.items = res;
      this.dataChangeSubject.next(true)
    })
  }
  addItem(item){
    this.http.post(this.baseUrl + '/api/groceries',item).subscribe(res => {
      this.items = res;
      this.dataChangeSubject.next(true)
    })
  }

  editItemPrompt(item, index){
    console.log(item)
    this.http.put(this.baseUrl + '/api/groceries/'+item._id,item).subscribe(res => {
      this.items = res;
      this.dataChangeSubject.next(true)
    })

  }
}
