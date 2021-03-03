import TransactionsRepository from '../repositories/TransactionsRepository';
import Transaction from '../models/Transaction';

interface RequestDTO {
  title: string;
  value: number;
  type: 'income' | 'outcome';
}

class CreateTransactionService {
  private transactionsRepository: TransactionsRepository;

  constructor(transactionsRepository: TransactionsRepository) {
    this.transactionsRepository = transactionsRepository;
  }

  public execute({ title, value, type }: RequestDTO): Transaction {
    const { total } = this.transactionsRepository.getBalance();

    if (!['income', 'outcome'].includes(type)) {
      throw Error('Type transaction invalid.');
    }

    if (total < value && type === 'outcome') {
      throw Error('Unauthorized transaction. Insufficient funds.');
    }

    const transfer = this.transactionsRepository.create({
      title,
      value,
      type,
    });
    return transfer;
  }
}

export default CreateTransactionService;
