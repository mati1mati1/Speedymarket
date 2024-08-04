import React, { Component } from 'react';
import { StyleSheet, View, Animated, PanResponder } from 'react-native';

interface DraggableProps {
  x: number;
  y: number;
  onDragRelease: (e: any, gestureState: any, bounds: { left: number; top: number }) => void;
  children: React.ReactNode;
}

interface DraggableState {
  pan: Animated.ValueXY;
  scale: Animated.Value;
}

class Draggable extends Component<DraggableProps, DraggableState> {
  private panResponder: any;
  private _val: { x: number; y: number };

  constructor(props: DraggableProps) {
    super(props);
    this.state = {
      pan: new Animated.ValueXY({ x: props.x, y: props.y }),
      scale: new Animated.Value(1),
    };

    this._val = { x: props.x, y: props.y };
    this.state.pan.addListener((value) => (this._val = value));

    this.panResponder = PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        this.state.pan.setOffset({
          x: this._val.x,
          y: this._val.y,
        });
        this.state.pan.setValue({ x: 0, y: 0 });
        Animated.spring(this.state.scale, {
          toValue: 1.1,
          useNativeDriver: true,
        }).start();
      },
      onPanResponderMove: Animated.event([null, { dx: this.state.pan.x, dy: this.state.pan.y }], {
        useNativeDriver: false,
      }),
      onPanResponderRelease: (e, gesture) => {
        this.state.pan.flattenOffset();
        Animated.spring(this.state.scale, {
          toValue: 1,
          useNativeDriver: true,
        }).start();
        const { x, y } = this._val;
        this.props.onDragRelease(e, gesture, { left: x, top: y });
      },
    });
  }

  componentWillUnmount() {
    this.state.pan.removeAllListeners();
  }

  render() {
    const panStyle = {
      transform: this.state.pan.getTranslateTransform(),
    };

    return (
      <Animated.View
        {...this.panResponder.panHandlers}
        style={[panStyle, styles.draggable]}
      >
        {this.props.children}
      </Animated.View>
    );
  }
}

const styles = StyleSheet.create({
  draggable: {
    position: 'absolute',
  },
});

export default Draggable;
