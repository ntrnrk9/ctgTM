import { Injectable } from '@angular/core';

@Injectable()
export class MasterServService {

  constructor() { }

  private sessionUser:string;
  private authToken:string;
  private sessionUserID:string;

	public get $authToken(): string {
		return this.authToken;
	}

	public set $authToken(value: string) {
		this.authToken = value;
	}

	public get $sessionUser(): string {
		return this.sessionUser;
	}

	public set $sessionUser(value: string) {
		this.sessionUser = value;
	}


	public get $sessionUserID(): string {
		return this.sessionUserID;
	}

	public set $sessionUserID(value: string) {
		this.sessionUserID = value;
	}
	
  

}
