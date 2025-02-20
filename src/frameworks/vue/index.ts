import { Framework } from '../base'

class VueFramework extends Framework {
  id = 'vue'
  display = 'Vue'

  detection = {
    packageJSON: [
      'vue-i18n',
      'vuex-i18n',
      '@panter/vue-i18next',
      'nuxt-i18n',
    ],
  }

  languageIds = [
    'vue',
    'vue-html',
    'javascript',
    'typescript',
  ]

  // for visualize the regex, you can use https://regexper.com/
  keyMatchReg = [
    // eslint-disable-next-line no-useless-escape
    /(?:i18n[ (]path=|v-t=['"`{]|(?:this\.|\$|i18n\.)(?:(?:d|n)\(.*?, ?|(?:t|tc|te)\())['"`]([\w\d\. -\[\]]+?)['"`]/g,
  ]

  refactorTemplates (keypath: string, languageId: string) {
    return [
      `{{$t('${keypath}')}}`,
      `this.$t('${keypath}')`,
      `$t("${keypath}")`,
      `i18n.t('${keypath}')`,
      keypath,
    ]
  }
}

export default VueFramework
