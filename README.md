![banner](/banner.png)
[![npm version](https://badge.fury.io/js/mm-carousel.svg)](https://badge.fury.io/js/mm-carousel)

This is a React native carousel component which uses react-native-reanimated.

## Installation
```
yarn add mm-carousel react-native-reanimated react-native-gesture-handler
```

## Usage
```js
const snapPoints = useMemo(
    () => data.map((_, index) => ({x: index * -screenWidth})),
    [],
  );

  return (
    <View style={styles.container}>
      <MMCarousel
        style={[styles.carousel, {width: screenWidth * data.length}]}
        boundaries={{left: snapPoints[data.length - 1]?.x, right: 0}}
        horizontalOnly={true}
        snapPoints={snapPoints}>
        {data.map(color => (
          <View style={[styles.swipeItem, {backgroundColor: color}]} />
        ))}
      </MMCarousel>
      <Text style={styles.bottomText}>{'<<< Swipe left or right >>>'}</Text>
    </View>
  );
```

## Configuration

You can configure the component using these props:

Name             | Type                                     | Default value           | Description
-----------------|------------------------------------------|-------------------------|--------------
style            | ViewStyle                                | {}                      | Style of carousel (apply flexDirection: 'row' for horizontal scrolling).
boundaries       | {left, right, top, bottom}               | {}                      | Limits for scrolling.
horizontalOnly   | boolean                                  | false                   | For horizontal only scrolling.
verticalOnly     | boolean                                  | false                   | For vertictal only scrolling.
dragEnabled      | boolean                                  | true                    | Enables dragging on view.
dragToss         | number                                   | 0.1                     | Time in seconds the view is allowed to be tossed before snapping to point
snapPoints       | array[{x, y}].                           | []                      | Points for snapping.
springPoints     | array[{x, y}].                           | []                      | Points for springing.
gravityPoints    | array[{x, y}].                           | []                      | Points for gravity.
frictionAreas    | array[[{damping, influenceArea: {top}}]] | []                      | Add friction to the view's movement with a group of friction regions.
initialPosition  | {x, y}                                   | 0                       | Where do we begin.
animatedValueX   | Animated.Value                           | null                    | Animated value for x axis.
animatedValueY   | Animated.Value                           | null                    | Animated value for y axis.
dragWithSpring   | {tension, damping}                       | null                    | Values for scroll physics behavior.
onDrag           | (event) => void                          | null                    | Callback when drag event occurs.
onSnap           | (event) => void                          | null                    | Callback when snap event occurs.
onStop           | (event) => void                          | null                    | Callback when interaction stops.
