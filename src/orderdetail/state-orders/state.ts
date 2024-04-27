import { StatusOrderEnum } from 'src/constants';
import { DataOrderStatus, OrderStateHandler } from '../dto/OrderDetail.dto';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import {
  CompletedItemStatus,
} from './complete-item.state';
import { DeliveringStatus } from './delivering.state';
import { GettingItemStatus } from './getting-item.state';
import { InProgressStatus } from './in_progress.state';
import { PackagingStatus } from './packaging.state';

@Injectable()
export class StatusOrder {
  private state: OrderStateHandler;

  constructor(
    private completedItemStatus: CompletedItemStatus,
    private deliveringStatus: DeliveringStatus,
    private gettingItemStatus: GettingItemStatus,
    private inProgressStatus: InProgressStatus,
    private packagingStatus: PackagingStatus,
  ) {}

  async transitionToState(stateName: StatusOrderEnum): Promise<void> {
    switch (stateName) {
      case StatusOrderEnum.COMPLETED:
        this.state = this.completedItemStatus;
        break;
      case StatusOrderEnum.DELIVERING:
        this.state = this.deliveringStatus;
        break;
      case StatusOrderEnum.GETTING_ITEM:
        this.state = this.gettingItemStatus;
        break;
      case StatusOrderEnum.IN_PROGRESS:
        this.state = this.inProgressStatus;
        break;
      case StatusOrderEnum.PACKAGING:
        this.state = this.packagingStatus;
        break;
      default:
        throw new HttpException('status not valid', HttpStatus.BAD_REQUEST);
    }
  }

  async processOrder({ userId, orderId }: DataOrderStatus): Promise<void> {
    await this.state.handle({ userId, orderId });
  }
}