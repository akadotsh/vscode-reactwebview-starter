import * as vscode from "vscode";
import { getNonce } from "./getNonce";

export default class PanelClass {
  public static currentPanel: PanelClass | undefined;

  private static readonly viewType = "UI";

  private readonly _panel: vscode.WebviewPanel;
  private readonly _extensionUri: vscode.Uri;
  private readonly _extContext: vscode.ExtensionContext;
  private _disposables: vscode.Disposable[] = [];

  public static createOrShow(extContext: vscode.ExtensionContext) {
    const column = vscode.window.activeTextEditor
      ? vscode.window.activeTextEditor.viewColumn
      : undefined;

    if (PanelClass.currentPanel) {
      PanelClass.currentPanel._panel.reveal(column);
    } else {
      PanelClass.currentPanel = new PanelClass(
        extContext,
        vscode.ViewColumn.Two
      );
    }
  }
  private constructor(
    _extContext: vscode.ExtensionContext,
    column: vscode.ViewColumn
  ) {
    this._extContext = _extContext;
    this._extensionUri = _extContext.extensionUri;

    this._panel = vscode.window.createWebviewPanel(
      PanelClass.viewType,
      "Webview Panel",
      column,
      {
        enableScripts: true,
        localResourceRoots: [this._extensionUri],
      }
    );

    this._panel.webview.html = this._getHtmlForWebview(this._panel.webview);

    this._panel.onDidDispose(() => this.dispose(), null, this._disposables);

    this._panel.webview.onDidReceiveMessage(
      async (msg: any) => {
        switch (msg.command) {
          case "startup":
            console.log("message received");
            break;
          case "testing":
            console.log("reachedBrain");
            this._panel!.webview.postMessage({ command: "refactor" });
            break;
        }
      },
      null,
      this._disposables
    );
  }

  public dispose() {
    PanelClass.currentPanel = undefined;
    this._panel.dispose();
    while (this._disposables.length) {
      const x = this._disposables.pop();
      if (x) {
        x.dispose();
      }
    }
  }

  private _getHtmlForWebview(webview: vscode.Webview) {
    const scriptUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this._extensionUri, "out", "index.js")
    );

    const styleUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this._extensionUri, "media", "styles.css")
    );

    const nonce = getNonce();

    return `<!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Webview Starter</title>
        <link rel="stylesheet" href="${styleUri}">
      </head>
      <body>
        <div id="root"></div>
        <script>
          const vscode = acquireVsCodeApi();
          window.onload = function() {
            vscode.postMessage({ command: 'startup' });
            console.log('HTML started up.');
          };
        </script>
        <script nonce="${nonce}" src="${scriptUri}"></script>
      </body>
      </html>
    `;
  }
}
