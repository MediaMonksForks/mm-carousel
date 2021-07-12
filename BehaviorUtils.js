import Animated from 'react-native-reanimated';

const {add, cond, divide, eq, exp, lessThan, and, sub} = Animated;
const {call, multiply, pow, set} = Animated;
const {lessOrEq, sqrt, Value} = Animated;

import {
  DEFAULT_GRAVITY_FALLOF,
  DEFAULT_GRAVITY_STRENGTH,
  DEFAULT_SNAP_DAMPING,
  DEFAULT_SNAP_TENSION,
} from './index';

export const sq = x => multiply(x, x);

export const influenceAreaWithRadius = (radius, anchor) => ({
  bottom: (anchor.y || 0) + radius,
  left: (anchor.x || 0) - radius,
  right: (anchor.x || 0) + radius,
  top: (anchor.y || 0) - radius,
});

export const snapTo = (target, snapPoints, best, clb, dragClb) => {
  const dist = new Value(0);
  const snap = pt => [
    set(best.tension, pt.tension || DEFAULT_SNAP_TENSION),
    set(best.damping, pt.damping || DEFAULT_SNAP_DAMPING),
    set(best.x, pt.x || 0),
    set(best.y, pt.y || 0),
  ];
  const snapDist = pt =>
    add(sq(sub(target.x, pt.x || 0)), sq(sub(target.y, pt.y || 0)));
  return [
    set(dist, snapDist(snapPoints[0])),
    ...snap(snapPoints[0]),
    ...snapPoints.map(pt => {
      const newDist = snapDist(pt);
      return cond(lessThan(newDist, dist), [set(dist, newDist), ...snap(pt)]);
    }),
    (clb || dragClb) &&
      call([best.x, best.y, target.x, target.y], ([bx, by, x, y]) => {
        snapPoints.forEach((pt, index) => {
          if (
            (pt.x === undefined || pt.x === bx) &&
            (pt.y === undefined || pt.y === by)
          ) {
            if (clb) {
              clb({nativeEvent: {...pt, index}});
            }
            if (dragClb) {
              dragClb({
                nativeEvent: {x, y, targetSnapPointId: pt.id, state: 'end'},
              });
            }
          }
        });
      }),
  ];
};

export const springBehavior = (dt, target, obj, anchor, tension = 300) => {
  const dx = sub(target.x, anchor.x);
  const ax = divide(multiply(-1, tension, dx), obj.mass);
  const dy = sub(target.y, anchor.y);
  const ay = divide(multiply(-1, tension, dy), obj.mass);
  return {
    x: set(obj.vx, add(obj.vx, multiply(dt, ax))),
    y: set(obj.vy, add(obj.vy, multiply(dt, ay))),
  };
};

export const frictionBehavior = (dt, target, obj, damping = 0.7) => {
  const friction = pow(damping, multiply(60, dt));
  return {
    x: set(obj.vx, multiply(obj.vx, friction)),
    y: set(obj.vy, multiply(obj.vy, friction)),
  };
};

export const anchorBehavior = (dt, target, obj, anchor) => {
  const dx = sub(anchor.x, target.x);
  const dy = sub(anchor.y, target.y);
  return {
    x: set(obj.vx, divide(dx, dt)),
    y: set(obj.vy, divide(dy, dt)),
  };
};

export const gravityBehavior = (
  dt,
  target,
  obj,
  anchor,
  strength = DEFAULT_GRAVITY_STRENGTH,
  falloff = DEFAULT_GRAVITY_FALLOF,
) => {
  const dx = sub(target.x, anchor.x);
  const dy = sub(target.y, anchor.y);
  const drsq = add(sq(dx), sq(dy));
  const dr = sqrt(drsq);
  const a = divide(
    multiply(-1, strength, dr, exp(divide(multiply(-0.5, drsq), sq(falloff)))),
    obj.mass,
  );
  const div = divide(a, dr);
  return {
    x: cond(dr, set(obj.vx, add(obj.vx, multiply(dt, dx, div)))),
    y: cond(dr, set(obj.vy, add(obj.vy, multiply(dt, dy, div)))),
  };
};

export const bounceBehavior = (dt, target, obj, area, bounce = 0) => {
  const xnodes = [];
  const ynodes = [];
  const flipx = set(obj.vx, multiply(-1, obj.vx, bounce));
  const flipy = set(obj.vy, multiply(-1, obj.vy, bounce));
  if (area.left !== undefined) {
    xnodes.push(cond(and(eq(target.x, area.left), lessThan(obj.vx, 0)), flipx));
  }
  if (area.right !== undefined) {
    xnodes.push(
      cond(and(eq(target.x, area.right), lessThan(0, obj.vx)), flipx),
    );
  }
  if (area.top !== undefined) {
    xnodes.push(cond(and(eq(target.y, area.top), lessThan(obj.vy, 0)), flipy));
  }
  if (area.bottom !== undefined) {
    xnodes.push(
      cond(and(eq(target.y, area.bottom), lessThan(0, obj.vy)), flipy),
    );
  }
  return {
    x: xnodes,
    y: ynodes,
  };
};

export const withInfluence = (area, target, behavior) => {
  if (!area) {
    return behavior;
  }
  const testLeft = area.left === undefined || lessOrEq(area.left, target.x);
  const testRight = area.right === undefined || lessOrEq(target.x, area.right);
  const testTop = area.top === undefined || lessOrEq(area.top, target.y);
  const testBottom =
    area.bottom === undefined || lessOrEq(target.y, area.bottom);
  const testNodes = [testLeft, testRight, testTop, testBottom].filter(
    t => t !== true,
  );
  const test = and(...testNodes);
  return {x: cond(test, behavior.x), y: cond(test, behavior.y)};
};

export const withLimits = (value, lowerBound, upperBound) => {
  let result = value;
  if (lowerBound !== undefined) {
    result = cond(lessThan(value, lowerBound), lowerBound, result);
  }
  if (upperBound !== undefined) {
    result = cond(lessThan(upperBound, value), upperBound, result);
  }
  return result;
};
