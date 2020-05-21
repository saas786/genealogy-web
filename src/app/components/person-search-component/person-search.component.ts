import { Component, OnInit, Input, AfterContentInit, Output, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';

import { ConfigurationService } from 'src/app/_services/ConfigurationService';
import { GraphQLService } from 'src/app/_services/GraphQLService';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import {map, startWith} from 'rxjs/operators';


export interface User {
  firstName: string;
  lastName: string;
  maidenName: string;
}

@Component({
  selector: 'app-person-search',
  templateUrl: './person-search.component.html',
  styleUrls: ['./person-search.component.css']
})

export class PersonSearchComponent implements OnInit, AfterContentInit {

  @Output() personChanged = new EventEmitter<string>();

  myControl = new FormControl();
  options: User[] = [  ];
  filteredOptions: Observable<User[]>;



  constructor(
    private http: HttpClient,
    private fb: FormBuilder,
    public configurationService: ConfigurationService,
    private graphQLService: GraphQLService,
    private router: Router
  ) {

  }

  optionSelected(id: any) {
    this.personChanged.emit(id);
  }

  displayFn(user: User): string {
    return user && user.firstName + ' ' + user.lastName;
  }

  ngOnInit(): void {

    this.configurationService.getApiEndpoint()
      .then(endpoint => {
        return this.graphQLService.getPersonList(endpoint);
      })
      .then(res => {
        this.options = res;
      });

    this.filteredOptions = this.myControl.valueChanges
    .pipe(
      startWith(''),
      map(value => typeof value === 'string' ? value : value.firstName),
      map(name => name ? this._filter(name) : this.options.slice())
    );
  }

  private _filter(name: string): User[] {
    const filterValue = name.toLowerCase() ;
    return this.options.filter(option =>
      (option.firstName + ' ' + option.lastName).toLowerCase()
      .includes(filterValue));
  }

  ngAfterContentInit() {

  }


}
