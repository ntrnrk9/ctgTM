import { TestBed, inject } from '@angular/core/testing';

import { MasterServService } from './master-serv.service';

describe('MasterServService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MasterServService]
    });
  });

  it('should be created', inject([MasterServService], (service: MasterServService) => {
    expect(service).toBeTruthy();
  }));
});
