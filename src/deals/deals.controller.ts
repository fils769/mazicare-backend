import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { DealsService } from './deals.service';
import { CreateDealDto } from './dto/create-deal.dto';
import { UpdateDealDto } from './dto/update-deal.dto';
import { GetDealsQueryDto } from './dto/get-deals-query.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AdminGuard } from '../auth/guards/admin.guard';

@Controller('deals')
export class DealsController {
  constructor(private readonly dealsService: DealsService) {}

  @Post()
  @UseGuards(JwtAuthGuard, AdminGuard)
  create(@Body() createDealDto: CreateDealDto, @Request() req) {
    return this.dealsService.create(createDealDto, req.user.userId);
  }

  @Get()
  findAll(@Query() query: GetDealsQueryDto) {
    return this.dealsService.findAll(query);
  }

  @Get('my-claims')
  @UseGuards(JwtAuthGuard)
  getUserClaims(@Request() req) {
    return this.dealsService.getUserClaims(req.user.userId);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  findOne(@Param('id') id: string, @Request() req) {
    return this.dealsService.findOne(id, req.user.userId);
  }

  @Get(':id/claims')
  @UseGuards(JwtAuthGuard, AdminGuard)
  getDealClaims(@Param('id') id: string) {
    return this.dealsService.getDealClaims(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, AdminGuard)
  update(@Param('id') id: string, @Body() updateDealDto: UpdateDealDto) {
    return this.dealsService.update(id, updateDealDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, AdminGuard)
  remove(@Param('id') id: string) {
    return this.dealsService.remove(id);
  }

  @Post(':id/claim')
  @UseGuards(JwtAuthGuard)
  claimDeal(@Param('id') id: string, @Request() req) {
    return this.dealsService.claimDeal(id, req.user.userId, req.user.role);
  }
}
