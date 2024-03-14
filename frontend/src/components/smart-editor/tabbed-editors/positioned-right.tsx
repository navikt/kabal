import React from 'react';
import { PositionedBookmarks } from '../bookmarks/positioned';
import { NumberOfComments } from '../comments/number-of-comments';
import { PositionedComments } from '../comments/positioned-comments';

export const PositionedRight = () => (
  <>
    <NumberOfComments />
    <PositionedBookmarks />
    <PositionedComments />
  </>
);
