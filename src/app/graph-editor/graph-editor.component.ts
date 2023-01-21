import * as jQuery from 'jquery';
import * as _ from 'lodash';
import * as $ from 'backbone';
import * as joint from 'jointjs';

import { Component } from '@angular/core';
import { GraphService } from '../graph.service';

@Component({
  selector: 'app-graph-editor',
  templateUrl: './graph-editor.component.html',
  styleUrls: ['./graph-editor.component.scss']
})
export class GraphEditorComponent {

  private paper: joint.dia.Paper | undefined;

  constructor(
    private graphService: GraphService
  ) {
  }


  ngOnInit() {
    let graph = this.graphService.getGraph();

    this.paper = new joint.dia.Paper({
      el: jQuery("#paper"),
      width: 1000,
      height: 600,
      model: graph,
      gridSize: 1,
      linkPinning: false,
    });

    this.paper.on('link:mouseleave', (linkView) => {
      linkView.removeTools();
    });

    /*
     * START - Draw multiple nodes and apply undo() action in between
     */
    const rect1 = new joint.shapes.basic.Rect({
      position: { x: 100, y: 30 },
      size: { width: 100, height: 100 },
      attrs: { rect: { fill: '#303133' }, text: { text: 'Node 1', fill: 'white' } },
      ports: { items: [this.graphService.createPort()] }
    });
    this.graphService.addElement(rect1);

    const rect2 = new joint.shapes.basic.Rect({
      position: { x: 250, y: 30 },
      size: { width: 100, height: 100 },
      attrs: { rect: { fill: '#303133' }, text: { text: 'Node 2', fill: 'white' } },
      ports: { items: [this.graphService.createPort(), this.graphService.createPort(), this.graphService.createPort()] }
    });
    this.graphService.addElement(rect2);

    const rect3 = new joint.shapes.basic.Rect({
      position: { x: 400, y: 30 },
      size: { width: 100, height: 100 },
      attrs: { rect: { fill: '#303133' }, text: { text: 'Node 3', fill: 'white' } },
      ports: { items: [this.graphService.createPort()] }
    });
    this.graphService.addElement(rect3);

    this.graphService.undo();

    const rect4 = new joint.shapes.basic.Rect({
      position: { x: 550, y: 30 },
      size: { width: 100, height: 100 },
      attrs: { rect: { fill: '#303133' }, text: { text: 'Node 4', fill: 'white' } },
      ports: { items: [this.graphService.createPort(), this.graphService.createPort()] }
    });
    this.graphService.addElement(rect4);

    this.graphService.undo();
    this.graphService.redo();

    /*
     * END
     */
  }

  createRandomNode() {
    const randomNodeNumber = Math.floor(Math.random() * 5)+1;
    const randomPortNumber = Math.floor(Math.random() * 3)+1;
    const portsList = Array(randomPortNumber);

    const rect = new joint.shapes.basic.Rect({
      position: { x: randomNodeNumber * 150, y: 160 },
      size: { width: 100, height: 100 },
      attrs: { rect: { fill: '#303133' }, text: { text: 'Node ' + randomNodeNumber, fill: 'white' } },
      ports: { items: portsList.fill(undefined).map(() => this.graphService.createPort()) }
    });
    this.graphService.addElement(rect);
  }

  undo() {
    this.graphService.undo();
  }

  redo() {
    this.graphService.redo();
  }
}
