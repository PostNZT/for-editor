import * as React from 'react'
import { IToolbar, IWords } from '../index'
interface IP {
  onClick: (type: string) => void
  addImg: (file: File, index: number) => void
  toolbar: IToolbar
  words: IWords
}

interface IS {
  imgHidden: boolean
  headerHidden: boolean
  tableHidden: boolean
  imgList: File[]
}

class Toolbars extends React.Component<IP, IS> {
  static defaultProps = {
    onClick: () => {},
    toolbar: {},
    words: {}
  }

  private timer: number

  constructor(props: IP) {
    super(props)

    this.state = {
      imgHidden: true,
      headerHidden: true,
      tableHidden: true,
      imgList: []
    }
  }

  onClick(type: string) {
    this.props.onClick(type)
  }

  imgClick() {
    this.setState({
      imgHidden: !this.state.imgHidden
    })
  }

  imgMouseOver() {
    window.clearTimeout(this.timer)
    this.setState({
      imgHidden: false
    })
  }

  imgMouseOut() {
    this.timer = window.setTimeout(() => {
      this.setState({
        imgHidden: true
      })
    }, 150)
  }

  headerMouseOverHeader() {
    window.clearTimeout(this.timer)
    this.setState({
      headerHidden: false
    })
  }

  headerMouseOutHeader() {
    this.timer = window.setTimeout(() => {
      this.setState({
        headerHidden: true
      })
    }, 150)
  }

  tableMouseOverHeader() {
    window.clearTimeout(this.timer)
    this.setState({
      tableHidden: false
    })
  }

  tableMouseOutHeader() {
    this.timer = window.setTimeout(() => {
      this.setState({
        tableHidden: true
      })
    }, 150)
  }

  addImgUrl() {
    this.props.onClick('img')
  }

  addImgFile(e: any) {
    let { imgList } = this.state
    const index = imgList.length
    imgList.push(e.target.files[0])
    this.setState({
      imgList
    })
    this.props.addImg(e.target.files[0], index)
    e.target.value = ''
  }

  render() {
    const { toolbar, words } = this.props
    const { imgHidden } = this.state
    const { headerHidden } = this.state
    const { tableHidden } = this.state
    return (
      <ul>
        {toolbar.undo && (
          <li onClick={() => this.onClick('undo')} title={`${words.undo} (ctrl+z)`}>
            <i className="foricon for-undo" />
          </li>
        )}
        {toolbar.redo && (
          <li onClick={() => this.onClick('redo')} title={`${words.redo} (ctrl+y)`}>
            <i className="foricon for-redo" />
          </li>
        )}
        {toolbar.bold && (
          <li onClick={() => this.onClick('bold')} title={words.bold}>
            <i className="posticon post-bold" />
          </li>
        )}
        {toolbar.italic && (
          <li onClick={() => this.onClick('italic')} title={words.italic}>
            <i className="posticon post-italic" />
          </li>
        )}
        {toolbar && (
          <li className="for-toolbar-header" style={{ fontSize: '1.3em' }} onMouseOver={() => this.headerMouseOverHeader()} onMouseOut={() => this.headerMouseOutHeader()}>
            <li>H</li>
            <ul style={headerHidden ? {display: 'none'} : {}}>
              {toolbar.h1 && (
                <li style={{ fontSize: '0.8em' }} onClick={() => this.onClick('h1')} title={words.h1}>
                  H1
                </li>
              )}
              {toolbar.h2 && (
                <li style={{ fontSize: '0.8em' }} onClick={() => this.onClick('h2')} title={words.h2}>
                  H2
                </li>
              )}
              {toolbar.h3 && (
                <li style={{ fontSize: '0.8em' }} onClick={() => this.onClick('h3')} title={words.h3}>
                  H3
                </li>
              )}
              {toolbar.h4 && (
                <li style={{ fontSize: '0.8em' }} onClick={() => this.onClick('h4')} title={words.h4}>
                  H4
                </li>
              )}
            </ul>
          </li>
        )}
        {toolbar.code && (
          <li onClick={() => this.onClick('code')} title={words.code}>
            <i className="posticon post-code-1" />
          </li>
        )}
        {toolbar.qoute && (
          <li onClick={() => this.onClick('qoute')} title={words.qoute}>
            <i className="posticon post-quote-right" />
          </li>
        )}
        {toolbar.orderedlist && (
          <li onClick={() => this.onClick('orderedlist')} title={words.orderedlist}>
            <i className="posticon post-list-numbered-1" />
          </li>
        )}
        {toolbar.unorderedlist && (
          <li onClick={() => this.onClick('unorderedlist')} title={words.unorderedlist}>
            <i className="posticon post-list-bullet" />
          </li>
        )}
        {toolbar.link && (
          <li onClick={() => this.onClick('link')} title={words.link}>
            <i className="foricon for-link" />
          </li>
        )}
        {toolbar.img && (
          <li className="for-toolbar-img" onMouseOver={() => this.imgMouseOver()} onMouseOut={() => this.imgMouseOut()}>
            <i className="foricon for-image" />
            <ul style={imgHidden ? {display: 'none'} : {}}>
              <li onClick={() => this.addImgUrl()}>{words.addImgLink}</li>
              <li>
                {words.addImg}
                <input type="file" accept="image/gif,image/jpeg,image/jpg,image/png,image/svg" onChange={(e) => this.addImgFile(e)}/>
              </li>
            </ul>
          </li>
        )}
        {toolbar && (
          <li className="for-toolbar-table" style={{ fontSize: '1.3em', textDecoration: 'none !important' }} onMouseOver={() => this.tableMouseOverHeader()} onMouseOut={() => this.tableMouseOutHeader()}>
            <i className="posticon post-table" />
            <ul style={tableHidden ? {display: 'none'} : {}}>
              {toolbar.h1 && (
                <li style={{ fontSize: '0.8em' }} onClick={() => this.onClick('c1')} title={words.h1}>
                  1 Column
                </li>
              )}
              {toolbar.h2 && (
                <li style={{ fontSize: '0.8em' }} onClick={() => this.onClick('c2')} title={words.h2}>
                  2 Column
                </li>
              )}
              {toolbar.h3 && (
                <li style={{ fontSize: '0.8em' }} onClick={() => this.onClick('c3')} title={words.h3}>
                  3 Column
                </li>
              )}
            </ul>
          </li>
        )}
        {toolbar.save && (
          <li onClick={() => this.onClick('save')} title={`${words.save} (ctrl+s)`}>
            <i className="foricon for-save" />
          </li>
        )}
      </ul>
    )
  }
}

export default Toolbars
