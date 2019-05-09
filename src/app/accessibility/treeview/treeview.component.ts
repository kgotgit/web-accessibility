import { Component, OnInit, Input, ViewChildren, QueryList, ElementRef, AfterViewInit } from '@angular/core';
import { TreeModel } from 'src/app/model/tree.model';

@Component({
  selector: 'app-treeview',
  templateUrl: './treeview.component.html',
  styleUrls: ['./treeview.component.scss']
})
export class TreeviewComponent implements OnInit,AfterViewInit {
  @ViewChildren("options") options: QueryList<ElementRef>;
  @Input("treeModel") model:TreeModel;

  constructor() { }

  ngOnInit() {
  }

  ngAfterViewInit(): void {
    console.log(this.options);
  }


  

}
