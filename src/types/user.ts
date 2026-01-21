import type { BaseAuditModel } from '@/types/base';

export interface User extends BaseAuditModel {
  name: string;
  surname: string;
  username: string;
  email: string;
  profilePicture: string;
  password: string;
}
