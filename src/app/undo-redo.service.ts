import { Injectable } from '@angular/core';

export interface Command {
  execute(): void;
  undo(): void;
}

@Injectable({
  providedIn: 'root'
})
export class UndoRedoService {

  private undoStack: Command[] = [];
  private redoStack: Command[] = [];
  private maxStackSize: number = 20;

  execute(command: Command) {
    command.execute();
    this.undoStack.push(command);

    // if undo stack size exceed limit, remove the oldest command
    if (this.undoStack.length > this.maxStackSize) {
      this.undoStack.shift();
    }

    // clear redo stack when new command is executed
    this.redoStack = [];

    return command;
  }

  undo() {
    if (this.undoStack.length > 0) {
      let command = this.undoStack.pop();
      command!.undo();
      this.redoStack.push(command!);
    }
  }

  redo() {
    if (this.redoStack.length > 0) {
      let command = this.redoStack.pop();
      command!.execute();
      this.undoStack.push(command!);
    }
  }

  canUndo(): boolean {
    return this.undoStack.length > 0;
  }

  canRedo(): boolean {
    return this.redoStack.length > 0;
  }
}