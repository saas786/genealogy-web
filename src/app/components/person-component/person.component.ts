import { Component, OnInit , AfterContentInit} from '@angular/core';
import { ActivatedRoute, Router, ParamMap } from '@angular/router';
import * as d3 from 'd3';

import { TreeDraw } from '../../treeDraw';
import { ConfigurationService } from 'src/app/_services/ConfigurationService';
import { GraphQLService } from 'src/app/_services/GraphQLService';

@Component({
  selector: 'app-person-component',
  templateUrl: './person.component.html',
  styleUrls: ['./person.component.css']
})

export class PersonComponentComponent implements OnInit, AfterContentInit {

  constructor(
    public rest: ConfigurationService,
    private route: ActivatedRoute,
    private router: Router,
    private api: GraphQLService) {

  }

  id: any = {};
  data: any = {};
  isConnected = false;


  getProfileById(id: string) {
    this.rest.getApiEndpoint()
      .then(endpoint => {
        return this.api.getProfile(endpoint, id);
      })
      .then(res => res.data)
      .then(data => {
        console.log(data);
        this.id = data.currentPerson?._id;
        this.data = data;
        const svg = d3.select('.familyTree');
        new TreeDraw().draw(svg, data);
      });
  }

  ngAfterContentInit() {
    const a = this.route.snapshot.paramMap.get('id');
    this.getProfileById(a);
  }

  ngOnInit(): void {
    this.isConnected = localStorage.getItem('token') != null;
  }
}
