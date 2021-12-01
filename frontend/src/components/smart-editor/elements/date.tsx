import React from 'react';
import { isoDateTimeToPrettyDate } from '../../../domain/date';
import { IDateElement } from '../../../redux-api/smart-editor-types';

export const DateElement = ({ id, content }: IDateElement) => (
  <time key={id}>{content.length === 0 ? isoDateTimeToPrettyDate(new Date().toISOString()) : content}</time>
);
