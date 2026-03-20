import { MockTestModel } from './mocks.model';
import type { MockTest } from '@gate/shared-types';
import type { CreateMockTestInput } from './mocks.types';

export class MocksService {
  async createTest(userId: string, dto: CreateMockTestInput): Promise<MockTest> {
    const date = dto.date ?? new Date().toISOString().slice(0, 10);
    const test = await MockTestModel.create({ ...dto, userId, date });
    return test.toObject() as MockTest;
  }

  async getTests(
    userId: string,
    page = 1,
    limit = 20
  ): Promise<{ data: MockTest[]; total: number }> {
    const [data, total] = await Promise.all([
      MockTestModel.find({ userId })
        .sort({ date: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean<MockTest[]>(),
      MockTestModel.countDocuments({ userId }),
    ]);
    return { data, total };
  }

  async getTestById(id: string, userId: string): Promise<MockTest | null> {
    return MockTestModel.findOne({ _id: id, userId }).lean<MockTest>();
  }

  async deleteTest(id: string, userId: string): Promise<boolean> {
    const result = await MockTestModel.deleteOne({ _id: id, userId });
    return result.deletedCount > 0;
  }

  async getAllForUser(userId: string): Promise<MockTest[]> {
    return MockTestModel.find({ userId }).sort({ date: -1 }).lean<MockTest[]>();
  }
}

export const mocksService = new MocksService();
