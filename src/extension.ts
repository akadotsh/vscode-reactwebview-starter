import * as vscode from "vscode";
import PanelClass from "./panel";

export function activate(context: vscode.ExtensionContext) {
  let disposable = vscode.commands.registerCommand("ui.start", () => {
    PanelClass.createOrShow(context);
  });

  context.subscriptions.push(disposable);
}

export function deactivate() {}
