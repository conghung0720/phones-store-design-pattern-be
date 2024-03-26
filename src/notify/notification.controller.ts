import { Controller, Get, Post, Body, Param, Put, Delete, Patch } from '@nestjs/common';
import { NotificationService } from './notification.service';

@Controller('notification')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Post()
  async create(@Body() createNotificationDto: any): Promise<any> {
    return this.notificationService.create(createNotificationDto);
  }

  @Get()
  async findAll(): Promise<any[]> {
    return this.notificationService.findAll();
  }

  @Get('user/:userId')
  async findByUserId(@Param('userId') userId: string) {
    return await this.notificationService.findOne(userId);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateNotificationDto: any): Promise<any> {
    return this.notificationService.update(id, updateNotificationDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<any> {
    return this.notificationService.remove(id);
  }

  @Post('markAllAsRead/:userId')
  async markAllAsRead(@Param('userId') userId: string) {
    return await this.notificationService.markAllAsRead(userId);
  }

  @Get('count/:userId')
  async countNotifications(@Param('userId') userId: string) {
    return await this.notificationService.countSentNotifications(userId)
  }
}
