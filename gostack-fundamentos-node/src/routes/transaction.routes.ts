import { Router } from 'express';

import TransactionsRepository from '../repositories/TransactionsRepository';
import CreateTransactionService from '../services/CreateTransactionService';

const transactionRouter = Router();

const transactionsRepository = new TransactionsRepository();

transactionRouter.get('/', (request, response) => {
  const transactions = transactionsRepository.all();
  const balance = transactionsRepository.getBalance();

  return response.status(200).json({ transactions, balance });
});

transactionRouter.post('/', (request, response) => {
  try {
    const { title, value, type } = request.body;

    const CreateTransiction = new CreateTransactionService(
      transactionsRepository,
    );

    const transaction = CreateTransiction.execute({ title, value, type });

    return response.status(200).json(transaction);
  } catch (err) {
    return response.status(400).json({ error: err.message });
  }
});

export default transactionRouter;
