'use client';

import {
  useCallback,
  useEffect,
  useRef,
  type MutableRefObject,
  type PointerEvent as ReactPointerEvent,
  type RefObject,
} from 'react';
import {
  clampPosition,
  collectObstacleBoxes,
  getInitialPlayerPosition,
  resolveObstacleOverlap,
  resolvePlayerMovement,
  type Position,
} from '@/components/game/collision';
import { PLAYER_SIZE } from '@/components/game/constants';

interface UsePlayerControllerProps {
  boardRef: RefObject<HTMLDivElement | null>;
  obstacleRefs: MutableRefObject<(HTMLDivElement | null)[]>;
  playerRef: RefObject<HTMLDivElement | null>;
  disabled: boolean;
  isInvulnerable: boolean;
  onObstacleCollision: () => void;
}

interface DragState {
  pointerId: number;
  startPointer: Position;
  startPosition: Position;
}

export function usePlayerController({
  boardRef,
  obstacleRefs,
  playerRef,
  disabled,
  isInvulnerable,
  onObstacleCollision,
}: UsePlayerControllerProps) {
  const positionRef = useRef<Position>({ x: 0, y: 0 });
  const hasPositionRef = useRef(false);
  const dragStateRef = useRef<DragState | null>(null);
  const queuedPointerRef = useRef<Position | null>(null);
  const dragFrameRef = useRef<number | null>(null);
  const collisionFrameRef = useRef<number | null>(null);
  const onObstacleCollisionRef = useRef(onObstacleCollision);

  useEffect(() => {
    onObstacleCollisionRef.current = onObstacleCollision;
  }, [onObstacleCollision]);

  const applyPosition = useCallback((nextPosition: Position) => {
    const playerElement = playerRef.current;

    if (!playerElement) {
      return;
    }

    positionRef.current = nextPosition;
    hasPositionRef.current = true;
    playerElement.style.transform = `translate3d(${nextPosition.x}px, ${nextPosition.y}px, 0)`;
  }, [playerRef]);

  useEffect(() => {
    const syncPlayerPosition = () => {
      const boardElement = boardRef.current;

      if (!boardElement) {
        return;
      }

      const containerSize = {
        width: boardElement.clientWidth,
        height: boardElement.clientHeight,
      };

      const nextPosition = hasPositionRef.current
        ? clampPosition(positionRef.current, containerSize, PLAYER_SIZE)
        : getInitialPlayerPosition(containerSize, PLAYER_SIZE);

      applyPosition(nextPosition);
    };

    syncPlayerPosition();
    window.addEventListener('resize', syncPlayerPosition);

    return () => {
      window.removeEventListener('resize', syncPlayerPosition);
    };
  }, [applyPosition, boardRef]);

  useEffect(() => {
    const updateDraggedPosition = () => {
      dragFrameRef.current = null;

      const boardElement = boardRef.current;
      const dragState = dragStateRef.current;
      const queuedPointer = queuedPointerRef.current;

      if (!boardElement || !dragState || !queuedPointer || disabled) {
        return;
      }

      const boardRect = boardElement.getBoundingClientRect();
      const desiredPosition = {
        x: dragState.startPosition.x + (queuedPointer.x - dragState.startPointer.x),
        y: dragState.startPosition.y + (queuedPointer.y - dragState.startPointer.y),
      };
      const movementResult = resolvePlayerMovement({
        currentPosition: positionRef.current,
        desiredPosition,
        containerSize: {
          width: boardRect.width,
          height: boardRect.height,
        },
        obstacleBoxes: collectObstacleBoxes(obstacleRefs.current, boardRect),
      });

      applyPosition(movementResult.position);

      if (movementResult.hitObstacle) {
        onObstacleCollisionRef.current();
      }
    };

    const handlePointerMove = (event: PointerEvent) => {
      const dragState = dragStateRef.current;

      if (!dragState || event.pointerId !== dragState.pointerId) {
        return;
      }

      queuedPointerRef.current = {
        x: event.clientX,
        y: event.clientY,
      };

      if (dragFrameRef.current === null) {
        dragFrameRef.current = window.requestAnimationFrame(updateDraggedPosition);
      }
    };

    const finishDrag = (event: PointerEvent) => {
      const dragState = dragStateRef.current;

      if (!dragState || event.pointerId !== dragState.pointerId) {
        return;
      }

      dragStateRef.current = null;
      queuedPointerRef.current = null;
      document.body.style.userSelect = '';
    };

    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', finishDrag);
    window.addEventListener('pointercancel', finishDrag);

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', finishDrag);
      window.removeEventListener('pointercancel', finishDrag);

      if (dragFrameRef.current !== null) {
        window.cancelAnimationFrame(dragFrameRef.current);
      }

      document.body.style.userSelect = '';
    };
  }, [applyPosition, boardRef, disabled, obstacleRefs]);

  useEffect(() => {
    if (disabled) {
      return;
    }

    const checkObstacleCollision = () => {
      const boardElement = boardRef.current;

      if (!boardElement || !hasPositionRef.current) {
        collisionFrameRef.current = window.requestAnimationFrame(checkObstacleCollision);
        return;
      }

      const boardRect = boardElement.getBoundingClientRect();
      const overlapResult = resolveObstacleOverlap({
        position: positionRef.current,
        containerSize: {
          width: boardRect.width,
          height: boardRect.height,
        },
        obstacleBoxes: collectObstacleBoxes(obstacleRefs.current, boardRect),
      });

      if (overlapResult.hitObstacle) {
        applyPosition(overlapResult.position);

        if (!isInvulnerable) {
          onObstacleCollisionRef.current();
        }
      }

      collisionFrameRef.current = window.requestAnimationFrame(checkObstacleCollision);
    };

    collisionFrameRef.current = window.requestAnimationFrame(checkObstacleCollision);

    return () => {
      if (collisionFrameRef.current !== null) {
        window.cancelAnimationFrame(collisionFrameRef.current);
      }
    };
  }, [applyPosition, boardRef, disabled, isInvulnerable, obstacleRefs]);

  const handlePointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (disabled) {
      return;
    }

    event.preventDefault();
    dragStateRef.current = {
      pointerId: event.pointerId,
      startPointer: {
        x: event.clientX,
        y: event.clientY,
      },
      startPosition: positionRef.current,
    };
    queuedPointerRef.current = {
      x: event.clientX,
      y: event.clientY,
    };
    document.body.style.userSelect = 'none';
  };

  return {
    handlePointerDown,
  };
}