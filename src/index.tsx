import * as React from 'react'
import classNames from 'classnames'
import marked from './lib/helpers/marked'
import keydownListen from './lib/helpers/keydownListen'
import ToolbarLeft from './components/toolbar_left'
import ToolbarRight from './components/toolbar_right'
import { insertText } from './lib/helpers/function'
import 'highlight.js/styles/tomorrow.css'
import './lib/fonts/iconfont.css'
import './lib/fonts/posticon.css'
import './lib/css/index.scss'
import { CONFIG } from './lib'

export interface IToolbar {
  bold?: boolean
  italic?: boolean
  qoute?: boolean
  orderedlist?: boolean
  unorderedlist?: boolean
  c1?: boolean
  c2?: boolean
  c3?: boolean
  emoji?: boolean
  h1?: boolean
  h2?: boolean
  h3?: boolean
  h4?: boolean
  img?: boolean
  link?: boolean
  code?: boolean
  preview?: boolean
  expand?: boolean
  undo?: boolean
  redo?: boolean
  save?: boolean
  subfield?: boolean
}

export interface IWords {
  placeholder?: string
  bold?: string
  italic?: string
  qoute?: string
  orderedlist?: string
  unorderedlist?: string
  c1?: string
  c2?: string
  c3?: string
  emoji?: string
  h?: string
  h1?: string
  h2?: string
  h3?: string
  h4?: string
  undo?: string
  redo?: string
  img?: string
  link?: string
  code?: string
  save?: string
  preview?: string
  singleColumn?: string
  doubleColumn?: string
  fullscreenOn?: string
  fullscreenOff?: string
  addImgLink?: string
  addImg?: string
}

interface ILeft {
  prefix: string
  subfix: string
  str: string
}
interface IP {
  value?: string
  lineNum?: number
  onChange?: (value: string) => void
  onSave?: (value: string) => void
  placeholder?: string
  fontSize?: string
  disabled?: boolean
  style?: object
  height?: string
  preview?: boolean
  expand?: boolean
  subfield?: boolean
  toolbar?: IToolbar
  language?: string
  addImg?: (file: File, index: number) => void
}

interface IS {
  preview: boolean
  expand: boolean
  subfield: boolean
  history: string[]
  historyIndex: number
  lineIndex: number
  value: string
  words: IWords
}

class MdEditor extends React.Component<IP, IS> {
  static defaultProps = {
    lineNum: true,
    onChange: () => { },
    onSave: () => { },
    addImg: () => { },
    fontSize: '14px',
    disabled: false,
    preview: false,
    expand: false,
    subfield: false,
    style: {},
    toolbar: CONFIG.toolbar,
    language: 'zh-CN'
  }
  private $vm = React.createRef<HTMLTextAreaElement>()
  private $scrollEdit = React.createRef<HTMLDivElement>()
  private $scrollPreview = React.createRef<HTMLDivElement>()
  private $blockEdit = React.createRef<HTMLDivElement>()
  private $blockPreview = React.createRef<HTMLDivElement>()
  private currentTimeout: number
  constructor(props: IP) {
    super(props)

    this.state = {
      preview: props.preview,
      expand: props.expand,
      subfield: props.subfield,
      history: [],
      historyIndex: 0,
      lineIndex: 1,
      value: props.value,
      words: {}
    }
  }

  componentDidMount() {
    const { value } = this.props
    keydownListen(this.$vm.current, (type: string) => {
      this.toolBarLeftClick(type)
    })
    this.reLineNum(value)
    this.initLanguage()
  }

  componentDidUpdate(preProps: IP) {
    const { value, preview, expand, subfield } = this.props
    const { history, historyIndex } = this.state
    if (preProps.value !== value) {
      this.reLineNum(value)
    }
    if (value !== history[historyIndex]) {
      window.clearTimeout(this.currentTimeout)
      this.currentTimeout = window.setTimeout(() => {
        this.saveHistory(value)
      }, 500)
    }
    if (subfield !== preProps.subfield && this.state.subfield !== subfield) {
      this.setState({ subfield })
    }
    if (preview !== preProps.preview && this.state.preview !== preview) {
      this.setState({ preview })
    }
    if (expand !== preProps.expand && this.state.expand !== expand) {
      this.setState({ expand })
    }
  }

  initLanguage = (): void => {
    const { language } = this.props
    const lang = CONFIG.langList.indexOf(language) >= 0 ? language : 'en'
    this.setState({
      words: CONFIG.language[lang]
    })
  }

  handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>): void => {
    const value = e.target.value
    this.props.onChange(value)
  }

  saveHistory = (value: string): void => {
    let { history, historyIndex } = this.state
    history.splice(historyIndex + 1, history.length)
    if (history.length >= 20) {
      history.shift()
    }
    historyIndex = history.length
    history.push(value)
    this.setState({
      history,
      historyIndex
    })
  }

  reLineNum(value: string) {
    const lineIndex = value ? value.split('\n').length : 1
    this.setState({
      lineIndex
    })
  }

  save = (): void => {
    this.props.onSave(this.$vm.current!.value)
  }

  undo = (): void => {
    let { history, historyIndex } = this.state
    historyIndex = historyIndex - 1
    if (historyIndex < 0) return
    this.props.onChange(history[historyIndex])
    this.setState({
      historyIndex
    })
  }

  redo = (): void => {
    let { history, historyIndex } = this.state
    historyIndex = historyIndex + 1
    if (historyIndex >= history.length) return
    this.props.onChange(history[historyIndex])
    this.setState({
      historyIndex
    })
  }

  toolBarLeftClick = (type: string): void => {
    const { words } = this.state
    const insertTextObj: any = {
      bold: {
        prefix: ' **',
        subfix: '** ',
        str: words.bold
      },
      italic: {
        prefix: ' *',
        subfix: '* ',
        str: words.italic
      },
      qoute: {
        prefix: ' >',
        subfix: '',
        str: words.qoute
      },
      orderedlist: {
        prefix: '1. item1 \n2. item2',
        subfix: '\n3. item3 ',
      },
      unorderedlist: {
        prefix: '* item1\n* item2',
        subfix: '\n* item3 ',
      },
      c1: {
        prefix: '|	Column 1	|\n|	------------	|',
        subfix: '\n |	     Text     	| ',
      },
      c2: {
        prefix: '|	Column 1	|	Column 2	|\n|	------------	|	------------	|',
        subfix: '\n |	     Text     	|	     Text     	| ',
      },
      c3: {
        prefix: '|	Column 1	|	Column 2	|	Column 3	|\n|	------------	|	------------	|	------------	|',
        subfix: '\n |	     Text     	|	     Text     	|	     Text     	|',
      },
      /**
       * will add emoji
       */
      // emoji: {
      //   prefix: '',
      //   subfix: '',
      //   str: words.emoji
      // },
      h1: {
        prefix: '# ',
        subfix: '',
        str: words.h1
      },
      h2: {
        prefix: '## ',
        subfix: '',
        str: words.h2
      },
      h3: {
        prefix: '### ',
        subfix: '',
        str: words.h3
      },
      h4: {
        prefix: '#### ',
        subfix: '',
        str: words.h4
      },
      img: {
        prefix: '![alt](',
        subfix: ')',
        str: 'url'
      },
      link: {
        prefix: '[title](',
        subfix: ')',
        str: 'https://'
      },
      code: {
        prefix: '```',
        subfix: '\n\n```',
        str: 'language'
      },
      tab: {
        prefix: '  ',
        subfix: '',
        str: ''
      }
    }

    if (insertTextObj.hasOwnProperty(type)) {
      if (this.$vm.current) {
        const value = insertText(this.$vm.current, insertTextObj[type])
        this.props.onChange(value)
      }
    }

    const otherLeftClick: any = {
      undo: this.undo,
      redo: this.redo,
      save: this.save
    }
    if (otherLeftClick.hasOwnProperty(type)) {
      otherLeftClick[type]()
    }
  }

  addImg = (file: File, index: number) => {
    this.props.addImg(file, index)
  }

  $img2Url = (name: string, url: string) => {
    const value = insertText(this.$vm.current, {
      prefix: `![${name}](${url})`,
      subfix: '',
      str: ''
    })
    this.props.onChange(value)
  }

  toolBarRightClick = (type: string): void => {
    const toolbarRightPreviewClick = () => {
      this.setState({
        preview: !this.state.preview
      })
    }
    const toolbarRightExpandClick = () => {
      this.setState({
        expand: !this.state.expand
      })
    }

    const toolbarRightSubfieldClick = () => {
      const { preview, subfield } = this.state
      if (preview) {
        if (subfield) {
          this.setState({
            subfield: false,
            preview: false
          })
        } else {
          this.setState({
            subfield: true
          })
        }
      } else {
        if (subfield) {
          this.setState({
            subfield: false
          })
        } else {
          this.setState({
            preview: true,
            subfield: true
          })
        }
      }
    }

    const rightClick: any = {
      preview: toolbarRightPreviewClick,
      expand: toolbarRightExpandClick,
      subfield: toolbarRightSubfieldClick
    }
    if (rightClick.hasOwnProperty(type)) {
      rightClick[type]()
    }
  }

  focusText = (): void => {
    this.$vm.current!.focus()
  }

  handleScroll = (e: React.UIEvent<HTMLDivElement>): void => {
    const radio =
      this.$blockEdit.current!.scrollTop /
      (this.$scrollEdit.current!.scrollHeight - e.currentTarget.offsetHeight)
    this.$blockPreview.current!.scrollTop =
      (this.$scrollPreview.current!.scrollHeight - this.$blockPreview.current!.offsetHeight) * radio
  }

  render() {
    const { preview, expand, subfield, lineIndex, words } = this.state
    const { value, placeholder, fontSize, disabled, height, style, toolbar } = this.props
    const editorClass = classNames({
      'react-postnzt-markdown-edit': true,
      'for-panel': true,
      'for-active': preview && subfield,
      'for-edit-preview': preview && !subfield
    })
    const previewClass = classNames({
      'for-panel': true,
      'react-postnzt-markdown-preview': true,
      'for-active': preview && subfield
    })
    const fullscreen = classNames({
      'for-container': true,
      'for-fullscreen': expand
    })
    const lineNumStyles = classNames({
      'for-line-num': true,
      hidden: !this.props.lineNum
    })

    function lineNum() {
      const list = []
      for (let i = 0; i < lineIndex; i++) {
        list.push(<li key={i + 1}>{i + 1}</li>)
      }
      return <ul className={lineNumStyles}>{list}</ul>
    }

    return (
      <div className={fullscreen} style={{ height, ...style }}>
        {Boolean(Object.keys(toolbar).length) && (
          <div className="for-toolbar">
            <ToolbarLeft
              toolbar={toolbar}
              words={words}
              onClick={this.toolBarLeftClick}
              addImg={this.addImg}
              {...this.props}
            />
            <ToolbarRight
              toolbar={toolbar}
              words={words}
              preview={preview}
              expand={expand}
              subfield={subfield}
              onClick={this.toolBarRightClick}
            />
          </div>
        )}
        <div className="react-postnzt-markdown" style={{ fontSize }}>
          <div
            className={editorClass}
            ref={this.$blockEdit}
            onScroll={this.handleScroll}
            onClick={this.focusText}
          >
            <div className="react-postnzt-markdown-block" ref={this.$scrollEdit}>
              {lineNum()}
              <div className="react-postnzt-markdown-content">
                <pre>{value} </pre>
                <textarea
                  ref={this.$vm}
                  value={value}
                  disabled={disabled}
                  onChange={this.handleChange}
                  placeholder={placeholder ? placeholder : words.placeholder}
                />
              </div>
            </div>
          </div>
          <div className={previewClass} ref={this.$blockPreview}>
            <div
              ref={this.$scrollPreview}
              className="for-preview for-markdown-preview"
              dangerouslySetInnerHTML={{ __html: marked(value) }}
            />
          </div>
        </div>
      </div>
    )
  }
}

export default MdEditor
