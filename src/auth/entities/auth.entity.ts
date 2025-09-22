import { BeforeInsert, BeforeUpdate, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity({name: 'users'})
export class User {

    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column({type: 'varchar', length: 30, nullable: false})
    name: string

    @Column({ type: 'varchar', length: 30, nullable: false })
    lastName: string

    @Column({type: 'varchar',length: 255, nullable: true, default: 'default_profile_image.jpg',
    })
    avatar: string // Imagen del producto

    @Column({ type: 'varchar', length: 50, nullable: false, unique: true })
    email: string

    @Column({ type: 'varchar', length: 60, nullable: false })
    password: string

    @Column({ type:'varchar', array: true, default:['user']})
    role: string[]

    @Column({ type: 'varchar', length: 6, nullable: false })
    token: string

    @Column({ type: 'bool', default: false })
    confirmed: boolean

    @Column({ type: 'bool', default: false })
    isActive: boolean

    @CreateDateColumn({ type: 'timestamptz' })
    createdAt: Date;  // Fecha de creación automática

    @UpdateDateColumn({ type: 'timestamptz' })
    updatedAt: Date;  // Fecha de actualización automática

    /* Relaciones */

    /* @OneToMany(() => Product, (product) => product.category, { cascade: true })
    products: Product[]; */

    /* Hooks */
    @BeforeInsert()
    checkFieldsBeforeInsert() {
        this.email = this.email.toLowerCase().trim()
    }

    @BeforeUpdate()
    checkFieldsBeforeUpdate() {
        this.email = this.email.toLowerCase().trim()
    }

}
