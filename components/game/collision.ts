import { PLAYER_SIZE } from './constants';

export interface Position {
  x: number;
  y: number;
}

export interface Size {
  width: number;
  height: number;
}

export interface Box {
  left: number;
  top: number;
  width: number;
  height: number;
}

interface ResolvePlayerMovementArgs {
  currentPosition: Position;
  desiredPosition: Position;
  containerSize: Size;
  obstacleBoxes: Box[];
  playerSize?: number;
}

interface ResolveObstacleOverlapArgs {
  position: Position;
  containerSize: Size;
  obstacleBoxes: Box[];
  playerSize?: number;
}

const getRight = (box: Box) => box.left + box.width;
const getBottom = (box: Box) => box.top + box.height;

export const clamp = (value: number, min: number, max: number) => {
  if (max < min) {
    return min;
  }

  return Math.min(Math.max(value, min), max);
};

export const clampPosition = (
  position: Position,
  containerSize: Size,
  playerSize: number = PLAYER_SIZE,
): Position => ({
  x: clamp(position.x, 0, containerSize.width - playerSize),
  y: clamp(position.y, 0, containerSize.height - playerSize),
});

export const getInitialPlayerPosition = (
  containerSize: Size,
  playerSize: number = PLAYER_SIZE,
): Position => {
  const initialY = Math.min(
    containerSize.height * 0.68,
    containerSize.height - playerSize - 96,
  );

  return clampPosition(
    {
      x: (containerSize.width - playerSize) / 2,
      y: initialY,
    },
    containerSize,
    playerSize,
  );
};

export const toBox = (
  position: Position,
  playerSize: number = PLAYER_SIZE,
): Box => ({
  left: position.x,
  top: position.y,
  width: playerSize,
  height: playerSize,
});

export const boxesOverlap = (firstBox: Box, secondBox: Box) => (
  firstBox.left < getRight(secondBox)
  && getRight(firstBox) > secondBox.left
  && firstBox.top < getBottom(secondBox)
  && getBottom(firstBox) > secondBox.top
);

export const collectObstacleBoxes = (
  obstacleElements: Array<HTMLDivElement | null>,
  containerRect: DOMRect,
): Box[] => obstacleElements.flatMap((obstacleElement) => {
  if (!obstacleElement) {
    return [];
  }

  const obstacleRect = obstacleElement.getBoundingClientRect();

  return [{
    left: obstacleRect.left - containerRect.left,
    top: obstacleRect.top - containerRect.top,
    width: obstacleRect.width,
    height: obstacleRect.height,
  }];
});

const overlapsAnyObstacle = (playerBox: Box, obstacleBoxes: Box[]) => (
  obstacleBoxes.some((obstacleBox) => boxesOverlap(playerBox, obstacleBox))
);

export const resolvePlayerMovement = ({
  currentPosition,
  desiredPosition,
  containerSize,
  obstacleBoxes,
  playerSize = PLAYER_SIZE,
}: ResolvePlayerMovementArgs) => {
  const clampedDesiredPosition = clampPosition(desiredPosition, containerSize, playerSize);
  const desiredBox = toBox(clampedDesiredPosition, playerSize);

  if (!overlapsAnyObstacle(desiredBox, obstacleBoxes)) {
    return {
      position: clampedDesiredPosition,
      hitObstacle: false,
    };
  }

  let resolvedPosition = currentPosition;
  const hitObstacle = true;

  const xOnlyPosition = clampPosition(
    { x: clampedDesiredPosition.x, y: currentPosition.y },
    containerSize,
    playerSize,
  );

  if (!overlapsAnyObstacle(toBox(xOnlyPosition, playerSize), obstacleBoxes)) {
    resolvedPosition = xOnlyPosition;
  }

  const yOnlyPosition = clampPosition(
    { x: resolvedPosition.x, y: clampedDesiredPosition.y },
    containerSize,
    playerSize,
  );

  if (!overlapsAnyObstacle(toBox(yOnlyPosition, playerSize), obstacleBoxes)) {
    resolvedPosition = yOnlyPosition;
  }

  return {
    position: resolvedPosition,
    hitObstacle,
  };
};

export const resolveObstacleOverlap = ({
  position,
  containerSize,
  obstacleBoxes,
  playerSize = PLAYER_SIZE,
}: ResolveObstacleOverlapArgs) => {
  let resolvedPosition = clampPosition(position, containerSize, playerSize);
  let hitObstacle = false;

  for (let attempt = 0; attempt < 4; attempt += 1) {
    const playerBox = toBox(resolvedPosition, playerSize);
    const overlappingObstacle = obstacleBoxes.find((obstacleBox) => boxesOverlap(playerBox, obstacleBox));

    if (!overlappingObstacle) {
      break;
    }

    hitObstacle = true;

    const overlapX = Math.min(getRight(playerBox), getRight(overlappingObstacle))
      - Math.max(playerBox.left, overlappingObstacle.left);
    const overlapY = Math.min(getBottom(playerBox), getBottom(overlappingObstacle))
      - Math.max(playerBox.top, overlappingObstacle.top);

    const playerCenterX = playerBox.left + (playerBox.width / 2);
    const playerCenterY = playerBox.top + (playerBox.height / 2);
    const obstacleCenterX = overlappingObstacle.left + (overlappingObstacle.width / 2);
    const obstacleCenterY = overlappingObstacle.top + (overlappingObstacle.height / 2);

    if (overlapX <= overlapY) {
      resolvedPosition = clampPosition(
        {
          ...resolvedPosition,
          x: playerCenterX < obstacleCenterX
            ? resolvedPosition.x - overlapX
            : resolvedPosition.x + overlapX,
        },
        containerSize,
        playerSize,
      );
      continue;
    }

    resolvedPosition = clampPosition(
      {
        ...resolvedPosition,
        y: playerCenterY < obstacleCenterY
          ? resolvedPosition.y - overlapY
          : resolvedPosition.y + overlapY,
      },
      containerSize,
      playerSize,
    );
  }

  return {
    position: resolvedPosition,
    hitObstacle,
  };
};
