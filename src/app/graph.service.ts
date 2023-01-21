import * as joint from 'jointjs';
import * as uuid from 'uuid';

import { Injectable } from '@angular/core';
import { UndoRedoService } from './undo-redo.service';
import { AddElementCommand, AddLinkCommand } from './commands/graph.command';

@Injectable({
  providedIn: 'root'
})
export class GraphService {

  private graph: joint.dia.Graph;
  private undoRedoService: UndoRedoService;

  constructor() {
    this.graph = new joint.dia.Graph();

    this.graph.on('change:source change:target', (link) => {
      const sourcePortId: string = link.get('source').port;
      const sourceElementId = link.get('source').id;
      const targetPortId: string = link.get('target').port;
      const targetElementId = link.get('target').id;

      if (targetElementId) {
        if (targetPortId) {
          this.undoRedoService.execute(new AddLinkCommand(this.addLinkMethod.bind(this), this.removeLinkMethod.bind(this), sourcePortId, targetPortId))
        }
        link.remove();  // only allow links to ports and not to elements && avoid double creation
      }

    });

    this.undoRedoService = new UndoRedoService();
  }

  private addElementMethod(cell: joint.dia.Cell) {
    this.graph.addCell(cell);
  }

  private addLinkMethod(sourcePortId: string, targetPortId: string) {
    const sourceElement = this.graph.getElements().find(
      element => element.getPorts().find(port => port.id == sourcePortId)
    );
    const targetElement = this.graph.getElements().find(
      element => element.getPorts().find(port => port.id == targetPortId)
    );

    const link = new joint.shapes.devs.Link({
      source: {
        id: sourceElement?.id,
        port: sourcePortId
      },
      target: {
        id: targetElement?.id,
        port: targetPortId
      },
    });
    this.graph.addCell(link);
  }

  private removeElementMethod(cell: joint.dia.Cell) {
    this.graph.removeCells([cell]);
  }

  private removeLinkMethod(sourcePortId: string, targetPortId: string) {
    const link: joint.dia.Link = this.graph.getLinks().find(
      (link: joint.dia.Link) => link.attributes['source']['port'] == sourcePortId && link.attributes['target']['port'] == targetPortId
    )!;

    link.remove();
  }

  getGraph() {
    return this.graph;
  }

  addElement(cell: joint.dia.Cell) {
    const command = this.undoRedoService.execute(new AddElementCommand(this.addElementMethod.bind(this), this.removeElementMethod.bind(this), cell));
  }

  undo() {
    this.undoRedoService.undo();
  }

  redo() {
    this.undoRedoService.redo();
  }

  createPort() {
    return {
      id: uuid.v4(),
      label: {
        position: {
          name: 'left'
        }
      },
      attrs: {
        portBody: {
          magnet: true,
          width: 16,
          height: 16,
          x: -8,
          y: -8,
          fill: '#40c4ff'
        },
        label: {
          text: 'port'
        }
      },
      markup: [{
        tagName: 'rect',
        selector: 'portBody'
      }]
    };
  }
}