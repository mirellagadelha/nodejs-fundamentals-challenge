import { EntityRepository, Repository } from 'typeorm';

import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

@EntityRepository(Transaction)
class TransactionsRepository extends Repository<Transaction> {
  public async getBalance(): Promise<Balance> {
    const transactions = await this.find();

    const { income, outcome } = transactions.reduce(
      (accumulator, transaction) => {
        const newAccumulator = accumulator;
        switch (transaction.type) {
          case 'income':
            newAccumulator.income += Number(transaction.value);
            break;
          case 'outcome':
            newAccumulator.outcome += Number(transaction.value);
            break;
          default:
            break;
        }
        return newAccumulator;
      },
      {
        income: 0,
        outcome: 0,
        total: 0,
      },
    );

    const total = income - outcome;

    return { income, outcome, total };
  }
}

export default TransactionsRepository;
