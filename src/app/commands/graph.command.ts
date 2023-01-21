import * as joint from 'jointjs';
import { Command } from '../undo-redo.service';

export class AddElementCommand {

  public cell: joint.dia.Cell;

  constructor(private executeMethod: (cell: joint.dia.Cell) => void, private undoMethod: (cell: joint.dia.Cell) => void, cell: joint.dia.Cell) {
    this.cell = cell;
  }

  execute() {
    this.executeMethod(this.cell);
    return this.cell;
  }

  undo() {
    this.undoMethod(this.cell);
  }
}

export class AddLinkCommand {
  constructor(
    private executeMethod: (source: string, target: string) => void,
    public undoMethod: (source: string, target: string) => void,
    public source: string, private target: string
  ) { }

  execute() {
    this.executeMethod(this.source, this.target)
  }

  undo() {
    this.undoMethod(this.source, this.target);
  }
}
