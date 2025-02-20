import { CompletionItemProvider, TextDocument, Position, CompletionItem, CompletionItemKind, ExtensionContext, languages } from 'vscode'
import { Global, KeyDetector, Loader, CurrentFile } from '../core'
import { ExtensionModule } from '../modules'

class CompletionProvider implements CompletionItemProvider {
  public provideCompletionItems (
    document: TextDocument,
    position: Position,
  ) {
    if (!Global.enabled)
      return

    const loader: Loader = CurrentFile.loader
    const key = (KeyDetector.getKey(document, position) || '').replace(/[\.]?$/g, '')
    let parent = ''

    const parts = key.split('.')
    if (parts.length > 1)
      parent = parts.slice(0, -1).join('.')

    let node = loader.getTreeNodeByKey(key)

    if (!node && parent)
      node = loader.getTreeNodeByKey(parent)

    if (!node)
      node = loader.root

    if (!node || node.type !== 'tree')
      return

    return Object.values(node.children).map((node) => {
      return new CompletionItem(
        node.keyname,
        node.type === 'tree'
          ? CompletionItemKind.Field
          : CompletionItemKind.Text,
      )
    })
  }
}

const m: ExtensionModule = (ctx: ExtensionContext) => {
  return languages.registerCompletionItemProvider(
    Global.getDocumentSelectors(),
    new CompletionProvider(),
    '.', '\'', '"', '`',
  )
}

export default m
