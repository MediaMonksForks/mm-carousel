import React, {useMemo} from 'react';
import {Dimensions, View, Text} from 'react-native';
import MMCarousel from 'mm-carousel';

const screenWidth = Dimensions.get('window').width;

const data = ['red', 'green', 'blue'];

const App = () => {
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
};

const styles = {
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  carousel: {
    flexDirection: 'row',
  },
  swipeItem: {
    width: screenWidth,
    height: 300,
  },
  bottomText: {
    marginTop: 40,
    width: '100%',
    textAlign: 'center',
    fontSize: 22,
  },
};

export default App;
