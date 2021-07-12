![banner](/banner.png)
[![npm version](https://badge.fury.io/js/mm-carousel.svg)](https://badge.fury.io/js/mm-carousel)

This is a React native carousel component which uses react-native-reanimated.

##Installation
```
yarn add mm-carousel react-native-reanimated react-native-gesture-handler
```

##Usage
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
