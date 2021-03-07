import zhCN from './lang/zh-CN/index.json'
import en from './lang/en/index.json'
import { IToolbar, IWords } from '../index'
export interface ICONFIG {
  language: {
    'zh-CN': IWords
    en: IWords
    [key: string]: IWords
  }
  langList: string[]
  toolbar: IToolbar
}

export const CONFIG: ICONFIG = {
  language: {
    en,
    'zh-CN': zhCN,
  },
  langList: ['en', 'zh-CN'],
  toolbar: {
    bold: true,
    italic: true,
    qoute: true,
    orderedlist: true,
    unorderedlist: true,
    c1: true,
    c2: true,
    c3: true,
    emoji: true,
    h1: true,
    h2: true,
    h3: true,
    h4: true,
    img: true,
    link: true,
    code: true,
    preview: true,
    expand: true,
    undo: true,
    redo: true,
    save: true,
    subfield: true
  }
}
