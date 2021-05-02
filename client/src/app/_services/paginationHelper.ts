import { HttpClient, HttpParams } from "@angular/common/http";
import { map } from "rxjs/operators";
import { PaginatedResult } from "../_models/pagination";

export function getPaginationResult<T>(url: string, param: HttpParams, http:HttpClient) {
    let paginatedResult: PaginatedResult<T> = new PaginatedResult<T>();

    return http.get<T>(url, { observe: 'response', params: param }).pipe(
      map(response => {
        paginatedResult.result = response.body;

        if (response.headers.get('Pagination')) {
          paginatedResult.pagination = JSON.parse(response.headers.get('Pagination'));
        }
        return paginatedResult;
      })
    );
  }

 export function getParamHeader(pageNumber: number, pageSize: number){
    let param = new HttpParams();
    param = param.append('pageNumber', pageNumber.toString());
    param = param.append('pageSize', pageSize.toString());
    return param;
  }