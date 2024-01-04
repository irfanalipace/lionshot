import React from 'react';
import { avatarName } from '../../../core/utils/helpers';

export default function UserAvatar() {
  return <div>{avatarName()}</div>;
}
