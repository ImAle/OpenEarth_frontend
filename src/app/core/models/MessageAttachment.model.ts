import {AttachmentType} from './AttachmentType';

export interface MessageAttachment {
  id?: number;
  type: AttachmentType;
  content: string;
  metadata?: string;
}
