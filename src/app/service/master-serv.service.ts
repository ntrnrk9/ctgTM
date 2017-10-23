import { Injectable } from '@angular/core';

@Injectable()
export class MasterServService {

  constructor() { }

  private sessionUser:String;
  private authToken:String;

	public get $authToken(): String {
		return this.authToken;
	}

	public set $authToken(value: String) {
		this.authToken = value;
	}

	public get $sessionUser(): String {
		return this.sessionUser;
	}

	public set $sessionUser(value: String) {
		this.sessionUser = value;
	}
  

}
