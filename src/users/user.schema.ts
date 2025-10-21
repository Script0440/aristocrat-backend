import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

export enum UserRole {
  OWNER = 'owner',
  STAFF = 'staff',
  INTERN = 'intern',
}

export const UserPermissions = [
  { isActive: false, value: 'CONTROL_ROOMS', label: 'Control Rooms' },
  { isActive: false, value: 'CONTROL_BOOKINGS', label: 'Control Bookings' },
  { isActive: false, value: 'CONTROL_STAFF', label: 'Control Staff' },
  { isActive: false, value: 'CONTROL_SETTINGS', label: 'Control Settings' },
  { isActive: false, value: 'CONTROL_HISTORY', label: 'Control History' },
] as const;

// тип для одного разрешения
export type UserPermission = (typeof UserPermissions)[number];

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true })
  fullName: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ enum: UserRole, default: UserRole.STAFF })
  role: UserRole;

  @Prop({ type: Boolean, default: false })
  isVerification: boolean;

  @Prop({ type: String, default: null })
  verifyToken: string | null;

  @Prop({
    type: [
      {
        value: { type: String },
        isActive: { type: Boolean },
        label: { type: String },
      },
    ],
    default: UserPermissions,
  })
  permissions: UserPermission[];
}

export const UserSchema = SchemaFactory.createForClass(User);
