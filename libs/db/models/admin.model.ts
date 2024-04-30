import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class AdminModel {
  @Prop()
  totalSpace: number;
  @Prop()
  delete: number;
}
export const AdminSchema = SchemaFactory.createForClass(AdminModel);
