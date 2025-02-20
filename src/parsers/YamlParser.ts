import * as yaml from 'js-yaml'
import YAML from 'yaml'
import _ from 'lodash'
import { Parser, KeyInDocument } from './Parser'

export class YamlParser extends Parser {
  constructor () {
    super(['yaml'], /\.?ya?ml$/g)
  }

  async parse (text: string) {
    return yaml.safeLoad(text)
  }

  async dump (object: object, sort: boolean) {
    object = JSON.parse(JSON.stringify(object))
    return yaml.safeDump(object, {
      indent: this.options.indent,
      sortKeys: sort,
    })
  }

  annotationSupported = true
  annotationLanguageIds = ['yaml']

  parseAST (text: string) {
    const cst = YAML.parseCST(text)
    cst.setOrigRanges() // Workaround for CRLF eol, https://github.com/eemeli/yaml/issues/127
    const doc = new YAML.Document({ keepCstNodes: true }).parse(cst[0])

    const findPairs = (node: YAML.ast.AstNode | YAML.ast.Pair | null, path: string[] = []): KeyInDocument[] => {
      if (!node)
        return []
      if (node.type === 'MAP' || node.type === 'SEQ')
      // @ts-ignore
        return _.flatMap(node.items, m => findPairs(m, path))
      if (node.type === 'PAIR' && node.value != null && node.key != null) {
        if (!['BLOCK_FOLDED', 'BLOCK_LITERAL', 'PLAIN', 'QUOTE_DOUBLE', 'QUOTE_SINGLE'].includes(node.value.type)) {
          return findPairs(node.value, [...path, node.key.toString()])
        }
        else {
          const valueCST = node.value.cstNode
          if (!valueCST || !valueCST.valueRange)
            return []
          const { start, end, origStart, origEnd } = valueCST.valueRange
          const key = [...path, node.key.toString()].join('.')

          return [{
            start: origStart || start,
            end: origEnd || end,
            key,
          }]
        }
      }

      return []
    }

    return findPairs(doc.contents)
  }
}
