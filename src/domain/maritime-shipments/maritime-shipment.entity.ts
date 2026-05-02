import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Client } from '../clients/client.entity';
import { Port } from '../ports/port.entity';
import { Product } from '../products/product.entity';

@Entity('maritime_shipments')
export class MaritimeShipment {
  @PrimaryGeneratedColumn('increment', { type: 'bigint', unsigned: true })
  id!: string;

  @Column({ name: 'client_id', type: 'bigint', unsigned: true })
  clientId!: string;

  @ManyToOne(() => Client, { nullable: false })
  @JoinColumn({ name: 'client_id' })
  client!: Client;

  @Column({ name: 'product_id', type: 'bigint', unsigned: true })
  productId!: string;

  @ManyToOne(() => Product, { nullable: false })
  @JoinColumn({ name: 'product_id' })
  product!: Product;

  @Column({ name: 'port_id', type: 'bigint', unsigned: true })
  portId!: string;

  @ManyToOne(() => Port, { nullable: false })
  @JoinColumn({ name: 'port_id' })
  port!: Port;

  @Column({ type: 'int' })
  quantity!: number;

  @Column({ name: 'registration_date', type: 'date' })
  registrationDate!: string;

  @Column({ name: 'delivery_date', type: 'date' })
  deliveryDate!: string;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  price!: string;

  @Column({ name: 'discount_price', type: 'decimal', precision: 12, scale: 2 })
  discountPrice!: string;

  @Column({ name: 'fleet_number', type: 'varchar', length: 8 })
  fleetNumber!: string;

  @Column({ name: 'guide_number', type: 'varchar', length: 10, unique: true })
  guideNumber!: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt!: Date;
}
