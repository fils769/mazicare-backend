// import { Test, TestingModule } from '@nestjs/testing';

// import axios from 'axios';
// import { BadRequestException } from '@nestjs/common';
// import { VivaService } from './viva.service';
// import { PrismaService } from '../prisma/prisma.service';

// // Mock Axios
// jest.mock('axios');
// const mockedAxios = axios as jest.Mocked<typeof axios>;

// // Mock Prisma
// const prismaMock = {
//   subscriptionPlan: {
//     findUnique: jest.fn(),
//   },
//   paymentOrder: {
//     create: jest.fn(),
//     findUnique: jest.fn(),
//     update: jest.fn(),
//   },
//   subscription: {
//     upsert: jest.fn(),
//     findUnique: jest.fn(),
//     update: jest.fn(),
//   },
// };

// describe('VivaService', () => {
//   let service: VivaService;

//   beforeEach(async () => {
//     const module: TestingModule = await Test.createTestingModule({
//       providers: [
//         VivaService,
//         { provide: PrismaService, useValue: prismaMock },
//       ],
//     }).compile();

//     service = module.get<VivaService>(VivaService);

//     // Clear mocks
//     jest.clearAllMocks();
//   });

//   it('should create a new order', async () => {
//     prismaMock.subscriptionPlan.findUnique.mockResolvedValue({
//       id: 'plan1',
//       name: 'Basic Plan',
//       basePrice: 100,
//       vatRate: 0.2,
//       durationMonths: 1,
//     });

//     mockedAxios.post.mockResolvedValue({
//       data: { OrderCode: 12345 },
//     });

//     prismaMock.paymentOrder.create.mockResolvedValue({});

//     const result = await service.createOrder('user1', 'plan1');

//     expect(result.checkoutUrl).toContain('ref=12345');
//     expect(prismaMock.paymentOrder.create).toHaveBeenCalled();
//     expect(mockedAxios.post).toHaveBeenCalled();
//   });

//   it('should verify and activate subscription', async () => {
//     prismaMock.paymentOrder.findUnique.mockResolvedValue({
//       userId: 'user1',
//       planId: 'plan1',
//       status: 'PENDING',
//       orderCode: 12345,
//     });

//     mockedAxios.get.mockResolvedValue({
//       data: { StatusId: 'F' },
//     });

//     prismaMock.subscriptionPlan.findUnique.mockResolvedValue({
//       id: 'plan1',
//       basePrice: 100,
//       vatRate: 0.2,
//       durationMonths: 1,
//     });

//     prismaMock.subscription.upsert.mockResolvedValue({});
//     prismaMock.paymentOrder.update.mockResolvedValue({});

//     await service.verifyAndActivate(12345, 'tx123');

//     expect(prismaMock.subscription.upsert).toHaveBeenCalled();
//     expect(prismaMock.paymentOrder.update).toHaveBeenCalledWith({
//       where: { orderCode: 12345 },
//       data: { status: 'SUCCEEDED', transactionId: 'tx123' },
//     });
//   });

//   it('should cancel a subscription', async () => {
//     prismaMock.subscription.findUnique.mockResolvedValue({
//       userId: 'user1',
//       status: 'ACTIVE',
//     });

//     prismaMock.subscription.update.mockResolvedValue({});

//     const result = await service.cancelSubscription('user1');

//     expect(result.message).toBe('Subscription cancelled');
//     expect(prismaMock.subscription.update).toHaveBeenCalledWith({
//       where: { userId: 'user1' },
//       data: expect.objectContaining({ status: 'CANCELLED' }),
//     });
//   });

//   it('should throw if plan not found', async () => {
//     prismaMock.subscriptionPlan.findUnique.mockResolvedValue(null);

//     await expect(service.createOrder('user1', 'plan1')).rejects.toThrow(BadRequestException);
//   });

//   it('should throw if no active subscription on cancel', async () => {
//     prismaMock.subscription.findUnique.mockResolvedValue(null);

//     await expect(service.cancelSubscription('user1')).rejects.toThrow(BadRequestException);
//   });
// });