import { LocalDateTime } from '@js-joda/core';
import { DateTimeUtil } from '@shared/utils/DateTimeUtil';
import {
    CreateDateColumn,
    DeleteDateColumn,
    Generated,
    PrimaryColumn,
    UpdateDateColumn,
} from 'typeorm';

export abstract class BaseTimeEntity {
    @Generated('increment')
    @PrimaryColumn({ type: 'int' })
    id: number;

    @CreateDateColumn({ type: 'timestamp', nullable: false })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamp', nullable: false })
    updatedAt: Date;

    @DeleteDateColumn({ type: 'timestamp', nullable: true })
    deletedAt: Date;

    getCreatedAt(): LocalDateTime {
        return DateTimeUtil.toLocalDateTime(this.createdAt);
    }

    getUpdatedAt(): LocalDateTime {
        return DateTimeUtil.toLocalDateTime(this.updatedAt);
    }

    getDeletedAt(): LocalDateTime {
        return DateTimeUtil.toLocalDateTime(this.deletedAt);
    }
}
