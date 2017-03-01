import React, { Component, PropTypes } from 'react';
import {
    Text,
    TouchableWithoutFeedback,
    TextInput,
    Animated,
    Dimensions,
    Keyboard,
    Image
} from 'react-native';

const { width: contentWidth } = Dimensions.get('window');
const containerHeight = 40;
const middleHeight = 20;
const middleWidth = contentWidth / 2;
const AnimatedTextInput = Animated.createAnimatedComponent(TextInput);

class Search extends Component {
    static propTypes = {
        placeholder: PropTypes.string,
        cancelTitle: PropTypes.string,
        onFocus: PropTypes.func,
        onSearch: PropTypes.func,
        onChangeText: PropTypes.func,
        onCancel: PropTypes.func,
        onDelete: PropTypes.func,
        containerStyle: PropTypes.string,
        inputStyle: PropTypes.string,
        btnCancelStyle: PropTypes.string,
        btnCancelColor: PropTypes.string,
    }

    constructor(props) {
        super(props);
        this.state = {
            keyword: ''
        };

        /**
         * Animated values
         */
        this.iconSearchAnimated = new Animated.Value(middleWidth - 25);
        this.iconDeleteAnimated = new Animated.Value(0);
        this.inputFocusWidthAnimated = new Animated.Value(contentWidth - 10);
        this.inputFocusPlaceholderAnimated = new Animated.Value(middleWidth - 15);
        this.btnCancelAnimated = new Animated.Value(contentWidth);

        /**
         * functions
         */
        this.onFocus = this.onFocus.bind(this);
        this.onSearch = this.onSearch.bind(this);
        this.onChangeText = this.onChangeText.bind(this);
        this.onCancel = this.onCancel.bind(this);
        this.onDelete = this.onDelete.bind(this);

        /**
         * local variables
         */
        this.placeholder = this.props.placeholder || 'Search';
        this.cancelTitle = this.props.cancelTitle || 'Cancel';
    }

    onSearch = () => {
        Keyboard.dismiss();
        this.props.onSearch && this.props.onSearch(this.state.keyword);
    }

    onChangeText = (text) => {
        this.setState({ keyword: text });
        Animated.timing(
            this.iconDeleteAnimated,
            {
                toValue: (text.length > 0) ? 1 : 0,
                duration: 200
            }
        ).start();
        this.props.onChangeText && this.props.onChangeText(text);
    }

    onFocus = () => {
        Animated.parallel([
            Animated.timing(
                this.inputFocusWidthAnimated,
                {
                    toValue: contentWidth - 70,
                    duration: 200
                }
            ).start(),
            Animated.timing(
                this.btnCancelAnimated,
                {
                    toValue: 10,
                    duration: 200
                }
            ).start(),
            Animated.timing(
                this.inputFocusPlaceholderAnimated,
                {
                    toValue: 20,
                    duration: 200
                }
            ).start(),
            Animated.timing(
                this.iconSearchAnimated,
                {
                    toValue: 10,
                    duration: 200
                }
            ).start(),
        ]);
        this.props.onFocus && this.props.onFocus(this.state.keyword);
    }

    onDelete = () => {
        Animated.timing(
            this.iconDeleteAnimated,
            {
                toValue: 0,
                duration: 200
            }
        ).start();
        this.setState({ keyword: '' });
        this.props.onDelete && this.props.onDelete();
    }

    onCancel = () => {
        this.setState({ keyword: '' });
        Keyboard.dismiss();
        Animated.parallel([
            Animated.timing(
                this.inputFocusWidthAnimated,
                {
                    toValue: contentWidth - 10,
                    duration: 200
                }
            ).start(),
            Animated.timing(
                this.btnCancelAnimated,
                {
                    toValue: contentWidth,
                    duration: 200
                }
            ).start(),
            Animated.timing(
                this.inputFocusPlaceholderAnimated,
                {
                    toValue: middleWidth - 15,
                    duration: 200
                }
            ).start(),
            Animated.timing(
                this.iconSearchAnimated,
                {
                    toValue: middleWidth - 25,
                    duration: 200
                }
            ).start(),
            Animated.timing(
                this.iconDeleteAnimated,
                {
                    toValue: 0,
                    duration: 200
                }
            ).start(),
        ]);
        this.props.onCancel && this.props.onCancel();
    }

    render() {
        return (
            <Animated.View
                ref="searchContainer"
                style={[
                    styles.container,
                    this.props.containerStyle
                ]}
            >
                <AnimatedTextInput
                    style={[
                        styles.input,
                        this.props.inputStyle,
                        {
                            width: this.inputFocusWidthAnimated,
                            paddingLeft: this.inputFocusPlaceholderAnimated
                        }
                    ]}
                    value={this.state.keyword}
                    onChangeText={this.onChangeText}
                    placeholder={this.placeholder}
                    onFocus={this.onFocus}
                    onSubmitEditing={this.onSearch}
                    autoCorrect={false}
                    returnKeyType="search"
                    underlineColorAndroid='transparent'
                />
                <Animated.Image
                    source={require('./img/search.png')}
                    style={[
                        styles.iconSearch,
                        {
                            left: this.iconSearchAnimated,
                        }
                    ]}
                />
                <TouchableWithoutFeedback onPress={this.onDelete}>
                    <Animated.Image
                        source={require('./img/delete.png')}
                        style={[
                            styles.iconDelete,
                            { opacity: this.iconDeleteAnimated }
                        ]}
                    />
                </TouchableWithoutFeedback>
                <TouchableWithoutFeedback onPress={this.onCancel}>
                    <Animated.View
                        style={[
                            styles.cancelButton,
                            this.props.btnCancelStyle,
                            { left: this.btnCancelAnimated }
                        ]}
                    >
                        <Text style={[styles.cancelButtonText, this.props.btnCancelColor]}>
                            {this.cancelTitle}
                        </Text>
                    </Animated.View>
                </TouchableWithoutFeedback>
            </Animated.View >
        );
    }
}

const styles = {
    container: {
        backgroundColor: 'grey',
        height: containerHeight,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        padding: 5,
        overflow: 'hidden'
    },
    input: {
        height: containerHeight - 10,
        paddingTop: 5,
        paddingBottom: 5,
        paddingRight: 20,
        borderColor: '#000',
        backgroundColor: '#f7f7f7',
        borderRadius: 5,
        color: 'grey',
        fontSize: 13
    },
    iconSearch: {
        flex: 1,
        position: 'absolute',
        top: middleHeight - 7,
        tintColor: 'grey',
        height: 14,
        width: 14,
    },
    iconDelete: {
        position: 'absolute',
        right: 70,
        top: middleHeight - 7,
        tintColor: 'grey',
        height: 14,
        width: 14,
    },
    cancelButton: {
        justifyContent: 'center',
        alignItems: 'flex-start',
        backgroundColor: 'transparent',
        width: 60,
        height: 50,
    },
    cancelButtonText: {
        fontSize: 14,
        color: '#fff'
    }
};

export default Search;
