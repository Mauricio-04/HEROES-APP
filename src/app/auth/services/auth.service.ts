import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable, of, tap } from 'rxjs';
import { enviroment } from '../../../environments/enviroment';
import { Auth } from '../interfaces/auth.interfaces';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private baseUrl:string = enviroment.baseUrl;
  private _auth:Auth | undefined;
  get auth():Auth{
    return {...this._auth!}
  }
  constructor(private http:HttpClient) { }

   verificaAutenticacion():Observable<boolean>{
    if(!localStorage.getItem('token')){
      return of(false);
    }
   return  this.http.get<Auth>(`${this.baseUrl}/usuarios/1`)
   .pipe(
     map(auth => {
      console.log('map',auth);
      this._auth = auth;
      return true;
     })
   );
  }
  login(){
    return this.http.get<Auth>(`${this.baseUrl}/usuarios/1`)
            .pipe(
              tap( auth => this._auth = auth),
              tap(auth => localStorage.setItem('token',auth.id))
            );
  }
}
