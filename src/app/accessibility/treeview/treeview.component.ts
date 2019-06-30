import { Component, OnInit, Input, ViewChildren, QueryList, ElementRef, AfterViewInit, Renderer2 } from '@angular/core';
import { TreeModel } from 'src/app/model/tree.model';
import { AlertsComponent } from '../alerts/alerts.component';
import { Options } from 'selenium-webdriver/ie';
import { LiEleComponent } from '../common/li-ele/li-ele.component';


@Component({
  selector: 'app-treeview',
  templateUrl: './treeview.component.html',
  styleUrls: ['./treeview.component.scss']
})
export class TreeviewComponent implements OnInit, AfterViewInit {
  @ViewChildren("options") options: QueryList<ElementRef>;
  @ViewChildren("ultags") ulTags: QueryList<ElementRef>;
  @Input("treeModel") model: TreeModel;
  eleList: ElementRef[];
  eleMap: Map<string, ElementRef>;
  TREEVIEW_SUFFIX: string = "_treeView";
  ARIA_EXPANDED: string = "aria-expanded";
  DATA_CHILDCOUNT = "data-childcount";
  DATA_LID: string = "data-lid";
  DATA_CODE: string = "data-code";
  DATA_ISFIRST: string = "data-first";
  DATA_ISLAST: string = "data-last";
  TAB_INDEX: string = "tabindex";

  constructor(private renderer: Renderer2) { }

  ngOnInit() {

  }

  ngAfterViewInit(): void {
    this.createInitMap();
    this.eleList = this.options.toArray();
  }

  createInitMap() {
    this.eleMap = new Map<string, ElementRef>();
    this.options.forEach((eleRef: ElementRef, index: number, optionsarray: ElementRef[]) => {
      this.renderer.setAttribute(eleRef.nativeElement, "data-lid", String(index));
      this.eleMap.set(eleRef.nativeElement.id, eleRef);
    });
  }

  setTabIndexOnLoad(role: string, i: number) {
    return (role == 'tree' && i == 0) ? "0" : "-1";
  }

  toggleSelection($event: any, item: any) {

    this.options.some((eleRef: ElementRef, index: number, optionsarray: ElementRef[]) => {
      let code = eleRef.nativeElement.getAttribute("data-code")
      if (code == item[this.model.cid]) {
        let isExpanded = eleRef.nativeElement.getAttribute(this.ARIA_EXPANDED);
        this.setElementAttribute(eleRef, this.ARIA_EXPANDED, (isExpanded == "true") ? "false" : "true");
        return true;
      }
    });

  }

  getExpandCollapseClass(item: any) {

    if (item != null && item.children != null && item.children.length > 0) {
      return "fa fa-plus-square";
    }
    return "fa fa-square-o";
  }

  isChildrenExists(items: any[]) {
    return (items != null && items.length > 0) ? true : false;
  }

  collapsedState(item: any) {
    if (item != null && item.children != null && item.children.length > 0) {
      return "false"
    }
    return null;

  }

  executeKeydown($event) {
    let keyCode = $event.which;

    switch (keyCode) {
      case 40://Down Arrow
        this.executeArrowDown($event);
        break;

      case 38:// Up Arrow
        this.executeUpArrow($event);
        break;
      case 37:// RightArrow
        this.executeLeftArrow($event);
        break;

      case 39:// RightArrow
        this.executeRightArrow($event);
        break;
      case 32:// Spacebar
        this.selectOption($event);
        break;




    }

  }

  toggleExpand(eleRef: ElementRef, state: string) {
    this.setElementAttribute(eleRef, this.ARIA_EXPANDED, state);
  }

  //Determines if tree is expaneded or not.
  isExpanded(eleRef: ElementRef) {
    let isExpanded = eleRef.nativeElement.getAttribute(this.ARIA_EXPANDED);
    let childCount = eleRef.nativeElement.getAttribute(this.DATA_CHILDCOUNT);
    if (isExpanded == "true" && !isNaN(childCount) && parseInt(childCount) > 0) {
      return true;
    }
    return false;
  }

  //determines if the current node has children or not
  getChildCount(item: any) {
    if (item != null && item[this.model.cnid] != null) {
      let items = item[this.model.cnid];
      return (Array.isArray(items) ? items.length : 0)
    }
    return "0";
  }

  setElementAttribute(eleRef: ElementRef, attribute: string, value: string) {
    this.renderer.setAttribute(eleRef.nativeElement, attribute, value);
  }
  executeRightArrow($event) {
    $event.stopImmediatePropagation();
    $event.preventDefault();
    let lid = $event.currentTarget.getAttribute(this.DATA_LID);
    let eleRef: ElementRef = this.eleMap.get($event.currentTarget.id);
    let childCount = eleRef.nativeElement.getAttribute(this.DATA_CHILDCOUNT);
    if (!isNaN(childCount) && parseInt(childCount) > 0) {
      let isExpanded = eleRef.nativeElement.getAttribute(this.ARIA_EXPANDED);
      if (isExpanded == "false")
        this.setElementAttribute(eleRef, this.ARIA_EXPANDED, "true");

    }

  }

  executeLeftArrow($event) {
    $event.stopImmediatePropagation();
    $event.preventDefault();
    let lid = $event.currentTarget.getAttribute(this.DATA_LID);
    let eleRef: ElementRef = this.eleMap.get($event.currentTarget.id);
    let childCount = eleRef.nativeElement.getAttribute(this.DATA_CHILDCOUNT);
    if (!isNaN(childCount) && parseInt(childCount) > 0) {
      let isExpanded = eleRef.nativeElement.getAttribute(this.ARIA_EXPANDED);
      if (isExpanded == "true")
        this.setElementAttribute(eleRef, this.ARIA_EXPANDED, "false");

    }

  }

  executeArrowDown($event) {
    $event.stopImmediatePropagation();
    $event.preventDefault();
    let lid = $event.currentTarget.getAttribute(this.DATA_LID);
    let eleRef: ElementRef = this.eleMap.get($event.currentTarget.id);
    this.recursiveDownNavigation(eleRef, 0);


  }

  executeUpArrow($event) {
    $event.stopImmediatePropagation();
    $event.preventDefault();
    let lid = $event.currentTarget.getAttribute(this.DATA_LID);
    let eleRef: ElementRef = this.eleMap.get($event.currentTarget.id);
    this.recursiveUpNavigation(eleRef, 0);

  }
  recursiveUpNavigation(eleRef: ElementRef<any>, loopCounter: number) {
    let lid = eleRef.nativeElement.getAttribute(this.DATA_LID);
    let isFirst = eleRef.nativeElement.getAttribute(this.DATA_ISFIRST);
    let isLast = eleRef.nativeElement.getAttribute(this.DATA_ISLAST);

    if(isFirst=="0"){
        let prevLid=parseInt(lid)-1;
      if(prevLid>-1){
        let preVEleRef:ElementRef=this.eleList[prevLid];
        this.setElementAttribute(eleRef, this.TAB_INDEX, "-1");
        this.setElementAttribute(preVEleRef, this.TAB_INDEX, "0");
        this.setToFocus(preVEleRef);
      }
    }else if(isFirst=="1"){
      let parent=eleRef.nativeElement.parentElement;
      let role = parent.getAttribute("role");
      if (role == "group") {
        let superParent = parent.parentElement;
        let role = superParent.getAttribute("role");
        if (role == "treeitem") {
          let subeleRef: ElementRef = this.eleMap.get(superParent.id);
          this.setElementAttribute(eleRef, this.TAB_INDEX, "-1");
          this.setElementAttribute(subeleRef, this.TAB_INDEX, "0");
          this.setToFocus(subeleRef);
       /*    this.recursiveDownNavigation(subeleRef, loopCounter + 1); */
        }

      }

    }
   
  }

  selectOption($event) {

  }

  getTreeItemId(item: any, treeId: string) {
    return item[this.model.cid] + "_" + treeId + this.TREEVIEW_SUFFIX;
  }


  filterElementRef(nodeId: string) {

  }

  setToFocus(eleRef: ElementRef) {
    eleRef.nativeElement.focus();
  }

  recursiveDownNavigation(eleRef: ElementRef, loopCounter: number) {

    let lid = eleRef.nativeElement.getAttribute(this.DATA_LID);
    let isFirst = eleRef.nativeElement.getAttribute(this.DATA_ISFIRST);
    let isLast = eleRef.nativeElement.getAttribute(this.DATA_ISLAST);

    //when current item is not first or last item in the child list
    if (isLast == "0") {
      //check if children are expanded
      if (this.isExpanded(eleRef) && loopCounter < 1) {
        let li = eleRef.nativeElement.querySelector('li');
        console.log(li);
        if (li != null) {
          let nextEleRef: ElementRef = this.eleMap.get(li.id);
          this.setElementAttribute(eleRef, this.TAB_INDEX, "-1");
          this.setElementAttribute(nextEleRef, this.TAB_INDEX, "0");
          this.setToFocus(nextEleRef);
        }
      } else {
        let nextLid = parseInt(lid) + 1;
        if (nextLid <= this.options.length) {
          let nextEleRef: ElementRef = this.eleList[nextLid];
          this.setElementAttribute(eleRef, this.TAB_INDEX, "-1");
          this.setElementAttribute(nextEleRef, this.TAB_INDEX, "0");
          this.setToFocus(nextEleRef);
        }
      }
    } else if (isLast == "1") {
      if (this.isExpanded(eleRef) && loopCounter < 1) {
        let li = eleRef.nativeElement.querySelector('li');
        console.log(li);
        if (li != null) {
          let nextEleRef: ElementRef = this.eleMap.get(li.id);
          this.setElementAttribute(eleRef, this.TAB_INDEX, "-1");
          this.setElementAttribute(nextEleRef, this.TAB_INDEX, "0");
          this.setToFocus(nextEleRef);
        }

      } else {

        let parent = eleRef.nativeElement.parentElement;
        let role = parent.getAttribute("role");
        if (role == "group") {
          let superParent = parent.parentElement;
          let role = superParent.getAttribute("role");
          if (role == "treeitem") {
            let subeleRef: ElementRef = this.eleMap.get(superParent.id);
            this.setElementAttribute(eleRef, this.TAB_INDEX, "-1");
            this.recursiveDownNavigation(subeleRef, loopCounter + 1);
          }

        }
      }

    }
}



}