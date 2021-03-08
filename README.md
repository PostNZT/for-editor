# react-postnzt-markdown

> react-postnzt-markdown A markdown editor based on React

- [github](https://github.com/PostNZT/react-postnzt-markdown)

### Install

```js
npm install react-postnzt-markdown --save
```

### Use

```js
import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import Editor from 'react-postnzt-markdown'

class App extends Component {
  constructor() {
    super()
    this.state = {
      value: ''
    }
  }

  handleChange(value) {
    this.setState({
      value
    })
  }

  render() {
    const { value } = this.state
    return <Editor value={value} onChange={() => this.handleChange()} />
  }
}

ReactDOM.render(<App />, document.getElementById('root'))
```

### Api

#### props

| name        | type    | default                     | description                                                                                            |
| ----------- | ------- | --------------------------- | ------------------------------------------------------------------------------------------------------ |
| value       | String  | -                           | value                                                                                                  |
| language    | String  | en                       | Language switch, zh-CN: Simplified Chinese, en: English                                                |
| placeholder | String  | What is in your mind?...            | The default prompt text when the textarea is empty                                                     |
| lineNum     | Boolean | true                        | Show lineNum                                                                                           |
| style       | Object  | -                           | editor styles                                                                                          |
| height      | String  | 600px                       | editor height                                                                                          |
| preview     | Boolean | false                       | preview switch                                                                                         |
| expand      | Boolean | false                       | fullscreen switch                                                                                      |
| subfield    | Boolean | false                       | true: Double columns - Edit preview same screen(notice: preview: true), Single Columns - otherwise not |
| toolbar     | Object  | As in the following example | toolbars                                                                                               |

```js
/*
  The default toolbar properties are all true,
  You can customize the object to cover them.
  eg: {
    h1: true,
    code: true,
    preview: true,
  }
  At this point, the toolbar only displays the three function keys.
  notice: Toolbar will be hidden when empty object.
 */

toolbar: {
  bold: true,
  italic: true,
  qoute: true,
  orderedlist: true,
  unorderedlist: true,
  c1: true,
  c2: true,
  c3: true,
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
  /** emoji feature will be added on v1.0.5*/
}
```

#### events

| name     | params        | default | description                                 |
| -------- | ------------- | ------- | ------------------------------------------- |
| onChange | String: value | -       | Edit area change callback event             |
| onSave   | String: value | -       | Ctrl+s and click save button callback event |
| addImg   | File: file    | -       | upload image callback event                 |

##### upload image

```js
class App extends Component {
  constructor() {
    super()
    this.state = {
      value: ''
    }
    this.$vm = React.createRef()
  }

  handleChange(value) {
    this.setState({
      value
    })
  }

  addImg($file) {
    this.$vm.current.$img2Url($file.name, 'file_url')
    console.log($file)
  }

  render() {
    const { value } = this.state

    return (
      <Editor
        ref={this.$vm}
        value={value}
        addImg={($file) => this.addImg($file)}
        onChange={(value) => this.handleChange(value)}
      />
    )
  }
}
```

#### hot key

| name   | description |
| ------ | ----------- |
| tab    | two space   |
| ctrl+s | save        |
| ctrl+z | undo        |
| ctrl+y | redo        |

### Update

- [Update Log](./doc/UPDATELOG.md)

# Licence

react-postnzt-markdown is [MIT Licence](./LICENSE).

# Credits to:
> kkfor
Forked at for-editor [https://github.com/kkfor/for-editor] 
