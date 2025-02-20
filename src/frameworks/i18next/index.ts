import { Framework } from '../base'

class I18nextFramework extends Framework {
  id ='i18next'
  display = 'i18next'

  detection = {
    packageJSON: {
      any: [
        'i18next',
      ],
      none: [
        'react-i18next',
      ],
    },
  }

  languageIds = [
    'javascript',
    'typescript',
    'tyspescriptreact',
    'typescriptreact',
  ]

  keyMatchReg = []

  refactorTemplates (keypath: string) {
    return [
      keypath,
    ]
  }
}

export default I18nextFramework
