## React Native Search Box
- A simple search box with animation, inspired from ios search bar. 
- No library dependencies, lightweight, fast, flexible. 
- Support both iOS/Android devices


## Install
```
npm install --save react-native-search-box

or

yarn add react-native-search-box
```

## Demo

| Platform | Android | iOS |
|:--------:|:-------:|:---:|
| Demo gif link | ![Android](https://media.giphy.com/media/3o7bu4qW4xq15geiv6/source.gif) | ![iOS](https://media.giphy.com/media/26gR16ivWIyDlVP8s/source.gif) |

## Usage

```javascript
import React, { Component } from 'react';
import { TouchableHightLight, Text, View } from 'react-native';
import AtoZListView from 'react-native-atoz-listview';
import Search from 'react-native-search-box';

const rowHeight = 40;

class MyScene extends Component {

  state = {
    data: {
      "A": [
        {
          "name": "Anh Tuan Nguyen",
          "age": 28
        },
        {
          "name": "An Nhien",
          "age": 20
        },
      ],
      "Z": [
        {
          "name": "Zue Dang",
          "age": 22
        },
        {
          "name": "Zoom Jane",
          "age": 30
        },
      ]
    }
  }

  // Define your own renderRow => this one for AtoZListView, not related to Search Bar
  renderRow = (item, sectionId, index) => {
    return (
      <TouchableHightLight 
        style={{ 
          height: rowHeight, 
          justifyContent: 'center', 
          alignItems: 'center'}}
      >
        <Text>{item.name}</Text>
      </TouchableHightLight>
    );
    }

    onFocus = (text) => {
        console.log('onFocus', text);
    }
    
    onSearch = (text) => {
        console.log('onSearch', text);
    }
    
    onChangeText = (text) => {
        console.log('onChangeText', text);
    }
    
    onCancel = () => {
        console.log('onCancel', this.refs.search_box);
    }
    
    onDelete = () => {
        console.log('onDelete', this.refs.search_box);
    }
    
  render() {
    // inside your render function
    return (
      <View style={{ flex: 1}}>
        <Search
        ref="search_box"
        /**
        * Props list:
        * placeholder: PropTypes.string,
        * cancelTitle: PropTypes.string,
        * onFocus: PropTypes.func,
        * onSearch: PropTypes.func,
        * onChangeText: PropTypes.func,
        * onCancel: PropTypes.func,
        * onDelete: PropTypes.func,
        * containerStyle: PropTypes.string,
        * inputStyle: PropTypes.string,
        * btnCancelStyle: PropTypes.string,
        * btnCancelColor: PropTypes.string,
        */
        />

        <AtoZListView
          data={this.state.data}
          renderRow={this.renderRow}
          rowHeight={rowHeight}
          sectionHeaderHeight={40}
        />
      </View>
    );
  }
}
```
