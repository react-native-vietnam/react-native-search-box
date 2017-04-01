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

const { width } = Dimensions.get('window');
const AnimatedTextInput = Animated.createAnimatedComponent(TextInput);
const containerHeight = 40;
const middleHeight = 20;

class Search extends Component {
    constructor(props) {
        super(props);
        this.state = { keyword: '' };

        /**
         * Animated values
         */
        this.iconSearchAnimated = new Animated.Value(this.props.middleWidth - 25);
        this.iconDeleteAnimated = new Animated.Value(0);
        this.inputFocusWidthAnimated = new Animated.Value(this.props.contentWidth - 10);
        this.inputFocusPlaceholderAnimated = new Animated.Value(this.props.middleWidth - 15);
        this.btnCancelAnimated = new Animated.Value(this.props.contentWidth);

        /**
         * functions
         */
        this.onFocus = this.onFocus.bind(this);
        this.onSearch = this.onSearch.bind(this);
        this.onChangeText = this.onChangeText.bind(this);
        this.onCancel = this.onCancel.bind(this);
        this.onDelete = this.onDelete.bind(this);
        this.focus = this.focus.bind(this);
        this.expandAnimation = this.expandAnimation.bind(this);
        this.collapseAnimation = this.collapseAnimation.bind(this);

        /**
         * local variables
         */
        this.placeholder = this.props.placeholder || 'Search';
        this.cancelTitle = this.props.cancelTitle || 'Cancel';
    }

    /**
     * onSearch
     * async await
     */
    onSearch = async () => {
        this.props.beforeSearch && await this.props.beforeSearch(this.state.keyword);
        await Keyboard.dismiss();
        this.props.onSearch && await this.props.onSearch(this.state.keyword);
        this.props.afterSearch && await this.props.afterSearch(this.state.keyword);
    }

    /**
     * onChangeText
     * async await
     */
    onChangeText = async (text) => {
        await this.setState({ keyword: text });
        await new Promise((resolve, reject) => {
            Animated.timing(
                this.iconDeleteAnimated,
                {
                    toValue: (text.length > 0) ? 1 : 0,
                    duration: 200
                }
            ).start(() => resolve());
        });
        this.props.onChangeText && await this.props.onChangeText(this.state.keyword);
    }

    /**
     * onFocus
     * async await
     */
    onFocus = async () => {
        this.props.beforeFocus && await this.props.beforeFocus();
        this.refs.input_keyword._component.isFocused && await this.refs.input_keyword._component.focus();
        await this.expandAnimation();
        this.props.onFocus && await this.props.onFocus(this.state.keyword);
        this.props.afterFocus && await this.props.afterFocus();
    }

    /**
     * focus
     * async await
     */
    focus = async (text = '') => {
        await this.setState({ keyword: text });
        await this.refs.input_keyword._component.focus();
    }

    /**
     * onDelete
     * async await
     */
    onDelete = async () => {
        this.props.beforeDelete && await this.props.beforeDelete();
        await new Promise((resolve, reject) => {
            Animated.timing(
                this.iconDeleteAnimated,
                {
                    toValue: 0,
                    duration: 200
                }
            ).start(() => resolve());
        });
        await this.setState({ keyword: '' });
        this.props.onDelete && await this.props.onDelete();
        this.props.afterDelete && await this.props.afterDelete();
    }

    /**
     * onCancel
     * async await
     */
    onCancel = async () => {
        this.props.beforeCancel && await this.props.beforeCancel();
        await this.setState({ keyword: '' });
        await this.collapseAnimation();
        this.props.onCancel && await this.props.onCancel();
        this.props.afterCancel && await this.props.afterCancel();
    }

    expandAnimation = () => {
        return new Promise((resolve, reject) => {
            Animated.parallel([
                Animated.timing(
                    this.inputFocusWidthAnimated,
                    {
                        toValue: this.props.contentWidth - 70,
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
                Animated.timing(
                    this.iconDeleteAnimated,
                    {
                        toValue: (this.state.keyword.length > 0) ? 1 : 0,
                        duration: 200
                    }
                ).start()
            ]);
            resolve();
        });
    }

    collapseAnimation = () => {
        return new Promise((resolve, reject) => {
            Animated.parallel([
                Keyboard.dismiss(),
                Animated.timing(
                    this.inputFocusWidthAnimated,
                    {
                        toValue: this.props.contentWidth - 10,
                        duration: 200
                    }
                ).start(),
                Animated.timing(
                    this.btnCancelAnimated,
                    {
                        toValue: this.props.contentWidth,
                        duration: 200
                    }
                ).start(),
                Animated.timing(
                    this.inputFocusPlaceholderAnimated,
                    {
                        toValue: this.props.middleWidth - 15,
                        duration: 200
                    }
                ).start(),
                Animated.timing(
                    this.iconSearchAnimated,
                    {
                        toValue: this.props.middleWidth - 25,
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
            resolve();
        });
    }

    render() {
        return (
            <Animated.View
                ref="searchContainer"
                style={
                    [
                        styles.container,
                        this.props.backgroundColor && { backgroundColor: this.props.backgroundColor }
                    ]}
            >
                <AnimatedTextInput
                    ref="input_keyword"
                    style={[
                        styles.input,
                        this.props.placeholderTextColor && { color: this.props.placeholderTextColor },
                        this.props.inputHeight && { height: this.props.inputHeight },
                        this.props.inputBorderRadius && { borderRadius: this.props.inputBorderRadius },
                        {
                            width: this.inputFocusWidthAnimated,
                            paddingLeft: this.inputFocusPlaceholderAnimated
                        }
                    ]}
                    value={this.state.keyword}
                    onChangeText={this.onChangeText}
                    placeholder={this.placeholder}
                    placeholderTextColor={this.props.placeholderTextColor || styles.placeholderColor}
                    onSubmitEditing={this.onSearch}
                    autoCorrect={false}
                    blurOnSubmit={false}
                    returnKeyType={this.props.returnKeyType || 'search'}
                    keyboardType={this.props.keyboardType || 'default'}
                    onFocus={this.onFocus}
                    underlineColorAndroid="transparent"
                />
                <TouchableWithoutFeedback onPress={this.onFocus}>
                    <Animated.Image
                        source={require('./img/search.png')}
                        style={[
                            styles.iconSearch,
                            this.props.tintColorSearch && { tintColor: this.props.tintColorSearch },
                            {
                                left: this.iconSearchAnimated,
                            }
                        ]}
                    />
                </TouchableWithoutFeedback>
                <TouchableWithoutFeedback onPress={this.onDelete}>
                    <Animated.Image
                        source={require('./img/delete.png')}
                        style={[
                            styles.iconDelete,
                            this.props.tintColorDelete && { tintColor: this.props.tintColorDelete },
                            { opacity: this.iconDeleteAnimated }
                        ]}
                    />
                </TouchableWithoutFeedback>
                <TouchableWithoutFeedback onPress={this.onCancel}>
                    <Animated.View
                        style={[
                            styles.cancelButton,
                            { left: this.btnCancelAnimated }
                        ]}
                    >
                        <Text style={[styles.cancelButtonText, this.props.titleCancelColor && { color: this.props.titleCancelColor }]}>
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
        fontSize: 13,
    },
    placeholderColor: 'grey',
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
/**
 * Props
 */
Search.propTypes = {
    /**
     * onFocus
     * return a Promise
     * beforeFocus, onFocus, afterFocus
     */
    beforeFocus: PropTypes.func,
    onFocus: PropTypes.func,
    afterFocus: PropTypes.func,

    /**
     * onSearch
     * return a Promise
     */
    beforeSearch: PropTypes.func,
    onSearch: PropTypes.func,
    afterSearch: PropTypes.func,

    /**
     * onChangeText
     * return a Promise
     */
    onChangeText: PropTypes.func,

    /**
     * onCancel
     * return a Promise
     */
    beforeCancel: PropTypes.func,
    onCancel: PropTypes.func,
    afterCancel: PropTypes.func,

    /**
     * async await
     * return a Promise
     * beforeDelete, onDelete, afterDelete
     */
    beforeDelete: PropTypes.func,
    onDelete: PropTypes.func,
    afterDelete: PropTypes.func,

    /**
     * styles
     */
    backgroundColor: PropTypes.string,
    placeholderTextColor: PropTypes.string,
    titleCancelColor: PropTypes.string,
    tintColorSearch: PropTypes.string,
    tintColorDelete: PropTypes.string,

    /**
     * text input
     */
    placeholder: PropTypes.string,
    cancelTitle: PropTypes.string,
    returnKeyType: PropTypes.string,
    keyboardType: PropTypes.string,
    inputHeight: PropTypes.number,
    inputBorderRadius: PropTypes.number,
    contentWidth: PropTypes.number,
    middleWidth: PropTypes.number,
};

Search.defaultProps = {
    contentWidth: width,
    middleWidth: width / 2,
};

export default Search;
