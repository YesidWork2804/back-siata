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
import { Product } from '../products/product.entity';
import { Warehouse } from '../warehouses/warehouse.entity';

@Entity('land_shipments')
export class LandShipment {
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

  @Column({ name: 'warehouse_id', type: 'bigint', unsigned: true })
  warehouseId!: string;

  @ManyToOne(() => Warehouse, { nullable: false })
  @JoinColumn({ name: 'warehouse_id' })
  warehouse!: Warehouse;

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

  @Column({ name: 'vehicle_plate', type: 'varchar', length: 6 })
  vehiclePlate!: string;

  @Column({ name: 'guide_number', type: 'varchar', length: 10, unique: true })
  guideNumber!: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt!: Date;
}
